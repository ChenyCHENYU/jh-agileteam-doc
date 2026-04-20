# ④ 页面代码生成

**Skill 名称**：`page-codegen`

**触发词**：`生成页面`、`生成代码`

**规则文件**：`.github/skills/page-codegen/skills.md`

---

## 功能

根据原型分析 + 接口约定，一键生成完整的页面代码，严格遵循**三文件分离原则**。

---

## 输出文件

```
src/views/{module}/
  index.vue       ← 模板 + 逻辑（禁止 <style> 块）
  index.scss      ← 样式（BEM 命名 + 设计令牌）
  data.ts         ← 静态数据 / 配置 / 类型
```

---

## 生成规范

- 使用全局组件 `C_Form` / `C_Table` / `C_PullRefreshList` 等
- 样式使用设计令牌变量，禁止硬编码颜色/圆角/阴影
- BEM 命名：`.{page-name}__{element}--{modifier}`
- `defineOptions({ name })` 必须与路由 `name` 一致

---

## 上下游

- 上游：[③ 接口约定](./api-contract)
- 下游：[⑤ 路由注册](./route-register)
