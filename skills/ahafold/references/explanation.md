# Explain the relationship

Read this when planning an explanation or revising its editable content. Use the user's language and requested level. Begin with the claim the reader should understand, then choose a concrete action or comparison that supports it. A short subject does not need a mode selector or an elaborate lesson structure.

## Choose a useful representation

| Reader's difficulty | Useful approach | Check |
| --- | --- | --- |
| An abstract idea has no intuitive anchor | One scene showing a relevant action, followed by the precise rule | State the connection and the analogy's limit. Do not let a charming scene substitute for the claim. |
| Two ideas seem interchangeable | A parallel comparison with the same object or situation | Show the distinguishing operation, including overlap or boundary cases when relevant. |
| A relationship changes under a condition | An editable SVG/HTML diagram, worked numbers, or a small control | State fixed assumptions, show units, and make the displayed formula, values, and graph agree. |
| Exact terminology or dense technical content | Clear HTML text, a compact table, code, or SVG | Omit illustration and character when they add no information. |

Use one core illustration for a short explanation if it helps. More scenes need distinct explanatory work. Fold should push, pull, unload, open, carry, compare, or connect something that represents the relationship. It need not perform a literal paper-folding action.

## Accuracy and evidence

- Distinguish supplied facts, consulted sources, teaching assumptions, and analogy. Do not claim to have verified a fact or read a source that was not checked. For current or disputed external claims, verify with available research tools and cite the pages actually read; state any single-source or verification limit.
- Keep exact formulas and complex charts in HTML/SVG. Define variables, units, and meaningful input limits. Do not use AI-drawn chart geometry as quantitative evidence.
- A sunk-cost explanation should distinguish unrecoverable past expenditure from the future costs and benefits of available choices. Unloading a bag can represent dropping the weight of a past decision; it does not imply that a real contractual cost disappears or that a choice guarantees a return.
- Recognition and recall should use comparable tasks: identifying something with a relevant cue versus retrieving it with fewer direct cues. Avoid the absolute claim that recall has no cues or that one process is always easier. Caption short image labels in the page's language.
- A compounding illustration is a teaching example, not a promised investment return. For a constant annual rate with no added contributions, `A = P × (1 + r)^t`. At `P = 100` and `r = 0.05`, check `t = 0 → 100`, `t = 1 → 105`, and `t = 10 → 162.89` after display rounding. At a zero rate the value stays `P`. State the constant-rate, timing, fee, tax, inflation, and risk simplifications relevant to the example. More time compounds a positive fixed rate; that alone does not predict real returns.

## Local HTML

Adapt [the template](../assets/explainer.html) rather than creating a product runtime. Use a descriptive title, a short introduction, logical headings, and a reading order matching the explanation. Include only sections that do useful work.

Keep the core explanation readable without executing JavaScript. For a useful reveal, prefer native `details`/`summary`; for a condition change, use properly labeled native inputs, visible units, and a keyboard-accessible reset. Update all affected numbers and diagram geometry together. Announce changed values accessibly without overwhelming screen readers. Do not add a control merely to make a static comparison appear interactive.

Use inline CSS/JS and available font fallbacks. Meaning must not depend on color alone. Keep long text and code within the viewport; tables that need horizontal scrolling should have a labeled local scroll container. Include informative image alt text and nearby captions with the important label meanings. User-supplied text must be inserted as text or safely escaped markup; do not copy scripts or event handlers from supplied content into the page. Avoid `eval`, remote execution, and network calls during ordinary reading.

## Revise only what changed

1. Read the existing page and identify the paragraph, language, graphic, or illustration the user wants changed. Preserve its output location when the user explicitly requests an edit there. Inspect the surrounding markup without dumping large base64 image payloads into the conversation; leave those payloads byte-for-byte intact.
2. Record hashes of original raster files and any embedded image payloads with available local tools. Inspect related text or editable graphics for dependencies on the changed meaning; leave unrelated content alone.
3. For a paragraph rewrite, edit that paragraph and only necessary supporting text. Do not regenerate an unchanged image or redesign the page.
4. For a language change, translate the requested HTML prose and relevant editable labels. Keep the original illustration. Translate image-label meanings in the caption, making clear that the original pixels still contain their original language.
5. If the requested change is inside the bitmap or changes the scene's meaning, explain that a native edit or new generation may be needed and account for that call separately. Do not silently spend image quota during a text revision.
6. Confirm unchanged image hashes, retained unrelated content, and continued image/text agreement. Check the actual controls only if the edit affects them. Report which checks ran and which remain unverified.

Read-only feedback requests require no file edits or image calls. An ordinary isolated sentence translation, CSS fix, or repository security audit belongs to its own task; do not turn it into an AhaFold explanation.
