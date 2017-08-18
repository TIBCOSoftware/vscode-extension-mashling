'use strict';
import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as https from 'https';
import { workspace, Disposable, ExtensionContext, DocumentFilter, HoverProvider, TextDocument, Position, Hover, MarkedString, CancellationToken, StatusBarItem, StatusBarAlignment } from 'vscode';
import { MASHLING_MODE } from './MashlingMode';
import { MashlingCompletionItemProvider } from './MashlingCompletions';

const MEDIA_TYPE_RAW = 'application/vnd.github.v3.raw+json';
const REPO = 'TIBCOSoftware/mashling-cli';
const GITHUB_TOKEN = "9b637d51c1b5504959f40b73914007268070b191";


export function activate(context: ExtensionContext) {
	//get terminal window
	let terminal = vscode.window.createTerminal('mashling-cli');
	let _statusBarItem: StatusBarItem;
	// getRepoContents("schema/gateway_schema.json").then(val => {
	// 	writeJsonFile("q:/vscode-mashling-extension/MashlingJsonSchemas/test.json", val);
	// });
	//Register all the commands
	registerCommands();

	function registerCommands() {

		context.subscriptions.push(vscode.commands.registerCommand('mashling.createSampleGateway', () => {
			createSampleGateway();
		}));

		context.subscriptions.push(vscode.commands.registerCommand('mashling.createGatewayUsingGatewayDescriptor', () => {
			createGatewayUsingGatewayDescriptor();
		}));

		context.subscriptions.push(vscode.commands.registerCommand('mashling.installMashling', () => {
			installMashling();
		}));

		context.subscriptions.push(vscode.commands.registerCommand('mashling.updateMashling', () => {
			updateMashling();
		}));

		context.subscriptions.push(vscode.commands.registerCommand('mashling.generateSampleDescriptor', () => {
			generateSampleDescriptor();
		}));

	}

	function createSampleGateway() {
		vscode.window.showInputBox({ prompt: 'Enter the path where mashling app should be created' })
			.then(function (path) {
				var driveName = path.split(':')[0] + ':';
				terminal.show(true);
				terminal.sendText(driveName);
				terminal.sendText('cd ' + path);
				vscode.window.showInputBox({ prompt: 'Enter the application name' })
					.then(function (appName) {
						terminal.show(true);
						terminal.sendText('mashling create ' + appName);
						vscode.window.showInformationMessage("Sample Gateway is being created. Refer to command prompt for more info");
					});
			});
	}

	function createGatewayUsingGatewayDescriptor() {
		let activeDocPath = vscode.window.activeTextEditor.document.uri.path;
		let openedFileName = path.basename(activeDocPath) //activeDocPath.substring(activeDocPath.lastIndexOf('/') + 1);
		if (openedFileName.endsWith("mashling.json")) {
			//TODO: check if schema of open file is valid		
			var winOSFilePathSeparator = "\\";
			if (path.sep === winOSFilePathSeparator) {
				var activeDirName = path.dirname(activeDocPath).substring(1);
				let drivename = activeDirName.split(":")[0];
				terminal.sendText(drivename + ":");
			} else {
				var activeDirName = path.dirname(activeDocPath);
			}
			terminal.sendText('cd ' + activeDirName);
			vscode.window.showInputBox({ prompt: 'Enter the application name' })
				.then(function (appName) {
					terminal.show(true);
					terminal.sendText("mashling create -f " + openedFileName + " " + appName);
					vscode.window.showInformationMessage("Gateway is being created. Refer to command prompt for more info");
				});
		} else {
			vscode.window.showErrorMessage("Please go to the mashling descriptor file window to run the create app");
		}

	}

	function installMashling() {
		terminal.show(true);
		terminal.sendText("go get github.com/TIBCOSoftware/mashling-cli/...");
	}

	function updateMashling() {
		terminal.show(true);
		terminal.sendText("go get -u github.com/TIBCOSoftware/mashling-cli/...");
	}

	function generateSampleDescriptor() {
		let documentContentLength = vscode.window.activeTextEditor.document.getText().toString().trim().length;
		vscode.window.showQuickPick(["Kafka to Kafka", "Kafka to Rest", "Rest to Kafka"]).then(selectedConfig => {
			let jsonUrls = {
				"Kafka to Kafka" : "KafkaTrigger-To-KafkaActivity-mashling.json",
				"Kafka to Rest": "KafkaTrigger-To-RestActivity-mashling.json",
				"Rest to Kafka": "RestTrigger-To-KafkaActivity-mashling.json"
			}
			if (documentContentLength > 0) {
				vscode.window.showWarningMessage("The contents of the opened file will get replaced with new data. Are you sure you want to go ahead?",
					{ title: "Yes" }, { title: "No" }).then(val => {
						if (val.title === "Yes") {
							loadJSONContent(jsonUrls[selectedConfig]);
						} else {
							vscode.window.showInformationMessage("Please open an empty file where you want to place the content of sample file and try again");
						}
					})
			} else {
				loadJSONContent(jsonUrls[selectedConfig]);
			}
		})
	}

	function getRepoContents(contentsPath) {
		let reqOptions = {
			protocol: 'https:',
			hostname: 'api.github.com',
			path: `/repos/${REPO}/contents/${contentsPath}`,
			headers: {
				'User-Agent': 'fg-testing'
			}
		};

		reqOptions.headers['Accept'] = MEDIA_TYPE_RAW;

		if (GITHUB_TOKEN) {
			reqOptions.headers['Authorization'] = `token ${GITHUB_TOKEN}`;
		}
		return getJSONData(reqOptions);

	}

	function loadJSONContent(jsonFile : string) {
		let statusBar = vscode.window.createStatusBarItem(StatusBarAlignment.Left);
		statusBar.text = `$(dashboard) Loading JSON`;
		statusBar.show();
		getRepoContents("samples/" + jsonFile).then(val => {
			writeJsonFile(vscode.window.activeTextEditor.document.uri.path.slice(1), val);
			statusBar.text = `Successfully loaded $(thumbsup)`;
			setTimeout(function () {
				statusBar.hide();
			}, 2000);
		})
	}

	function getJSONData(reqOptions) {
		return new Promise((resolve, reject) => {
			https.get(reqOptions, response => {
				var body = '';
				response.on('data', function (d) {
					body += d;
				});
				response.on('end', function () {
					try {
						resolve(body);
					} catch (e) {
						console.log(e);
						reject(new Error(e));
					}
				});
			}).on('error', (e) => {
				console.log("Error ", e);
				reject(new Error());
			});
		});
	}

	function writeJsonFile(target, contents) {
		return new Promise(function (resolve, reject) {
			fs.writeFile(target, contents, function (err) {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(MASHLING_MODE, new MashlingCompletionItemProvider(), ':', '\"'));
}
