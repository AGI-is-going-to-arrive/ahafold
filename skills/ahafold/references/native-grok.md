# Current host: Grok Build

Use this reference only inside Grok Build and only when the task requires a raster image. AhaFold's installer target is `grok`, not `grok-build` or `grokbuild`. Find the skill through `/skills` or invoke `/ahafold` where supported by the installed version.

## Native route

The native fresh-image tool is `image_gen`; the observed schema uses `prompt` and an optional `aspect_ratio`. Use the actual session's schema and defaults. Native image tools can be exposed directly even when a search for hidden tools returns no matches; check the current exposed tools before declaring the capability absent. Do not repeatedly guess tool names.

Reference-based work uses the separate native `image_edit` capability when exposed. Its observed schema uses `prompt` and `image` references, with an optional `aspect_ratio`; supported reference forms and counts are governed by the live schema. Do not attach a file to `image_gen` through an invented argument. When reference input is unavailable, use Fold's text identity description for a new same-host scene, then check the result. Reference/edit quality remains unverified until separately exercised.

Use the signed-in host's built-in route. Do not launch another harness, call the Imagine HTTP endpoint yourself, request or extract credentials, or change configuration to obtain a different route. Report the image model only if the current tool discloses it.

## Save and verify

Native results may point to a session image such as `images/1.jpg`. Use the actual path returned for this call and copy the original bytes into the user's output `assets/` directory. Preserve JPEG if JPEG was returned; do not label it PNG or leave HTML dependent on a session folder.

Follow any inspection/display restrictions in the live native tool instructions. If the host prevents the generating agent from viewing the image, verify the file without claiming visual quality and mark identity, action, labels, and visible-watermark inspection unverified until an allowed independent inspection occurs. Do not infer label correctness from the prompt.

Grok images may contain a visible provider watermark. Inspect the current artifact when permitted and describe only what was observed. Keep the mark and original metadata. A prompt requesting no added decorative signature does not guarantee removal of a provider mark; strict no-visible-watermark acceptance can remain unmet even when an image was generated successfully.

Use the common failure rules in [SKILL.md](../SKILL.md), including quota/auth stop conditions and preserving a valid image from an incompletely ended command. A prior bare-Grok image is not proof that installed AhaFold worked.
