# jh-picker - 通用选择器组件

> 平台统一的通用选择器组件，支持单选/多选、远程搜索、自定义数据源，适用于各类下拉选择场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-picker />`。

---

## 基本用法

### 1️⃣ 基本选择（最常用）

```vue
<template>
  <jh-picker v-model="form.value" :options="options" placeholder="请选择" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({
  value: "",
});

const options = ref([
  { label: "选项1", value: "1" },
  { label: "选项2", value: "2" },
  { label: "选项3", value: "3" },
]);
</script>
```

---

### 2️⃣ 多选模式

```vue
<jh-picker
  v-model="form.values"
  :options="options"
  multiple
  placeholder="请选择（可多选）"
/>
```

---

## Props 属性

| 参数                 | 说明              | 类型                                       | 默认值     |
| -------------------- | ----------------- | ------------------------------------------ | ---------- |
| modelValue / v-model | 绑定值            | `string \| number \| string[] \| number[]` | -          |
| options              | 选项数据          | `Array<{label, value}>`                    | `[]`       |
| placeholder          | 占位提示          | `string`                                   | `"请选择"` |
| multiple             | 是否多选          | `boolean`                                  | `false`    |
| disabled             | 是否禁用          | `boolean`                                  | `false`    |
| clearable            | 是否可清空        | `boolean`                                  | `true`     |
| filterable           | 是否可搜索        | `boolean`                                  | `false`    |
| remote               | 是否远程搜索      | `boolean`                                  | `false`    |
| remoteMethod         | 远程搜索方法      | `(query: string) => Promise`               | -          |
| valueKey             | 作为 value 的键名 | `string`                                   | `"value"`  |
| labelKey             | 作为 label 的键名 | `string`                                   | `"label"`  |

---

## Events 事件

| 事件名            | 说明               | 回调参数          |
| ----------------- | ------------------ | ----------------- |
| update:modelValue | v-model 更新时触发 | `(value) => void` |
| change            | 选中值改变时触发   | `(value) => void` |
| blur              | 失去焦点时触发     | `() => void`      |

---

## 常见场景

### 场景 1：静态选项（推荐）

```vue
<jh-picker
  v-model="form.status"
  :options="statusOptions"
  placeholder="请选择状态"
/>

<script setup lang="ts">
const statusOptions = [
  { label: "启用", value: "1" },
  { label: "禁用", value: "0" },
];
</script>
```

---

### 场景 2：远程搜索（推荐）

```vue
<jh-picker
  v-model="form.userId"
  remote
  filterable
  :remote-method="searchUsers"
  placeholder="搜索用户"
/>

<script setup lang="ts">
const searchUsers = async (query: string) => {
  if (!query) return [];
  const res = await request({
    url: "/api/user/search",
    params: { keyword: query },
  });
  return res.data.map((item) => ({
    label: item.name,
    value: item.id,
  }));
};
</script>
```

---

### 场景 3：BaseQuery 配置式用法（推荐）

```ts
// data.ts 查询项配置
export const queryItemsConfig: BaseQueryItemDesc<any>[] = [
  {
    name: "status",
    label: "状态",
    component: () => {
      return {
        tag: "jh-picker",
        options: [
          { label: "启用", value: "1" },
          { label: "禁用", value: "0" },
        ],
      };
    },
  },
];

// query.status = "1"
```

---

### 场景 4：自定义 key（后端字段不一致时）

```vue
<jh-picker
  v-model="form.cityId"
  :options="cityList"
  value-key="id"
  label-key="name"
/>

<script setup lang="ts">
// 后端返回格式
const cityList = [
  { id: "110000", name: "北京市" },
  { id: "310000", name: "上海市" },
];
</script>
```

---

### 场景 5：多选 + 远程搜索

```vue
<jh-picker
  v-model="form.userIds"
  multiple
  remote
  filterable
  :remote-method="searchUsers"
  placeholder="搜索并选择多个用户"
/>
```

---

## 与 el-select 对比

### 使用 jh-picker（推荐）

```vue
<jh-picker v-model="form.value" :options="options" />
```

✅ 统一风格  
✅ 简化配置  
✅ 内置常用功能

### 使用 el-select（不推荐）

```vue
<el-select v-model="form.value" placeholder="请选择">
  <el-option
    v-for="item in options"
    :key="item.value"
    :label="item.label"
    :value="item.value"
  />
</el-select>
```

❌ 需要手动遍历选项  
❌ 配置繁琐

---

## 最佳实践

### 1️⃣ 静态选项推荐使用常量（推荐）

```ts
// constants.ts
export const STATUS_OPTIONS = [
  { label: "启用", value: "1" },
  { label: "禁用", value: "0" }
];

// 使用
<jh-picker v-model="form.status" :options="STATUS_OPTIONS" />
```

---

### 2️⃣ 远程搜索加防抖（推荐）

```ts
import { debounce } from "lodash-es";

const searchUsers = debounce(async (query: string) => {
  // 远程搜索逻辑
}, 300);
```

---

### 3️⃣ 多选时使用数组字段

```vue
<jh-picker v-model="form.ids" multiple :options="options" />
```

单选用 `id: string`，多选用 `ids: string[]`

---

### 4️⃣ 清空后返回空值处理

```ts
// 单选清空后为空字符串
form.value = "";

// 多选清空后为空数组
form.values = [];
```

---

## 注意事项

1. **v-model 类型**
   - 单选: `string | number`
   - 多选: `string[] | number[]`

2. **options 格式**
   - 默认: `{ label, value }`
   - 可通过 `labelKey` / `valueKey` 自定义

3. **远程搜索**
   - 需配置 `remote` 和 `filterable`
   - `remoteMethod` 返回格式化后的 options

4. **性能优化**
   - 大量选项时推荐远程搜索
   - 远程搜索建议加防抖

---

## 🎯 真实项目示例

### 示例 1：状态选择

```vue
<jh-picker
  v-model="query.status"
  :options="[
    { label: '全部', value: '' },
    { label: '启用', value: '1' },
    { label: '禁用', value: '0' },
  ]"
/>
```

### 示例 2：用户搜索

```vue
<jh-picker
  v-model="form.userId"
  remote
  filterable
  :remote-method="searchUsers"
  placeholder="搜索用户"
/>
```

---

## 🚀 快速开始

1. 单选绑定 `string/number` 字段
2. 多选绑定 `string[]/number[]` 字段
3. 传入 `options` 数据源
4. 远程搜索配置 `remote` + `remoteMethod`

**推荐作为平台统一的选择器组件使用！**
