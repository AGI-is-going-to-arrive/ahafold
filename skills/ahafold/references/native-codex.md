# Current host: Codex

Use this reference only inside Codex and only when the task requires a raster image. AhaFold's installation target is `codex`; the skill can be invoked with `$ahafold` or found through `/skills`.

## Native route

Use the image-generation tool exposed by the current Codex session. Known surfaces include `image_gen.imagegen` and Codex's `image_generation` tool; their naming and schema may differ by surface/version. Read the live tool description, including any imagegen skill required by the host. Use available tool discovery if necessary; do not invent a tool call from a name in this file.

Generate with that built-in tool directly. Do not invoke a second `codex` process, call an images API, look up account credentials, or replace the native route with a local drawing script. A text/SVG explanation remains appropriate when no raster image is needed, but it must not be called a successful native generation.

For new images, pass only the scene information and parameters supported by the live schema. For references or edits, inspect the supplied image and use the supported mechanism. On an `image_gen.imagegen` surface that exposes `referenced_image_paths`, pass actual local input paths there; do not also pass `num_last_images_to_include`. When only recent conversation-image selection is available, use the smallest selection that includes all targets. These are conditional schema instructions, not a claim that every Codex CLI build provides reference/edit support.

Do not force an undocumented model ID. Report a backend model only if the current tool actually discloses it; otherwise say it was not disclosed. A CLI reasoning-model flag does not prove the image backend.

## Save and verify

Wait or resume only the active tool call according to its documented behavior. A long generation is not permission to launch a duplicate call. Preserve the exact returned image bytes at the user's output location, with the original file type. If Codex exposes only an artifact, use its supported export mechanism. If no accessible image is returned, report that limitation instead of making a screenshot substitute.

Check the real file, dimensions, and image contents when tools permit. Confirm the Fold identity, action, label spelling, and visible marks separately from successful tool execution. Keep the original file even when embedding its bytes in HTML. If the session does not expose complete tool events, say which parts were inferred or unverified; do not invent a complete invocation trace.

Use the common failure rules in [SKILL.md](../SKILL.md). Installed skill discovery, reference input, fresh generation, and editing are distinct capabilities; a previous successful bare-Codex image is not an installed-AhaFold acceptance result.
