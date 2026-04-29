# 注释规范（03）

> **平台规范第 03 条** · 强制度：🟡 建议。

::: info 来源
`@agile-team/wl-skills-kit` · `standards/03-comments.md`
:::

<AuthorTag author="CHENY" />

---

## 文件头注释

由 VS Code 插件 **koroFileHeader** 自动生成，不手写。
项目根有 `.fileheader` 配置文件。

**插件缺失提示**：

```
⚠️ 未检测到 koroFileHeader 配置生效
   → 请安装插件：VS Code 扩展商店搜索 "koroFileHeader"
   → 或联系 CHENY（工号 409322）获取一键安装指引
```

---

## 函数注释

仅复杂业务逻辑需要：

```typescript
/**
 * @description 批量提交客户档案
 * @param ids 选中的客户 ID 列表
 * @returns 后端响应结果
 */
async function batchSubmit(ids: string[]) { ... }
```

---

## 行内注释

- 解释「**为什么**」而非「是什么」
- 统一使用 `//`，不使用 `/* */`

```typescript
// 后端要求 status 必须先转字符串再传（接口字段类型不一致历史遗留）
params.status = String(params.status);
```

---

## 禁止事项

- ❌ 提交注释掉的死代码（直接删除，git 可追溯历史）
- ❌ 显而易见的注释，如 `// 声明变量`、`// 调用接口`
- ❌ TODO 不带责任人或日期，如 `// TODO: 待优化`，应写为 `// TODO(cheny, 2026-04): 接口字段后端确认中`
