# ⑥ Mock 生成

**Skill 名称**：`mock-gen`

**触发词**：`生成 Mock`、`补充模拟数据`

**规则文件**：`.github/skills/mock-gen/skills.md`

---

## 功能

为接口约定文件自动生成配套的 Mock 数据，位于 `mock/` 目录。

---

## 支持能力

- 列表分页（带 total / pageSize / pageNum）
- 详情查询
- 增删改操作
- 状态变更（枚举值随机）

---

## 配置

开发环境 `VITE_USE_MOCK=true` 时由 `vite-plugin-mock` 自动拦截请求。

---

## 上下游

- 上游：[⑤ 路由注册](./route-register)
- 下游：[⑦ 规范审计](./convention-audit)
