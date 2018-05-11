'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { workspace, Disposable, ExtensionContext, DocumentFilter, HoverProvider, TextDocument, Position, Hover, MarkedString, CancellationToken } from 'vscode';
import { MASHLING_MODE } from './MashlingMode';

export function activate(context: ExtensionContext) {
	// Copy strings
	const gatewayBuildInfoMsg = "Build is in progress. Refer to command prompt for more info";
	const InstallationInfoMsg = "Mashling Installation is in progress. Refer to command prompt for more info";
	const UpdateInfoMsg = "Mashling Update is in progress. Refer to command prompt for more info";
	const installOrUpdateMashlingCmd = "go get -u github.com/TIBCOSoftware/mashling/...";
	const BuildMashlingCmd = 'go run build.go buildgateway';
	const goPathError = "GOPATH not set";
	//get terminal window
	let terminal = vscode.window.createTerminal('mashling-cli');
	//Register all the commands

	registerCommands();

	function registerCommands() {

		context.subscriptions.push(vscode.commands.registerCommand('mashling.buildMashling', () => {
			buildMashling();
		}));

		context.subscriptions.push(vscode.commands.registerCommand('mashling.installMashling', () => {
			installOrUpdateMashling('install');
		}));

		context.subscriptions.push(vscode.commands.registerCommand('mashling.updateMashling', () => {
			installOrUpdateMashling('update');
		}));

	}

	function buildMashling() {
		let gopath = process.env.GOPATH;
		if(gopath){
			let mashlingPath = gopath + '/src/github.com/TIBCOSoftware/mashling/'; 
			terminal.sendText('cd ' + mashlingPath);
			terminal.show(true);
			terminal.sendText(BuildMashlingCmd);
			vscode.window.showInformationMessage(gatewayBuildInfoMsg);
		} else {
			vscode.window.showErrorMessage(goPathError);
		}		
	}


	function installOrUpdateMashling(cmd) {
		var infoMsg;
		if(cmd == 'install'){
			infoMsg = InstallationInfoMsg;
		} else{
			infoMsg = UpdateInfoMsg;
		}
		terminal.show(true);
		terminal.sendText(installOrUpdateMashlingCmd);
		vscode.window.showInformationMessage(infoMsg);
	}
}
