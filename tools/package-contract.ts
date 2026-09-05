import { createHash } from 'node:crypto';
import { lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
import { PNG } from 'pngjs';
import { parseDocument } from 'yaml';

export const requiredSkillFiles: readonly string[] = [
  'SKILL.md',
  'references/explanation.md',
  'references/fold.md',
  'references/native-codex.md',
  'references/native-grok.md',
  'references/native-antigravity-cli.md',
  'assets/explainer.html',
  'assets/fold/reference-sheet.png',
];

const ignoredDirectories: ReadonlySet<string> = new Set([
  '.git', 'node_modules', 'output', 'test-results', 'playwright-report',
  '.pnpm-store', '.agents', '.codex', '.grok', '.gemini', 'ahafold-output',
]);

export interface ImageInfo {
  file: string;
  width: number;
  height: number;
  sha256: string;
}

export interface SkillReport {
  files: string[];
  images: ImageInfo[];
}

export async function walkFiles(root: string, relative = '', ignoreDevelopmentDirectories = true): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
    const child = path.join(relative, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`${child}: symlinks are not portable package resources`);
    if (entry.isDirectory()) {
      if (!ignoreDevelopmentDirectories || !ignoredDirectories.has(entry.name)) {
        files.push(...await walkFiles(root, child, ignoreDevelopmentDirectories));
      }
    } else if (entry.isFile()) {
      files.push(child.split(path.sep).join('/'));
    }
  }
  return files.sort();
}

function containedPath(root: string, from: string, target: string): string {
  if (target.includes('\\') || path.posix.isAbsolute(target) || /^[A-Za-z]:/.test(target)) {
    throw new Error(`${from}: nonportable resource path ${target}`);
  }
  const resolved = path.resolve(root, path.dirname(from), target || path.basename(from));
  const relative = path.relative(root, resolved);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`${from}: resource escapes the independent package: ${target}`);
  }
  return resolved;
}

function anchorIds(source: string, extension: string): Set<string> {
  const ids = new Set<string>();
  for (const match of source.matchAll(/\bid=["']([^"']+)["']/g)) {
    if (match[1]) ids.add(match[1]);
  }
  if (extension === '.md') {
    const counts = new Map<string, number>();
    marked.walkTokens(marked.lexer(source), (token) => {
      if (token.type !== 'heading') return;
      const base = token.text.toLowerCase()
        .replace(/<[^>]*>/g, '')
        .replace(/[^\p{L}\p{N}\p{M}_\- ]/gu, '')
        .replaceAll(' ', '-');
      const count = counts.get(base) ?? 0;
      ids.add(count === 0 ? base : `${base}-${count}`);
      counts.set(base, count + 1);
    });
  }
  return ids;
}

export function markdownLinks(source: string): string[] {
  const links: string[] = [];
  marked.walkTokens(marked.lexer(source), (token) => {
    if (token.type === 'link' || token.type === 'image') links.push(token.href);
  });
  return links;
}

export async function checkMarkdownLinks(root: string, file: string): Promise<void> {
  const source = await readFile(path.join(root, file), 'utf8');
  for (const href of markdownLinks(source)) {
    if (/^(?:https?:|mailto:|data:)/i.test(href)) continue;
    if (/^[A-Za-z][A-Za-z\d+.-]*:/.test(href) || href.startsWith('//')) {
      throw new Error(`${file}: unsupported resource URL scheme`);
    }
    const hashAt = href.indexOf('#');
    const rawPath = (hashAt < 0 ? href : href.slice(0, hashAt)).split('?')[0] ?? '';
    const anchor = hashAt < 0 ? undefined : decodeURIComponent(href.slice(hashAt + 1));
    const target = containedPath(root, file, decodeURIComponent(rawPath));
    const info = await lstat(target).catch(() => {
      throw new Error(`${file}: missing local link target ${href}`);
    });
    if (info.isSymbolicLink()) throw new Error(`${file}: linked resource is a symlink`);
    if (anchor && info.isFile() && ['.md', '.html'].includes(path.extname(target))) {
      const targetSource = await readFile(target, 'utf8');
      if (!anchorIds(targetSource, path.extname(target)).has(anchor)) {
        throw new Error(`${file}: missing local anchor ${href}`);
      }
    }
  }
}

export function checkFrontmatter(source: string): void {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source)?.[1];
  if (!frontmatter) throw new Error('SKILL.md: expected YAML frontmatter');
  const document = parseDocument(frontmatter, { uniqueKeys: true });
  if (document.errors.length > 0) throw new Error('SKILL.md: invalid or duplicate frontmatter keys');
  const value: unknown = document.toJSON();
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('SKILL.md: frontmatter must be a mapping');
  }
  const fields = value as Record<string, unknown>;
  if (fields.name !== 'ahafold') throw new Error('SKILL.md: name must be ahafold');
  if (typeof fields.description !== 'string' || fields.description.trim().length < 20) {
    throw new Error('SKILL.md: a useful trigger description is required');
  }
  if (fields['disable-model-invocation'] === true || fields['disable-model-invocation'] === 'true') {
    throw new Error('SKILL.md: ordinary automatic discovery must remain enabled');
  }
}

