import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { AxeBuilder } from '@axe-core/playwright';
import { chromium, type Locator, type Page } from 'playwright';

interface PageCase {
  name: string;
  file: string;
  imageMode: 'required' | 'forbidden' | 'optional';
  sameImagesAs?: string;
}

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'output', 'playwright');
await mkdir(output, { recursive: true });
const args = process.argv.slice(2);
const topics: readonly string[] = ['sunk-cost', 'recognition-recall', 'compounding'];
const templateOnly = args.length === 1 && args[0] === '--template-only';
const singleExample = args.length === 2 && args[0] === '--example' && topics.includes(args[1] ?? '') ? args[1] : undefined;
const singleArtifact = args.length === 2 && args[0] === '--artifact' ? args[1] : undefined;
assert.ok(args.length === 0 || templateOnly || singleExample || singleArtifact, 'Use --template-only, --example with a known topic, or --artifact with a committed host artifact');
let cases: PageCase[] = [
  { name: 'template', file: 'skills/ahafold/assets/explainer.html', imageMode: 'optional' },
];
if (!templateOnly) {
  for (const name of topics) {
    cases.push({ name, file: `examples/${name}/index.html`, imageMode: 'required' });
  }
  const derivative = 'examples/recognition-recall/index.zh-CN.html';
  if (await stat(path.join(root, derivative)).then((info) => info.isFile()).catch(() => false)) {
    cases.push({ name: 'recognition-recall-zh-CN', file: derivative, imageMode: 'required', sameImagesAs: 'examples/recognition-recall/index.html' });
  }
  if (!singleExample) {
    for (const name of ['e04-terminology', 'antigravity-sunk-cost-draft']) {
      cases.push({ name, file: `tests/host-artifacts/${name}/index.html`, imageMode: 'forbidden' });
    }
    for (const entry of await readdir(path.join(root, 'tests', 'host-artifacts'), { withFileTypes: true })) {
      if (!entry.isDirectory() || !entry.name.startsWith('grok')) continue;
      const file = `tests/host-artifacts/${entry.name}/index.html`;
      if (await stat(path.join(root, file)).then((info) => info.isFile()).catch(() => false)) {
        cases.push({ name: entry.name, file, imageMode: 'required' });
      }
    }
  }
}
if (singleExample) cases = cases.filter((candidate) => candidate.name === singleExample || (singleExample === 'recognition-recall' && candidate.sameImagesAs));
if (singleArtifact) {
  cases = cases.filter((candidate) => candidate.name === singleArtifact && candidate.file.startsWith('tests/host-artifacts/'));
  assert.equal(cases.length, 1, 'The selected committed host artifact must exist');
}

function approximately(actual: number, expected: number, reason: string): void {
  assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) < 0.011, `${reason}: expected ${expected}, received ${actual}`);
}

async function expectFocusRing(locator: Locator): Promise<void> {
  const focus = await locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      focused: document.activeElement === element,
      visible: element.matches(':focus-visible'),
      outline: style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0,
      shadow: style.boxShadow !== 'none',
    };
  });
  assert.ok(focus.focused && focus.visible && (focus.outline || focus.shadow), 'Keyboard target needs visible focus');
}

async function checkKeyboard(page: Page): Promise<void> {
  const focusable = page.locator('a[href], button, input, select, textarea, summary, [tabindex="0"]');
  const count = await focusable.count();
  assert.ok(count < 150, 'A short explanation should have a bounded keyboard traversal');
  const reached = new Set<number>();
  for (let index = 0; index < count + 2; index++) {
    await page.keyboard.press('Tab');
    const active = page.locator(':focus');
    if (await active.count() === 0) continue;
    await expectFocusRing(active);
    const position = await focusable.evaluateAll((elements) => elements.findIndex((element) => element === document.activeElement));
    if (position >= 0) reached.add(position);
  }
  for (let index = 0; index < count; index++) {
    const target = focusable.nth(index);
    const mustReach = await target.evaluate((element) => {
      const native = element as HTMLElement;
      return native.tabIndex >= 0 && !element.matches(':disabled') && native.getClientRects().length > 0;
    });
    if (mustReach) assert.ok(reached.has(index), `Keyboard cannot reach focusable item ${index}`);
  }
  const disclosures = page.locator('details');
  for (let index = 0; index < await disclosures.count(); index++) {
    const details = disclosures.nth(index);
    const ancestors = await details.evaluate((element) => Array.from(document.querySelectorAll('details'))
      .flatMap((candidate, ancestorIndex) => candidate !== element && candidate.contains(element) ? [ancestorIndex] : []));
    const opened: number[] = [];
    for (const ancestorIndex of ancestors) {
      const ancestor = disclosures.nth(ancestorIndex);
      if (await ancestor.getAttribute('open') === null) {
        const summary = ancestor.locator(':scope > summary');
        await summary.focus();
        await summary.press('Enter');
        opened.push(ancestorIndex);
      }
    }
    const summary = details.locator(':scope > summary');
    assert.equal(await summary.count(), 1, 'Disclosure has one direct native summary');
    assert.ok(await summary.evaluate((element) => (element as HTMLElement).tabIndex >= 0), 'Disclosure summary stays in keyboard order');
    let tabReached = false;
    for (let step = 0; step < count + 2; step++) {
      await page.keyboard.press('Tab');
      if (await summary.evaluate((element) => element === document.activeElement)) {
        tabReached = true;
        break;
      }
    }
    assert.ok(tabReached, 'Tab reaches the disclosure after its ancestors are open');
    const initial = await details.getAttribute('open') !== null;
    await summary.press('Enter');
    assert.equal(await details.getAttribute('open') !== null, !initial, 'Enter toggles disclosure');
    await expectFocusRing(summary);
    await summary.press('Space');
    assert.equal(await details.getAttribute('open') !== null, initial, 'Space restores disclosure');
    for (const ancestorIndex of opened.reverse()) {
      const ancestorSummary = disclosures.nth(ancestorIndex).locator(':scope > summary');
      await ancestorSummary.focus();
      await ancestorSummary.press('Enter');
      assert.equal(await disclosures.nth(ancestorIndex).getAttribute('open'), null, 'Restore initially closed ancestor');
    }
  }
}

