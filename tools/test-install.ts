import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, lstat, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stripVTControlCharacters } from 'node:util';
import { checkSkill, requiredSkillFiles, walkFiles } from './package-contract.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const installerManifestPath = require.resolve('skills/package.json');
const installerManifest: unknown = JSON.parse(await readFile(installerManifestPath, 'utf8'));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

assert.ok(isRecord(installerManifest));
assert.equal(installerManifest.version, '1.5.23', 'The exercised installer must match the documented version');
assert.ok(isRecord(installerManifest.bin));
assert.equal(installerManifest.bin.skills, './bin/cli.mjs', 'Use the published CLI entry');
const installerBin = path.join(path.dirname(installerManifestPath), 'bin', 'cli.mjs');

// Inherit platform basics unchanged, without OAuth, API keys, or host session flags.
// Every command is project-scoped; HOME and CODEX_HOME are never redirected.
const inheritedNames = new Set([
  'path', 'systemroot', 'windir', 'home', 'userprofile', 'homedrive', 'homepath',
  'appdata', 'localappdata', 'tmp', 'temp', 'tmpdir', 'lang', 'lc_all',
]);
const installerEnvironment: NodeJS.ProcessEnv = {
  ...Object.fromEntries(Object.entries(process.env).filter(([key]) => inheritedNames.has(key.toLowerCase()))),
  // Documented by skills@1.5.23 README; disables both telemetry and audit requests.
  DISABLE_TELEMETRY: '1',
  NODE_DISABLE_COMPILE_CACHE: '1',
  NO_COLOR: '1',
};
const steps: { step: string; exit: number }[] = [];

function runInstaller(project: string, step: string, args: readonly string[]): string {
  const result = spawnSync(process.execPath, [installerBin, ...args], {
    cwd: project,
    env: installerEnvironment,
    encoding: 'utf8',
    timeout: 30_000,
    maxBuffer: 2 * 1024 * 1024,
    windowsHide: true,
  });
  const output = stripVTControlCharacters(`${result.stdout ?? ''}${result.stderr ?? ''}`);
  assert.ifError(result.error);
  assert.equal(result.signal, null, `${step}: installer must finish without a signal`);
  assert.equal(result.status, 0, `${step}: installer failed\n${output}`);
  steps.push({ step, exit: result.status });
  return output;
}

async function fileHashes(directory: string): Promise<Record<string, string>> {
  const entries = await Promise.all((await walkFiles(directory, '', false)).map(async (file) => [
    file,
    createHash('sha256').update(await readFile(path.join(directory, file))).digest('hex'),
  ] as const));
  return Object.fromEntries(entries);
}

function installedNames(project: string, step: string): string[] {
  const items: unknown = JSON.parse(runInstaller(project, step, ['list', '--json']));
  assert.ok(Array.isArray(items), 'Installer list must return a JSON array');
  return items.map((item: unknown) => {
    assert.ok(isRecord(item));
    assert.equal(item.scope, 'project', 'Only the isolated project may be listed');
    assert.equal(typeof item.name, 'string');
    return String(item.name);
  }).sort();
}

async function assertMissing(file: string): Promise<void> {
  await assert.rejects(lstat(file), { code: 'ENOENT' }, `${file}: expected removal`);
}

