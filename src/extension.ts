/*---------------------------------------------------------
 * Vanilla BLoC VSCode Extension
 *
 * extension.ts
 * Created  20/05/2020.
 * Updated  20/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as _ from "lodash";
import * as changeCase from "change-case";
import * as mkdirp from "mkdirp";
import { existsSync, lstatSync, writeFile } from "fs";
///
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	//
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vanilla-bloc" is now active!');
	//
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vanilla-bloc.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Vanilla BLoC!');
	});
	//
	context.subscriptions.push(disposable);
	///
	let newBloc = vscode.commands.registerCommand('vanilla-bloc.new-bloc', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Vanilla BLoC!');
	});
	//
	context.subscriptions.push(newBloc);
	///
}
//
// this method is called when your extension is deactivated
export function deactivate() {}
//
function createDirectory(targetDirectory: string): Promise<void> {
	return new Promise((resolve, reject) => {
	  mkdirp(targetDirectory, error => {
		if (error) {
		  return reject(error);
		}
		resolve();
	  });
	});
  }
//
function createBlocTemplate(blocName: string, targetDirectory: string, ) {
	const snakeCaseBlocName = changeCase.snakeCase(blocName.toLowerCase());
	const targetPath = `${targetDirectory}/bloc/${snakeCaseBlocName}_bloc.dart`;
	if (existsSync(targetPath)) {
	  throw Error(`${snakeCaseBlocName}_bloc.dart already exists`);
	}
	return new Promise(async (resolve, reject) => {
	  writeFile(targetPath, getBlocTemplate(blocName), "utf8", error => {
		if (error) {
		  reject(error);
		  return;
		}
		resolve();
	  });
	});
}