# 全栈开发

<AuthorTag :authors="['ZhuXiang','CHENY','YangTianGuang']" />

> 以 `wl-api-contract` 为契约中心，前端（kit）与后端（bd）各自展开代码生成、审计、修复闭环，形成前后端并行推进的全栈协同模型。

---

## 契约驱动协作

```text
                     ┌─────────────────┐
                     │  wl-api-contract │  ← 前后端共享的机器契约
                     │  （JSON 格式）    │
                     └────────┬────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼                               ▼
    ┌─────────────────┐             ┌─────────────────┐
    │  前端 kit        │             │  后端 bd          │
    │  v2.16.9        │             │  v0.18.2         │
    │                 │             │                  │
    │  page-spec      │             │  wl-contract.json │
    │  api.md         │             │  Entity/DTO/VO    │
    │  page-codegen   │             │  codegen         │
    │  convention-audit│            │  convention-audit-be│
    └─────────────────┘             └─────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
                    ┌─────────────────┐
                    │  test 测试验证    │
                    │  v0.5.0         │
                    │  消费双方契约     │
                    │  → 用例矩阵      │
                    │  → 自动化脚本    │
                    │  → 执行 + 质量门  │
                    └─────────────────┘
```

---

## 前端链路（✅ 已成熟）

```text
详设文档
  ↓
prototype-scan / spec-doc-parse → page-spec JSON
  ↓
api-contract → api.md（前后端共享契约）
  ↓
page-codegen → 4 文件骨架（index.vue / data.ts / index.scss / api.md）
  ↓
convention-audit → R1-R19 偏差清单
  ↓
code-fix → 规范收敛
  ↓
menu-sync / dict-sync / permission-sync → 平台配置同步
```

- Skills：[wl-skills-kit](/frontend/pc/skills/) v2.16.9
- 使用指南：[前端使用指南](/frontend/pc/skills/usage-guide)

---

## 后端链路（✅ 已成熟）

```text
评审需求 / api.md
  ↓
api-design-be → 接口设计审查
  ↓
entity-codegen → Entity / DTO / VO / Query
  ↓
service-codegen → Controller + Service + Mapper
  ↓
mapper-xml-gen → MyBatis XML
  ↓
db-migration → DDL + Flyway（只生成不执行）
  ↓
unit-test-gen → 行为契约测试
  ↓
convention-audit-be → B1-B30 + J1-J8 规范审计
  ↓
code-fix-be → B3/B5 安全修复
```

- Skills：[wl-skills-bd](/backend/skills/) v0.18.2
- 流水线：[后端 AI Skills 流水线](/backend/skills/skill-pipeline)
- 使用指南：[后端使用指南](/backend/skills/usage-guide)

---

## 契约对齐

前端 kit 与后端 bd 通过 **delivery profile + wl-api-contract** 对齐：

| 对齐项 | 约定 |
|--------|------|
| 外部 API 根路径 | 双方一致 |
| 五个操作 | page（POST queryPage）/ detail（GET）/ create（POST save）/ update（PUT updateById）/ remove（DELETE deleteById） |
| 响应格式 | `{ code: 2000, message, data }` |
| 分页 | `data.records` / `data.total` |
| 权限码 | 前后端一致（`module_entity_action`） |
| 乐观锁 | detail 返回 revision → update 回传 revision |

```bash
# 后端导出权限码给前端
wl-skills-bd export-permissions --output docs/SYS_PERMISSION_INFO.md

# 契约比对（strict 模式阻断不一致）
wl-skills-bd contract diff wl-contract.json \
  --frontend api.md --openapi openapi.json --strict
```

---

## 冲突处理

| 场景 | 处理 |
|------|------|
| 前端先出 page-spec，后端后出 contract | 后端 codegen 时 `contract diff --strict` 对齐 |
| 后端先出 contract，前端后出 page-spec | 前端 api-contract 从 contract 推导 |
| 接口字段变更 | 先改 contract → `diff` 发现差异 → 双方各自 codegen 更新 |
| 权限码不一致 | `export-permissions` + `contract compare --strict` 阻断 |

---

## 相关链接

- [AI 工作流概述](/views/ai-workflow/)
- [L5 — Agent Pipeline](/views/best-practices/L5-agent-pipeline)
- [前端 PC 端 Skills](/frontend/pc/skills/)
- [后端 Skills](/backend/skills/)
- [测试工程](/views/testing/)
