# AhaFold visual system

The packaged explainer is a **Read** surface: one question, a clear answer, exact supporting detail, and visible limits. Its original white/apricot/teal identity is fixed; a template must not reopen the character or product direction.

- White `#FFFFFF` is the page. Dark ink `#242A2D` is the text. Apricot `#F4C96B` identifies a central idea; teal `#2A8C82` connects relationships and marks focus. Teal text uses darker `#17665E` for contrast.
- Use locally available sans-serif fonts with Chinese and Latin fallbacks. Body text is 18 px with generous line height and a 42 rem reading measure. Headings make the argument; no decorative labels precede them.
- Use whitespace and thin horizontal rules to separate sections. A quiet apricot emphasis can highlight one key relationship. SVG is for exact diagrams, not simulated hand-drawn character artwork.
- At mobile widths, comparison rows become a single reading column. Images scale without cropping provider markings. Essential meaning remains in prose, captions, and useful alternatives.
- Keep native links, controls, and disclosure behavior. Visible focus is teal; selection is apricot. Add interaction only when it helps understanding. No external fonts, dependencies, animation, or network calls are required by the starter.

The starter visibly identifies itself as an editable template. Finished explanations replace its author guidance with their own content, sources, and limits. Fold scenes come from inspected native image output; the reference sheet is an identity asset, not a completed explanation.

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
