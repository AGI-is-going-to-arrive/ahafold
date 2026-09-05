# Long-form results · 2026-09-05

AhaFold now has a long-form authoring path, an original eight-section template,
and three substantial delivered guides. Six fresh installed-host sessions completed
normally. That is lifecycle evidence, not six successful content acceptances:
Grok still produced three contradictory passages and did not produce English for
the English-material scenario. Its raw retry guide also failed print containment.

## What changed

- `SKILL.md` chooses a compact or long starting point from the supplied material.
- `references/longform.md` adds a source/claim outline, overview plus local detail,
  native contents navigation, varied representations, exception coverage, complete
  saved drafts and cross-page consistency checks.
- `assets/longform.html` demonstrates those mechanisms in an original queue guide.
  It has no JavaScript, external fonts, network requests or generated pictures.
- Explanation rules require preserving exact supplied code, separating compile-time
  assertions from runtime checks, rounding only displayed numeric results and
  checking SVG labels at their actual screen size.
- Maintainer checks require all delivered examples, test real navigation and reading
  behavior, and reject missing package resources. Money assertions no longer allow
  a one-cent tolerance. The detached install unit has 11 files including its license.

The [local visual-explainer comparison](README.md#source-comparison) explains which
mechanisms informed the work. Its upstream files were not changed. This is not a
matched benchmark demonstrating equal visual quality or feature breadth.

## Fresh installed sessions

Each host received only an original supplied material and the same frozen installed
skill, never the separate expectation oracle. Cases ran serially within each host,
with a 1,200-second limit per case and a 40-turn limit for Grok. There were no image
calls, host substitutions or maintainer edits to the raw artifacts.

| Host / material | Completion | Seconds | Consistent required facts | Other raw-output result |
| --- | --- | ---: | ---: | --- |
| Codex / Chinese library | Normal, exit 0 | 857.7 | 24/24 | Browser checks pass; 11-section delivered guide is byte-identical. |
| Codex / English retries | Normal, exit 0 | 667.6 | 16/16 | English output; browser checks pass; 11 sections. |
| Codex / mixed TypeScript | Normal, exit 0 | 773.9 | 20/20 | Chinese with English terms and exact code; browser checks pass; 10 sections. |
| Grok / Chinese library | Normal, exit 0 | 755.9 | 23/24 | One date figure joins incompatible example times; browser mechanics pass. |
| Grok / English retries | Normal, exit 0 | 816.3 | 16/16 | Chinese output; four screen widths pass, A4 containment fails. |
| Grok / mixed TypeScript | Normal, exit 0 | 586.9 | 17/20 | Two prose errors affect three checks; detailed code/table and browser mechanics pass. |

All 60 required facts were mentioned by each host. Codex's 60 were consistent in
this review; Grok's three contradictory passages affected four required checks,
leaving 56 consistent. These counts describe this small supplied-material set,
not general model accuracy. The independent review also checked support for 32
understanding/transfer questions; no human learner study was conducted.

The retry prompt and source were English but did **not** explicitly say “write in
English.” The intended English scenario was therefore not achieved by Grok; the
evidence does not prove it disobeyed an explicit language instruction. User-facing
usage examples now state the desired output language directly.

The [host ledger](host-runs.json) contains exact prompts, input/skill/output hashes,
completion and call counts. [Raw artifact hashes](artifacts.json) identify the six
unchanged outputs. Earlier failed and incomplete tests remain in `tests/focus/`;
they are not relabeled as passes.

## Corrections in delivered Grok variants

| Variant | Maintainer correction | Boundary |
| --- | --- | --- |
| [Library](../../examples/longform/library/grok-reviewed.html) | Label the hold-confirmation and handoff dates as independent examples; correct the figure's description and caption. | A factual figure correction, not a new host success. |
| [Retries, Chinese](../../examples/longform/retries/grok-zh-reviewed.html) | Print-only code wrapping, margin and long-label fixes; display the existing default numeric output without JavaScript. | CSS-only; keeps the Chinese text and original script. Not an English edition. |
| [Type boundaries](../../examples/longform/type-boundaries/grok-reviewed.html) | State that theta's extra fields are accepted; describe eta as failing before Response rather than before the request. | Two prose corrections; original code and response records preserved. |

The three default `index.html` guides are unchanged Codex outputs. Every raw Grok
output remains available beside the test evidence. [Curation hashes](curation.json)
separate raw and reviewed files; all script blocks remain unchanged in the reviewed
variants. The retry variant differs only inside its stylesheet.

## Verification and limits

Local `pnpm run check` passed on macOS: typecheck, 11 package regression cases,
detached package integrity, actual pinned-installer lifecycle, 16 existing short-page
viewport cases and 28 new long-page viewport cases. No new runtime dependency was
added. The full browser suite covers the original template, three default guides
and three reviewed Grok variants:

- 320, 390, 768 and 1440px: document containment, offline resources, script errors,
  native contents/deep-link focus, keyboard disclosures/local scrolling and axe.
- A4 print containment; preserved static narrative, headings, control defaults and
  numeric outputs with JavaScript disabled. Capability notices may differ.
- Actual Chromium page zoom at 200%, with viewport width and device-pixel-ratio
  assertions. The temporary extension uses an isolated disposable profile.
- Exact 30-state refund values, 15 dispute values, invalid input and reset behavior;
  deposit-bar proportions use a separate geometric tolerance.
- SVG labels at rendered size: the template minimum was 16.98px, reviewed Grok
  library 14.73px and reviewed Grok retry 15.03px across the tested widths. Other
  guides use HTML text for these representations; a missing SVG is not a font pass.

[Browser measurements](browser-results.json) are dated and bound to artifact
hashes. The [semantic review](semantic-review.md) separately checks source coverage,
exact code/response preservation, retry timing and controlled runtime outcomes.
Those independent checks include eight supplied response records through both
original and parsed functions, plus URI-encoding and property-access boundaries.
Browser automation alone would miss the Grok prose and date-figure errors.

Independent change/quality/security/module review found no reproducible Critical
or High issue. CCG checks passed with non-blocking test-file length, line-length
and single-skill structure notices. The reviewer separately compiled the two
displayed TypeScript examples with local `tsc` and verified 16 controlled outcomes,
with no real network request; raw hashes and candidate-file privacy scans passed.

Windows CI exposed an additional navigation-test problem. The first run failed a
one-shot focus assertion after reload; waiting five seconds still failed on a
different page. A standalone 12-context Windows diagnostic passed, but the
instrumented full flow reproduced the failure on the Grok library at 320px: the
visible, focusable target never received focus in the reloaded document, while
`BODY` remained active and the document itself had focus. This is not established
as a short delay, inactive tab, hidden target or page-specific code defect.

The former “fresh deep-link” check ran after already following the last TOC link,
then reopened that same URL and refreshed it. It did not test a genuinely fresh
deep-link document. The corrected setup retains every TOC assertion, opens
`about:blank` and then the full fragment URL, checks native focus/visibility/
occlusion, and only then reloads and checks the complete contract again. At real
200% zoom, a separate lane checks the already-open page's native TOC, reading,
layout, fonts and calculations, including unchanged zoom metrics after navigation.
It does not test fresh cross-document entry or reload at 200%: Chrome resets the
file page's zoom when leaving through `about:blank`, and zooming after a fragment
load can change the viewport's position. Browser zoom preference persistence is
not an HTML behavior. Neither DOM focus, target scrolling nor CSS zoom is assigned
to manufacture a pass.

This changes the tested history path. **The earlier interactive-history reload
failure remains an observed Windows limitation; it is not claimed fixed.**
[Selected event evidence and all run references](windows-navigation.json) preserve
the failed results and the scope of the successful standalone diagnostic. The
exact Chromium history/scroll-restoration cause remains unestablished. The current
Actions run determines the revised acceptance result; no skill or example bytes
changed during this investigation.

The raw Grok retry page exposed roughly 1,019px of A4 horizontal overflow. Its
default numeric feedback was also hidden without JavaScript; the existing static
table and capability notice remained readable. Those faults are corrected only in
the reviewed variant. The raw run stopped at print failure, so later full no-JS and
zoom stages are not reported as having passed on that raw file.

Desktop previews were inspected; an independent visual reviewer also read 12
existing first-screen and six desktop full-page screenshots. No immediate visual
blocker was found, but the guides remain conservative. At 320px all six first
screens require scrolling to finish the core answer. Wide comparison tables need
substantial horizontal reading, several titles leave short orphan lines, and the
Grok retry overview uses six prose blocks where a client/server sequence could
make the missing-response relationship clearer. Repeated callouts, section
numbering and host-dependent typography show room for more variety and consistency.
The Impeccable detector ran
once and reported six accent-border warnings in the unmodified Codex outputs.
Its HTML parser dependencies were unavailable, so it degraded to regex; that scan
does not establish computed contrast or an exhaustive visual audit. Browser axe
checks and rendered SVG-size checks are separate evidence. Raw host examples were
kept byte-identical rather than cosmetically rewriting the evaluation artifacts.

All six sessions finished, but the larger inputs and time/turn limits differ from
the earlier focused tests. This does not establish that the skill change caused a
completion-rate improvement. Codex retries first saved head/CSS at 172.6 seconds
and only reached a complete HTML envelope at 541.1 seconds. Early complete draft
checkpointing is therefore not consistently demonstrated. An HTML envelope alone
also does not prove complete factual coverage.

This batch made **0 image calls**; the cumulative earlier count remains **9/15**.
The earlier Grok picture/action and watermark limitations were not retested here.
Antigravity CLI remains deferred. Cross-OS deterministic CI does not establish
native OAuth authoring on Windows or Linux. No claim of universal correctness,
human comprehension gains or visual parity with visual-explainer is made.

To reproduce the deterministic checks:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm run check
```

To inspect a preserved raw artifact, for example:

```sh
pnpm run test:longform --artifact tests/longform/artifacts/grok-retries/index.html
```

That specific command is expected to expose the retained print failure. Scoped
artifact runs are diagnostic and do not replace the full seven-page check.
