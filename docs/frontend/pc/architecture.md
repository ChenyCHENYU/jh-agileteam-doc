# 架构设计

> **基于金恒产品化平台生产域应用（cx-ui-produce）的架构设计综合提炼**  
> 本文档整理了项目实际使用的架构设计模式、技术选型、开发规范和最佳实践


<AuthorTag :authors="['ZhuXiang','CHENY','ZhongYu','XuQingYu']" />

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

## 3. 领域驱动设计（DDD）

### 3.1 领域划分

**领域拆分原则**：

```
平台 → 应用 → 领域 → 子系统 → 模块
```

| 层级         | 说明                 | 示例                                  | 对应关系       |
| ------------ | -------------------- | ------------------------------------- | -------------- |
| **平台**     | 整个产品化平台       | 金恒产品化平台                        | 多个应用       |
| **应用**     | 独立的 Git 仓库      | cx-ui-produce（销售应用）              | 1 个领域       |
| **领域**     | 业务领域             | `sale/`（销售域）                     | 多个子系统     |
| **子系统**   | 领域下的业务模块     | `order/`（订单）、`customer/`（客户） | 多个功能模块   |
| **模块**     | 子系统下的功能模块   | `list/`（列表）、`form/`（表单）      | 多个页面       |

**当前项目领域**：

```
cx-ui-produce (销售应用)
└── sale/ (销售域) - 唯一领域
    ├── demo/ (演示模块 - 订单管理)
    ├── customer/ (客户管理)
    ├── contract/ (合同管理)
    └── analysis/ (销售分析)
```

### 3.2 目录组织

**场景一：扁平结构（适合简单应用）**

```
src/views/
└── sale/                  # 销售域
    ├── order/             # 子系统：订单管理
    │   ├── index.vue      # 订单列表页
    │   ├── form.vue       # 订单表单页
    │   └── detail.vue     # 订单详情页
    │
    ├── customer/          # 子系统：客户管理
    │   ├── index.vue      # 客户列表页
    │   ├── form.vue       # 客户表单页
    │   └── detail.vue     # 客户详情页
    │
    └── analysis/          # 子系统：销售分析
        ├── dashboard.vue  # 销售看板
        └── report.vue     # 销售报表
```

**场景二：层级结构（适合复杂应用）**

```
src/views/
└── sale/                      # 销售域
    ├── order/                 # 子系统：订单管理
    │   ├── domestic/          # 模块：内贸订单
    │   │   ├── list/
    │   │   │   ├── index.vue  # 列表页
    │   │   │   ├── data.ts    # 数据逻辑
    │   │   │   └── index.scss # 样式
    │   │   └── form/
    │   │       └── index.vue  # 表单页
    │   │
    │   ├── foreign/           # 模块：外贸订单
    │   │   ├── list/
    │   │   └── form/
    │   │
    │   └── tracking/          # 模块：订单跟踪
    │       ├── timeline.vue
    │       └── logistics.vue
    │
    ├── customer/              # 子系统：客户管理
    │   ├── enterprise/        # 模块：企业客户
    │   │   ├── list/
    │   │   └── detail/
    │   │
    │   └── individual/        # 模块：个人客户
    │       ├── list/
    │       └── detail/
    │
    └── analysis/              # 子系统：销售分析
        ├── performance/       # 模块：业绩分析
        ├── forecast/          # 模块：销售预测
        └── comparison/        # 模块：对比分析
```

**推荐结构（三文件分离）**：

```
src/views/
└── sale/
    └── order/
        └── list/              # 功能模块
            ├── index.vue      # 视图层（模板）
            ├── data.ts        # 数据逻辑层（响应式数据、API调用）
            ├── index.scss     # 样式层
            └── components/    # 页面私有组件
                ├── SearchForm.vue
                └── BatchImport.vue
```

### 3.3 代码分层

**分层架构**：

```
┌─────────────────────────────────────────────────────────┐
│                      视图层 (View)                       │
│                     index.vue                           │
│  职责: 模板渲染、事件绑定、组件组合                      │
└─────────────────────────────────────────────────────────┘
                        ▼ 引用
┌─────────────────────────────────────────────────────────┐
│                    逻辑层 (Logic)                        │
│                      data.ts                            │
│  职责: 响应式数据、业务逻辑、API调用、状态管理           │
└─────────────────────────────────────────────────────────┘
                        ▼ 调用
┌─────────────────────────────────────────────────────────┐
│                    API层 (API)                           │
│                   order-api.ts                          │
│  职责: HTTP请求封装、参数处理、响应转换                  │
└─────────────────────────────────────────────────────────┘
                        ▼ 调用
┌─────────────────────────────────────────────────────────┐
│                   工具层 (Utils)                         │
│              @jhlc/common-core                          │
│  职责: 通用工具函数、HTTP客户端、认证工具                │
└─────────────────────────────────────────────────────────┘
```

