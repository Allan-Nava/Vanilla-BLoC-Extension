/*---------------------------------------------------------
 * Vanilla BLoC VSCode Extension
 *
 * extension.ts
 * Created  20/05/2020.
 * Updated  27/05/2020.
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
	getSnapshotTemplate,
	getBlocGlobalSingletonTemplate,
	getBlocBaseTemplate
} from './templates';
import { getBlocEventStateTemplate } from './templates/bloc-event-state.template';
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
	let new_bloc = commands.registerCommand('vanilla-bloc.new-bloc', async (uri: Uri) => {
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
		try {
			await generateBlocCode( targetDirectory, blocName );
			window.showInformationMessage(
			  `Successfully Generated ${blocName}`
			);
		} catch (error) {
			window.showErrorMessage(
			  `Error:
			  ${error instanceof Error ? error.message : JSON.stringify(error)}`
			);
		}
	});
	///
	/// 
	context.subscriptions.push(new_bloc);
	///
	let new_snapshot =commands.registerCommand('vanilla-bloc.new-snapshot', async (uri: Uri) => {
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
	/// 
	context.subscriptions.push(new_snapshot);
	///
	let bloc_base = commands.registerCommand('vanilla-bloc.new-bloc-base', async (uri: Uri) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//window.showInformationMessage('Hello World from Vanilla BLoC!');
		console.log("vanilla-bloc.new-bloc-base");
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
			await generateVanillaBLoCCode( targetDirectory,);
			window.showInformationMessage(
			  `Successfully Generated Vanilla BLoC Base`
			);
		} catch (error) {
			window.showErrorMessage(
			  `Error:
			  ${error instanceof Error ? error.message : JSON.stringify(error)}`
			);
		}
	});
	/// 
	context.subscriptions.push(bloc_base);
	///
	let singleton = commands.registerCommand('vanilla-bloc.new-bloc-singleton', async (uri: Uri) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//window.showInformationMessage('Hello World from Vanilla BLoC!');
		console.log("vanilla-bloc.new-bloc-singleton");
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
			await createSingletonBlocCode( targetDirectory,);
			window.showInformationMessage(
			  `Successfully Generated Singleton Base Bloc`
			);
		} catch (error) {
			window.showErrorMessage(
			  `Error:
			  ${error instanceof Error ? error.message : JSON.stringify(error)}`
			);
		}
	});
	/// 
	context.subscriptions.push(singleton);
	///
	let bloc_state_builder = commands.registerCommand('vanilla-bloc.new-bloc-event-state-builder', async (uri: Uri) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		console.log("vanilla-bloc.new-bloc-event-state-builder");
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
			await createBlocEventStateBuilderCode( targetDirectory,);
			window.showInformationMessage(
			  `Successfully Generated Vanill Bloc Event State Builder`
			);
		} catch (error) {
			window.showErrorMessage(
			  `Error:
			  ${error instanceof Error ? error.message : JSON.stringify(error)}`
			);
		}
	});
	///
	context.subscriptions.push(bloc_state_builder);
	///
	///
	let bloc_event_state = commands.registerCommand('vanilla-bloc.new-bloc-event-state', async (uri: Uri) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		console.log("vanilla-bloc.new-bloc-event-state");
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
			await createBlocEventStateCode( targetDirectory,);
			window.showInformationMessage(
			  `Successfully Generated Vanill Bloc Event State`
			);
		} catch (error) {
			window.showErrorMessage(
			  `Error:
			  ${error instanceof Error ? error.message : JSON.stringify(error)}`
			);
		}
	});
	///
	context.subscriptions.push(bloc_event_state);
	///
	console.log("subscriptions:  ", context.subscriptions.toString(), "length: ", context.subscriptions.length);
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
	///
	await Promise.all([
	  createBlocTemplate(blocName, targetDirectory,),    
	]);
}
///
function createSnapTemplate( targetDirectory: string, ) {
	const snakeCaseBlocName = changeCase.snakeCase("snapshot_helper");
	const targetPath 		= `${targetDirectory}/${snakeCaseBlocName}.dart`;
	console.log(`createSnapTemplate ${targetPath}`);
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
///
function createBlocBaseTemplate( targetDirectory: string, ) {
	const snakeCaseBlocName = changeCase.snakeCase("bloc_base");
	const targetPath 		= `${targetDirectory}/${snakeCaseBlocName}.dart`;
	if (existsSync(targetPath)) {
	  throw Error(`${snakeCaseBlocName} already exists`);
	}
	return new Promise(async (resolve, reject) => {
	  writeFile(targetPath, getBlocBaseTemplate(), "utf8", error => {
		if (error) {
		  reject(error);
		  return;
		}
		resolve();
	  });
	});
}
///
function createSingletonBaseTemplate( targetDirectory: string, ) {
	const snakeCaseBlocName = changeCase.snakeCase("bloc_base_singleton");
	const targetPath 		= `${targetDirectory}/${snakeCaseBlocName}.dart`;
	if (existsSync(targetPath)) {
	  throw Error(`${snakeCaseBlocName} already exists`);
	}
	return new Promise(async (resolve, reject) => {
	  writeFile(targetPath, getBlocGlobalSingletonTemplate(), "utf8", error => {
		if (error) {
		  reject(error);
		  return;
		}
		resolve();
	  });
	});
}
///
async function generateSnapShotCode(
	targetDirectory: string,
  ) {
	const blocDirectoryPath = `${targetDirectory}`;
	if (!existsSync(blocDirectoryPath)) {
	  await createDirectory(blocDirectoryPath);
	}
	///
	await Promise.all([
	  createSnapTemplate( targetDirectory,),    
	]);
}
///
async function generateVanillaBLoCCode(
	targetDirectory: string,
  ) {
	const blocDirectoryPath = `${targetDirectory}`;
	if (!existsSync(blocDirectoryPath)) {
	  await createDirectory(blocDirectoryPath);
	}
	///
	await Promise.all([
		createBlocBaseTemplate( targetDirectory,),    
	]);
}
///
async function createSingletonBlocCode( targetDirectory: string, ){
	const blocDirectoryPath = `${targetDirectory}`;
	if (!existsSync(blocDirectoryPath)) {
	  await createDirectory(blocDirectoryPath);
	}
	///
	await Promise.all([
		createSingletonBaseTemplate( targetDirectory,),    
	]);
}
///
async function createBlocEventStateBuilderCode( targetDirectory: string, ){
	const blocDirectoryPath = `${targetDirectory}`;
	if (!existsSync(blocDirectoryPath)) {
	  await createDirectory(blocDirectoryPath);
	}
	///
	await Promise.all([
		createBlocEventStateBuilderCodeTemplate( targetDirectory,),    
	]);
}
///
async function createBlocEventStateBuilderCodeTemplate(
	targetDirectory: string,
  ) {
	const snakeCaseBlocName = changeCase.snakeCase("vanilla_bloc_event_state_builder");
	const targetPath 		= `${targetDirectory}/${snakeCaseBlocName}.dart`;
	if (existsSync(targetPath)) {
	  throw Error(`${snakeCaseBlocName} already exists`);
	}
	return new Promise(async (resolve, reject) => {
	  writeFile(targetPath, getBlocEventStateTemplate(), "utf8", error => {
		if (error) {
		  reject(error);
		  return;
		}
		resolve();
	  });
	});
}

///
async function createBlocEventStateCode( targetDirectory: string, ){
	const blocDirectoryPath = `${targetDirectory}`;
	if (!existsSync(blocDirectoryPath)) {
	  await createDirectory(blocDirectoryPath);
	}
	///
	await Promise.all([
		createBlocEventStateCodeTemplate( targetDirectory,),    
	]);
}
///
async function createBlocEventStateCodeTemplate(
	targetDirectory: string,
  ) {
	const snakeCaseBlocName = changeCase.snakeCase("vanilla_bloc_event_state");
	const targetPath 		= `${targetDirectory}/${snakeCaseBlocName}.dart`;
	if (existsSync(targetPath)) {
	  throw Error(`${snakeCaseBlocName} already exists`);
	}
	return new Promise(async (resolve, reject) => {
	  writeFile(targetPath, getBlocEventStateTemplate(), "utf8", error => {
		if (error) {
		  reject(error);
		  return;
		}
		resolve();
	  });
	});
}