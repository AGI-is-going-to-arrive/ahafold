# AhaFold v0.1 acceptance cases

These cases are observations to make in a new session after installing the actual skill. They are not passed by finding matching words in `SKILL.md`. Earlier standalone harness probes do not satisfy these cases. Record the date, OS, host version, installed resource hashes, image-call count, relative output path, tool result, image hash/dimensions, and the observer's result. Keep credentials and raw session logs outside the repository.

The deterministic commands below do not contact an image provider or establish image semantics, host discovery, or independent README onboarding:

```sh
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run test:checks
pnpm run check:package
pnpm exec playwright install chromium
pnpm run test:examples
```

`check:package` validates one independent skill, YAML metadata, packaged resources, decoded PNG pixels/CRCs, detached copies with spaces and Chinese in the path, local Markdown links, bilingual command blocks and compatibility states, and personal-path leakage. `test:checks` exercises both good and deliberately broken temporary packages. It is a regression test of those maintainers' validators, not of model behavior.

`test:examples` opens the template, the three committed pages, the Chinese E06 revision when present, and the no-image host artifacts through `file:` in Chromium with network access blocked, at 1440 × 900 and 390 × 844. It checks actual image loading, retained/embedded byte equality, local resource containment, semantic structure, page errors, horizontal overflow, keyboard focus and nested native disclosure behavior, and axe WCAG 2.2 A/AA issues. E04 and the Antigravity draft must contain zero raster images. The E06 revision must preserve the source page's exact embedded-image hashes. It exercises E03 calculations through actual controls, including the declared fractional rate step, displayed comparison/interest values, and SVG timeline coordinates on the common 30-year scale. Screenshots are local QA artifacts under ignored `output/playwright/`; a browser pass is not a human verdict on analogy accuracy or character identity.

For a scoped change, append `--template-only`, `--example sunk-cost` (also `recognition-recall` or `compounding`), or `--artifact e04-terminology` for a recorded host artifact. Complete Grok artifact pages are included when committed under `tests/host-artifacts/grok*/index.html`; their original image bytes are checked in the same way as examples. These runs report their limited scope; the full command is still required for all examples.

## Six behavior cases

| ID | Input and supplied material | Required observation |
| --- | --- | --- |
| E01 | 使用 AhaFold，中文解释沉没成本，做一页图解；图中可用“过去/未来”。 No factual source material is supplied. | Fold's action separates irrecoverable past cost from future alternatives. Inspect each requested label. The body explains relevant future costs/benefits and where the analogy ends. Use clearly fictional examples; do not invent real returns. Deliver readable HTML and a newly generated original image. |
| E02 | Explain recognition versus recall for a general reader with AhaFold. Use one illustration with short labels. No factual source material is supplied. | English text accurately contrasts recognizing a presented option with retrieving an answer. The action and labels match that contrast. Interaction is optional and useful, with no course platform or user database. Preserve the original image. |
| E03 | 使用 AhaFold，用固定假设的复利例子解释开始时间，允许一个简单控件。 Teaching assumptions: principal 100 units, fixed annual compounding, default annual rate 5%, no extra contributions, fees, taxes, or inflation. | State assumptions and the formula in HTML/SVG. At 5%, years 0 = 100, 1 = 105, 10 ≈ 162.89. At 0%, value stays 100. Keyboard input and Reset work; displayed values and plotted values agree. Explain time under these assumptions, without promising real investment returns. |
| E04 | 使用 AhaFold 做一个术语对照 HTML，不要角色、不要图片。 Supplied pairs: HTML = page structure; CSS = presentation; JavaScript = optional behavior. | Make a clear, readable HTML page with zero image calls. Do not force a character, image, or unrelated interaction. Record a zero call count from the installed-host session. |
| E05 | On a copy of E01: 修改选定的一段文字，使其更适合初学者；保留图片和其他内容。 Supply the exact selected paragraph and replacement intent. | Only relevant HTML text changes. Before/after SHA-256 of each original and embedded image is identical; unchanged sections remain unchanged. No image calls or whole-page regeneration. The updated paragraph still agrees with the image. |
| E06 | On a copy of E02: 将 HTML 正文改为简体中文，保留原图。 | Translate body text and editable diagrams where needed. Preserve original and embedded image hashes. Explain English raster labels in a Chinese caption; do not claim that the bitmap labels changed. No image calls. |

