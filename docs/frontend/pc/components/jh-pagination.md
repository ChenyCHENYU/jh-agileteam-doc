# jh-pagination - 分页组件

> 平台统一的分页组件，封装常用分页交互与样式，适用于列表、表格等需要分页的场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

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
    v-model:currentPage="pageParams.current"
    v-model:pageSize="pageParams.size"
    :total="total"
    @current-change="getList"
    @size-change="handleSizeChange"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const pageParams = ref({
  current: 1,
  size: 10,
});

const total = ref(0);

const getList = async () => {
  const res = await request({
    url: "/api/list",
    params: {
      current: pageParams.value.current,
      size: pageParams.value.size,
    },
  });
  total.value = res.data.total;
};

const handleSizeChange = () => {
  pageParams.value.current = 1;
  getList();
};
</script>
```

---

## Props 属性

**基础**

| 参数                              | 说明                                           | 类型       | 默认值                     |
| --------------------------------- | ---------------------------------------------- | ---------- | -------------------------- |
| small                             | 小型分页器                                     | `boolean`  | `true`                     |
| pageSizes                         | 分页选项                                       | `number[]` | `[10,20,30,50,99,199,999]` |
| `""`（接口快速配置，name 为空）   | 接口快速配置                                   | `string`   | -                          |
| simple                            | 简洁版                                         | `boolean`  | `false`                    |
| showTotal                         | 显示总条数                                     | `boolean`  | `true`                     |
| total                             | 数据总数                                       | `number`   | -                          |
| showPageSize                      | 显示每页条数                                   | `boolean`  | `true`                     |
| pageSize / v-model:pageSize       | 每页条数                                       | `number`   | `10`                       |
| showJumper                        | 显示跳转输入                                   | `boolean`  | `true`                     |
| showPager                         | 显示跳转输入                                   | `boolean`  | `true`                     |
| currentPage / v-model:currentPage | 默认页码（配置表格的初始页码）                 | `number`   | `1`                        |
| hideOnSinglePage                  | 一页隐藏（当只有一页数据时不显示分页器）       | `boolean`  | `false`                    |
| disabled                          | 禁用                                           | `boolean`  | `false`                    |
| pagerCount                        | 页码按钮数                                     | `number`   | `5`                        |

> ⚠️ **没有 `page`/`size`/`background` 属性**。页码用 `currentPage`，每页条数用 `pageSize`（均为驼峰），与 el-pagination 原生命名一致。

---

## Events 事件

| 事件名               | 说明               | 回调参数                 |
| -------------------- | ------------------ | ------------------------ |
| update:currentPage   | 当前页码更新时触发 | `(page: number) => void` |
| update:pageSize      | 每页条数更新时触发 | `(size: number) => void` |
| current-change       | 页码改变时触发     | `(page: number) => void` |
| size-change          | 每页条数改变时触发 | `(size: number) => void` |
| prev-click           | 上一页时触发       | `(page: number) => void` |
| next-click           | 下一页时触发       | `(page: number) => void` |

> ⚠️ **没有 `change` 事件**。页码变化监听 `@current-change`，每页条数变化监听 `@size-change`。

---

## 常见场景

### 场景 1：表格分页（推荐）

```vue
<el-table :data="tableData" />

<jh-pagination
  v-model:currentPage="pageParams.current"
  v-model:pageSize="pageParams.size"
  :total="total"
  @current-change="getList"
  @size-change="getList"
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

BaseTable 内置 jh-pagination，无需手动配置。

---

### 场景 3：自定义每页条数选项

```vue
<jh-pagination
  v-model:currentPage="pageParams.current"
  v-model:pageSize="pageParams.size"
  :total="total"
  :page-sizes="[5, 10, 20, 50]"
  @current-change="getList"
  @size-change="getList"
/>
```

---

## 最佳实践

### 1️⃣ 使用 v-model 双向绑定（推荐）

```vue
<jh-pagination
  v-model:currentPage="pageParams.current"
  v-model:pageSize="pageParams.size"
  :total="total"
  @current-change="getList"
  @size-change="handleSizeChange"
/>
```

---

### 2️⃣ size-change 时重置页码

```ts
const handleSizeChange = () => {
  pageParams.current = 1; // 切换每页条数后回到第一页
  getList();
};
```

---

## 注意事项

1. **页码从 1 开始**
   - 当前页码从 1 开始，不是 0

2. **total 必须设置**
   - 必须从接口返回的总数设置 total
   - 否则分页器无法正确显示

3. **查询条件改变时重置页码**
   - 搜索、筛选时应重置 `currentPage` 为 1

4. **没有 `background` 属性**
   - 分页背景样式由组件内置控制，无需手动配置

---

## 🎯 真实项目示例

```vue
<template>
  <el-table :data="tableData" />

  <jh-pagination
    v-model:currentPage="pageParams.current"
    v-model:pageSize="pageParams.size"
    :total="total"
    @current-change="getList"
    @size-change="getList"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";

const pageParams = reactive({
  current: 1,
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

**推荐作为平台统一的分页组件使用！**