**分层职责说明**：

| 层级       | 文件                  | 职责                                       | 禁止操作                 |
| ---------- | --------------------- | ------------------------------------------ | ------------------------ |
| **视图层** | `index.vue`           | 模板渲染、事件绑定、组件组合               | 直接调用 API、复杂计算   |
| **逻辑层** | `data.ts`             | 响应式数据、业务逻辑、API 调用             | 直接操作 DOM             |
| **API 层** | `order-api.ts`        | HTTP 请求封装、参数处理                    | 业务逻辑处理             |
| **工具层** | `@jhlc/common-core`   | 通用工具函数、HTTP 客户端                  | 业务相关逻辑             |

**优化方案（配置化开发）**：

使用 `AbstractPageQueryHook` 基类，**无需单独的 API 层**：

```
┌─────────────────────────────────────────────────────────┐
│                      视图层 (View)                       │
│                     index.vue                           │
└─────────────────────────────────────────────────────────┘
                        ▼ 引用
┌─────────────────────────────────────────────────────────┐
│                 逻辑层 (Logic + API配置)                 │
│                      data.ts                            │
│  · API_CONFIG 配置（替代API层）                          │
│  · 继承 AbstractPageQueryHook 基类                      │
│  · 直接使用 this.getAction / postAction 等              │
└─────────────────────────────────────────────────────────┘
                        ▼ 继承
┌─────────────────────────────────────────────────────────┐
│              AbstractPageQueryHook 基类                 │
│              @jhlc/common-core                          │
│  · getAction / postAction / putAction / deleteAction    │
│  · actionBatch / postBatch / putBatch / deleteBatch     │
└─────────────────────────────────────────────────────────┘
```

**详见**：[9. API 层架构设计](#9-api-层架构设计)

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

## 5. 路由与权限架构

### 5.1 动态路由生成

**架构流程**：

```
┌────────────┐      ┌────────────┐      ┌────────────┐
│ 用户登录   │ ───> │ 获取菜单   │ ───> │ 生成路由   │
│            │      │ (API)      │      │ (前端)     │
└────────────┘      └────────────┘      └────────────┘
                                              │
                                              ▼
                    ┌──────────────────────────────────┐
                    │ 动态注册到 Vue Router            │
                    │ router.addRoute(route)           │
                    └──────────────────────────────────┘
```

**实现位置**：`src/permission.ts`

```typescript
import { fetchRemoteComponent } from "@/util/system";
import { getToken } from "@jhlc/common-core/src/util/auth";
import user from "@jhlc/common-core/src/store/user";

const router = await fetchRemoteComponent("public", "./router/index.ts");
const usePermissionStore = await fetchRemoteComponent(
  "public",
  "./store/modules/permission.ts"
);

router.beforeEach(async (to, from, next) => {
  const permissionStore = usePermissionStore();
  const userStore = user();
  
  // 1. Token 验证
  if (getToken()) {
    // 2. 获取用户信息
    if (!fetchUserFlag) {
      fetchUserFlag = true;
      await userStore.getUserInfo();
    }
    
    // 3. 生成路由
    if (!permissionStore.generated) {
      permissionStore.generated = true;
      
      // 优先注册当前菜单，异步注册其他子系统
      await permissionStore.generateCurrentRoute(to);
      permissionStore.generateRoutes(to);
      permissionStore.isRouterGenerated = true;
      
      return next({ ...to, replace: true });
    }
    else {
      return next();
    }
  }
  else {
    // 白名单路由直接放行
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`);
    }
  }
});
```

**路由配置示例**：

```typescript
// 后端返回的菜单数据
{
  "menuId": "1001",
  "menuName": "订单管理",
  "path": "/sale/order/list",
  "component": "saleApp/sale/order/list/index.vue", // 微前端路径
  "permissions": ["sale:order:list"]
}

