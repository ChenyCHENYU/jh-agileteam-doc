# jh-date-range - 日期范围选择组件

> 平台统一的日期范围选择组件，封装常用日期范围选择交互与默认格式，适用于查询条件、统计分析等需要选择开始/结束日期的场景

## 📦 组件位置

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-date-range />`。

---

## 基本用法

### 1️⃣ 选择日期范围（最常用）

```vue
<template>
  <jh-date-range v-model="query.dateRange" placeholder="请选择日期范围" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const query = ref({
  dateRange: []
});
</script>
```

---

### 2️⃣ 查询条件中使用（推荐）

```vue
<jh-date-range
  v-model="query.createDateRange"
  placeholder="创建日期"
  clearable
/>
```

---

## Props 属性

| 参数                            | 说明                         | 类型                                             | 默认值             |
| ------------------------------- | ---------------------------- | ------------------------------------------------ | ------------------ |
| modelValue / v-model            | 绑定值（开始/结束数组）      | `Array<string \| Date>`                          | `[]`               |
| beginValue / v-model:beginValue | 开始日期（可拆分绑定）       | `string \| Date`                                 | -                  |
| endValue / v-model:endValue     | 结束日期（可拆分绑定）       | `string \| Date`                                 | -                  |
| placeholder                     | 占位提示                     | `string`                                         | `"请选择日期范围"` |
| startPlaceholder                | 开始日期占位                 | `string`                                         | `"开始日期"`       |
| endPlaceholder                  | 结束日期占位                 | `string`                                         | `"结束日期"`       |
| type                            | 范围选择器类型               | `"daterange" \| "monthrange" \| "datetimerange"` | `"daterange"`      |
| format                          | 绑定值格式（返回给 v-model） | `string`                                         | `"YYYY-MM-DD"`     |
| showFormat                      | 显示格式                     | `string`                                         | `"YYYY-MM-DD"`     |
| rangeSeparator                  | 分隔符                       | `string`                                         | `"至"`             |
| disabled                        | 是否禁用                     | `boolean`                                        | `false`            |
| clearable                       | 是否可清空                   | `boolean`                                        | `true`             |

> **新增提示**: 除了使用 `v-model` 绑定数组外,还可以使用 `v-model:beginValue` 和 `v-model:endValue` 分别绑定开始和结束日期,这在某些场景下更加灵活。

---

## Events 事件

| 事件名            | 说明               | 回调参数                                 |
| ----------------- | ------------------ | ---------------------------------------- |
| update:modelValue | v-model 更新时触发 | `(value: Array<string \| Date>) => void` |
| update:beginValue | 开始日期更新时触发 | `(value: string \| Date) => void`        |
| update:endValue   | 结束日期更新时触发 | `(value: string \| Date) => void`        |
| blur              | 失去焦点时触发     | `() => void`                             |

---

## 常见场景

### 场景 1：列表查询时间范围（推荐）

```vue
<jh-date-range v-model="query.bizDateRange" placeholder="业务日期" />
```

---

### 场景 2：统计报表筛选

```vue
<jh-date-range v-model="query.statRange" placeholder="统计区间" />
```

---

### 场景 3：BaseQuery 配置式用法（推荐）

```ts
// data.ts 查询项配置
export const queryItems: BaseQueryItemDesc<any>[] = [
  {
    name: "createDateTime",
    startName: "createDateTimeStart", // 开始字段（自动拆分）
    endName: "createDateTimeEnd",     // 结束字段（自动拆分）
    label: "创建日期",
    component: () => {
      return {
        tag: "jh-date",
        type: "daterange",
        rangeSeparator: "至",
        showFormat: "YYYY-MM-DD",
        format: "YYYY-MM-DD"
      };
    }
  }
];

