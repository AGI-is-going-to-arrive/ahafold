# AhaFold

**Turn complex ideas into illustrated explanations.**

[简体中文](README.zh-CN.md)

A lightweight, single agent skill for clear HTML explanations, from one concept to
a long document. **Fold**, a curious paper-page character, can demonstrate the idea.
Illustrations and interaction are optional; use your current harness's native image
tool when a scene helps explain the material.

**Private v0.1 development.** Repository access is required to install. This is not a
public release or a claim of full support on all target platforms.
The [focused Codex/Grok audit](tests/focus-validation.md) covers Chinese, English
and mixed-language use. It found real Grok correctness/visual failures and incomplete
tasks; the earlier examples do not establish universal reliability.

## See the result

[![AhaFold long Chinese tool-library guide preview](examples/longform/library/preview.png)](examples/longform/library/index.html)

| Explanation | Scope | Complete HTML | Input and provenance |
| --- | --- | --- | --- |
| Borrowing from a tool library | Chinese · 11 sections | [Read](examples/longform/library/index.html) | [Notes](examples/longform/library/README.md) |
| Did my seats get booked? | English · 11 sections | [Read](examples/longform/retries/index.html) | [Notes](examples/longform/retries/README.md) |
| TypeScript → JSON boundaries | Chinese + English terms/code · 10 sections | [Read](examples/longform/type-boundaries/index.html) | [Notes](examples/longform/type-boundaries/README.md) |
| Sunk cost · 沉没成本 | Compact | [Read](examples/sunk-cost/index.html) | [Notes](examples/sunk-cost/README.md) |
| Recognition versus recall | Compact | [Read](examples/recognition-recall/index.html) | [Notes](examples/recognition-recall/README.md) |
| Compounding · 复利 | Compact | [Read](examples/compounding/index.html) | [Notes](examples/compounding/README.md) |

The three [long guides](examples/longform/README.md) are unchanged Codex outputs
from fresh local AhaFold installations, with zero image calls. Their notes also
link to separately labelled, maintainer-reviewed Grok variants and preserve the
original results. These are complete reading examples; previews show only the opening.

The [Chinese recognition/recall edition](examples/recognition-recall/index.zh-CN.html)
demonstrates a language revision that preserves the original image.

Download or clone the repository, then open an example's `index.html` in your browser;
GitHub's file view displays source. Pages keep their CSS and any small script inline. Illustrated pages embed their
images and retain the originals in the adjacent `assets/` folder.
Readers need no AI account, Node.js, server, or extra model calls.

## What you can make

- An intuitive explanation of an unfamiliar concept.
- A comparison that separates two easily confused ideas.
- A short explanation with a useful step-through or a simple interactive example.
- A long guide with an overview, linked chapters, local diagrams, worked examples,
  and the conditions and exceptions that qualify its conclusions.

Simple requests use the [compact starting point](skills/ahafold/assets/explainer.html).
Substantial material or an explicit long-guide request uses the
[long-form guidance](skills/ahafold/references/longform.md) and
[original multi-section template](skills/ahafold/assets/longform.html). The skill
chooses the representations for the material within the same local-HTML workflow.
Longer work does not require new images.

Images carry the character, situation, action, and a few useful short labels. Long
prose, code, formulas, and complex charts stay in editable HTML/SVG. Images, Fold,
and interaction are optional. You can explicitly request an illustration only.

The author uses their selected harness account and available quota. Generation sends
the supplied material to that provider. AhaFold includes no database, indexer,
standalone service, unified model SDK, or repository-analysis product line.

## Requirements

- Codex, Grok Build, or **Antigravity CLI (`agy`)** with its normal account login.
- Access to that host's native image tool and available quota when an image is needed.
- Node.js **22.20.0 or later** for the pinned `skills@1.5.23` installer.
- Access to this private GitHub repository through authenticated Git. No token belongs
  in an installation command, generated HTML, or an issue.
- A browser to read the output. AhaFold's native workflow needs no extra image API key.

## Install in your project

