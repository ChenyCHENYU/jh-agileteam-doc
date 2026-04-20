# AI Skill 流水线

7 个 AI Skill 按序串联，覆盖从原型扫描到规范审计的完整研发链路。

---

## 流水线全景

```
原型 / 设计稿
    ↓
① prototype-scan → page-spec.json（结构化页面骨架）
    ↓
② api-spec → docs/api-spec/{module}.md（接口规格文档）
    ↓
    ├──→ ③ api-contract → src/api/{module}.ts（前端 API 代码）
    ├──→ ⑥ mock-gen → mock/{module}.ts + data.ts 常量
    └──→ ④ page-codegen → src/views/{domain}/{module}/（三文件分离）
              ↓
         ⑤ route-register → router/modules.ts 或 menu.ts
              ↓
         ⑦ convention-audit（自动执行）
              ↓
         P0 静默修复 → P1 修复+报告 → pnpm type-check → ✅ 交付
```

---

## 各 Skill 输入输出

| 序号 | Skill | 输入 | 输出 |
|---|---|---|---|
| ① | 原型扫描 | Axure HTML / 设计文档 / 截图描述 | `page-spec.json` |
| ② | 接口规格 | `page-spec.json` 或原型描述 | `docs/api-spec/{module}.md` |
| ③ | 接口约定 | page-spec / 需求描述 | `src/api/{module}.ts` |
| ④ | 页面代码生成 | page-spec + api.md | `views/{module}/` 三文件组 |
| ⑤ | 路由注册 | 页面路径、标题、缓存策略 | `router/modules.ts` 或 `menu.ts` |
| ⑥ | Mock 生成 | data.ts 类型定义 | `mock/{module}.ts` + data.ts 常量 |
| ⑦ | 规范审计 | 本次变更的所有文件 | P0/P1/P2 审计报告 + 自动修复 |

---

## 与 PC 端的差异对比

| 对比项 | PC 端（5 个 Skill） | 移动端 H5（7 个 Skill） |
|---|---|---|
| Skill 数量 | 5 个 | 7 个（多了接口规格 + Mock 生成） |
| 接口规格 | 合并在接口约定中 | ② 独立 Skill，输出完整规格文档 |
| Mock 生成 | 手动编写 | ⑥ 独立 Skill，双产物（data.ts 常量 + mock 端点） |
| 页面结构 | 表格行布局（BaseTable） | 卡片布局（primary/secondary/tags/meta 层级） |
| UI 组件库 | Element Plus | Vant 4 |
| 文件规范 | 无强制分离要求 | 三文件分离（.vue 禁止 `<style>` 块） |
| 样式体系 | UnoCSS + SCSS | UnoCSS + SCSS + 设计令牌 + CSS Layers |
| 路由注册 | ④ 菜单同步（对接权限系统） | ⑤ 路由注册（Hash/History 双模式） |
| 规范审计 | ⑤ 规范审计 | ⑦ 规范审计（P0/P1/P2 三级 + 设计令牌检查） |

---

## 自动调度机制

所有 Skill 通过关键词自动匹配，无需手动选择：

```
用户输入 "扫描原型"
  → AI 匹配 prototype-scan Skill
  → 加载 .github/skills/prototype-scan/skills.md
  → 按规则执行并输出 page-spec.json
```

支持的 AI 编辑器：**Copilot / Cursor / Windsurf / Claude Code** — 五个规则文件内容同源。

| 文件 | 适用编辑器 |
|---|---|
| `.github/copilot-instructions.md` | GitHub Copilot（最详尽，11 条编号规范） |
| `.cursorrules` | Cursor |
| `.windsurfrules` | Windsurf |
| `CLAUDE.md` | Claude Code |
| `AGENTS.md` | 通用标准 |
