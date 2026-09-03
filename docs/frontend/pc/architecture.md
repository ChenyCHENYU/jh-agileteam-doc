# 架构设计

> **基于金恒产品化平台生产域应用（cx-ui-produce）的架构设计综合提炼**  
> 本文档整理了项目实际使用的架构设计模式、技术选型、开发规范和最佳实践


<AuthorTag :authors="['ZhuXiang','CHENY','ZhongYu','XuQingYu','MaJiaRui']" />

## 章节导航

本页覆盖 **1 产品化架构 · 2 微前端架构 · 4 技术栈架构 · 10 构建与部署 · 总结**；其余章节在三个专项页：

| 专项页 | 覆盖章节 |
|---|---|
| [领域驱动与代码组织](./architecture/domain-code-org) | 3 领域驱动设计（DDD） · 8 代码组织规范 |
| [路由权限与状态管理](./architecture/routing-permission-state) | 5 路由与权限架构 · 6 状态管理架构 |
| [组件设计与 API 层架构](./architecture/component-api) | 7 组件设计架构 · 9 API 层架构设计 |


## 1. 产品化架构设计

### 1.1 产品化理念

**核心思想**：**"一套代码，多处部署"** + **领域驱动设计（DDD）**

```
产品化 = 统一技术栈 + 统一规范 + 独立部署 + 灵活组装 + 相互调用
```

**架构原则**：

| 原则           | 说明                                                   | 实现方式                      |
| -------------- | ------------------------------------------------------ | ----------------------------- |
| 统一技术栈     | 所有应用使用 Vue 3 + Vite + Element Plus + Pinia       | 通过脚手架和规范约束          |
| 统一规范       | 统一的代码规范、目录结构、开发流程                     | 本文档 + Lint 工具            |
| 独立部署       | 每个应用独立 Git 仓库、独立部署                        | 独立的 CI/CD 流程             |
| 灵活组装       | 通过微前端按需组装，不同客户可选择不同应用             | Module Federation             |
| 相互调用       | 应用间可以跨域调用页面和组件                           | Remote 组件加载               |
| 按需加载       | 运行时动态加载远程模块，减少主应用体积                 | 动态 import                   |
| 领域驱动       | 每个应用对应一个业务领域                               | DDD 架构设计                  |

### 1.2 四大应用矩阵

```
┌─────────────────────────────────────────────────────────────┐
│                     金恒产品化平台                           │
│                  (JH4J Product Platform)                    │
└─────────────────────────────────────────────────────────────┘
                            │
    ┌───────────────────────┼───────────────────────┐
    │                       │                       │
┌───▼────────┐  ┌───────────▼──────────┐  ┌────────▼────────┐
│ 生产应用    │  │ 销售应用（当前项目）  │  │ 质量应用         │
│cx-ui-produce│  │  cx-ui-sale       │  │ cx-ui-quality   │
│             │  │                      │  │                 │
│📦 生产计划   │  │ 🛒 订单管理           │  │ 🔍 质量检验      │
│📦 工艺管理   │  │ 🛒 客户管理           │  │ 🔍 质量跟踪      │
│📦 设备管理   │  │ 🛒 销售分析           │  │ 🔍 质量报表      │
└────────────┘  └──────────────────────┘  └─────────────────┘
    │                       │                       │
    └───────────────────────┴───────────────────────┘
                            │
    ┌───────────────────────┴───────────────────────┐
    │          共享子应用 (Shared Apps)              │
    ├──────────────┬──────────────┬──────────────────┤
    │ systemApp    │ agGridApp    │ componentLib     │
    │ (系统管理)    │ (高级表格)    │ (组件库)          │
    ├──────────────┼──────────────┼──────────────────┤
    │ · 用户管理    │ · 高级表格    │ · 业务组件        │
    │ · 角色权限    │ · 数据导出    │ · 图表组件        │
    │ · 菜单管理    │ · 虚拟滚动    │ · 表单组件        │
    │ · 组织架构    │ · 列冻结      │ · 布局组件        │
    └──────────────┴──────────────┴──────────────────┘
```

**应用职责矩阵**：

