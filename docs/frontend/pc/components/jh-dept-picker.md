# jh-dept-picker - 部门选择组件

> 平台统一的部门挑选组件，用于选择单个或多个部门，内置部门树数据加载与回显逻辑

## 📦 组件位置

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-dept-picker />`。

---

## 基本用法

### 1️⃣ 单选部门（最常用）

```vue
<template>
  <jh-dept-picker v-model="form.deptId" placeholder="请选择部门" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({
  deptId: ""
});
</script>
```

---

### 2️⃣ 多选部门

```vue
<jh-dept-picker v-model="form.deptIds" multiple placeholder="请选择相关部门" />
```

---

## Props 属性

| 参数                 | 说明                   | 类型                  | 默认值             |
| -------------------- | ---------------------- | --------------------- | ------------------ |
| modelValue / v-model | 绑定值                 | `string \| string[]`  | -                  |
| multiple             | 是否多选               | `boolean`             | `false`            |
| placeholder          | 占位提示               | `string`              | `"请选择部门"`     |
| disabled             | 是否禁用               | `boolean`             | `false`            |
| clearable            | 是否可清空             | `boolean`             | `true`             |
| checkStrictly        | 父子是否不关联         | `boolean`             | `false`            |
| dataType             | 返回数据类型（多选时） | `"array" \| "string"` | `"array"`          |
| dialogTitle          | 弹窗标题               | `string`              | `"选择部门"`       |
| dialogWidth          | 弹窗宽度               | `string`              | `"600px"`          |
| searchPlaceholder    | 搜索框占位文本         | `string`              | `"请输入部门名称"` |

> **重点**:
>
> - 默认父子关联，选中父节点会自动选中子节点
> - `checkStrictly=true` 时,父子不互相关联

---

## Events 事件

| 事件名            | 说明                     | 回调参数                              |
| ----------------- | ------------------------ | ------------------------------------- |
| update:modelValue | v-model 更新             | `(value: string \| string[]) => void` |
| confirm           | 确认选择时触发           | `() => void`                          |
| clear             | 清空时触发               | `() => void`                          |
| closed            | 弹窗关闭时触发           | `() => void`                          |
| remove            | 移除选中项时触发（多选） | `() => void`                          |

---

## 常见场景

### 场景 1：表单部门选择

```vue
<jh-dept-picker v-model="form.deptId" placeholder="请选择所属部门" />
```

---

### 场景 2：查询条件（多选）

```vue
<jh-dept-picker v-model="query.deptIds" multiple placeholder="请选择部门" />
```

---

### 场景 3：详情页部门展示（配合 jh-text）

```vue
<jh-text type="dept" :value="detail.deptId" />
```

> ⚠️ `jh-dept-picker` 仅用于选择，展示请使用 `jh-text`

### 场景 4：BaseQuery 配置式用法（推荐）

```ts
import { BusLogicDataType } from "@jhlc/types/src/logical-data";

export const queryItems: BaseQueryItemDesc<any>[] = [
  {
    name: "deptId",
    label: "部门",
    logicType: BusLogicDataType.dept,
    // 自动渲染为 DeptPickerComponent
  },
];
```

> **源码映射**: `BusLogicDataType.dept` → `DeptPickerComponent`

---

## 与手动实现对比

### 使用 jh-dept-picker（推荐）

```vue
<jh-dept-picker v-model="form.deptId" />
```

### 手动实现（不推荐）

```vue
<el-tree-select v-model="form.deptId" :data="deptTree" />
```

❌ 需要自己加载部门树  
❌ 需要处理父子关系  
❌ 回显逻辑复杂

---

## 最佳实践

### 1️⃣ 编辑 & 展示分离

| 场景 | 编辑           | 展示    |
| ---- | -------------- | ------- |
| 部门 | jh-dept-picker | jh-text |

---

### 2️⃣ 多选返回值说明

```ts
// 单选
deptId: "d001";

// 多选
deptIds: ["d001", "d002"];
```

---

### 3️⃣ 树形选择说明

- 默认父子关联
- `checkStrictly=true` 时父子不互相关联

---

## 注意事项

1. **组件内部已处理部门数据加载**
   - 不需要手动请求接口
   - 支持树形结构与自动回显

2. **仅返回部门 ID**
   - 部门名称展示统一使用 `jh-text`

3. **多选字段类型**
   - 必须使用数组接收

---

## 🎯 真实项目示例

### 示例 1：新增页面

```vue
<jh-dept-picker v-model="form.deptId" />
```

### 示例 2：查询条件

```vue
<jh-dept-picker v-model="query.deptIds" multiple />
```

---

## 🚀 快速开始

- **单选**：直接使用 v-model
- **多选**：添加 `multiple`
- **部门展示**：统一使用 `jh-text type="dept"`

**推荐作为平台统一的部门选择组件使用！**
