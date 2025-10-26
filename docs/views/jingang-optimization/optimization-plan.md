# 晋钢集成 UI 项目全面优化执行方案

> **评估日期**: 2025 年 10 月 24 日  
> **项目规模**: 1676 个.vue 文件, 226MB 打包体积  
> **技术栈**: Vue 3.2.25 + Vite 4.4.9 + Element Plus 2.2.6 + TypeScript + Pinia

<AuthorTag author="CHENY" />

---

## 一、项目现状深度评估

### 1.1 代码质量现状

#### 已完成的优化

- **环境变量管理**: 已配置 `.env.dev`、`.env.uat`、`.env.prod` 三套环境
- **状态管理**: 已从 Vuex 迁移到 Pinia，使用持久化插件
- **TypeScript**: 已引入 TS，但覆盖率不完整（strict: false）
- **组合式函数**: 已有部分 hooks (`use-list-query.ts`, `use-form.ts` 等)
- **组件库**: 已引入 `@jhlc/*` 系列内部组件包

#### 待优化问题

**1. 代码风格不统一 - 高优先级**

```
- Options API组件: ~843个 (约50%)
- Composition API (script setup): ~833个 (约50%)
- Mixins使用: 大量使用，约2002行mixin代码
```

**2. Mixins 重度依赖 - 高优先级**

```javascript
// 当前Mixins列表 (src/mixins/)
- BaseMixins.ts (109行) - 基础工具方法
- ListMixins.js (338行) - 列表页核心逻辑
- ListModalMixins.js - 弹窗表单逻辑
- TreeListMixins.js - 树形列表逻辑
- Standard.js - 标准化方法
- TableMixins.js - 表格逻辑
```

**问题点**:

- 逻辑来源不清晰（this 上的属性来自哪里？）
- 命名冲突风险
- 类型推导困难
- 维护成本高

**3. 构建性能问题 - 中优先级**

```
- 打包体积: 226MB (过大)
- 依赖数量: 10530行 pnpm-lock.yaml
- 分包策略: 仅对 lodash 做了分包，不够细致
- 首屏加载: 未做深度优化
```

**4. 代码规范缺失 - 中优先级**

```
❌ 无 ESLint 配置
❌ 无 Prettier 配置
❌ 无 Git Hooks (husky)
❌ 无 commitlint
```

**5. TypeScript 配置松散 - 低优先级**

```json
{
  "strict": false,
  "noUnusedLocals": false,
  "noUnusedParameters": false
}
```

### 1.2 性能基准数据

| 指标              | 当前值  | 目标值  | 优先级 |
| ----------------- | ------- | ------- | ------ |
| 打包体积          | 226MB   | <160MB  | 高     |
| .vue 文件数       | 1676    | -       | -      |
| Mixins 代码量     | 2002 行 | 0 行    | 高     |
| Options API 组件  | ~843 个 | <200 个 | 中     |
| TypeScript 严格度 | 宽松    | 中等    | 低     |
| 代码规范          | 无      | 完整    | 高     |

### 1.3 依赖健康度分析

**核心依赖版本 (部分已过时)**

```json
{
  "vue": "~3.2.25", // ⚠️ 当前最新 3.5.x
  "vite": "4.4.9", // ⚠️ 当前最新 7.x (先保持4.x稳定)
  "element-plus": "2.2.6", // ⚠️ 当前最新 2.8.x
  "pinia": "~2.0.14", // ⚠️ 当前最新 2.2.x
  "vue-router": "^4.0.16" // ⚠️ 当前最新 4.4.x
}
```

**建议**: 内部项目特殊性，暂不升级大版本，仅修复安全漏洞

---

## 二、优化执行方案（渐进式、分阶段）

### 第一阶段：基础建设（1-2 周）优先级 ⭐⭐⭐⭐⭐

#### 1.1 代码规范体系搭建

**目标**: 统一代码风格，减少 Code Review 成本

**执行步骤**:

##### Step 1: ESLint + Prettier 配置

```bash
# 安装依赖
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
pnpm add -D eslint-plugin-vue
```

**.eslintrc.js**:

