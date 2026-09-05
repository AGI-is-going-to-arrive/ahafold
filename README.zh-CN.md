# AhaFold

**把复杂，展开讲。**

[English](README.md)

一个轻量的单 skill，共同规划原创插画与准确的 HTML 说明，覆盖单个概念和长篇资料。
纸页角色**小折（Fold）**用具体动作演示关系，计划中的配图由当前宿主原生工具生成。
明确无图、只改文字和纯精确技术材料仍受支持；交互按需要加入。

**v0.1 私有开发中。** 安装需要仓库访问权限。目前没有公开发布，也未宣称所有目标平台全面通过。
[Codex/Grok专项多维审计](tests/focus-validation.md) 已覆盖中文、英文和混排使用，
发现Grok的实际正确性／图文问题及未完成任务；此前成品不代表任意场景均可靠。

## 先看成品

[![AhaFold 带小折原创配图的中文长篇](examples/longform/library/illustrated-preview.png)](examples/longform/library/illustrated.html)

| 图解 | 篇幅与语言 | 完整 HTML | 输入与来源记录 |
| --- | --- | --- | --- |
| 借到工具，究竟从哪一步算起？ | 中文 · 11 节 · 2 幅原创小折场景 | [阅读](examples/longform/library/illustrated.html) | [说明](examples/longform/library/README.md) |
| Did my seats get booked? | 英文 · 11 节 | [阅读](examples/longform/retries/index.html) | [说明](examples/longform/retries/README.md) |
| TypeScript → JSON 的边界 | 中文解释 + English 术语／代码 · 10 节 | [阅读](examples/longform/type-boundaries/index.html) | [说明](examples/longform/type-boundaries/README.md) |
| 沉没成本 · Sunk cost | 简短图解 | [阅读](examples/sunk-cost/index.html) | [说明](examples/sunk-cost/README.md) |
| 识别与回忆 · Recognition versus recall | 简短图解 | [阅读](examples/recognition-recall/index.html) | [说明](examples/recognition-recall/README.md) |
| 复利 · Compounding | 简短图解 | [阅读](examples/compounding/index.html) | [说明](examples/compounding/README.md) |

工具借用图文版把两幅当前 Codex 原生生成的图片与已有长文结合：主图区分收件与留置，
章节图解释已记归还与待检查。这是维护者编排的图文示例，不算新的安装后宿主独立生成验收。
三份 Codex 无图原版、Grok 修订版及原始记录仍保留在[长篇说明](examples/longform/README.md)中。
预览只展示开头，第二幅图位于归还章节正文。

[识别／回忆中文版](examples/recognition-recall/index.zh-CN.html) 展示了保留原图的语言改写。

下载或克隆仓库后，用浏览器打开示例的 `index.html`；GitHub 文件页显示的是源码。
页面内嵌 CSS 和必要的小段脚本；带插图的页面还内嵌图片，原图另存于旁边的 `assets/`。
读者无需 AI 账户、Node.js 或服务端，阅读不产生额外模型调用。

## 可以用来做什么

- 为陌生概念建立直觉。
- 讲清两个容易混淆的概念。
- 用简短步骤或简单交互解释一个关系。
- 将长材料整理为总览、可跳转章节、局部图解和完整算例，并保留结论成立的条件与例外。

简单需求使用[简短模板](skills/ahafold/assets/explainer.html)。材料较长或明确要求长篇时，
使用[长篇说明](skills/ahafold/references/longform.md)和[原创多章节模板](skills/ahafold/assets/longform.html)。
技能在同一套本地 HTML 工作流中选择表达方式。写长文前就规划主图及有必要的章节图，
不要将已计划的配图推到最后，也不按章节机械凑图。

图片负责角色、情境、动作与少量必要短标签。长正文、代码、公式和复杂图表放在可编辑的 HTML/SVG。
明确无图和纯精确表达的需求仍受支持；小折与交互按解释需要使用，也可以明确要求只输出插图。

作者使用所选宿主的账户与可用额度，生成时提供的材料会发送给该供应商。
AhaFold 不包含数据库、索引器、独立服务、统一模型 SDK 或代码库分析产品线。

## 使用前提

- 已安装并正常登录 Codex、Grok Build 或 **Antigravity CLI（`agy`）**。
- 需要图片时，当前宿主具备原生生图工具且账户有可用额度。
- 固定版本 `skills@1.5.23` 安装器要求 **Node.js 22.20.0 或更高版本**。
- 已通过 Git 身份认证并具有此私有 GitHub 仓库的访问权限。不要把 token 写入安装命令、HTML 或 Issue。
- 用浏览器阅读产物。AhaFold 原生路线不需要额外图片 API key。

## 在项目中安装

