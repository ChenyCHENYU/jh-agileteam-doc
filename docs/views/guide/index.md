# 指南

<AuthorTag :authors="['ZhuXiang','YangTianGuang','CHENY','ZhongYu']" />

欢迎来到 **AGILE TEAM** 工程体系文档——**金恒科技** 共享技术中心联合信息化中心交付团队的 AI 工程化实践知识库。

本站服务于团队各角色成员，涵盖前端、后端、测试、产品、运维等，系统化整理 **AI 辅助研发** 过程中沉淀的标准流程、规范约定、技能包与最佳实践。欢迎您的建议、批评与指正，也诚邀您的参与和贡献。

---

## 站点地图

### 🚀 快速上手

> 应用上手第一站，快速跑通开发环境。

[前端 → 快速上手](/frontend/quick-start/) — 环境搭建、VSCode 配置、项目结构、11 篇规范详解、提交规范；日常用法见 [Skills 使用指南](/frontend/pc/skills/usage-guide)。

[后端 → 快速上手](/backend/quick-start) — 环境准备、契约生成三段式、数据库变更流程、常见问题。

---

### 📦 五包工程能力

> 五个 npm 包覆盖设计 → 前端 → 视觉 → 后端 → 测试全链路，契约同源、独立安装。

<PackagesTable />

**按场景选包**：

| 你要做的事 | 用这个包 |
|---|---|
| 从需求/原型产出设计文档（流程图/说明书/数据库/接口） | `wl-skills-design` |
| 写 PC 端页面、同步菜单字典权限 | `wl-skills-kit` |
| 统一视觉、扫描修复 UI 偏差 | `wl-skills-ui` |
| 写后端微服务、管数据库变更 | `wl-skills-bd` |
| 生成用例、跑自动化、出测试报告 | `wl-skills-test` |

配套工具：[工程脚手架 jh4j-cloud-cli](/scaffold/)（PC / 移动端 H5 模板一键创建）。

---

### 🎯 任务直达

> 按"我现在要做的事"找入口，不用先读完文档。

| 任务 | 直达 |
|------|------|
| 新项目起架子 | [脚手架创建](/scaffold/) → [前端快速上手](/frontend/quick-start/) 或 [后端快速上手](/backend/quick-start) |
| 从原型/说明书生成一个 PC 页面 | [prototype-scan](/frontend/pc/skills/prototype-scan) → [page-codegen](/frontend/pc/skills/page-codegen) |
| 提测/提交前自查 | kit `validate`（[CLI](/frontend/pc/skills/cli)）· bd `validate` + `review run`（[使用指南](/backend/skills/usage-guide)）· test `gate`（[质量门](/views/testing/)） |
| 存量项目体检 | kit `validate`（前端）· bd `validate` + `db drift`（后端）· test `audit`（测试脚本） |
| 客户环境迁移 | kit / bd 环境标准化（[scan → plan → apply → verify](/frontend/pc/skills/usage-guide)） |
| 页面视觉对齐 | [wl-skills-ui 扫描与修复](/views/styling/wl-skills-ui) |
| 出测试报告 | test [report / gate](/views/testing/) |
| 组织一次宣贯 | [宣贯方案](/views/rollout/) |

---

### 🤖 AI 最佳实践

> 按能力层级，循序渐进掌握 AI 辅助开发。

| 层级 | 内容 | 状态 |
|---|---|---|
| [L0 — 氛围编程](/views/best-practices/L0-vibe) | 纯对话驱动，了解边界 | 已了解 |
| [L1 — 提示词工程](/views/best-practices/L1-prompt) | 规范注入 + 上下文压缩 + 一致性保持 | ✅ 已实现 |
| [L2 — Skill](/views/best-practices/L2-skill) | 13 个触发词驱动的结构化技能文件 | ✅ 已实现 |
| [L3 — MCP 工具调用](/views/best-practices/L3-skills-mcp) | 29 个 Tool，菜单/字典/权限/项目感知/快照蓝图/环境标准化全覆盖 | ✅ 已实现 |
| [L4 — CLI](/views/best-practices/L4-cli) | 18 条命令，覆盖安装/校验/修复/契约/场景渲染全生命周期 | ✅ 已实现 |
| [L5 — Agent Pipeline](/views/best-practices/L5-agent-pipeline) | Skill 链式自动触发，_pipeline.md 协议已落地 | 🟡 践行中 |
| [L6 — Multi-Agent 协同](/views/best-practices/L6-multi-agent) | 专家 Agent 分工 + 并发处理 | ▶ 近期目标 |
| [L7 — 自演化体系](/views/best-practices/L7-self-evolving) | 高质量产出反哺规范，正向飞轮 | 🔭 终极形态 |

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

> [测试工程 Skills](/views/testing/) — 五包中唯一带真实执行引擎的包：深度接口测试（DAG + 四层断言）、工程级 Playwright、JMeter 压测、test-reports 统一报告与 gate 质量门。子页：[使用指南](/views/testing/usage-guide) · [功能链](/views/testing/functional) · [自动化](/views/testing/automation) · [性能](/views/testing/performance)。