```javascript
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/typescript/recommended",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: 2021,
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  rules: {
    // 根据团队习惯定制
    "vue/multi-word-component-names": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};
```

**.prettierrc.js**:

```javascript
module.exports = {
  semi: true,
  singleQuote: true,
  printWidth: 100,
  trailingComma: "none",
  arrowParens: "avoid",
  endOfLine: "lf",
};
```

**package.json 添加脚本**:

```json
{
  "scripts": {
    "lint": "eslint src --ext .vue,.js,.ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{vue,js,ts,tsx,json,css,scss}\""
  }
}
```

##### Step 2: Git Hooks (可选，根据团队接受度)

```bash
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional
```

**由于内部项目特殊性，考虑先试点，不强制推行**

---

#### 1.2 环境变量优化

**目标**: 类型安全 + 统一访问

**当前问题**:

```typescript
// 散落在各处的环境变量使用
import.meta.env.BASE_URL + import.meta.env.MODE + "-api" + url;
```

**优化方案**:

##### Step 1: 完善类型定义

```typescript
// src/types/vite-env.d.ts
interface ImportMetaEnv {
  // 基础配置
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_ENV: "dev" | "uat" | "prod";

  // API配置
  readonly VITE_API_BASE_URL: string;

  // 第三方服务
  readonly VITE_ISM_MOBILE_URL: string;

  // 报表服务
  readonly ENV_ANY_REPORT_SERVER: string;
  readonly ENV_ANY_REPORT_SECRET_KEY: string;

  // 环境标识
  readonly ENV: "dev" | "uat" | "prod";
  readonly ENV_MOCK: "true" | "false";
}
```

##### Step 2: 创建统一配置访问层

```typescript
// src/config/env.config.ts
class EnvConfig {
  // 当前环境
  get env() {
    return import.meta.env.ENV || "dev";
  }

  // 是否开发环境
  get isDev() {
    return this.env === "dev";
  }

  // API基础路径
  get apiBaseUrl() {
    const mode = import.meta.env.MODE || "dev";
    return `/${mode}-api`;
  }

  // 完整API地址
  getApiUrl(path: string) {
    return `${this.apiBaseUrl}${path}`;
  }

}

export const envConfig = new EnvConfig();
export default envConfig;
```

##### Step 3: 迁移现有代码

```typescript
// ❌ 旧写法
let path =
  import.meta.env.BASE_URL +
  import.meta.env.MODE +
  "-api" +
  `/pms/attachment/download/${row.id}`;

// ✅ 新写法
import envConfig from "@/config/env.config";
let path = envConfig.getApiUrl(`/pms/attachment/download/${row.id}`);
```

**执行策略**:

- 第 1 周完成配置文件创建
- 第 2 周开始逐步迁移（非强制，新代码必须使用）

---

#### 1.3 Vite 构建优化

**目标**: 减少 30%打包体积，提升 20%构建速度

##### 优化 1: 细化分包策略

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue全家桶
          "vue-vendor": ["vue", "vue-router", "pinia"],

          // Element Plus
          "element-plus": ["element-plus", "@element-plus/icons-vue"],

          // 工具库
          lodash: ["lodash"],
          utils: ["axios", "dayjs", "qs"],

          // 图表相关
          echarts: ["echarts", "echarts-liquidfill"],

          // 编辑器相关 (大体积)
          editor: ["monaco-editor", "@vueup/vue-quill", "quill"],

          // 流程图相关 (大体积)
          diagram: ["@antv/x6", "@antv/layout", "@antv/x6-vue-shape"],

          // 内部组件库
          "jhlc-core": ["@jhlc/common-core", "@jhlc/platform"],
          "jhlc-comp": ["@jhlc/components", "@jhlc/jh-ui"],
        },
      },
    },

    // 代码压缩
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production",
      },
    },

    // chunk大小警告阈值
    chunkSizeWarningLimit: 1000,
  },
});
```

##### 优化 2: 开启压缩

```typescript
// vite.config.ts
import viteCompression from "vite-plugin-compression";

