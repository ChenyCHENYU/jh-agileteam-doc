# 安全规范（06）

> **平台规范第 06 条** · 强制度：🔴 必遵。

::: info 来源
`@agile-team/wl-skills-kit` · `standards/06-security.md`
:::

<AuthorTag author="CHENY" />

---

## v-html 使用约束

- ❌ 默认禁止 `v-html`
- ✅ 仅当内容来源受控（如后端返回已消毒的富文本），且必须在使用处加注释说明来源：

```vue
<!-- v-html 安全声明：内容来自 /api/notice/detail，后端已做 XSS 过滤 -->
<div v-html="notice.content" />
```

## Token 存储

- ✅ 仅存 `sessionStorage` / `localStorage`
- ❌ 禁止放在 URL 参数（被日志记录）
- ❌ 禁止放在 `<meta>` 标签（HTML 静态可见）

## 接口请求

- ✅ 统一通过 `getAction / postAction / putAction / deleteAction` 走拦截器
- ✅ 拦截器自动注入 token、统一处理 401 跳转
- ❌ 禁止 `import axios from 'axios'` 直接使用

## 用户输入

- ✅ 通过接口参数对象传递
- ❌ 禁止拼接到 URL 字符串
- ❌ 禁止直接传给 SQL 语句生成函数（防 SQL 注入）

## 对象遍历

- ❌ 禁止 `for...in`（可能枚举原型链属性，存在安全隐患）
- ✅ 使用 `Object.keys(obj).forEach()` / `Object.entries(obj)`

## 危险 API

- ❌ **禁止 `eval()`** —— 任何场景均不允许
- ❌ 禁止 `new Function(string)` 动态执行字符串代码
- ❌ 禁止 `setTimeout(string)` 字符串形式调用