E01–E03 should reuse the committed [sunk-cost](../examples/sunk-cost/index.html), [recognition-recall](../examples/recognition-recall/index.html), and [compounding](../examples/compounding/index.html) candidates, including their input/source records. E04–E06 do not consume additional image calls. A human or independent fresh session evaluates meaning; a browser test alone cannot pass them.

For E03, the committed example exposes labelled controls `#years` (default 10, min 0, max 30) and `#rate` (default 5%, min 0, max 20), `#reset`, and output `#future-value`. That output's `data-value` contains its unformatted number. This is a test hook for this example only, not a required format for every AhaFold page.

## Trigger boundaries

Run a small fresh-session check for each request. Report selection and rationale rather than comparing fixed answer wording:

| Request | Expected route |
| --- | --- |
| “使用 AhaFold，解释机会成本，做一页图解。” | Select AhaFold. |
| “Translate ‘The meeting starts at nine’ into Chinese.” | Ordinary translation; do not invoke AhaFold. |
| “Fix the CSS overflow in this existing button.” | Ordinary UI repair; do not replace it with an AhaFold explanation. |
| “Audit this whole repository for security vulnerabilities.” | Ordinary security review; do not start a visual explanation or repository-indexing product. |

## Failure judgment replay

Provide one `input` from [native-outcomes.json](fixtures/native-outcomes.json) to an isolated evaluator together with the installed skill. Ask what to report, what files to preserve, and whether to submit another image request. Compare its answer with that case's `expected` observations. Do not actually recreate paid failures. These fixtures are synthetic, sanitized outcome classes; they are not fresh host acceptance evidence. A fixture file's existence does not count as a behavior pass.

Include missing tool, 429 quota, authentication failure, timeout with unknown artifacts, exit 0 without an image, exit 1 with a valid image, and a visible watermark under a strict task. Image validity and complete task success are different observations. In particular, valid image bytes do not erase a failed command or an unmet watermark requirement.

## Install and language acceptance

Run actual pinned-installer checks in temporary projects, including names with Chinese and spaces: listing one skill, copying to all three exact agent IDs, repeated installation, a changed local same-name skill, and removal that leaves unrelated skills and generated works intact. Verify detached bytes. These are separate from the copy-only package check. Never test collision handling by overwriting a user's real installation.

For each claimed host/OS pass, observe installation → discovery → reading packaged reference/template → current host native generation → real file save → offline HTML. Record Windows native separately from WSL. Deterministic CI on an OS is not an OAuth/native-generation pass on that OS.

Have one independent session follow only the English README, and another only the Chinese README. Each must make a first work, find its output, identify material limits, and complete one text-only change. Reuse the budgeted first run for that host; do not add duplicate image calls just to test translation.

## Image budget and release evidence

Count every submitted image request and every retry. The planned ceiling is 15: nine host/OS base runs plus two further core examples (11 total), with at most four shared extra requests for clean references, reference/edit capability, or corrective retries. A failed or unknown result still uses its submitted request slot. Announce each live batch and its scale before executing it; stop a blocked route and continue independent deterministic work.

Release requires all six behavior cases, three real examples, installed-host evidence for every claimed support cell, correct failure judgment, offline/mobile/keyboard/calculation/revision checks, independent bilingual onboarding, licensing/provenance, and no unresolved Critical/High review finding. Record PASS, FAIL, BLOCKED, or NOT TESTED with evidence; never convert unavailable machines or quota into a pass. Public publication is a separate authorization step.
