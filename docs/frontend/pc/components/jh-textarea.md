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

### 基础属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 数据绑定 | `string \| number` | - |
| label | 标题名称 | `string` | `多行输入框` |
| showColon | 标题与输入框之间加英文冒号 | `boolean` | `true` |
| prop | 字段属性，用于表单校验确定字段，选择字段后自动设置数据绑定 | `array` | - |
| placeholder | 占位提示 | `string` | `请输入` |
| tip | 描述性文案 | `string` | - |
| defaultValue | 默认值 | `string` | - |
| status | 状态 | `string` | `default` |
| size | 尺寸 | `string` | `default` |
| labelWidth | 标签宽度（styleY 样式，如 500px、100%，默认 450px） | `string` | - |
| maxWidth | 最大宽度（styleY 样式，如 500px、100%，默认 450px） | `string` | `450px` |
| viewer | 阅读模式，将输入框渲染为 span | `boolean` | `false` |
| labelClass | 标签样式 | `array` | `[]` |
| appendText | 后缀 | `string` | - |
| rows | 默认行数 | `number` | - |
| autosize | 高度自适应 | `boolean \| object` | `false` |
| maxlength | 最大输入长度 | `number` | - |
| showWordLimit | 显示字数统计 | `boolean` | - |
| userRemember | 用户输入记忆 | `boolean` | - |

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