// 运行时框架会自动拆分为 startName 和 endName 两个字段：
// query.createDateTimeStart = "2026-01-01"
// query.createDateTimeEnd = "2026-01-31"
```

### 场景 4：使用 defaultValue 预设值（源码内置）

框架在 `BaseQueryItemDesc` 中内置了丰富的日期范围预设值，配合 `startName` / `endName` 使用：

```ts
export const queryItems: BaseQueryItemDesc<any>[] = [
  {
    name: "dateRange",
    startName: "startDate",
    endName: "endDate",
    label: "业务日期",
    defaultValue: "recentDay7",  // 默认选中近 7 天
    component: () => ({ tag: "jh-date", type: "daterange" })
  },
];
```

**全部可用预设值**（源码 `setFormDefaultValue`）：

| 预设值                                | 说明                                     |
| ------------------------------------- | ---------------------------------------- |
| `"recentDay3"`                        | 近 3 天（startDate ~ 明天）                |
| `"recentDay7"`                        | 近 7 天（startDate ~ 明天）                |
| `"recentDay30"`                       | 近 30 天（startDate ~ 明天）               |
| `"recentDay3Datetime"`                | 近 3 天（含时分秒 00:00:00 ~ 23:59:59）  |
| `"rangeDatetimeToday"`                | 今天（00:00:00 ~ 23:59:59）               |
| `"rangeDayCurrentMonth1ToToday"`      | 本月 1 号 ~ 今天                           |
| `"rangeDayCurrentMonth1ToLastDay"`    | 本月 1 号 ~ 本月最后一天                   |
| `"rangeDatetimeCurrentMonth1ToLastDay"` | 本月 1 号 ~ 本月最后一天（含时分秒）       |

> **单字段预设值**（非范围）：`"currentDay"` | `"currentMonth"` | `"currentYear"` | `"currentDept"`

### 场景 5：与后端接口参数映射

```ts
// v-model 方式
query.dateRange = ["2026-01-01", "2026-01-31"]

// 请求参数建议拆分传递
params: {
  startDate: query.dateRange?.[0],
  endDate: query.dateRange?.[1]
}

// 或使用 beginValue/endValue 方式
query.beginDate = "2026-01-01"
query.endDate = "2026-01-31"

// 请求参数直接使用
params: {
  startDate: query.beginDate,
  endDate: query.endDate
}
```

---

## 与 el-date-picker 对比

### 使用 jh-date-range（推荐）

```vue
<jh-date-range v-model="query.dateRange" />
```

✅ 统一默认格式  
✅ 简化配置  
✅ 风格一致

### 使用 el-date-picker（不推荐）

```vue
<el-date-picker
  v-model="query.dateRange"
  type="daterange"
  value-format="YYYY-MM-DD"
  format="YYYY-MM-DD"
  range-separator="至"
  start-placeholder="开始日期"
  end-placeholder="结束日期"
/>
```

❌ 配置繁琐  
❌ 每处都要重复写默认格式  
❌ 风格不统一

---

## 最佳实践

### 1️⃣ 统一返回字符串格式（强烈推荐）

```vue
<jh-date-range v-model="query.dateRange" format="YYYY-MM-DD" />
```

避免 Date / string 混用，接口参数更稳定

---

### 2️⃣ 查询条件建议 always clearable

```vue
<jh-date-range v-model="query.range" clearable />
```

---

### 3️⃣ 请求参数建议拆分传递

```ts
const [startDate, endDate] = query.value.dateRange || [];
request({
  url: "/api/list",
  params: { startDate, endDate }
});
```

---

### 4️⃣ 与单日期选择区分使用

- 单个日期：`jh-date`
- 日期范围：`jh-date-range`

---

## 注意事项

1. **v-model 为数组**
   - 必须使用数组字段接收
   - 推荐默认 `[]`

2. **format 决定返回类型**
   - 默认 `"YYYY-MM-DD"` 字符串数组
   - 不建议返回 Date（容易引入时区/格式问题）

3. **后端字段建议统一**
   - 强烈建议后端使用 `startDate/endDate` 两个字段接收

---

## 🎯 真实项目示例

### 示例 1：列表查询

```vue
<jh-date-range v-model="query.createDateRange" />
```

### 示例 2：报表筛选

```vue
<jh-date-range v-model="query.statRange" />
```

---

## 🚀 快速开始

1. 使用数组字段绑定 v-model（如 `dateRange`）
2. 默认返回 `"YYYY-MM-DD"` 字符串数组
3. 请求参数拆分成 start / end 传递

**推荐作为平台统一的日期范围选择组件使用！**