先检查 `.agents/skills/` 和 `.grok/skills/` **两处**是否已有 `ahafold` 目录。
如已存在，停止安装，先检查并备份其中的修改；上游安装器可能覆盖已有安装。

在准备使用 AhaFold 的项目目录运行：

```sh
npx skills@1.5.23 add AGI-is-going-to-arrive/ahafold --skill ahafold --copy
```

在安装器中选择目标：

| 宿主 | 安装器 agent ID | 项目技能路径 | 调用 |
| --- | --- | --- | --- |
| Codex | `codex` | `.agents/skills/ahafold/` | `$ahafold`；`/skills` |
| Grok Build | `grok` | `.grok/skills/ahafold/` | `/ahafold`；`/skills` |
| Antigravity CLI | `antigravity-cli` | `.agents/skills/ahafold/` | `/ahafold`；`/skills` |

使用 **`antigravity-cli`**，不要选旧 IDE 对应的 `antigravity`；`grok-build` 不是安装器 ID。
直接指定一个宿主：

```sh
npx skills@1.5.23 add AGI-is-going-to-arrive/ahafold --skill ahafold --agent codex --copy
```

按需将 `codex` 改为 `grok` 或 `antigravity-cli`。`--copy` 避免依赖 Windows 符号链接权限。
默认按项目安装。启动新宿主会话并通过 `/skills` 检查；下面的兼容表区分文档语法与实际产品验收。

从本地克隆安装时，把同一 `add` 命令中的 `AGI-is-going-to-arrive/ahafold` 换成带引号的克隆路径；
Windows 使用实际 Windows 路径。手动安装则将**整个 `skills/ahafold/` 目录**复制到表中的项目路径，
包含 `references/`、`assets/` 和 `LICENSE`，不能只复制 `SKILL.md`。
技能用户无需执行 `pnpm install`。全局安装不属于 v0.1 已验证的说明。

## 如何使用

Codex 中提及 `$ahafold`；Grok Build 和 Antigravity CLI 中使用 `/ahafold`，也可自然表达需求。
调用形式由宿主决定，没有通用斜杠命令。

```text
使用 AhaFold，给普通读者解释沉没成本。
做成一页带插画的 HTML，并说明类比在哪里不成立。
```

```text
使用 AhaFold 解释“识别”和“回忆”的区别。
插画中只使用必要短标签，有帮助时才加入交互。
```

```text
Use AhaFold to turn material.md into a complete long guide for a general reader.
Write in English. Keep important conditions, exceptions, numbers, and original code.
Plan a main Fold illustration and any chapter scene that adds a different insight.
```

请明确写出成品语言。中文或中英混排的长篇可以这样请求：

```text
使用 AhaFold 把 material.md 做成完整长篇图解，面向普通读者。
用简体中文写作，保留重要条件、例外和数值。先共同规划正文与小折配图，
用主图建立直觉，再按需要安排解释不同关系的章节图。
```

```text
使用 AhaFold 把 material.md 做成长篇图解。
解释用简体中文，保留 English 术语与原代码，讲清关键边界。
配图帮助建立直觉，精确执行路径、代码与数值留在 HTML/SVG。
```

不需要图片时：

```text
使用 AhaFold 做一个 HTML 术语对照，不要角色，不要图片。
```

## 如何修改作品

```text
使用 AhaFold，把第二段改成初学者能懂的说法。
保留已有插画和页面其他内容。
```

```text
将 HTML 正文改为简体中文，保留原图。
图里的英文标签在中文图注中给出对应解释。
```

修改位图内部文字可能需要新的原生编辑或生成。仅改 HTML 正文或语言时，应保留未受影响的图片，
其 hash 应保持不变。AhaFold 不承诺通用的自动依赖追踪编辑器。

## 输出与维护

默认保存到 `ahafold-output/<topic-slug>/index.html`，原图放在 `assets/`。
用户指定路径优先；已有产物采用版本化输出，除非你明确要求替换。
分享自包含 HTML，保留原图用于来源核查和后续修改。点击来源链接需要网络，普通阅读和交互不发起网络或模型请求。

更新前先检查本地技能修改；保留需要的改动后，使用同一固定版本安装命令，仅更新本包。
核对内容后，在当前项目中仅卸载本包：

```sh
npx skills@1.5.23 remove ahafold -y
```

该命令只处理各项目宿主路径下名为 `ahafold` 的技能。Codex 与 Antigravity CLI 共用 `.agents` 那份，
卸载会同时影响两者；其他技能和 `ahafold-output/` 作品保持不变。仅指定三个 `--agent` 目标时，
安装器可能为其他已检测宿主保留共享副本，因此必须检查实际目录。安装器生命周期实测见[验证报告](tests/validation.md)。

