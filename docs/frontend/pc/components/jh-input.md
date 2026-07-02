# jh-input - 输入框组件

> 平台统一的文本输入框组件，支持 label/冒号、状态控制、标签搜索、前后图标、密码/字数限制等，适用于表单录入、查询条件等场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-input />`。

---

## 基本用法

### 1️⃣ 基础输入（最常用）

```vue
<template>
  <jh-input v-model="form.name" label="姓名" placeholder="请输入姓名" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({ name: "" });
</script>
```

---

### 2️⃣ 禁用 / 只读（用 status）

```vue
<jh-input v-model="form.code" label="编码" :status="isView ? 'readonly' : 'default'" />
<jh-input v-model="form.locked" label="锁定" status="disabled" />
```

> 控件状态用 `status`（`"default" | "disabled" | "readonly"`），不是仅 `disabled`。

---

### 3️⃣ 标签搜索输入

```vue
<jh-input
  v-model="keywords"
  tag-search
  :data-type="'array'"
  prefix-icon="Search"
  @keyup-enter="onSearch"
/>
```

`tag-search` 开启标签输入模式，回车生成标签。

---

## Props 属性

| 参数             | 说明                          | 类型                                            | 默认值 |
| ---------------- | ----------------------------- | ----------------------------------------------- | ------ |
| modelValue / v-model | 绑定值                    | `string \| number \| array`                     | -      |
| label            | label 文本                    | `string`                                        | `""`   |
| showColon        | label 是否显示冒号            | `boolean`                                       | `true` |
| prop             | 表单字段（校验用）            | `array`                                         | -      |
| placeholder      | 占位提示                      | `string`                                        | `""`   |
| tip              | 提示信息                      | `string`                                        | -      |
| defaultValue     | 默认值                        | `string`                                        | -      |
| status           | 控件状态                      | `"default" \| "disabled" \| "readonly"`         | `""`   |
| disabled         | 是否禁用（建议用 status）     | `boolean`                                       | -      |
| size             | 控件尺寸                      | `"small" \| "default" \| "large"`               | `""`   |
| labelWidth       | label 宽度                    | `string`                                        | -      |
| maxWidth         | 最大宽度                      | `string`                                        | `""`   |
| labelClass       | label 自定义类名              | `array`                                         | `[]`   |
| appendText       | 后置文本                      | `string`                                        | -      |
| maxlength        | 最大输入长度                  | `number`                                        | -      |
| clearable        | 是否可清空                    | `boolean`                                       | -      |
| showPassword     | 是否显示密码切换              | `boolean`                                       | -      |
| showWordLimit    | 是否显示字数统计              | `boolean`                                       | -      |
| prefixIcon       | 前置图标                      | `"Search" \| "Edit" \| "Delete" \| "Plus" \| "Refresh"` | - |
| suffixIcon       | 后置图标                      | `"Search" \| "Edit" \| "Delete" \| "Plus" \| "Refresh"` | - |
| viewer           | 是否为只读查看态              | `boolean`                                       | `false` |
| ctrlHidden       | 控件隐藏表达式                | `string`                                        | -      |
| tagSearch        | 是否开启标签搜索模式          | `boolean`                                       | -      |
| maxCollapseTags  | 折叠标签最大数                | `number`                                        | -      |
| dataType         | 标签模式返回类型              | `"array" \| "string"`                           | `""`   |
| splitChar        | 标签字符串分隔符              | `string`                                        | `""`   |
| preventTagEnter  | 标签模式下阻止回车生成        | `boolean`                                       | -      |
| preventTagDelete | 标签模式下阻止退格删除        | `boolean`                                       | -      |

> ⚠️ **禁用/只读统一用 `status`**（`"disabled"` / `"readonly"`）。组件同时声明了 `disabled`，但推荐用 `status` 统一管控。
> ⚠️ **图标仅限内置枚举**：`"Search" | "Edit" | "Delete" | "Plus" | "Refresh"`。

---

## Events 事件

| 事件名            | 说明                  | 回调参数                              |
| ----------------- | --------------------- | ------------------------------------- |
| update:modelValue | v-model 更新时触发    | `(value: string \| number \| array) => void` |
| input             | 输入时触发            | `() => void`                          |
| inputUpdate       | 输入更新时触发        | `() => void`                          |
| change            | 值改变时触发          | `() => void`                          |
| blur              | 失去焦点时触发        | `() => void`                          |
| focus             | 获得焦点时触发        | `() => void`                          |
| clear             | 清空时触发            | `() => void`                          |
| keyupEnter        | 回车时触发            | `() => void`                          |
| submit            | 提交时触发            | `() => void`                          |

---

## 常见场景

### 场景 1：表单录入

```vue
<jh-input v-model="form.title" label="标题" placeholder="请输入标题" maxlength="50" show-word-limit />
```

### 场景 2：只读查看态

```vue
<jh-input v-model="form.creator" label="创建人" status="readonly" />
```

### 场景 3：密码输入

```vue
<jh-input v-model="form.password" label="密码" show-password />
```

### 场景 4：标签关键词搜索

```vue
<jh-input v-model="keywords" tag-search prefix-icon="Search" @keyup-enter="onSearch" />
```

---

## 注意事项

1. **状态用 `status`，不要只用 `disabled`**
   - `status="disabled"` 禁用，`status="readonly"` 只读，`status="default"` 正常
   - 组件同时声明了 `disabled`，但推荐统一用 `status`

2. **label 默认带冒号**
   - `showColon` 默认 `true`，label 后会显示冒号；不需冒号传 `:show-colon="false"`

3. **查看态两种方式**
   - `status="readonly"`（仍可聚焦复制）或 `viewer`（纯展示，默认 `false`）

4. **图标仅限内置枚举**
   - `prefixIcon`/`suffixIcon` 取值 `"Search" | "Edit" | "Delete" | "Plus" | "Refresh"`

5. **回车搜索监听 `@keyup-enter`**
   - 标签模式默认回车生成标签，可用 `prevent-tag-enter` 阻止

**推荐作为平台统一的文本输入组件使用！**
