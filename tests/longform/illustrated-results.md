# Illustrated long-form correction · 2026-09-05

The previous long-form work underrepresented AhaFold's core: the workflow had only
a brief optional-illustration sentence, the template had no scene placement model,
and all six authoring prompts explicitly prohibited images. Those tests cover the
no-image path, not a complete illustrated long explanation.

## Implemented correction

- The skill now plans original illustrations and accurate HTML together by default.
  The long-form outline records each scene's claim, action, placement, labels,
  caption, boundary and budget before authoring the finished page.
- One main cognitive anchor is the starting point; chapter scenes need distinct
  explanatory roles. There is no fixed image count or one-picture-per-section rule.
  Explicit no-image requests, text revisions and precision-only material remain valid.
- The packaged starter includes reusable semantic figure markup and styles at the
  main/chapter illustration positions. These are explicitly unfilled authoring slots,
  not generated images or a completed illustrated example.
- [The actual illustrated guide](../../examples/longform/library/illustrated.html)
  places one native scene beside the opening argument and a second inside the
  return chapter. Exact rules, numbers and tables remain selectable HTML.

## Actual images and provenance

Current Codex built-in `image_gen.imagegen` produced two PNGs using the packaged
Fold reference; the second also used the first scene for continuity. Both calls
returned normally. No alternate harness, API fallback, cropping, repainting or
recompression was used. The backend model was not disclosed and cost is unknown.
This batch used **2 image calls**, cumulative **11/15** for the authorized project
test budget. It is current-session generation plus maintainer integration, **not**
a new independent installed-host authoring acceptance.

The [provenance record](../../examples/longform/library/illustration-provenance.json)
contains the complete prompts, reference roles, original file sizes, dimensions
and hashes. Originals remain in the adjacent `assets/` and the same bytes are
embedded in the HTML.

## Verified results and remaining failures

Independent visual/content review passed: the single apricot paper body, one teal
corner, dash eyes and paper-strip arms remain recognizable; the actions show
tagging a real drill and inspecting a returned one. “留置／收件／待检查／已记归还” are
correct and attached to the appropriate objects. Captions match the pixels and
retain the eligibility, handoff, inspection, liability and settlement boundaries.
No visible watermark/signature was observed; this does not establish absence of
metadata or invisible provenance.

All 578 original body text nodes remain; four tables are byte-identical. The new
content is two figures/captions plus one short AI-image provenance note. Both
1536×1024 embedded PNGs match their originals byte-for-byte. Original `index.html`
and all earlier failed host artifacts remain unchanged.

`pnpm run test:longform --artifact examples/longform/library/illustrated.html`
**failed overall** on macOS: 320px passed fully; image checks at390px passed, then
the existing post-reload native-focus assertion failed with `BODY` at `#sources`.
The remaining widths/no-JS/print/zoom stages were not reached by that invocation.
That strict assertion is retained. Reload-focus instability is not now confined to
the previously observed Windows runs, and this page is not declared fully accepted.

Separate supplementary reading checks passed at320/390/768/1440px: original image
bytes, dimensions, aspect ratios, captions, native TOC, offline resources, no
horizontal document overflow and zero axe violations in JavaScript-enabled pages.
At390px with JavaScript disabled, both images decoded, all11 sections and native
TOC worked, and content stayed contained. A4 produced a real PDF with both figures
visible and no horizontal document overflow. Actual Chrome200% zoom reported2×,
doubled DPR and halved viewport width, while preserving the images and native TOC.
These supplementary checks exclude post-reload focus and do not override the
strict failure. The first supplementary attempt ran the JS-based axe scanner in a
JS-disabled context and errored; no axe conformance result is claimed for that mode.

Desktop and mobile screenshots were inspected. Package/type checks and independent
CCG change/quality/security/module review passed, with no Critical/High finding.
The design detector still lacked its HTML parser dependencies and degraded to
regex; two inherited accent-border warnings are not an exhaustive visual audit.

Still unverified: a fresh installed-host run using the corrected workflow,
Grok/Antigravity illustrated long-form generation, and release-wide cross-platform
acceptance. The earlier code/CI failures remain recorded in [the prior results](results.md).
