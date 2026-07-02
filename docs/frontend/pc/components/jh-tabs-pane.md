# jh-tabs-pane - 标签页面板组件

> `<jh-tabs>` 的子项面板，用于定义单个标签页的标题、标识与内容，配合 `<jh-tabs>` 使用

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，必须作为 `<jh-tabs>` 的子组件使用 `<jh-tabs-pane />`。

---

## 基本用法

### 1️⃣ 基础面板（最常用）

```vue
<template>
  <jh-tabs v-model="active">
    <jh-tabs-pane label="基本信息" name="base">
      <BaseForm :form="form" :items="baseItems" />
    </jh-tabs-pane>
    <jh-tabs-pane label="扩展信息" name="extra">
      <BaseForm :form="form" :items="extraItems" />
    </jh-tabs-pane>
  </jh-tabs>
</template>

<script setup lang="ts">
import { ref } from "vue";

const active = ref("base");
</script>
```

---

### 2️⃣ 禁用 / 可关闭 / 懒加载

```vue
<jh-tabs-pane label="不可用" name="disabled" disabled />
<jh-tabs-pane label="可关闭" name="closable" closable />
<jh-tabs-pane label="懒加载" name="lazy" lazy />
```

`disabled` 禁用该标签；`closable` 单独开启关闭按钮；`lazy` 首次激活才渲染内容。

---

## Props 属性

| 参数     | 说明                          | 类型      | 默认值 |
| -------- | ----------------------------- | --------- | ------ |
| name     | 唯一标识（与父级 v-model 对应） | `string`  | -      |
| label    | 标签标题                      | `string`  | `""`   |
| disabled | 是否禁用                      | `boolean` | -      |
| closable | 是否可关闭                    | `boolean` | -      |
| lazy     | 是否懒加载（首次激活才渲染）  | `boolean` | -      |

> ⚠️ **`name` 必传**，作为父级 `<jh-tabs>` 的 `v-model` 激活值标识。
> **没有 `title`/`value` 属性**，标题用 `label`，标识用 `name`。

---

## Events 事件

> 无事件。面板切换由父级 `<jh-tabs>` 统一处理（监听 `@tab-change` / `@tab-click`）。

---

## 常见场景

### 场景 1：详情多分区

```vue
<jh-tabs v-model="active">
  <jh-tabs-pane label="基础" name="base" />
  <jh-tabs-pane label="联系" name="contact" />
  <jh-tabs-pane label="其它" name="other" />
</jh-tabs>
```

### 场景 2：懒加载重内容

```vue
<jh-tabs v-model="active">
  <jh-tabs-pane label="概览" name="overview" />
  <jh-tabs-pane label="大表（懒加载）" name="bigTable" lazy>
    <BigTable :data="bigData" />
  </jh-tabs-pane>
</jh-tabs>
```

### 场景 3：单标签可关闭

```vue
<jh-tabs v-model="active" type="card">
  <jh-tabs-pane label="固定" name="fixed" />
  <jh-tabs-pane label="临时" name="temp" closable />
</jh-tabs>
```

---

## 注意事项

1. **必须配合 `<jh-tabs>` 使用**
   - `<jh-tabs-pane>` 不能单独使用，需放在 `<jh-tabs>` 内

2. **`name` 是关键标识**
   - 与父级 `<jh-tabs v-model>` 的值对应，必须唯一且为字符串

3. **性能优化用 `lazy`**
   - 重内容面板设 `lazy`，避免初始即渲染，首次激活时才挂载

4. **标题用 `label`，不用插槽也可**
   - 简单文本直接用 `label`；复杂标题可使用默认插槽

**作为 `<jh-tabs>` 的标准子面板组件使用！**
