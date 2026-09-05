import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { AxeBuilder } from '@axe-core/playwright';
import { chromium, type BrowserContext, type Locator, type Page, type Worker } from 'playwright';

interface LongformCase {
  name: string;
  file: string;
}

interface NavigationTarget {
  index: number;
  href: string;
  id: string;
}

interface PageEvidence {
  name: string;
  width: number;
  tocLinks: number;
  scrollRegions: number;
  minimumSvgFontPx: number | null;
  numericStates: number | null;
  calculator: CalculatorEvidence | null;
}

interface CalculatorEvidence {
  refundStates: number;
  disputedStates: number;
  invalidStates: number;
}

interface PageFailures {
  scripts: string[];
  resources: string[];
  network: string[];
}

interface ReadingSnapshot {
  narrative: string;
  headings: string[];
  controls: { name: string; type: string; value: string; checked: boolean | null }[];
  numericOutputs: { name: string; values: string[] }[];
}

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'output', 'longform-checks');
const args = process.argv.slice(2);
const templateOnly = args.length === 1 && args[0] === '--template-only';
const artifact = args.length === 2 && args[0] === '--artifact' ? args[1] : undefined;
assert.ok(args.length === 0 || templateOnly || artifact, 'Use --template-only or --artifact with a repository-relative HTML file');
const template: LongformCase = { name: 'template', file: 'skills/ahafold/assets/longform.html' };
const examples: readonly LongformCase[] = [
  { name: 'library', file: 'examples/longform/library/index.html' },
  { name: 'library-grok-reviewed', file: 'examples/longform/library/grok-reviewed.html' },
  { name: 'retries', file: 'examples/longform/retries/index.html' },
  { name: 'retries-grok-reviewed', file: 'examples/longform/retries/grok-zh-reviewed.html' },
  { name: 'type-boundaries', file: 'examples/longform/type-boundaries/index.html' },
  { name: 'type-boundaries-grok-reviewed', file: 'examples/longform/type-boundaries/grok-reviewed.html' },
];
let cases: readonly LongformCase[] = templateOnly ? [template] : [template, ...examples];
if (artifact) {
  const relative = path.relative(root, path.resolve(root, artifact));
  assert.ok(relative && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative) && relative.endsWith('.html'), 'Artifact must be an HTML file inside the repository');
  cases = [{ name: relative.replace(/[^a-zA-Z0-9-]+/g, '-'), file: relative }];
}
// Preflight every required artifact, so a missing example cannot become an implicit skip.
for (const candidate of cases) {
  assert.ok(await stat(path.join(root, candidate.file)).then((entry) => entry.isFile()).catch(() => false), `${candidate.file}: required longform artifact is missing`);
}
await mkdir(output, { recursive: true });

function normalizedText(text: string): string {
  return text.normalize('NFC').replace(/\s+/g, ' ').trim();
}

function assertSameText(actual: string, expected: string, reason: string): void {
  if (actual === expected) return;
  let offset = 0;
  while (offset < Math.min(actual.length, expected.length) && actual[offset] === expected[offset]) offset++;
  const context = Math.max(0, offset - 50);
  assert.equal(actual === expected, true, `${reason}: first difference at ${offset}; expected length ${expected.length}, actual length ${actual.length}; expected ${JSON.stringify(expected.slice(context, offset + 130))}, actual ${JSON.stringify(actual.slice(context, offset + 130))}`);
}

function assertSameReading(actual: ReadingSnapshot, expected: ReadingSnapshot, reason: string): void {
  // Navigation help can change responsively; links and focus have separate behavior checks.
  assertSameText(actual.narrative, expected.narrative, `${reason}: static narrative`);
  for (const key of ['headings', 'controls', 'numericOutputs'] as const) {
    assertSameText(JSON.stringify(actual[key]), JSON.stringify(expected[key]), `${reason}: ${key}`);
  }
}

async function readingSnapshot(page: Page): Promise<ReadingSnapshot> {
  return page.locator('main').evaluate((main) => {
    const all = Array.from(main.querySelectorAll('*'));
    const outputSelector = 'output, [role="status"], [role="alert"], [aria-live]:not([aria-live="off"])';
    const outputs = Array.from(main.querySelectorAll(outputSelector));
    // Native forms and the smallest non-section container joining controls with
    // their output are operational UI. Keep headings and default values separately.
    const panels = new Set<Element>(main.querySelectorAll('form, fieldset, [role="form"]'));
    for (const output of outputs) {
      for (let parent = output.parentElement; parent && parent !== main; parent = parent.parentElement) {
        if (parent.matches('section, article, [role="main"]') || parent.querySelector('h1,h2')) break;
        if (parent.querySelector('input,select,textarea') && parent.querySelector('button,input[type="submit"]')) {
          panels.add(parent);
          break;
        }
      }
    }
    const copy = main.cloneNode(true) as Element;
    const copied = Array.from(copy.querySelectorAll('*'));
    for (const [index, element] of all.entries()) {
      if (!element.checkVisibility() || panels.has(element)) copied[index]?.remove();
    }
    copy.querySelectorAll(`nav,noscript,script,style,form,fieldset,[role="form"],input,select,textarea,button,label,legend,${outputSelector}`).forEach((element) => element.remove());
    const names = new Map(all.map((element) => [element, (element.getAttribute('aria-label')
      ?? (element.getAttribute('aria-labelledby') ?? '').split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? '').join(' ').trim())
      || element.id || element.getAttribute('name') || element.tagName.toLowerCase()]));
    return {
      narrative: (copy.textContent ?? '').normalize('NFC').replace(/\s+/g, ' ').trim(),
      headings: Array.from(main.querySelectorAll('h1,h2,h3,h4')).filter((element) => element.checkVisibility() && !element.closest('nav')).map((element) => (element.textContent ?? '').normalize('NFC').replace(/\s+/g, ' ').trim()),
      controls: Array.from(main.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input,select,textarea')).map((element) => ({
        name: names.get(element) ?? '', type: element.type, value: element.value,
        checked: element instanceof HTMLInputElement && /^(?:radio|checkbox)$/.test(element.type) ? element.checked : null,
      })),
      numericOutputs: outputs.filter((element) => element.checkVisibility() && !outputs.some((other) => other !== element && other.contains(element))).flatMap((element) => {
        const values = (element.textContent ?? '').match(/[-−]?\d+(?:,\d{3})*(?:\.\d+)?/g) ?? [];
        return values.length ? [{ name: names.get(element) ?? '', values }] : [];
      }),
    };
  });
}