First check for an existing `ahafold` folder in **both** `.agents/skills/` and
`.grok/skills/`. If one exists, stop and review/back up its changes before installing;
the upstream installer can overwrite an existing installation.

Run from the project where you want to use AhaFold:

```sh
npx skills@1.5.23 add AGI-is-going-to-arrive/ahafold --skill ahafold --copy
```

Choose the target in the installer:

| Harness | Installer agent ID | Project skill path | Invocation |
| --- | --- | --- | --- |
| Codex | `codex` | `.agents/skills/ahafold/` | `$ahafold`; `/skills` |
| Grok Build | `grok` | `.grok/skills/ahafold/` | `/ahafold`; `/skills` |
| Antigravity CLI | `antigravity-cli` | `.agents/skills/ahafold/` | `/ahafold`; `/skills` |

Use **`antigravity-cli`**, not the separate `antigravity` IDE target. `grok-build`
is not an installer ID. To select one host directly:

```sh
npx skills@1.5.23 add AGI-is-going-to-arrive/ahafold --skill ahafold --agent codex --copy
```

Replace `codex` with `grok` or `antigravity-cli` as needed. `--copy` avoids Windows
symlink privileges. Installation is project-scoped. Start a new host session and
check `/skills`; the compatibility table separates documented syntax from observed
product acceptance.

For a local clone, run the same `add` command with a quoted path to the clone instead
of `AGI-is-going-to-arrive/ahafold`. On Windows, use your actual Windows path. If you
prefer manual installation, copy **the entire `skills/ahafold/` folder**, including
`references/`, `assets/`, and `LICENSE`, to the appropriate project path above. Do not
copy only `SKILL.md`. No `pnpm install` is needed by skill users. Global installation
is not part of the verified v0.1 instructions.

## Use it

In Codex, mention `$ahafold`. In Grok Build and Antigravity CLI, use `/ahafold` or ask
naturally. Invocation depends on the host; there is no universal slash command.

```text
Use AhaFold to explain sunk cost to a general reader.
Make one illustrated HTML page and explain where the analogy stops working.
```

```text
Use AhaFold to explain the difference between recognition and recall.
Use short labels in the illustration, and add interaction only if it helps.
```

```text
Use AhaFold to turn material.md into a complete long guide for a general reader.
Write in English. Keep important conditions, exceptions, numbers, and original code.
No images.
```

State the output language explicitly. For a Chinese or mixed-language long guide:

```text
使用 AhaFold 把 material.md 做成完整长篇图解，面向普通读者。
用简体中文写作，保留重要条件、例外和数值；不要图片。
```

```text
使用 AhaFold 把 material.md 做成长篇图解。
解释用简体中文，保留 English 术语与原代码，讲清关键边界；不要图片。
```

To skip images:

```text
Use AhaFold to make an HTML terminology comparison. No character or images.
```

## Edit an explanation

```text
Use AhaFold to rewrite the second paragraph for beginners.
Keep the existing illustration and the rest of the page unchanged.
```

```text
Translate the HTML text into Simplified Chinese. Keep the original image.
Explain any English labels from the image in the Chinese caption.
```

Editing words inside a raster image may require a new native edit or generation.
Changing HTML prose or language preserves unaffected images; their hashes should
stay unchanged. AhaFold does not promise a general dependency-tracking editor.

## Output and lifecycle

Default: `ahafold-output/<topic-slug>/index.html`, with original images in `assets/`.
Your requested path takes precedence. Existing output is versioned unless you
explicitly request replacement. Share the self-contained HTML; keep original files
for provenance and later edits. References need internet when opened, but reading
and ordinary interaction make no network or model requests.

Before updating, review local skill changes. Update only this package using the
same pinned installation command after preserving any changes you want to keep.
To remove this package from the current project after reviewing its content:

```sh
npx skills@1.5.23 remove ahafold -y
```

This targets only the named skill across project agent locations. Codex and
Antigravity CLI share the `.agents` copy; removal affects both. Other skills and
`ahafold-output/` work remain intact. Selecting only three `--agent` targets can
leave the shared copy for other detected agents, so verify the actual folders. Tested installer lifecycle details are in
[the validation report](tests/validation.md).