// 前端生成的路由
{
  path: "/sale/order/list",
  name: "SaleOrderList",
  component: () => import("saleApp/sale/order/list/index.vue"), // 动态 import
  meta: {
    title: "订单管理",
    permissions: ["sale:order:list"]
  }
}
```

### 5.2 权限控制

**1. 路由权限**

```typescript
// 路由守卫中检查权限
router.beforeEach((to, from, next) => {
  const userStore = user();
  const permissions = to.meta.permissions;
  
  if (permissions && !userStore.hasPermission(permissions)) {
    // 无权限，跳转到 403 页面
    next("/403");
  } else {
    next();
  }
});
```

**2. 按钮权限指令**

```vue
<template>
  <!-- 使用 v-permission 指令 -->
  <el-button v-permission="['sale:order:add']" @click="handleAdd">
    新增
  </el-button>
  
  <!-- 或使用 v-if 判断 -->
  <el-button v-if="hasPermission('sale:order:edit')" @click="handleEdit">
    编辑
  </el-button>
</template>

<script setup lang="ts">
import { hasPermission } from "@jhlc/common-core/src/util/permission";
</script>
```

**3. 数据权限**

```typescript
// API 调用时自动带上数据权限参数
const res = await getOrderList({
  page: 1,
  pageSize: 20,
  // 后端根据用户权限自动过滤数据
});
```

### 5.3 菜单配置

**系统管理中配置菜单**：

| 字段         | 说明                           | 示例                                    |
| ------------ | ------------------------------ | --------------------------------------- |
| **菜单名称** | 显示在侧边栏的名称             | 订单管理                                |
| **路由地址** | 前端路由路径                   | `/sale/order/list`                      |
| **组件路径** | 微前端组件路径（关键）         | `saleApp/sale/order/list/index.vue`     |
| **权限标识** | 权限控制标识                   | `sale:order:list`                       |
| **菜单类型** | 目录、菜单、按钮               | 菜单                                    |
| **排序**     | 菜单顺序                       | 1                                       |
| **图标**     | 菜单图标                       | `el-icon-document`                      |

**组件路径规范**：

```
{应用名}/{领域}/{子系统}/{模块}/{页面}.vue

示例：
saleApp/sale/order/list/index.vue
saleApp/sale/customer/form/index.vue
produceApp/produce/plan/list/index.vue
```

**注意**：

- 应用名必须与 Module Federation 配置的 `name` 一致
- 页面必须在 `vite/plugins/shared/pages.ts` 中配置暴露

---

## 6. 状态管理架构

### 6.1 Pinia Store 设计

**Store 分类**：

```
stores/
├── user.ts           # 用户 Store（用户信息、Token、权限）
├── permission.ts     # 权限 Store（菜单、路由、权限）
├── app.ts            # 应用 Store（全局状态、主题、语言）
├── settings.ts       # 设置 Store（侧边栏、标签页、布局）
└── modules/
    ├── order.ts      # 订单 Store（业务状态）
    └── customer.ts   # 客户 Store（业务状态）
```

**Store 定义规范**：

```typescript
// src/stores/modules/order.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getOrderList } from "@/api/order";

export const useOrderStore = defineStore(
  "order", // Store ID
  () => {
    // ==================== 1. 状态定义 ====================
    const orderList = ref([]);
    const currentOrder = ref(null);
    const loading = ref(false);
    
    // ==================== 2. 计算属性 ====================
    const totalAmount = computed(() => {
      return orderList.value.reduce((sum, item) => sum + item.amount, 0);
    });
    
    // ==================== 3. 方法定义 ====================
    const fetchOrderList = async (params: any) => {
      loading.value = true;
      try {
        const res = await getOrderList(params);
        orderList.value = res.data.records;
      } finally {
        loading.value = false;
      }
    };
    
    const setCurrentOrder = (order: any) => {
      currentOrder.value = order;
    };
    
    const resetStore = () => {
      orderList.value = [];
      currentOrder.value = null;
      loading.value = false;
    };
    
    // ==================== 4. 返回（暴露） ====================
    return {
      // 状态
      orderList,
      currentOrder,
      loading,
      
      // 计算属性
      totalAmount,
      
      // 方法
      fetchOrderList,
      setCurrentOrder,
      resetStore
    };
  },
  {
    // ==================== 5. 持久化配置 ====================
    persist: {
      key: "order-store",
      storage: localStorage,
      paths: ["currentOrder"] // 只持久化部分状态
    }
  }
);
```

### 6.2 状态持久化

**使用插件**：`pinia-plugin-persistedstate`

**配置位置**：Store 定义时配置

```typescript
import { defineStore } from "pinia";