plugins: [
  // ...其他插件
  viteCompression({
    verbose: true,
    disable: false,
    threshold: 10240, // 10KB以上才压缩
    algorithm: "gzip",
    ext: ".gz",
    deleteOriginFile: false,
  }),
];
```

##### 优化 3: 图片资源优化

```typescript
// 安装图片优化插件
pnpm add -D vite-plugin-imagemin

// vite.config.ts
import viteImagemin from 'vite-plugin-imagemin'

plugins: [
  viteImagemin({
    gifsicle: { optimizationLevel: 3 },
    optipng: { optimizationLevel: 7 },
    mozjpeg: { quality: 80 },
    pngquant: { quality: [0.65, 0.9], speed: 4 },
    svgo: { plugins: [{ name: 'removeViewBox', active: false }] }
  })
]
```

##### 优化 4: 预构建配置

```typescript
export default defineConfig({
  optimizeDeps: {
    include: [
      "vue",
      "vue-router",
      "pinia",
      "element-plus",
      "lodash",
      "echarts",
      "axios",
    ],
  },
});
```

---

### 第二阶段：Mixins 迁移（2-3 周）优先级 ⭐⭐⭐⭐

#### 2.1 迁移策略

**原则**: 渐进式迁移，保证业务稳定

**优先级排序**:

1. **高频使用** (ListMixins, BaseMixins) - 第一批
2. **逻辑复杂** (TreeListMixins) - 第二批
3. **简单工具** (Standard) - 第三批

#### 2.2 ListMixins → useList 迁移示例

**原 Mixin (338 行)**:

```javascript
// src/mixins/ListMixins.js
export default {
  data() {
    return {
      loading: false,
      dataSource: [],
      page: { current: 1, size: 10, total: 0 },
      queryParam: {},
    };
  },
  methods: {
    async loadData(arg) {
      if (arg === 1) this.page.current = 1;
      this.loading = true;
      const params = this.getQueryParams();
      // ...
    },
    getQueryParams() {
      /* ... */
    },
    handleDelete() {
      /* ... */
    },
  },
};
```

**新 Composable**:

```typescript
// src/hooks/use-list.ts
import { ref, reactive } from "vue";
import { getAction, postAction, deleteAction } from "@/api/action";
import { ElMessage, ElMessageBox } from "element-plus";
import { filterObj } from "@/util/jh4j";

export interface UseListOptions<T = any> {
  // URL配置
  url: {
    list: string;
    delete?: string;
    deleteBatch?: string;
  };

  // 请求方式
  requestType?: "get" | "post";

  // 是否自动加载
  autoLoad?: boolean;

  // 初始查询参数
  initialQuery?: Record<string, any>;

  // 生命周期钩子
  beforeLoadData?: () => boolean | Promise<boolean>;
  afterLoadData?: (data: T[]) => void;
}