async function trackFailures(page: Page): Promise<PageFailures> {
  const failures: PageFailures = { scripts: [], resources: [], network: [] };
  page.on('pageerror', (error) => failures.scripts.push(error.message));
  page.on('requestfailed', (request) => failures.resources.push(`${request.resourceType()}: ${request.failure()?.errorText ?? 'failed'}`));
  page.on('request', (request) => {
    if (/^(?:https?|wss?):/.test(request.url())) failures.network.push(new URL(request.url()).origin);
  });
  page.on('websocket', (socket) => failures.network.push(new URL(socket.url()).origin));
  await page.route(/^https?:/, (route) => route.abort());
  return failures;
}

function assertNoFailures(failures: PageFailures, reason: string): void {
  assert.deepEqual(failures.scripts, [], `${reason}: browser script errors`);
  assert.deepEqual(failures.resources, [], `${reason}: resources must decode and load offline`);
  assert.deepEqual(failures.network, [], `${reason}: reading or interaction attempted a network request`);
}

async function assertNoOverflow(page: Page, reason: string): Promise<void> {
  const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth);
  assert.ok(overflow <= 1, `${reason}: document overflows horizontally by ${overflow}px`);
}

async function assertLocalResources(page: Page, candidate: LongformCase): Promise<void> {
  const resources = await page.evaluate(() => {
    const selectors = [
      ['script[src]', 'src'], ['link[rel~="stylesheet"][href]', 'href'], ['img[src]', 'src'],
      ['iframe[src]', 'src'], ['object[data]', 'data'], ['embed[src]', 'src'],
      ['video[src]', 'src'], ['audio[src]', 'src'], ['source[src]', 'src'],
    ] as const;
    return selectors.flatMap(([selector, attribute]) => Array.from(document.querySelectorAll(selector), (element) => new URL(element.getAttribute(attribute) ?? '', document.baseURI).href));
  });
  for (const resource of resources) {
    if (resource.startsWith('data:')) continue;
    assert.ok(resource.startsWith('file:'), `${candidate.name}: required resources must be local`);
    const file = fileURLToPath(resource);
    const relative = path.relative(path.dirname(path.join(root, candidate.file)), file);
    assert.ok(relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative), `${candidate.name}: required resource escapes the delivered folder`);
    assert.ok((await stat(file)).isFile(), `${candidate.name}: local resource is missing`);
  }
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(async (element) => {
      if (!(element instanceof HTMLImageElement)) throw new Error('Expected image');
      await element.decode();
      if (!element.naturalWidth || !element.naturalHeight) throw new Error('Image has no decoded pixels');
    });
    assert.ok((await image.getAttribute('alt'))?.trim(), 'An explanatory image needs nonempty alt text');
  }
}

async function expectFocus(locator: Locator): Promise<void> {
  const state = await locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      focused: element === document.activeElement,
      visible: element.matches(':focus-visible'),
      ring: style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0 || style.boxShadow !== 'none',
    };
  });
  assert.ok(state.focused && state.visible && state.ring, 'Keyboard focus must be visible');
}

