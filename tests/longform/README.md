# Long-form development and acceptance

The first six runs below intentionally prohibited images and are no-image controls.
The [illustrated correction](illustrated-results.md) separately records two current-Codex
native scenes, the updated joint picture/text workflow and the integrated long guide.

User-authorized scope: extend AhaFold from short concept explanations to long,
complex supplied material, while keeping one independent skill and current-host
native image behavior. Antigravity CLI remains deferred. Earlier failed snapshots
under `tests/focus/` are preserved and are not rewritten into successful tests.

## Source comparison

The inspected local visual-explainer snapshot is `7163c3e`. This is a source-code
and instruction comparison, not a matched output-quality benchmark of both skills.

| Mechanism | Inspected source | AhaFold implementation |
| --- | --- | --- |
| Representation chosen for the material | `plugins/visual-explainer/SKILL.md:41–67` | Compact or long starting point; semantic tables, runtime paths, comparisons and exact HTML/SVG. |
| Overview plus local detail for complex relationships | `SKILL.md:63,73–88` | A small overview and linked subsections; one readable map is not required to contain every detail. |
| Contents for four or more major sections | `SKILL.md:52`; `references/responsive-nav.md:35–68` | Native fragment links, desktop sidebar/mobile contents, focus destinations, no-JS navigation. |
| Prose and supplementary detail | `references/css-patterns.md:267–309,1366–1368,1427–1456` | Different reading depths, bounded prose width, wide figures/tables and native disclosures. |
| Source coverage and fact verification | `SKILL.md:120–121`; `commands/fact-check.md` | Source/claim outline, conditions/exception coverage, consistent summaries/diagrams/feedback; no separate command or service. |

The reference implementation also contains CDN/font dependencies and older small
type values. Those are not AhaFold's implementation. AhaFold uses its original
white/apricot/teal design and packaged offline resources. No upstream file changed
and no substantive upstream implementation was copied; see [NOTICE](../../NOTICE.md).

## Inputs and independent expectations

- [Chinese tool-library rules](inputs/library.md): 24 facts, inventory/application/
  loan states, time boundaries, eligibility, waitlisting and exact deposit arithmetic.
- [English retry protocol](inputs/retries.md): 16 facts, uncertain outcomes,
  idempotency scope, payload binding, retry waits, pending operations and event order.
- [Mixed TypeScript boundaries](inputs/type-boundaries.md): 20 facts, original code,
  static/runtime distinctions, eight response cases, a parser and security limits.

These are substantial original supplied materials, not instructions about how to
lay out the answer. The separate [expectations](expectations.json) contain60
required facts, 32 understanding/transfer questions, 18 forbidden overclaims,
30 deposit values, retry timing and controlled-code oracles. Generating hosts
receive only the material and installed skill; they never receive this oracle.

## Verification layers

The packaged [long-form template](../../skills/ahafold/assets/longform.html) is a
filled six-job queue explanation and clearly identifies itself as a template.
It is not evidence that a host generated a fresh image or completed a user's guide.

`pnpm run test:longform --template-only` checks that template. The full command
requires eight pages: the template, three original long guides, their three reviewed
Grok variants and the illustrated library; missing examples fail. The suite checks 320/390/768/1440px,
contents focus, fresh deep-link focus, reload visibility and keyboard continuation, keyboard scroll/disclosures,
screen-size SVG text, offline resources, axe, no-JS reading, A4 print and actual
200% Chromium page zoom. Zoom uses a temporary isolated test extension, never a
personal browser profile or a product dependency.

Fresh deep links start from `about:blank` at the four regular widths and with
JavaScript disabled, then verify reload separately. The actual 200% lane checks
TOC navigation and reading in the already-open page, including unchanged zoom
metrics; it does not test fresh cross-document entry or reload at 200%. Earlier
Windows focus failures on the interactive-history reload path remain documented
in the [navigation evidence](windows-navigation.json).

The earlier executable-code run failed Windows reload focus after a verified
fresh deep link with JavaScript disabled; that historical **FAIL** remains in the
[original result](results.md).

### Reload repair and acceptance boundary (2026-09-12)

The Ubuntu and Windows jobs for `ffb200a` also reproduced a visible `#sources`
heading with `BODY` focused after reload. Reload focus and the next Tab are now
checked separately from an explicit link activation: native reload does not
promise page-load autofocus, and the page must not steal focus from a reader.

The current template and all seven published long-form examples repair a lost
starting point only on the untouched reader's first ordinary Tab after reload.
They do not focus or scroll on load. Pointer, wheel, touch, another key, a changed
hash, another focused control, an offscreen or covered heading, and modified Tab
all prevent the repair. The same Tab continues natively beyond the heading.
The six default/reviewed examples receive only the same appended repair script;
their original HTML, prose, existing scripts and embedded images remain unchanged.
The historical raw outputs under `tests/longform/artifacts/` remain byte-identical.
The Windows job for `20ef253` exposed the same real first-Tab failure in the retry
example, so the repair covers every published long-form page.

Every fixture still has strict TOC activation, fresh deep-link focus, hash,
viewport, occlusion and JavaScript-enabled post-reload keyboard continuation
checks. Ten separate fault-injection cases exercise each distinct repair script's guards; they do
not move focus on behalf of the ordinary navigation checks.

With JavaScript disabled, only the observed native `BODY` → first page control
reload failure is classified as a browser limitation. It is recorded with file,
width, focus before/after and `continued: false` in `output/longform-checks/results.json`,
printed as `LIMITATION`, and excluded from navigation PASS claims. Other
unexpected destinations, missing headings, wrong fragments, occlusion, broken
links or JavaScript-enabled failures still fail CI. Core no-JS reading and
explicit navigation remain strict. This is a revised supported contract, not a
claim that the browser's no-JS reload behavior was fixed. Use the visible page
contents to resume the desired section if that native limitation occurs.

Money checks compare displayed precision exactly with a full-precision oracle;
the earlier tolerance that could hide one-cent errors is removed. Geometry uses
separate tolerances. Rendering checks do not establish factual completeness or
explanatory quality; those require comparing the actual page with the supplied
material and independent expectations.

The six installed sessions completed on 2026-09-05. See the qualified
[results](results.md), [independent semantic review](semantic-review.md),
[installation and host ledger](host-runs.json), [raw artifact hashes](artifacts.json)
and [example curation record](curation.json). Raw host logs remain outside the
product repository. These six sessions made zero image calls.