export const useUserStore = defineStore(
  "user",
  () => {
    const token = ref("");
    const userInfo = ref({});
    
    return { token, userInfo };
  },
  {
    persist: {
      key: "user-store",        // localStorage 的 key
      storage: localStorage,     // 存储方式（localStorage/sessionStorage）
      paths: ["token", "userInfo"] // 持久化字段（可选，默认全部）
    }
  }
);
```

**持久化策略**：

| Store            | 持久化   | 存储方式        | 持久化字段               | 说明               |
| ---------------- | -------- | --------------- | ------------------------ | ------------------ |
| **user**         | ✅       | localStorage    | token, userInfo          | 用户登录态必须持久化 |
| **permission**   | ✅       | sessionStorage  | routes, menus            | 刷新页面需重新获取 |
| **app**          | ✅       | localStorage    | theme, language, sidebar | 用户偏好设置       |
| **order**        | ❌       | -               | -                        | 业务状态无需持久化 |

### 6.3 Store 最佳实践

**1. 使用 Composition API 风格**

```typescript
// ✅ 推荐：Composition API 风格（更灵活）
export const useUserStore = defineStore("user", () => {
  const token = ref("");
  const setToken = (newToken: string) => {
    token.value = newToken;
  };
  
  return { token, setToken };
});

// ❌ 不推荐：Options API 风格
export const useUserStore = defineStore("user", {
  state: () => ({ token: "" }),
  actions: {
    setToken(newToken) {
      this.token = newToken;
    }
  }
});
```

**2. Store 职责分离**

```typescript
// ✅ 按业务领域划分 Store
useOrderStore()   // 订单相关状态
useCustomerStore() // 客户相关状态

// ❌ 一个 Store 包含所有业务状态
useBusinessStore() // 混杂了订单、客户、合同等
```

**3. 避免状态冗余**

```typescript
// ✅ 使用计算属性派生状态
const totalAmount = computed(() => {
  return orderList.value.reduce((sum, item) => sum + item.amount, 0);
});

// ❌ 维护冗余状态
const totalAmount = ref(0);
watch(orderList, () => {
  totalAmount.value = orderList.value.reduce((sum, item) => sum + item.amount, 0);
});
```

**4. 组件中使用 Store**

```vue
<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();

// ✅ 使用 storeToRefs 保持响应式
const { token, userInfo } = storeToRefs(userStore);

// ✅ 方法直接解构（方法不需要保持响应式）
const { setToken, logout } = userStore;
</script>
```

---

## 7. 组件设计架构

### 7.1 组件分类与命名

| 组件类型       | 前缀   | 命名方式     | 示例                                    | 存放位置                           |
| -------------- | ------ | ------------ | --------------------------------------- | ---------------------------------- |
| **全局公共组件** | `C_`   | C_PascalCase | `C_Table`、`C_Dialog`、`C_Form`         | `src/components/global/`           |
| **业务域组件**   | `c_`   | c_pascalCase | `c_orderTable`、`c_customerForm`        | `src/views/{domain}/components/`   |
| **页面私有组件** | 无前缀 | PascalCase   | `SearchForm`、`OrderItems`              | `src/views/{domain}/{module}/components/` |

**命名对比表**：

| 组件类型     | 示例                          | 首字母            | 识别特征   | 使用范围     |
| ------------ | ----------------------------- | ----------------- | ---------- | ------------ |
| 全局组件     | `C_Table`、`C_Dialog`         | 大写 C + 大写开头 | 全平台通用 | 所有应用     |
| 业务域组件   | `c_orderTable`、`c_saleChart` | 小写 c + **小写开头** | 领域内共享 | 当前领域     |
| 页面私有组件 | `SearchForm`、`OrderItems`    | 无前缀 + 大写开头 | 页面专属   | 当前页面     |

**目录结构**：

```
src/
├── components/                    # 全局公共组件（C_前缀）
│   ├── global/
│   │   ├── C_Table/
│   │   │   ├── index.vue
│   │   │   ├── data.ts
│   │   │   └── index.scss
│   │   ├── C_Dialog/
│   │   └── C_Form/
│   └── local/                     # 局部全局组件（无前缀）
│       ├── c_actionModal/
│       └── c_formModal/
│
└── views/
    └── sale/                      # 销售域
        ├── components/            # 业务域组件（c_pascalCase）
        │   ├── c_orderTable/
        │   │   ├── index.vue
        │   │   ├── data.ts
        │   │   └── index.scss
        │   ├── c_customerForm/
        │   └── c_saleChart/
        │
        └── order/
            └── list/              # 页面功能
                ├── index.vue
                ├── data.ts
                ├── index.scss
                └── components/    # 页面私有组件（无前缀）
                    ├── SearchForm/
                    └── BatchImport/
