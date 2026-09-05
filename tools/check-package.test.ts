import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { PNG } from 'pngjs';
import { checkFrontmatter, checkMarkdownLinks, checkPortableText, checkReadmes, checkSkill, decodePng, requiredSkillFiles } from './package-contract.js';

async function withPackage(run: (root: string) => Promise<void>): Promise<void> {
  const root = await mkdtemp(path.join(os.tmpdir(), 'ahafold fixture 中文 '));
  try {
    for (const file of requiredSkillFiles) {
      await mkdir(path.dirname(path.join(root, file)), { recursive: true });
      if (file.endsWith('.png')) {
        const pixels = new PNG({ width: 2, height: 2 });
        pixels.data.fill(255);
        await writeFile(path.join(root, file), PNG.sync.write(pixels));
      } else {
        await writeFile(path.join(root, file), file === 'SKILL.md'
          ? '---\nname: ahafold\ndescription: Make a clear illustrated concept explanation.\n---\n# AhaFold\n\n[Method](references/explanation.md)\n'
          : '# Packaged resource\n');
      }
    }
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test('complete package resolves independently in a path containing spaces and Chinese', async () => {
  await withPackage(async (root) => {
    const result = await checkSkill(root);
    assert.equal(result.files.length, requiredSkillFiles.length);
    assert.equal(result.images[0]?.width, 2);
    assert.equal(result.images[0]?.height, 2);
  });
});

test('frontmatter rejects wrong identity, duplicate keys and disabled automatic discovery', () => {
  assert.throws(() => checkFrontmatter('---\nname: other\ndescription: A sufficiently long description.\n---\n'), /name must be/);
  assert.throws(() => checkFrontmatter('---\nname: ahafold\nname: ahafold\ndescription: A sufficiently long description.\n---\n'), /duplicate/);
  assert.throws(() => checkFrontmatter('---\nname: ahafold\ndescription: A sufficiently long description.\ndisable-model-invocation: true\n---\n'), /automatic discovery/);
  assert.throws(() => checkFrontmatter('# No metadata'), /frontmatter/);
});

test('resource links reject parent escape, encoded escape, absent file and absent anchor', async () => {
  await withPackage(async (root) => {
    const file = path.join(root, 'references', 'explanation.md');
    for (const [href, expectation] of [
      ['../../outside.md', /escapes/],
      ['%2e%2e/%2e%2e/outside.md', /escapes/],
      ['missing.md', /missing local link/],
      ['../SKILL.md#missing', /missing local anchor/],
      ['file:///private-reference.md', /unsupported resource/],
    ] as const) {
      await writeFile(file, `[Broken](${href})\n`);
      await assert.rejects(checkSkill(root), expectation);
    }
    await writeFile(file, '[Valid](../SKILL.md#ahafold)\n');
    await checkMarkdownLinks(root, 'references/explanation.md');
  });
});

test('incomplete package and nested second skill are rejected', async () => {
  await withPackage(async (root) => {
    await mkdir(path.join(root, 'extra'));
    await writeFile(path.join(root, 'extra', 'SKILL.md'), '# Unexpected second install unit\n');
    await assert.rejects(checkSkill(root), /exactly one SKILL/);
    await rm(path.join(root, 'extra'), { recursive: true });
    await rm(path.join(root, 'references', 'native-grok.md'));
    await assert.rejects(checkSkill(root), /missing references\/native-grok.md/);
  });
});

test('install unit cannot hide copied resources in ignored development directories', async () => {
  await withPackage(async (root) => {
    await mkdir(path.join(root, '.agents', 'hidden'), { recursive: true });
    await writeFile(path.join(root, '.agents', 'hidden', 'SKILL.md'), '# Hidden skill\n');
    await assert.rejects(checkSkill(root), /development, session, or output directory/);
  });
});

test('PNG checker decodes pixels and rejects truncated data and invalid CRC', async () => {
  await withPackage(async (root) => {
    const file = 'assets/fold/reference-sheet.png';
    const original = await readFile(path.join(root, file));
    assert.equal((await decodePng(root, file)).width, 2);
    await writeFile(path.join(root, file), original.subarray(0, 25));
    await assert.rejects(decodePng(root, file), /does not decode/);
    const corrupted = Buffer.from(original);
    corrupted[29] = (corrupted[29] ?? 0) ^ 1;
    await writeFile(path.join(root, file), corrupted);
    await assert.rejects(decodePng(root, file), /does not decode/);
  });
});

async function writeReadmeFixture(root: string): Promise<void> {
  for (const topic of ['sunk-cost', 'recognition-recall', 'compounding']) {
    await mkdir(path.join(root, 'examples', topic), { recursive: true });
    await writeFile(path.join(root, 'examples', topic, 'index.html'), '<!doctype html><title>Example</title>');
  }
  await writeFile(path.join(root, 'LICENSE'), 'Fixture license\n');
  await writeFile(path.join(root, 'NOTICE.md'), '# Fixture notice\n');
  const body = `# AhaFold\nFold; Node 22.20.0; \`codex\`, \`grok\`, \`antigravity-cli\`; $ahafold; /ahafold; ahafold-output/.\n
\`\`\`sh
npx skills@1.5.23 add AGI-is-going-to-arrive/ahafold --skill ahafold --copy
\`\`\`

[Sunk cost](examples/sunk-cost/index.html)
[Recognition](examples/recognition-recall/index.html)
[Compounding](examples/compounding/index.html)
[License](LICENSE) [Notice](NOTICE.md)

| Combination | State |
| --- | --- |
| macOS / Codex | PARTIAL |
| macOS / Grok Build | BLOCKED |
| macOS / Antigravity CLI | NOT TESTED |
| Windows / Codex | NOT TESTED |
| Windows / Grok Build | NOT TESTED |
| Windows / Antigravity CLI | NOT TESTED |
| Linux / Codex | NOT TESTED |
| Linux / Grok Build | NOT TESTED |
| Linux / Antigravity CLI | NOT TESTED |
`;
  await writeFile(path.join(root, 'README.md'), `[简体中文](README.zh-CN.md)\n\n${body}`);
  await writeFile(path.join(root, 'README.zh-CN.md'), `[English](README.md)\n\n${body}`);
}

test('README comparison catches changed install commands and mismatched platform states', async () => {
  await withPackage(async (root) => {
    await writeReadmeFixture(root);
    await checkReadmes(root);
    const chinesePath = path.join(root, 'README.zh-CN.md');
    const original = await readFile(chinesePath, 'utf8');
    await writeFile(chinesePath, original.replace('--skill ahafold --copy', '--skill ahafold --agent codex --copy'));
    await assert.rejects(checkReadmes(root), /command blocks disagree/);
    await writeFile(chinesePath, original.replace('PARTIAL', 'PASS'));
    await assert.rejects(checkReadmes(root), /nine explicit compatibility states/);
    await writeFile(chinesePath, original.replace('macOS / Codex', 'macOS / Other'));
    await assert.rejects(checkReadmes(root), /nine explicit compatibility states/);
  });
});

test('portable text rejects personal paths without echoing their contents', async () => {
  await withPackage(async (root) => {
    const privatePath = '/' + 'Users/' + 'example-author/private/session.png';
    await writeFile(path.join(root, 'references', 'explanation.md'), `An accidental reference: ${privatePath}`);
    await assert.rejects(checkPortableText(root), /contains a personal absolute path/);
  });
});
