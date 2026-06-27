# AI 工作流

<AuthorTag :authors="['ZhuXiang','CHENY','YangTianGuang']" />

## 核心理念

> **L5 Agent Pipeline 本质上就是工作流。**
> L1→L4 把每个细节做厚做扎实，L5 把它们串起来，就是全栈开发的工作流全貌。
> L6 Multi-Agent 则是在工作流基础上引入多智能体并发分工——它是 L5 成熟后的自然演进，而不是跳跃。

把 `prototype-scan → api-contract → page-codegen → convention-audit → menu-sync` 这条前端链路，再加上后端 `api-design-be → service-codegen → unit-test-gen → convention-audit-be`，最终形成**前后端全栈 AI 工作流**。当前阶段：前端链路 🟡 践行中，后端链路 🟡 骨架验证中。

---

## 前端开发工作流

基于 `@agile-team/wl-skills-kit`（v2.11.5），当前已全面践行：

```
① 详细设计（详设文档 / Axure 标注 / 口述需求）
         ↓ [prototype-scan]
② 页面清单确认（page-spec JSON，字段、接口、交互摘要）
         ↓ [api-contract]
③ 接口约定（api.md，前后端零成本对齐，可并行）
         ↓ [page-codegen]
④ 页面骨架生成（4 文件：view + hook + mock + 路由注册）
         ↓ [convention-audit]
⑤ 规范审计（14 条规范扫描，🔴/🟡/🟢 偏差清单）
         ↓ [code-fix]
⑥ 受控自动修复（🟡/🟢 等级，🔴 人工确认）
         ↓ [menu-sync / dict-sync / permission-sync]
⑦ 数据同步（菜单 + 字典 + 角色权限，MCP 驱动，0 次手动点击）
         ↓ [wl-skills validate]
⑧ CLI 校验（静态扫描 4 文件完整性，适合 CI 卡门）
         ↓
⑨ Review & 提交（规范审计报告归档，changelog 可自动生成）
```

### 关键节点说明

| 节点 | Skill / 工具 | 输入 | 输出 |
|------|-------------|------|------|
| ① 详设解析 | `prototype-scan` | 详设文档/Axure/口述 | page-spec JSON |
| ③ 接口约定 | `api-contract` | page-spec | api.md（前后端共同消费）|
| ④ 代码生成 | `page-codegen` | api.md + 模板 | view + hook + mock + route |
| ⑤ 规范审计 | `convention-audit` | src/views/ | 审计报告 |
| ⑦ 数据同步 | MCP × 3 | reports/*.md | 后端数据库变更 |
| ⑧ CLI 校验 | `wl-skills validate` | src/views/ | pass / fail + 错误清单 |

> **提速效果**：标准 LIST 页面（4 文件）从 45 分钟 → ~8 分钟；菜单/权限同步 token 节省 87%，20 分钟手动 → 1 分钟 0 次点击。

---

## 后端开发工作流

基于 `@agile-team/wl-skills-bd`（v0.0.2 骨架，PoC 验证中）：

```
① api.md（前端 api-contract 产出，或产品 input-spec）
         ↓ [api-design-be]
② 接口设计审查（RESTful 命名 / 字段映射 / 错误码确认）
         ↓ [entity-codegen]
③ 数据模型生成（Entity / DTO / VO / Query）
         ↓ [service-codegen]
④ 服务骨架生成（Controller + Service + ServiceImpl + Mapper 接口）
         ↓ [mapper-xml-gen]
⑤ XML 映射生成（动态条件 / 分页 / 批量 / 多表 join）
         ↓ [db-migration]
⑥ DDL 脚本（建表 / 改表 / 回滚，⚠️ 写库前强制人工确认）
         ↓ [unit-test-gen]
⑦ 单测 & 集成测试生成（基于 api.md 契约 + 边界用例）
         ↓ [convention-audit-be]
⑧ 后端规范审计（分层 / 命名 / 异常 / 事务 / 日志）
         ↓ [code-fix-be]
⑨ 受控自动修复 → 复扫确认
```

---

## 全栈协同视角

```
产品/业务 → 详细设计文档
                │
      ┌─────────┴─────────┐
      │ 前端               │ 后端
      │ prototype-scan     │ api-design-be（review api.md）
      │ api-contract ──────┤→ 共享 api.md ←──────────────┐
      │ page-codegen       │ entity/service/mapper codegen │
      │ convention-audit   │ db-migration（DDL）           │
      │ menu/dict/perm sync│ unit-test-gen                 │
      └────────┬───────────┘ convention-audit-be           │
               │                                           │
               └──────── L5 Pipeline 串联，L6 并发 ────────┘
```

前后端通过 **`api.md` 契约**天然解耦，可并行推进，无需等待对方完成后再开始。

---

## 工作流演进阶段

| 阶段 | 描述 | 当前状态 |
|------|------|---------|
| **L1-L4 扎实期** | 把每个 Skill 的输入/输出做厚，规范门控无漏洞 | ✅ 前端已达标 |
| **L5 单链路** | 前端 ①→⑨ 全链路试运行，人工只在关键节点确认 | 🟡 践行中 |
| **L5 前后端协同** | 前后端工作流各自稳定后，通过 api.md 契约对齐 | 🎯 目标 |
| **L6 Multi-Agent** | 多个专家 Agent 并发：前端 + 后端 + 测试同时进行 | ▶ 近期规划 |
| **可视化工作台** | 工作流从"黑盒"变成可观测、可介入的调度界面 | 🔜 L6 配套 |

---

## 规划版块

| 阶段 | 说明 | 状态 |
|------|------|------|
| **详细设计** | AI 辅助详设文档结构化，提取页面清单与接口语义 | 🟡 实践中 |
| **原型设计** | AI 辅助需求分析与低保真原型生成 | 🔜 规划中 |
| **全栈开发** | 前后端全栈 AI 辅助开发实践（当前核心模块）| 🟡 践行中 |
| **测试实践** | AI 生成测试用例与自动化测试 | 🔜 规划中 |
