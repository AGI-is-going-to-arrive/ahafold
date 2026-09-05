# AhaFold

**把复杂，展开讲。**

[English](README.md)

一个轻量视觉解释 skill，把原创插画与清楚的 HTML 说明组织在一起。
纸页角色**小折（Fold）**通过动作演示概念；有帮助时加入交互，图片由当前宿主的原生工具生成。

**v0.1 私有开发中。** 安装需要仓库访问权限。目前没有公开发布，也未宣称所有目标平台全面通过。
[Codex/Grok专项多维审计](tests/focus-validation.md) 已覆盖中文、英文和混排使用，
发现Grok的实际正确性／图文问题及未完成任务；此前成品不代表任意场景均可靠。

## 先看成品

[![AhaFold 沉没成本图解预览](examples/sunk-cost/preview.png)](examples/sunk-cost/index.html)

| 图解 | 打开完整 HTML | 输入、来源与图片记录 |
| --- | --- | --- |
| 沉没成本 · Sunk cost | [阅读](examples/sunk-cost/index.html) | [说明](examples/sunk-cost/README.md) |
| 识别与回忆 · Recognition versus recall | [阅读](examples/recognition-recall/index.html) | [说明](examples/recognition-recall/README.md) |
| 复利 · Compounding | [阅读](examples/compounding/index.html) | [说明](examples/compounding/README.md) |

[识别／回忆中文版](examples/recognition-recall/index.zh-CN.html) 展示了保留原图的语言改写。

下载或克隆仓库后，用浏览器打开示例的 `index.html`；GitHub 文件页显示的是源码。
页面内嵌图片、CSS 和必要的小段脚本，原图另存于旁边的 `assets/`。
读者无需 AI 账户、Node.js 或服务端，阅读不产生额外模型调用。

## 可以用来做什么

- 为陌生概念建立直觉。
- 讲清两个容易混淆的概念。
- 用简短步骤或简单交互解释一个关系。

图片负责角色、情境、动作与少量必要短标签。长正文、代码、公式和复杂图表放在可编辑的 HTML/SVG。
图片、小折和交互均按需要使用，也可以明确要求只输出插图。

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
使用 AhaFold，把这份文档解释给初学者。
技术术语保持准确，长文字和图表放在 HTML 中，不全部画进图片。
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
```

这些开发依赖不在技能安装单元内。E01–E06 与原生验收要求见[行为案例](tests/cases.md)。
仓库保持私有，公开发布需要另行决定。
