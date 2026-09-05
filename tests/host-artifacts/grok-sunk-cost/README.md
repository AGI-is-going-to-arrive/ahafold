# Grok native generation and edit

[Open the corrected offline page](index.html). This is an installed AhaFold
acceptance artifact, separate from the three primary Codex examples.

1. Grok Build 1.0.13 discovered `ahafold` in its command catalog and read the copied
   skill, current-host reference, character rules, and HTML template.
2. One native `image_gen` returned the [baseline JPEG](assets/baseline-sunk-cost.jpg),
   1280×720. Labels were correct; the near-front Fold corner was on the wrong side.
   The page was saved and worked offline, but the process exited1 at its18-turn cap.
3. One separately announced native `image_edit`, with the baseline image as input,
   returned the [corrected original JPEG](assets/sunk-cost.jpg), 1280×720. The
   corner is now on the viewer's right; the two labels, scene, and watermark remain.
   The edit process exited0. The source image was not overwritten.
4. A zero-image continuation replaced only the embedded image and saved a new
   version, exited0, and verified byte identity. Maintainer review then clarified
   the editable prose about common future obligations; the image/script stayed intact.

Both image outputs retain the visible Grok watermark and provider bytes. This
route does not satisfy a strict no-visible-watermark request. The independent
inspection respects the generating host's restriction on inspecting its own result.
The observed edit is not a guarantee of pixel-perfect preservation or master-sheet
fidelity across scenes.

[acceptance.json](acceptance.json) contains relative paths from the isolated run,
tool counts, dimensions, and SHA-256 values, without raw session logs or private
paths. The files linked above are their repository copies. Model snapshot and
image cost were not independently disclosed.

Browser checks cover offline resources, original/embedded hash equality, keyboard
radio navigation, reset, and unchanged160-unit ranking when the common800-unit
past cost is included or excluded. All numbers are hypothetical utility examples.
The two factual source links are included in the page. Asset terms: [NOTICE](../../../NOTICE.md).
