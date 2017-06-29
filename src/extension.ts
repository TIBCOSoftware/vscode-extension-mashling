'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { workspace, Disposable, ExtensionContext, DocumentFilter, HoverProvider, TextDocument, Position, Hover, MarkedString, CancellationToken } from 'vscode';
import { MASHLING_MODE } from './MashlingMode';
import { MashlingCompletionItemProvider } from './MashlingCompletions';

export function activate(context: ExtensionContext) {
	//get terminal window
	let terminal = vscode.window.createTerminal('mashling-cli');
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
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(MASHLING_MODE, new MashlingCompletionItemProvider(), ':', '\"'));
}
