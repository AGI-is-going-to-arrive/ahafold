# Current host: Antigravity CLI

Use this reference only inside the `agy` CLI and only when the task requires a raster image. AhaFold's installer target is `antigravity-cli`. The separate `antigravity` target is for the older IDE and is not an interchangeable installation path. Find the skill with `/skills` or invoke `/ahafold` where supported by the installed version.

## Native route

The observed built-in image tool is `generate_image`, with case-sensitive parameters `Prompt` and `ImageName` in the tested CLI surface. Inspect the current tool schema before calling it; do not assume the SDK's identifier list is a complete parameter contract for this CLI version.

Describe one scene with Fold's text identity and exact short labels. Use the packaged reference sheet as a generation input only if the live tool explicitly exposes reference input. Reference-image generation and image editing require their own successful verification; their absence does not require switching providers.

Use the current authenticated CLI's native tool. Do not start the IDE or another harness, use a Gemini API key, read authentication material, or change endpoints/accounts to work around unavailable tools or quota. The chat model, entitlement, and image backend are distinct; state a model only when the actual result discloses it.

## Save and verify

Inspect the image-tool result, not just the CLI's final status. An observed CLI run returned process exit `0` and final `SUCCESS` while `generate_image` returned `429 QUOTA_EXHAUSTED` and produced no image. Therefore verify that an actual decodable image exists before reporting generation success.

On quota/429 or explicit authentication failure, stop that route immediately. Record the current result and preserve useful explanation work as a draft. A previously recorded reset time or a working OAuth login does not prove fresh quota. Do not poll or retry automatically.

Use the actual returned local image or the host's supported artifact export. Copy original bytes into the user's output `assets/` directory, preserving file type, metadata, and markings. A tool's proposed `ImageName` is not evidence that the corresponding file was created. If export is unavailable, report that the image cannot yet be delivered locally.

When permitted, inspect the real image for identity, action, exact short labels, and visible marks; otherwise record visual checks as unverified. A successful file does not by itself prove Fold consistency or reference/edit quality.

Use the common failure rules in [SKILL.md](../SKILL.md). Historical tool availability or a previous quota failure is not an installed-AhaFold acceptance result; report the current installation, generation, and artifact status separately.