| 应用              | 代码仓库         | 部署路径   | 核心领域     | 依赖关系               |
| ----------------- | ---------------- | ---------- | ------------ | ---------------------- |
| **销售应用**      | cx-ui-produce    | `/main`    | 销售域       | systemApp + agGridApp  |
| **生产应用**      | cx-ui-produce    | `/produce` | 生产域       | systemApp + saleApp    |
| **质量应用**      | cx-ui-quality    | `/quality` | 质量域       | systemApp + produceApp |
| **成本应用**      | cx-ui-cost       | `/cost`    | 成本域       | systemApp + produceApp |
| **系统管理子应用** | jh4j-systemApp   | `/sub/systemApp` | 系统管理 | 被所有应用依赖         |
| **高级表格子应用** | jh4j-ag-grid     | `/sub/ag-grid`   | 数据表格 | 被所有应用依赖         |

### 1.3 产品化优势

**1. 快速复制**

```
新客户需求 → 选择应用模块 → 独立部署 → 上线使用
```

- **场景举例**：客户 A 只需销售+生产，客户 B 需要全部模块
- **实现方式**：各应用独立打包，按需部署

**2. 按需定制**

```
基础版（销售+生产） → 标准版（+质量） → 企业版（+成本）
```

**3. 降低耦合**

- 应用间通过 API 和微前端通信，无直接代码依赖
- 单个应用升级不影响其他应用

**4. 提高效率**

- 不同团队并行开发不同应用
- 共享组件和工具包统一维护

---

## 2. 微前端架构

### 2.1 Module Federation 设计

**技术选型**：`@originjs/vite-plugin-federation` (基于 Webpack 5 Module Federation)

**架构示意图**：

```
┌────────────────────────────────────────────────────────────┐
│             销售应用 (saleApp)                              │
│           http://domain.com/main                           │
├────────────────────────────────────────────────────────────┤
│  暴露 (exposes):                                            │
│  · ./sale/demo/index.vue  → 订单列表页                      │
│  · ./sale/demo/form.vue   → 订单表单页                      │
│  · ./sale/customer/index.vue → 客户列表页                   │
├────────────────────────────────────────────────────────────┤
│  远程加载 (remotes):                                        │
│  · systemApp → http://172.28.99.140/sub/systemApp/...      │
│  · agGridApp → http://172.28.99.140/sub/ag-grid/...        │
│  · produceApp → http://domain.com/produce/remoteEntry.js   │
└────────────────────────────────────────────────────────────┘
                        ▲
                        │ 通过 remoteEntry.js 动态加载
                        │
┌───────────────────────┴────────────────────────────────────┐
│         其他应用（生产/质量/成本应用）                      │
│  import('saleApp/sale/demo/index.vue')                     │
│  → 可直接在菜单中配置调用销售应用的订单列表页               │
└────────────────────────────────────────────────────────────┘
```

**配置位置**：`vite/plugins/index.ts`

```typescript
import federation from "@originjs/vite-plugin-federation";

export default {
  plugins: [
    federation({
      name: "main_app", // 当前应用名称
      filename: "remoteEntry.js", // 入口文件名
      
      // 1. 暴露给其他应用的页面
      exposes: {
        "./sale/demo/index.vue": "./src/views/sale/demo/index.vue",
        "./sale/demo/form.vue": "./src/views/sale/demo/form.vue",
        // 所有暴露的页面需在 vite/plugins/shared/pages.ts 中配置
      },
      
      // 2. 远程加载的子应用
      remotes: {
        systemApp: `http://172.28.99.140/sub/systemApp/assets/remoteEntry.js?t=${version}`,
        agGridApp: `http://172.28.99.140/sub/ag-grid/assets/remoteEntry.js?t=${version}`,
        produceApp: `http://domain.com/produce/assets/remoteEntry.js?t=${version}`
      },
      
      // 3. 共享的依赖（避免重复加载）
      shared: {
        vue: { singleton: true },
        pinia: { singleton: true },
        "vue-router": { singleton: true },
        "element-plus": { singleton: true },
        "@jhlc/common-core": { singleton: true },
        // ...更多共享依赖
      }
    })
  ]
};
```

**页面暴露配置**：`vite/plugins/shared/pages.ts`

```typescript
export const getPagesShared = function () {
  const ret = {};
  const list = [
    { name: "sale/demo/index.vue", label: "内贸订单" },
    { name: "sale/demo/form.vue", label: "订单维护" },
    { name: "sale/customer/index.vue", label: "客户列表" },
    // 新增页面在此配置
  ];
  
  list.forEach((item) => {
    ret["./" + item.name] = "./src/views/" + item.name;
  });
  
  return ret;
};
```

### 2.2 应用间通信

**1. 远程组件加载**

```typescript
// src/util/system.ts
export const fetchRemoteComponent = function(module: string, path: string): Promise<any> {
  return new Promise(async (resolve) => {
    const url = await getEntry(module); // 获取远程入口
    __federation_method_setRemote(module, { url, format: "esm", from: "vite" });
    const moduleWrapped = await __federation_method_getRemote(module, path);
    resolve(__federation_method_unwrapDefault(moduleWrapped));
  });
};
```

**使用示例**：

```typescript
// 加载远程公共模块（router、store、plugins等）
const router = await fetchRemoteComponent("public", "./router/index.ts");
const store = await fetchRemoteComponent("public", "./store/index.ts");
const plugins = await fetchRemoteComponent("public", "./plugins/index.ts");

