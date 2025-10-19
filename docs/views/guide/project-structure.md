# 项目结构

了解金恒科技信息化部前端团队的项目目录结构有助于你更好地组织和管理代码，适应不同的业务场景。

## 标准目录结构

金恒科技信息化部前端团队根据不同的业务场景，提供了多种项目结构模板。以下是基础的标准目录结构：

```
my-project/
├── .vscode/                # VS Code 配置
│   └── settings.json       # 编辑器设置
├── public/                 # 静态资源（不会被处理）
│   └── favicon.ico         # 网站图标
├── src/                    # 源代码目录
│   ├── assets/            # 资源文件
│   │   ├── images/        # 图片资源
│   │   ├── styles/        # 全局样式
│   │   └── fonts/         # 字体文件
│   ├── components/        # 公共组件
│   │   ├── common/        # 通用组件
│   │   └── business/      # 业务组件
│   ├── views/             # 页面组件
│   │   ├── home/          # 首页
│   │   └── about/         # 关于页
│   ├── router/            # 路由配置
│   │   └── index.ts       # 路由入口
│   ├── store/             # 状态管理
│   │   ├── modules/       # 模块
│   │   └── index.ts       # store 入口
│   ├── composables/       # 组合式函数
│   ├── utils/             # 工具函数
│   │   ├── request.ts     # 请求封装
│   │   └── helpers.ts     # 辅助函数
│   ├── types/             # TypeScript 类型定义
│   ├── api/               # API 接口
│   ├── constants/         # 常量定义
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── .env.development       # 开发环境变量
├── .env.test             # 测试环境变量
├── .env.production        # 生产环境变量
├── .eslintrc.cjs          # ESLint 配置
├── .prettierrc.json       # Prettier 配置
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── uno.config.ts          # UnoCSS 配置
├── vite.config.ts         # Vite 配置
└── README.md              # 项目说明
```

### 不同项目类型的目录结构差异

#### 单体项目
- 简化的目录结构，适合快速开发
- 所有功能模块集中在 `src` 目录下
- 适合中小型业务系统

#### 集群项目
- 增加集群配置相关目录
- 包含负载均衡和高可用性配置文件
- 支持多环境部署配置

#### Monorepo项目
```
my-monorepo/
├── packages/              # 子项目目录
│   ├── app1/             # 子应用1
│   ├── app2/             # 子应用2
│   ├── shared/           # 共享代码
│   └── ui-components/    # 共享组件
├── configs/              # 共享配置
├── scripts/              # 构建脚本
└── package.json          # 根配置
```

#### 微前端项目
```
my-microfrontend/
├── main-app/             # 主应用
├── micro-apps/           # 微应用
│   ├── app1/             # 微应用1
│   └── app2/             # 微应用2
├── shared/               # 共享资源
└── configs/              # 微前端配置
```

## 核心目录说明

### `/src/assets` - 资源文件

存放项目所需的静态资源，这些资源会被 Vite 处理和优化。

```
assets/
├── images/          # 图片资源
│   ├── logo.png
│   └── banner.jpg
├── styles/          # 样式文件
│   ├── global.css   # 全局样式
│   ├── variables.css # CSS 变量
│   └── reset.css    # 样式重置
└── fonts/           # 字体文件
    └── custom.woff2
```

**使用示例：**

```vue
<template>
  <img :src="logo" alt="Logo" />
</template>

<script setup lang="ts">
import logo from "@/assets/images/logo.png";
</script>
```

### `/src/components` - 组件目录

按功能分类存放可复用组件。

```
components/
├── common/              # 通用组件
│   ├── Button/
│   │   ├── index.vue
│   │   └── types.ts
│   └── Modal/
│       ├── index.vue
│       └── types.ts
└── business/            # 业务组件
    ├── UserCard/
    └── ProductList/
```

**组件规范：**

- 使用 PascalCase 命名
- 复杂组件使用文件夹组织
- 包含 TypeScript 类型定义

**示例：**

```vue
<!-- components/common/Button/index.vue -->
<template>
  <button :class="buttonClass" @click="handleClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { ButtonProps } from "./types";

const props = defineProps<ButtonProps>();
const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClass = computed(() => ({
  btn: true,
  [`btn-${props.type}`]: props.type,
}));

const handleClick = (e: MouseEvent) => {
  emit("click", e);
};
</script>
```

### `/src/views` - 页面组件

存放路由页面组件。

```
views/
├── home/
│   ├── index.vue          # 首页
│   └── components/        # 页面私有组件
│       └── Banner.vue
├── user/
│   ├── index.vue          # 用户列表
│   ├── detail.vue         # 用户详情
│   └── edit.vue           # 用户编辑
└── 404.vue                # 404 页面
```

### `/src/router` - 路由配置

```
router/
├── routes/              # 路由模块
│   ├── home.ts
│   ├── user.ts
│   └── system.ts
├── guards.ts            # 路由守卫
└── index.ts             # 路由入口
```

**路由配置示例：**

```typescript
// router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home/index.vue"),
  },
  {
    path: "/user",
    name: "User",
    component: () => import("@/views/user/index.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
```

### `/src/store` - 状态管理

使用 Pinia 管理全局状态。