async function checkKeyboard(page: Page): Promise<void> {
  const targets = page.locator('a[href], button, input, select, textarea, summary, [tabindex="0"]');
  const count = await targets.count();
  const reachable = await targets.evaluateAll((elements) => elements.flatMap((element, index) => {
    const target = element as HTMLElement;
    if (target.tabIndex < 0 || target.matches(':disabled') || !target.checkVisibility()) return [];
    for (let ancestor = target.parentElement; ancestor; ancestor = ancestor.parentElement) {
      if (ancestor instanceof HTMLDetailsElement && !ancestor.open && !ancestor.querySelector(':scope > summary')?.contains(target)) return [];
    }
    if (target instanceof HTMLInputElement && target.type === 'radio' && target.name) {
      const group = elements.filter((item): item is HTMLInputElement => item instanceof HTMLInputElement && item.type === 'radio' && item.name === target.name && item.form === target.form && !item.disabled);
      if (target !== (group.find((item) => item.checked) ?? group[0])) return [];
    }
    return [index];
  }));
  const reached = new Set<number>();
  for (let step = 0; step < count + 2; step++) {
    await page.keyboard.press('Tab');
    const active = page.locator(':focus');
    if (await active.count() === 0) continue;
    await expectFocus(active);
    const index = await targets.evaluateAll((elements) => elements.findIndex((element) => element === document.activeElement));
    if (index >= 0) reached.add(index);
  }
  for (const index of reachable) assert.ok(reached.has(index), `Tab never reaches focusable item ${index}`);
  for (const details of await page.locator('details').all()) {
    const summary = details.locator(':scope > summary');
    if (!await summary.isVisible()) continue;
    assert.equal(await summary.count(), 1, 'Disclosure needs one native summary');
    const initial = await details.getAttribute('open') !== null;
    await summary.focus();
    await summary.press('Enter');
    assert.equal(await details.getAttribute('open') !== null, !initial, 'Enter toggles the disclosure');
    await expectFocus(summary);
    await summary.press('Space');
    assert.equal(await details.getAttribute('open') !== null, initial, 'Space restores the disclosure');
  }
}

async function navigationTargets(page: Page): Promise<NavigationTarget[]> {
  const targets = await page.locator('nav a[href]').evaluateAll((links) => links.flatMap((link, index) => {
    const href = link.getAttribute('href') ?? '';
    const url = new URL(href, document.baseURI);
    if (!url.hash || url.pathname !== location.pathname || url.origin !== location.origin) return [];
    const id = decodeURIComponent(url.hash.slice(1));
    const target = document.getElementById(id);
    if (!target) throw new Error(`Broken table-of-contents target: ${id}`);
    if (!document.querySelector('main')?.contains(target)) return [];
    return [{ index, href, id }];
  }));
  assert.ok(targets.length >= 6, 'Longform fixture needs a working section-level table of contents');
  assert.equal(new Set(targets.map((target) => target.id)).size, targets.length, 'TOC section targets are distinct');
  return targets;
}

async function assertFragmentTarget(page: Page, target: NavigationTarget): Promise<void> {
  // Native fragment focus can settle after scrolling, including after reload.
  // Wait for the full contract; never move focus on the page's behalf.
  try {
    await page.waitForFunction((id) => {
      const target = document.getElementById(id);
      const heading = target?.matches('h1,h2,h3,h4') ? target : target?.querySelector('h1,h2,h3,h4') ?? target;
      if (!target || !heading) return false;
      const bounds = heading.getBoundingClientRect();
      const x = Math.max(1, Math.min(innerWidth - 1, bounds.left + bounds.width / 2));
      const y = Math.max(1, Math.min(innerHeight - 1, bounds.top + bounds.height / 2));
      const topmost = document.elementFromPoint(x, y);
      return decodeURIComponent(location.hash.slice(1)) === id
        && (document.activeElement === target || target.contains(document.activeElement))
        && bounds.top >= -1 && bounds.bottom <= innerHeight + 1
        && topmost !== null && (heading.contains(topmost) || target === topmost);
    }, target.id, { timeout: 5000 });
  } catch (error) {
    const diagnostic = await page.evaluate(() => ({
      hash: location.hash,
      activeTag: document.activeElement?.tagName ?? null,
      activeId: document.activeElement?.id ?? null,
    }));
    throw new Error(`${target.id}: native fragment focus/visibility did not settle within 5s; ${JSON.stringify(diagnostic)}`, { cause: error });
  }
  const state = await page.evaluate((id) => {
    const target = document.getElementById(id);
    const heading = target?.matches('h1,h2,h3,h4') ? target : target?.querySelector('h1,h2,h3,h4') ?? target;
    if (!target || !heading) throw new Error('Missing fragment target');
    const bounds = heading.getBoundingClientRect();
    const x = Math.max(1, Math.min(innerWidth - 1, bounds.left + bounds.width / 2));
    const y = Math.max(1, Math.min(innerHeight - 1, bounds.top + bounds.height / 2));
    const topmost = document.elementFromPoint(x, y);
    return {
      focused: document.activeElement === target || target.contains(document.activeElement),
      visible: bounds.top >= -1 && bounds.bottom <= innerHeight + 1,
      unobscured: topmost !== null && (heading.contains(topmost) || target === topmost),
      top: bounds.top,
    };
  }, target.id);
  assert.ok(state.focused, `${target.id}: fragment navigation must move actual keyboard focus`);
  assert.ok(state.visible && state.unobscured, `${target.id}: target heading is outside the viewport or occluded (top ${state.top}px)`);
}

async function checkContentsNavigation(page: Page): Promise<NavigationTarget[]> {
  for (const details of await page.locator('nav details').all()) {
    if (await details.getAttribute('open') === null) {
      const summary = details.locator(':scope > summary');
      await summary.focus();
      await summary.press('Enter');
    }
  }
  const targets = await navigationTargets(page);
  for (const target of targets) {
    const link = page.locator('nav a[href]').nth(target.index);
    await link.focus();
    await link.press('Enter');
    await assertFragmentTarget(page, target);
  }
  return targets;
}

