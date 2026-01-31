# jh-date - 日期选择组件

> 平台统一的日期选择组件，封装了常用日期选择的交互与默认格式，适用于表单、查询条件等需要选择单个日期的场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-date />`。

---

## 基本用法

### 1️⃣ 选择日期（最常用）

```vue
<template>
  <jh-date v-model="query.bizDate" placeholder="请选择业务日期" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const query = ref({
  bizDate: "",
});
</script>
```

---

### 2️⃣ 表单中使用（推荐）

```vue
<jh-date v-model="form.birthDate" placeholder="出生日期" clearable />
```

---

## Props 属性

| 参数                 | 说明                         | 类型                                 | 默认值         |
| -------------------- | ---------------------------- | ------------------------------------ | -------------- |
| modelValue / v-model | 绑定值                       | `string \| Date`                     | -              |
| placeholder          | 占位提示                     | `string`                             | `"请选择日期"` |
| type                 | 选择器类型                   | `"date" \| "month" \| "datetime"`    | `"date"`       |
| format               | 绑定值格式（返回给 v-model） | `string`                             | `"YYYY-MM-DD"` |
| showFormat           | 显示格式                     | `string`                             | `"YYYY-MM-DD"` |
| disabled             | 是否禁用                     | `boolean`                            | `false`        |
| clearable            | 是否可清空                   | `boolean`                            | `true`         |
| disabledDate         | 禁用日期函数                 | `(time: Date) => boolean`            | -              |
| shortcuts            | 快捷选项                     | `Array<{ text: string, value: any}>` | -              |

---

## Events 事件

| 事件名            | 说明               | 回调参数                          |
| ----------------- | ------------------ | --------------------------------- |
| update:modelValue | v-model 更新时触发 | `(value: string \| Date) => void` |
| blur              | 失去焦点时触发     | `() => void`                      |

---

## 常见场景

### 场景 1：表单录入（推荐）

```vue
<jh-date v-model="form.birthDate" placeholder="出生日期" />
```

---

### 场景 2：查询条件

```vue
<jh-date v-model="query.bizDate" placeholder="业务日期" />
```

---

### 场景 3：BaseQuery 配置式用法（推荐）

```ts
// data.ts 查询项配置
export const queryItemsConfig: BaseQueryItemDesc<any>[] = [
  {
    name: "createDate",
    label: "创建日期",
    component: () => {
      return {
        tag: "jh-date",
        type: "date",
        showFormat: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      };
    },
  },
];

// query.createDate = "2026-01-01"
```

### 场景 4：禁用今天之前的日期

```vue
<jh-date
  v-model="form.startDate"
  :disabled-date="(time) => time.getTime() < Date.now()"
/>
```

---

### 场景 5：使用快捷选项

```vue
<jh-date
  v-model="query.date"
  :shortcuts="[
    { text: '今天', value: new Date() },
    { text: '昨天', value: new Date(Date.now() - 86400000) },
    { text: '一周前', value: new Date(Date.now() - 7 * 86400000) },
  ]"
/>
```

---

## 与 el-date-picker 对比

### 使用 jh-date（推荐）

```vue
<jh-date v-model="query.date" />
```

✅ 统一默认格式  
✅ 简化配置  
✅ 风格一致

### 使用 el-date-picker（不推荐）

```vue
<el-date-picker
  v-model="query.date"
  type="date"
  value-format="YYYY-MM-DD"
  format="YYYY-MM-DD"
  placeholder="请选择日期"
/>
```

❌ 配置繁琐  
❌ 每处都要重复写默认格式  
❌ 风格不统一

---

## 最佳实践

### 1️⃣ 统一返回字符串格式（强烈推荐）

```vue
<jh-date v-model="query.date" value-format="YYYY-MM-DD" />
```

避免 Date / string 混用，接口参数更稳定

---

### 2️⃣ 表单/查询建议 always clearable

```vue
<jh-date v-model="query.date" clearable />
```

---

### 3️⃣ 日期时间选择使用 type="datetime"

```vue
<jh-date
  v-model="query.datetime"
  type="datetime"
  format="YYYY-MM-DD HH:mm:ss"
/>
```

---

### 4️⃣ 与日期范围选择区分使用

- 单个日期：`jh-date`
- 日期范围：`jh-date-range`

---

## 注意事项

1. **valueFormat 决定返回类型**
   - 默认 `"YYYY-MM-DD"` 字符串
   - 不建议返回 Date（容易引入时区/格式问题）

2. **与后端字段对应**
   - 推荐统一使用字符串格式
   - 前后端格式保持一致

3. **清空时返回空字符串**
   - 清空后 v-model 为空字符串
   - 请求参数建议做空值过滤

---

## 🎯 真实项目示例

### 示例 1：表单录入

```vue
<jh-date v-model="form.bizDate" placeholder="业务日期" />
```

### 示例 2：查询条件

```vue
<jh-date v-model="query.createDate" placeholder="创建日期" />
```

---

## 🚀 快速开始

1. 使用字符串字段绑定 v-model（如 `date`）
2. 默认返回 `"YYYY-MM-DD"` 字符串
3. 按需配置 clearable、disabled、快捷选项等

**推荐作为平台统一的日期选择组件使用！**
