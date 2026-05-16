# 全栈开发

<AuthorTag :authors="['ZhuXiang','CHENY','YangTianGuang']" />

::: tip 🚧 建设中
本版块正在持续沉淀全栈 AI 辅助开发实践，内容待推进。
:::

## 版块定位

**全栈开发**是 AI 工作流的主体阶段。以 `api.md` 为契约中心，前端（`wl-skills-kit`）与后端（`wl-skills-bd`）各自展开代码生成、审计、修复闭环，最终形成前后端并行推进的全栈协同模型。

## 前端链路（🟡 践行中）

```
详设文档 → prototype-scan → page-spec
         → api-contract   → api.md
         → page-codegen   → 4 文件骨架
         → convention-audit → 偏差清单
         → code-fix       → 规范收敛
         → menu-sync / dict-sync / permission-sync
```

## 后端链路（🟡 骨架验证中）

```
api.md → api-design-be  → Controller/DTO
       → entity-codegen → Entity / Mapper / XML
       → db-migration   → SQL 脚本
       → unit-test-gen  → JUnit 测试
       → audit-be       → 规范扫描
```

## 主要内容（规划中）

- 前后端并行协作的时序图
- `api.md` 契约文件格式规范
- 冲突处理与接口变更流程
- 全栈 AI Pipeline 演进路线

## 相关链接

- [AI 工作流概述](/views/ai-workflow/)
- [L5 — Agent Pipeline](/views/best-practices/L5-agent-pipeline)
- [前端 PC 端 Skills 概述](/frontend/pc/skills/)
- [后端 Skills 概述](/backend/skills/)
