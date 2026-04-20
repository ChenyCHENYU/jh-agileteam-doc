# 移动端 H5 — Skills 概述

移动端 H5 项目内置 **7 个 AI Skill**，覆盖从原型分析到规范审计的完整研发链路。所有 Skill 均已注册到 AI 编辑器（Copilot / Cursor / Windsurf / Claude Code），支持通过**触发词自动调度**。

::: tip AI 规则文件同源
`.github/copilot-instructions.md`、`.cursorrules`、`.windsurfrules`、`CLAUDE.md`、`AGENTS.md` 五个文件内容同源，确保所有 AI 编辑器遵循统一规范与 Skills 调度机制。
:::

---

## Skill 自动调度表

| 序号 | Skill | 触发词 | 规则文件 |
|---|---|---|---|
| ① | 原型扫描 | `扫描原型` / `分析原型` / `解析设计稿` | `.github/skills/prototype-scan/skills.md` |
| ② | 接口规格 | `生成接口规格` / `接口字段说明` / `生成 api-spec` | `.github/skills/api-spec/skills.md` |
| ③ | 接口约定 | `生成接口` / `接口约定` / `生成 api.md` | `.github/skills/api-contract/skills.md` |
| ④ | 页面代码生成 | `生成页面` / `生成代码` / `帮我写页面` | `.github/skills/page-codegen/skills.md` |
| ⑤ | 路由注册 | `注册路由` / `添加菜单` / `注册页面` | `.github/skills/route-register/skills.md` |
| ⑥ | Mock 生成 | `生成 Mock` / `补充模拟数据` / `生成测试数据` | `.github/skills/mock-gen/skills.md` |
| ⑦ | 规范审计 | `审计规范` / `代码检查` / `规范检查`（也自动执行） | `.github/skills/convention-audit/skills.md` |

---

## 工作流串联

```
① 原型扫描 → page-spec.json（结构化页面骨架）
    ↓
② 接口规格 → api-spec/{module}.md（字段规格文档，前后端对齐）
    ↓
    ├──→ ③ 接口约定 → src/api/{module}.ts
    ├──→ ⑥ Mock 生成 → mock/{module}.ts + data.ts 常量
    └──→ ④ 页面代码生成 → views/{module}/（三文件分离）
              ↓
         ⑤ 路由注册 → router/modules.ts 或 menu.ts
              ↓
         ⑦ 规范审计 → P0 静默修复 → P1 修复+报告 → type-check → ✅ 交付
```

---

## 快速导航

- [AI Skill 流水线](./skill-pipeline) — 完整工作流与 PC 端对比
- [① 原型扫描](./prototype-scan) — Axure/设计稿 → page-spec.json
- [② 接口规格](./api-spec) — page-spec → 接口规格文档
- [③ 接口约定](./api-contract) — 规格 → TypeScript API 代码
- [④ 页面代码生成](./page-codegen) — 三文件分离的完整页面
- [⑤ 路由注册](./route-register) — 自动注册到路由系统
- [⑥ Mock 生成](./mock-gen) — data.ts 常量 + vite-plugin-mock 端点
- [⑦ 规范审计](./convention-audit) — P0/P1/P2 三级审计