```

### 7.2 组件职责划分

**1. 全局公共组件（C_前缀）**

**职责**：提供通用的、平台级的组件能力

**特征**：

- ✅ 无业务逻辑，纯展示或交互
- ✅ 高度可配置（通过 Props）
- ✅ 可在所有应用中使用
- ✅ 通过 `unplugin-vue-components` 自动导入

**示例**：

```vue
<!-- C_Table.vue - 全局表格组件 -->
<template>
  <el-table :data="data" v-bind="$attrs">
    <slot />
  </el-table>
</template>

<script setup lang="ts">
defineOptions({ name: "CTable" });

defineProps<{
  data: any[];
}>();
</script>
```

**使用**：

```vue
<template>
  <!-- 无需导入，自动识别 -->
  <C_Table :data="tableData">
    <el-table-column prop="name" label="姓名" />
  </C_Table>
</template>
```

**2. 业务域组件（c_前缀）**

**职责**：提供领域内共享的业务组件

**特征**：

- ✅ 包含业务逻辑
- ✅ 领域内复用（如订单表格、客户表单）
- ✅ 不跨领域使用
- ✅ 命名以 `c_` 开头，首字母小写

**示例**：

```vue
<!-- c_orderTable.vue - 订单表格组件 -->
<template>
  <C_Table :data="data">
    <el-table-column prop="orderNo" label="订单号" />
    <el-table-column prop="customerName" label="客户名称" />
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button @click="handleView(row)">查看</el-button>
        <el-button @click="handleEdit(row)">编辑</el-button>
      </template>
    </el-table-column>
  </C_Table>
</template>

<script setup lang="ts">
defineOptions({ name: "OrderTable" });

defineProps<{
  data: any[];
}>();

const emit = defineEmits<{
  (e: "view", row: any): void;
  (e: "edit", row: any): void;
}>();

const handleView = (row: any) => emit("view", row);
const handleEdit = (row: any) => emit("edit", row);
</script>
```

**使用**：

```vue
<template>
  <c_orderTable :data="tableData" @view="handleView" @edit="handleEdit" />
</template>

<script setup lang="ts">
import c_orderTable from "@/views/sale/components/c_orderTable";
</script>
```

**3. 页面私有组件（无前缀）**

**职责**：仅在当前页面使用的组件

**特征**：

- ✅ 紧密耦合页面逻辑
- ✅ 不被其他页面复用
- ✅ 无前缀，PascalCase 命名

**示例**：

```vue
<!-- SearchForm.vue - 订单列表搜索表单 -->
<template>
  <el-form :model="form" inline>
    <el-form-item label="订单号">
      <el-input v-model="form.orderNo" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
defineOptions({ name: "OrderSearchForm" });

const form = reactive({
  orderNo: "",
  customerName: ""
});

const emit = defineEmits<{
  (e: "search", form: any): void;
}>();

const handleSearch = () => emit("search", form);
</script>
```

### 7.3 组件通信模式

**1. Props / Emits（父子通信）**

```vue
<!-- 父组件 -->
<template>
  <OrderForm :data="formData" @submit="handleSubmit" />
</template>

<script setup lang="ts">
const formData = ref({});
const handleSubmit = (data: any) => {
  console.log("提交数据:", data);
};
</script>

<!-- 子组件 -->
<template>
  <el-form :model="data">
    <el-button @click="handleSubmit">提交</el-button>
  </el-form>
</template>

<script setup lang="ts">
const props = defineProps<{ data: any }>();
const emit = defineEmits<{ (e: "submit", data: any): void }>();

const handleSubmit = () => emit("submit", props.data);
</script>
```

**2. Provide / Inject（跨层级通信）**

```vue
<!-- 祖先组件 -->
<script setup lang="ts">
import { provide } from "vue";
provide("orderContext", { orderId: "12345" });
</script>

