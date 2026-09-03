# 领域驱动与代码组织

> DDD 分层模型与 9 段式代码组织——页面的骨架从哪里来。

<AuthorTag :authors="['ZhuXiang','CHENY','ZhongYu','XuQingYu','MaJiaRui']" />

> 本文是 [架构设计总览](../architecture) 的专项页，章节编号与总览保持一致。

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
