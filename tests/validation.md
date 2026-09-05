# v0.1 development validation

Date: 2026-09-05, Australia/Melbourne. Private development; not a public release.
This report separates deterministic checks, observed native-host behavior, and
remaining release requirements. Earlier bare-host image probes and the character
master do not count as installed AhaFold acceptance.

## Environment and image budget

- Local OS: macOS 26.6.2 (25G83), arm64.
- Node.js 26.8.1; pnpm 11.24.0; installer `skills@1.5.23`.
- Codex CLI 0.153.4, default reasoning model `gpt-6-astra`.
- Grok Build 1.0.13 (5e9a58528b76), default reasoning model `grok-4.6`;
  configured native image model `grok-imagine-image-2.0` (configuration is not an
  independently verified backend snapshot).
- Antigravity CLI 1.1.26; image failure disclosed `gemini-3.1-flash-image`.
- Initial batch: 5 image calls, counting retries. One additional native Grok edit
  was announced and completed. Total so far: 6 calls, 5 valid images and one quota
  failure, zero automatic retries. Overall cap: 15.
  Three matching sunk-cost baselines plus two additional Codex examples. No
  reference-image input in these baseline calls; text identity is used.
- Current-host native OAuth only. Image cost is unknown. No image API runner,
  token extraction, cross-host fallback, or global configuration change.

## Installation and lifecycle

All operations used isolated temporary project directories with Chinese and spaces
in their names; existing user installations and the two upstream repositories
were untouched. Local installation selected exactly one `ahafold` skill:

```sh
npx skills@1.5.23 add ./ahafold-source --skill ahafold --agent codex grok antigravity-cli --copy -y
```

`./ahafold-source` means the actual local checkout selected for the test. All 9
installed resource files matched source bytes on all targets; no symlinks were
required. Codex and Antigravity CLI share `.agents/skills/ahafold/`; Grok uses
`.grok/skills/ahafold/`. The independent copied-package check also passes outside
the repository. This proves packaging on this macOS host, not native Windows/Linux.

Observed installer behavior:

- Reinstalling with `-y` overwrote a deliberately modified test skill. README
  preflight instructions therefore require inspecting and preserving conflicts.
- `remove ahafold --agent codex grok antigravity-cli -y` removed the Grok copy but
  retained the canonical `.agents` copy for other detected agents sharing it.
- `remove ahafold -y` removed the named project skill completely. Unrelated test
  skills and a generated-output sentinel remained byte-identical.
- No global installation was exercised. Host selectors/slash UI are documented
  conventions; observed native sessions used natural-language AhaFold requests.

## Native matrix

| Combination | State | Evidence / limitation |
| --- | --- | --- |
| macOS / Codex | PASS | Installed references/template → three fresh native images → saved standalone HTML → independent offline desktop/mobile checks passed. Reference input/edit untested. |
| macOS / Grok Build | PARTIAL | Native generation saved image/HTML but baseline exited1 at18-turn cap. A separate one-call native edit corrected the front folded corner; final HTML update is in progress. Watermark remains. |
| macOS / Antigravity CLI | BLOCKED | One `generate_image` call returned 429 QUOTA_EXHAUSTED; no image, readable draft retained. |
| Windows / Codex | NOT TESTED | No native Windows OAuth test machine available. |
| Windows / Grok Build | NOT TESTED | No native Windows OAuth test machine available. |
| Windows / Antigravity CLI | NOT TESTED | No native Windows OAuth test machine available. |
| Linux / Codex | NOT TESTED | No Linux OAuth host acceptance performed. |
| Linux / Grok Build | NOT TESTED | No Linux OAuth host acceptance performed. |
| Linux / Antigravity CLI | NOT TESTED | No Linux OAuth host acceptance performed. |

The Antigravity run exited 0 despite its image-tool error; the product correctly
kept a [clearly labeled draft](host-artifacts/antigravity-sunk-cost-draft/index.html)
and did not retry. Maintainer review corrected one cost-term error and replaced
  an over-specific, tiny SVG with neutral readable HTML comparisons; the committed
  draft is thus a corrected draft, not an unmodified native success. Its reset timestamp was not used to poll or automatically resume.
Codex's native system-browser file URL was rejected by browser security policy;
that host did not claim browser checks passed. Maintainer validation uses a
separate headless, offline Chromium instance without personal browser state.

## Deterministic and behavioral checks

- TypeScript typecheck: PASS.
- Eight meaningful package-checker regression tests: PASS. They cover frontmatter,
  path escapes/missing anchors, hidden second skills/resources, PNG corruption,
  private paths, and bilingual command/state drift.
- Template: PASS at 1440×900 and 390×844. Offline, no requests/errors/overflow;
  keyboard focus, Enter/Space disclosure, and axe checks pass. Independent review
  checked the SVG text contrast that automated axe marked incomplete.
- E01–E03: PASS for original illustrations, exact labels, explanation/analogy
  boundaries, and desktop/mobile offline browser checks. E03 numeric tests cover
  0/1/10/30 years and 0/0.1/5/20 percent, Reset, visible values, and actual SVG
  timeline coordinates against the fixed year30 endpoint.
- E05: PASS in a new installed Codex session; the result exactly equals the original
  HTML with one requested paragraph replacement. Every other byte and image hash
  is unchanged; no image call.
- E04 produced an actual [no-image terminology page](host-artifacts/e04-terminology/index.html)
  in an installed Codex session. Zero image calls; offline desktop/mobile browser
  checks pass. No illustration or native-image reference was needed.
- Seven failure decisions and four trigger boundaries: PASS in a finite independent
  reviewer replay of the installed skill. This was not blind and is not a native
  execution test; input fixtures/expectations are in [cases.md](cases.md).
- CCG change/quality/security/module checks are required before final synchronization.
  The independent quality/security/module review found no unresolved Critical/High.
- Three-system CI is configured for Node 22.20.0, without OAuth. Runner conclusions
  are pending the first verified push; configuration alone is not a pass.

## Remaining release requirements

- Finish E06 language-revision verification; E01–E05 and three core examples pass.
- Finish English/Chinese README-only onboarding and first text modification.
- Obtain a successful Antigravity native image; verify all six Windows/Linux
  host combinations before claiming full three-system support.
- Finish Grok HTML finalization after the successful native correction. Preserve
  its watermark; strict no-visible-watermark tasks remain unmet on this route.
- Codex/Antigravity reference-image input and raster editing remain untested.
  Grok's input-image edit is separately verified; master-sheet fidelity is untested.
- Complete exact-commit CI, authenticated remote install, final privacy/link/license
  checks, and a local release-candidate package. Public publication remains unauthorized.