async function checkNavigation(page: Page, url: string): Promise<number> {
  const targets = await checkContentsNavigation(page);
  const last = targets.at(-1);
  assert.ok(last);
  const viewport = await page.evaluate(() => ({ width: innerWidth, height: innerHeight, ratio: devicePixelRatio, scale: visualViewport?.scale }));
  const assertViewportPreserved = async (): Promise<void> => {
    await page.waitForFunction((expected) => innerWidth === expected.width
      && innerHeight === expected.height && Math.abs(devicePixelRatio - expected.ratio) < 0.01
      && visualViewport?.scale === expected.scale, viewport, { timeout: 5000 });
  };
  // A fresh deep link must start in a different document. Reopening the already
  // selected fragment and immediately reloading tests an interactive history
  // restoration path instead; its Windows observations are recorded separately.
  await page.goto('about:blank', { waitUntil: 'load' });
  await page.goto(`${url}#${encodeURIComponent(last.id)}`, { waitUntil: 'load' });
  await assertViewportPreserved();
  await assertFragmentTarget(page, last);
  await page.reload({ waitUntil: 'load' });
  await assertViewportPreserved();
  await assertFragmentTarget(page, last);
  return targets.length;
}

async function checkScrollRegions(page: Page): Promise<number> {
  const regions = await page.locator('*').evaluateAll((elements) => elements.flatMap((element, index) => {
    const style = getComputedStyle(element);
    if (!element.checkVisibility() || !/(?:auto|scroll)/.test(style.overflowX) || element.scrollWidth <= element.clientWidth + 1) return [];
    const name = element.getAttribute('aria-label') ?? (element.getAttribute('aria-labelledby') ?? '').split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? '').join(' ');
    return [{ index, named: name.trim().length > 0, tabIndex: (element as HTMLElement).tabIndex }];
  }));
  for (const region of regions) {
    assert.ok(region.named && region.tabIndex >= 0, 'Overflow must stay in a named keyboard-focusable local region');
    const locator = page.locator('*').nth(region.index);
    await locator.evaluate((element) => { element.scrollLeft = 0; });
    await locator.focus();
    for (let press = 0; press < 4; press++) await locator.press('ArrowRight');
    await page.waitForFunction((index) => (document.querySelectorAll('*')[index]?.scrollLeft ?? 0) > 0, region.index);
    await expectFocus(locator);
    assert.equal(await page.evaluate(() => scrollX), 0, 'Keyboard scrolling must not move the whole document sideways');
    await locator.evaluate((element) => { element.scrollLeft = 0; });
  }
  return regions.length;
}

async function checkSvgFonts(page: Page): Promise<number | null> {
  const fonts = await page.locator('svg text, svg tspan').evaluateAll((elements) => elements.flatMap((element) => {
    if (!(element instanceof SVGGraphicsElement) || !element.checkVisibility() || !element.textContent?.trim()) return [];
    const matrix = element.getScreenCTM();
    const bounds = element.getBoundingClientRect();
    if (!matrix || bounds.width === 0 || bounds.height === 0) return [];
    return [{ text: element.textContent.trim().slice(0, 50), px: parseFloat(getComputedStyle(element).fontSize) * Math.hypot(matrix.c, matrix.d) }];
  }));
  for (const font of fonts) assert.ok(Number.isFinite(font.px) && font.px >= 11.99, `SVG label "${font.text}" renders at ${font.px.toFixed(2)}px; minimum is 12px after viewBox scaling`);
  return fonts.length ? Math.min(...fonts.map((font) => font.px)) : null;
}

async function assertCoreStructure(page: Page): Promise<string> {
  assert.ok((await page.title()).trim(), 'Document has a title');
  assert.ok(await page.locator('html').getAttribute('lang'), 'Document declares its language');
  assert.equal(await page.locator('h1').count(), 1, 'One clear page heading');
  assert.equal(await page.locator('main').count(), 1, 'One main reading landmark');
  assert.ok(await page.locator('main h2').count() >= 6, 'Longform fixture has at least six meaningful sections');
  const duplicateIds = await page.locator('[id]').evaluateAll((elements) => elements.map((element) => element.id).filter((id, index, ids) => ids.indexOf(id) !== index));
  assert.deepEqual(duplicateIds, [], 'All IDs are unique');
  const core = normalizedText(await page.locator('main').innerText());
  assert.ok(core.length >= 1200, 'Longform fixture must contain substantial readable text, not empty section scaffolding');
  return core;
}

interface LibrarySample {
  overdueDays: number;
  damageCents: number;
  lateFeeCents: number;
  refundCents: number;
  lateFee: string;
  damage: string;
  refund: string;
}

