# TypeScript → JSON boundaries · 从类型到数据的边界

[All long guides / 全部长篇](../README.md)

[![Mixed-language type-boundary guide preview](preview.png)](index.html)

[Codex original / Codex 原版](index.html) · [Reviewed Grok variant / Grok 修订版](grok-reviewed.html)

A 10-section guide with Chinese explanations and preserved English terms/code.
It separates compile time from runtime and follows URL encoding, HTTP, JSON and
an optional parser through eight cases. Its sole source is the supplied
[TypeScript material](../../../tests/longform/inputs/type-boundaries.md); all API examples are fictional.

一份 10 节的长篇，以中文解释并保留 English 术语／代码，分开 compile time 与 runtime，
通过八个案例分析 URL 编码、HTTP、JSON 及可选解析器。唯一来源为给定的
[TypeScript 材料](../../../tests/longform/inputs/type-boundaries.md)，接口案例均为虚构。

The default is unchanged Codex output. Two Grok passages were corrected: original
returns versus optional-parser rejection, and network failure before a `Response`
exists rather than before a request starts. Original code remains intact.
Both authoring runs used **0 image calls**; Fold was not needed.

默认页保留 Codex 原始输出。Grok 修正两处文字：原函数兑现与可选解析器拒绝的区别，
以及出现 `Response` 之前的网络失败，而非请求发起之前的失败。原代码保留。
两次生成均为 **0 次图片调用**，未使用小折。

[Raw Codex / 原始 Codex](../../../tests/longform/artifacts/codex-types/index.html) ·
[Raw Grok / 原始 Grok](../../../tests/longform/artifacts/grok-types/index.html) ·
[Changes and hashes / 修改与哈希](../../../tests/longform/curation.json) ·
[Evaluation / 评估](../../../tests/longform/results.md)
