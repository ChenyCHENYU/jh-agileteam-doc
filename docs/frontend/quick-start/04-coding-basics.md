# 基础编码规范（04）

> **平台规范第 04 条** · 强制度：🔴 必遵。参考 jhat.tech 开发规范 + Robot_Admin 实践。

::: info 来源
`@agile-team/wl-skills-kit` · `standards/04-coding-basics.md`
:::

<AuthorTag author="CHENY" />

---

## 13 条核心约定

1. **变量声明**：优先 `const`，必须重新赋值时用 `let`，禁止 `var`
2. **解构赋值**：优先使用 `const { a, b } = obj`，而非 `obj.a` / `obj.b`
3. **异步处理**：统一 `async/await`，禁止 `.then()` 链式调用
4. **字符串引号**：统一单引号（以 `.prettierrc.js` 为准）
5. **模板字符串**：替代字符串拼接，`` `Hello ${name}` `` 而非 `'Hello ' + name`
6. **大括号**：所有代码块必须使用大括号包裹，即使只有一行
7. **条件层级**：最多三层，超过三层必须抽成函数
8. **模板表达式**：`<template>` 中只写简单表达式，复杂逻辑提取为 `computed` 或方法
9. **对象遍历**：禁止 `for...in`，使用 `Object.keys(obj).forEach()`
10. **undefined 判断**：使用 `typeof variable !== 'undefined'`
11. **v-for**：必须设置 `:key`，优先用业务主键 id 而非 index
12. **指令缩写**：统一 `:`（v-bind）、`@`（v-on）、`#`（v-slot）
13. **this 别名**：`<script setup>` 中无 `this`；旧 Options API 中的 `this` 别名用 `self`

---

## 全局禁止事项

- ❌ index.vue 中写业务逻辑（逻辑全在 data.ts）
- ❌ 使用 Vuex（本项目用 Pinia）
- ❌ `::v-deep` / `/deep/`（用 `:deep()`）
- ❌ 直接用 axios（用 getAction/postAction，详见 [13 — 平台组件合规规范](/frontend/pc/13-platform-components)）
- ❌ 手写查询表单/工具栏/分页（用 BaseQuery/BaseToolbar/jh-pagination）
- ❌ 每个页面重复写弹窗（优先用 `c_modal` / `c_formModal` 等局部公共组件）
