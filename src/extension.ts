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

		var disposable = vscode.commands.registerCommand('mashling.createGateway', function () {
			createGateway();
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

	function createGateway() {

		let activeDocPath = vscode.window.activeTextEditor.document.uri.path;
		activeDocPath = activeDocPath.substring(1, activeDocPath.length);
		let appName = vscode.window.showInputBox({ prompt: 'Enter the mashling app name' }).then(val => runCommand(val));
		function runCommand(appName) {
			terminal.show(true);
			terminal.sendText('mashling create ' + appName);
		};

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
