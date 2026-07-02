# jh-dialog - 对话框组件

> 平台统一的弹窗对话框组件，支持标题栏拖拽、全屏切换、自定义头尾，适用于表单弹窗、确认操作、详情查看等场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-dialog />`。

---

## 基本用法

### 1️⃣ 基础弹窗（最常用）

```vue
<template>
  <jh-dialog v-model="visible" title="编辑用户" width="856px">
    <BaseForm :form="formData" :items="formItems" />
    <template #footer>
      <jh-button type="primary" @click="onConfirm">确定</jh-button>
      <jh-button @click="visible = false">取消</jh-button>
    </template>
  </jh-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
</script>
```

---

### 2️⃣ 默认全屏 + 切换按钮

```vue
<jh-dialog
  v-model="visible"
  title="数据详情"
  fullscreen
  :is-show-switch-full="true"
/>
```

`isShowSwitchFull` 控制标题栏右侧是否显示「全屏/还原」切换按钮。

---

## Props 属性

| 参数                | 说明                          | 类型                                            | 默认值  |
| ------------------- | ----------------------------- | ----------------------------------------------- | ------- |
| modelValue / v-model| 是否显示（支持 v-model）      | `boolean \| number`                             | -       |
| title               | 标题                          | `string`                                        | -       |
| width               | 宽度                          | `string`（可选值 `"450px" \| "856px" \| "1000px"` 或自定义） | `""` |
| top                 | 距离顶部位置                  | `string`                                        | `""`    |
| modalClass          | 遮罩层自定义类名              | `string \| string[]`                            | -       |
| modal               | 是否显示遮罩层                | `boolean`                                       | `true`  |
| alignCenter         | 是否水平垂直居中              | `boolean`                                       | `true`  |
| renderHeader        | 是否渲染默认标题栏            | `boolean`                                       | `true`  |
| renderFooter        | 是否渲染默认底部              | `boolean`                                       | `true`  |
| draggable           | 是否可拖拽（整体）            | `boolean`                                       | `true`  |
| titleDraggable      | 标题栏是否可拖拽              | `boolean`                                       | -       |
| fullscreen          | 是否默认全屏                  | `boolean`                                       | -       |
| isShowSwitchFull    | 是否显示全屏切换按钮          | `boolean`                                       | `false` |
| appendToBody        | 是否插入 body                 | `boolean`                                       | -       |
| lockScroll          | 是否锁定滚动                  | `boolean`                                       | -       |
| closeOnClickModal   | 点击遮罩层是否关闭            | `boolean`                                       | -       |
| closeOnPressEscape  | 按 ESC 是否关闭               | `boolean`                                       | `true`  |

> ⚠️ **没有 `visible` 属性**。开关用 `v-model`（对应 `modelValue`）；禁用关闭交互用 `closeOnClickModal`/`closeOnPressEscape`。

---

## Events 事件

| 事件名            | 说明                 | 回调参数                |
| ----------------- | -------------------- | ----------------------- |
| update:modelValue | 显示状态改变时触发   | `(value: boolean) => void` |
| open              | 打开时触发（动画前） | `() => void`            |
| opened            | 打开动画结束时触发   | `() => void`            |
| close             | 关闭时触发（动画前） | `() => void`            |
| closed            | 关闭动画结束时触发   | `() => void`            |
| fullClick         | 点击全屏切换时触发   | `() => void`            |

---

## 常见场景

### 场景 1：表单编辑弹窗

```vue
<jh-dialog v-model="visible" title="编辑" width="856px">
  <BaseForm :form="form" :items="items" />
  <template #footer>
    <jh-button type="primary" @click="onSave">保存</jh-button>
    <jh-button @click="visible = false">取消</jh-button>
  </template>
</jh-dialog>
```

### 场景 2：点击遮罩不关闭（防误触）

```vue
<jh-dialog v-model="visible" :close-on-click-modal="false" title="确认操作" />
```

### 场景 3：超长内容全屏查看

```vue
<jh-dialog v-model="visible" title="详情" fullscreen />
```

---

## 注意事项

1. **用 v-model 控制显隐**
   - 对应 `modelValue`，类型 `boolean | number`
   - 不要用 `visible`/`show` 等属性

2. **关闭交互可控**
   - `closeOnClickModal`（点遮罩关闭）、`closeOnPressEscape`（ESC 关闭）默认行为按声明，需关闭时显式传 `false`

3. **全屏能力**
   - `fullscreen` 控制默认是否全屏
   - `isShowSwitchFull` 控制是否给用户全屏切换按钮（默认 `false`）

4. **默认居中且可拖拽**
   - `alignCenter` 默认 `true`（垂直居中）
   - `draggable` 默认 `true`，无需额外配置即可拖拽

**推荐作为平台统一的弹窗组件使用！**
