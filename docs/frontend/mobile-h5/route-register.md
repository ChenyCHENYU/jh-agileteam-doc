# ⑤ 路由注册

**Skill 名称**：`route-register`

**触发词**：`注册路由`、`添加菜单`

**规则文件**：`.github/skills/route-register/skills.md`

---

## 功能

自动将新页面注册到路由系统，根据页面类型写入不同路由文件。

---

## 注册规则

| 页面类型 | 写入文件 | 说明 |
|---|---|---|
| TabBar 页面 | `router/menu.ts` | 底部导航页面 |
| 子页面 | `router/modules.ts` | 所有非 Tab 页面 |

---

## 约束

- 路由 `name` 必须与组件 `defineOptions({ name })` 完全一致
- 支持 Hash / History 双模式（由 `VITE_HASH_ROUTE` 环境变量控制）

---

## 上下游

- 上游：[④ 页面代码生成](./page-codegen)
- 下游：[⑥ Mock 生成](./mock-gen)
