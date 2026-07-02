# jh-textarea - 多行文本输入组件

> 平台统一的多行文本输入组件，适用于备注、描述等需要输入较长文本的场景

## 📦 组件位置

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-textarea />`。

---

## 基本用法

### 1️⃣ 表单录入（最常用）

```vue
<template>
  <jh-textarea v-model="form.remark" placeholder="请输入备注" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({
  remark: ""
});
</script>
```

---

### 2️⃣ 限制行数

```vue
<jh-textarea v-model="form.description" :rows="4" placeholder="请输入描述信息" />
```

---

## Props 属性

| 参数                 | 说明                    | 类型               | 默认值         |
| -------------------- | ----------------------- | ------------------ | -------------- |
| modelValue / v-model | 绑定值                  | `string \| number` | -              |
| placeholder          | 占位提示                | `string`           | -              |
| rows                 | 显示行数                | `number`           | -              |
| maxlength            | 最大输入长度            | `number`           | -              |
| showWordLimit        | 是否显示字数统计        | `boolean`          | -              |
| status               | 控件状态（禁用/只读用此属性） | `"default" \| "disabled" \| "readonly"` | `"default"` |
| showColon            | label 是否显示冒号      | `boolean`          | `true`         |
| autosize             | 自适应内容高度          | `boolean \| object`| `false`        |

> ⚠️ **没有 `disabled`/`clearable` 属性**。禁用用 `status="disabled"`。

---

## Events 事件

| 事件名            | 说明         | 回调参数          |
| ----------------- | ------------ | ----------------- |
| update:modelValue | v-model 更新 | `(value) => void` |
| input             | 输入时触发   | `(value) => void` |
| focus             | 获得焦点     | `() => void`      |
| blur              | 失去焦点     | `() => void`      |

> ⚠️ **没有 `change` 事件**。监听输入用 `@input` / `@update:modelValue`。

---

## 常见场景

### 场景 1：表单备注

```vue
<jh-textarea v-model="form.remark" placeholder="请输入备注" />
```

### 场景 2：带字数限制

```vue
<jh-textarea
  v-model="form.description"
  :maxlength="500"
  show-word-limit
  placeholder="请输入描述（最多500字）"
/>
```

### 场景 3：BaseQuery / BaseForm 配置式用法

```ts
import { BusLogicDataType } from "@jhlc/types/src/logical-data";

export const formItems: BaseFormItemDesc<any>[] = [
  {
    name: "remark",
    label: "备注",
    logicType: BusLogicDataType.textarea,
    // 自动渲染为 jh-textarea
  },
];
```

> **源码映射**（`getFormItemByLogicType`）：`BusLogicDataType.textarea` → `jh-textarea`

---

## 与 el-input 对比

### 使用 jh-textarea（推荐）

```vue
<jh-textarea v-model="form.remark" />
```

✅ 统一样式风格
✅ 简化配置

### 使用 el-input（不推荐）

```vue
<el-input v-model="form.remark" type="textarea" :rows="3" />
```

❌ 需要每次指定 `type="textarea"`
❌ 样式与交互可能不统一

---

## 最佳实践

1. **表单中长文本字段统一使用 jh-textarea**
   - 与 `jh-select`、`jh-date` 等保持一致的组件体系

2. **配合 logicType 使用**
   - 配置式表单中使用 `logicType: BusLogicDataType.textarea`
   - 框架自动渲染为 `jh-textarea`

3. **详情页展示使用 jh-text**
   - 编辑：`jh-textarea`
   - 展示：`jh-text`

---

## 注意事项

1. **仅用于编辑场景**
   - 详情/只读展示使用 `jh-text`

2. **长度限制建议配合后端校验**
   - 前端 `maxlength` 仅做交互限制

---

## 🚀 快速开始

1. 直接使用 v-model 绑定字段
2. 配置式表单使用 `logicType: BusLogicDataType.textarea`
3. 详情展示统一使用 `jh-text`

**推荐作为平台统一的多行文本输入组件使用！**
