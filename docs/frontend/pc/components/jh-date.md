# jh-date - 日期选择组件

> 平台统一的日期选择组件，封装常用日期选择交互与默认格式，适用于表单、查询条件等需要选择单个日期的场景

## 📦 组件位置

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-date />`。

---

## 基本用法

### 1️⃣ 选择单个日期（最常用）

```vue
<template>
  <jh-date v-model="form.date" placeholder="请选择日期" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({
  date: ""
});
</script>
```

---

### 2️⃣ 查询条件使用

```vue
<jh-date v-model="query.bizDate" placeholder="业务日期" clearable />
```

---

## Props 属性

| 参数                 | 说明                         | 类型                                    | 默认值         |
| -------------------- | ---------------------------- | --------------------------------------- | -------------- |
| modelValue / v-model | 绑定值                       | `string \| Date`                        | -              |
| placeholder          | 占位提示                     | `string`                                | `"请选择日期"` |
| type                 | 日期类型                     | `"date" \| "week" \| "month" \| "year"` | `"date"`       |
| format               | 绑定值格式（返回给 v-model） | `string`                                | `"YYYY-MM-DD"` |
| showFormat           | 显示格式                     | `string`                                | `"YYYY-MM-DD"` |
| disabled             | 是否禁用                     | `boolean`                               | `false`        |
| clearable            | 是否可清空                   | `boolean`                               | `true`         |
| teleported           | 是否将下拉面板插入 body      | `boolean`                               | `true`         |

> **重要说明**:
> - `format` 控制 v-model 返回值格式，`showFormat` 控制界面显示格式
> - 与 Element Plus 的 `value-format` / `format` 命名不同，请使用 jh-date 自己的 `format` 和 `showFormat`

---

## Events 事件

| 事件名            | 说明           | 回调参数          |
| ----------------- | -------------- | ----------------- |
| change            | 日期变化时触发 | `(value) => void` |
| update:modelValue | v-model 更新   | `(value) => void` |

---

## 常见场景

### 场景 1：表单录入日期

```vue
<jh-date v-model="form.deliveryDate" placeholder="请选择交期" />
```

---

### 场景 2：列表查询日期

```vue
<jh-date v-model="query.createDate" placeholder="创建日期" />
```

---

### 场景 3：详情页日期展示（配合 jh-text / 普通文本）

```vue
<span>{{ detail.bizDate }}</span>
```

> ⚠️ `jh-date` 仅用于选择，详情展示建议直接展示字符串或统一格式化后展示

---

### 场景 3：BaseQuery 配置式用法

#### 方式一：使用 logicType 自动映射（推荐）

```ts
import { BusLogicDataType } from "@jhlc/types/src/logical-data";

export const queryItems: BaseQueryItemDesc<any>[] = [
  {
    name: "deliveryDate",
    label: "交期日期",
    logicType: BusLogicDataType.date,
    // 自动渲染为 jh-date，默认 type="date"，format="YYYY-MM-DD"
  },
  {
    name: "year",
    label: "年份",
    logicType: BusLogicDataType.date_yyyy,
    // 自动渲染为 jh-date，type="year"，format="YYYY"
  },
];
```

> **源码映射规则**（`getFormItemByLogicType`）：
> - `BusLogicDataType.date` → `DateComponent`（type="date"）
> - `BusLogicDataType.date_yyyy` → `DateComponent`（type="year", format="YYYY"）
> - `BusLogicDataType.datetime` → `DateTimeComponent`（format="YYYY-MM-DD HH:mm:ss"）
> - 自定义 `"month"` → `jh-date`（type="month"）

#### 方式二：使用 component 自定义

```ts
export const queryItems: BaseQueryItemDesc<any>[] = [
  {
    name: "month",
    label: "月份",
    logicType: "month" as any,
    dateFormat: "YYYY-MM",
    // 源码会渲染为 jh-date，type="month"，format="YYYY-MM"
  },
  {
    name: "deliveryDate",
    label: "交期日期",
    component: () => {
      return {
        tag: "jh-date",
        type: "date",
        showFormat: "YYYY-MM-DD",
        format: "YYYY-MM-DD"
      };
    }
  },
];
```

> **dateFormat 可选值**（在 BaseQueryItemDesc 中）：`"YYYY-MM-DD"` | `"YYYY-MM"` | `"YYYYMM"` | `"YYYYMMDD"`

---

## 与 el-date-picker 对比

### 使用 jh-date（推荐）

```vue
<jh-date v-model="form.date" />
```

✅ 统一默认格式  
✅ 简化 props 配置  
✅ 风格一致

### 使用 el-date-picker（不推荐）

```vue
<el-date-picker
  v-model="form.date"
  type="date"
  value-format="YYYY-MM-DD"
  format="YYYY-MM-DD"
/>
```

❌ 每处都要重复配置格式  
❌ 样式与交互不统一

---

## 最佳实践

### 1️⃣ 统一返回字符串格式

推荐保持 `format="YYYY-MM-DD"`，避免 Date / string 混用：

```vue
<jh-date v-model="form.date" format="YYYY-MM-DD" />
```

---

### 2️⃣ 查询条件优先可清空

```vue
<jh-date v-model="query.date" clearable />
```

---

### 3️⃣ 与日期范围选择区分使用

- 单个日期：`jh-date`
- 日期范围：`jh-date-range`

---

## 注意事项

1. **v-model 返回值取决于 format**
   - 默认返回 `"YYYY-MM-DD"` 字符串
   - 若不配置可能返回 Date（取决于组件封装）

2. **后端字段格式建议统一**
   - 推荐后端/前端统一使用 `"YYYY-MM-DD"`

3. **不要在不同页面混用格式**
   - 避免接口参数混乱

---

## 🎯 真实项目示例

### 示例 1：订单交期

```vue
<jh-date v-model="form.deliveryDate" />
```

### 示例 2：查询条件

```vue
<jh-date v-model="query.bizDate" clearable />
```

---

## 🚀 快速开始

1. 直接使用 v-model 绑定字段
2. 默认返回 `"YYYY-MM-DD"` 字符串
3. 范围选择使用 `jh-date-range`

**推荐作为平台统一的单日期选择组件使用！**
