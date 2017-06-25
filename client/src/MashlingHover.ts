import * as vscode from 'vscode';
import { HoverDefinitions } from './MashlingHoverDefinitions';
import { workspace, Disposable, ExtensionContext, DocumentFilter, HoverProvider, TextDocument, Position, Hover, MarkedString, CancellationToken } from 'vscode';
import { removeQuotesfromString } from './utils';

export interface MashlingDefinitionInformation {
	info: string;
}

export class MashlingHoverProvider implements HoverProvider {

	public provideHover(document: TextDocument, position: Position, token: CancellationToken): Thenable<Hover> {
		console.log("Inside Hover provider");
		return GetHoverInfo(document, position).then(definitionInfo => {
			let hoverTexts: MarkedString[] = [];
			if (definitionInfo.info){
				hoverTexts.push({ language: 'yaml', value: definitionInfo.info });
				let hover = new Hover(hoverTexts);
				return hover;
			}
		}, () => {
			return null;
		});
	}
}

export function GetHoverInfo(document: vscode.TextDocument, position: vscode.Position): Promise<MashlingDefinitionInformation> {
	let wordRange = document.getWordRangeAtPosition(position);
	let lineText = document.lineAt(position.line).text;
	let word = wordRange ? document.getText(wordRange) : '';
	let text = removeQuotesfromString(word);
	return Promise.resolve({info : HoverDefinitions[text]});
}