<!-- 后代组件 -->
<script setup lang="ts">
import { inject } from "vue";
const orderContext = inject("orderContext");
</script>
```

**3. Pinia Store（全局状态）**

```vue
<script setup lang="ts">
import { useOrderStore } from "@/stores/modules/order";
const orderStore = useOrderStore();

// 读取状态
console.log(orderStore.orderList);

// 修改状态
orderStore.setCurrentOrder(order);
</script>
```

**4. EventBus（事件总线，慎用）**

```typescript
// eventBus.ts
import mitt from "mitt";
export const eventBus = mitt();

// 组件 A
eventBus.emit("order:updated", { orderId: "12345" });

// 组件 B
eventBus.on("order:updated", (data) => {
  console.log("订单更新:", data);
});
```

---

## 8. 代码组织规范

### 8.1 文件命名规范

| 类型         | 命名方式         | 示例                  | 说明                      |
| ------------ | ---------------- | --------------------- | ------------------------- |
| **页面组件** | `index.vue`      | `index.vue`           | 统一使用 index 作为主入口 |
| **数据逻辑** | `data.ts`        | `data.ts`             | 存放数据定义、接口调用    |
| **样式文件** | `index.scss`     | `index.scss`          | 页面专属样式              |
| **子组件**   | `PascalCase.vue` | `OrderForm.vue`       | 大驼峰命名                |
| **弹窗组件** | `modal.vue`      | `modal.vue`           | 统一命名为 modal          |
| **API 文件** | `kebab-case.ts`  | `order-api.ts`        | 小写+连字符               |
| **工具文件** | `kebab-case.ts`  | `format-util.ts`      | 小写+连字符               |
| **类型文件** | `kebab-case.ts`  | `order-types.ts`      | 小写+连字符               |

### 8.2 三文件分离模式

**为什么要分离文件？**

1. **职责分离**：视图(Vue)、逻辑(TS)、样式(SCSS)各司其职
2. **可维护性**：单个文件不超过 300 行，便于维护
3. **可复用性**：数据逻辑可以被多个组件复用
4. **团队协作**：不同成员可以同时编辑不同文件

**标准目录结构**：

```
src/views/
└── sale/
    └── order/
        └── list/              # 功能模块
            ├── index.vue      # 视图层（模板）
            ├── data.ts        # 数据逻辑层（响应式数据、API调用）
            ├── index.scss     # 样式层
            └── components/    # 页面私有组件
                ├── SearchForm.vue
                └── BatchImport.vue
```

**index.vue - 视图层**

```vue
<template>
  <div class="order-list-page">
    <el-card>
      <el-form :model="searchForm" inline>
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-table v-loading="loading" :data="tableData">
        <el-table-column prop="orderNo" label="订单号" />
        <el-table-column prop="customerName" label="客户名称" />
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        @current-change="handleSearch"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import {
  searchForm,
  tableData,
  pagination,
  loading,
  fetchList,
  handleSearch
} from "./data";

onMounted(() => {
  fetchList();
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
```

**data.ts - 数据逻辑层**

```typescript
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { getOrderListApi } from "@/api/order";

// 搜索表单
export const searchForm = reactive({
  orderNo: "",
  customerName: ""
});

// 表格数据
export const tableData = ref([]);
export const loading = ref(false);

// 分页
export const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
});

