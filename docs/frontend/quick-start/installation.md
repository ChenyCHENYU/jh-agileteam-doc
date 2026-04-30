# 安装配置

工欲善其事，必先利其器。本章节介绍如何一键同步团队编辑器环境，以及所有插件的用途说明，也给转全栈的后端伙伴查看前端代码提供便利。

## 编辑器配置

### ♥️ 一键同步工具 <Badge type="tip" text="推荐" />

[@agile-team/vscode-config](https://www.npmjs.com/package/@agile-team/vscode-config) — 团队编辑器配置**一键同步**工具。一条命令同步 VS Code / Cursor / Windsurf / Kiro 的 `settings`、`keybindings`、`extensions`，作者维护配置仓库，团队成员一键拉取，支持备份恢复与增量合并。

<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
  <a href="https://www.npmjs.com/package/@agile-team/vscode-config">
    <img src="https://img.shields.io/npm/v/@agile-team/vscode-config.svg" alt="npm version" />
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" />
  </a>
</div>

#### 快速开始

```bash
# Step 1：全局安装
npm i -g @agile-team/vscode-config

# Step 2：一键同步团队配置（交互式选择编辑器和模式）
vscode-config install
```

> **就这两步。** 工具会自动检测已安装的编辑器、拉取远程配置、安装 45 个团队插件，并在安装前自动备份你的现有配置。

#### 核心特性

| 特性 | 说明 |
|------|------|
| 🚀 一键安装 | 交互式选择编辑器和模式，自动完成全部配置 |
| 🌐 双源加速 | GitHub 主源 + Gitee 备用源，国内无需配置自动切换 |
| 💾 自动备份 | 安装前自动备份，`vscode-config restore` 随时回滚 |
| 🔄 双模式 | 覆盖（完全一致）或合并（保留个人偏好）|
| 🖥️ 多编辑器 | VS Code / Cursor / Windsurf / Kiro，`--editor all` 一次全装 |
| 🛡️ 只增不减 | 绝不卸载已有插件，100% 安全 |
| 📦 离线支持 | 内网环境配合伴侣包 `@agile-team/vscode-config-extensions` 离线安装 |
| ⚡ 预览模式 | `--dry-run` 不写入任何文件，先看再决定 |

::: details 📖 完整命令参考

**install — 安装/同步配置**

```bash
vscode-config install                              # 交互式（推荐）
vscode-config install --editor vscode              # 指定编辑器
vscode-config install --editor all                 # 同步所有编辑器
vscode-config install --mode merge                 # 合并模式，保留个人设置
vscode-config install --source gitee --timeout 120 # 内网/网络差时用
vscode-config install --dry-run                    # 预览，不实际写入
vscode-config install --force                      # 跳过确认强制安装
```

| 选项 | 说明 | 默认 |
|------|------|------|
| `--editor <name>` | vscode / cursor / windsurf / kiro / all | 交互式选择 |
| `--mode <mode>` | override（覆盖）/ merge（合并）| override |
| `--source <name>` | github / gitee | 自动切换 |
| `--timeout <sec>` | 插件安装超时秒数 | 30 |
| `--force` | 跳过备份和交互确认 | false |
| `--dry-run` | 预览模式，不写入 | false |
| `-v` | 显示详细诊断日志 | false |

**status / restore / clean**

```bash
vscode-config status                        # 检查编辑器版本、配置、已装插件、备份
vscode-config restore                       # 恢复最新备份
vscode-config restore --list                # 列出所有备份
vscode-config restore --backup <path>       # 恢复指定备份
vscode-config clean                         # 清理 30 天前的旧备份
vscode-config clean --older-than 7          # 清理 7 天前的旧备份
```

:::

::: details 🔄 安装模式说明

| 模式 | 效果 | 适用场景 |
|------|------|---------|
| **覆盖（默认）** | 完全替换 settings / keybindings，保证团队完全一致 | 新机器初始化、重置为团队标准 |
| **合并 `--mode merge`** | 深度合并，同名 key 覆盖，独有 key 保留 | 已有个人配置，只同步团队新增 |

两种模式都会在安装前自动备份，可随时 `restore` 回滚。

:::

::: details 🖥️ 多编辑器支持

内置 **VS Code、Cursor、Windsurf、Kiro** 四种编辑器，支持通过 `.vscode-configrc.json` 自定义更多（如 Trae、Zed 等）。

- 不带 `--editor` 时交互式选择，自动检测已安装编辑器，未安装的置灰不可选
- `--editor all` 同时同步所有已检测编辑器
- 自定义编辑器在 `.vscode-configrc.json` 的 `editors` 字段中注册

:::

::: details 📦 内网 / 云桌面 / 离线

**扩展安装优先级**（工具自动判断，无需手动配置）：

```
1. --extensions-dir 参数          ← 显式指定 .vsix 目录
2. VSCODE_CONFIG_EXTENSIONS_DIR   ← 环境变量
3. @agile-team/vscode-config-extensions ← 伴侣包（自动检测）
4. 在线 marketplace               ← 默认
```

**云桌面一键安装**：

```bash
npm i -g @agile-team/vscode-config @agile-team/vscode-config-extensions
vscode-config install
# 主工具自动发现伴侣包中的 .vsix，无需额外参数
```

> 注意：伴侣包不含 AI 类插件（copilot / roo-cline / cline 等），因为它们在内网无法连接 AI 服务。

:::

::: details 🔧 故障排除

| 现象 | 解决方案 |
|------|---------|
| 下载超时或失败 | `vscode-config install --source gitee --timeout 120` |
| XXX 编辑器未检测到 | 确保对应编辑器 CLI 命令已加入 PATH |
| 所有插件均失败 | 可能处于内网，参考上方「内网/云桌面/离线」方案 |
| 部分插件失败 | 工具会输出手动安装命令，复制执行即可 |
| 需要回滚 | `vscode-config restore` |
| 想看详细日志 | `vscode-config install -v` |

```bash
# 零风险体验流程
vscode-config install --dry-run   # 预览，不写入
vscode-config install             # 正式安装（自动备份）
vscode-config restore             # 不满意？一键恢复
```

:::

---

## 插件清单

共收录 **44 个**团队标准插件，由 `vscode-config install` 自动安装。点击分类名称可展开每个插件的详细介绍。

| 分类 | 插件 |
|------|------|
| AI 编程助手 | GitHub Copilot Chat · Roo Cline · Cline 汉化版 · 申算云 Cline |
| 前端框架 & 样式 | Volar · UnoCSS |
| 代码质量 & 格式化 | ESLint · Prettier · EditorConfig · Code Spell Checker |
| TypeScript & 模块 | TS Importer · Import Cost · CSS Peek |
| 高效编码辅助 | Auto Close Tag · Auto Rename Tag · Path Intellisense · Better Comments · Todo Tree · Turbo Console Log |
| Git & 版本控制 | GitLens · Git History · Git Graph |
| 调试 & 测试 | Code Runner · Vitest Explorer · Spec Kit · REST Client |
| UI & 视觉增强 | Material Icon Theme · Iconify · Iconify Preview · Color Highlight · Error Lens |
| 项目管理 & 工具 | Project Manager · Project Tree · CodeSnap · KoroFileHeader · Linter |
| uni-app | uni-app Schemas · uni-app Snippets |
| 语言 & 翻译 | 简体中文语言包 · Samge Translate · Emoji · Markdown Preview Enhanced · Live Server |
| 其他实用工具 | any-rule |

---

### AI 编程助手

::: details **github.copilot-chat** — GitHub Copilot Chat
**扩展 ID**：`github.copilot-chat`  
**作者**：GitHub  
**简介**：GitHub 官方 AI 编程助手，深度集成 VS Code，支持代码补全、对话问答、代码解释、Agent 模式。

**核心能力**
- 行内代码补全（`Tab` 接受建议）
- Chat 面板对话（`Ctrl+Shift+I`）
- Inline Chat（`Ctrl+I` 在代码中直接问）
- Agent 模式：多文件修改、终端执行、自主完成复杂任务

**使用方式**
```
# 行内补全：正常写代码，Tab 接受
# 对话问答：Ctrl+Shift+I 打开聊天面板
# 指令文件：项目根目录 .github/copilot-instructions.md 注入团队规范
```
> 团队已配置 `copilot-instructions.md`，安装后 AI 自动遵守项目编码规范。

**注意**：需要 GitHub Copilot 订阅（个人 $10/月，学生免费）。
:::

::: details **rooveterinaryinc.roo-cline** — Roo Cline
**扩展 ID**：`rooveterinaryinc.roo-cline`  
**作者**：Roo Veterinary  
**简介**：基于 Cline 的增强 Agent，支持连接多种 AI 模型（Claude / GPT-4 / Gemini / 本地模型），可主动读写文件、执行命令、调用 MCP Tools，是团队 L3/L5 能力的核心载体之一。

**核心能力**
- 多模型支持（API Key 自带，支持 OpenRouter）
- 主动调用 MCP Server（菜单/字典/权限同步）
- 读写文件、执行终端命令
- 长上下文 Agent 任务（适合多文件修改）

**使用方式**
```
侧边栏 Roo Cline 面板 → 配置 API Provider → 输入任务描述
MCP 工具在 .vscode/mcp.json 配置后自动可用
```
:::

::: details **hybridtalentcomputing.cline-chinese** — Cline 汉化版
**扩展 ID**：`hybridtalentcomputing.cline-chinese`  
**作者**：HybridTalent Computing  
**简介**：Cline 的中文汉化版本，界面全中文，降低使用门槛，适合习惯中文操作界面的团队成员。
:::

::: details **shengsuan-cloud.cline-shengsuan** — 申算云 Cline
**扩展 ID**：`shengsuan-cloud.cline-shengsuan`  
**作者**：申算云  
**简介**：另一个 Cline 中文定制版，集成申算云 AI 服务，可在内网环境下使用申算云自建模型进行 Agent 编程。
:::

---

### 前端框架 & 样式

::: details **vue.volar** — Vue - Official（Volar）
**扩展 ID**：`vue.volar`  
**作者**：Vue 官方  
**简介**：Vue 3 官方语言服务插件，提供 `.vue` 文件完整的语法高亮、类型检查、智能补全、代码跳转支持。**Vue 3 项目必装**。

**核心能力**
- `.vue` SFC 完整 TypeScript 支持
- `<template>` 中的类型推导和自动补全
- 组件 props / emits 类型检查
- `defineProps` / `defineEmits` 类型提示
- 与 `@vue/language-tools` 配合使用

> **注意**：Vue 3 项目中必须使用 Volar，旧版 Vetur 不兼容 Vue 3，请卸载 Vetur。
:::

::: details **antfu.unocss** — UnoCSS IntelliSense
**扩展 ID**：`antfu.unocss`  
**作者**：Anthony Fu  
**简介**：UnoCSS 的官方 VS Code 插件，提供 class 智能补全、悬停预览 CSS 值、规则搜索。项目使用 UnoCSS 时必装。

**核心能力**
- class 名称自动补全
- 悬停 class 时显示生成的 CSS 规则
- 支持自定义规则的智能感知
:::

---

### 代码质量 & 格式化

::: details **dbaeumer.vscode-eslint** — ESLint
**扩展 ID**：`dbaeumer.vscode-eslint`  
**作者**：Microsoft  
**简介**：将 ESLint 集成到编辑器，实时显示代码问题，支持保存时自动修复。团队代码规范的核心保障工具。

**核心能力**
- 实时波浪线标注 ESLint 规则违反
- 保存时自动执行 `eslint --fix`
- 支持 `eslint.config.ts`（Flat Config）

**关键配置**（团队已通过 `vscode-config install` 统一下发）
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```
:::

::: details **esbenp.prettier-vscode** — Prettier
**扩展 ID**：`esbenp.prettier-vscode`  
**作者**：Esben Petersen  
**简介**：代码格式化工具，支持 JS/TS/Vue/CSS/JSON/MD 等格式。保存时自动格式化，消除代码风格争议。

**关键配置**（团队已统一下发）
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```
> 格式化规则由项目根目录 `.prettierrc.js` 定义，`vscode-config install` 不覆盖项目文件。
:::

::: details **editorconfig.editorconfig** — EditorConfig
**扩展 ID**：`editorconfig.editorconfig`  
**作者**：EditorConfig  
**简介**：读取项目根目录 `.editorconfig` 文件，自动设置缩进、换行符、编码等编辑器行为。跨编辑器统一基础格式的第一道防线。

**核心能力**
- 自动应用 `.editorconfig` 配置（缩进、BOM、换行符等）
- 比 Prettier 更轻量，适合非 JS 文件（如 `.sh`、`.yml`）
:::

::: details **streetsidesoftware.code-spell-checker** — Code Spell Checker
**扩展 ID**：`streetsidesoftware.code-spell-checker`  
**作者**：Street Side Software  
**简介**：拼写检查器，实时标注代码中的英文拼写错误（如把 `message` 写成 `mesage`）。对英文注释和变量命名特别有用。

**使用方式**
- 拼写错误处有波浪线，点击可快速修复或加入忽略词典
- 项目级忽略词：在 `settings.json` 的 `cSpell.words` 中添加
:::

---

### TypeScript & 模块智能

::: details **pmneo.tsimporter** — TS Importer
**扩展 ID**：`pmneo.tsimporter`  
**作者**：pmneo  
**简介**：TypeScript 自动导入辅助工具，扫描项目文件并建立索引，输入类型/函数名时自动提示并添加 import 语句。

**核心能力**
- 自动扫描项目 TS/Vue 文件建立补全索引
- 输入标识符时弹出「来自哪个文件」的补全提示
- 选中后自动在文件顶部插入 import 语句
:::

::: details **wix.vscode-import-cost** — Import Cost
**扩展 ID**：`wix.vscode-import-cost`  
**作者**：Wix  
**简介**：在 import 语句行末显示该包的体积大小（gzip 后），帮助开发者感知引入包对 Bundle 的影响。

```ts
import lodash from 'lodash'  // 显示：68.3 kB (gzipped: 24.5 kB)
import { cloneDeep } from 'lodash-es'  // 显示：~5.2 kB
```
:::

::: details **pranaygp.vscode-css-peek** — CSS Peek
**扩展 ID**：`pranaygp.vscode-css-peek`  
**作者**：Pranay Prakash  
**简介**：在 HTML/Vue 模板中 `Ctrl+点击` 或 `F12` 跳转到对应的 CSS 类定义，或悬停预览样式内容。

**使用方式**
```
在模板中 hover class 名 → 弹出 CSS 预览
Ctrl + 点击 class 名 → 跳转到 CSS 文件对应行
```
:::

---

### 高效编码辅助

::: details **formulahendry.auto-close-tag** — Auto Close Tag
**扩展 ID**：`formulahendry.auto-close-tag`  
**作者**：Jun Han  
**简介**：输入 HTML/Vue 开标签后自动插入对应的闭标签。减少重复输入，在 `<template>` 区块中频繁使用。
:::

::: details **formulahendry.auto-rename-tag** — Auto Rename Tag
**扩展 ID**：`formulahendry.auto-rename-tag`  
**作者**：Jun Han  
**简介**：修改 HTML/Vue 开标签时，自动同步修改对应的闭标签（反之亦然）。重构 DOM 结构时省心省力。
:::

::: details **christian-kohler.path-intellisense** — Path Intellisense
**扩展 ID**：`christian-kohler.path-intellisense`  
**作者**：Christian Kohler  
**简介**：路径智能补全，在 `import`、`src`、`href` 等处输入路径时自动提示目录和文件名。支持路径别名（`@/`）。
:::

::: details **aaron-bnd.better-comments** — Better Comments
**扩展 ID**：`aaron-bnd.better-comments`  
**作者**：Aaron Bond  
**简介**：通过注释前缀区分注释类型并着色，让注释更语义化、更易扫描。

**注释分类颜色**
```ts
// ! 红色：警告、危险、重要
// ? 蓝色：疑问、待确认
// TODO 橙色：待办事项
// * 绿色：强调、重点说明
// 普通注释：灰色（暗化）
```
:::

::: details **gruntfuggly.todo-tree** — Todo Tree
**扩展 ID**：`gruntfuggly.todo-tree`  
**作者**：Gruntfuggly  
**简介**：扫描整个项目中的 `TODO`、`FIXME`、`HACK` 等标记，在侧边栏以树状结构展示，方便追踪待办。

**使用方式**
- 侧边栏 Todo Tree 图标 → 查看所有 TODO 列表
- 点击条目直接跳转到对应文件和行
:::

::: details **chakrounanas.turbo-console-log** — Turbo Console Log
**扩展 ID**：`chakrounanas.turbo-console-log`  
**作者**：Chakroun Anas  
**简介**：快速插入、注释、删除 `console.log` 的效率工具。选中变量后一键插入带变量名的 log 语句。

**快捷键**
```
Ctrl + Alt + L   选中变量后插入 console.log（自动带变量名和行号）
Ctrl + Alt + /   注释当前文件所有 console.log
Ctrl + Alt + D   删除当前文件所有 console.log
```
:::

---

### Git & 版本控制

::: details **eamodio.gitlens** — GitLens
**扩展 ID**：`eamodio.gitlens`  
**作者**：GitKraken  
**简介**：VS Code 最强 Git 增强插件。在代码行末显示最后提交信息（blame），提供提交历史、分支对比、文件时间线等可视化功能。

**核心能力**
- 行末 inline blame（谁在什么时候改了这行）
- 侧边栏 Source Control 增强（提交历史树、分支视图）
- File History（当前文件的所有提交记录）
- 提交详情对比、Cherry-pick、Revert 等操作
:::

::: details **donjayamanne.githistory** — Git History
**扩展 ID**：`donjayamanne.githistory`  
**作者**：Don Jayamanne  
**简介**：图形化 Git 提交历史查看器。`Ctrl+Shift+P` → `Git: View History` 打开提交日志，支持搜索、对比、恢复文件到历史版本。
:::

::: details **mhutchie.git-graph** — Git Graph
**扩展 ID**：`mhutchie.git-graph`  
**作者**：mhutchie  
**简介**：以分支图形式可视化 Git 提交历史，类似 SourceTree 的 DAG 视图。适合理解复杂分支合并关系。

**使用方式**
```
底部状态栏点击 "Git Graph" → 打开分支图
右键提交节点 → Checkout / Cherry-pick / Revert 等操作
```
:::

---

### 调试 & 测试

::: details **formulahendry.code-runner** — Code Runner
**扩展 ID**：`formulahendry.code-runner`  
**作者**：Jun Han  
**简介**：快速运行当前文件或选中代码片段，支持 Node.js、Python、Java、Shell 等 40+ 语言，适合快速验证代码逻辑。

**使用方式**
```
Ctrl + Alt + N   运行当前文件
选中代码 → 右键 → Run Code   运行选中片段
```
:::

::: details **vitest.explorer** — Vitest Explorer
**扩展 ID**：`vitest.explorer`  
**作者**：Vitest Team  
**简介**：Vitest 的官方 VS Code 插件，在测试资源管理器中展示测试用例，支持单步运行、调试和实时结果查看。

**核心能力**
- 侧边栏测试树，展示所有 `describe` / `it` 用例
- 单个用例运行 / 全量运行 / Watch 模式
- 测试失败时直接在代码行高亮
:::

::: details **hisn0w.spec-kit-vscode** — Spec Kit
**扩展 ID**：`hisn0w.spec-kit-vscode`  
**作者**：hisn0w  
**简介**：快速生成测试文件骨架的工具，从源文件一键创建对应的 `.spec.ts` 测试文件，自动填充基础 `describe` 结构。
:::

::: details **humao.rest-client** — REST Client
**扩展 ID**：`humao.rest-client`  
**作者**：Huachao Mao  
**简介**：直接在 VS Code 中发送 HTTP 请求的工具，无需 Postman。在 `.http` 文件中编写请求，点击 `Send Request` 即可执行。

**使用方式**
```http
### 查询用户列表
GET http://localhost:8080/api/users
Authorization: Bearer {{token}}

### 创建用户
POST http://localhost:8080/api/users
Content-Type: application/json

{
  "name": "张三",
  "role": "admin"
}
```
:::

---

### UI & 视觉增强

::: details **pkief.material-icon-theme** — Material Icon Theme
**扩展 ID**：`pkief.material-icon-theme`  
**作者**：Philipp Kief  
**简介**：Material Design 风格的文件图标主题，为不同类型的文件显示直观的彩色图标，大幅提升文件树可读性。

**覆盖范围**：Vue / TS / JSON / CSS / Git / Docker / Markdown 等 200+ 文件类型
:::

::: details **antfu.iconify** — Iconify IntelliSense
**扩展 ID**：`antfu.iconify`  
**作者**：Anthony Fu  
**简介**：在代码中悬停 Iconify 图标名称时实时预览图标，并提供图标搜索和自动补全。配合 UnoCSS 的 `i-` 前缀使用。

**使用方式**
```html
<!-- 悬停 "i-mdi-home" 时显示图标预览 -->
<div class="i-mdi-home" />
```
:::

::: details **hnghg255.iconify-preview** — Iconify Preview
**扩展 ID**：`hnghg255.iconify-preview`  
**作者**：hnghg255  
**简介**：Iconify 图标预览补充工具，在侧边栏提供图标库浏览和搜索功能，方便选择合适的图标名称。
:::

::: details **naumovs.color-highlight** — Color Highlight
**扩展 ID**：`naumovs.color-highlight`  
**作者**：Sergii Naumov  
**简介**：在代码中高亮显示颜色值（HEX / RGB / HSL / CSS 变量），颜色字面量会用对应颜色作背景标注，直观查看颜色效果。

```css
color: #1677ff;    /* 方块显示蓝色 */
background: rgba(0,0,0,0.5);  /* 方块显示半透明黑 */
```
:::

::: details **usernamehw.errorlens** — Error Lens
**扩展 ID**：`usernamehw.errorlens`  
**作者**：Alexander  
**简介**：将错误、警告、提示直接显示在代码行末（inline），无需把鼠标移到波浪线上才能看到错误原因，极大提升错误感知效率。

```ts
const x: number = "hello"
//                ^^^^^^^ Type 'string' is not assignable to type 'number'.
```
:::

---

### 项目管理 & 工具

::: details **alefragnani.project-manager** — Project Manager
**扩展 ID**：`alefragnani.project-manager`  
**作者**：Alessandro Fragnani  
**简介**：多项目管理工具，保存项目收藏夹，在侧边栏一键切换不同项目，无需每次手动打开目录。适合同时维护多个项目的开发者。

**使用方式**
- 侧边栏 Project Manager 图标 → 保存当前项目
- `Ctrl+Shift+P` → `Project Manager: Open Project` → 切换项目
:::

::: details **zhucy.project-tree** — Project Tree
**扩展 ID**：`zhucy.project-tree`  
**作者**：zhucy  
**简介**：一键生成项目目录树（Markdown 格式），可快速插入 README 或分享给他人。

**使用方式**
```
Ctrl+Shift+P → "Project Tree: Generate" → 输出目录树到新标签页
```
:::

::: details **adpyke.codesnap** — CodeSnap
**扩展 ID**：`adpyke.codesnap`  
**作者**：adpyke  
**简介**：代码截图工具，生成美观的代码图片（带背景、行号、主题配色），适合分享代码片段到飞书/微信/PPT。

**使用方式**
```
选中代码 → 右键 → CodeSnap → 调整配置 → 保存图片
```
:::

::: details **obkoro1.korofileheader** — KoroFileHeader
**扩展 ID**：`obkoro1.korofileheader`  
**作者**：OBKoro1  
**简介**：自动生成文件头注释（作者、日期、描述）和函数注释，支持自定义模板，满足团队注释规范要求。

**快捷键**
```
Ctrl + Alt + I   生成文件头注释
Ctrl + Alt + T   生成函数注释
```
:::

::: details **fnando.linter** — Linter
**扩展 ID**：`fnando.linter`  
**作者**：fnando  
**简介**：通用 Lint 运行器，可配置运行自定义 lint 命令并将结果映射到编辑器 Problems 面板，适合接入非 ESLint 的检查工具。
:::

---

### uni-app

::: details **uni-helper.uni-app-schemas-vscode** — uni-app Schemas
**扩展 ID**：`uni-helper.uni-app-schemas-vscode`  
**作者**：uni-helper  
**简介**：为 uni-app 项目的配置文件（`pages.json`、`manifest.json`、`uni.scss` 等）提供 JSON Schema 校验和智能补全，避免配置字段写错。
:::

::: details **uni-helper.uni-app-snippets-vscode** — uni-app Snippets
**扩展 ID**：`uni-helper.uni-app-snippets-vscode`  
**作者**：uni-helper  
**简介**：uni-app 专用代码片段集合，提供 `uni-*` 组件、API 调用的快速输入模板，减少 uni-app 开发中的重复输入。
:::

---

### 语言 & 翻译

::: details **ms-ceintl.vscode-language-pack-zh-hans** — 简体中文语言包
**扩展 ID**：`ms-ceintl.vscode-language-pack-zh-hans`  
**作者**：Microsoft  
**简介**：将 VS Code 界面、菜单、提示文字全部汉化为简体中文，降低非英文母语开发者的使用门槛。安装后按提示重启即可生效。
:::

::: details **samge.vscode-samge-translate** — Samge Translate
**扩展 ID**：`samge.vscode-samge-translate`  
**作者**：Samge  
**简介**：代码内翻译工具，选中代码中的英文文本后一键翻译为中文（或反向），方便理解第三方代码的变量命名含义。
:::

::: details **perkovec.emoji** — Emoji
**扩展 ID**：`perkovec.emoji`  
**作者**：Perkovec  
**简介**：Emoji 输入辅助，在文档、注释、提交信息中快速搜索和插入 Emoji 表情，提升文档可读性。

**使用方式**
```
Ctrl+Shift+P → "Emoji: Insert" → 搜索 emoji 名称 → 插入
```
:::

::: details **shd101wyy.markdown-preview-enhanced** — Markdown Preview Enhanced
**扩展 ID**：`shd101wyy.markdown-preview-enhanced`  
**作者**：Yiyi Wang  
**简介**：功能强大的 Markdown 预览插件，支持数学公式（KaTeX）、流程图（Mermaid）、导出 PDF/HTML，比内置预览功能丰富得多。

**使用方式**
```
Ctrl+Shift+V → 打开增强预览面板（与编辑器同步滚动）
```
:::

::: details **ritwickdey.liveserver** — Live Server
**扩展 ID**：`ritwickdey.liveserver`  
**作者**：Ritwick Dey  
**简介**：本地静态服务器，打开 HTML 文件后启动带热重载的本地预览服务，适合临时查看静态页面效果（如原型 HTML）。

**使用方式**
```
右键 HTML 文件 → Open with Live Server → 浏览器自动打开并实时刷新
```
:::

---

### 其他实用工具

::: details **russell.any-rule** — any-rule（正则大全）
**扩展 ID**：`russell.any-rule`  
**作者**：Russell  
**简介**：内置 200+ 常用正则表达式的查询工具，覆盖手机号、邮箱、身份证、URL、IP、日期等高频场景，告别手写正则。

**使用方式**
```
F1 / Ctrl+Shift+P → 输入 "any-rule" → 搜索场景关键词 → 插入正则
或在代码中输入 @ 触发正则提示（需开启 snippets 模式）
```
:::

---

## 下一步

配置完成后,你可以:

- 📖 熟悉 [项目结构](/views/guide/project-structure)
- 🎨 掌握 [规范约定](/views/guide/development-standards) 
- 🛠️ 了解 [元配置](/views/guide/project-config)

