# 组件设计与 API 层架构

> C_ 组件体系、AbstractPageQueryHook 基类与 MAxios 封装——页面与数据之间的全部约定。

<AuthorTag :authors="['ZhuXiang','CHENY','ZhongYu','XuQingYu','MaJiaRui']" />

> 本文是 [架构设计总览](../architecture) 的专项页，章节编号与总览保持一致。

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

**详细文档**：见上文 [9.2 AbstractPageQueryHook 基类](#_9-2-abstractpagequeryhook-基类)（独立最佳实践文档规划中）

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