const isolated = await mkdtemp(path.join(os.tmpdir(), 'ahafold installer 中文 '));
try {
  const source = path.join(isolated, 'local source 中文');
  const sourceSkill = path.join(source, 'skills', 'ahafold');
  const project = path.join(isolated, 'project English 中文');
  await cp(path.join(root, 'skills', 'ahafold'), sourceSkill, { recursive: true, errorOnExist: true, force: false });
  await mkdir(project);
  const expectedReport = await checkSkill(sourceSkill);
  assert.deepEqual(expectedReport.files, [...requiredSkillFiles].sort(), 'The install unit matches the complete resource manifest');
  const expectedHashes = await fileHashes(sourceSkill);
  const skillParents = [path.join(project, '.agents', 'skills'), path.join(project, '.grok', 'skills')];
  const protectedDirectories = [
    ...skillParents.map((parent) => path.join(parent, 'keep-me')),
    path.join(project, 'ahafold-output', 'existing 中文'),
  ];
  for (const directory of protectedDirectories) {
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, directory.endsWith('keep-me') ? 'SKILL.md' : 'index.html'),
      directory.endsWith('keep-me')
        ? '---\nname: keep-me\ndescription: Unrelated test skill that must survive removal.\n---\n'
        : '<!doctype html><title>Existing work</title><p>保留 existing explanation.</p>\n');
  }
  const protectedHashes = await Promise.all(protectedDirectories.map(fileHashes));
  const addArguments = ['add', source, '--skill', 'ahafold', '--agent', 'codex', 'grok', '--copy', '-y'];

  assert.equal(runInstaller(project, 'version', ['--version']).trim(), '1.5.23');
  const discovery = runInstaller(project, 'discover', ['add', source, '--list']);
  assert.match(discovery, /Found 1 skill\b/, 'Source discovery must find exactly one skill');
  assert.match(discovery, /Available Skills[\s\S]*\bahafold\b/, 'The discovered skill is AhaFold');

  for (const phase of ['fresh add', 'repeat add', 'edited conflict'] as const) {
    if (phase === 'edited conflict') {
      for (const parent of skillParents) {
        const installed = path.join(parent, 'ahafold');
        await writeFile(path.join(installed, 'references', 'explanation.md'), '# Local user edit\n');
        await writeFile(path.join(installed, 'local-only.txt'), 'A local file absent from the source.\n');
        assert.notDeepEqual(await fileHashes(installed), expectedHashes, 'The conflict fixture must differ');
      }
    }
    const output = runInstaller(project, phase, addArguments);
    assert.match(output, /Installed 1 skill\b/);
    if (phase !== 'fresh add') assert.match(output, /overwrites:/, 'Existing targets must be reported');
    for (const parent of skillParents) {
      const installed = path.join(parent, 'ahafold');
      const info = await lstat(installed);
      assert.ok(info.isDirectory() && !info.isSymbolicLink(), '--copy must create a real directory');
      assert.deepEqual(await checkSkill(installed), expectedReport, 'Installed resources resolve and decode independently');
      assert.deepEqual(await fileHashes(installed), expectedHashes, 'Every installed resource hash must match the manifest source');
    }
    assert.deepEqual(installedNames(project, `${phase} list`), ['ahafold', 'keep-me'], 'List deduplicates AhaFold');
    assert.deepEqual(await Promise.all(protectedDirectories.map(fileHashes)), protectedHashes,
      'Installation preserves unrelated skills and existing output');
  }

  // This observes an upstream limitation, not an AhaFold overwrite-protection pass.
  console.log('OBSERVED LIMITATION: skills@1.5.23 add --copy -y replaces local edits and removes local-only files.');
  console.log('Inspect and preserve an existing same-name installation before invoking the installer.');

  // Named removal spans the shared project skill directory; never use --global or --all.
  const removal = runInstaller(project, 'named remove', ['remove', 'ahafold', '-y']);
  assert.match(removal, /Successfully removed 1 skill\(s\)/);
  for (const parent of skillParents) await assertMissing(path.join(parent, 'ahafold'));
  assert.deepEqual(installedNames(project, 'removed list'), ['keep-me']);
  assert.deepEqual(await Promise.all(protectedDirectories.map(fileHashes)), protectedHashes,
    'Named removal preserves unrelated skills and existing output');
  assert.deepEqual(await fileHashes(sourceSkill), expectedHashes, 'The source snapshot remains unchanged');

  console.log(`PASS installer: ${process.platform}; Node ${process.version}; skills@1.5.23; Codex + Grok project copies.`);
  console.log(`PASS lifecycle: ${JSON.stringify(steps)}`);
  console.log('Scope: actual local-source installer only; no host CLI, OAuth, image generation, or private Git clone acceptance.');
} finally {
  await rm(isolated, { recursive: true, force: true });
}