export function useList<T = any, Q = Record<string, any>>(
  options: UseListOptions<T>
) {
  const {
    url,
    requestType = "get",
    autoLoad = true,
    initialQuery = {},
    beforeLoadData,
    afterLoadData,
  } = options;

  // 响应式状态
  const loading = ref(false);
  const dataSource = ref<T[]>([]);
  const queryParam = reactive<Q>(initialQuery as Q);
  const page = reactive({
    current: 1,
    size: 10,
    pageSizeOptions: [10, 20, 30, 50],
    total: 0,
  });
  const selectedRowKeys = ref<string[]>([]);
  const selectionRows = ref<T[]>([]);

  // 获取查询参数
  const getQueryParams = () => {
    const params = {
      ...queryParam,
      current: page.current,
      size: page.size,
    };
    return filterObj(params);
  };

  // 加载数据
  const loadData = async (resetPage = false) => {
    if (!url.list) {
      ElMessage.warning("请设置url.list属性!");
      return;
    }

    // 前置钩子
    if (beforeLoadData) {
      const valid = await beforeLoadData();
      if (!valid) return;
    }

    if (resetPage) {
      page.current = 1;
    }

    loading.value = true;
    try {
      const params = getQueryParams();
      const action = requestType === "post" ? postAction : getAction;
      const res = await action(url.list, params);

      if (res.data?.page) {
        dataSource.value = res.data.page.records;
        page.total = res.data.page.total;
      } else {
        dataSource.value = res.data.records || res.data;
        page.total = res.data.total || 0;
      }

      // 后置钩子
      afterLoadData?.(dataSource.value);
    } catch (error) {
      console.error("加载数据失败:", error);
    } finally {
      loading.value = false;
    }
  };

  // 搜索
  const handleSearch = () => {
    loadData(true);
  };

  // 重置
  const handleReset = (formRef?: any) => {
    Object.keys(queryParam).forEach((key) => {
      queryParam[key] = undefined;
    });
    formRef?.resetFields();
    loadData(true);
  };

  // 删除单条
  const handleDelete = async (id: string) => {
    if (!url.delete) {
      ElMessage.warning("未配置删除接口");
      return;
    }

    try {
      await ElMessageBox.confirm("确认删除吗?", "提示", {
        type: "warning",
      });

      await deleteAction(url.delete, { id });
      ElMessage.success("删除成功");
      loadData();
    } catch (error) {
      if (error !== "cancel") {
        console.error("删除失败:", error);
      }
    }
  };

  // 批量删除
  const handleDeleteBatch = async () => {
    if (!url.deleteBatch) {
      ElMessage.warning("未配置批量删除接口");
      return;
    }

    if (selectedRowKeys.value.length === 0) {
      ElMessage.warning("请选择要删除的数据");
      return;
    }

    try {
      await ElMessageBox.confirm("确认删除选中数据吗?", "提示", {
        type: "warning",
      });

      await deleteAction(url.deleteBatch, {
        ids: selectedRowKeys.value.join(","),
      });
      ElMessage.success("删除成功");
      selectedRowKeys.value = [];
      selectionRows.value = [];
      loadData();
    } catch (error) {
      if (error !== "cancel") {
        console.error("批量删除失败:", error);
      }
    }
  };

  // 选择变化
  const onSelectChange = (keys: string[], rows: T[]) => {
    selectedRowKeys.value = keys;
    selectionRows.value = rows;
  };

  // 分页变化
  const handlePageChange = (current: number, size: number) => {
    page.current = current;
    page.size = size;
    loadData();
  };

  // 自动加载
  if (autoLoad) {
    loadData();
  }

  return {
    // 状态
    loading,
    dataSource,
    queryParam,
    page,
    selectedRowKeys,
    selectionRows,

    // 方法
    loadData,
    handleSearch,
    handleReset,
    handleDelete,
    handleDeleteBatch,
    onSelectChange,
    handlePageChange,
    getQueryParams,
  };
}
```

#### 2.3 使用示例对比

**旧写法 (Options API + Mixin)**:

```vue
<script>
import ListMixins from "@/mixins/ListMixins";

export default {
  mixins: [ListMixins],
  data() {
    return {
      queryParam: { compid: "J02" },
      url: {
        list: "/cost/acctItem/list",
        delete: "/cost/acctItem/delete",
      },
    };
  },
  methods: {
    // 自定义逻辑
    handleCustomAction() {
      // this.loadData() // 来自mixin
    },
  },
};
</script>
```

**新写法 (Composition API)**:

```vue
<script setup lang="ts">
import { useList } from "@/hooks/use-list";

const {
  loading,
  dataSource,
  queryParam,
  page,
  loadData,
  handleSearch,
  handleReset,
  handleDelete,
} = useList({
  url: {
    list: "/cost/acctItem/list",
    delete: "/cost/acctItem/delete",
  },
  initialQuery: { compid: "J02" },
  afterLoadData: (data) => {
    console.log("数据加载完成", data.length);
  },
});

// 自定义逻辑
const handleCustomAction = () => {
  loadData(true);
};
</script>

<template>
  <el-table v-loading="loading" :data="dataSource">
    <!-- ... -->
  </el-table>
  <pagination
    :total="page.total"
    v-model:page="page.current"
    v-model:limit="page.size"
    @pagination="loadData"
  />
