import * as vscode from 'vscode';
import { suggestionsObject } from './MashlingCompletionDefinitions';
import { CompletionItemKind } from 'vscode';
import { removeQuotesfromString, removeWhiteSpacesfromString } from './utils';

export class MashlingCompletionItemProvider implements vscode.CompletionItemProvider {
	public provideCompletionItems(
		document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken):
		Thenable<vscode.CompletionItem[]> {
		return GetCompletionsInfo(document, position).then(completionInfo => {
			return completionInfo;
		}, () => {
			return null;
		});
	}
}

export function GetCompletionsInfo(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.CompletionItem[]> {
	let wordRange = document.getWordRangeAtPosition(position);
	let lineText = document.lineAt(position.line).text;
	let filteredSuggestions;
	if (lineText.indexOf(':') == -1) {
	} else {
		let propertyName = removeQuotesfromString(lineText.split(':')[0]);
		propertyName = removeWhiteSpacesfromString(propertyName);
		filteredSuggestions = suggestionsObject.filter(n => n.data == propertyName);
	}

	return Promise.resolve(filteredSuggestions);
}