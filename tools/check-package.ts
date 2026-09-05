import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkMarkdownLinks, checkPortableText, checkReadmes, checkSkill, walkFiles } from './package-contract.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const skill = path.join(root, 'skills', 'ahafold');
const skills = await walkFiles(path.join(root, 'skills'), '', false);
assert.deepEqual(skills.filter((file) => path.basename(file) === 'SKILL.md'), ['ahafold/SKILL.md'], 'Exactly one installable skill');
const report = await checkSkill(skill);
assert.equal(
  report.images.find((image) => image.file === 'assets/fold/reference-sheet.png')?.sha256,
  'ce069334946531bb7a6b361bb1902d5f3469a9adc5fcfc900d4e89e07d7dd36a',
  'The v0.1 character reference must preserve the approved original bytes',
);
const isolated = await mkdtemp(path.join(os.tmpdir(), 'ahafold package 中文 '));
try {
  const installed = path.join(isolated, 'copied skill');
  await cp(skill, installed, { recursive: true, errorOnExist: true, force: false });
  const copyReport = await checkSkill(installed);
  assert.deepEqual(copyReport, report, 'Detached package resources must match the source');
  for (const file of report.files) {
    assert.deepEqual(await readFile(path.join(installed, file)), await readFile(path.join(skill, file)), `${file}: copied bytes`);
  }
} finally {
  await rm(isolated, { recursive: true, force: true });
}
await checkReadmes(root);
await checkPortableText(root);
for (const file of (await walkFiles(root)).filter((file) => file.endsWith('.md') && !file.startsWith('skills/'))) {
  await checkMarkdownLinks(root, file);
}
console.log(`PASS package: one skill; ${report.files.length} detached resources; ${report.images.length} decoded PNG(s); bilingual links, commands and states.`);
console.log('Scope: deterministic package integrity only. Host discovery, image quality, and README-only onboarding require separate evidence.');
