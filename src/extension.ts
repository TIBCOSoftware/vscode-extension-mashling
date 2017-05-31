'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { workspace, Disposable, ExtensionContext, DocumentFilter, HoverProvider, TextDocument, Position, Hover, MarkedString, CancellationToken } from 'vscode';
import { MASHLING_MODE } from './MashlingMode';
// import { GetHoverInfo, MashlingHoverProvider } from './MashlingHover';
import { MashlingCompletionItemProvider } from './MashlingCompletions';

export function activate(context: ExtensionContext) {
	//get terminal window
	let terminal = vscode.window.createTerminal('mashling-cli');
	//Register all the commands

	registerCommands();

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
	// context.subscriptions.push(vscode.languages.registerHoverProvider(MASHLING_MODE, new MashlingHoverProvider()));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(MASHLING_MODE, new MashlingCompletionItemProvider(), ':', '\"'));
}