</template>
```

#### 2.4 其他 Mixins 迁移计划

##### BaseMixins → useBase

```typescript
// src/hooks/use-base.ts
export function useBase() {
  const allUserMap = ref({});

  const fetchAllUserMap = async () => {
    const res = await getUserMapData();
    allUserMap.value = res.data;
  };

  const resetForm = (formRef: any) => {
    formRef?.resetFields();
  };

  const initDict = async (strSn: string) => {
    // 字典初始化逻辑
  };

  return {
    allUserMap,
    fetchAllUserMap,
    resetForm,
    initDict,
  };
}
```

##### TreeListMixins → useTreeList

```typescript
// src/hooks/use-tree-list.ts
export function useTreeList(options: UseTreeListOptions) {
  const treeData = ref([]);
  const expandedKeys = ref<string[]>([]);

  const loadTreeData = async () => {
    // 树形数据加载逻辑
  };

  const handleNodeClick = (node: any) => {
    // 节点点击逻辑
  };

  return {
    treeData,
    expandedKeys,
    loadTreeData,
    handleNodeClick,
  };
}
```

#### 2.5 迁移执行计划

| 周次    | 目标                                            | 产出                  |
| ------- | ----------------------------------------------- | --------------------- |
| Week 1  | 编写 `useList` + 迁移 5 个页面试点              | useList.ts + 迁移文档 |
| Week 2  | 编写 `useBase`, `useForm` + 迁移 20 个页面      | 3 个 hooks            |
| Week 3  | 编写 `useTreeList`, `useModal` + 迁移 40 个页面 | 2 个 hooks            |
| Week 4+ | 批量迁移剩余页面 (非强制)                       | -                     |

**策略**:

- ✅ 新页面必须使用 Composition API
- ⚠️ 旧页面改动时顺便迁移
- ❌ 不动的页面保持现状

---

### 第三阶段：组件封装优化（2-3 周）优先级 ⭐⭐⭐

#### 3.1 核心业务组件重构清单

**当前问题**:

- 部分组件仍使用 Options API
- 缺乏统一的 ProTable、ProForm 组件
- 组件 props 定义不够规范

**目标组件**:

1. ✅ **ProTable** - 高级表格组件 (已有 base-table,需优化)
2. 🆕 **ProForm** - 表单组件
3. 🆕 **ProSearch** - 搜索组件
4. 🆕 **ProModal** - 弹窗组件
5. ✅ **ProUpload** - 上传组件 (已有 FileUpload)
6. 🆕 **ProIcon** - 图标组件

#### 3.2 ProTable 优化示例

**目标**: 减少 90%重复代码

**原使用方式** (每个页面都要写):

```vue
<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="名称">
        <el-input v-model="queryParam.name" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="toolbar">
      <el-button @click="handleAdd">新增</el-button>
      <el-button @click="handleDelete">删除</el-button>
    </div>

    <el-table :data="dataSource" v-loading="loading">
      <el-table-column type="selection" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="编码" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="handleEdit(row)">编辑</el-button>
          <el-button @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination ... />
  </div>
</template>

<script setup>
// 200+行重复逻辑
</script>
```

**新封装后的使用方式**:

```vue
<script setup lang="ts">
import ProTable from "@/components/ProTable/index.vue";

const columns = [
  { type: "selection" },
  { prop: "name", label: "名称" },
  { prop: "code", label: "编码" },
  {
    prop: "status",
    label: "状态",
    formatter: (row) => (row.status === 1 ? "启用" : "禁用"),
  },
];

const searchFields = [
  { prop: "name", label: "名称", type: "input" },
  {
    prop: "status",
    label: "状态",
    type: "select",
    options: [
      { label: "启用", value: 1 },
      { label: "禁用", value: 0 },
    ],
  },
];

const toolbarButtons = [
  { label: "新增", type: "primary", icon: "Plus", onClick: handleAdd },
  {
    label: "批量删除",
    type: "danger",
    icon: "Delete",
    onClick: handleDeleteBatch,
  },
];

const actions = [
  { label: "编辑", type: "primary", onClick: handleEdit },
  { label: "删除", type: "danger", onClick: handleDelete },
];

