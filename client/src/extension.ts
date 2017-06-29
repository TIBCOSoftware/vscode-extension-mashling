/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { workspace, languages, ExtensionContext, extensions, Uri } from 'vscode';
import { MASHLING_MODE } from './MashlingMode';
import { GetHoverInfo, MashlingHoverProvider } from './MashlingHover';
import { MashlingCompletionItemProvider } from './MashlingCompletions';
import { LanguageClient, LanguageClientOptions, SettingMonitor, RequestType, ServerOptions, TransportKind, NotificationType } from 'vscode-languageclient';
// import TelemetryReporter from 'vscode-extension-telemetry';

namespace TelemetryNotification {
	export const type: NotificationType<{ key: string, data: any }> = { get method() { return 'telemetry'; } };
}

namespace VSCodeContentRequest {
	export const type: RequestType<string, string, any> = { get method() { return 'vscode/content'; } };
}

export interface ISchemaAssociations {
	[pattern: string]: string[];
}

namespace SchemaAssociationNotification {
	export const type: NotificationType<ISchemaAssociations> = { get method() { return 'json/schemaAssociations'; } };
}

interface IPackageInfo {
	name: string;
	version: string;
	aiKey: string;
}

//get terminal window
let terminal = vscode.window.createTerminal('mashling-cli');

export function activate(context: ExtensionContext) {

	let packageInfo = getPackageInfo(context);
	// let telemetryReporter: TelemetryReporter = packageInfo && new TelemetryReporter(packageInfo.name, packageInfo.version, packageInfo.aiKey);

	// Resolve language ids to pass around as initialization data
	languages.getLanguages().then(languageIds => {

		// The server is implemented in node
		let serverModule = context.asAbsolutePath(path.join('server', 'server.js'));
		// The debug options for the server
		let debugOptions = { execArgv: ['--nolazy', '--debug=6004'] };

		// If the extension is launch in debug mode the debug server options are use
		// Otherwise the run options are used
		let serverOptions: ServerOptions = {
			run: { module: serverModule, transport: TransportKind.ipc },
			debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
		};

		// Options to control the language client
		let clientOptions: LanguageClientOptions = {
			// Register the server for yaml documents
			documentSelector: ['yaml'],
			synchronize: {
				configurationSection: ['json.schemas', 'http.proxy', 'http.proxyStrictSSL', 'languageServerYamlSchema'],
				// fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
				fileEvents: workspace.createFileSystemWatcher('**/.yaml')
			},
			initializationOptions: {
				languageIds
			}
		};

		// Create the language client and start the client.
		let client = new LanguageClient('Language Server YAML Schema', serverOptions, clientOptions);
		client.onNotification(TelemetryNotification.type, e => {
			// if (telemetryReporter) {
			// 	telemetryReporter.sendTelemetryEvent(e.key, e.data);
			// }
		});

		// handle content request
		client.onRequest(VSCodeContentRequest.type, (uriPath: string) => {
			let uri = Uri.parse(uriPath);
			return workspace.openTextDocument(uri).then(doc => {
				console.log(doc.getText());
				return doc.getText();
			}, error => {
				return Promise.reject(error);
			});
		});

		let disposable = client.start();

		client.sendNotification(SchemaAssociationNotification.type, getSchemaAssociation(context));

		// Push the disposable to the context's subscriptions so that the
		// client can be deactivated on extension deactivation
		context.subscriptions.push(disposable);

		languages.setLanguageConfiguration('yaml', {
			comments: {
				"lineComment": "#"
			},
			"brackets": [
				["{", "}"],
				["[", "]"],
				["(", ")"]
			],
			onEnterRules: [{
				beforeText: new RegExp("  - "),
				action: {
					indentAction: 1
				}
			}]
		});
	});

	/**********************************************************************************************************/
	/* Changes to automate configuration update in settings.json file--INCOMPLETE */

	// let uri = workspace.rootPath + "\\.vscode\\settings.json";
	// // console.log(workspace.textDocuments);
	// workspace.openTextDocument(uri).then(doc => {
	// 	console.log(doc.getText());
	// })
	/*********************************************************************************************************/

	function registerCommands() {

		var disposable = vscode.commands.registerCommand('mashling.createSampleGateway', function () {
			createSampleGateway();
		});

		var disposable = vscode.commands.registerCommand('mashling.createGatewayUsingGatewayDescriptor', function () {
			createGatewayUsingGatewayDescriptor();
		});

		var disposable = vscode.commands.registerCommand('mashling.installMashling', function () {
			installMashling();
		});

		var disposable = vscode.commands.registerCommand('mashling.updateMashling', function () {
			updateMashling();
		});

		// Push the disposable to the context's subscriptions
		context.subscriptions.push(disposable);
	}

	context.subscriptions.push(vscode.languages.registerHoverProvider(MASHLING_MODE, new MashlingHoverProvider()));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(MASHLING_MODE, new MashlingCompletionItemProvider(), ':'));
}

function createSampleGateway() {

	let activeDocPath = vscode.window.activeTextEditor.document.uri.path;
	activeDocPath = activeDocPath.substring(1, activeDocPath.length);
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
				});
		});
}


function createGatewayUsingGatewayDescriptor() {

	let activeDocPath = vscode.window.activeTextEditor.document.uri.path;
	let openedFileName = activeDocPath.substring(activeDocPath.lastIndexOf('/') + 1, activeDocPath.length);
	if (openedFileName == "mashling.json") {
		activeDocPath = activeDocPath.substring(1, activeDocPath.lastIndexOf('/'));
		var driveName = activeDocPath.split(':')[0] + ':';
		terminal.sendText(driveName);
		terminal.sendText('cd ' + activeDocPath);
		vscode.window.showInputBox({ prompt: 'Enter the application name' })
			.then(function (appName) {
				terminal.show(true);
				terminal.sendText("mashling create -f mashling.json " + appName);
				vscode.window.showInformationMessage("Gateway is being created. Refer to command prompt for more info");
			});
		// terminal.processId.then(id =>
		// 	vscode.window.showInformationMessage(id + "is in progress")
		// );
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


function getSchemaAssociation(context: ExtensionContext): ISchemaAssociations {
	let associations: ISchemaAssociations = {};
	extensions.all.forEach(extension => {
		let packageJSON = extension.packageJSON;
		if (packageJSON && packageJSON.contributes && packageJSON.contributes.jsonValidation) {
			let jsonValidation = packageJSON.contributes.jsonValidation;
			if (Array.isArray(jsonValidation)) {
				jsonValidation.forEach(jv => {
					let { fileMatch, url } = jv;
					if (fileMatch && url) {
						if (url[0] === '.' && url[1] === '/') {
							url = Uri.file(path.join(extension.extensionPath, url)).toString();
						}
						if (fileMatch[0] === '%') {
							fileMatch = fileMatch.replace(/%APP_SETTINGS_HOME%/, '/User');
						} else if (fileMatch.charAt(0) !== '/' && !fileMatch.match(/\w+:\/\//)) {
							fileMatch = '/' + fileMatch;
						}
						let association = associations[fileMatch];
						if (!association) {
							association = [];
							associations[fileMatch] = association;
						}
						association.push(url);
					}
				});
			}
		}
	});
	return associations;
}

function getPackageInfo(context: ExtensionContext): IPackageInfo {
	let extensionPackage = require(context.asAbsolutePath('./package.json'));
	if (extensionPackage) {
		return {
			name: extensionPackage.name,
			version: extensionPackage.version,
			aiKey: extensionPackage.aiKey
		};
	}
	return null;
}