/*---------------------------------------------------------
 * Vanilla BLoC VSCode Extension
 *
 * extension.ts — command layer (VS Code UI). The actual file generation
 * lives in `generators.ts` so it can be unit-tested without VS Code.
 *
 * Created  20/05/2020.
 * Author   Allan Nava.
 * Copyright (c) 2020-2026 Allan Nava. Licensed under the MIT License.
 *--------------------------------------------------------*/
import {
	commands,
	ExtensionContext,
	InputBoxOptions,
	OpenDialogOptions,
	Uri,
	window
} from 'vscode';
import * as _ from "lodash";
import { lstatSync } from "fs";
import * as generators from './generators';

// A folder generator takes the target directory and returns the file it wrote.
type FolderGenerator = (targetDirectory: string) => Promise<string>;

export function activate(context: ExtensionContext): void {
	context.subscriptions.push(
		commands.registerCommand('vanilla-bloc-generator.new-bloc', (uri: Uri) => runNewBloc(uri)),
		commands.registerCommand('vanilla-bloc-generator.new-snapshot',
			(uri: Uri) => runInFolder(uri, generators.generateSnapShotCode, "Snapshot")),
		commands.registerCommand('vanilla-bloc-generator.new-bloc-base',
			(uri: Uri) => runInFolder(uri, generators.generateVanillaBLoCCode, "Vanilla BLoC Base")),
		commands.registerCommand('vanilla-bloc-generator.new-bloc-singleton',
			(uri: Uri) => runInFolder(uri, generators.createSingletonBlocCode, "Singleton Base Bloc")),
		commands.registerCommand('vanilla-bloc-generator.new-bloc-event-state-builder',
			(uri: Uri) => runInFolder(uri, generators.createBlocEventStateBuilderCode, "Vanilla Bloc Event State Builder")),
		commands.registerCommand('vanilla-bloc-generator.new-bloc-event-state',
			(uri: Uri) => runInFolder(uri, generators.createBlocEventStateCode, "Vanilla Bloc Event State")),
	);
}

// this method is called when your extension is deactivated
export function deactivate(): void { /* nothing to clean up */ }

async function runNewBloc(uri: Uri): Promise<void> {
	const blocName = await promptForBlocName();
	if (_.isNil(blocName) || blocName.trim() === "") {
		window.showErrorMessage("The bloc name must not be empty");
		return;
	}
	const targetDirectory = await resolveTargetDirectory(uri);
	if (_.isNil(targetDirectory)) {
		window.showErrorMessage("Please select a valid directory");
		return;
	}
	try {
		await generators.generateBlocCode(blocName, targetDirectory);
		window.showInformationMessage(`Successfully Generated ${blocName}`);
	} catch (error) {
		showError(error);
	}
}

async function runInFolder(uri: Uri, generate: FolderGenerator, label: string): Promise<void> {
	const targetDirectory = await resolveTargetDirectory(uri);
	if (_.isNil(targetDirectory)) {
		window.showErrorMessage("Please select a valid directory");
		return;
	}
	try {
		await generate(targetDirectory);
		window.showInformationMessage(`Successfully Generated ${label}`);
	} catch (error) {
		showError(error);
	}
}

// Use the folder the command was invoked on (context menu), otherwise prompt.
async function resolveTargetDirectory(uri: Uri): Promise<string | undefined> {
	if (!_.isNil(_.get(uri, "fsPath")) && lstatSync(uri.fsPath).isDirectory()) {
		return uri.fsPath;
	}
	return promptForTargetDirectory();
}

function showError(error: unknown): void {
	window.showErrorMessage(
		`Error: ${error instanceof Error ? error.message : JSON.stringify(error)}`
	);
}

function promptForBlocName(): Thenable<string | undefined> {
	const blocNamePromptOptions: InputBoxOptions = {
		prompt: "Vanilla Bloc Name",
		placeHolder: "counter"
	};
	return window.showInputBox(blocNamePromptOptions);
}

async function promptForTargetDirectory(): Promise<string | undefined> {
	const options: OpenDialogOptions = {
		canSelectMany: false,
		openLabel: "Select a folder to create the bloc in",
		canSelectFolders: true
	};
	const uri = await window.showOpenDialog(options);
	if (_.isNil(uri) || _.isEmpty(uri)) {
		return undefined;
	}
	return uri[0].fsPath;
}