const handleAdd = () => {
  /* ... */
};
const handleEdit = (row) => {
  /* ... */
};
const handleDelete = (row) => {
  /* ... */
};
const handleDeleteBatch = () => {
  /* ... */
};
</script>

<template>
  <ProTable
    :url="{ list: '/cost/acctItem/list', delete: '/cost/acctItem/delete' }"
    :columns="columns"
    :search-fields="searchFields"
    :toolbar-buttons="toolbarButtons"
    :actions="actions"
  />
</template>
```

**减少代码量**: 从 ~200 行 → ~40 行 (80%减少)

---

### 第四阶段：性能优化（1-2 周）优先级 ⭐⭐⭐⭐

#### 4.1 首屏加载优化

##### 优化 1: 路由懒加载分组

```typescript
// src/router/index.ts

// ❌ 旧写法 - 所有模块打包到一起
const User = () => import("@/views/user/index.vue");

// ✅ 新写法 - 按业务模块分组
const routes = [
  {
    path: "/cost",
    children: [
      {
        path: "account",
        component: () =>
          import(
            /* webpackChunkName: "cost-account" */
            "@/views/cost/account/index.vue"
          ),
      },
    ],
  },
  {
    path: "/tms",
    children: [
      {
        path: "transport",
        component: () =>
          import(
            /* webpackChunkName: "tms-transport" */
            "@/views/tms/transport/index.vue"
          ),
      },
    ],
  },
];
```

##### 优化 2: 组件异步化

```vue
<script setup>
import { defineAsyncComponent } from "vue";

// 重型组件异步加载
const EchartsChart = defineAsyncComponent(() =>
  import("@/components/EchartsChart/index.vue")
);

const MonacoEditor = defineAsyncComponent(() =>
  import("@/components/MonacoEditor/index.vue")
);
</script>

<template>
  <div>
    <!-- 首屏不需要的组件延迟加载 -->
    <EchartsChart v-if="showChart" />
  </div>
</template>
```

##### 优化 3: 图片懒加载

```vue
<script setup>
import { useIntersectionObserver } from "@vueuse/core";

const imgRef = ref();
const isVisible = ref(false);

useIntersectionObserver(imgRef, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    isVisible.value = true;
  }
});
</script>

<template>
  <img ref="imgRef" :src="isVisible ? realSrc : placeholderSrc" />
</template>
```

#### 4.2 运行时性能优化

##### 优化 1: 大数据列表虚拟滚动

```vue
<script setup>
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

const items = ref([]); // 10000+条数据
</script>

<template>
  <RecycleScroller
    :items="items"
    :item-size="50"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="item">{{ item.name }}</div>
  </RecycleScroller>
</template>
```

##### 优化 2: 响应式优化

```typescript
import { shallowRef, shallowReactive } from 'vue'

// ❌ 深度响应式 - 大数据性能差
const bigData = ref([...10000条数据])

// ✅ 浅响应式 - 只监听第一层
const bigData = shallowRef([...10000条数据])

// ✅ 标记为只读
const config = readonly({ ...大配置对象 })
```

##### 优化 3: v-memo 优化列表渲染 (Vue 3.2+)

```vue
<template>
  <div v-for="item in list" :key="item.id" v-memo="[item.id, item.status]">
    <!-- 只有 item.id 或 item.status 变化时才重新渲染 -->
    <span>{{ item.name }}</span>
    <span>{{ item.status }}</span>
  </div>
