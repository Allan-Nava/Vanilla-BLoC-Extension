/*---------------------------------------------------------
 * Vanilla BLoC VSCode Extension
 *
 * generators.ts
 * File-generation logic, decoupled from the VS Code API so it can be
 * unit-tested headlessly (no `vscode` import here).
 *
 * Author   Allan Nava.
 * Copyright (c) 2020-2026 Allan Nava. Licensed under the MIT License.
 *--------------------------------------------------------*/
import * as changeCase from "change-case";
import * as mkdirp from "mkdirp";
import { existsSync, promises as fsp } from "fs";
import * as path from "path";
import {
	getBlocTemplate,
	getSnapshotTemplate,
	getBlocGlobalSingletonTemplate,
	getBlocBaseTemplate
} from './templates';
import { getBlocEventStateTemplate } from './templates/bloc-event-state.template';
import { getBlocEventStateBuilderTemplate } from './templates/bloc-event-state-builder.template';

/** Create `targetDirectory` (and any parent) if missing. */
export async function createDirectory(targetDirectory: string): Promise<void> {
	// mkdirp resolves with the first directory created (or undefined if it
	// already existed). Both outcomes are success — only a rejection is an error.
	await mkdirp(targetDirectory, { mode: 0o777 });
}

/**
 * Write `contents` to `targetDirectory/fileName`, creating the directory if
 * needed. Throws if the file already exists. Returns the path written.
 */
export async function writeTemplateFile(
	targetDirectory: string,
	fileName: string,
	contents: string
): Promise<string> {
	await createDirectory(targetDirectory);
	const targetPath = path.join(targetDirectory, fileName);
	if (existsSync(targetPath)) {
		throw new Error(`${fileName} already exists`);
	}
	await fsp.writeFile(targetPath, contents, "utf8");
	return targetPath;
}

/** `<targetDirectory>/bloc/<name>_bloc.dart` */
export function generateBlocCode(blocName: string, targetDirectory: string): Promise<string> {
	const snakeCaseBlocName = changeCase.snakeCase(blocName.toLowerCase());
	return writeTemplateFile(
		path.join(targetDirectory, "bloc"),
		`${snakeCaseBlocName}_bloc.dart`,
		getBlocTemplate(blocName)
	);
}

/** `<targetDirectory>/snapshot_helper.dart` */
export function generateSnapShotCode(targetDirectory: string): Promise<string> {
	return writeTemplateFile(targetDirectory, "snapshot_helper.dart", getSnapshotTemplate());
}

/** `<targetDirectory>/bloc_base.dart` */
export function generateVanillaBLoCCode(targetDirectory: string): Promise<string> {
	return writeTemplateFile(targetDirectory, "bloc_base.dart", getBlocBaseTemplate());
}

/** `<targetDirectory>/bloc_base_singleton.dart` */
export function createSingletonBlocCode(targetDirectory: string): Promise<string> {
	return writeTemplateFile(targetDirectory, "bloc_base_singleton.dart", getBlocGlobalSingletonTemplate());
}

/** `<targetDirectory>/vanilla_bloc_event_state_builder.dart` */
export function createBlocEventStateBuilderCode(targetDirectory: string): Promise<string> {
	return writeTemplateFile(
		targetDirectory,
		"vanilla_bloc_event_state_builder.dart",
		getBlocEventStateBuilderTemplate()
	);
}

/** `<targetDirectory>/vanilla_bloc_event_state.dart` */
export function createBlocEventStateCode(targetDirectory: string): Promise<string> {
	return writeTemplateFile(
		targetDirectory,
		"vanilla_bloc_event_state.dart",
		getBlocEventStateTemplate()
	);
}
