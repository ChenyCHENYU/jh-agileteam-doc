# Skill ③：业务文档提取（business-doc-extract）

从**原型目录 / 详细设计 / 字段字典资料**中提取结构化**业务文档**，沉淀模块级的业务知识，作为 [api-contract](./api-contract) 和 [page-codegen](./page-codegen) 的语义补充。

> **语义级触发**：不像其他 Skill 依赖固定关键词，本 Skill 在资料达到**模块级**（多个页面、跨字段关联）时由 AI 主动建议触发。

## 何时触发

| 场景 | 是否触发 |
|------|---------|
| 单页面口述需求 | ❌ 直接走 [prototype-scan](./prototype-scan) |
| Axure 单页面扫描 | ❌ 直接走 prototype-scan |
| **资料覆盖整个模块（多页面 + 字段关联 + 业务规则）** | ✅ **推荐** |
| 详设文档含跨页面的字段字典 / 数据血缘 | ✅ 推荐 |

> 在流水线中位于 page-spec 汇聚之后、api-contract 之前（可选环节）。

---

## 输入与输出

### 输入

- 原型目录（多 HTML）
- 详细设计文档（MD / Word / 表格）
- 字段字典资料（Excel / 数据库 DDL）
- 现有代码 + 注释（存量梳理）

### 输出

```text
docs/business/0X-<模块>/
  ├── 01-overview.md        模块业务概述（领域边界、核心实体）
  ├── 02-fields.md          字段字典（跨页面统一字段口径）
  ├── 03-rules.md           业务规则（状态流转、校验规则、数据约束）
  └── 04-relations.md       实体关系（主从、外键、数据血缘）
```

---

## 解决什么问题

| 痛点 | 本 Skill 的作用 |
|------|----------------|
| 同一字段在不同页面命名不一致 | 统一字段字典，跨页面口径对齐 |
| 业务规则散落在代码注释里 | 抽取为独立业务规则文档 |
| AI 生成代码时缺少业务上下文 | 提供 `docs/business/` 供 api-contract / page-codegen 消费 |
| 新人接手不知业务边界 | 模块概述 + 实体关系一目了然 |

---

## 与 prototype-scan 的协作

```text
prototype-scan（页面级）
  → 输出 page-spec JSON（每页字段、交互）
                          ↓
business-doc-extract（模块级，可选）
  → 汇总跨页面字段 → 统一字段字典
  → 提取业务规则、状态流转
  → 沉淀 docs/business/
                          ↓
api-contract 消费 docs/business/ → 字段命名更一致
```

> 不是必须环节。单页面开发可跳过；模块级梳理时强烈推荐，能显著提升 api-contract 的字段一致性。

---

## 标准对话示例

```
你：把 docs/prototypes/客户管理/ 下的 7 个原型梳理一下业务。
AI：[Pre-flight]
    ├─ 来源：7 个原型 HTML（模块级资料）
    ├─ 输出：docs/business/01-customer-management/
    └─ 检测到 3 个跨页面字段（customerType / enableStatus / createDate）
    完成，已生成：
    - 01-overview.md  客户管理领域概述
    - 02-fields.md    统一字段字典（23 字段）
    - 03-rules.md     状态流转规则（启用→停用→注销）
    - 04-relations.md 客户-联系人-商机 关系图
```

---

## FAQ

**Q：能不能和 prototype-scan 同时跑？**  
A：可以。prototype-scan 出页面清单，business-doc-extract 出业务文档，两者输入相同但粒度不同（页面级 vs 模块级）。

**Q：存量项目能用吗？**  
A：能。提供现有 `src/views/` 代码目录，AI 会从代码 + 注释反向提取业务文档，适合文档补全场景。