</template>
```

---

### 第五阶段：开发体验优化（1 周）优先级 ⭐⭐

#### 5.1 VSCode 配置共享

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

```json
// .vscode/extensions.json
{
  "recommendations": [
    "vue.volar",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "antfu.iconify"
  ]
}
```

#### 5.2 代码片段 (Snippets)

```json
// .vscode/vue3-snippets.code-snippets
{
  "Vue3 Setup Component": {
    "scope": "vue",
    "prefix": "v3s",
    "body": [
      "<script setup lang=\"ts\">",
      "import { ref } from 'vue'",
      "",
      "$1",
      "</script>",
      "",
      "<template>",
      "  <div>",
      "    $2",
      "  </div>",
      "</template>",
      "",
      "<style scoped>",
      "$3",
      "</style>"
    ]
  },

  "Use List Hook": {
    "scope": "typescript,javascript",
    "prefix": "uselist",
    "body": [
      "const {",
      "  loading,",
      "  dataSource,",
      "  queryParam,",
      "  page,",
      "  loadData,",
      "  handleSearch,",
      "  handleReset",
      "} = useList({",
      "  url: {",
      "    list: '$1'",
      "  }",
      "})"
    ]
  }
}
```

#### 5.3 脚手架工具 (可选)

```javascript
// scripts/create-page.js
// 快速生成页面模板
// 使用: npm run create:page -- --name=UserManage --module=system
```

---

## 三、度量指标与校验标准

### 3.1 性能指标

| 指标          | 当前   | 目标   | 验收标准    |
| ------------- | ------ | ------ | ----------- |
| 打包体积      | 226MB  | <160MB | 减少 30%    |
| 首屏 FCP      | 未测   | <1.8s  | Lighthouse  |
| 首屏 LCP      | 未测   | <2.5s  | Lighthouse  |
| 首屏 TTI      | 未测   | <3.8s  | Lighthouse  |
| 主 chunk 大小 | 未优化 | <500KB | Rollup 分析 |

### 3.2 代码质量指标

| 指标                 | 当前    | 目标 | 验收标准      |
| -------------------- | ------- | ---- | ------------- |
| Mixins 使用量        | 2002 行 | 0 行 | 完全迁移      |
| Composition API 占比 | 50%     | >80% | 新代码 100%   |
| ESLint 错误          | 未统计  | 0 个 | 无 error 级别 |
| TypeScript 覆盖率    | 中      | 高   | 新代码 100%TS |
| 组件复用率           | 未知    | >70% | 代码审查      |

### 3.3 开发效率指标

| 指标             | 当前    | 目标              |
| ---------------- | ------- | ----------------- |
| 新页面开发时间   | ~4 小时 | ~2 小时 (50%提升) |
| Bug 修复时间     | 未统计  | 减少 20%          |
| Code Review 耗时 | 未统计  | 减少 30%          |

---

## 四、执行时间表

```
第1-2周 (基础建设)
├─ Week 1
│  ├─ ESLint/Prettier配置
│  ├─ 环境变量类型定义
│  └─ Vite分包优化
│
└─ Week 2
   ├─ 环境变量统一访问层
   ├─ 压缩/图片优化配置
   └─ VSCode配置共享

第3-5周 (Mixins迁移)
├─ Week 3
│  ├─ useList编写
│  ├─ useBase编写
│  └─ 5个页面试点迁移
│
├─ Week 4
│  ├─ useForm/useModal编写
│  └─ 20个页面迁移
│
└─ Week 5
   ├─ useTreeList编写
   └─ 40个页面迁移

第6-8周 (组件封装)
├─ Week 6
│  ├─ ProTable重构
│  └─ ProSearch封装
│
├─ Week 7
│  ├─ ProForm封装
│  └─ ProModal封装
│
└─ Week 8
   └─ 组件文档编写

第9-10周 (性能优化)
├─ Week 9
│  ├─ 路由懒加载优化
│  ├─ 组件异步化
│  └─ 虚拟滚动实践
│
└─ Week 10
   ├─ 响应式优化
   ├─ 打包体积分析
   └─ 性能测试

第11周 (收尾)
└─ 文档完善 + 引导讲解
```

---

## 五、风险控制

### 5.1 技术风险

| 风险                    | 影响 | 应对措施            |
| ----------------------- | ---- | ------------------- |
| Mixins 迁移破坏现有功能 | 高   | 渐进式迁移+完整测试 |
| 打包体积优化失败        | 中   | 保留回滚方案        |
| 新组件学习成本高        | 中   | 完善文档+内部培训   |

### 5.2 进度风险

**应对策略**:

- 采用渐进式优化，不做大规模重构
- 每周 review 进度，及时调整
- 优先保证业务稳定性

### 5.3 回滚机制

```bash
# Git分支策略
main (生产)
├─ develop (开发)
│  ├─ feature/optimization-phase1 (第一阶段)
│  ├─ feature/optimization-phase2 (第二阶段)
│  └─ feature/optimization-phase3 (第三阶段)
```

---

## 六、补充的一些考虑

### 6.1 性能监控体系

```typescript
// src/util/performance-monitor.ts
export class PerformanceMonitor {
  // 监控首屏加载时间
  static measureFCP() {
    /* ... */
  }

