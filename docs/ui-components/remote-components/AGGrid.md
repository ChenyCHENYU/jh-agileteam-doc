# AGGrid 高性能表格

> 来源：`@jhlc/common-core` 远程组件

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

AGGrid 是 BaseTable 的高性能渲染模式，基于 AG Grid 企业级表格库实现。适用于大数据量场景，支持虚拟滚动、列固定、分组聚合等企业级特性。

## 📦 使用方式

AGGrid 不是独立组件，而是 BaseTable 的一种渲染模式，通过 `render-type="agGrid"` 启用：

```vue
<template>
  <BaseTable
    ref="tableRef"
    render-type="agGrid"
    :data="tableData"
    :columns="columns"
    :row-key="'id'"
  />
</template>
```

### 💡 可以在同一页面并存使用 (但不推荐，最好默认使用一个)

**完全可以**在同一个页面中使用多个 BaseTable，并为每个表格指定不同的 `render-type`：

```vue
<template>
  <div>
    <!-- 表格1：大数据量，使用 agGrid -->
    <BaseTable :data="largeDataList" :columns="columns1" render-type="agGrid" />

    <!-- 表格2：小数据量，使用默认 dataTable -->
    <BaseTable
      :data="smallDataList"
      :columns="columns2"
      render-type="dataTable"
    />
  </div>
</template>
```

### 🔄 一键切换渲染模式

```vue
<template>
  <div>
    <BaseToolbar :items="toolbarItems" />
    <BaseTable :data="tableData" :columns="columns" :render-type="renderType" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 响应式渲染类型
const renderType = ref<"dataTable" | "agGrid">("dataTable");

const toolbarItems = computed(() => [
  {
    name: "switch",
    label: `切换到 ${renderType.value === "dataTable" ? "agGrid" : "dataTable"}`,
    icon: "Switch",
    onClick: () => {
      renderType.value =
        renderType.value === "dataTable" ? "agGrid" : "dataTable";
    },
  },
]);
</script>
```

## 🆚 与 dataTable 模式对比

| 特性         | dataTable（默认） | agGrid         |
| ------------ | ----------------- | -------------- |
| 渲染性能     | 一般（全量渲染）  | 高（虚拟滚动） |
| 数据量支持   | < 1000 条         | 10万+ 条       |
| 列固定       | ✅                | ✅             |
| 行内编辑     | ✅                | ✅（性能更优） |
| 分组聚合     | ❌                | ✅             |
| 列拖拽排序   | ❌                | ✅             |
| 列配置持久化 | ❌                | ✅             |
| 自定义渲染   | ✅ VNode          | ✅ VNode       |

---

## 📋 renderType 属性

| 值          | 说明                       |
| ----------- | -------------------------- |
| `""`        | 使用全局配置（默认）       |
| `dataTable` | 使用 Element Plus 表格渲染 |
| `agGrid`    | 使用 AG Grid 渲染          |

### 🎯 三种配置方式

#### 方式1: 全局配置（所有未指定 render-type 的表格）

```typescript
// 在环境配置文件中设置（如 vite/environment.ts 或 main.ts）
envConfig().componentConfig.table = {
  renderType: "agGrid", // 或 "dataTable"
};
```

```vue
<!-- 使用全局配置 -->
<BaseTable :data="tableData" :columns="columns" />
```

#### 方式2: 单独指定（不受全局配置影响）

```vue
<!-- 明确指定，优先级最高 -->
<BaseTable :data="tableData" :columns="columns" render-type="agGrid" />
```

#### 方式3: 响应式切换（动态切换）

```vue
<template>
  <div>
    <el-radio-group v-model="renderType">
      <el-radio-button label="dataTable">默认表格</el-radio-button>
      <el-radio-button label="agGrid">AG Grid</el-radio-button>
    </el-radio-group>

    <BaseTable :data="tableData" :columns="columns" :render-type="renderType" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 响应式渲染类型，可动态切换
const renderType = ref<"dataTable" | "agGrid">("dataTable");
</script>
```

---

## 📋 AGGrid 特有功能

### 1. 虚拟滚动

AGGrid 默认启用虚拟滚动，只渲染可视区域的行，大幅提升大数据量下的性能：

```vue
<BaseTable render-type="agGrid" :data="largeData" :columns="columns" />
```

### 2. 列配置持久化

AGGrid 模式支持用户自定义列宽、列顺序、列可见性，并可持久化保存：

