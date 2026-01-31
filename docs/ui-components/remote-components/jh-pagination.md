# jh-pagination - 分页组件

> 平台统一的分页组件，封装常用分页交互与样式，适用于列表、表格等需要分页的场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-pagination />`。

---

## 基本用法

### 1️⃣ 基本分页（最常用）

```vue
<template>
  <jh-pagination
    v-model:page="pageParams.page"
    v-model:size="pageParams.size"
    :total="total"
    @change="getList"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const pageParams = ref({
  page: 1,
  size: 10,
});

const total = ref(0);

const getList = async () => {
  const res = await request({
    url: "/api/list",
    params: {
      page: pageParams.value.page,
      size: pageParams.value.size,
    },
  });
  total.value = res.data.total;
};
</script>
```

---

## Props 属性

| 参数                | 说明           | 类型       | 默认值                                      |
| ------------------- | -------------- | ---------- | ------------------------------------------- |
| page / v-model:page | 当前页码       | `number`   | `1`                                         |
| size / v-model:size | 每页条数       | `number`   | `10`                                        |
| total               | 总条数         | `number`   | `0`                                         |
| pageSizes           | 每页条数选项   | `number[]` | `[10, 20, 50, 100]`                         |
| layout              | 布局           | `string`   | `"total, sizes, prev, pager, next, jumper"` |
| background          | 是否显示背景色 | `boolean`  | `true`                                      |
| disabled            | 是否禁用       | `boolean`  | `false`                                     |

---

## Events 事件

| 事件名      | 说明               | 回调参数                 |
| ----------- | ------------------ | ------------------------ |
| update:page | page 更新时触发    | `(page: number) => void` |
| update:size | size 更新时触发    | `(size: number) => void` |
| change      | 分页参数改变时触发 | `(page, size) => void`   |

---

## 常见场景

### 场景 1：表格分页（推荐）

```vue
<el-table :data="tableData" />

<jh-pagination
  v-model:page="pageParams.page"
  v-model:size="pageParams.size"
  :total="total"
  @change="getList"
/>
```

---

### 场景 2：BaseTable 自动分页（推荐）

```vue
<BaseTable
  ref="tableRef"
  :columns="columns"
  :api="api.getList"
  :auto-request="true"
/>
```

BaseTable 内置 jh-pagination，无需手动配置

---

### 场景 3：自定义每页条数选项

```vue
<jh-pagination
  v-model:page="pageParams.page"
  v-model:size="pageParams.size"
  :total="total"
  :page-sizes="[5, 10, 20, 50]"
  @change="getList"
/>
```

---

### 场景 4：简洁布局（只显示页码）

```vue
<jh-pagination
  v-model:page="pageParams.page"
  :total="total"
  layout="prev, pager, next"
  @change="getList"
/>
```

---

## 与 el-pagination 对比

### 使用 jh-pagination（推荐）

```vue
<jh-pagination
  v-model:page="page"
  v-model:size="size"
  :total="total"
  @change="getList"
/>
```

✅ 统一默认配置  
✅ 简化使用  
✅ 风格一致  
✅ 双向绑定

### 使用 el-pagination（不推荐）

```vue
<el-pagination
  v-model:current-page="page"
  v-model:page-size="size"
  :total="total"
  :page-sizes="[10, 20, 50, 100]"
  layout="total, sizes, prev, pager, next, jumper"
  background
  @current-change="handlePageChange"
  @size-change="handleSizeChange"
/>
```

❌ 配置繁琐  
❌ 事件名不统一  
❌ 每处都要重复配置

---

## 最佳实践

### 1️⃣ 使用 v-model 双向绑定（推荐）

```vue
<jh-pagination
  v-model:page="pageParams.page"
  v-model:size="pageParams.size"
  :total="total"
  @change="getList"
/>
```

---

### 2️⃣ 监听 change 事件刷新列表（推荐）

```ts
const getList = async () => {
  const res = await request({
    url: "/api/list",
    params: {
      page: pageParams.value.page,
      size: pageParams.value.size,
    },
  });
  tableData.value = res.data.list;
  total.value = res.data.total;
};
```

---

### 3️⃣ BaseTable 推荐使用自动分页

```vue
<BaseTable
  ref="tableRef"
  :columns="columns"
  :api="api.getList"
  :auto-request="true"
/>
```

BaseTable 内置分页功能，自动处理分页请求

---

### 4️⃣ 分页参数统一管理

```ts
const pageParams = reactive({
  page: 1,
  size: 10,
});

const resetPage = () => {
  pageParams.page = 1;
  getList();
};
```

---

## 注意事项

1. **page 从 1 开始**
   - 当前页码从 1 开始，不是 0

2. **total 必须设置**
   - 必须从接口返回的总数设置 total
   - 否则分页器无法正确显示

3. **change 事件刷新列表**
   - 监听 change 事件调用接口刷新数据
   - 或使用 watch 监听 pageParams

4. **查询条件改变时重置页码**
   - 搜索、筛选时应重置 page 为 1

---

## 🎯 真实项目示例

### 示例 1：列表分页

```vue
<template>
  <el-table :data="tableData" />

  <jh-pagination
    v-model:page="pageParams.page"
    v-model:size="pageParams.size"
    :total="total"
    @change="getList"
  />
</template>

<script setup lang="ts">
const pageParams = reactive({
  page: 1,
  size: 10,
});

const total = ref(0);
const tableData = ref([]);

const getList = async () => {
  const res = await request({
    url: "/api/list",
    params: pageParams,
  });
  tableData.value = res.data.list;
  total.value = res.data.total;
};

onMounted(() => {
  getList();
});
</script>
```

### 示例 2：BaseTable 自动分页

```vue
<BaseTable
  ref="tableRef"
  :columns="columns"
  :api="api.getList"
  :auto-request="true"
/>
```

---

## 🚀 快速开始

1. 使用 `v-model:page` 和 `v-model:size` 绑定分页参数
2. 设置 `:total` 总条数
3. 监听 `@change` 事件刷新列表
4. 推荐使用 BaseTable 自动分页功能

**推荐作为平台统一的分页组件使用！** - 分页组件

> 基于 Element Plus Pagination 封装的统一分页组件，提供 `currentPage` / `pageSize` 的驼峰 API 和统一样式。

已全局注册，可直接使用 `<jh-pagination />`。

```vue
<jh-pagination
  v-model:currentPage="page.current"
  v-model:pageSize="page.size"
  :total="page.total"
/>
```
