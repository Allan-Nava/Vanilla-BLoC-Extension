import * as assert from 'assert';
import { existsSync, promises as fsp } from 'fs';
import * as os from 'os';
import * as path from 'path';

import * as generators from '../../generators';

async function removeDir(dir: string): Promise<void> {
	// fs.promises.rm exists on Node 14.14+; fall back to rmdir on older hosts.
	const rm = (fsp as unknown as { rm?: (p: string, o: object) => Promise<void> }).rm;
	if (rm) {
		await rm(dir, { recursive: true, force: true });
	} else {
		await fsp.rmdir(dir, { recursive: true });
	}
}

suite('Generators — file generation', () => {
	let tmp: string;

	setup(async () => {
		tmp = await fsp.mkdtemp(path.join(os.tmpdir(), 'vanilla-bloc-test-'));
	});

	teardown(async () => {
		await removeDir(tmp);
	});

	test('generateBlocCode writes <dir>/bloc/<name>_bloc.dart', async () => {
		const file = await generators.generateBlocCode('Counter', tmp);
		assert.strictEqual(file, path.join(tmp, 'bloc', 'counter_bloc.dart'));
		assert.ok(existsSync(file), 'file should exist on disk');
		const content = await fsp.readFile(file, 'utf8');
		assert.ok(content.trim().length > 0, 'file should not be empty');
	});

	test('generateSnapShotCode writes snapshot_helper.dart', async () => {
		const file = await generators.generateSnapShotCode(tmp);
		assert.strictEqual(file, path.join(tmp, 'snapshot_helper.dart'));
		assert.ok(existsSync(file));
	});

	test('generateVanillaBLoCCode writes bloc_base.dart declaring VanillaBlocBase', async () => {
		const file = await generators.generateVanillaBLoCCode(tmp);
		assert.strictEqual(path.basename(file), 'bloc_base.dart');
		const content = await fsp.readFile(file, 'utf8');
		assert.ok(content.includes('VanillaBlocBase'));
	});

	test('createSingletonBlocCode writes bloc_base_singleton.dart', async () => {
		const file = await generators.createSingletonBlocCode(tmp);
		assert.strictEqual(path.basename(file), 'bloc_base_singleton.dart');
		assert.ok(existsSync(file));
	});

	test('event-state vs event-state-builder produce DIFFERENT files (regression VB-1)', async () => {
		const stateFile = await generators.createBlocEventStateCode(tmp);
		const builderFile = await generators.createBlocEventStateBuilderCode(tmp);
		assert.notStrictEqual(stateFile, builderFile, 'should write two distinct files');

		const state = await fsp.readFile(stateFile, 'utf8');
		const builder = await fsp.readFile(builderFile, 'utf8');
		assert.notStrictEqual(state, builder, 'contents must differ');
		assert.ok(state.includes('VanillaBlocEventStateBase'), 'event-state defines the base class');
		assert.ok(builder.includes('VanillaBlocEventStateBuilder'), 'builder defines the widget');
	});

	test('event-state template imports bloc_base.dart and drops the VanilleBlocState typo (VB-3)', async () => {
		const file = await generators.createBlocEventStateCode(tmp);
		const content = await fsp.readFile(file, 'utf8');
		assert.ok(content.includes("import 'bloc_base.dart';"), 'must import bloc_base.dart');
		assert.ok(!content.includes('VanilleBlocState'), 'typo must be gone');
	});

	test('writing over an existing file throws "already exists"', async () => {
		await generators.generateSnapShotCode(tmp);
		await assert.rejects(
			() => generators.generateSnapShotCode(tmp),
			/already exists/
		);
	});
});
