import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium, type Page } from 'playwright';

type Mode = 'fresh-fragment' | 'toc-sameurl-immediate-reload' | 'fresh-settled-then-reload';

interface TargetState {
  exists: boolean;
  tabindexAttribute: string | null;
  tabindex: number | null;
  display: string | null;
  visibility: string | null;
  opacity: string | null;
  checkVisibility: boolean | null;
  rect: { x: number; y: number; width: number; height: number; top: number; bottom: number } | null;
}

interface Snapshot {
  performanceNow: number;
  timeOrigin: number;
  readyState: string;
  hash: string;
  activeTag: string | null;
  activeId: string | null;
  hasFocus: boolean;
  visibilityState: string;
  navigationType: string | null;
  hashMatches: boolean;
  targetFocused: boolean;
  targetInViewport: boolean;
  targetUnobscured: boolean;
  target: TargetState;
}

interface NativeEvent {
  event: string;
  performanceNow: number;
  timeOrigin: number;
  readyState: string;
  hash: string;
  activeTag: string | null;
  activeId: string | null;
  hasFocus: boolean;
  visibilityState: string;
  navigationType: string | null;
  eventTargetTag: string | null;
  eventTargetId: string | null;
}

interface ContextIdentity {
  file: string;
  mode: Mode;
  repetition: number;
  context: number;
}

const root = fileURLToPath(new URL('../', import.meta.url));
const smoke = process.argv.length === 3 && process.argv[2] === '--smoke';
assert.ok(process.argv.length === 2 || smoke, 'Use no arguments for the Windows diagnostic or --smoke for one local fresh-load context');
const files = [
  'examples/longform/retries/grok-zh-reviewed.html',
  'examples/longform/type-boundaries/grok-reviewed.html',
];
const modes: readonly Mode[] = ['fresh-fragment', 'toc-sameurl-immediate-reload', 'fresh-settled-then-reload'];
const prefix = 'AHAFOLD_NATIVE_FRAGMENT_EVENT ';

// Log events without geometry reads inside listeners, to avoid forcing layout in
// the event itself. The page-level collector survives replacement of the window.
const instrumentation = String.raw`(() => {
  function record(event, source) {
    const active = document.activeElement;
    const navigation = performance.getEntriesByType('navigation')[0];
    const eventTarget = source && source.target;
    console.debug('AHAFOLD_NATIVE_FRAGMENT_EVENT ' + JSON.stringify({
      event,
      performanceNow: performance.now(),
      timeOrigin: performance.timeOrigin,
      readyState: document.readyState,
      hash: location.hash,
      activeTag: active ? active.tagName : null,
      activeId: active ? active.id : null,
      hasFocus: document.hasFocus(),
      visibilityState: document.visibilityState,
      navigationType: navigation ? navigation.type : null,
      eventTargetTag: eventTarget ? eventTarget.tagName || eventTarget.nodeName || null : null,
      eventTargetId: eventTarget ? eventTarget.id || null : null
    }));
  }
  document.addEventListener('DOMContentLoaded', event => record('DOMContentLoaded', event), true);
  window.addEventListener('load', event => record('load', event), true);
  window.addEventListener('pageshow', event => record('pageshow', event), true);
  document.addEventListener('focusin', event => record('focusin', event), true);
  document.addEventListener('focusout', event => record('focusout', event), true);
  window.addEventListener('hashchange', event => record('hashchange', event), true);
  record('init', null);
})();`;

function log(record: Record<string, unknown>): void {
  console.log(JSON.stringify(record));
}

function isNativeEvent(value: unknown): value is NativeEvent {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const event = value as Record<string, unknown>;
  return typeof event.event === 'string' && typeof event.performanceNow === 'number'
    && typeof event.timeOrigin === 'number' && typeof event.hasFocus === 'boolean';
}

