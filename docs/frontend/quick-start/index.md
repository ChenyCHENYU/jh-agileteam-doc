# 前端快速上手

<AuthorTag author="CHENY" />

前端团队工程体系的入门导航。无论你是新入职的前端、转全栈的后端，还是想了解前端 AI 工程化实践的同学，从这里开始。

## 入职三步走

入职环境配置只需三步，按顺序执行即可：

**Step 1 — 开发环境**

确认本机已安装：Node.js `>= 18`、pnpm `>= 10`、Git `>= 2.30`。
详见 [快速开始 → 环境准备](./getting-started)。

**Step 2 — 编辑器同步**

一条命令同步团队 VS Code / Cursor / Windsurf 配置（44 个插件 + settings + keybindings）：

```bash
npm i -g @agile-team/vscode-config
vscode-config install
```

详见 [安装配置](./installation)。

**Step 3 — AI Skill 体系**

在业务项目根目录执行，导入 13 条规范 + 9 个 AI Skill：

```bash
npx @agile-team/wl-skills-kit
```

详见 [PC 端 Skills 概述](../pc/skills/)。

---

## 本章节导航

| 页面 | 说明 |
|------|------|
| [快速开始](./getting-started) | Node / pnpm 环境检查、克隆项目、启动开发服务器、`.npmrc` 配置 |
| [安装配置](./installation) | `@agile-team/vscode-config` 一键同步编辑器环境 + 44 个插件介绍 |
| [项目结构](./project-structure) | 目录结构说明、各层职责、关键配置文件 |
| [规范约定 ①–③](./01-toolchain) | 工具链、代码结构、注释规范 |
| [规范约定 ④–⑦](./04-coding-basics) | 编码基础、日志、安全、配置管理 |
| [规范约定 ⑧–⑨](./08-git) | Git 工作流、TypeScript 规范 |
| [规范约定 ⑩–⑪](./10-pinia) | Pinia 状态管理、表单校验 |
| [提交规范](./commit-standards) | Conventional Commits + commitizen 交互提交 |
| [ESLint & Prettier](./eslint-prettier-ts) | 团队 Flat Config 配置说明 |

---

## 联系我们

- **团队内部沟通**：飞书
- **评论区留言**：页面底部 Waline 评论区