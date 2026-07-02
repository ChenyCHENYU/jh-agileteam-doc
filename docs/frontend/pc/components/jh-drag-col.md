# jh-drag-col - 左右分栏布局组件

> 平台统一的左右（水平）分栏布局容器，支持拖拽调整左右两区比例/宽度，适用于左树右表、左列表右详情等场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-drag-col />`。

---

## 基本用法

### 1️⃣ 左右分栏（最常用）

```vue
<template>
  <jh-drag-col :left-percent="0.3">
    <template #left>
      <!-- 左区：树/列表 -->
      <c-tree :data="treeData" />
    </template>
    <template #right>
      <!-- 右区：表格/详情 -->
      <BaseTable :data="tableData" :columns="columns" />
    </template>
  </jh-drag-col>
</template>
```

通过中间拖拽条可动态调整左右两区的宽度比例。

---

### 2️⃣ 固定左侧宽度

```vue
<jh-drag-col :left-width="280">
  <template #left>左侧固定 280px</template>
  <template #right>右侧自适应</template>
</jh-drag-col>
```

---

## Props 属性

> 基础属性来自 `schema-component/base-container-group/drag-col/props.ts`（基本属性 · 基础）；
> `slider*` 样式属性为骨架组件 `common-core/src/components/drag-col/drag-col.vue` 补充。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| width | 宽度 | `string` | `"400px"` |
| height | 高度 | `string` | `"400px"` |
| leftPercent | 左区占比 | `number` | - |
| leftWidth | 左区宽度 | `number` | - |
| rightPercent | 右区占比 | `number` | - |
| rightWidth | 右区宽度 | `number` | - |
| sliderWidth | 拖拽条宽度 | `number` | `10` |
| sliderColor | 拖拽条颜色 | `string` | `"#6f808d"` |
| sliderBgColor | 拖拽条背景色 | `string` | `"#a7caec"` |
| sliderHoverColor | 拖拽条 hover 颜色 | `string` | `"#6f808d"` |
| sliderBgHoverColor | 拖拽条 hover 背景色 | `string` | `"#c8dcea"` |

> ⚠️ **比例（`leftPercent`/`rightPercent`）与固定宽度（`leftWidth`/`rightWidth`）二选一**，不要同时设置。
> ℹ️ `sliderWidth`/`sliderColor` 等 `slider*` 样式属性来自骨架组件 `drag-col.vue`，schema 声明层（props.ts）未声明。

---

## Slots 插槽

| 插槽名 | 说明     |
| ------ | -------- |
| left   | 左区内容 |
| right  | 右区内容 |

---

## Events 事件

> 无事件。`jh-drag-col` 是纯布局容器，仅通过 slots 渲染左右两区内容，不向外抛事件。

---

## 常见场景

### 场景 1：左树右表

```vue
<jh-drag-col :left-percent="0.25">
  <template #left>
    <c-tree :data="deptTree" @node-click="onNodeClick" />
  </template>
  <template #right>
    <BaseTable :data="userList" :columns="columns" />
  </template>
</jh-drag-col>
```

### 场景 2：左列表右详情

```vue
<jh-drag-col :left-width="320">
  <template #left>
    <BaseTable :data="orderList" :columns="orderColumns" />
  </template>
  <template #right>
    <BaseForm :form="currentOrder" :items="detailItems" />
  </template>
</jh-drag-col>
```

### 场景 3：按比例分配

```vue
<jh-drag-col :left-percent="0.4" :right-percent="0.6">
  <template #left>左区 40%</template>
  <template #right>右区 60%</template>
</jh-drag-col>
```

---

## 与 jh-drag-row 的关系

| 组件        | 方向 | 适用场景           |
| ----------- | ---- | ------------------ |
| jh-drag-row | 垂直 | 上下分栏（主从表） |
| jh-drag-col | 水平 | 左右分栏（左树右表）|

两者结构相似，仅拖拽方向不同（`row-resize` vs `col-resize`）。

---

## 注意事项

1. **宽度链必须打通**
   - 容器父级需有明确宽度（flex/固定宽），内部用 flex 撑满

2. **百分比与固定值二选一**
   - `leftPercent`/`rightPercent`（百分比，随容器缩放）与 `leftWidth`/`rightWidth`（固定值）不要同时设置

3. **不要与 jh-drag-row 混淆**
   - `jh-drag-col` = 左右分栏（垂直拖拽条，cursor: col-resize）
   - `jh-drag-row` = 上下分栏（水平拖拽条，cursor: row-resize）

**推荐作为平台统一的左右分栏布局组件使用！**