async function snapshot(page: Page, id: string): Promise<Snapshot> {
  return page.evaluate((id) => {
    const target = document.getElementById(id);
    const style = target ? getComputedStyle(target) : null;
    const bounds = target?.getBoundingClientRect();
    const active = document.activeElement;
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const x = bounds ? Math.max(1, Math.min(innerWidth - 1, bounds.left + bounds.width / 2)) : 0;
    const y = bounds ? Math.max(1, Math.min(innerHeight - 1, bounds.top + bounds.height / 2)) : 0;
    const topmost = bounds ? document.elementFromPoint(x, y) : null;
    return {
      performanceNow: performance.now(), timeOrigin: performance.timeOrigin,
      readyState: document.readyState, hash: location.hash,
      activeTag: active?.tagName ?? null, activeId: active?.id ?? null,
      hasFocus: document.hasFocus(), visibilityState: document.visibilityState,
      navigationType: navigation?.type ?? null,
      hashMatches: decodeURIComponent(location.hash.slice(1)) === id,
      targetFocused: target !== null && (active === target || target.contains(active)),
      targetInViewport: bounds !== undefined && bounds.top >= -1 && bounds.bottom <= innerHeight + 1,
      targetUnobscured: target !== null && topmost !== null && target.contains(topmost),
      target: {
        exists: target !== null, tabindexAttribute: target?.getAttribute('tabindex') ?? null,
        tabindex: target?.tabIndex ?? null, display: style?.display ?? null,
        visibility: style?.visibility ?? null, opacity: style?.opacity ?? null,
        checkVisibility: target?.checkVisibility() ?? null,
        rect: bounds ? { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height, top: bounds.top, bottom: bounds.bottom } : null,
      },
    };
  }, id);
}

function complete(state: Snapshot): boolean {
  return state.hashMatches && state.targetFocused && state.targetInViewport && state.targetUnobscured;
}

async function waitForNativeState(page: Page, id: string): Promise<boolean> {
  try {
    await page.waitForFunction((id) => {
      const target = document.getElementById(id);
      if (!target) return false;
      const bounds = target.getBoundingClientRect();
      const x = Math.max(1, Math.min(innerWidth - 1, bounds.left + bounds.width / 2));
      const y = Math.max(1, Math.min(innerHeight - 1, bounds.top + bounds.height / 2));
      const topmost = document.elementFromPoint(x, y);
      return decodeURIComponent(location.hash.slice(1)) === id
        && (document.activeElement === target || target.contains(document.activeElement))
        && bounds.top >= -1 && bounds.bottom <= innerHeight + 1
        && topmost !== null && target.contains(topmost);
    }, id, { timeout: 5000 });
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') return false;
    throw error;
  }
}