async function setRange(locator: Locator, value: number): Promise<void> {
  assert.equal(await locator.getAttribute('type'), 'range', 'Example controls use native keyboard-operable ranges');
  const minimum = Number(await locator.getAttribute('min') ?? '0');
  const maximum = Number(await locator.getAttribute('max') ?? '100');
  const step = Number(await locator.getAttribute('step') ?? '1');
  assert.ok(Number.isFinite(step) && step > 0 && value >= minimum && value <= maximum);
  const presses = (value - minimum) / step;
  assert.ok(Math.abs(presses - Math.round(presses)) < 1e-8, 'Requested value is reachable using the declared step');
  await locator.focus();
  if (value === maximum) {
    await locator.press('End');
  } else {
    await locator.press('Home');
    for (let count = 0; count < Math.round(presses); count++) await locator.press('ArrowRight');
  }
  assert.equal(Number(await locator.inputValue()), value, 'Keyboard changes the range value');
  await expectFocusRing(locator);
}

async function checkCompounding(page: Page): Promise<void> {
  const years = page.locator('#years');
  const rate = page.locator('#rate');
  const reset = page.locator('#reset');
  const result = page.locator('#future-value');
  assert.equal(await years.inputValue(), '10', 'Default years');
  assert.equal(await rate.inputValue(), '5', 'Default annual rate');
  assert.equal(await years.getAttribute('min'), '0');
  assert.equal(await years.getAttribute('max'), '30');
  assert.equal(await rate.getAttribute('min'), '0');
  assert.equal(await rate.getAttribute('max'), '20');
  const expectValue = async (expected: number): Promise<void> => {
    const numeric = Number(await result.getAttribute('data-value'));
    approximately(numeric, expected, 'Calculation result');
    const shown = Number((await result.innerText()).replace(/[^\d.+-]/g, ''));
    approximately(shown, expected, 'Visible result agrees with the underlying value');
    const duration = Number(await years.inputValue());
    const percent = Number(await rate.inputValue());
    const textNumber = async (selector: string): Promise<number> => Number((await page.locator(selector).innerText()).replace(/[^\d.+-]/g, ''));
    approximately(await textNumber('#selected-value'), expected, 'Comparison amount agrees with the selected value');
    approximately(await textNumber('#early-value'), 100 * (1 + percent / 100) ** 30, 'Earlier start uses the same rate and common endpoint');
    approximately(await textNumber('#interest'), expected - 100, 'Displayed interest excludes principal');
    const ticks = await page.locator('#timeline text').evaluateAll((elements) => elements
      .filter((element) => /^\d+$/.test(element.textContent?.trim() ?? ''))
      .map((element) => ({ year: Number(element.textContent), x: Number(element.getAttribute('x')) })));
    assert.deepEqual(ticks.map((tick) => tick.year), [0, 10, 20, 30], 'Timeline has its stated year scale');
    const first = ticks[0]?.x ?? Number.NaN;
    const last = ticks[3]?.x ?? Number.NaN;
    assert.ok(Number.isFinite(first) && Number.isFinite(last) && last > first);
    for (const tick of ticks) approximately(tick.x, first + tick.year / 30 * (last - first), 'Timeline ticks are linearly scaled');
    const selectedLine = page.locator('#selected-duration');
    const selectedStart = first + (30 - duration) / 30 * (last - first);
    approximately(Number(await selectedLine.getAttribute('x1')), selectedStart, 'Timeline starts at the selected calendar year');
    approximately(Number(await selectedLine.getAttribute('x2')), last, 'Selected duration ends at the fixed endpoint');
    approximately(Number(await page.locator('#selected-start').getAttribute('cx')), selectedStart, 'Start marker matches the duration line');
    assert.equal(Number(await selectedLine.getAttribute('data-start')), 30 - duration);
    assert.equal(Number(await selectedLine.getAttribute('data-end')), 30);
    approximately(Number(await page.locator('#early-duration').getAttribute('x1')), first, 'Early duration starts at year zero');
    approximately(Number(await page.locator('#early-duration').getAttribute('x2')), last, 'Both scenarios share an endpoint');
  };
  await expectValue(162.89);
  await setRange(years, 0);
  await expectValue(100);
  await setRange(years, 1);
  await expectValue(105);
  await setRange(years, 10);
  await expectValue(162.89);
  await setRange(rate, 0);
  await setRange(years, 30);
  await expectValue(100);
  await setRange(years, 1);
  await setRange(rate, 0.1);
  await expectValue(100.1);
  await setRange(years, 30);
  await setRange(rate, 20);
  await expectValue(100 * 1.2 ** 30);
  await reset.focus();
  await reset.press('Enter');
  assert.equal(await years.inputValue(), '10', 'Reset restores years');
  assert.equal(await rate.inputValue(), '5', 'Reset restores rate');
  await expectValue(162.89);
  await expectFocusRing(reset);
}

