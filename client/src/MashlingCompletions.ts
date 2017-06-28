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
	filteredSuggestions = getSuggestions(document, position);
	return Promise.resolve(filteredSuggestions);
}

function getSuggestions(doc: vscode.TextDocument, pos: vscode.Position) {
	let level;
	let lineText = textAtLine(doc, pos.line);
	//Check if first line
	if (pos.line == 0) {
		level = 0;
		return suggestionsObject.filter(n => parseInt(n.detail[0]) == 0);
	}
	//line 2
	if (pos.line == 1 && lineText.search(/\S|$/) == lineText.length && lineText.length == 2) {
		level = 1;
		return suggestionsObject.filter(n => parseInt(n.filterText) == 1 && n.kind == 9);
	}
	//Not first line and empty line
	if (pos.line > 1) {
		//If empty line
		if (lineText.length == 0) {
			let previousLineText = textAtLine(doc, pos.line - 1);
			level = computePropertyLevel(previousLineText.search(/\S|$/));
		}
		//if line contains spaces
		else if (lineText.search(/\S|$/) == lineText.length && lineText.length == 2) {
			level = 1;
			let previousProperties = getAllPropertiesAtLevel1(doc);
			return suggestionsObject.filter(n => parseInt(n.filterText) == level && n.kind == 9 && previousProperties.indexOf(n.label) == -1);
		}
		//if line contains spacers or scalars
		else if (lineText.match(/[ -]+/i)[0].length === lineText.length && lineText.length > 2) {
			let sequenceStart = lineText.match(/[ -]+/i)[0];
			level = computePropertyLevel(sequenceStart.length);
			let parentProperty = getParentProperty(doc, pos.line);
			let otherPropertiesAtSameLevel = [];
			if (sequenceStart.indexOf("-") !== -1) {
				otherPropertiesAtSameLevel = [];
				return suggestionsObject.filter(n => n.filterText == parentProperty);
			} else {
				otherPropertiesAtSameLevel = getOtherPropertiesAtSameLevel(doc, pos.line);
				return suggestionsObject.filter(n => n.filterText == parentProperty && otherPropertiesAtSameLevel.indexOf(n.label) == -1);
			}
		}

	}

}


function textAtLine(doc, lineNumber): String {
	return doc.lineAt(lineNumber).text;
}

function computePropertyLevel(spaces) {
	let level;
	switch (spaces) {
		case 2:
			level = 1
			break;
		case 4:
			level = 2
			break;
		case 6:
			level = 3
			break;
		default:
			level = 0;
	}
	return level;
}

function getAllPropertiesAtLevel1(doc: vscode.TextDocument): String[] {
	var res = [];
	for (let i = doc.lineCount - 1; i >= 1; i--) {
		res.push(textAtLine(doc, i).trim().split(":")[0]);
	}
	return res.filter(Boolean);
};

function getOtherPropertiesAtSameLevel(doc: vscode.TextDocument, lineNumber): String[] {
	var res = [];
	let lineTextAtStart = textAtLine(doc, lineNumber).match(/[ -]+/i)[0];
	let currentPropertylevel = computePropertyLevel(lineTextAtStart.length);
	//Check for previous properties at same level
	let newPrevLevel = currentPropertylevel;
	let i = lineNumber - 1;
	while (newPrevLevel >= currentPropertylevel) {
		if(textAtLine(doc, i).match(/[ -]+/i)[0].indexOf("-") == textAtLine(doc, i).match(/[ -]+/i)[0].length - 2){
			res.push(textAtLine(doc, i).match(/[^ -]+/i)[0].split(":")[0]);
			break;
		}
		if (newPrevLevel == currentPropertylevel) {
			res.push(textAtLine(doc, i).match(/[^ -]+/i)[0].split(":")[0]);
		}
		newPrevLevel = computePropertyLevel(textAtLine(doc, i - 1).match(/[ -]+/i)[0].length);
		i--;
	}
	//Check for next properties at same level
	
	return res;
}

function getParentProperty(doc: vscode.TextDocument, lineNumber): String {
	let currentPropertylevel = computePropertyLevel(textAtLine(doc, lineNumber).match(/[ -]+/i)[0].length);
	let newLevel = currentPropertylevel;
	let i = lineNumber;
	let parents = [];
	while (newLevel > 1) {
		newLevel = computePropertyLevel(textAtLine(doc, i).match(/[ -]+/i)[0].length);
		if(newLevel < currentPropertylevel){
			parents.unshift(textAtLine(doc, i).match(/[^ -]+/i)[0].split(":")[0]);
			currentPropertylevel = newLevel;
		}
		i--;
	}
	return parents.join(" ");
};