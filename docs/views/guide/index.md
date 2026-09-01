# 指南

<AuthorTag :authors="['ZhuXiang','YangTianGuang','CHENY','ZhongYu']" />

欢迎来到 **AGILE TEAM** 工程体系文档——**金恒科技** 共享技术中心联合信息化中心交付团队的 AI 工程化实践知识库。

本站服务于团队各角色成员，涵盖前端、后端、测试、产品、运维等，系统化整理 **AI 辅助研发** 过程中沉淀的标准流程、规范约定、技能包与最佳实践。欢迎您的建议、批评与指正，也诚邀您的参与和贡献。

---

## 站点地图

### 🚀 快速上手

> 应用上手第一站，快速跑通开发环境。

[前端 → 快速上手](/frontend/quick-start/) — 环境搭建、VSCode 配置、项目结构、规范约定（⓪–⑪）、提交规范。

[后端 → 快速上手](/backend/) — 技术选型、Skills 安装、契约驱动生成、质量门与数据库治理流程。

---

### 🤖 AI 最佳实践

> 按能力层级，循序渐进掌握 AI 辅助开发。

| 层级 | 内容 | 状态 |
|---|---|---|
| [L0 — 氛围编程](/views/best-practices/L0-vibe) | 纯对话驱动，了解边界 | 已了解 |
| [L1 — 提示词工程](/views/best-practices/L1-prompt) | 规范注入 + 上下文压缩 + 一致性保持 | ✅ 已实现 |
| [L2 — Skill](/views/best-practices/L2-skill) | 13 个触发词驱动的结构化技能文件 | ✅ 已实现 |
| [L3 — MCP 工具调用](/views/best-practices/L3-skills-mcp) | 29 个 Tool，菜单/字典/权限/项目感知/快照蓝图/环境标准化全覆盖 | ✅ 已实现 |
| [L4 — CLI](/views/best-practices/L4-cli) | 18 条命令：init / update / clean / check / diff / validate / validate-page / fix / doctor-ui / export / mock-clean / contract / component / standard-env / template / snapshot / scenario | ✅ 已实现 |
| [L5 — Agent Pipeline](/views/best-practices/L5-agent-pipeline) | Skill 链式自动触发，_pipeline.md 协议已落地 | 🟡 践行中 |
| [L6 — Multi-Agent 协同](/views/best-practices/L6-multi-agent) | 专家 Agent 分工 + 并发处理 | ▶ 近期目标 |
| [L7 — 自演化体系](/views/best-practices/L7-self-evolving) | 高质量产出反哺规范，正向飞轮 | 🔭 终极形态 |

---

### 📦 五包工程能力

> 五个 npm 包覆盖设计 → 前端 → 视觉 → 后端 → 测试全链路，契约同源、独立安装。

| 包 | 文档入口 | 当前版本 |
|---|---|---|
| `wl-skills-design` | [产品设计 Skills](/views/ai-workflow/design-skills) | v0.11.1 |
| `wl-skills-kit` | [前端 PC Skills](/frontend/pc/skills/) | v2.20.1 |
| `wl-skills-ui` | [UI 统一规范](/views/styling/wl-skills-ui) | v1.12.0 |
| `wl-skills-bd` | [后端 Skills](/backend/skills/) | v0.24.0 |
| `wl-skills-test` | [测试工程 Skills](/views/testing/) | v0.11.0 |

配套工具：[工程脚手架 jh4j-cloud-cli](/scaffold/)（PC / 移动端 H5 模板一键创建）。

---

### 💻 前端

> 按端拆分，每端包含概览、规范、Skills 集合。

- **PC 端** — [概览 & 技术选型](/frontend/pc/) · [架构设计](/frontend/pc/architecture) · [扩展规范](/frontend/pc/standards) · [Skills 集合](/frontend/pc/skills/) · [使用指南](/frontend/pc/skills/usage-guide)
- **移动端 H5** — [概览 & 技术选型](/frontend/mobile-h5/) · [扩展规范](/frontend/mobile-h5/standards) · [Skills 集合](/frontend/mobile-h5/skills) · [使用指南](/frontend/mobile-h5/usage-guide) · [@robot-h5/core](/frontend/mobile-h5/h5-core/)
- **移动端 uniApp（基座）** — [概览 & 技术选型](/frontend/mobile-uniapp/) · [H5 子应用集成](/frontend/mobile-uniapp/integration) · [钉钉集成](/frontend/mobile-uniapp/dingtalk) · [App 集成与发布](/frontend/mobile-uniapp/app-integration) · [消息中心](/frontend/mobile-uniapp/message-center)

---

### ⚙️ 后端

> [概览 & 技术选型](/backend/) · [开发规范](/backend/standards) · [Skills 集合](/backend/skills/) · [使用指南](/backend/skills/usage-guide) · [契约流水线](/backend/skills/skill-pipeline)

---

### 🧪 测试

> [测试工程 Skills](/views/testing/)（v0.11.0）— 12 个 Skill、25 条审计规则（T1-T25）、3 个执行器（API/Playwright/JMeter）、test-reports 统一报告与 gate 质量门。[使用指南](/views/testing/usage-guide) · [功能链](/views/testing/functional) · [自动化](/views/testing/automation) · [性能](/views/testing/performance)。

---

### 📋 产品 & 需求

> [产品设计 Skills](/views/ai-workflow/design-skills)（wl-skills-design v0.11.1）— 流程图、需求说明书（IPO 按钮级颗粒度）、原型标注（D1–D3）、数据库/接口设计、术语词典、变更影响、集成评审；`verify` CLI 四域机械校验。[原型标注实战](/views/ai-workflow/prototype)。

---

### 🔧 运维 & DevOps <Badge type="warning" text="规划中" />

部署规范、CI/CD 流水线、环境管理。

---

### 🔄 AI 工作流

> [AI 工作流](/views/ai-workflow/) — AI 驱动的全流程工程化实践，从原型设计到测试交付。

---

## 我该从哪里开始？

| 你是… | 推荐路径 |
|---|---|
| **刚了解前端的小伙伴** | [快速上手](/frontend/quick-start/) → [PC 架构设计](/frontend/pc/architecture) → [Skills 集合](/frontend/pc/skills/) |
| **移动端开发** | [快速上手](/frontend/quick-start/) → [H5 概览](/frontend/mobile-h5/) → [基座集成](/frontend/mobile-uniapp/integration) → [@robot-h5/core](/frontend/mobile-h5/h5-core/) |
| **后端开发** | [后端概览](/backend/) → [后端 Skills](/backend/skills/) → [使用指南](/backend/skills/usage-guide) |
| **测试工程师** | [测试工程 Skills](/views/testing/) → [使用指南](/views/testing/usage-guide) → [AI 最佳实践](/views/best-practices/) |
| **产品经理** | [产品设计 Skills](/views/ai-workflow/design-skills) → [AI 工作流](/views/ai-workflow/) |
| **想用 AI 提效** | [AI 最佳实践](/views/best-practices/) → [AI 工作流](/views/ai-workflow/) |

## 联系我们

- **团队内部沟通**：飞书
- **评论区留言**：页面底部 Waline 评论区