async function checkPreservedImages(page: Page, candidate: PageCase): Promise<void> {
  const images = await page.locator('img').evaluateAll((elements) => elements.map((element) => {
    if (!(element instanceof HTMLImageElement)) throw new Error('Expected an HTML image');
    return {
      source: element.currentSrc,
      alt: element.alt.trim(),
      loaded: element.complete && element.naturalWidth > 0 && element.naturalHeight > 0,
      caption: element.closest('figure')?.querySelector('figcaption')?.textContent?.trim() ?? '',
    };
  }));
  if (candidate.imageMode === 'required') assert.ok(images.length >= 1, `${candidate.name}: an actual example requires a native illustration`);
  if (candidate.imageMode === 'forbidden') assert.equal(images.length, 0, `${candidate.name}: this no-image outcome must contain no raster image`);
  for (const image of images) {
    assert.ok(image.loaded, `${candidate.name}: image did not decode offline`);
    assert.ok(image.alt.length > 0 && image.caption.length > 0, `${candidate.name}: meaningful alt and a readable figure caption are required`);
  }
  if (candidate.imageMode !== 'required') return;
  const assetDirectory = path.join(root, path.dirname(candidate.file), 'assets');
  const originals = (await readdir(assetDirectory)).filter((file) => /\.(?:png|jpe?g|webp)$/i.test(file));
  assert.ok(originals.length > 0, `${candidate.name}: original raster assets must be retained`);
  const hashes = new Set(await Promise.all(originals.map(async (file) => createHash('sha256')
    .update(await readFile(path.join(assetDirectory, file))).digest('hex'))));
  for (const image of images) {
    if (image.source.startsWith('data:')) {
      const payload = /^data:image\/[\w.+-]+;base64,([\s\S]+)$/.exec(image.source)?.[1];
      assert.ok(payload, `${candidate.name}: embedded image is an expected base64 image URL`);
      const hash = createHash('sha256').update(Buffer.from(payload, 'base64')).digest('hex');
      assert.ok(hashes.has(hash), `${candidate.name}: embedded image must preserve an original asset byte-for-byte`);
    } else {
      assert.ok(image.source.startsWith('file:'), `${candidate.name}: the page cannot depend on a remote image`);
      const resolved = fileURLToPath(image.source);
      const relative = path.relative(assetDirectory, resolved);
      assert.ok(relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative), `${candidate.name}: image must live in the delivered assets directory`);
      assert.ok(hashes.has(createHash('sha256').update(await readFile(resolved)).digest('hex')));
    }
  }
  if (candidate.sameImagesAs) {
    const before = await readFile(path.join(root, candidate.sameImagesAs), 'utf8');
    const originalEmbedded = Array.from(before.matchAll(/data:image\/[\w.+-]+;base64,([A-Za-z0-9+/=\s]+)/g), (match) =>
      createHash('sha256').update(Buffer.from(match[1] ?? '', 'base64')).digest('hex')).sort();
    const currentEmbedded = images.map((image) => {
      const payload = /^data:image\/[\w.+-]+;base64,([\s\S]+)$/.exec(image.source)?.[1];
      assert.ok(payload, `${candidate.name}: language revision preserves each embedded image`);
      return createHash('sha256').update(Buffer.from(payload, 'base64')).digest('hex');
    }).sort();
    assert.deepEqual(currentEmbedded, originalEmbedded, 'Language revision preserves the exact set of original image bytes');
    assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN', 'Chinese revision declares the actual language');
  }
}

