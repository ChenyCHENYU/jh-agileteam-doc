# jh-tabs - 标签页组件

> 平台统一的标签页组件，支持多种风格（卡片/边框/书签）、位置、可关闭可新增，适用于内容分区、多面板切换等场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-tabs />`。

---

## 基本用法

### 1️⃣ 基础标签页（最常用）

```vue
<template>
  <jh-tabs v-model="activeName">
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

const activeName = ref("base");
</script>
```

---

### 2️⃣ 卡片风格 + 可关闭/新增

```vue
<jh-tabs v-model="activeName" type="card" closable addable @tab-remove="onRemove" @tab-add="onAdd">
  <jh-tabs-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name" closable>
    {{ tab.content }}
  </jh-tabs-pane>
</jh-tabs>
```

---

## Props 属性

> 来源：`schema-component/base-container-group/tabs/props.ts`（基本属性 · 基础）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 数据绑定 | `string \| number` | - |
| _show | 是否展示 | `boolean` | `true` |
| type | 选项卡样式 | `string` | `""` |
| tabPosition | 位置 | `string` | `"top"` |
| closable | 可关闭 | `boolean` | - |
| addable | 可增加 | `boolean` | - |
| stretch | 自适应 | `boolean` | - |
| children | 标签项 | `array` | - |

> ⚠️ **没有 `editable`/`tab-type` 属性**。可关闭/可新增用 `closable`/`addable`；风格用 `type`。

---

## Events 事件

| 事件名            | 说明                | 回调参数 |
| ----------------- | ------------------- | -------- |
| update:modelValue | 激活项改变时触发    | `(value) => void` |
| tabClick          | 点击标签时触发      | `() => void` |
| tabChange         | 切换标签时触发      | `() => void` |
| tabRemove         | 移除标签时触发      | `() => void` |
| tabAdd            | 点击新增时触发      | `() => void` |
| edit              | 编辑（新增/移除）时触发 | `() => void` |

---

## 常见场景

### 场景 1：详情分区切换

```vue
<jh-tabs v-model="active">
  <jh-tabs-pane label="基本信息" name="base" />
  <jh-tabs-pane label="操作记录" name="log" />
  <jh-tabs-pane label="关联数据" name="rel" />
</jh-tabs>
```

### 场景 2：卡片风格（可关闭的页签）

```vue
<jh-tabs v-model="active" type="card" closable @tab-remove="onRemove">
  <jh-tabs-pane v-for="t in tabs" :key="t.name" :label="t.title" :name="t.name" />
</jh-tabs>
```

### 场景 3：左侧/底部标签

```vue
<jh-tabs v-model="active" tab-position="left" />
```

---

## 注意事项

1. **用 v-model 绑定激活项**
   - 对应 `modelValue`（`string | number`），值为 `<jh-tabs-pane>` 的 `name`

2. **每个 pane 必须有 `name`**
   - `name` 是激活项的唯一标识，配合父组件 `v-model`

3. **关闭/新增能力**
   - `closable` 显示关闭按钮，配合 `@tab-remove`
   - `addable` 显示新增按钮，配合 `@tab-add`

4. **风格类型**
   - 不传 `type` 为默认（线条）风格
   - `card`（卡片）/ `border-card`（带边框卡片）/ `bookmark-card`（书签）

**推荐作为平台统一的标签页组件使用！**
