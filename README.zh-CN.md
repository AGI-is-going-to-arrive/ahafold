# AhaFold

**把复杂，展开讲。**

[English](README.md) · [在线体验](https://agi-is-going-to-arrive.github.io/ahafold/?lang=zh) · [介绍页源码](index.html) · [直接看成品](#先看看它做出来什么)

把一个概念、一篇文章或一份说明，变成**有插图、讲人话、浏览器里就能读的解释页**。你在现有 AI 工具里说清想理解什么，AhaFold 帮你组织文字、配图和必要的小交互。

> **v0.1 预览版。** 仓库目前私有，安装需要访问权限。Codex 有历史成功案例；Grok Build 部分通过；Antigravity CLI 尚未完成验收。当前修订不等于三个宿主都已验证。

## 先看看它做出来什么

[![小折放下代表过去投入的重袋，面对未来的两条路](examples/sunk-cost/preview.png)](examples/sunk-cost/index.html)

**“电影票买了，不想看了，还一定要去吗？”**

AhaFold 用小折放下重袋的场景帮助理解沉没成本，再在正文里讲清：无法收回的过去投入，与未来的成本、收益不是同一回事。图是理解的入口，条件和例外也要留下。

| 想看什么 | 实际作品 | 能看到什么 |
| --- | --- | --- |
| 一个概念 | [沉没成本](examples/sunk-cost/index.html) | 插画、日常例子、类比的边界 |
| 两个易混概念 | [识别与回忆](examples/recognition-recall/index.html) · [中文版](examples/recognition-recall/index.zh-CN.html) | 对照解释；翻译正文时保留原图 |
| 数字变化 | [复利与时间](examples/compounding/index.html) | 调节条件，查看固定假设下的结果 |
| 一份长规则 | [工具图书馆借用指南](examples/longform/library/illustrated.html) | 11个章节、目录、两张真实原生插图 |
| 一个技术流程 | [订票重试](examples/longform/retries/index.html) | 英文长文、时间顺序与失败条件 |
| 代码里的边界 | [TypeScript → JSON](examples/longform/type-boundaries/index.html) | 中文解释、英文术语和原代码 |

下载或克隆仓库后，在浏览器打开这些 HTML；GitHub 文件预览显示的是源码。[介绍页](index.html)为双语页面，Pages 配置见文末。插图为已有真实作品，不是这次新生成的图片。长篇借用指南由维护者整合，不能当作新版 skill 的全新安装验收。来源与修改记录见各示例目录的 README。

## 最快开始：安装、提问、打开

### 1. 在你的项目里安装

需要 Node.js **22.20.0+**，以及已正常登录的 Codex、Grok Build 或 Antigravity CLI。生成插图还需要该工具开放原生生图能力并有可用额度；不用另外配置图片 API key。

如果已经安装过，先查看 `.agents/skills/ahafold/` 和 `.grok/skills/ahafold/` 并保留本地修改，安装器可能覆盖同名 skill。

```sh
npx skills@1.5.23 add AGI-is-going-to-arrive/ahafold --skill ahafold --copy
```

在安装器里选择你正在用的工具：

| 工具 | 安装器 ID | 项目安装目录 | 如何调用 |
| --- | --- | --- | --- |
| Codex | `codex` | `.agents/skills/ahafold/` | `$ahafold`；`/skills` 查看 |
| Grok Build | `grok` | `.grok/skills/ahafold/` | `/ahafold`；`/skills` 查看 |
| Antigravity CLI (`agy`) | `antigravity-cli` | `.agents/skills/ahafold/` | `/ahafold`；`/skills` 查看 |

选 `antigravity-cli`，不要选旧 IDE 的 `antigravity`；`grok-build` 不是安装器 ID。`--copy` 使用文件副本，避免依赖 Windows 符号链接权限。安装后启动新会话，用 `/skills` 确认发现 AhaFold。

<a id="如何使用"></a>

### 2. 像平时一样提问

```text
使用 AhaFold，给初学者解释沉没成本。用简体中文，做成一页带插图的说明。
```

也可以在 Codex 里写 `$ahafold`，在另外两个工具里写 `/ahafold`。拿不准要怎么描述时，只要填这三项：

> **给谁看 + 解释什么 + 用什么语言。**

例如：“给第一次带团队的人，解释授权与甩锅的区别，用简体中文。”默认做图文 HTML；需要只做插图、不生图、限制次数时再补充，不必学习一套提示词语法。

### 3. 打开生成的页面

默认输出在 `ahafold-output/<topic-slug>/index.html`，原始图片在旁边的 `assets/`。直接用浏览器打开。分享自包含 HTML 时，读者不需要 AI 账号、Node.js 或服务器；阅读与普通交互不发起模型请求。请保留原图，方便后续修改和核查来源。

## 20个场景，复制一句就能试

以下是**使用建议，不是20项已完成的验收测试**。把提到的文件或材料一起提供给工具；示例不意味着它能自动读取未授权的网页、云盘或私人文件。

### 学习与日常

<details>
<summary>不懂一个概念 — 一个生活场景 + 判断条件</summary>

```text
使用 AhaFold，用买了电影票却不想去的例子，给初学者解释沉没成本。用简体中文做一页图解，说明哪些钱还能收回。
```

</details>

<details>
<summary>分清两个近义词 — 并列对照 + 各举一例</summary>

```text
使用 AhaFold，给学生解释识别和回忆的区别。用选择题与填空题举例，做成简体中文对照图解。
```

</details>

<details>
<summary>带孩子理解科学 — 旅程图 + 类比的边界</summary>

```text
使用 AhaFold，给十岁孩子解释水循环。用简体中文，画出水的旅程，说明云并不是装水的袋子。
```

</details>

<details>
<summary>看懂数字如何变化 — 可调整的例子 + 明确假设</summary>

```text
使用 AhaFold，用本金100、固定年利率5%、每年复利的假设，解释时间的影响。用简体中文，加一个年数控件，注明忽略税费且不代表真实收益。
```

</details>

<details>
<summary>读懂一篇长文章 — 先总览，再按章节读</summary>

```text
使用 AhaFold，把我提供的 article.md 讲给没有背景知识的人。用简体中文，先给结论，再分章节配图，保留重要条件、例外和数字。
```

</details>

### 团队与工作

<details>
<summary>让新人学会一个流程 — 步骤 + 责任人 + 完成条件</summary>

```text
使用 AhaFold，把我提供的入职流程做成简体中文图解。每一步写清谁负责、做什么、完成的标志，以及卡住时找谁。
```

</details>

<details>
<summary>解释一条容易误读的规则 — 状态区分 + 常见误读</summary>

```text
使用 AhaFold，把这份借用规则讲给第一次借工具的人。用简体中文，区分提交申请、确认预约、实际取件，保留归还与取消条件。
```

</details>

<details>
<summary>比较两个方案 — 同一条件下比较，不编数据</summary>

```text
使用 AhaFold，根据我提供的方案A和方案B做简体中文对照页。沿用相同的预算与人数，写清各自适用条件，缺失的数据标出来。
```

</details>

<details>
<summary>让团队理解改了什么 — 同一个案例的前后对比</summary>

```text
使用 AhaFold，对比我提供的旧流程与新流程。用简体中文，沿用同一个具体案例，标出变化、保持不变的部分和新增限制。
```

</details>

<details>
<summary>把会议决定讲明白 — 决定 / 未定 / 下一步</summary>

```text
使用 AhaFold，根据这份会议记录做简体中文说明页。分清已决定、待确认、下一步，别把讨论过的想法写成已经承诺的事。
```

</details>

### 文章与表达

<details>
<summary>给文章配图 — 只输出插图与图注</summary>

```text
使用 AhaFold，为我提供的文章生成3张小折插图，只交付图片和图注。每张表达不同的关键意思，正文不重写。
```

</details>

<details>
<summary>先看看配图思路 — 配图建议；不调用生图</summary>

```text
使用 AhaFold，先不要生图。读这篇文章，说明哪些段落值得配图、每张图解释什么、小折在做什么。
```

</details>

<details>
<summary>给家人解释技术 — 熟悉的情境 + 适用边界</summary>

```text
使用 AhaFold，给不懂电脑的家人解释云备份与文件同步的区别。用简体中文，以误删照片为例，讲清各自能做什么、不能保证什么。
```

</details>

### 技术与代码

<details>
<summary>让产品同事看懂接口 — 请求路径 + 关键状态</summary>

```text
使用 AhaFold，根据这段接口说明，给产品同事解释一次下单请求。用简体中文，区分已收到、处理中、已成功，不把超时当失败。
```

</details>

<details>
<summary>解释重试为什么出问题 — 时间线 + 具体失败情境</summary>

```text
使用 AhaFold，根据我提供的材料解释重复点击订票为什么可能重复下单。用简体中文，画出请求与回复的时间顺序，保留幂等键的适用条件。
```

</details>

<details>
<summary>看懂类型与运行时 — 代码旁的解释 + 边界</summary>

```text
使用 AhaFold，解释这段 TypeScript 接收 JSON 的代码。用简体中文，保留英文术语与原代码，区分编译期检查、运行时验证和类型断言。
```

</details>

### 修改与控制

<details>
<summary>太难了，再简单一点 — 局部改写；不重新生图</summary>

```text
使用 AhaFold，把现有页面第二段改成初学者能懂的简体中文。保留关键条件，其他内容和已有插图不变。
```

</details>

<details>
<summary>翻译正文，保留图片 — 换正文语言，保留原图</summary>

```text
使用 AhaFold，把这个HTML正文译成简体中文，保留原图。图片中的英文标签在中文图注里解释，不声称已修改图片内文字。
```

</details>

<details>
<summary>只要精确图解，不要插画 — 可选中文字的对照页</summary>

```text
使用 AhaFold，把这份术语表做成简体中文HTML对照页。不要角色、不要图片，保留准确的定义和一个最短例子。
```

</details>

<details>
<summary>控制图片数量 — 明确次数 + 如实标注未完成</summary>

```text
使用 AhaFold，把这份材料做成简体中文图解。本次最多调用原生生图2次，包括重试；预算用完时交付可读草稿并标出缺少的图片。
```

</details>


## 为什么有个“小折”

**Fold / 小折**是一张杏黄色、带青绿色折角的纸页角色。它负责做一个能解释关系的动作：放下包袱、递交申请、沿路径前进。精确图表不必硬塞角色进去。

AhaFold 借鉴 [Ian Xiaohei Illustrations](https://github.com/helloianneo/ian-xiaohei-illustrations) 的“让角色参与关键认知动作”，以及 [visual-explainer](https://github.com/nicobailon/visual-explainer) 的“把解释变成可读 HTML”。它用独立的小折角色和原创模板实现自己的轻量流程；不需要先安装那两个项目。

图像负责情境和直觉，HTML/SVG 负责可选中的文字、精确数值、代码和变化的状态。长文先给答案和总览，再按章节展开；配图随正文长度与内容调整。能直接读懂时，不强加交互。

## 适合什么，不适合什么

适合学习概念、文章图解、新人指南、规则说明、方案对比，以及基于你提供材料的技术解释。可请求仅插图、仅规划或无图页面。

不提供可编辑 PPTX、完整矢量插画源文件、自动代码库审计或自动发布服务。它也不保证生成事实、图中文字或类比永远正确。源文件、数字、限制条件和图片仍需核对；“看起来更清楚”不等于已经证明“学得更快”。

生成时，提示词与参考材料会发送给**当前工具的云服务**。使用的是你的宿主账号及额度，费用可能未知，订阅不代表无限生图。图片缺失、429、认证失败或结果不确定时停止该图片路线，可继续交付标明限制的可读草稿；不偷换模型服务，不自动 API fallback，不抹除供应商水印。

## 已实现到什么程度

下面是**已有安装到成品测试的历史覆盖**，不是对当前全部修订的重新认证。宿主原生功能探针、页面浏览器测试、真人理解效果是三种不同证据。

| 组合 | 状态 | 范围与限制 |
| --- | --- | --- |
| macOS / Codex | PASS | 历史有限的安装后生图、编辑与多语言案例通过；新版完整图文链路待重验。 |
| macOS / Grok Build | PARTIAL | 原生生成／参考／编辑可用；有内容、图文对应与手机阅读失败。 |
| macOS / Antigravity CLI | BLOCKED | 历史429，后续测试暂缓；未证明完整链路。 |
| Windows / Codex | NOT TESTED | 缺少原生 Windows 安装到成品证据。 |
| Windows / Grok Build | NOT TESTED | 同上。 |
| Windows / Antigravity CLI | NOT TESTED | 同上。 |
| Linux / Codex | NOT TESTED | 缺少 Linux 安装到成品证据。 |
| Linux / Grok Build | NOT TESTED | 同上。 |
| Linux / Antigravity CLI | NOT TESTED | 同上。 |

优先改进：**对当前版本重跑真实宿主验收；修复或明确长文刷新后焦点边界；逐项核对图文关系与事实；邀请首次接触的读者完成理解任务。** 保持一个 skill，不为分发增加常驻服务或多余的配置。

<details>
<summary>查看测试记录与尚未证明的部分</summary>

2026-09-12 对当前工作区重新运行：类型检查、包检查、安装器、短篇与长篇浏览器检查通过。长篇检查另报告2处禁用 JavaScript 时的原生刷新焦点限制，这些行为未算通过。本轮没有新增宿主生图调用，也未重新认证 Windows/Linux。

- [安装与原生验收](tests/validation.md)：版本、调用次数、测试范围。
- [Codex / Grok 专项评估](tests/focus-validation.md)：中文、英文、混排与实际失败。
- [长篇评估](tests/longform/results.md)：六次无图会话；三份 Codex 输出的60项必要事实一致，Grok 的60项中56项一致。这不能证明图文长篇链路。
- [长文图文检查](tests/longform/illustrated-results.md)：两张图的维护者整合样例及历史刷新焦点问题。后续已改动文件，旧结果不自动适用于当前版本。
- [长文行为检查](tests/longform/README.md)与[验收案例](tests/cases.md)：确定性测试不证明其他操作系统的 OAuth 生图，也不证明真人理解成本下降。

旧 Windows 长文 CI 曾失败，后续图文页的严格检查也记录过 macOS 刷新焦点失败。发布前必须检查当前提交的实际结果，不沿用旧绿色状态。无真人对照实验时，不宣称相较两个参考项目效果更好。

</details>

<details>
<summary>配图数量与宿主差异</summary>

短解释可能一张就够。长解释按生成正文估算，约每1000个中文/CJK字符或600个英文词一张，再按独立机制、难点和已覆盖内容调整；混排合并估算，完整初稿后重新核算。代码、表格、附录、图注和图片数据不凑字数；用户指定数量与授权预算优先，没有通用上限。

Codex 的首选图像目标更新为 `gpt-image-2.5`，可按需要规划中文标题、注释和概念图表。
Grok Build 与 Antigravity CLI 默认使用简单原生场景、无字或少量短标签，配合精确 HTML/SVG。
这是按宿主划分的创作策略，不是已实测的模型能力排名。
长正文、可执行代码、权威公式／数据和会变化的图表保留可编辑版本；重要图中文字同时提供可选中文本。
明确无图和纯精确表达的需求仍受支持；小折与交互按解释需要使用，也可以明确要求只输出插图。

首选目标不等于强制切换原生后端。2026-09-12 核对时，官方[图像提示指南](https://developers.openai.com/api/docs/guides/image-prompting)
已列出 2.5 API 变体，而 [Codex 生图文档](https://developers.openai.com/codex/image-generation)仍写 `gpt-image-2`。
只有实时原生工具支持模型选择时才传入受支持的目标；后端未披露时如实说明。
订阅登录不单独证明某个模型已开放或尚有额度；原生流程无需额外 API key，也不修改推理模型配置。

</details>

## 安装、更新与分发

**已经可以通过 npx 安装，不必另外发布 npm 包。** `npx` 运行固定版本的 `skills` 安装器，它从 GitHub 获取 `skills/ahafold/`。当前仓库私有，所以只有获授权用户能安装；公开仓库后，同一条命令才适合直接面向公众。

只选一个工具时，例如 Codex：

```sh
npx skills@1.5.23 add AGI-is-going-to-arrive/ahafold --skill ahafold --agent codex --copy
```

将 `codex` 换为 `grok` 或 `antigravity-cli` 即可。这里固定的是**安装器版本**，skill 内容跟随仓库默认分支，并未冻结 AhaFold 版本；稳定发布还需要标签与对对应版本的验收。

本地克隆安装时，把仓库名换为带引号的克隆目录。也可手动复制**整个 `skills/ahafold/`** 到对应目录，包括 `references/`、`assets/` 和 `LICENSE`。技能用户无需 `pnpm install`。这些说明按项目安装，全局安装尚未纳入已验证范围。

更新前保留本地修改，再运行同一安装命令。检查目录后，仅移除当前项目中的本 skill：

```sh
npx skills@1.5.23 remove ahafold -y
```

Codex 与 Antigravity CLI 共用 `.agents` 副本，移除会同时影响两者；其他技能与 `ahafold-output/` 不受影响。安装器可能为其他检测到的宿主保留共享副本，因此需检查实际目录。不要把凭据写进命令或问题反馈里。

<details>
<summary>维护者：介绍页与检查</summary>

根目录 [index.html](index.html) 是独立的双语介绍页，可本地打开。它复用已有原生图片，支持语言切换、场景筛选和提示词复制，普通浏览不调用模型。

[Pages 工作流](.github/workflows/pages.yml)仅在手动触发时发布介绍页、公开示例与许可说明；不上传 `tests/`、`output/` 或整个仓库。需要 GitHub Pages 可用并将来源设为 GitHub Actions。工作流存在不代表网站已经上线；仓库公开与 npm 发布都需要单独决定。

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm run typecheck
pnpm run check:package
pnpm run test:checks
pnpm run test:install
pnpm run test:examples
pnpm run test:longform
```

以上是维护者检查，不是使用 skill 的步骤；宿主验收需要另做。

</details>

## 许可与贡献

原创技能、模板、脚本及项目持有权利的资产采用 [MIT](LICENSE)。[NOTICE.md](NOTICE.md)说明参考项目、AI 生成图片来源与权利边界；保留原始图片和供应商标记。

欢迎带输入与预期输出的场景、清楚的语言改进、带日期的兼容性记录。请勿提交私人材料、token 或原始会话日志。