async function checkResourceLocations(page: Page, candidate: PageCase): Promise<void> {
  const resources = await page.evaluate(() => {
    const selectors = [
      ['script[src]', 'src'], ['link[rel~="stylesheet"][href]', 'href'],
      ['img[src]', 'src'], ['iframe[src]', 'src'], ['object[data]', 'data'],
      ['embed[src]', 'src'], ['video[src]', 'src'], ['audio[src]', 'src'], ['source[src]', 'src'],
    ] as const;
    return selectors.flatMap(([selector, attribute]) => Array.from(document.querySelectorAll(selector), (element) =>
      new URL(element.getAttribute(attribute) ?? '', document.baseURI).href));
  });
  const deliveredRoot = path.join(root, path.dirname(candidate.file));
  for (const resource of resources) {
    if (resource.startsWith('data:')) continue;
    assert.ok(resource.startsWith('file:'), `${candidate.name}: a required resource uses a nonlocal URL`);
    const file = fileURLToPath(resource);
    const relative = path.relative(deliveredRoot, file);
    assert.ok(relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative), `${candidate.name}: resource escapes the delivered folder`);
    assert.ok((await stat(file)).isFile(), `${candidate.name}: a required local resource is absent`);
  }
}

const browser = await chromium.launch({ headless: true });
try {
  for (const candidate of cases) {
    assert.ok((await stat(path.join(root, candidate.file))).isFile(), `${candidate.name}: actual HTML artifact is required`);
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport, offline: true, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const networkRequests: string[] = [];
      const pageErrors: string[] = [];
      const failedResources: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      page.on('requestfailed', (request) => failedResources.push(`${request.resourceType()}: ${request.failure()?.errorText ?? 'failed'}`));
      page.on('websocket', (socket) => networkRequests.push(new URL(socket.url()).origin));
      page.on('request', (request) => {
        if (/^https?:|^wss?:/.test(request.url())) networkRequests.push(new URL(request.url()).origin);
      });
      await page.route(/^https?:/, (route) => route.abort());
      await page.goto(pathToFileURL(path.join(root, candidate.file)).href, { waitUntil: 'load' });
      await page.screenshot({ path: path.join(output, `${candidate.name}-${viewport.width}.png`), fullPage: true });
      assert.ok((await page.title()).trim().length > 0, 'Document has a title');
      assert.ok(await page.locator('html').getAttribute('lang'), 'Document declares a language');
      assert.equal(await page.locator('h1').count(), 1, 'One clear page heading');
      assert.equal(await page.locator('main').count(), 1, 'One main reading landmark');
      const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth);
      assert.ok(overflow <= 1, `${candidate.name} at ${viewport.width}px: horizontal overflow of ${overflow}px`);
      await checkPreservedImages(page, candidate);
      await checkResourceLocations(page, candidate);
      await checkKeyboard(page);
      if (candidate.name === 'compounding') await checkCompounding(page);
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      assert.deepEqual(audit.violations.map((violation) => ({ id: violation.id, impact: violation.impact, nodes: violation.nodes.map((node) => node.target) })), [], `${candidate.name}: axe accessibility violations`);
      assert.deepEqual(pageErrors, [], `${candidate.name}: browser script errors`);
      assert.deepEqual(failedResources, [], `${candidate.name}: required resources failed to load`);
      assert.deepEqual(networkRequests, [], `${candidate.name}: reading and interaction attempted network requests`);
      await page.locator('body').click({ position: { x: 1, y: 1 } });
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: path.join(output, `${candidate.name}-${viewport.width}.png`), fullPage: true });
      console.log(`PASS ${candidate.name}: ${viewport.width}px, offline assets${candidate.imageMode === 'forbidden' ? ', zero raster images' : ''}, keyboard, axe${candidate.name === 'compounding' ? ', calculation boundaries/reset/timeline' : ''}`);
      await context.close();
    }
  }
} finally {
  await browser.close();
}
const scope = templateOnly ? 'template only; examples were not tested'
  : singleExample ? `${singleExample} and any committed language revision only`
    : singleArtifact ? `${singleArtifact} only`
      : 'template, three examples, any committed language revision, and committed host artifacts';
console.log(`Scope: ${scope}. Chromium browser checks do not establish installed-host acceptance or image semantics.`);
