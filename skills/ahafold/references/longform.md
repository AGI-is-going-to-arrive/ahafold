# Long and complex explanations

Read this for a substantial supplied document, several dependent questions, many
states/conditions, or a user who explicitly asks for a long or complex guide.
Length calls for information architecture, not extra decoration. Keep the result
within AhaFold's single-skill, local-HTML workflow.

## Establish the argument before styling

Read all relevant supplied sections before claiming coverage. For material beyond
one reading pass, inspect its headings and then read the necessary sections in
bounded chunks. Record any unavailable or intentionally excluded material.

Make a compact working outline containing:

- The reader's question, prior knowledge and primary reading language.
- The main answer and the dependencies needed to understand it.
- Important facts, definitions, assumptions, exceptions and sources.
- A mapping from each required point to a section, diagram/table or worked example.

This can be a small author note, not a reader-facing form or a database. If the task
may span sessions, save the outline and outstanding checks beside the work so a
continuation can resume the actual state. Do not expose tool setup or workflow
debugging in the delivered reading surface.

Preserve important qualifications when compressing prose. Do not satisfy a word
count by repeating summaries, or make a short answer longer merely to use this
template. User-requested exclusions and focused explanations still take precedence.

## Choose a reading structure

Use [the long-form template](../assets/longform.html) as a starting point, adapting
its content and representations instead of retaining irrelevant template sections.

1. **Entry:** answer the central question, name the main prerequisite or limit, and
   show a small overview early. Let a reader decide which section they need.
2. **Overview:** show the few relationships that organize the topic. A large map
   often works better as roughly 5–8 meaningful groups plus local detail; this is
   an editing heuristic, not a required node count.
3. **Sections:** each addresses one subquestion and uses the representation that
   explains it best. A condition table, state transition, worked example, code
   annotation and analogy need not look like identical cards.
4. **Counterexamples and boundaries:** connect them to the claim they qualify.
   Essential limits stay visible beside that claim, including in the overview.
5. **Details and sources:** put secondary derivations, long source excerpts or
   supplementary code in native disclosures/appendices. Core understanding and
   consequential conditions must not require discovering a hidden control.

With four or more substantial sections, provide a labelled contents navigation
with stable fragment IDs. A desktop sidebar can become a compact mobile contents
block. Keep anchors usable without JavaScript, preserve normal browser history and
deep linking, and use scroll margins to avoid hiding the destination under a header.
Optional active-section highlighting must not seize focus or scroll the document.

## Match visual grammar to meaning

| Material | Useful representation | Do not imply |
| --- | --- | --- |
| A sequence with failures | A small runtime path with named exits and links to details | Every request reaches every step |
| Compile-time types or author assumptions | A side annotation or separate lane | A runtime check or observed event |
| Choices under conditions | A decision table or branching diagram with explicit predicates | One option is always superior |
| Quantities or time | Precise HTML/SVG, units, an unrounded calculation and optional control | Illustrated sizes are measurement evidence |
| Related concepts | Parallel comparison plus a shared example and a boundary case | Disjoint or exclusive capabilities unless supported |
| Many connected parts | A small overview and separate local diagrams | One dense zoomed-out graph is a readable explanation |

Label an arrow with its actual relation when ambiguity is possible: for example
"queues", "expires", "parses" or "may fail". Keep diagram captions aligned with
what the diagram really shows. Fold and native illustrations can anchor selected
sections; they should not replace precise state, numeric or logical diagrams.

## Layout for reading at several depths

Use comfortable body text (normally 16–18px or larger) and a bounded reading
measure. Chinese and English have different wrapping needs; inspect real copy,
long identifiers and mixed-language passages instead of relying on a Latin `ch`
measure alone. Allow tables and diagrams more width than the prose where useful.

At narrow widths, restructure comparisons and diagrams into a sensible reading
order. Never solve density by shrinking all diagram text. Keep essential screen
labels at least 12px; use locally scrollable wide diagrams/code only when needed,
with a visible label, keyboard focus and a readable textual explanation alongside.
Maintain heading hierarchy, selection, focus rings and sufficient contrast.

Keep the page self-contained and offline: local font fallbacks, inline CSS/SVG and
necessary JavaScript, preserved original images. Do not import a CDN diagram
renderer, font service or chart library just because a reference example uses one.
Native disclosures, CSS layouts and a small script are usually sufficient.

Print should expose the main content and any explanatory details needed on paper,
remove sticky navigation/interactive-only chrome, and avoid clipped fixed-height
regions. Without JavaScript the default worked example and argument must remain
readable; disable or clearly qualify a control that otherwise appears to update
values when its script has not run.

## Complete in bounded stages

First save a complete, readable static draft with the core sections and source
coverage. Then add exact diagrams/calculations, useful interaction, and any
budgeted native imagery. Save complete HTML at each meaningful stage rather than
waiting until the end to write the first usable file. The draft's status must be
honest until checks finish.

Use one focused verification pass and a batched correction pass. Reuse unchanged
source evidence; avoid repeated full-page/base64 reads and repeated source fetches.
When the host approaches a turn/time limit, preserve the current artifact and a
short list of missing work. Do not silently start another host or report completion
from a file's presence alone.

Before delivery, compare the source/claim outline with the actual page. Check the
opening answer, headings, overview, local diagrams, table rows, interactive output,
captions and conclusion for the same conditions and semantics. Verify numerical
boundaries and visible strings from full-precision values. Check desktop/tablet/
mobile, keyboard navigation, fragment links, actual SVG label sizes, text zoom,
no-JS reading and print. Name unperformed checks or missing material explicitly.