interface LibraryOracle {
  depositCents: number;
  samples: LibrarySample[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function integerField(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  assert.ok(typeof value === 'number' && Number.isSafeInteger(value) && value >= 0, `Library oracle needs a nonnegative integer ${key}`);
  return value;
}

async function readLibraryOracle(): Promise<LibraryOracle> {
  const document: unknown = JSON.parse(await readFile(path.join(root, 'tests', 'longform', 'expectations.json'), 'utf8'));
  assert.ok(isRecord(document) && Array.isArray(document.cases), 'Evaluator oracle must declare its cases');
  const entry: unknown = document.cases.find((candidate: unknown) => isRecord(candidate) && candidate.id === 'library');
  assert.ok(isRecord(entry) && isRecord(entry.numericOracle), 'Independent library numeric oracle is required');
  const oracle = entry.numericOracle;
  assert.ok(isRecord(oracle.inputs) && Array.isArray(oracle.samples));
  const inputs = oracle.inputs;
  assert.ok(isRecord(inputs.overdueDays) && Array.isArray(inputs.confirmedDamageCents));
  const depositCents = integerField(inputs, 'depositCents');
  const latePerDayCents = integerField(inputs, 'latePerDayCents');
  const lateCapCents = integerField(inputs, 'lateCapCents');
  const minimum = integerField(inputs.overdueDays, 'minimum');
  const maximum = integerField(inputs.overdueDays, 'maximum');
  const step = integerField(inputs.overdueDays, 'step');
  assert.ok(depositCents > 0 && step > 0 && maximum >= minimum);
  const damages = inputs.confirmedDamageCents.map((value: unknown) => {
    assert.ok(typeof value === 'number' && Number.isSafeInteger(value) && value >= 0);
    return value;
  });
  assert.equal(damages.length, 2, 'This delivered table compares no damage with confirmed new damage');
  assert.equal(damages[0], 0);
  assert.ok((damages[1] ?? 0) > 0);
  const samples = oracle.samples.map((value: unknown): LibrarySample => {
    assert.ok(isRecord(value));
    const overdueDays = integerField(value, 'overdueDays');
    const damageCents = integerField(value, 'damageCents');
    const lateFeeCents = integerField(value, 'lateFeeCents');
    const refundCents = integerField(value, 'refundCents');
    assert.equal(lateFeeCents, Math.min(latePerDayCents * overdueDays, lateCapCents), 'Oracle late fee agrees with independently calculated integer cents');
    assert.equal(refundCents, Math.max(0, depositCents - lateFeeCents - damageCents), 'Oracle refund agrees with independently calculated integer cents');
    const formatted = (key: string, cents: number): string => {
      assert.equal(value[key], (cents / 100).toFixed(2), `Oracle ${key} uses two decimal places`);
      return (cents / 100).toFixed(2);
    };
    return { overdueDays, damageCents, lateFeeCents, refundCents, lateFee: formatted('lateFee', lateFeeCents), damage: formatted('damage', damageCents), refund: formatted('refund', refundCents) };
  });
  const expectedKeys: string[] = [];
  for (let days = minimum; days <= maximum; days += step) {
    for (const damage of damages) expectedKeys.push(`${days}:${damage}`);
  }
  assert.deepEqual(samples.map((sample) => `${sample.overdueDays}:${sample.damageCents}`).sort(), expectedKeys.sort(), 'Oracle exhausts the full declared day/damage domain without duplicates');
  return { depositCents, samples };
}

async function checkLibraryNumbers(page: Page, candidate: LongformCase): Promise<number | null> {
  if (path.resolve(root, candidate.file) !== path.join(root, 'examples', 'longform', 'library', 'index.html')) return null;
  const oracle = await readLibraryOracle();
  const table = page.getByRole('table').filter({ has: page.getByRole('columnheader', { name: '无新损伤：退还', exact: true }) });
  assert.equal(await table.count(), 1, 'The delivered library page has one visible full refund table');
  const columns = (await table.locator('thead th').allTextContents()).map(normalizedText);
  const daysColumn = columns.indexOf('逾期日数');
  const lateColumn = columns.indexOf('逾期费');
  const noDamageColumn = columns.indexOf('无新损伤：退还');
  const damageColumn = columns.indexOf('确认新损伤：退还');
  assert.ok([daysColumn, lateColumn, noDamageColumn, damageColumn].every((index) => index >= 0), 'Refund table identifies each independent quantity');
  const rows = await table.locator('tbody tr').evaluateAll((elements) => elements.map((row) => Array.from(row.querySelectorAll(':scope > th, :scope > td'), (cell) => (cell.textContent ?? '').trim())));
  const visibleDays = rows.map((row) => {
    const day = /^(\d+)(?:\s|（|$)/.exec(row[daysColumn] ?? '')?.[1];
    assert.ok(day, 'Every refund row declares its actual overdue day in visible text');
    return Number(day);
  });
  assert.deepEqual(visibleDays, [...new Set(oracle.samples.map((sample) => sample.overdueDays))].sort((first, second) => first - second), 'Table includes every defined day once, in reading order');
  for (const sample of oracle.samples) {
    const row = rows[visibleDays.indexOf(sample.overdueDays)];
    assert.ok(row);
    assert.equal(row[lateColumn], sample.lateFee, `Day ${sample.overdueDays}: displayed late fee is exact to the cent`);
    assert.equal(row[sample.damageCents === 0 ? noDamageColumn : damageColumn], sample.refund, `Day ${sample.overdueDays}, damage ${sample.damage}: displayed refund is exact to the cent`);
  }
  const bars = page.locator('.money-comparison .money-example');
  assert.equal(await bars.count(), 2, 'Both two-day deposit compositions are delivered');
  for (const sample of oracle.samples.filter((sample) => sample.overdueDays === 2)) {
    const heading = sample.damageCents === 0 ? '逾期两日，无新损伤' : '逾期两日，已确认新损伤';
    const example = bars.filter({ has: page.getByRole('heading', { name: heading, exact: true }) });
    assert.equal(await example.count(), 1, 'Deposit bar identifies its actual scenario');
    const parts = [
      { className: 'refund', label: `退还 ${sample.refund}`, cents: sample.refundCents },
      { className: 'late', label: `逾期费 ${sample.lateFee}`, cents: sample.lateFeeCents },
      ...(sample.damageCents === 0 ? [] : [{ className: 'damage', label: `损伤费 ${sample.damage}`, cents: sample.damageCents }]),
    ];
    const bar = example.locator('.money-bar');
    assert.equal(await bar.locator(':scope > span').count(), parts.length, 'No additional unlabeled money segment');
    const innerWidth = await bar.evaluate((element) => {
      const style = getComputedStyle(element);
      return element.getBoundingClientRect().width - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    });
    assert.ok(innerWidth > 0, 'Deposit composition is actually rendered');
    for (const part of parts) {
      assert.equal(normalizedText(await example.locator(`.money-labels .${part.className}`).innerText()), part.label, 'Deposit legend shows the independently computed exact amount');
      const renderedWidth = await bar.locator(`:scope > .${part.className}`).evaluate((element) => element.getBoundingClientRect().width);
      assert.ok(Math.abs(renderedWidth - innerWidth * part.cents / oracle.depositCents) <= 0.5, `${heading}, ${part.className}: rendered bar width must represent its share of the full deposit`);
    }
  }
  return oracle.samples.length;
}

async function checkLibraryCalculator(page: Page, candidate: LongformCase): Promise<CalculatorEvidence | null> {
  if (path.resolve(root, candidate.file) !== path.join(root, 'examples', 'longform', 'library', 'grok-reviewed.html')) return null;
  const oracle = await readLibraryOracle();
  const days = page.locator('#overdue-days');
  const apply = page.locator('#calc-apply');
  const reset = page.locator('#calc-reset');
  const result = page.locator('#calc-output');
  const none = page.locator('input[type="radio"][name="damage"][value="none"]');
  const disputed = page.locator('input[type="radio"][name="damage"][value="disputed"]');
  assert.equal(await days.getAttribute('type'), 'number');
  assert.equal(await days.getAttribute('min'), '0');
  assert.equal(await days.getAttribute('max'), '14');
  assert.equal(await days.getAttribute('step'), '1');
  assert.equal(await result.getAttribute('aria-live'), 'polite', 'Calculator results are announced accessibly');
  const assertRefund = async (sample: LibrarySample): Promise<void> => {
    const text = normalizedText(await result.innerText());
    assert.equal(/当前按逾期\s+(\d+)/.exec(text)?.[1], String(sample.overdueDays), 'Visible calculator state names the selected day');
    assert.equal(/损伤费\s+(\d+\.\d{2})/.exec(text)?.[1], sample.damage, 'Visible calculator damage amount is exact to the cent');
    assert.equal(/逾期费\s+(\d+\.\d{2})/.exec(text)?.[1], sample.lateFee, 'Visible calculator late fee is exact to the cent');
    assert.equal(/退还\s+(\d+\.\d{2})/.exec(text)?.[1], sample.refund, 'Visible calculator refund is exact to the cent');
  };
  const applyByKeyboard = async (): Promise<void> => {
    await apply.focus();
    await apply.press('Enter');
    await expectFocus(apply);
  };
  for (const sample of oracle.samples) {
    await days.fill(String(sample.overdueDays));
    const radio = sample.damageCents === 0 ? none : page.locator('input[type="radio"][name="damage"][value="confirmed"]');
    await radio.focus();
    await radio.press('Space');
    assert.ok(await radio.isChecked(), 'Space selects the intended damage state');
    await applyByKeyboard();
    await assertRefund(sample);
  }
  const disputedDays = [...new Set(oracle.samples.map((sample) => sample.overdueDays))];
  for (const day of disputedDays) {
    await days.fill(String(day));
    await disputed.focus();
    await disputed.press('Space');
    assert.ok(await disputed.isChecked());
    await applyByKeyboard();
    const text = normalizedText(await result.innerText());
    assert.equal(/当前按逾期\s+(\d+)/.exec(text)?.[1], String(day));
    assert.match(text, /暂缓(?:押金)?结清/, 'Disputed damage pauses settlement');
    assert.match(text, /人工复核/, 'Disputed damage requires review');
    assert.doesNotMatch(text, /(?:退还|退款|到账|refund|payout)\s*(?:为|是|[:：])?\s*[-−]?\d+(?:\.\d+)?/iu, 'Disputed damage must not issue a final refund or payout amount');
  }
  const invalidValues = ['', '-1', '1.5', '15'];
  await none.focus();
  await none.press('Space');
  for (const value of invalidValues) {
    await days.fill(value);
    await applyByKeyboard();
    const text = normalizedText(await result.innerText());
    assert.match(text, /整数日|没有定义|未定义|工作人员/, 'Invalid or out-of-domain values do not acquire an invented policy');
    assert.doesNotMatch(text, /(?:退还|退款)\s*[-−]?\d+(?:\.\d+)?/u, 'Invalid input must not show a computed refund');
  }
  await reset.focus();
  await reset.press('Enter');
  await expectFocus(reset);
  assert.equal(await days.inputValue(), '2', 'Reset restores the stated two-day example');
  assert.ok(await none.isChecked(), 'Reset restores no confirmed damage');
  const initial = oracle.samples.find((sample) => sample.overdueDays === 2 && sample.damageCents === 0);
  assert.ok(initial, 'Oracle covers the declared default example');
  await assertRefund(initial);
  return { refundStates: oracle.samples.length, disputedStates: disputedDays.length, invalidStates: invalidValues.length };
}

async function checkNoJavaScript(browser: Awaited<ReturnType<typeof chromium.launch>>, candidate: LongformCase, expectedCore: ReadingSnapshot): Promise<void> {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false, offline: true, reducedMotion: 'reduce' });
  try {
    const page = await context.newPage();
    const failures = await trackFailures(page);
    const url = pathToFileURL(path.join(root, candidate.file)).href;
    await page.goto(url, { waitUntil: 'load' });
    await assertCoreStructure(page);
    assertSameReading(await readingSnapshot(page), expectedCore, `${candidate.name}, no JavaScript: preserve the default explanation/state`);
    await assertNoOverflow(page, `${candidate.name}, no JavaScript`);
    await checkNavigation(page, url);
    await checkLibraryNumbers(page, candidate);
    await assertLocalResources(page, candidate);
    assertNoFailures(failures, `${candidate.name}, no JavaScript`);
  } finally {
    await context.close();
  }
}

