# AhaFold v0.1 validation

2026-09-05, Australia/Melbourne. Private development; no public release.
The single-skill implementation and macOS examples are usable. A formal release
claim covering every target OS/host is not yet supported by evidence.
Earlier bare-host image probes and the pre-development character master are excluded
from installed AhaFold acceptance.

## Environment and native budget

| Item | Observed version / scope |
| --- | --- |
| Local OS | macOS26.6.2,25G83,arm64 |
| Maintainer tools | Node26.8.1, pnpm11.24.0; focused checks also passed on installed Node22.22.0 |
| Installer | skills@1.5.23, project-scoped copy installation |
| Codex | CLI0.153.4; reasoning model gpt-6-astra; native image tool image_gen.imagegen |
| Grok Build | 1.0.13 (5e9a58528b76); reasoning default grok-4.6; native image_gen and image_edit |
| Antigravity CLI | 1.1.26; native generate_image error disclosed gemini-3.1-flash-image |

**6 of15 image calls used:** three matching sunk-cost baselines, two further
Codex examples, and one separately announced Grok correction/edit. Five calls
returned valid images; Antigravity's single call was quota-blocked. Zero automatic
retries. E04–E06, README text edits, and Grok HTML finalization made zero image calls.
Baseline calls used text identity, not an image reference. Grok's edit used its
original generated image as input; master-sheet input fidelity was not tested.

Only each current host's native OAuth route was used. Image cost and exact backend
snapshots were not disclosed independently. Codex CLI JSON events did not expose
a complete image-tool trace; its counts are supported by fresh files and session
results, not a complete invocation-event record. Grok's local native model override is
configured as grok-imagine-image-2.0; that is configuration evidence. Codex official
documentation identifies its built-in model as gpt-image-2; that is not proof of an
exact snapshot. No token extraction, direct images API, provider fallback, or global
configuration change was implemented.

## Installation and lifecycle

PASS on this macOS host, using isolated directories with Chinese and spaces:

- Local checkout installation selected exactly one ahafold skill for all three IDs.
- Authenticated private-remote installation used the real repository and all three
  targets. All9 resource files matched the committed skill bytes, without symlinks.
- The detached-copy check verifies that all relative resources resolve outside the
  repository; the character PNG decodes and retains its approved SHA-256.
- Codex/Antigravity CLI use .agents/skills/ahafold; Grok uses .grok/skills/ahafold.
  Grok's command catalog explicitly included ahafold. Native sessions demonstrated
  natural-language/explicit skill routing and reading of the packaged resources;
  interactive /skills selector clicks were not separately tested.
- Reinstalling with -y overwrote a deliberately modified test skill. README preflight
  therefore requires reviewing and preserving an existing same-name installation.
- remove ahafold --agent codex grok antigravity-cli -y retained the canonical copy
  for other detected agents sharing that location. remove ahafold -y removed the
  named project skill completely. Unrelated skills and an output sentinel survived
  byte-for-byte. No global installation was tested.

Verified private-remote command (run from an empty test project):

```sh
npx skills@1.5.23 add AGI-is-going-to-arrive/ahafold --skill ahafold --agent codex grok antigravity-cli --copy -y
```

## Installed native acceptance

PASS means installation → packaged references/template → native image → saved
HTML → independent offline reading, with the qualifications in each row. It is not
a claim that every prompt, model, image-reference feature, or strict watermark
requirement works.

| Combination | State | Evidence / limitation |
| --- | --- | --- |
| macOS / Codex | PASS | Three fresh native illustrations and finished HTML pages; CLI exits0; offline desktop/mobile checks pass. Reference/edit untested. |
| macOS / Grok Build | PASS | Generation, one native correction, and zero-image HTML continuation completed. Visible watermark retained; strict no-watermark use unmet. |
| macOS / Antigravity CLI | BLOCKED | Installed resources read; one native429 QUOTA_EXHAUSTED, no image; useful draft preserved. |
| Windows / Codex | NOT TESTED | No native Windows OAuth test machine available. |
| Windows / Grok Build | NOT TESTED | No native Windows OAuth test machine available. |
| Windows / Antigravity CLI | NOT TESTED | No native Windows OAuth test machine available. |
| Linux / Codex | NOT TESTED | No Linux OAuth host acceptance performed. |
| Linux / Grok Build | NOT TESTED | No Linux OAuth host acceptance performed. |
| Linux / Antigravity CLI | NOT TESTED | No Linux OAuth host acceptance performed. |

Grok's original run exited1 at its18-turn cap after saving a valid image and HTML.
The original front corner drifted left. The separately budgeted image_edit exited0
and corrected the corner, and a zero-image continuation exited0 with a complete
versioned HTML artifact. The original and corrected images are retained in the
[Grok artifact](host-artifacts/grok-sunk-cost/README.md), with hashes and process
qualifications. A maintainer prose correction clarified common future obligations.

Antigravity exited0 despite the image error. Its preserved
[draft](host-artifacts/antigravity-sunk-cost-draft/index.html) is explicitly missing
an illustration. Maintainer review corrected a cost-term error and replaced a
misleading, tiny SVG with neutral readable HTML comparisons. It is a corrected
draft, not an accepted native-image result. The reported quota-reset time was not
used for polling or an automatic retry.

