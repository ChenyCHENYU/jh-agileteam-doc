# jh-progress - 进度条组件

> 平台统一的进度条组件，支持线性/环形、百分比、状态色、自定义颜色数组、动态（不定）进度，适用于上传/下载/任务进度等展示场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-progress />`。

---

## 基本用法

### 1️⃣ 线性进度条（最常用）

```vue
<template>
  <jh-progress :percentage="progress" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const progress = ref(60);
</script>
```

`percentage` 控制百分比（默认 `30`）。

---

### 2️⃣ 环形进度条

```vue
<jh-progress :percentage="75" type="circle" />
```

`type="circle"` 渲染为环形。

---

### 3️⃣ 状态色 / 自定义颜色

```vue
<!-- 成功状态 -->
<jh-progress :percentage="100" status="success" />

<!-- 自定义颜色梯度 -->
<jh-progress :percentage="80" is-customcolor :color-arr="colorArr" />
```

`isCustomcolor` 开启自定义颜色，`colorArr` 指定不同百分比的渐变色。

---

### 4️⃣ 动态（不定）进度

```vue
<jh-progress indeterminate :duration="3" />
```

`indeterminate` 开启不定进度动画（加载中场景）。

---

## Props 属性

> 来源：`schema-component/base-guide-group/progress/props.ts`（基本属性 · 基础）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 形状 | `string` | `"line"` |
| textInside | 内容位置 | `boolean` | `false` |
| percentage | 当前进度(%) | `number` | `30` |
| status | 状态 | `string` | `""` |
| strokeWidth | 进度高度 / 环高度 | `number` | `6` |
| indeterminate | 动画效果 | `boolean` | `false` |
| duration | 动画速度 | `number` | `5` |
| isCustomcolor | 进度颜色 | `boolean` | `false` |
| color | 纯色 | `string` | - |
| colorArr | 颜色数据（根据示例代码自定义设置颜色和百分比） | `array` | - |
| isFormat | 自定义文字 | `boolean` | `false` |
| format | 格式函数 | `string` | `function formatter(percentage) { return '自定义:' + percentage + '%'; }` |

> ⚠️ **默认百分比 `30`、宽度 `6`、动画周期 `5` 秒**，使用时按需覆盖。
> ⚠️ **没有 `show-text`/`width`(环形直径) 属性**（声明层未声明）。文字内显用 `text-inside`。
> **`colorArr` 内置梯度**：`20%红 → 40%橙 → 60%绿 → 80%蓝 → 100%紫`。

---

## Events 事件

> 无事件。`jh-progress` 是纯展示组件，不向外抛事件。

---

## 常见场景

### 场景 1：上传进度

```vue
<jh-progress :percentage="uploadPercent" :status="uploadPercent === 100 ? 'success' : ''" />
```

### 场景 2：环形进度

```vue
<jh-progress :percentage="completeRate" type="circle" />
```

### 场景 3：加载中（动态进度）

```vue
<jh-progress indeterminate :duration="3" status="warning" />
```

### 场景 4：自定义颜色梯度

```vue
<jh-progress
  :percentage="70"
  is-customcolor
  :color-arr="[
    { color: '#f56c6c', percentage: 20 },
    { color: '#e6a23c', percentage: 40 },
    { color: '#5cb87a', percentage: 60 },
    { color: '#1989fa', percentage: 80 },
    { color: '#6f7ad3', percentage: 100 }
  ]"
/>
```

---

## 注意事项

1. **百分比用 `percentage`**
   - 取值 0-100，默认 `30`，需动态更新时绑定响应式数据

2. **类型与状态**
   - `type`：`"line"`（线性）/ `"circle"`（环形），不传默认线性
   - `status`：`"success"` / `"warning"` / `"exception"`，会改变进度条颜色

3. **自定义颜色**
   - `is-customcolor` 开启后用 `colorArr`（`{ color, percentage }` 数组）做渐变
   - 单一颜色用 `color`

4. **动态进度用 `indeterminate`**
   - 加载中、无法确定具体进度时使用，`duration` 控制动画周期（秒）

5. **文字内显**
   - `text-inside` 控制百分比文字是否显示在进度条内部（默认 `false`）

6. **无事件**
   - 进度条仅展示，不抛事件；进度更新由外部数据驱动

**推荐作为平台统一的进度展示组件使用！**
