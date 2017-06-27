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
	filteredSuggestions = computePropertyIndentation(document, position);
	// if (lineText.indexOf(':') == -1) {
	// 	filteredSuggestions = suggestionsObject.filter(n => n.kind == 9);
	// } else {
	// 	let propertyName = removeQuotesfromString(lineText.split(':')[0]);
	// 	propertyName = removeWhiteSpacesfromString(propertyName);
	// 	// console.log("propertyName ", propertyName);
	// 	filteredSuggestions = suggestionsObject.filter(n => n.label == propertyName);
	// }

	return Promise.resolve(filteredSuggestions);
}

function computePropertyIndentation(doc: vscode.TextDocument, pos: vscode.Position) {
	let level;
	let lineText = textAtLine(doc, pos.line);
	console.log("Line number ", pos.line);
	//Check if first line
	if (pos.line == 0) {
		level = 0;
		return suggestionsObject.filter(n => parseInt(n.detail[0]) == 0);
	}
	// console.log("space count ", lineText.search(/\S|$/));
	//line 2
	if (pos.line == 1 && lineText.search(/\S|$/) == lineText.length && lineText.length == 2) {
		level = 1;
		return suggestionsObject.filter(n => parseInt(n.filterText) == 1 && n.kind == 9);
	}
	//Not first line and empty line
	if (pos.line > 1) {
		//compute Level
		//If empty line
		if (lineText.length == 0) {
			let previousLineText = textAtLine(doc, pos.line - 1);
			level = computePropertyLevel(previousLineText.search(/\S|$/));
		}
		else if (lineText.search(/\S|$/) == lineText.length && lineText.length == 2) {
			level = computePropertyLevel(2);
			let previousProperties = getAllPropertiesAtLevel1(doc);
			return suggestionsObject.filter(n => parseInt(n.filterText) == level && n.kind == 9 && previousProperties.indexOf(n.label) == -1);
		}
		else if (lineText.match(/[ -]+/i)[0].length === lineText.length && lineText.length > 2) {
			let sequenceStart = lineText.match(/[ -]+/i)[0];
			level = computePropertyLevel(sequenceStart.length);
			let parentProperty = getParentProperty(doc, pos.line);
			console.log("parent ", parentProperty);
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
	// let newNextLevel = currentPropertylevel;
	// let j = lineNumber + 1;
	// while (newNextLevel >= currentPropertylevel) {
	// 	console.log("while loop 2");
	// 	console.log("lineText length ", textAtLine(doc, j).length);
	// 	if (newNextLevel == currentPropertylevel) {
	// 		res.push(textAtLine(doc, j).match(/[^ -]+/i)[0].split(":")[0]);
	// 		console.log("res ", res);
	// 	}
	// 	newNextLevel = computePropertyLevel(textAtLine(doc, j + 1).match(/[ -]+/i)[0].length);
	// 	console.log("new next level ", newNextLevel);
	// 	j++;
	// }
	return res;
}

function getParentProperty(doc: vscode.TextDocument, lineNumber): String {
	let currentPropertylevel = computePropertyLevel(textAtLine(doc, lineNumber).match(/[ -]+/i)[0].length);
	let newLevel = currentPropertylevel;
	let i = lineNumber;
	let parents = [];
	while (newLevel >= currentPropertylevel) {
		newLevel = computePropertyLevel(textAtLine(doc, i - 1).match(/[ -]+/i)[0].length);
		i--;
	}
	// while (newLevel >= 1) {
	// 	newLevel = computePropertyLevel(textAtLine(doc, i - 1).match(/[ -]+/i)[0].length);
	// 	if(newLevel !== currentPropertylevel){
	// 		parents.push(textAtLine(doc, i).match(/[^ -]+/i)[0].split(":")[0]);
	// 	}
	// 	i--;
	// }
	return textAtLine(doc, i).match(/[^ -]+/i)[0].split(":")[0];
};