// 获取列表
export const fetchList = async () => {
  loading.value = true;
  try {
    const res = await getOrderListApi({
      ...searchForm,
      page: pagination.page,
      pageSize: pagination.pageSize
    });
    tableData.value = res.data.records;
    pagination.total = res.data.total;
  } catch (error) {
    ElMessage.error("获取列表失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
export const handleSearch = () => {
  pagination.page = 1;
  fetchList();
};
```

**index.scss - 样式层**

```scss
.order-list-page {
  padding: 16px;
  background-color: #f5f5f5;

  .el-card {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
```

### 8.3 Vue 3 代码组织顺序

**标准顺序（9 个部分）**：

| 顺序 | 部分             | 包含内容                                      | 说明                       |
| ---- | ---------------- | --------------------------------------------- | -------------------------- |
| 1️⃣   | **类型定义**     | `interface`、`type`                           | TypeScript 类型定义        |
| 2️⃣   | **组件配置**     | `defineOptions`、`defineProps`、`defineEmits` | Vue 编译器宏               |
| 3️⃣   | **路由和 Store** | `useRoute`、`useRouter`、`useStore`           | 外部依赖                   |
| 4️⃣   | **响应式数据**   | `ref`、`reactive`                             | 组件状态数据               |
| 5️⃣   | **计算属性**     | `computed`                                    | 基于数据的衍生值           |
| 6️⃣   | **监听器**       | `watch`、`watchEffect`                        | 监听数据变化               |
| 7️⃣   | **生命周期**     | `onMounted`、`onBeforeUnmount` 等             | 组件生命周期钩子           |
| 8️⃣   | **方法定义**     | API 调用、事件处理、工具方法                  | 业务逻辑实现               |
| 9️⃣   | **暴露方法**     | `defineExpose`                                | 供父组件调用（可选）       |

**完整示例**：

```vue
<script setup lang="ts">
// ==================== 1. 类型定义 ====================
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

// ==================== 2. 组件配置 ====================
defineOptions({
  name: "SaleOrderList"
});

const props = defineProps<{
  orderId?: string;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", data: any): void;
  (e: "cancel"): void;
}>();

// ==================== 3. 路由和Store ====================
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// ==================== 4. 响应式数据 ====================
import { ref, reactive, computed } from "vue";

const loading = ref(false);
const tableData = ref<OrderItem[]>([]);

const formData = reactive({
  orderNo: "",
  customerName: ""
});

// ==================== 5. 计算属性 ====================
const totalAmount = computed(() => {
  return tableData.value.reduce((sum, item) => sum + item.quantity, 0);
});

// ==================== 6. 监听器 ====================
import { watch } from "vue";

watch(
  () => props.orderId,
  (newId) => {
    if (newId) {
      fetchOrderDetail(newId);
    }
  },
  { immediate: true }
);

// ==================== 7. 生命周期钩子 ====================
import { onMounted } from "vue";

onMounted(() => {
  fetchList();
});

// ==================== 8. 方法定义 ====================
const fetchList = async () => {
  loading.value = true;
  // ...
};

const handleSubmit = () => {
  emit("submit", formData);
};

// ==================== 9. 暴露方法 ====================
defineExpose({
  fetchList
});
</script>
```

---

## 9. API 层架构设计

### 9.1 配置化开发模式

**核心理念**：**"零 API 层"** - 通过配置直接调用基类方法

**传统模式 vs 配置化模式**：

```
┌─────────────────────────────────────────────────────────┐
│                   传统模式（3层）                         │
├─────────────────────────────────────────────────────────┤
│  View (index.vue)                                       │
│    ↓ 引用                                                │
│  Logic (data.ts)                                        │
│    ↓ 调用                                                │
│  API Layer (order-api.ts)  ← 需要维护                   │
│    ↓ 调用                                                │
│  HTTP Utils (@jhlc/common-core)                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 配置化模式（2层）                         │
├─────────────────────────────────────────────────────────┤
│  View (index.vue)                                       │
│    ↓ 引用                                                │
│  Logic + API Config (data.ts)  ← 配置 + 基类方法        │
│    ↓ 继承                                                │
│  AbstractPageQueryHook (@jhlc/common-core)              │
│    · getAction / postAction / putAction / deleteAction  │
│    · actionBatch / postBatch / putBatch / deleteBatch   │
└─────────────────────────────────────────────────────────┘
```

**优势**：

- ✅ **减少文件数量**：无需单独维护 API 层
- ✅ **代码更简洁**：配置驱动，减少重复代码
- ✅ **开发更高效**：专注业务逻辑，不关注 HTTP 封装
- ✅ **易于维护**：API 配置集中管理

### 9.2 AbstractPageQueryHook 基类

**基类概述**：

```typescript
import { AbstractPageQueryHook } from "@jhlc/common-core";

class PageQueryHook extends AbstractPageQueryHook {
  // 继承所有内置方法:
  // · getAction(url, params)       - GET 请求
  // · postAction(url, data)        - POST 请求
  // · putAction(url, data)         - PUT 请求
  // · deleteAction(url, data, params) - DELETE 请求
  // · actionBatch(...)              - 批量操作
  // · postBatch / putBatch / deleteBatch - 批量操作简写
}
```

**完整使用示例**：

```typescript
// data.ts
import { AbstractPageQueryHook } from "@jhlc/common-core";
import type { BaseFormItemDesc } from "@/types/jh4j-cloud";

// ==================== 1. API 配置 ====================
const API_CONFIG = {
  list: "/sale/order/list",
  get: "/sale/order/getById",
  save: "/sale/order/save",
  update: "/sale/order/update",
  remove: "/sale/order/remove",
  exportExcel: "/sale/order/export"
} as const;

// ==================== 2. 继承基类 ====================
export class OrderQueryHook extends AbstractPageQueryHook {
  constructor() {
    super();
    
    // 列表查询配置
    this.url.list = API_CONFIG.list;
    this.url.deleteBatch = API_CONFIG.remove;
    
    // 表格列配置
    this.columns = [
      { label: "订单号", prop: "orderNo", minWidth: "120" },
      { label: "客户名称", prop: "customerName", minWidth: "150" },
      { label: "订单金额", prop: "amount", minWidth: "120" },
      { label: "订单状态", prop: "status", minWidth: "100" }
    ];
    
    // 搜索表单配置
    this.searchFormItemDescArray = [
      { label: "订单号", prop: "orderNo", inputType: "input" },
      { label: "客户名称", prop: "customerName", inputType: "input" },
      { label: "订单状态", prop: "status", inputType: "select", dictCode: "order_status" }
    ];
  }
  
  // ==================== 3. 业务方法（直接使用基类方法） ====================
  
  // 新增
  async handleAdd(row: any) {
    await this.postAction(API_CONFIG.save, row);
    this.getTableList(); // 刷新列表
  }
  
  // 编辑
  async handleEdit(row: any) {
    await this.putAction(API_CONFIG.update, row);
    this.getTableList();
  }
  
  // 删除（单个）
  async handleDelete(row: any) {
    await this.deleteAction(API_CONFIG.remove, {}, { ids: [row.id] });
    this.getTableList();
  }
  
  // 批量删除
  async handleBatchDelete(ids: string[]) {
    await this.actionBatch(this.deleteAction, API_CONFIG.remove, "删除", ids);
    this.getTableList();
  }
  
  // 导出
  async handleExport() {
    await this.getAction(API_CONFIG.exportExcel, this.queryParam);
  }
  
  // 获取详情
  async fetchDetail(id: string) {
    const res = await this.getAction(API_CONFIG.get, { id });
    return res.data;
  }
}

// ==================== 4. 创建实例并导出 ====================
export function createPage() {
  return new OrderQueryHook();
}
```

**在 index.vue 中使用**：

```vue
<script setup lang="ts">
import { createPage } from "./data";

const pageHook = createPage();

// 自动调用基类的 getTableList 方法
onMounted(() => {
  pageHook.getTableList();
});
</script>
```

**详细文档**：[AbstractPageQueryHook 最佳实践](./page-query-hook-best-practices.md)

### 9.3 API 封装策略

**场景选择**：

| 场景                       | 推荐方式                          | 说明                             |
| -------------------------- | --------------------------------- | -------------------------------- |
| **标准 CRUD 页面**         | AbstractPageQueryHook 基类        | 列表页、表单页，配置化开发       |
| **复杂业务逻辑**           | 独立 API 文件 + 自定义方法        | 需要复杂数据处理、多步骤操作     |
| **多个页面共享 API**       | 独立 API 文件                     | 统一维护，便于复用               |
| **简单页面**               | 直接在 data.ts 中调用基类方法     | 无需单独 API 文件                |

**独立 API 文件示例**（复杂场景）：

```typescript
// src/api/order.ts
import request from "@jhlc/common-core/src/util/request";

/**
 * 获取订单列表
 */
export function getOrderListApi(params: any) {
  return request({
    url: "/sale/order/list",
    method: "get",
    params
  });
}

/**
 * 复杂业务：订单审批（多步骤）
 */
export async function approveOrderApi(orderId: string, approveData: any) {
  // 1. 校验订单状态
  const checkRes = await request({
    url: `/sale/order/checkStatus/${orderId}`,
    method: "get"
  });
  
  if (!checkRes.data.canApprove) {
    throw new Error("订单状态不允许审批");
  }
  
  // 2. 提交审批
  const res = await request({
    url: "/sale/order/approve",
    method: "post",
    data: { orderId, ...approveData }
  });
  
  // 3. 发送通知
  await request({
    url: "/sale/order/sendNotification",
    method: "post",
    data: { orderId, type: "approved" }
  });
  
  return res;
}
```

---

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


