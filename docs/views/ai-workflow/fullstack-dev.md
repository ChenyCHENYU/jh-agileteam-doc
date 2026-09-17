# 契约驱动协作（前端 × 后端）

<AuthorTag :authors="['ZhuXiang','CHENY','YangTianGuang']" />

> 以 `wl-api-contract` 为契约中心，前端（kit）与后端（bd）各自展开生成、审计、修复闭环，并行推进互不阻塞。[端到端总览见 AI 工作流](./)。

## 协作模型

```text
                      ┌─────────────────┐
                      │  wl-api-contract │  ← 前后端共享的机器契约
                      │  （JSON 格式）    │
                      └────────┬────────┘
                               │
               ┌───────────────┼───────────────┐
               ▼                               ▼
     ┌─────────────────┐             ┌─────────────────┐
     │  前端 kit v2.21.0│             │  后端 bd v0.26.0 │
     │  page-spec       │             │  wl-contract.json│
     │  api.md          │             │  codegen 三段式   │
     │  page-codegen    │             │  validate/review │
     └────────┬────────┘             └────────┬────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
                    ┌─────────────────┐
                    │  test v0.25.0    │
                    │  消费双方契约     │
                    │  → 用例矩阵      │
                    │  → 深度执行      │
                    │  → gate 上线判定 │
                    └─────────────────┘
```

前后端链路的 Skill 流水线细节见权威页：[前端 Skill 流水线](/frontend/pc/skills/skill-pipeline) · [后端契约流水线](/backend/skills/skill-pipeline)。

## 契约对齐六项约定

| 对齐项 | 约定 |
|--------|------|
| 外部 API 根路径 | 双方一致 |
| 五个操作 | page（POST queryPage）/ detail（GET）/ create（POST save）/ update（PUT updateById）/ remove（DELETE deleteById） |
| 响应格式 | `{ code: 2000, message, data }` |
| 分页 | `data.records` / `data.total` |
| 权限码 | 前后端一致（`module_entity_action`） |
| 乐观锁 | detail 返回 revision → update 回传 revision |

## 权限码与契约比对

```bash
# 后端导出权限码给前端（kit menu/permission-sync 直接消费）
wl-skills-bd export-permissions --output docs/SYS_PERMISSION_INFO.md

# 契约比对（strict 模式阻断不一致）
wl-skills-bd contract diff wl-contract.json \
  --frontend api.md --openapi openapi.json --strict

# 契约变更影响面（新增/作废/需重跑的用例清单）
wl-skills-test diff --old contract.old.json --new wl-contract.json
```

## 冲突处理

| 场景 | 处理 |
|------|------|
| 前端先出 page-spec，后端后出 contract | 后端 codegen 时 `contract diff --strict` 对齐 |
| 后端先出 contract，前端后出 page-spec | 前端 api-contract 从 contract 推导 |
| 接口字段变更 | 先改 contract → `diff` 发现差异 → 双方各自 codegen 更新 |
| 权限码不一致 | `export-permissions` + `contract compare --strict` 阻断 |

## 相关链接

- [AI 工作流总览](./) · [测试阶段工作流](./testing)
- [前端 PC Skills](/frontend/pc/skills/) · [后端 Skills](/backend/skills/) · [测试工程](/views/testing/)