---

### 📋 产品 & 需求

> [产品设计 Skills](/views/ai-workflow/design-skills) — 流程图、需求说明书（IPO 按钮级颗粒度）、原型标注（D1–D3）、数据库/接口设计、术语词典、变更影响、集成评审；`verify` CLI 四域机械校验。[原型标注实战](/views/ai-workflow/prototype)。

---

### 🔧 运维 & DevOps

> 独立页面规划中；以下能力已可直接使用：

- **CI 质量门**：test [`gate`](/views/testing/#di-质量门-ci-集成)（审计 + e2e-check + DI + 性能基线，任一失败阻断）· bd [`review run`](/backend/skills/usage-guide)（规则 + 基线 + 豁免 + 覆盖率）
- **提交规范**：[Git 分支 & 提交规范](/frontend/quick-start/08-git)（commitlint + husky，前后端通用）
- **环境体检**：各包 `doctor` 命令（kit / bd / test 安装即带）
- **环境迁移**：kit / bd [standard-env](/frontend/pc/skills/usage-guide)（scan → plan → apply → verify）

---

### 🔄 AI 工作流

> [AI 工作流](/views/ai-workflow/) — AI 驱动的全流程工程化实践，从原型设计到测试交付。

---

### 📣 宣贯方案

> [五包落地宣贯文档](/views/rollout/) — 每包一份：能力全景、痛点场景、接入流程、验收清单与会议输出，可直接用于项目组宣贯。

---

## 我该从哪里开始？

| 你是… | 推荐路径 | 预计耗时 |
|---|---|---|
| **新人入职（前端）** | [快速上手](/frontend/quick-start/) → [PC 架构设计](/frontend/pc/architecture) → [Skills 集合](/frontend/pc/skills/) | 1 天 |
| **移动端开发** | [快速上手](/frontend/quick-start/) → [H5 概览](/frontend/mobile-h5/) → [基座集成](/frontend/mobile-uniapp/integration) → [@robot-h5/core](/frontend/mobile-h5/h5-core/) | 半天 |
| **新人入职（后端）** | [后端快速上手](/backend/quick-start) → [后端 Skills](/backend/skills/) → [使用指南](/backend/skills/usage-guide) | 1 天 |
| **测试工程师** | [测试工程 Skills](/views/testing/) → [使用指南](/views/testing/usage-guide) → [AI 最佳实践](/views/best-practices/) | 半天 |
| **产品经理** | [产品设计 Skills](/views/ai-workflow/design-skills) → [原型标注](/views/ai-workflow/prototype) → [AI 工作流](/views/ai-workflow/) | 半天 |
| **DBA / 运维** | [数据库变更流程](/backend/quick-start) → [变更审查 review](/backend/skills/) | 1 小时 |
| **想用 AI 提效** | [AI 最佳实践](/views/best-practices/) → [AI 工作流](/views/ai-workflow/) | 按需 |

## 术语速查

<details>
<summary>文档里反复出现的缩写与黑话（点击展开）</summary>

| 术语 | 含义 |
|------|------|
| **K1~K19** | wl-skills-**k**it 的确定性审计规则（v2.18.0 前为 R 前缀） |
| **R001~R043** | wl-skills-ui 扫描器的 UI 风格规则（与 kit 的 K 系编号解耦） |
| **B1~B31** | wl-skills-**b**d 后端确定性扫描规则 |
| **T1~T25** | wl-skills-**t**est 测试资产审计规则 |
| **J1~J8** | bd 的 Java 质量门（ArchUnit/Checkstyle/PMD/SpotBugs/Spotless/P3C/OpenAPI/JaCoCo） |
| **DI** | Defect Index，缺陷密度质量指标（test 包上线判定 4 指标之一） |
| **planHash** | bd 生成/写库计划的 SHA-256 指纹，apply 必须回传确认，防计划漂移 |
| **W1** | kit 的字节级防漂移校验：scenarioRef 页面手改产物在 CI 即被拦截 |
| **profile** | 交付口径快照（后端 `jh4j3-openapi3@1.0`）或 UI 能力档位（native-element 等），按上下文理解 |
| **page-spec / wl-contract** | kit / bd 的机器契约文件，用例与代码从契约生成而非人工转录 |
| **四方对账** | bd 数据库治理：需求文档 ↔ 契约 ↔ Flyway ↔ 线上快照 逐项对齐 |
| **gate** | test 包一键聚合质量门：审计 + e2e-check + DI + 性能基线，任一失败阻断 |
| **doctor** | 各包自带的环境体检命令 |

</details>

## 联系我们

- **团队内部沟通**：飞书（工程化实践群 / 各包维护者见对应文档页首作者标签）
- **评论区留言**：页面底部 Waline 评论区
- **问题反馈**：按各包宣贯文档的[反馈模板](/views/rollout/)提供版本、场景与复现样例
