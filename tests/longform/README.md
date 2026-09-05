# Long-form development and acceptance

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
requires the template, three delivered long guides and their three reviewed Grok
variants; missing examples fail. The suite checks 320/390/768/1440px,
contents focus, fresh deep-link focus followed by reload, keyboard scroll/disclosures,
screen-size SVG text, offline resources, axe, no-JS reading, A4 print and actual
200% Chromium page zoom. Zoom uses a temporary isolated test extension, never a
personal browser profile or a product dependency.

Fresh deep links start from `about:blank` at the four regular widths and with
JavaScript disabled, then verify reload separately. The actual 200% lane checks
TOC navigation and reading in the already-open page, including unchanged zoom
metrics; it does not test fresh cross-document entry or reload at 200%. Earlier
Windows focus failures on the interactive-history reload path remain documented
in the [navigation evidence](windows-navigation.json).

The latest executable-code run also failed Windows reload focus after a verified
fresh deep link with JavaScript disabled. The assertion is retained, and the
Windows release gate remains **FAIL**; see the [final result](results.md).

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
