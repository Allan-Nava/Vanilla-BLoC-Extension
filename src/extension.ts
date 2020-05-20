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
import {
	commands,
	ExtensionContext,
	InputBoxOptions,
	OpenDialogOptions,
	Uri,
	window
  } from 'vscode';
import * as _ from "lodash";
import * as changeCase from "change-case";
import * as mkdirp from "mkdirp";
import { existsSync, lstatSync, writeFile } from "fs";
import { 
	getBlocTemplate,
	getBlocStateTemplate,
	getSnapshotTemplate
} from './templates';
///
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	//
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vanilla-bloc" is now active!');
	//
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	commands.registerCommand('vanilla-bloc.new-bloc', async (uri: Uri) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//window.showInformationMessage('Hello World from Vanilla BLoC!');
		console.log("vanilla-bloc.new-bloc");
		const blocName = await promptForBlocName();
		if (_.isNil(blocName) || blocName.trim() === "") {
			window.showErrorMessage("The bloc name must not be empty");
			return;
		}
		let targetDirectory;
		if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
			targetDirectory = await promptForTargetDirectory();
			if (_.isNil(targetDirectory)) {
				window.showErrorMessage("Please select a valid directory");
				return;
			}
		} else {
			targetDirectory = uri.fsPath;
		}
	});
	//
	///
	commands.registerCommand('vanilla-bloc.new-snapshot', async (uri: Uri) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//window.showInformationMessage('Hello World from Vanilla BLoC - Snapshot!');
		console.log("vanilla-bloc.new-snapshot");
		let targetDirectory;
		if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
			targetDirectory = await promptForTargetDirectory();
			if (_.isNil(targetDirectory)) {
				window.showErrorMessage("Please select a valid directory");
				return;
			}
		} else {
			targetDirectory = uri.fsPath;
		}
		try {
			await generateSnapShotCode( targetDirectory,);
			window.showInformationMessage(
			  `Successfully Generated Snapshot`
			);
		} catch (error) {
			window.showErrorMessage(
			  `Error:
			  ${error instanceof Error ? error.message : JSON.stringify(error)}`
			);
		}
	});
	//
	///
}
//
// this method is called when your extension is deactivated
export function deactivate() {}
//
function createDirectory(targetDirectory: string): Promise<void> {
	return new Promise((resolve, reject) => {
	  mkdirp(targetDirectory, { mode: '0777' }).then(made => {
		  if(made){
			  return reject(made);
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
///
function promptForBlocName(): Thenable<string | undefined> {
	const blocNamePromptOptions: InputBoxOptions = {
	  prompt: "Vanilla Bloc Name",
	  placeHolder: "counter"
	};
	return window.showInputBox(blocNamePromptOptions);
}
async function promptForTargetDirectory(): Promise<string | undefined> {
	console.log("promptForTargetDirectory()");
	const options: OpenDialogOptions = {
	  canSelectMany: false,
	  openLabel: "Select a folder to create the bloc in",
	  canSelectFolders: true
	};
  
	return window.showOpenDialog(options).then(uri => {
	  if (_.isNil(uri) || _.isEmpty(uri)) {
		return undefined;
	  }
	  return uri[0].fsPath;
	});
}
async function generateBlocCode(
	blocName: string,
	targetDirectory: string,
  ) {
	const blocDirectoryPath = `${targetDirectory}/bloc`;
	if (!existsSync(blocDirectoryPath)) {
	  await createDirectory(blocDirectoryPath);
	}
  
	await Promise.all([
	  //createBlocEventTemplate(blocName, targetDirectory,),
	  //createBlocStateTemplate(blocName, targetDirectory, ),
	  createBlocTemplate(blocName, targetDirectory,),    
	]);
}

function createSnapTemplate( targetDirectory: string, ) {
	const snakeCaseBlocName = changeCase.snakeCase("snapshot_helper.dart");
	const targetPath = `${targetDirectory}`;
	if (existsSync(targetPath)) {
	  throw Error(`${snakeCaseBlocName} already exists`);
	}
	return new Promise(async (resolve, reject) => {
	  writeFile(targetPath, getSnapshotTemplate(), "utf8", error => {
		if (error) {
		  reject(error);
		  return;
		}
		resolve();
	  });
	});
}
async function generateSnapShotCode(
	targetDirectory: string,
  ) {
	const blocDirectoryPath = `${targetDirectory}/bloc`;
	if (!existsSync(blocDirectoryPath)) {
	  await createDirectory(blocDirectoryPath);
	}
  
	await Promise.all([
	  //createBlocEventTemplate(blocName, targetDirectory,),
	  //createBlocStateTemplate(blocName, targetDirectory, ),
	  createSnapTemplate( targetDirectory,),    
	]);
}