## 兼容性与限制

目标为原生 Windows、macOS、Linux，以及三个宿主。WSL 是单独的 Linux 环境，不能证明原生 Windows 支持。
下表评估的是**安装 AhaFold → 原生图片 → 保存 HTML → 离线阅读**，不是裸宿主生图探针。
`PARTIAL` 不是完整验收通过。

| 组合 | 状态 | 证据 / 限制 |
| --- | --- | --- |
| macOS / Codex | PASS | 已验证有限的安装后生图／编辑和多语言场景；技术任务曾需调整环境／时限后重测。 |
| macOS / Grok Build | PARTIAL | 原生生图／参考／编辑可用；专项测试发现内容、图文与手机问题，需独立复核；保留水印。 |
| macOS / Antigravity CLI | BLOCKED | 按用户要求暂缓；保留此前429及草稿，本轮未再调用CLI。 |
| Windows / Codex | NOT TESTED | — |
| Windows / Grok Build | NOT TESTED | — |
| Windows / Antigravity CLI | NOT TESTED | — |
| Linux / Codex | NOT TESTED | — |
| Linux / Grok Build | NOT TESTED | — |
| Linux / Antigravity CLI | NOT TESTED | — |

带日期的版本、确定性 CI、图片调用次数和剩余发布门槛记录于 [tests/validation.md](tests/validation.md)。
确定性 CI 不能证明另一个操作系统上的 OAuth 生图。

2026-09-05 的独立[长篇评估](tests/longform/results.md)使用六次全新安装后的 Codex/Grok 会话，
不生成图片，六次均正常结束。独立复核中，三份原始 Codex 输出的 60 项必要事实全部保持一致；
Grok 提到了全部 60 项，但只有 56 项保持一致，三处矛盾影响四项检查。
另有一次 Grok 使用英文材料和英文提示词却生成中文；该提示词没有明确的“Write in English”要求。
展示的修订版保留修改记录，原始结果与此前失败仍属于测试证据。浏览器结果和未完成项见该报告。
Windows 长篇 CI 门槛仍为 **FAIL**：刷新可能丢失原生标题焦点，无脚本模式下已验证的首次深链接之后也会出现。
macOS／Linux 检查通过。本轮开发迭代尚未满足全部发布门槛。

那六份无图案例不能证明完整图文长文链路。[新增配图记录](examples/longform/library/illustration-provenance.json)
记录本批2次当前 Codex 原生调用（累计11/15）、实际图像／图注检查及维护者编排的长篇。
Grok／Antigravity 的图文长篇生成，以及修订后工作流的全新安装宿主测试，仍未验证。
[新图文页检查](tests/longform/illustrated-results.md)通过了单独的配图／阅读验证，
但严格页面测试也在 macOS 复现刷新焦点失败，不能沿用旧 CI 通过结果宣称此版全面验收。

短标签、角色身份、参考图输入和图片编辑分别验收。已登录不代表有额度，费用未知且用量并非无限。
每张图都需要检查：某条原生路线可能无法满足严格“无可见水印”要求。
保留供应商标记与原始字节；“未观察到可见水印”不代表图片没有来源标记。

缺少原生工具、429/认证失败或结果不确定时，停止该图片路线，仍可交付明确说明限制的可读草稿。
不静默重试、不提取凭据、不更换端点，也不使用 API fallback。
Claude Code、OpenCode、DeepSeek 及其他宿主的 fallback 属于后续计划。AhaFold 不自动发布页面。

## 贡献与许可

原创技能、模板、脚本和项目持有权利的资产采用 [MIT](LICENSE)。
[NOTICE.md](NOTICE.md) 说明 AI 生成小折的来源、资产权利边界，以及来自
[Ian Xiaohei Illustrations](https://github.com/helloianneo/ian-xiaohei-illustrations) 与
[visual-explainer](https://github.com/nicobailon/visual-explainer) 的方法启发。

原创长篇模板参考了本地 visual-explainer 快照 `7163c3e` 的表达选择、总览与细节组织、
目录导航及事实复核方法，详见[源码比较](tests/longform/README.md)。没有复制上游实现；
这次比较不能证明在相同任务实测中，生成质量已达到或超过对方。

欢迎可复现示例、语言改进和带日期的兼容性结果；不要提交 token、私人材料或原始会话日志。
维护者检查命令：

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm run typecheck
pnpm run test:checks
pnpm run test:install
pnpm run check:package
pnpm run test:examples
pnpm run test:longform
```

这些开发依赖不在技能安装单元内。E01–E06 与原生验收要求见[行为案例](tests/cases.md)。
仓库保持私有，公开发布需要另行决定。
