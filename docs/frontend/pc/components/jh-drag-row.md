# jh-drag-row - 上下分栏布局组件

> 平台统一的上下（垂直）分栏布局容器，支持拖拽调整上下两区比例，适用于主从表、上下双表格、详情+明细等场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-drag-row />`。

---

## 基本用法

### 1️⃣ 上下分栏（最常用）

```vue
<template>
  <jh-drag-row :top-height="300">
    <template #top>
      <!-- 上区：主表 -->
      <BaseTable :data="masterList" :columns="masterColumns" />
    </template>
    <template #bottom>
      <!-- 下区：从表 / 明细 -->
      <BaseTable :data="detailList" :columns="detailColumns" />
    </template>
  </jh-drag-row>
</template>
```

通过中间拖拽条可动态调整上下两区的高度比例。

---

## Props 属性

| 参数              | 说明                       | 类型     | 默认值     |
| ----------------- | -------------------------- | -------- | ---------- |
| topPercent        | 上区占比（0-1）            | `number` | -          |
| topHeight         | 上区固定高度               | `number` | -          |
| bottomHeight      | 下区固定高度               | `number` | -          |
| bottomPercent     | 下区占比（0-1）            | `number` | -          |
| sliderWidth       | 拖拽条宽度（px）           | `number` | `10`       |
| width             | 容器宽度                   | `string` | `"400px"`  |
| height            | 容器高度                   | `string` | `"400px"`  |
| isNest            | 是否嵌套使用               | `boolean`| -          |
| sliderColor       | 拖拽条颜色                 | `string` | `"#6f808d"`|
| sliderBgColor     | 拖拽条背景色               | `string` | `"#a7caec"`|
| sliderHoverColor  | 拖拽条 hover 颜色          | `string` | `"#6f808d"`|
| sliderBgHoverColor| 拖拽条 hover 背景色        | `string` | `"#c8dcea"`|

---

## Slots 插槽

| 插槽名 | 说明                           |
| ------ | ------------------------------ |
| top    | 上区内容                       |
| bottom | 下区内容                       |

---

## Events 事件

> 无事件。`jh-drag-row` 是纯布局容器，仅通过 slots 渲染上下两区内容，不向外抛事件。

---

## DOM 结构

```html
<div class="drager_row">
  <div class="drager_top">
    <!-- #top 插槽内容 -->
  </div>
  <div class="slider_row"></div>
  <div class="drager_bottom">
    <!-- #bottom 插槽内容 -->
  </div>
</div>
```

---

## 常见场景

### 场景 1：主从表（上下双表）

```vue
<jh-drag-row :top-percent="0.5">
  <template #top>
    <BaseTable :data="orderList" :columns="orderColumns" />
  </template>
  <template #bottom>
    <BaseTable :data="orderDetailList" :columns="detailColumns" />
  </template>
</jh-drag-row>
```

### 场景 2：表头 + 明细

```vue
<jh-drag-row :top-height="200">
  <template #top>
    <BaseForm :form="formData" :items="formItems" />
  </template>
  <template #bottom>
    <BaseTable :data="detailList" :columns="columns" />
  </template>
</jh-drag-row>
```

---

## 与 jh-drag-col 的关系

| 组件        | 方向 | 适用场景         |
| ----------- | ---- | ---------------- |
| jh-drag-row | 垂直 | 上下分栏（主从表）|
| jh-drag-col | 水平 | 左右分栏（左树右表）|

两者结构相似，仅拖拽方向不同（`row-resize` vs `col-resize`）。

---

## 注意事项

1. **高度链必须打通**
   - 容器父级需有明确高度（flex/固定高），`.drager_row` 内部用 flex 撑满
   - 配合 `topPercent` 按比例分配时，需确保容器有确定高度

2. **topPercent 与 topHeight 二选一**
   - `topPercent`（百分比）与 `topHeight`（固定值）不要同时设置
   - 百分比模式随容器缩放自适应，固定值模式高度不变

3. **不要与 jh-drag-col 混淆**
   - `jh-drag-row` = 上下分栏（水平拖拽条，cursor: row-resize）
   - `jh-drag-col` = 左右分栏（垂直拖拽条，cursor: col-resize）

**推荐作为平台统一的上下分栏布局组件使用！**