async function checkPrint(page: Page, candidate: LongformCase): Promise<void> {
  await page.goto(pathToFileURL(path.join(root, candidate.file)).href, { waitUntil: 'load' });
  await page.setViewportSize({ width: 794, height: 1123 });
  await page.emulateMedia({ media: 'print' });
  await assertNoOverflow(page, `${candidate.name}, A4 print`);
  const clipped = await page.locator('main *').evaluateAll((elements) => elements.flatMap((element) => {
    const style = getComputedStyle(element);
    return element.checkVisibility() && /(?:auto|scroll|hidden|clip)/.test(style.overflowX) && element.scrollWidth > element.clientWidth + 1
      ? [element.tagName.toLowerCase()] : [];
  }));
  assert.deepEqual(clipped, [], 'Printed main content must not hide wide table or diagram columns in a scroll region');
  for (const element of await page.locator('main h1, main h2, main details > :not(summary)').all()) {
    if (await element.evaluate((node) => node.closest('nav') !== null)) continue;
    assert.ok(await element.isVisible(), 'Print includes section headings and supplementary disclosure content');
  }
  const bytes = await page.pdf({ path: path.join(output, `${candidate.name}-print.pdf`), format: 'A4', printBackground: true, preferCSSPageSize: true });
  assert.equal(bytes.subarray(0, 5).toString(), '%PDF-', 'Browser produced an actual print artifact');
  assert.ok(bytes.length > 1000, 'Print artifact is nonempty');
  await page.emulateMedia({ media: 'screen' });
}

