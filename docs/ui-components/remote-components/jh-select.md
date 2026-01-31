# jh-select - 字典选择组件

> 平台统一的字典选择组件，基于字典数据源的下拉选择，适用于状态、类型等需要从字典表选择的场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-select />`。

---

## 基本用法

### 1️⃣ 字典选择（最常用）

```vue
<template>
  <jh-select v-model="form.status" dict-type="sys_status" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({
  status: "",
});
</script>
```

---

### 2️⃣ 多选模式

```vue
<jh-select v-model="form.types" dict-type="sys_type" multiple />
```

---

## Props 属性

| 参数                 | 说明       | 类型                                       | 默认值     |
| -------------------- | ---------- | ------------------------------------------ | ---------- |
| modelValue / v-model | 绑定值     | `string \| number \| string[] \| number[]` | -          |
| dictType             | 字典类型   | `string`                                   | -          |
| placeholder          | 占位提示   | `string`                                   | `"请选择"` |
| multiple             | 是否多选   | `boolean`                                  | `false`    |
| disabled             | 是否禁用   | `boolean`                                  | `false`    |
| clearable            | 是否可清空 | `boolean`                                  | `true`     |
| filterable           | 是否可搜索 | `boolean`                                  | `false`    |

---

## Events 事件

| 事件名            | 说明               | 回调参数          |
| ----------------- | ------------------ | ----------------- |
| update:modelValue | v-model 更新时触发 | `(value) => void` |
| change            | 选中值改变时触发   | `(value) => void` |
| blur              | 失去焦点时触发     | `() => void`      |

---

## 常见场景

### 场景 1：状态选择（推荐）

```vue
<jh-select v-model="form.status" dict-type="sys_status" />
```

自动从 `sys_status` 字典表加载状态选项

---

### 场景 2：类型选择

```vue
<jh-select v-model="form.type" dict-type="biz_type" />
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
        tag: "jh-select",
        dictType: "sys_status",
      };
    },
  },
];

// query.status = "1"
```

---

### 场景 4：BaseForm 配置式用法（推荐）

```ts
// data.ts 表单项配置
export const formItemsConfig: BaseFormItemDesc<any>[] = [
  {
    name: "type",
    label: "类型",
    component: () => {
      return {
        tag: "jh-select",
        dictType: "biz_type",
      };
    },
  },
];

// form.type = "1"
```

---

### 场景 5：多选字典

```vue
<jh-select
  v-model="form.types"
  dict-type="sys_type"
  multiple
  placeholder="请选择类型（可多选）"
/>
```

---

## 字典数据说明

### 字典表结构

```ts
interface DictData {
  label: string; // 显示文本
  value: string; // 字典值
  dictType: string; // 字典类型
  sort?: number; // 排序
  status?: string; // 状态（启用/禁用）
}
```

### 使用示例

假设 `sys_status` 字典表数据：

```ts
[
  { label: "启用", value: "1", dictType: "sys_status" },
  { label: "禁用", value: "0", dictType: "sys_status" },
];
```

使用：

```vue
<jh-select v-model="form.status" dict-type="sys_status" />
```

下拉框会自动显示"启用"和"禁用"选项

---

## 与 el-select + dictData 对比

### 使用 jh-select（推荐）

```vue
<jh-select v-model="form.status" dict-type="sys_status" />
```

✅ 自动加载字典数据  
✅ 统一字典管理  
✅ 简化配置  
✅ 风格一致

### 使用 el-select（不推荐）

```vue
<el-select v-model="form.status" placeholder="请选择状态">
  <el-option
    v-for="item in dictData['sys_status']"
    :key="item.value"
    :label="item.label"
    :value="item.value"
  />
</el-select>

<script setup lang="ts">
import { useDictStore } from "@/store/dict";

const dictStore = useDictStore();
const dictData = dictStore.getDictData("sys_status");
</script>
```

❌ 需要手动获取字典数据  
❌ 需要手动遍历选项  
❌ 配置繁琐

---

## 最佳实践

### 1️⃣ 统一使用字典类型编码（推荐）

```vue
<jh-select v-model="form.status" dict-type="sys_status" />
```

字典类型编码应在项目中统一管理

---

### 2️⃣ 多选时使用数组字段

```vue
<jh-select v-model="form.types" dict-type="sys_type" multiple />
```

单选用 `status: string`，多选用 `types: string[]`

---

### 3️⃣ 查询条件建议 always clearable

```vue
<jh-select v-model="query.status" dict-type="sys_status" clearable />
```

---

### 4️⃣ 字典编码统一管理（推荐）

```ts
// constants/dict.ts
export const DICT_TYPE = {
  SYS_STATUS: "sys_status",
  BIZ_TYPE: "biz_type",
  // ...其他字典类型
};

// 使用
<jh-select v-model="form.status" :dict-type="DICT_TYPE.SYS_STATUS" />
```

---

## 注意事项

1. **dictType 必填**
   - 必须指定字典类型编码
   - 字典类型需要在字典表中存在

2. **v-model 类型**
   - 单选: `string | number`
   - 多选: `string[] | number[]`

3. **字典数据缓存**
   - 组件会自动缓存字典数据
   - 避免重复请求

4. **清空时返回值**
   - 单选: 空字符串 `""`
   - 多选: 空数组 `[]`

---

## 🎯 真实项目示例

### 示例 1：状态筛选

```vue
<jh-select
  v-model="query.status"
  dict-type="sys_status"
  placeholder="请选择状态"
/>
```

### 示例 2：类型选择

```vue
<jh-select
  v-model="form.bizType"
  dict-type="biz_type"
  placeholder="请选择业务类型"
/>
```

### 示例 3：多选标签

```vue
<jh-select
  v-model="form.tags"
  dict-type="sys_tag"
  multiple
  placeholder="请选择标签（可多选）"
/>
```

---

## 🚀 快速开始

1. 单选绑定 `string/number` 字段
2. 多选绑定 `string[]/number[]` 字段
3. 指定 `dict-type` 字典类型编码
4. 组件自动加载字典数据并渲染

**推荐作为平台统一的字典选择组件使用！** - 字典下拉选择组件

> 集成平台数据字典的下拉选择组件，只需传入字典名称即可自动加载选项。

已全局注册，可直接使用 `<jh-select />`。

示例：

```vue
<jh-select
  v-model="form.status"
  dict="order_status"
  placeholder="请选择订单状态"
/>
```
