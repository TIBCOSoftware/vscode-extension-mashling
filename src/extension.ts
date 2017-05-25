'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { workspace, Disposable, ExtensionContext, DocumentFilter, HoverProvider, TextDocument, Position, Hover, MarkedString, CancellationToken } from 'vscode';
import { MASHLING_MODE } from './MashlingMode';
// import { GetHoverInfo, MashlingHoverProvider } from './MashlingHover';
import { MashlingCompletionItemProvider } from './MashlingCompletions';

export function activate(context: ExtensionContext) {
	//Register all the commands

	registerCommands();
	
	function registerCommands() {

		let disposable = vscode.commands.registerCommand('mashling.createGateway', function () {
			createGateway();
		});
		// Push the disposable to the context's subscriptions
		context.subscriptions.push(disposable);
	}

	function createGateway() {

		let terminal = vscode.window.createTerminal('mashling-cli');
		let activeDocPath = vscode.window.activeTextEditor.document.uri.path;
		activeDocPath = activeDocPath.substring(1,activeDocPath.length);
		terminal.show(true);
		terminal.sendText('copy ' + activeDocPath + ' C:/Users/tbhatia/mashling-extensions/vscode-mashling-extension/test.json');
	}
	// context.subscriptions.push(vscode.languages.registerHoverProvider(MASHLING_MODE, new MashlingHoverProvider()));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(MASHLING_MODE, new MashlingCompletionItemProvider(), ':', '\"'));
}
