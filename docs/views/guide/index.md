# 指南

<AuthorTag :authors="['ZhuXiang','YangTianGuang','CHENY','ZhongYu']" />

::: tip 💡 全站搜索
按 <kbd>Ctrl</kbd> + <kbd>K</kbd>（macOS 为 <kbd>⌘</kbd> + <kbd>K</kbd>）唤起搜索框，支持中文关键词检索全站标题与正文。
:::

欢迎来到 **AGILE TEAM** 工程体系文档——**金恒科技** 共享技术中心联合信息化中心交付团队的 AI 工程化实践知识库。

本站服务于团队各角色成员，涵盖前端、后端、测试、产品、运维等，系统化整理 **AI 辅助研发** 过程中沉淀的标准流程、规范约定、技能包与最佳实践。欢迎您的建议、批评与指正，也诚邀您的参与和贡献。

---

## 最近更新

> 各包逐版本明细以各自 CHANGELOG / npm 发布为准，此处只列文档站级别的变化。

| 日期 | 更新 |
|------|------|
| 2026-09-02 | 指南页体验升级：五包版本数据源组件、任务直达、按场景选包、术语速查 |
| 2026-09-01 | 全站同步至 kit v2.20.1 / ui v1.12.0 / bd v0.24.0（确定性场景渲染、能力 Profile 体系、变更审查质量门）；新增 [后端快速上手](/backend/quick-start)；[宣贯方案](/views/rollout/) 五份入站 |
| 2026-08-27 | 移动端同步 Robot_H5 v1.8.0 / core v1.2.0 / mbase v1.0.6；疑难杂症新增五包工程章节 |
| 2026-08-26 | 五包版本全站对齐 + 指南页重构 |

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

五包协作链路与各自产出物（契约同源，下游消费上游）：

```text
   产品/设计            前端开发              前端开发             后端开发             测试工程师
      │                   │                    │                  │                   │
      ▼                   ▼                    ▼                  ▼                   ▼
wl-skills-design ──► wl-skills-kit ──► wl-skills-ui    wl-skills-bd ──► wl-skills-test
 流程图/说明书/原型     页面/菜单/权限       视觉统一/扫描修复   代码/DDL/质量门    用例/执行/报告
      │                   │                                      │                   │
      │             page-spec / api.md                 wl-contract.json       消费契约生成用例
      └───────────────────┴──────── 契约同源（jh4j3-openapi3@1.0）───────────┴───────────────────┘
```

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

> 按能力层级，循序渐进掌握 AI 辅助开发。完整层级详解见 [AI 最佳实践总览](/views/best-practices/)。

<LevelsTable />

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
