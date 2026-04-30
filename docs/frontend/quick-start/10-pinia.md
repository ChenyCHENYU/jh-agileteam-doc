# Pinia 状态管理规范（10）

> **平台规范第 10 条** · 强制度：🔴 必遵。

::: info 来源
`@agile-team/wl-skills-kit` · `standards/10-pinia.md`
:::

<AuthorTag :authors="['ZhuXiang','CHENY','ZhongYu','XuQingYu']" />

---

## 何时用 Store

- ✅ 跨页面共享：用户信息、权限、全局配置、主题
- ✅ 需要持久化到 `localStorage` 的状态
- ✅ 多个不相邻组件共享的会话级状态

## 何时不用 Store（保留页面级 ref）

- ❌ 当前页的查询参数、列表数据、分页、弹窗状态
- ❌ data.ts 内部的所有状态（默认页面级，不提升到 Store）

## 强制约束

::: danger 禁止
在 `data.ts` 里 `import` Store。

**理由**：data.ts 是**页面数据契约**，应保持职责单一，不依赖全局状态。
跨页面共享数据通过 props / 路由参数 / 组件层包装传入，不直接耦合 Store。
:::

## Store 文件结构

```
src/stores/
└── {domain}/
    └── index.ts        每个领域独立目录，避免单文件膨胀
```

## Store 命名

- `useXxxStore` 标准命名
- 若项目已统一 `s_` 前缀（如 `s_userStore`），全项目保持一致

```typescript
// src/stores/user/index.ts
export const useUserStore = defineStore("user", () => {
  const userInfo = ref<User | null>(null);
  function setUser(u: User) {
    userInfo.value = u;
  }
  return { userInfo, setUser };
});
```

## 持久化

如需持久化，推荐 `pinia-plugin-persistedstate`：

```typescript
defineStore('user', () => { ... }, {
  persist: { storage: localStorage, paths: ['userInfo'] }
})
```
