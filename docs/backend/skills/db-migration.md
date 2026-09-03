# db-migration — DDL 与数据迁移生成

> 生成 **CREATE TABLE / 分阶段 ALTER / 索引 / DDL 预览**，产物落 `reports/DDL_PREVIEW_*.md` 等待人工确认。**AI 不直接执行数据库操作**。🔴 高风险（必经人工确认）。

## 什么时候用

- 新建表（契约 confirmed 后的标准产物之一）
- 加字段 / 加索引（ALTER 分阶段：expand → backfill → contract）
- 生成人工恢复说明与风险审批预览

## 能力边界（如实标注）

| 能力 | 状态 |
|------|------|
| CREATE TABLE / 索引 | ✅ 自动生成 |
| ALTER TABLE（分阶段） | ✅ 自动生成 |
| 复杂数据迁移 / 回填 | 🟡 人工设计门——AI 出骨架，人补业务逻辑 |

## 生成即带治理约束

| 约束 | 来源 |
|------|------|
| 基线表同名复用，字段顺序/类型/注释精确对账 | standards/29 |
| 文档基线表变更必须登记业务依据与审批；改名走豁免 | B31 naming-waivers |
| ALTER 必须 expand / contract 分阶段；contract 阶段 drop 需 approvalRef | 数据库变更规范 |
| MySQL `lower_snake_case`，无 `ENGINE=InnoDB` 显式声明（OceanBase 兼容） | 物理命名约定 |
| 租户字段 COMPANY_ID 强制 | B18 |

## 用法

```bash
# 标准 CRUD 的 DDL 已包含在 codegen 产物中
wl-skills-bd codegen plan    wl-contract.json --json

# 单独预览 DDL + 环境执行通道
wl-skills-bd db preview wl-contract.json

# 线上对账与执行回执（AI 不执行，人执行后登记）
wl-skills-bd db drift --snapshot snapshot.json
wl-skills-bd db executed --table t_xxx --approval-ref JIRA-123
```

完整对账/账本/豁免/环境分级流程见 **[数据库治理实操](/backend/skills/db-governance)**。

## 延伸阅读

- [数据库治理实操](/backend/skills/db-governance) · [new-service 全链路](/backend/skills/new-service)
