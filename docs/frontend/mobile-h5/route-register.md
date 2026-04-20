# ⑤ 路由注册 route-register

> 触发词：`注册路由` / `添加菜单` / `注册页面`

自动将新页面注册到路由系统，根据页面类型写入不同路由文件。

---

## 输入

页面信息（路径、标题、是否缓存、是否菜单页）

---

## 注册规则

### 子页面路由 → `src/router/modules.ts`

在 `routeModuleList` 数组末尾追加：

```ts
{
    path: '/customerArchive',
    name: 'CustomerArchive',       // 必须与 defineOptions({ name }) 一致
    meta: {
        title: '客户档案',
        keepAlive: false,
    },
    component: () => import('@/views/customer/archive/index.vue'),
},
```

### TabBar 主页 → `src/router/menu.ts`

```ts
{
    path: '/customer',
    name: 'Customer',
    meta: {
        title: '客户',
        icon: 'ph:user-list-bold',
        keepAlive: true,
    },
    component: () => import('@/views/customer/index.vue'),
},
```

### 详情 / 表单子页面

只注册在 `modules.ts`，不注册菜单。

---

## keepAlive 规则

| 页面类型 | keepAlive | 原因 |
|---|---|---|
| 列表页 | `true` | 保留搜索条件 + 滚动位置 |
| 详情页 | `false` | 每次进入需刷新 |
| 表单页 | `false` | 提交后需重置 |

---

## 命名约束

| 项目 | 规则 | 示例 |
|---|---|---|
| path | camelCase | `/customerArchive` |
| name | PascalCase | `CustomerArchive` |
| defineOptions | 与 name 一致 | `defineOptions({ name: 'CustomerArchive' })` |

::: danger 三者必须一致
路由 `name` = `defineOptions({ name })` = `<keep-alive :include>` 的组件名，三者必须完全一致，否则缓存失效。
:::

---

## 上下游

- 上游：[④ 页面代码生成](./page-codegen)
- 下游：[⑥ Mock 生成](./mock-gen)