interface ZoomTabs {
  query(query: Record<string, never>): Promise<{ id?: number; url?: string }[]>;
  setZoom(tabId: number, factor: number): Promise<void>;
  getZoom(tabId: number): Promise<number>;
}

async function setBrowserZoom(worker: Worker, url: string, factor: number): Promise<number> {
  return worker.evaluate(async ({ url, factor }) => {
    const extension = globalThis as unknown as { chrome: { tabs: ZoomTabs } };
    const tab = (await extension.chrome.tabs.query({})).find((candidate) => candidate.url?.split('#')[0] === url);
    if (tab?.id === undefined) throw new Error('The isolated zoom extension cannot find the test tab');
    await extension.chrome.tabs.setZoom(tab.id, factor);
    return extension.chrome.tabs.getZoom(tab.id);
  }, { url, factor });
}

async function checkRealPageZoom(): Promise<void> {
  const isolated = await mkdtemp(path.join(os.tmpdir(), 'ahafold page zoom '));
  let context: BrowserContext | undefined;
  try {
    const extension = path.join(isolated, 'extension');
    await mkdir(extension);
    await writeFile(path.join(extension, 'manifest.json'), JSON.stringify({ manifest_version: 3, name: 'AhaFold isolated zoom check', version: '1.0', permissions: ['tabs'], background: { service_worker: 'worker.js' } }));
    await writeFile(path.join(extension, 'worker.js'), 'chrome.runtime.onInstalled.addListener(() => {});\n');
    context = await chromium.launchPersistentContext(path.join(isolated, 'profile'), {
      channel: 'chromium', headless: true, viewport: null, offline: true, reducedMotion: 'reduce',
      args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`, '--window-size=1440,900'],
    });
    const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker', { timeout: 10_000 });
    const page = context.pages()[0] ?? await context.newPage();
    const failures = await trackFailures(page);
    for (const candidate of cases) {
      const url = pathToFileURL(path.join(root, candidate.file)).href;
      await page.goto(url, { waitUntil: 'load' });
      assert.equal(await setBrowserZoom(worker, url, 1), 1);
      const baseline = await page.evaluate(() => ({ width: innerWidth, ratio: devicePixelRatio, scale: visualViewport?.scale }));
      const core = await readingSnapshot(page);
      assert.equal(await setBrowserZoom(worker, url, 2), 2, 'Chromium reports actual 200% browser zoom');
      await page.waitForFunction((width) => Math.abs(innerWidth - width / 2) <= 1, baseline.width);
      const zoomed = await page.evaluate(() => ({ width: innerWidth, ratio: devicePixelRatio, scale: visualViewport?.scale }));
      assert.ok(Math.abs(zoomed.ratio - baseline.ratio * 2) < 0.01, 'Actual page zoom doubles the rendered pixel scale');
      assert.equal(zoomed.scale, baseline.scale, 'This is page reflow zoom, not a pinch-zoom visualViewport crop');
      assertSameReading(await readingSnapshot(page), core, `${candidate.name}, real 200% page zoom: preserve the explanation/default state`);
      await assertNoOverflow(page, `${candidate.name}, real 200% page zoom`);
      // Verify reading and native TOC use in the zoomed document. Fresh document
      // entry/reload is checked separately at every regular viewport and no-JS;
      // Chrome's retention of file: zoom preferences is not an HTML guarantee.
      await checkContentsNavigation(page);
      const afterNavigation = await page.evaluate(() => ({ width: innerWidth, ratio: devicePixelRatio, scale: visualViewport?.scale }));
      assert.deepEqual(afterNavigation, zoomed, 'TOC navigation preserves the verified real page zoom and viewport');
      await checkScrollRegions(page);
      await checkSvgFonts(page);
      await checkLibraryNumbers(page, candidate);
      await checkLibraryCalculator(page, candidate);
      await page.screenshot({ path: path.join(output, `${candidate.name}-zoom-200.png`), fullPage: true });
      assertNoFailures(failures, `${candidate.name}, real 200% page zoom`);
      console.log(`PASS ${candidate.name}: actual Chromium 200% zoom, layout ${baseline.width}px → ${zoomed.width}px, pixel scale ${baseline.ratio} → ${zoomed.ratio}`);
    }
  } finally {
    await context?.close();
    await rm(isolated, { recursive: true, force: true });
  }
}

const evidence: PageEvidence[] = [];
const browser = await chromium.launch({ headless: true });
try {
  for (const candidate of cases) {
    let core: ReadingSnapshot | undefined;
    for (const viewport of [{ width: 320, height: 740 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
      const context = await browser.newContext({ viewport, offline: true, reducedMotion: 'reduce' });
      try {
        const page = await context.newPage();
        const failures = await trackFailures(page);
        const url = pathToFileURL(path.join(root, candidate.file)).href;
        await page.goto(url, { waitUntil: 'load' });
        await assertCoreStructure(page);
        if (viewport.width === 390) core = await readingSnapshot(page);
        await page.screenshot({ path: path.join(output, `${candidate.name}-${viewport.width}.png`), fullPage: true });
        if (viewport.width === 320 || viewport.width === 1440) {
          await page.screenshot({ path: path.join(output, `${candidate.name}-${viewport.width}-first-screen.png`) });
        }
        await assertNoOverflow(page, `${candidate.name}, ${viewport.width}px`);
        await assertLocalResources(page, candidate);
        await checkKeyboard(page);
        const tocLinks = await checkNavigation(page, url);
        const scrollRegions = await checkScrollRegions(page);
        const minimumSvgFontPx = await checkSvgFonts(page);
        const numericStates = await checkLibraryNumbers(page, candidate);
        const calculator = await checkLibraryCalculator(page, candidate);
        const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        assert.deepEqual(audit.violations.map((violation) => ({ id: violation.id, impact: violation.impact, nodes: violation.nodes.map((node) => node.target) })), [], `${candidate.name}: accessibility violations`);
        if (viewport.width === 1440) await checkPrint(page, candidate);
        assertNoFailures(failures, `${candidate.name}, ${viewport.width}px`);
        evidence.push({ name: candidate.name, width: viewport.width, tocLinks, scrollRegions, minimumSvgFontPx, numericStates, calculator });
        console.log(`PASS ${candidate.name}: ${viewport.width}px, TOC/deep-link focus, keyboard disclosure/local scroll, SVG screen fonts, offline, axe${numericStates ? `, ${numericStates} exact refund states and rendered deposit bars` : ''}${calculator ? `, calculator ${calculator.refundStates} refund/${calculator.disputedStates} dispute/${calculator.invalidStates} invalid states and keyboard reset` : ''}${viewport.width === 1440 ? ', A4 print' : ''}`);
      } finally {
        await context.close();
      }
    }
    assert.ok(core, 'JavaScript-enabled reading baseline was captured at the matching 390px width');
    await checkNoJavaScript(browser, candidate, core);
    console.log(`PASS ${candidate.name}: JavaScript disabled, exact static narrative/headings/default controls/numeric outputs and native navigation preserved; capability notices may differ`);
  }
} finally {
  await browser.close();
}
await checkRealPageZoom();
const scope = templateOnly ? 'template only; delivered examples and installed hosts were not tested'
  : artifact ? 'one explicitly selected artifact only; this is not approval of the artifact or installed-host acceptance'
    : 'template, three required longform topics and their three reviewed Grok variants; installed hosts require separate evidence';
await writeFile(path.join(output, 'results.json'), `${JSON.stringify({ timestamp: new Date().toISOString(), scope, cases: evidence }, null, 2)}\n`);
console.log(`Scope: ${scope}. Automated checks do not establish factual correctness, illustration semantics, aesthetics, or human comprehension.`);
