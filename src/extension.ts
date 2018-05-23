'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { workspace, Disposable, ExtensionContext, DocumentFilter, HoverProvider, TextDocument, Position, Hover, MarkedString, CancellationToken } from 'vscode';

export function activate(context: ExtensionContext) {
	// Copy strings
	const gatewayBuildInfoMsg = "Build is in progress. Please refer to command prompt for more info";
	const InstallationInfoMsg = "Mashling Installation is in progress. Please refer to command prompt for more info";
	const UpdateInfoMsg = "Mashling Update is in progress. Please refer to command prompt for more info";
	const installOrUpdateMashlingCmd = "go get -u github.com/TIBCOSoftware/mashling/...";
	const BuildMashlingCmd = "go run build.go buildgateway";
	const RunMashlingCmd = "mashling-gateway -c ";
	const goPathError = "GOPATH not set";
	const runInfoMsg = "Running mashling-gateway with provided config. Please refer to command prompt for more info";
	const runErrorMsg = "Please go to the path where gateway configuration file is kept";
	//get terminal window
	let terminal = vscode.window.createTerminal('mashling-cli');
	let pathSep = path.sep;
	let windowsPathSep = "\\";
	let v1ExtensionId = 'tbhatia.mashling-support';
	let ext = vscode.extensions.getExtension(v1ExtensionId);
	if (ext) {
		detectAnduninstallOlderVersion();
	}
	//Register all the commands

	registerCommands();

	function registerCommands() {

		context.subscriptions.push(vscode.commands.registerCommand('mashling.runMashlingGateway', () => {
			runMashlingGateway();
		}));

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

	function runMashlingGateway() {
		let activeDocPath = vscode.window.activeTextEditor.document.uri.path;
		let openedFileName = path.basename(activeDocPath);
		let dirname = path.dirname(activeDocPath);
		if (pathSep == windowsPathSep) {
			dirname = dirname.substring(1);
		}
		if (openedFileName.endsWith("mashling.json")) {
			terminal.show(true);
			terminal.sendText('cd ' + dirname);
			terminal.sendText(RunMashlingCmd + openedFileName);
			vscode.window.showInformationMessage(runInfoMsg);
		} else {
			vscode.window.showErrorMessage(runErrorMsg);
		}
	}

	function buildMashling() {
		let gopath = process.env.GOPATH;
		if (gopath) {
			let mashlingPath = gopath + '/src/github.com/TIBCOSoftware/mashling/';
			console.log(gopath);
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
		if (cmd == 'install') {
			infoMsg = InstallationInfoMsg;
		} else {
			infoMsg = UpdateInfoMsg;
		}
		terminal.show(true);
		terminal.sendText(installOrUpdateMashlingCmd);
		vscode.window.showInformationMessage(infoMsg);
	}

	function detectAnduninstallOlderVersion() {
		var terminalU = vscode.window.createTerminal('uninstall');
		terminalU.sendText("code --uninstall-extension " + v1ExtensionId);
		setTimeout(function () {
			vscode.window.showInformationMessage("Older version of mashling extension removed. Reload Now to activate.", { title: 'Reload Now' }).then(function (val) {
				if (val.title == 'Reload Now') {
					vscode.commands.executeCommand("workbench.action.reloadWindow");
				}
			});
		}, 1000);
	}

}
