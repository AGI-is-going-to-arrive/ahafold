# 复利与开始时间 · Compounding

[Open the complete offline HTML](index.html). Download the file to view it; GitHub shows source.

## Input / 输入

```text
使用 AhaFold，用固定假设的复利例子解释开始时间。初始本金100，默认固定年率5%，每年复利，在同一第30年终点比较；通过年数与年率控件观察变化，不承诺真实收益。
```

This is the educational input used for the installed AhaFold test, with a one-call
native-image budget and supplied source summaries. The test did not use a previous
scene, a placeholder, or the character master as its output. It used text identity,
without passing an image-generation reference. The author started from the Chinese README.

## Meaning and limits

Fixed principal100; fixed annual rate; annual compounding with retained interest; no additions/withdrawals, tax, fees, inflation, or variable returns. A=100(1+r)^t. At5%: 0years=100,1year=105,10years≈162.89; at0% all durations yield100. The SVG timeline represents duration, not money. Moneysmart supports only the concept; LibreTexts supplies the precise formula.

## Sources

- [LibreTexts — Compound Interest](https://math.libretexts.org/Workbench/FHSU_College_Algebra/04%3A_Exponential_and_Logarithmic_Functions/4.02%3A_Compound_Interest)
- [ASIC Moneysmart — Compound interest](https://moneysmart.gov.au/saving/compound-interest)

Both sources were actually fetched on 2026-09-05. Factual support was supplied to
the author; the page uses original prose, not copied textbook content. Confidence
in these bounded source claims: High. This does not validate arbitrary model output.

## Original image

- Host: Codex CLI 0.153.4, macOS26.6.2, after project-scoped `skills@1.5.23` installation.
- Route: current Codex built-in `image_gen.imagegen`; one fresh call, no retry.
- File: [assets/fold-time.png](assets/fold-time.png); PNG, 1536×1024, 1,088,795 bytes.
- SHA-256: `9eb3a2e7933fc6635212ee97f7403e51954034b19328ee3ca086958268ece4e6`.
- Actual three Fold identity points, action, and short labels were visually inspected.
  No visible watermark was observed on this image; metadata/provenance marks remain.
- Original asset and HTML data URL retain exactly the same image bytes. The tool did
  not independently disclose an exact backend snapshot or per-image cost.
- Generated through the installed skill; earlier bare-host probes are excluded.
- Asset terms: [NOTICE](../../NOTICE.md), including the limits of rights in AI output.

See [validation](../../tests/validation.md) for browser checks and acceptance limits.