// 使用远程组件
app.use(router);
app.use(store);
app.use(plugins);
```

**2. 跨应用页面调用**

```typescript
// 在系统管理中配置菜单
{
  "menuName": "生产计划",
  "path": "/produce/plan/list",
  "component": "produceApp/produce/plan/list/index.vue", // 跨应用调用
  "permissions": ["produce:plan:list"]
}
```

**3. 事件总线通信（可选）**

```typescript
// 使用 PubSub 或 EventBus 进行跨应用通信
import PubSub from "pubsub-js";

// 发布事件
PubSub.publish("order:updated", { orderId: "12345" });

// 订阅事件
PubSub.subscribe("order:updated", (msg, data) => {
  console.log("订单更新:", data);
});
```

### 2.3 共享依赖管理

**依赖分类**：

| 依赖类型       | 说明                     | 示例                                  | 共享策略     |
| -------------- | ------------------------ | ------------------------------------- | ------------ |
| **核心框架**   | 框架和路由               | vue, vue-router, pinia                | singleton    |
| **UI 组件库**  | 组件库                   | element-plus, @element-plus/icons-vue | singleton    |
| **公共工具包** | 内部工具库               | @jhlc/common-core, @jhlc/utils        | singleton    |
| **第三方库**   | 常用第三方库             | lodash, moment, axios                 | 按需共享     |
| **业务组件**   | 业务组件库               | @jhlc/jh-ui                           | singleton    |

**共享配置原则**：

```typescript
shared: {
  // 1. 核心框架（必须 singleton）
  vue: { singleton: true, requiredVersion: "^3.2.25" },
  pinia: { singleton: true },
  "vue-router": { singleton: true },
  
  // 2. UI 库（必须 singleton）
  "element-plus": { singleton: true },
  
  // 3. 内部公共包（必须 singleton）
  "@jhlc/common-core": { singleton: true },
  "@jhlc/platform": { singleton: true },
  
  // 4. 工具库（按需共享）
  lodash: {},
  moment: {},
  axios: { singleton: true },
  
  // 5. 不共享的依赖（主应用独享）
  // 某些特殊依赖不放入 shared
}
```

**singleton 说明**：

- ✅ **singleton: true**：确保全局只有一个实例（如 vue、pinia）
- ❌ **不设置 singleton**：允许不同版本共存（如 lodash）

---

## 4. 技术栈架构

### 4.1 核心技术栈

| 技术               | 版本       | 用途               | 备注                   |
| ------------------ | ---------- | ------------------ | ---------------------- |
| **Vue**            | 3.2.25     | 前端框架           | Composition API        |
| **Vite**           | 4.x        | 构建工具           | 快速开发、HMR          |
| **TypeScript**     | 5.x        | 类型系统           | 类型安全               |
| **Pinia**          | 2.0.14     | 状态管理           | 替代 Vuex              |
| **Vue Router**     | 4.4.3      | 路由管理           | 动态路由、权限控制     |
| **Element Plus**   | 2.2.6      | UI 组件库          | 企业级组件             |
| **WindiCSS**       | 3.5.6      | 原子化 CSS         | 按需生成、性能优化     |
| **Axios**          | 0.27.2     | HTTP 客户端        | 请求拦截、响应处理     |

**微前端相关**：

| 技术                                      | 用途                   | 说明                           |
| ----------------------------------------- | ---------------------- | ------------------------------ |
| **@originjs/vite-plugin-federation**      | Module Federation 插件 | Vite 版 Module Federation      |
| **@jhlc/platform**                        | 平台核心包             | 平台初始化、路由生成、权限控制 |
| **@jhlc/common-core**                     | 公共工具包             | HTTP 工具、认证、工具函数      |

### 4.2 工程化工具

| 工具                           | 用途               | 配置文件                      |
| ------------------------------ | ------------------ | ----------------------------- |
| **Husky**                      | Git Hooks          | `.husky/`                     |
| **Commitlint**                 | 提交信息规范       | `commitlint.config.cjs`       |
| **ESLint**                     | 代码规范检查       | `.eslintrc.js`                |
| **Prettier**                   | 代码格式化         | `.prettierrc`                 |
| **TypeScript**                 | 类型检查           | `tsconfig.json`               |
| **unplugin-vue-components**    | 组件自动导入       | `vite/plugins/auto-import.js` |
| **unplugin-auto-import**       | API 自动导入       | `vite/plugins/auto-import.js` |

### 4.3 依赖管理

**包管理器**：`pnpm` (推荐)

**依赖分类**：

```json
{
  "dependencies": {
    // 1. 核心框架
    "vue": "~3.2.25",
    "pinia": "~2.0.14",
    "vue-router": "4.4.3",
    
    // 2. UI 组件库
    "element-plus": "2.2.6-prod.3",
    "@element-plus/icons-vue": "2.1.0",
    
    // 3. 内部公共包（@jhlc）
    "@jhlc/common-core": "^3.1.0",
    "@jhlc/platform": "^3.1.0",
    "@jhlc/jh-ui": "3.1.0",
    "@jhlc/utils": "3.1.0",
    "@jhlc/types": "3.1.0",
    
    // 4. 工具库
    "axios": "^0.27.2",
    "lodash": "^4.17.21",
    "moment": "^2.30.1",
    "qs": "^6.10.3",
    
    // 5. 业务相关
    "echarts": "5.3.2",
    "xlsx": "^0.18.5",
    "file-saver": "2.0.5"
  },
  "devDependencies": {
    // 构建工具
    "@vitejs/plugin-vue": "latest",
    "vite": "latest",
    
    // 微前端
    "@originjs/vite-plugin-federation": "latest",
    
    // 工程化
    "husky": "latest",
    "@commitlint/cli": "latest",
    "typescript": "latest"
  }
}
```

**内网私有源配置**：`.npmrc`

```ini
# @jhlc 包从内网下载
registry=http://172.18.248.130/
@jhlc:registry=http://172.18.248.130/
```

---

## 3. 领域驱动设计（DDD）与 8. 代码组织规范

> 已迁移至专项页 **[领域驱动与代码组织](./architecture/domain-code-org)**（DDD 分层模型、限界上下文、9 段式代码组织、目录约定与命名规范）。

## 5. 路由与权限架构 / 6. 状态管理架构

> 已迁移至专项页 **[路由权限与状态管理](./architecture/routing-permission-state)**（动态路由注册、权限指令、Pinia 模块划分与持久化）。

## 7. 组件设计架构 / 9. API 层架构设计

> 已迁移至专项页 **[组件设计与 API 层架构](./architecture/component-api)**（C_ 组件体系、AbstractPageQueryHook 基类、API 封装策略）。

## 10. 构建与部署架构

### 10.1 多环境配置

**环境分类**：

| 环境     | 配置文件    | 用途         | 服务地址                         |
| -------- | ----------- | ------------ | -------------------------------- |
| **dev**  | `.env.dev`  | 本地开发     | `http://172.28.99.140`           |
| **uat**  | `.env.uat`  | 测试环境     | `http://172.28.99.140`           |
| **prod** | `.env.prod` | 生产环境     | `https://172.28.99.140`          |