Codex host browser attempts were blocked by native URL/permission policies and
were not claimed as passes. Planned maintainer checks use separate headless,
offline Chromium without personal browser state; no blocked native-browser action
was retried through that browser.

## Behavior, sources, and reading checks

| Case | State | Observed outcome |
| --- | --- | --- |
| E01 | PASS | Chinese sunk-cost illustration, correct short labels, future-choice explanation and analogy limits. |
| E02 | PASS | English recognition/recall distinction, correct labels, comparable actions and optional native disclosures. |
| E03 | PASS | Explicit fixed assumptions, editable formula, two controls and quantitative timeline agree. |
| E04 | PASS | Installed Codex generated [terminology HTML](host-artifacts/e04-terminology/index.html) with zero images/character/extra interaction. |
| E05 | PASS | One requested paragraph replacement; every other source HTML byte and image hash unchanged. |
| E06 | PASS | [Chinese derivative](../examples/recognition-recall/index.zh-CN.html), original English/CSS/JS/embedded-image bytes preserved; raster labels remain English with Chinese meanings. |

English and Chinese first-work authors started from the corresponding README and
an installed package, with educational inputs/source summaries and a bounded image
budget. They did not read the research workspace. Both located the completed file
and made a zero-image text/language revision. Installation itself was exercised
separately using the README command above; this was not an unaided human usability
study. Sample inputs, two fetched sources per core concept, hashes, and image
provenance accompany each [example](../README.md#see-the-result).

- Desktop1440×900 and mobile390×844: offline, no network/resource/script errors,
  no whole-page overflow, original/embedded hashes match, useful alt/captions,
  keyboard focus and disclosures, axe WCAG2.2AA checks pass for shipped pages.
- Compounding: 0/1/10/30 years,0/0.1/5/20 percent;100/105/162.89 at the stated
  defaults; zero-rate boundary, visible interest/comparison values, keyboard and
  Reset pass. Actual SVG start/end coordinates match the fixed year30 time axis.
- Grok: Arrow-key radio navigation and Reset work; including or excluding the
  common800-unit past cost leaves the hypothetical ranking difference at160.
- Independent image inspection checked the three identity points, actions, exact
  short labels and visible marks. Codex samples showed no visible watermark;
  supplier metadata remains. Fine hand shapes vary; no exact character-fidelity
  guarantee is made.
- Seven failure judgments and four trigger boundaries pass a finite independent
  replay from the installed skill. This was not blind, and is not a live tool
  execution test. See [cases](cases.md) and [fixtures](fixtures/native-outcomes.json).

## Deterministic verification and CI

Typecheck,8 package-checker regression tests, independent package checks and
browser checks pass locally. CCG change/quality/security/module checks found no
unresolved Critical/High issues. Normal CLI output and long lines were nonblocking;
the first-commit change analyzer's zero line counts were superseded by actual Git
numstat/review. Final candidate scanning found no private paths, credentials, or
raw conversation logs. Both upstream reference repositories remained clean.

Three-system CI uses Node22.20.0 and no OAuth. The
[first run](https://github.com/AGI-is-going-to-arrive/ahafold/actions/runs/33934821426)
found a test bug: closed nested details descendants could have layout rectangles
but were not keyboard Tab stops. The checker now explicitly evaluates closed
ancestors, tests nested disclosures after opening their parents, and tests native
radio groups with Arrow keys. The corrections passed focused Node26 and installed
Node22.22 checks, then all three exact Node22.20.0 jobs passed on code/evidence
commit `7ce76db368aaf013603f4f819f198f1f21edd6c1` in
[run33935496781](https://github.com/AGI-is-going-to-arrive/ahafold/actions/runs/33935496781).

| Deterministic CI runner | Conclusion | Completed (UTC) |
| --- | --- | --- |
| Windows latest / Node22.20.0 | PASS | 2026-09-05 01:18:34 |
| macOS latest / Node22.20.0 | PASS | 2026-09-05 01:14:22 |
| Ubuntu latest / Node22.20.0 | PASS | 2026-09-05 01:14:42 |

Each job completed dependency installation, browser installation and `pnpm run check`.
Subsequent changes only record validation and improve the preview screenshot;
their current job conclusions remain visible in
[Actions](https://github.com/AGI-is-going-to-arrive/ahafold/actions). A queued job is
not a pass. Deterministic CI does not establish native OAuth support on that OS.

## Remaining release gates

- Obtain a successful Antigravity installed native-image result after quota is
  available, without automatic retries or fallback.
- Verify the six Windows/Linux OS×host combinations before claiming complete
  three-system native support; WSL is not native Windows evidence.
- Codex/Antigravity reference-image input and raster editing remain untested.
  Grok input-image edit is verified; master-sheet fidelity remains untested.
- Strict no-visible-watermark work is not supported by the observed Grok route.
- Public release/registry publication remain unauthorized; the repository stays private.

## Local package artifact

The local archive `output/ahafold-v0.1.0-dev.zip` was created from commit7ce76db,
contains only the9 skill resource files (plus containing directories), and was
extracted into a separate directory. Every extracted file matched source bytes.
Archive size:1,180,998 bytes. SHA-256:
`c2b30b66462cd34ed3c63bfe3b81d6611055178a41eff01aa3c6378a30bf0545`.
The ZIP is a private local development artifact, not a published release. Its
resource content is unchanged by later validation-only documentation commits.
