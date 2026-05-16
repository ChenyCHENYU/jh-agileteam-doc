# jh-pagination - 分页组件

> 基于 Element Plus Pagination 封装的统一分页组件，提供标准化的分页交互和样式

## 📦 组件位置

```typescript
// 来自远程 common-core 包
import "@jhlc/common-core";
```

组件已在全局注册，无需手动导入，直接在模板中使用 `<jh-pagination>`。

## 基本用法

### 标准分页

```vue
<template>
  <div>
    <!-- 表格数据 -->
    <BaseTable :data="list" :columns="columns" />

    <!-- 分页组件 -->
    <jh-pagination
      v-show="page.total && page.total > 0"
      :total="page.total || 0"
      v-model:currentPage="page.current"
      v-model:pageSize="page.size"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const page = ref({
  current: 1,
  size: 10,
  total: 0
});

const list = ref([]);

// 加载数据
const loadData = async () => {
  const res = await request({
    url: "/api/list",
    method: "get",
    params: {
      page: page.value.current,
      size: page.value.size
    }
  });

  list.value = res.data.records;
  page.value.total = res.data.total;
};

// 页码变化
const handlePageChange = () => {
  loadData();
};

// 页大小变化
const handleSizeChange = () => {
  page.value.current = 1; // 重置到第一页
  loadData();
};

// 初始化
onMounted(() => {
  loadData();
});
</script>
```

## Props 属性

| 参数                  | 说明                     | 类型       | 默认值                                      |
| --------------------- | ------------------------ | ---------- | ------------------------------------------- |
| total                 | 总条目数                 | `number`   | `0`                                         |
| currentPage (v-model) | 当前页码                 | `number`   | `1`                                         |
| pageSize (v-model)    | 每页显示条数             | `number`   | `10`                                        |
| pageSizes             | 每页显示个数选择器的选项 | `number[]` | `[10, 20, 50, 100]`                         |
| layout                | 组件布局                 | `string`   | `"total, prev, pager, next, sizes, jumper"` |
| background            | 是否为分页按钮添加背景色 | `boolean`  | `true`                                      |
| disabled              | 是否禁用分页             | `boolean`  | `false`                                     |

## Events 事件

| 事件名             | 说明                  | 回调参数                 |
| ------------------ | --------------------- | ------------------------ |
| current-change     | 页码改变时触发        | `(page: number) => void` |
| size-change        | 页大小改变时触发      | `(size: number) => void` |
| update:currentPage | 页码变化（v-model）   | `(page: number) => void` |
| update:pageSize    | 页大小变化（v-model） | `(size: number) => void` |

## 常见场景

### 场景 1：列表页分页（推荐）

**适用**: 绝大多数列表页面

```vue
<template>
  <div class="app-container app-page-container">
    <BaseQuery :form="queryParam" :items="queryItems" @select="select" />
    <BaseToolbar :items="toolbars" />
    <BaseTable :data="list" :columns="columns" />

    <!-- 分页组件 -->
    <jh-pagination
      v-show="page.total && page.total > 0"
      :total="page.total || 0"
      v-model:currentPage="page.current"
      v-model:pageSize="page.size"
      @current-change="select"
      @size-change="select"
    />
  </div>
</template>

<script setup lang="ts">
import { createPage } from "./data";

const Page = createPage();
const { page, list, queryParam, queryItems, toolbars, columns, select } = Page;

onMounted(() => {
  select();
});
</script>
```

**说明**:

- ✅ 使用 `v-show` 在无数据时隐藏分页
- ✅ 使用 `v-model` 双向绑定页码和页大小
- ✅ 页码/页大小变化时统一调用 `select()` 刷新数据

---

### 场景 2：前端分页（本地数据）

**适用**: 数据量小，一次性加载全部数据后在前端分页

```vue
<template>
  <div>
    <!-- 显示分页后的数据 -->
    <BaseTable :data="paginatedData" :columns="columns" />

    <!-- 分页组件 -->
    <jh-pagination
      v-show="allData.length > 0"
      :total="allData.length"
      v-model:currentPage="currentPage"
      v-model:pageSize="pageSize"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const allData = ref([]); // 全部数据
const currentPage = ref(1);
const pageSize = ref(10);

// 计算属性：分页后的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return allData.value.slice(start, end);
});

// 加载全部数据
const loadAllData = async () => {
  const res = await request({
    url: "/api/all-data",
    method: "get"
  });
  allData.value = res.data;
};

onMounted(() => {
  loadAllData();
});
</script>
```

**说明**:

- ✅ `total` 使用全部数据的长度
- ✅ 使用 `computed` 计算当前页的数据
- ✅ 不需要监听事件（响应式自动处理）

---

### 场景 3：子表格分页

**适用**: 新增编辑页中的项次信息表格

```vue
<template>
  <div>
    <!-- 主表单区域 -->
    <c_formSections :sections="sectionsConfig" :form="form" />

    <!-- 项次信息表格 -->
    <el-card shadow="never" class="items-card">
      <BaseTable :data="itemData" :columns="itemColumns" />

      <!-- 项次分页 -->
      <div class="items-pagination">
        <jh-pagination
          v-show="itemTotal && itemTotal > 0"
          :total="itemTotal || 0"
          v-model:currentPage="itemPage"
          v-model:pageSize="itemSize"
          @current-change="loadItemData"
          @size-change="loadItemData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const form = ref({});
const itemData = ref([]);
const itemTotal = ref(0);
const itemPage = ref(1);
const itemSize = ref(10);

// 加载项次数据
const loadItemData = async () => {
  const res = await request({
    url: "/api/items/list",
    method: "get",
    params: {
      page: itemPage.value,
      size: itemSize.value
    }
  });
  itemData.value = res.data.records;
  itemTotal.value = res.data.total;
};

onMounted(() => {
  loadItemData();
});
</script>
```

