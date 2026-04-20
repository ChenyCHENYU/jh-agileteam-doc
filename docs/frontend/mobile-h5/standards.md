# 移动端 H5 — 扩展规范

> 本文档仅列出移动端 H5 **独有**的扩展规范。通用开发规范（三文件分离、文件命名、Git 提交、ESLint 规则等）请参阅 [快速上手 — 开发规范](/frontend/quick-start/development-standards)。

---

## 组件规范

### 全局组件

- 统一 `C_` 前缀，通过 `unplugin-vue-components` 自动注册
- 模板中使用 **PascalCase**：`<CNavBar />` `<CForm />`
- `defineOptions({ name: 'C_NavBar' })` 必须与目录名一致

### 路由 name 一致性

路由定义的 `name` 必须与组件 `defineOptions({ name })` 完全一致：

```ts
// router/modules.ts
{ name: 'DemoForm', path: '/demo/form', component: () => import('@/views/demo/form/index.vue') }

// views/demo/form/index.vue
defineOptions({ name: 'DemoForm' })
```

### 多词组件名

`eslint` 规则 `vue/multi-word-component-names` 仅豁免 `index`，其余组件必须使用多词命名。

---

## 样式规范

### 设计令牌

**禁止硬编码颜色、圆角、阴影**，必须使用设计令牌变量：

```scss
// ✅ 正确
.card {
  background: var(--ds-surface);
  color: var(--ds-text-primary);
  border-radius: var(--ds-radius-md);
  box-shadow: var(--ds-shadow-1);
}

// ❌ 错误
.card {
  background: #fff;
  color: #333;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

### BEM 命名

```scss
.{page-name} {
  &__{element} {
    &--{modifier} { }
  }
}

// 示例
.dashboard {
  &__header {
    &--sticky { }
  }
  &__card-list { }
}
```

### CSS Layers 优先级

```
@layer base < components < utilities
```

- `base`：UnoCSS preflights（reset）
- `components`：`src/` 下的 `.scss` 自动包裹
- `utilities`：UnoCSS 工具类（最高优先级）

### UnoCSS 快捷方式

| 快捷方式 | 展开 |
|---|---|
| `wh-full` | `w-full h-full` |
| `flex-center` | `flex justify-center items-center` |
| `flex-x-center` | `flex justify-center` |
| `flex-y-center` | `flex items-center` |
| `text-overflow` | `overflow-hidden whitespace-nowrap text-ellipsis` |
| `text-break` | `whitespace-normal break-all break-words` |

### 移动端适配

通过 `postcss-mobile-forever` 自动将 `px` 转换为 `vw`，开发时直接写 `px` 即可。

---

## 接口规范

### 命名约定

```ts
// API 函数命名
get{Module}List()     // 列表查询
get{Module}Detail()   // 详情查询
add{Module}()         // 新增
update{Module}()      // 修改
delete{Module}()      // 删除
```

### HTTP 方法封装

使用 `@miracle-web/utils` 的 MAxios 封装，项目内提供快捷方法：

```ts
import { get, post, put, del } from '@/utils/http'
```

### Mock 配套

每个 API 必须配套 Mock 数据，位于 `mock/` 目录。开发环境 `VITE_USE_MOCK=true` 时自动启用。

---

## 路由规范

### 路由分层

| 文件 | 职责 |
|---|---|
| `base.ts` | 基础路由 — Root（重定向到 Dashboard）、Login、404 |
| `menu.ts` | TabBar 路由 — 4 个主 Tab 页面 |
| `modules.ts` | 子页面路由 — 所有非 Tab 页面（25+ 条） |
| `router-guards.ts` | 路由守卫 — NProgress / Token 校验 / 权限校验 |

### 权限校验流程

```
路由跳转
  → 白名单路由？ → 直接放行
  → 无 Token？ → 跳转登录页
  → 已有 Token → isRouteAllowed(path)？
      → 允许 → 进入页面
      → 拒绝 → 跳转 404
  → 权限数据为空 → 降级放行（避免白屏）
```

---

## 状态管理规范

### Store 模块约定

| Store | 持久化 | 加密 | 职责 |
|---|---|---|---|
| `user` | ✅ | AES | Token + 用户信息 + 登录/登出 |
| `permission` | ❌ | — | 菜单树 + 按钮权限码 |
| `route` | ❌ | — | 路由列表 + KeepAlive 组件名 |
| `theme` | ✅ | AES | 主题模式 + 主题色 + 字体缩放 |
| `app` | ❌ | — | 全局状态（Eruda 开关） |
