# jh-drawer - 抽屉组件

> 平台统一的抽屉组件，支持四个方向滑出、标题拖拽、全屏切换、关闭销毁，适用于详情侧滑、复杂表单、筛选面板等场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-drawer />`。

---

## 基本用法

### 1️⃣ 右侧抽屉（最常用）

```vue
<template>
  <jh-drawer v-model="visible" title="订单详情" size="594px">
    <BaseForm :form="detail" :items="detailItems" />
    <template #footer>
      <jh-button type="primary" @click="onConfirm">确定</jh-button>
      <jh-button @click="visible = false">取消</jh-button>
    </template>
  </jh-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
</script>
```

---

### 2️⃣ 指定方向 + 自定义偏移

```vue
<jh-drawer v-model="visible" title="筛选" direction="rtl" size="356px" drawer-top="60px" />
```

`direction` 控制滑出方向，`drawer-top`/`drawer-right`/`drawer-left`/`drawer-bottom` 控制对应边距。

---

## Props 属性

**基础**

| 参数      | 说明     | 类型     | 默认值         |
| --------- | -------- | -------- | -------------- |
| title     | 标题名称 | `string` | `"Drawer标题"` |
| size      | 宽度     | `string` | `"40%"`        |
| direction | 弹出方向 | `string` | `"rtl"`        |

**主要属性**

| 参数                  | 说明                                                             | 类型      | 默认值 |
| --------------------- | ---------------------------------------------------------------- | --------- | ------ |
| modelValue / v-model  | 是否显示                                                         | `boolean` | -      |
| withHeader            | 显示顶部栏                                                       | `boolean` | `true` |
| withFooter            | 显示底部栏                                                       | `boolean` | `true` |
| titleDraggable        | 定制标题                                                         | `boolean` | -      |
| modal                 | 显示遮罩                                                         | `boolean` | `true` |
| appendToBody          | body内（自身是否插入至 body 元素，嵌套必须为 `true`）            | `boolean` | -      |
| destroyOnclose        | 关闭销毁（关闭后是否将子元素全部销毁）                           | `boolean` | `true` |
| lockScroll            | 锁定滚动（出现时是否将 body 滚动锁定）                           | `boolean` | -      |

**交互配置**

| 参数               | 说明                                       | 类型      | 默认值  |
| ------------------ | ------------------------------------------ | --------- | ------- |
| isShowSwitchFull   | 切换全屏（是否展示头部切换全屏功能）       | `boolean` | `false` |
| closeOnClickModal  | 外部关闭（是否可点击抽屉外部区域关闭）     | `boolean` | -       |
| closeOnPressEscape | esc关闭（是否可按下 ESC 关闭）             | `boolean` | `true`  |
| drawerTop          | 头部位置                                   | `string`  | `"0px"` |
| drawerRight        | 右侧位置                                   | `string`  | `"0px"` |
| drawerLeft         | 左侧位置                                   | `string`  | `"0px"` |
| drawerBottom       | 底部位置                                   | `string`  | `"0px"` |

> ⚠️ **没有 `visible`/`width` 属性**。开关用 `v-model`（对应 `modelValue`）；尺寸用 `size`（不是 `width`）。

---

## Events 事件

| 事件名            | 说明                 | 回调参数                   |
| ----------------- | -------------------- | -------------------------- |
| update:modelValue | 显示状态改变时触发   | `(value: boolean) => void` |
| open              | 打开时触发（动画前） | `() => void`               |
| opened            | 打开动画结束时触发   | `() => void`               |
| close             | 关闭时触发（动画前） | `() => void`               |
| closed            | 关闭动画结束时触发   | `() => void`               |
| fullClick         | 点击全屏切换时触发   | `() => void`               |

---

## 常见场景

### 场景 1：详情侧滑面板

```vue
<jh-drawer v-model="visible" title="详情" size="720px" direction="rtl">
  <BaseForm :form="detail" :items="items" />
  <template #footer>
    <jh-button type="primary" @click="visible = false">关闭</jh-button>
  </template>
</jh-drawer>
```

### 场景 2：顶部下拉筛选

```vue
<jh-drawer v-model="visible" title="高级筛选" direction="ttb" size="300px" />
```

### 场景 3：嵌入导航栏下方（顶部偏移）

```vue
<jh-drawer v-model="visible" title="通知" size="356px" direction="rtl" drawer-top="60px" />
```

---

## 注意事项

1. **用 v-model 控制显隐**
   - 对应 `modelValue`（`boolean`），不要用 `visible`/`show`

2. **尺寸用 `size` 不是 `width`**
   - `size` 可选 `"356px" | "594px" | "720px"` 或自定义值
   - `direction="rtl"/"ltr"` 时 size 为宽度；`"ttb"/"btt"` 时为高度

3. **方向说明**
   - `rtl`（右侧滑出，最常用）/ `ltr`（左侧）/ `ttb`（顶部下拉）/ `btt`（底部上拉）

4. **关闭默认销毁**
   - `destroyOnclose` 默认 `true`，关闭后销毁内部内容，重新打开会重新渲染
   - 需保留状态时设为 `false`

5. **顶部偏移**
   - `drawer-top` 可让抽屉从导航栏下方开始（如 `"60px"`），常用于内嵌布局

**推荐作为平台统一的抽屉组件使用！**