```
store/
├── modules/
│   ├── user.ts          # 用户模块
│   ├── app.ts           # 应用模块
│   └── permission.ts    # 权限模块
└── index.ts             # store 入口
```

**Store 示例：**

```typescript
// store/modules/user.ts
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: null as UserInfo | null,
    token: "",
  }),

  getters: {
    isLogin: (state) => !!state.token,
  },

  actions: {
    async login(params: LoginParams) {
      const res = await loginApi(params);
      this.token = res.token;
      this.userInfo = res.userInfo;
    },
  },
});
```

### `/src/api` - API 接口

按模块组织 API 接口。

```
api/
├── modules/
│   ├── user.ts          # 用户相关接口
│   ├── system.ts        # 系统相关接口
│   └── common.ts        # 公共接口
└── index.ts             # 统一导出
```

**API 示例：**

```typescript
// api/modules/user.ts
import { request } from "@/utils/request";

export interface LoginParams {
  username: string;
  password: string;
}

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
}

export const loginApi = (params: LoginParams) => {
  return request<{ token: string; userInfo: UserInfo }>({
    url: "/auth/login",
    method: "POST",
    data: params,
  });
};

export const getUserInfoApi = () => {
  return request<UserInfo>({
    url: "/user/info",
    method: "GET",
  });
};
```

### `/src/utils` - 工具函数

```
utils/
├── request.ts           # HTTP 请求封装
├── storage.ts           # 本地存储封装
├── validate.ts          # 表单验证
├── format.ts            # 数据格式化
└── helpers.ts           # 辅助函数
```

### `/src/types` - 类型定义

```
types/
├── global.d.ts          # 全局类型
├── api.d.ts             # API 类型
├── components.d.ts      # 组件类型
└── env.d.ts             # 环境变量类型
```

**类型定义示例：**

```typescript
// types/global.d.ts
export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PageParams {
  page: number;
  pageSize: number;
}

export interface PageResult<T> {
  list: T[];
  total: number;
}
```

## 配置文件说明

### `package.json`

项目依赖和脚本配置。

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx",
    "lint:fix": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
    "format": "prettier --write \"src/**/*.{js,ts,vue,json,css,scss}\""
  }
}
```

### `vite.config.ts`

Vite 构建工具配置，详见 [项目配置 - Vite 配置](/views/guide/project-config#vite-配置)。

### `tsconfig.json`

TypeScript 编译配置，详见 [项目配置 - TypeScript 配置](/views/guide/project-config#typescript-配置)。

### `uno.config.ts`

UnoCSS 原子化 CSS 配置，详见 [UnoCSS 配置](/views/guide/unocss-config)。

## 命名规范

### 文件命名

- **组件文件**: PascalCase（如 `UserCard.vue`）
- **工具文件**: camelCase（如 `request.ts`）
- **类型文件**: camelCase（如 `user.d.ts`）
- **样式文件**: kebab-case（如 `global-styles.css`）

### 代码命名

- **变量/函数**: camelCase
- **常量**: UPPER_SNAKE_CASE
- **类/接口**: PascalCase
- **组件**: PascalCase

## 最佳实践

### 1. 模块化组织

金恒科技信息化部前端团队推荐将相关的代码放在一起，便于维护：

```
features/
├── user/
│   ├── api/
│   ├── components/
│   ├── store/
│   ├── types/
│   └── views/
├── product/
│   ├── api/
│   ├── components/
│   ├── store/
│   ├── types/
│   └── views/
```

### 2. 按需导入

使用 ES6 模块的按需导入，减小打包体积：

```typescript
// ✅ 推荐
import { ref, computed } from "vue";

// ❌ 不推荐
import * as Vue from "vue";
```

### 3. 路径别名

使用 `@` 别名简化导入路径：

```typescript
// ✅ 推荐
import Button from "@/components/common/Button/index.vue";

// ❌ 不推荐
import Button from "../../../components/common/Button/index.vue";
```

### 4. 类型优先

优先使用 TypeScript 类型定义：

```typescript
// ✅ 推荐
interface User {
  id: string;
  name: string;
}

const user: User = { id: "1", name: "John" };

// ❌ 不推荐
const user = { id: "1", name: "John" };
```

### 5. 企业级项目特殊实践

#### 单体项目实践
- 保持目录结构简单清晰
- 避免过度拆分，增加维护成本
- 适合快速迭代和开发

#### 集群项目实践
- 增加环境配置管理
- 实现统一的部署流程
- 支持多环境切换

#### Monorepo项目实践
- 使用 pnpm workspace 管理依赖
- 共享配置和工具
- 统一的代码规范和构建流程

#### 微前端项目实践
- 明确主应用和微应用的边界
- 实现应用间的通信机制
- 独立的开发和部署流程

## 下一步

- 🎨 学习 [UnoCSS 配置](/views/guide/unocss-config)
- 🛠️ 了解 [工程化配置](/views/engineering/scaffold)
- 📖 查看 [编码规范](/views/best-practices/coding-standards)

::: tip 提示
良好的项目结构是金恒科技信息化部前端团队协作的基础，请遵循统一的目录规范和命名约定！如有特殊需求，请联系团队负责人或通过内部工单系统 409322 提交需求。
:::
