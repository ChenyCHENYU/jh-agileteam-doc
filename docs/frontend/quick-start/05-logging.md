# 日志输出规范（05）

> **平台规范第 05 条** · 强制度：🔴 必遵。

::: info 来源
`@agile-team/wl-skills-kit` · `standards/05-logging.md`
:::

<AuthorTag :authors="['ZhuXiang','CHENY','ZhongYu','XuQingYu']" />

---

## 开发期

- 允许 `console.log` 调试，ESLint 仅给 `warn` 提示
- AI 生成的代码**不要**包含调试用 `console.log`

## 提交期

- husky pre-commit 钩子自动触发 lint 检查
- **必须清理** `console.log` / `console.warn` / `console.debug` 才能提交

## 生产代码

- ❌ 禁止出现 `console.log`、`console.warn`、`console.error`
- ❌ 大量 console 输出会带来性能问题（参考 jhat.tech 规范）

## 替代方案

| 场景     | 替代方式                                       |
| -------- | ---------------------------------------------- |
| 错误监控 | 走全局错误处理器（接入 Sentry 或自研上报通道） |
| 调试信息 | 仅在开发环境通过 `import.meta.env.DEV` 守卫    |
| 用户提示 | 使用 `ElMessage` / `jh-message`                |

```typescript
// ✅ 允许：开发期守卫
if (import.meta.env.DEV) {
  console.log("[debug] payload:", payload);
}

// ❌ 禁止：生产代码无守卫的 console
console.log("user info:", user);
```
