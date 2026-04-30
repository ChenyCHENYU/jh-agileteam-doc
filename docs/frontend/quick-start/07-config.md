# 配置管理规范（07）

> **平台规范第 07 条** · 强制度：🔴 必遵。

::: info 来源
`@agile-team/wl-skills-kit` · `standards/07-config.md`
:::

<AuthorTag :authors="['ZhuXiang','CHENY','ZhongYu','XuQingYu']" />

---

## 环境变量

- 统一存放 `envs/.env.{mode}` 文件
- 命名以 `VITE_` 开头（Vite 暴露给客户端的前缀）
- 通过 `import.meta.env.VITE_XXX` 读取
- ❌ 不硬编码环境相关值

```typescript
// ✅ 正确
const apiBase = import.meta.env.VITE_API_URL;

// ❌ 错误
const apiBase = "http://10.0.0.5:8080/api";
```

## API 地址

- ✅ 通过 `import.meta.env.VITE_API_URL` 等环境变量获取
- ❌ 不在代码中硬编码 `http://` / `https://` 地址

## 接口路径

- ✅ 集中在 `data.ts` 的 `API_CONFIG` 对象中声明（`as const`）
- ❌ 不散落在模板字符串、方法内部

```typescript
export const API_CONFIG = {
  list: "/mmwr/customer/list",
  save: "/mmwr/customer/save",
  remove: "/mmwr/customer/remove",
} as const;
```

## 敏感信息

- ❌ 不提交到仓库（已纳入 `.gitignore`）
- ✅ 团队共享走内部文档或专用密钥服务

## AI 检查清单

生成代码前，AI 必须确认：

- [ ] 没有硬编码的 IP / 域名 / 端口
- [ ] 所有 API 路径在 `API_CONFIG` 中声明
- [ ] 环境变量都加了 `VITE_` 前缀
- [ ] 没有把 token / secret / 密码以明文形式写入代码