**说明**:

- ✅ 子表格使用独立的分页状态
- ✅ 与主表单数据解耦
- ✅ 支持独立刷新

---

### 场景 4：无数据时自动隐藏

**推荐写法**:

```vue
<!-- ✅ 推荐：无数据时不显示 -->
<jh-pagination
  v-show="page.total && page.total > 0"
  :total="page.total || 0"
  v-model:currentPage="page.current"
  v-model:pageSize="page.size"
/>

<!-- ❌ 不推荐：始终显示（体验差） -->
<jh-pagination
  :total="page.total"
  v-model:currentPage="page.current"
  v-model:pageSize="page.size"
/>
```

**说明**:

- ✅ 使用 `v-show` 在 `total > 0` 时才显示
- ✅ 提升用户体验，避免空状态下显示分页

---

### 场景 5：自定义页大小选项

```vue
<jh-pagination
  :total="page.total"
  :page-sizes="[5, 10, 20, 50, 200]"
  v-model:currentPage="page.current"
  v-model:pageSize="page.size"
/>
```

**说明**:

- 根据业务需求自定义每页条数选项
- 默认为 `[10, 20, 50, 100]`

---

## 与 el-pagination 对比

### 使用 jh-pagination（推荐）

```vue
<jh-pagination
  v-show="page.total && page.total > 0"
  :total="page.total || 0"
  v-model:currentPage="page.current"
  v-model:pageSize="page.size"
  @current-change="select"
  @size-change="select"
/>
```

**优势**:

- ✅ **统一规范** - 全局统一的分页样式和交互
- ✅ **简化配置** - 无需配置 layout、background 等（内置默认值）
- ✅ **驼峰命名** - 使用 `currentPage`、`pageSize`（符合 Vue 规范）
- ✅ **自动样式** - 内置统一的边距、居中、背景色

### 使用 el-pagination（不推荐）

```vue
<el-pagination
  v-model:current-page="page.current"
  v-model:page-size="page.size"
  :page-sizes="[10, 20, 50, 100]"
  :total="page.total"
  layout="total, prev, pager, next, sizes, jumper"
  background
  @current-change="select"
  @size-change="select"
/>
```

**劣势**:

- ❌ **配置繁琐** - 需要手动配置 layout、page-sizes、background
- ❌ **样式不统一** - 每个页面可能配置不同
- ❌ **命名不一致** - 使用 `current-page`（中划线命名）

---

## 💡 最佳实践

### 1. 统一使用 jh-pagination

**推荐**:

```vue
<jh-pagination ... />
```

**不推荐**:

```vue
<el-pagination ... />
```

### 2. 始终添加 v-show

```vue
<!-- ✅ 推荐 -->
<jh-pagination
  v-show="page.total && page.total > 0"
  :total="page.total || 0"
  ...
/>
```

### 3. 使用 v-model 双向绑定

```vue
<!-- ✅ 推荐：v-model 双向绑定 -->
<jh-pagination
  v-model:currentPage="page.current"
  v-model:pageSize="page.size"
/>

<!-- ❌ 不推荐：单向绑定 + 事件手动更新 -->
<jh-pagination
  :current-page="page.current"
  :page-size="page.size"
  @update:currentPage="page.current = $event"
  @update:pageSize="page.size = $event"
/>
```

### 4. 页大小变化时重置页码

```typescript
const handleSizeChange = () => {
  page.value.current = 1; // 重置到第一页
  loadData();
};
```

### 5. 配合 Page Hook 使用

```typescript
// data.ts
export function createPage() {
  return new (class extends AbstractPageQueryHook {
    // ... Hook 内置分页逻辑
  })();
}

// index.vue
const Page = createPage();
const { page, select } = Page;
```

**说明**:

- ✅ Page Hook 内置分页状态管理
- ✅ `select()` 方法自动读取 page 状态
- ✅ 减少手动管理分页的代码

---

## 🎯 真实项目示例

### 示例 1：内贸订单列表页

**路径**: `src/views/sale/demo/domestic-trade-order/index.vue`

```vue
<jh-pagination
  v-show="page.total && page.total > 0"
  :total="page.total || 0"
  v-model:currentPage="page.current"
  v-model:pageSize="page.size"
  @current-change="select"
  @size-change="select"
/>
```

### 示例 2：新增编辑页项次分页

**路径**: `src/views/sale/demo/add-demo/index.vue`

```vue
<jh-pagination
  v-show="itemTotal && itemTotal > 0"
  :total="itemTotal || 0"
  v-model:currentPage="currentPage"
  v-model:pageSize="pageSize"
  @current-change="refreshItemData"
  @size-change="refreshItemData"
/>
```

---

## ⚠️ 注意事项

1. **组件来自远程包**

   - 组件由 `@jhlc/common-core` 提供
   - 已全局注册，无需手动导入
   - 升级远程包时注意版本兼容性

2. **页码从 1 开始**

   - `currentPage` 最小值为 1
   - 后端接口通常也是从 1 开始

3. **total 必须准确**

   - `total` 应该是数据总数，不是当前页数据量
   - 后端通常返回 `{ records: [], total: 100 }`

4. **事件处理**

   - `current-change` 在页码变化时触发
   - `size-change` 在页大小变化时触发
   - 两个事件通常调用同一个刷新方法

5. **样式定制**
   - 如需特殊样式，可通过 CSS 覆盖
   - 不要修改远程组件源码

---

## 🚀 快速开始

1. **在列表页使用**：复制"场景 1"代码
2. **在详情页使用**：复制"场景 3"代码
3. **前端分页**：复制"场景 2"代码

**推荐作为项目统一的分页组件使用！** 