```typescript
// 通过 ref 调用
const tableRef = ref();

// 保存当前列配置
tableRef.value?.persistenceStatus();

// 恢复列配置
tableRef.value?.restoreColumn();

// 清除列配置
tableRef.value?.clearColumnsStatus();
```

### 3. 列设置面板

```typescript
// 打开列设置侧边栏
tableRef.value?.openSetting();
```

### 4. 分组与聚合

```typescript
const columns = computed(() => [
  {
    name: "category",
    label: "分类",
    rowGroup: true, // 作为分组字段
    hide: true, // 分组字段可隐藏列
  },
  {
    name: "amount",
    label: "金额",
    aggFunc: "sum", // 聚合函数：sum, avg, count, min, max
  },
]);
```

### 5. 强制刷新

```typescript
// 强制刷新表格视图
tableRef.value?.forceRefresh();

// 重新加载列配置
tableRef.value?.reloadColumns();
```

---

## 💡 使用示例

### 大数据量表格

```vue
<template>
  <BaseTable
    ref="tableRef"
    render-type="agGrid"
    :data="largeData"
    :columns="columns"
    :row-key="'id'"
    @selection-change="handleSelectionChange"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const tableRef = ref();
const largeData = ref([]);

// 加载 10 万条数据
onMounted(async () => {
  largeData.value = await fetchLargeData();
});

const columns = computed(() => [
  { name: "id", label: "ID", width: 80 },
  { name: "name", label: "名称" },
  { name: "status", label: "状态", logicType: "dict", logicValue: "STATUS" },
  { name: "amount", label: "金额", logicType: "number" },
]);
</script>
```

### 分组聚合

```vue
<template>
  <BaseTable render-type="agGrid" :data="salesData" :columns="columns" />
</template>

<script setup lang="ts">
const columns = computed(() => [
  {
    name: "region",
    label: "区域",
    rowGroup: true,
    hide: true,
  },
  {
    name: "product",
    label: "产品",
  },
  {
    name: "quantity",
    label: "数量",
    aggFunc: "sum",
  },
  {
    name: "amount",
    label: "金额",
    aggFunc: "sum",
    formatter: (row, val) => `¥${val?.toFixed(2) || 0}`,
  },
]);
</script>
```

### 列配置持久化

```vue
<template>
  <div>
    <BaseToolbar :items="toolbarItems" />
    <BaseTable
      ref="tableRef"
      render-type="agGrid"
      :data="tableData"
      :columns="columns"
    />
  </div>
</template>

<script setup lang="ts">
const tableRef = ref();

const toolbarItems = computed(() => [
  {
    name: "setting",
    label: "列设置",
    icon: "Setting",
    onClick: () => tableRef.value?.openSetting(),
  },
  {
    name: "save",
    label: "保存配置",
    onClick: async () => {
      await tableRef.value?.persistenceStatus();
      ElMessage.success("列配置已保存");
    },
  },
  {
    name: "reset",
    label: "重置配置",
    onClick: () => {
      tableRef.value?.clearColumnsStatus();
      ElMessage.success("列配置已重置");
    },
  },
]);
</script>
```

---

## ⚠️ 注意事项

1. **大数据量场景建议使用 AGGrid**

   ```vue
   <!-- 数据量 > 1000 时推荐 -->
   <BaseTable render-type="agGrid" />
   ```

2. **同一页面可以混用两种渲染模式**

   ```vue
   <!-- 主表格用 agGrid，详情表格用 dataTable -->
   <BaseTable :data="mainList" render-type="agGrid" />
   <BaseTable :data="detailList" render-type="dataTable" />
   ```

3. **与 dataTable 的 API 兼容**
   - 基础 API（getSelection, setSelection 等）两种模式通用
   - AGGrid 特有 API（persistenceStatus 等）仅在 agGrid 模式下可用

4. **列配置持久化需要后端支持**
   - 需要配置持久化接口
   - 不同用户的列配置独立存储

5. **分组聚合列的 hide 属性**

   ```typescript
   {
     name: "category",
     rowGroup: true,
     hide: true   // 分组字段建议隐藏，避免重复显示
   }
   ```

6. **全局配置默认渲染模式**

   ```typescript
   // 在环境配置中设置默认渲染模式
   envConfig().componentConfig.table = {
     renderType: "agGrid", // 全局默认使用 AGGrid
   };
   ```

---

## 📚 相关文档

- [BaseTable 表格组件](./BaseTable.md) - 完整的表格 Props 和列配置
- [AG Grid 官方文档](https://www.ag-grid.com/documentation/) - AG Grid 更多高级特性