export async function decodePng(root: string, file: string): Promise<ImageInfo> {
  const bytes = await readFile(path.join(root, file));
  let decoded: PNG;
  try {
    decoded = PNG.sync.read(bytes, { checkCRC: true });
  } catch {
    throw new Error(`${file}: PNG does not decode with valid chunk CRCs`);
  }
  if (decoded.width === 0 || decoded.height === 0 || decoded.data.length !== decoded.width * decoded.height * 4) {
    throw new Error(`${file}: incomplete PNG pixel data`);
  }
  return {
    file,
    width: decoded.width,
    height: decoded.height,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  };
}

export async function checkSkill(root: string): Promise<SkillReport> {
  const files = await walkFiles(root, '', false);
  if (files.some((file) => file.split('/').some((part) => ignoredDirectories.has(part)))) {
    throw new Error('The install unit contains a development, session, or output directory');
  }
  for (const expected of requiredSkillFiles) {
    if (!files.includes(expected)) throw new Error(`Package is missing ${expected}`);
  }
  if (files.filter((file) => path.basename(file) === 'SKILL.md').length !== 1) {
    throw new Error('The install unit must contain exactly one SKILL.md');
  }
  await checkFrontmatter(await readFile(path.join(root, 'SKILL.md'), 'utf8'));
  for (const file of files.filter((file) => file.endsWith('.md'))) await checkMarkdownLinks(root, file);
  const images: ImageInfo[] = [];
  for (const file of files.filter((file) => file.endsWith('.png'))) images.push(await decodePng(root, file));
  return { files, images };
}

function commandBlocks(source: string): string[] {
  return marked.lexer(source)
    .filter((token) => token.type === 'code' && /^(?:sh|bash|shell|powershell|pwsh)$/.test(token.lang ?? ''))
    .map((token) => token.type === 'code' ? token.text.trim().replaceAll('\r', '') : '')
    .sort();
}

function compatibilityStates(source: string): string[] {
  const rows = source.split(/\r?\n/)
    .filter((line) => line.startsWith('|') && /macOS|Windows|Linux/.test(line));
  const states = new Map<string, string>();
  for (const row of rows) {
    const cells = row.split('|').map((cell) => cell.trim().replaceAll('`', '').replaceAll('**', ''));
    const key = cells[1] ?? '';
    const state = cells[2] ?? '';
    if (!/^(macOS|Windows|Linux) \/ (Codex|Grok Build|Antigravity CLI)$/.test(key)) continue;
    if (!/^(PASS|PARTIAL|FAIL|NOT TESTED|BLOCKED)$/.test(state) || states.has(key)) return [];
    states.set(key, state);
  }
  return Array.from(states, ([key, state]) => `${key}: ${state}`).sort();
}

export async function checkReadmes(root: string): Promise<void> {
  const names = ['README.md', 'README.zh-CN.md'];
  const sources = await Promise.all(names.map((file) => readFile(path.join(root, file), 'utf8')));
  for (const [index, file] of names.entries()) {
    const source = sources[index];
    if (!source) throw new Error(`${file}: missing or empty README`);
    await checkMarkdownLinks(root, file);
    const other = names[index === 0 ? 1 : 0];
    if (!other || !markdownLinks(source.slice(0, 800)).includes(other)) {
      throw new Error(`${file}: link to the other language is required near the top`);
    }
    for (const token of [
      'AhaFold', 'Fold', 'skills@1.5.23', '22.20.0', '--copy',
      'AGI-is-going-to-arrive/ahafold', '`codex`', '`grok`', '`antigravity-cli`',
      '$ahafold', '/ahafold', 'ahafold-output/',
    ]) {
      if (!source.includes(token)) throw new Error(`${file}: missing documented contract ${token}`);
    }
    for (const topic of ['sunk-cost', 'recognition-recall', 'compounding']) {
      if (!markdownLinks(source).some((href) => href === `examples/${topic}/index.html`)) {
        throw new Error(`${file}: link to actual ${topic} HTML is required`);
      }
    }
    for (const required of ['LICENSE', 'NOTICE.md']) {
      if (!markdownLinks(source).includes(required)) throw new Error(`${file}: missing ${required} link`);
    }
    if (/\bOWNER\/ahafold\b|TODO|\bTBD\b/.test(source)) throw new Error(`${file}: unresolved placeholder`);
  }
  const english = sources[0] ?? '';
  const chinese = sources[1] ?? '';
  if (JSON.stringify(commandBlocks(english)) !== JSON.stringify(commandBlocks(chinese))) {
    throw new Error('The README command blocks disagree between languages');
  }
  const enStates = compatibilityStates(english);
  if (enStates.length !== 9 || JSON.stringify(enStates) !== JSON.stringify(compatibilityStates(chinese))) {
    throw new Error('Both README matrices must have the same nine explicit compatibility states');
  }
}

export async function checkPortableText(root: string): Promise<void> {
  for (const file of await walkFiles(root)) {
    if (!/\.(?:md|html|ts|json|ya?ml|txt)$/.test(file) && !['LICENSE', 'NOTICE'].includes(file)) continue;
    const source = await readFile(path.join(root, file), 'utf8');
    const personalPath = /(?:\/Users\/|\/home\/)(?![<{$])[^/\s<>]+|\b[A-Za-z]:\\Users\\(?![<%$])[^\\\s<>]+/;
    if (personalPath.test(source)) throw new Error(`${file}: contains a personal absolute path`);
    if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(source)) {
      throw new Error(`${file}: contains private-key material`);
    }
  }
}