**配置文件示例**：

```ini
# .env.dev
ENV=dev
ENV_ANY_REPORT_SERVER=http://172.28.99.140:9999
ENV_ANY_REPORT_SECRET_KEY=your-secret-key
TOKEN_LOCALSTORAGE=tokenKey-dev
VITE_USE_MOCKJS=true
```

**vite.config.ts 中使用**：

```typescript
export default defineConfig(({ mode }) => {
  const config = loadEnv(mode, process.cwd(), "ENV");
  
  const webApiMap = {
    dev: "http://172.28.99.140/uat-api",
    uat: "http://172.28.99.140/uat-api",
    prod: "https://172.28.99.140/prod-api"
  };
  
  const baseApi = "/" + config["ENV"] + "-api";
  
  return {
    define: {
      "process.env": {
        VUE_APP_BASE_API: baseApi,
        APP_NAME: "微服务平台",
        VERSION: version,
        // ...
      }
    },
    server: {
      port: 8001,
      proxy: {
        [baseApi]: {
          target: webApiMap[config["ENV"]],
          changeOrigin: true,
          rewrite: (p) => p.replace(new RegExp(`^${baseApi}`), "")
        }
      }
    }
  };
});
```

### 10.2 构建优化

**1. 代码分割**

```typescript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 第三方库单独打包
          "element-plus": ["element-plus"],
          "echarts": ["echarts"],
          "lodash": ["lodash"],
          
          // 公共模块
          "vendor": ["vue", "vue-router", "pinia"]
        }
      }
    }
  }
};
```