for (const file of files) {
  assert.ok((await stat(path.join(root, file))).isFile(), `Missing diagnostic fixture ${file}`);
}
const browser = await chromium.launch({ headless: true });
const incomplete: { identity: ContextIdentity; phase: string; state: Snapshot }[] = [];
let contexts = 0;
let harnessErrors = 0;
log({ kind: 'configuration', platform: process.platform, node: process.version, browser: browser.version(), viewport: { width: 1440, height: 900 }, maxContexts: smoke ? 1 : 12, nativeObservationOnly: true });
try {
  for (const file of smoke ? files.slice(0, 1) : files) {
    for (let repetition = 1; repetition <= (smoke ? 1 : 2); repetition++) {
      for (const mode of smoke ? modes.slice(0, 1) : modes) {
        const identity: ContextIdentity = { file, mode, repetition, context: ++contexts };
        const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, offline: true, reducedMotion: 'reduce' });
        let phase = 'about-blank';
        const events: NativeEvent[] = [];
        let droppedEvents = 0;
        try {
          await context.addInitScript({ content: instrumentation });
          const page = await context.newPage();
          page.on('console', (message) => {
            const text = message.text();
            if (!text.startsWith(prefix)) return;
            const value: unknown = JSON.parse(text.slice(prefix.length));
            if (!isNativeEvent(value)) return;
            if (events.length >= 250) {
              droppedEvents++;
              return;
            }
            events.push(value);
            log({ kind: 'native-event', ...identity, receivedDuring: phase, ...value });
          });
          page.on('pageerror', (error) => log({ kind: 'page-error', ...identity, phase, errorName: error.name }));
          await page.route(/^https?:/, (route) => route.abort());
          await page.goto('about:blank', { waitUntil: 'load' });
          const url = pathToFileURL(path.join(root, file)).href;
          const sourceUrl = `${url}#sources`;
          const capture = async (checkpoint: string, id = 'sources'): Promise<Snapshot> => {
            const state = await snapshot(page, id);
            log({ kind: 'state', ...identity, phase, checkpoint, targetId: id, contractComplete: complete(state), state });
            return state;
          };
          const settle = async (id = 'sources'): Promise<Snapshot> => {
            const ready = await waitForNativeState(page, id);
            const state = await capture(ready ? 'native-contract-ready' : 'after-5000ms', id);
            if (!complete(state)) incomplete.push({ identity, phase, state });
            return state;
          };

          let finalState: Snapshot;
          if (mode === 'toc-sameurl-immediate-reload') {
            phase = 'plain-file-load';
            await page.goto(url, { waitUntil: 'load' });
            await capture('load-return');
            const links = await page.locator('nav a[href]').evaluateAll((elements) => elements.flatMap((element, index) => {
              const url = new URL(element.getAttribute('href') ?? '', document.baseURI);
              return url.pathname === location.pathname && url.hash
                ? [{ index, id: decodeURIComponent(url.hash.slice(1)) }] : [];
            }));
            assert.ok(links.length > 0 && links.at(-1)?.id === 'sources', 'Diagnostic must follow the actual complete TOC ending at sources');
            for (const link of links) {
              phase = `keyboard-toc-${link.id}`;
              const entry = page.locator('nav a[href]').nth(link.index);
              // The sole element.focus() call represents keyboard entry at a TOC link.
              // No target heading or document body is ever focused by this script.
              await entry.focus();
              await entry.press('Enter');
              await capture('enter-return', link.id);
              await settle(link.id);
            }
            phase = 'same-full-url-goto';
            const traceStart = events.length;
            await page.goto(sourceUrl, { waitUntil: 'load' });
            // Read the already captured first-goto trace without a remote DOM read
            // or wait between the same-URL goto and the immediate second navigation.
            const firstGotoTrace = events.slice(traceStart);
            log({ kind: 'trace-checkpoint', ...identity, phase, eventCount: firstGotoTrace.length, events: firstGotoTrace.map((event) => ({ event: event.event, performanceNow: event.performanceNow, timeOrigin: event.timeOrigin, activeTag: event.activeTag, activeId: event.activeId })) });
            phase = 'immediate-reload-after-same-url';
            await page.reload({ waitUntil: 'load' });
            await capture('load-return');
            finalState = await settle();
          } else {
            phase = 'fresh-file-fragment';
            await page.goto(sourceUrl, { waitUntil: 'load' });
            await capture('load-return');
            finalState = await settle();
            if (mode === 'fresh-settled-then-reload') {
              const preconditionMet = complete(finalState);
              log({ kind: 'fresh-contract-before-reload', ...identity, contractComplete: preconditionMet });
              if (preconditionMet) {
                phase = 'reload-after-verified-fresh-navigation';
                await page.reload({ waitUntil: 'load' });
                await capture('load-return');
                finalState = await settle();
              } else {
                log({ kind: 'reload-precondition-not-met', ...identity, phase, skipped: 'reload-after-verified-fresh-navigation' });
              }
            }
          }
          if (!finalState.hasFocus) {
            phase = 'conditional-tab-activation';
            log({ kind: 'tab-activation-condition', ...identity, beforeHasFocus: finalState.hasFocus, beforeActiveTag: finalState.activeTag, beforeActiveId: finalState.activeId });
            await page.bringToFront();
            await capture('bring-to-front-return');
            await settle();
          }
          log({ kind: 'context-complete', ...identity, eventCount: events.length, droppedEvents });
        } catch (error) {
          harnessErrors++;
          log({ kind: 'harness-error', ...identity, phase, errorName: error instanceof Error ? error.name : 'UnknownError' });
        } finally {
          await context.close();
        }
      }
    }
  }
} finally {
  await browser.close();
}
log({ kind: 'diagnostic-summary', contexts, harnessErrors, incompleteNativeObservations: incomplete.map(({ identity, phase, state }) => ({ ...identity, phase, hash: state.hash, activeTag: state.activeTag, activeId: state.activeId, hasFocus: state.hasFocus, navigationType: state.navigationType, targetFocused: state.targetFocused, targetInViewport: state.targetInViewport, targetUnobscured: state.targetUnobscured })), productionAcceptance: false });
if (harnessErrors > 0) process.exitCode = 1;