  // 监控路由切换耗时
  static measureRouteChange() {
    /* ... */
  }

  // 监控接口耗时
  static measureAPI() {
    /* ... */
  }
}
```

### 6.2 错误边界

```vue
<!-- src/components/ErrorBoundary/index.vue -->
<script setup>
import { onErrorCaptured } from "vue";

onErrorCaptured((err, instance, info) => {
  console.error("组件错误:", err, info);
  // 上报错误到监控平台
  return false;
});
</script>
```


### 6.4 长期规划考虑（需平台伙伴配合）


- 升级到 Vue 3.5+ (性能提升 40%~50%)
- 升级 vite 7
- 升级 pinia 
- 微前端架构深化 (平台已有 Module Federation 基础)

---

## 七、执行检查清单

### Phase 1: 基础建设

- [ ] ESLint 配置完成
- [ ] Prettier 配置完成
- [ ] 环境变量类型定义
- [ ] 环境变量统一访问层
- [ ] Vite 分包优化
- [ ] Gzip 压缩配置
- [ ] VSCode 配置共享

### Phase 2: Mixins 迁移

- [ ] useList 编写完成
- [ ] useBase 编写完成
- [ ] useForm 编写完成
- [ ] useModal 编写完成
- [ ] useTreeList 编写完成
- [ ] 迁移文档编写
- [ ] 50+页面完成迁移

### Phase 3: 组件封装

- [ ] ProTable 重构
- [ ] ProForm 封装
- [ ] ProSearch 封装
- [ ] ProModal 封装
- [ ] 组件使用文档

### Phase 4: 性能优化

- [ ] 路由懒加载优化
- [ ] 组件异步化
- [ ] 图片懒加载
- [ ] 虚拟滚动应用
- [ ] 响应式优化
- [ ] 性能测试通过

### Phase 5: 开发体验

- [ ] 代码片段配置
- [ ] 自动化脚本
- [ ] 团队培训完成
- [ ] 技术文档完善

---

## 八、团队协作建议（新项目后补）

### 8.1 知识分享

<!-- - **每周五下午**: 技术分享会 (30 分钟)
- **每两周**: 代码 Review 会议
- **建立内部 Wiki**: 最佳实践文档库 -->

### 8.2 Code Review 规范

```
PR标题格式: [类型] 简短描述
- feat: 新功能
- fix: Bug修复
- refactor: 重构
- perf: 性能优化
- docs: 文档更新

示例: [refactor] 迁移UserManage页面到Composition API
```

### 8.3 开发规范

1. **新页面**: 必须使用 `<script setup>` + TypeScript
2. **新组件**: 必须编写 props 类型定义
3. **新接口**: 必须使用统一包的`jh*`的 request 封装
4. **新样式**: 优先使用 Scss、UnoCSS

---

## 总结

### 优化优先级排序

1. **P0 (立即执行)**:

   - ESLint/Prettier 配置
   - Vite 分包优化
   - 环境变量类型定义

2. **P1 (2 周内)**:

   - useList 编写
   - 首批页面 Mixins 迁移
   - ProTable 优化

3. **P2 (1 个月内)**:

   - 全面 Mixins 迁移
   - 组件封装完善
   - 性能优化实施

4. **P3 (长期优化)**:
   - 依赖升级 (谨慎)
   - CI/CD 完善
   - 测试覆盖

### 预期收益

 **用户体验**: 首屏加载速度提升 
 **开发效率**: 新页面开发时间减少 
 **代码质量**: 可维护性提升 
 **团队协作**: 效率提升

---

**具体行动**: 按照执行过程，动态调整执行优先级和时间表，也可以根据反馈针对调整。