## Compatibility and limits

Targets: native Windows, macOS, and Linux, across the three hosts. WSL is a separate
Linux environment, not proof of native Windows support. States below describe
**installed AhaFold → native image → saved HTML → offline reading**, not bare-host
image probes. `PARTIAL` does not mean full acceptance.

| Combination | State | Evidence / limitation |
| --- | --- | --- |
| macOS / Codex | PASS | Bounded installed generation/edit and multilingual cases verified; technical case needed an environment/timebox retry. |
| macOS / Grok Build | PARTIAL | Native generation/reference/edit work; focused cases exposed content, image-alignment and mobile failures. Independent review required; watermark remains. |
| macOS / Antigravity CLI | BLOCKED | Testing deferred by user; previous native429 and draft retained. No new CLI call. |
| Windows / Codex | NOT TESTED | — |
| Windows / Grok Build | NOT TESTED | — |
| Windows / Antigravity CLI | NOT TESTED | — |
| Linux / Codex | NOT TESTED | — |
| Linux / Grok Build | NOT TESTED | — |
| Linux / Antigravity CLI | NOT TESTED | — |

Dated versions, deterministic CI, image call counts, and remaining release gates
are recorded in [tests/validation.md](tests/validation.md). Deterministic CI cannot
prove OAuth image generation on a different operating system.

The separate [long-form evaluation](tests/longform/results.md), dated 2026-09-05,
used six fresh installed Codex/Grok sessions with no images; all six completed.
Independent review found all 60 required facts consistent in the three raw Codex
outputs. Grok mentioned all 60, but only 56 were consistent: three contradictory
passages affected four checks. One Grok run produced Chinese from English material
and an English prompt that had no explicit “Write in English” clause. Reviewed
examples retain their correction records; the raw results and earlier failures
remain part of the evidence. Browser results and outstanding checks are in that report.
The Windows long-form CI gate remains **FAIL**: native heading focus can be lost
after reload, including after a verified fresh deep link with JavaScript disabled.
macOS/Linux checks passed. This development iteration has not cleared every release gate.

Short labels, Fold identity, reference-image input, and image editing are separate
checks. A logged-in account does not guarantee quota. Cost is unknown and usage is
not unlimited. Inspect every image: a strict no-visible-watermark task may not be
satisfied by a particular provider. Keep supplier markings and original bytes;
“no visible watermark observed” does not mean an image has no provenance marks.

Missing native tools, 429/auth failures, and uncertain outcomes stop that image
route. A readable draft may still be delivered with its limitation stated. No
silent retries, credential extraction, endpoint switching, or API fallback.
Claude Code, OpenCode, DeepSeek, and other-harness fallback remain future plans.
AhaFold does not publish pages automatically.

## Contributing and license

Original skill, templates, scripts, and project-held asset rights: [MIT](LICENSE).
See [NOTICE.md](NOTICE.md) for AI-generated Fold provenance, image-rights limits,
and inspiration from [Ian Xiaohei Illustrations](https://github.com/helloianneo/ian-xiaohei-illustrations)
and [visual-explainer](https://github.com/nicobailon/visual-explainer).

The original long-form template draws methodological inspiration from the local
visual-explainer snapshot `7163c3e`: representation choice, overview/detail structure,
contents navigation, and claim review. See the [source comparison](tests/longform/README.md).
No upstream implementation was copied. This comparison does not establish equal or
better generated-output quality in a matched test.

Contribute reproducible examples, language improvements, and dated compatibility
results without tokens, private material, or raw session logs. Maintainer checks:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm run typecheck
pnpm run test:checks
pnpm run test:install
pnpm run check:package
pnpm run test:examples
pnpm run test:longform
```

These development dependencies are outside the installable skill. See
[behavior cases](tests/cases.md) for E01–E06 and the native acceptance checklist.
Keep the repository private; public publication requires a separate decision.
