# AhaFold visual system

The packaged explainer is a **Read** surface: one question, a clear answer, exact supporting detail, and visible limits. Its original white/apricot/teal identity is fixed; a template must not reopen the character or product direction.

- White `#FFFFFF` is the page. Dark ink `#242A2D` is the text. Apricot `#F4C96B` identifies a central idea; teal `#2A8C82` connects relationships and marks focus. Teal text uses darker `#17665E` for contrast.
- Use locally available sans-serif fonts with Chinese and Latin fallbacks. Body text is 18 px with generous line height and a 42 rem reading measure. Headings make the argument; no decorative labels precede them.
- Use whitespace and thin horizontal rules to separate sections. A quiet apricot emphasis can highlight one key relationship. SVG is for exact diagrams, not simulated hand-drawn character artwork.
- At mobile widths, comparison rows become a single reading column. Images scale without cropping provider markings. Essential meaning remains in prose, captions, and useful alternatives.
- Keep native links, controls, and disclosure behavior. Visible focus is teal; selection is apricot. Add interaction only when it helps understanding. No external fonts, dependencies, animation, or network calls are required by the starter.

The starter visibly identifies itself as an editable template. Finished explanations replace its author guidance with their own content, sources, and limits. Fold scenes come from inspected native image output; the reference sheet is an identity asset, not a completed explanation.

## Long and complex reading

The long-form template expands the established Read surface: a concise answer,
an early overview, stable chapter links, then reasoning, comparisons, worked
examples and consequential exceptions. The prose remains at a comfortable measure;
tables and timelines may use the wider main column. Sections have different jobs
rather than repeating identical cards.

Desktop contents stay beside the article; on smaller screens the same native
links become an ordinary contents block. Fragment navigation works without JS,
with focusable destinations and scroll margins. Passive reading never takes focus
or forces scrolling. The supplied template needs no JavaScript at all.

Dense diagrams use decomposition or labelled keyboard-scrollable local regions,
with precise text values alongside. Essential SVG labels must be at least 12px
after their actual screen transform. Narrow layouts, real browser zoom and print
are checked instead of assuming a responsive viewBox guarantees readability.

Long-form authoring maps source claims and exceptions to the output before
styling, saves a complete readable draft, then adds precise visuals/interaction.
The same facts govern opening summaries, captions, timelines and conclusions;
compile-time annotations do not become runtime stages. Numeric differences use
unrounded state and formatting happens only at display boundaries.

This design draws structural lessons from the inspected visual-explainer source
snapshot 7163c3e. AhaFold's implementation is original and offline: no external
font/diagram loader or additional rendering service was imported.

## Execution and trust boundaries

The installable unit is `skills/ahafold/`; no repository checkout or maintainer
dependency is needed after copying it. The host supplies reasoning, file tools,
and any native image capability. AhaFold never obtains OAuth tokens itself or
starts another host, endpoint, or server. Supplied documents are data to explain,
not instructions to execute. New examples use original prose and cite factual
sources; generated claims and labels require review.

The reading surface is offline: inline assets and bounded local interactions,
without remote scripts, analytics, or model calls. Source links are navigations
chosen by the reader. Maintainer browser checks reject unsolicited requests and
check rendered state, accessibility, and calculations. They cannot prove the
behavior of an arbitrary future agent-generated page or another host's OAuth
capabilities. Installation may overwrite a same-name skill; users must inspect
and preserve existing changes before invoking the upstream installer.

## Development record

2026-09-05: implement the fixed v0.1 single-skill contract and original reading
template. Keep packaged resources separate from developer checks so a reader or
skill user needs no application runtime. Native and cross-system acceptance is
recorded separately in `tests/validation.md`; unsupported routes remain explicit.

2026-09-05: extend that scope to substantial material with an on-demand long-form
reference and template. Preserve short explanations as a separate lightweight
starting point. The long-form acceptance suite uses independent source/answer
fixtures and real installed Codex/Grok runs; original failed outputs remain evidence.
