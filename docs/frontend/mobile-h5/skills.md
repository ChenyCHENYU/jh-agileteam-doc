# 移动端 H5 — Skills 概述

移动端 H5 项目内置 **7 个 AI Skill**，覆盖从原型分析到代码生成的完整研发链路。所有 Skill 均已注册到 AI 编辑器（Copilot / Cursor / Windsurf / Claude Code），支持通过**触发词自动调度**。

::: tip AI 规则文件同源
`.github/copilot-instructions.md`、`.cursorrules`、`.windsurfrules`、`CLAUDE.md`、`AGENTS.md` 五个文件内容同源，确保所有 AI 编辑器遵循统一规范。
:::

---

## Skill 自动调度表

| 序号 | Skill | 触发词 | 规则文件 |
|---|---|---|---|
| ① | 原型扫描 | 扫描原型 / 分析原型 | `.github/skills/prototype-scan/skills.md` |
| ② | 接口规格 | 生成接口规格 / 接口字段说明 | `.github/skills/api-spec/skills.md` |
| ③ | 接口约定 | 生成接口 / 接口约定 | `.github/skills/api-contract/skills.md` |
| ④ | 页面代码生成 | 生成页面 / 生成代码 | `.github/skills/page-codegen/skills.md` |
| ⑤ | 路由注册 | 注册路由 / 添加菜单 | `.github/skills/route-register/skills.md` |
| ⑥ | Mock 生成 | 生成 Mock / 补充模拟数据 | `.github/skills/mock-gen/skills.md` |
| ⑦ | 规范审计 | 审计规范 / 代码检查 | `.github/skills/convention-audit/skills.md` |

---

## 快速导航

- [AI Skill 流水线](./skill-pipeline) — 完整工作流串联
- [① 原型扫描](./prototype-scan)
- [② 接口规格](./api-spec)
- [③ 接口约定](./api-contract)
- [④ 页面代码生成](./page-codegen)
- [⑤ 路由注册](./route-register)
- [⑥ Mock 生成](./mock-gen)
- [⑦ 规范审计](./convention-audit)