**2. 压缩配置**

```typescript
// vite/plugins/compression.js
import viteCompression from "vite-plugin-compression";

export default function createCompression() {
  return viteCompression({
    algorithm: "gzip", // 压缩算法
    ext: ".gz",        // 文件后缀
    threshold: 10240,  // 只压缩大于 10KB 的文件
    deleteOriginFile: false // 保留原文件
  });
}
```

**3. 按需加载**

```typescript
// 路由懒加载
const routes = [
  {
    path: "/sale/order/list",
    component: () => import("@/views/sale/order/list/index.vue")
  }
];

// 组件懒加载
defineAsyncComponent(() => import("./components/HeavyComponent.vue"));
```

### 10.3 部署策略

**1. 构建命令**

```json
{
  "scripts": {
    "build:dev": "vite build --mode dev -- --isUnionMain=true",
    "build:uat": "vite build --mode uat -- --isUnionMain=true",
    "build:prod": "vite build --mode prod -- --isUnionMain=true"
  }
}
```

**2. 构建产物**

```
dist/
├── index.html                      # 主应用入口
├── version.js                      # 版本信息（微前端版本协调）
├── assets/
│   ├── js/
│   │   ├── remoteEntry.js         # Module Federation入口
│   │   └── src-[name].[hash].js   # 业务代码
│   ├── css/
│   │   └── [name].[hash].css      # 样式文件
│   └── img/
└── ...
```

**3. Nginx 配置**

```nginx
server {
  listen 80;
  server_name your-domain.com;
  
  # 主应用
  location / {
    root /path/to/dist;
    try_files $uri $uri/ /index.html;
  }
  
  # 子应用
  location /sub/systemApp {
    root /path/to/systemApp/dist;
    try_files $uri $uri/ /index.html;
  }
  
  location /sub/ag-grid {
    root /path/to/ag-grid/dist;
    try_files $uri $uri/ /index.html;
  }
  
  # API 代理
  location /prod-api {
    proxy_pass http://172.28.99.140:9000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
  
  # 跨域配置（微前端需要）
  add_header Access-Control-Allow-Origin *;
  add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
  add_header Access-Control-Allow-Headers "Content-Type, Authorization";
}
```

**4. 微前端协调部署**

```
┌────────────────────────────────────────────────────────┐
│                    部署架构                             │
├────────────────────────────────────────────────────────┤
│  Nginx (入口)                                          │
│    ├── / → 主应用 (cx-ui-produce)                       │
│    ├── /sub/systemApp → 系统管理子应用                 │
│    ├── /sub/ag-grid → 高级表格子应用                   │
│    └── /prod-api → 后端 API                            │
└────────────────────────────────────────────────────────┘
```

**5. 版本管理**

```typescript
// dist/version.js（自动生成）
window.__MICRO_APP_VERSION__ = {
  module: "main_app",
  version: "2026-2-4 10:30:00",
  remoteEntry: "assets/remoteEntry.js",
  pageNum: "12"
};
```

**6. 灰度发布**

```nginx
# 灰度发布配置（基于请求头）
map $http_x_gray_flag $gray_backend {
  "true" http://172.28.99.140:9001; # 灰度服务器
  default http://172.28.99.140:9000; # 正式服务器
}

server {
  location /prod-api {
    proxy_pass $gray_backend;
  }
}
```
---

## 🎯 总结

本架构设计文档基于 **cx-ui-produce** 项目的实际情况，提炼了以下核心设计：

1. **产品化架构**：一套代码，多处部署，按需组装
2. **微前端架构**：Module Federation 实现应用间通信和共享
3. **领域驱动设计**：DDD 架构，清晰的领域划分
4. **配置化开发**：AbstractPageQueryHook 基类，零 API 层开发
5. **规范化开发**：统一的命名、组织、通信规范
6. **工程化体系**：完善的构建、部署、版本管理

**核心优势**：

- ✅ 快速开发：配置化开发，减少重复代码
- ✅ 易于维护：清晰的分层架构，职责明确
- ✅ 灵活扩展：微前端架构，按需组装
- ✅ 高度复用：组件化设计，代码复用率高
- ✅ 团队协作：统一规范，降低沟通成本
---
