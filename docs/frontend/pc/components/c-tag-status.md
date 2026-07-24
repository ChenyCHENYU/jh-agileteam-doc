# C_TagStatus 状态标签组件

## 📖 简介

`C_TagStatus` 是一个统一的状态标签组件，基于 Element Plus 的 `el-tag` 封装，用于在表格、表单等场景中展示各种状态信息。

**特性**：

- ✅ 开箱即用，预配置了棒线材模块所有状态
- ✅ 视觉精致，圆角标签 + 语义化配色
- ✅ 类型安全，完整的 TypeScript 支持
- ✅ 易于扩展，支持自定义状态配置
- ✅ 性能优秀，组件级复用

---

## 🎨 效果预览

```
[待下达]  [已下达]  [执行中]  [已完成]  [已取消]
 灰色      蓝色      橙色      绿色      红色
```

---

## 🚀 快速开始

### 1. 基础用法（在模板中使用）

```vue
<template>
  <C_TagStatus :value="row.planStatus" type="plan" />
  <C_TagStatus :value="row.prodStatus" type="product" />
  <C_TagStatus :value="row.isHot" type="boolean" />
</template>
```

### 2. 在表格列中使用（推荐）

```typescript
import { renderPlanStatus, renderProductStatus } from '@/util/status-render';

// 方式1：使用预定义的渲染器
{
  label: "计划状态",
  name: "planStatus",
  minWidth: 120,
  customRender: (row) => renderPlanStatus(row, 'planStatus')
}

// 方式2：使用通用渲染函数
{
  label: "产品状态",
  name: "prodStatus",
  minWidth: 120,
  customRender: (row) => renderStatusTag(row, 'prodStatus', { type: 'product' })
}

// 方式3：自定义点击事件
{
  label: "材料状态",
  name: "matStatus",
  minWidth: 120,
  customRender: (row) => renderStatusTag(row, 'matStatus', {
    type: 'material',
    onClick: (row, value, event) => {
      console.log('点击了状态', row, value);
    }
  })
}
```

---

## 📝 组件属性

| 属性          | 说明       | 类型                          | 可选值                                                     | 默认值  |
| ------------- | ---------- | ----------------------------- | ---------------------------------------------------------- | ------- |
| value         | 状态值     | `string \| number \| boolean` | -                                                          | -       |
| type          | 状态类型   | `StatusType \| string`        | plan/product/material/process/sampling/sample/slab/boolean | -       |
| size          | 尺寸       | `string`                      | large/default/small                                        | `small` |
| round         | 是否圆角   | `boolean`                     | -                                                          | `true`  |
| closable      | 是否可关闭 | `boolean`                     | -                                                          | `false` |
| defaultEffect | 默认效果   | `TagEffect`                   | light/dark/plain                                           | `light` |

---

## 🎯 状态类型说明

### 1. 计划状态 (plan)

**字典**: `mmwrMillPlanStatus` / `mmwrFinishPlanStatus`

| 状态值 | 显示文本 | 颜色 |
| ------ | -------- | ---- |
| 0      | 待下达   | 灰色 |
| 1      | 已下达   | 蓝色 |
| 2      | 执行中   | 橙色 |
| 3      | 已完成   | 绿色 |
| 4      | 已取消   | 红色 |
| A      | 待入炉   | 灰色 |
| B      | 已入炉   | 蓝色 |
| C      | 待完轧   | 橙色 |
| D      | 已完轧   | 绿色 |

### 2. 产品状态 (product)

**字典**: `mmwrProdStatus`

| 状态值 | 显示文本 | 颜色 |
| ------ | -------- | ---- |
| 0      | 待加工   | 灰色 |
| 1      | 加工中   | 蓝色 |
| 2      | 已完成   | 绿色 |
| 3      | 合格品   | 深绿 |
| 4      | 不合格   | 红色 |
| A      | 待产出   | 灰色 |
| B      | 已产出   | 绿色 |
| C      | 产出完毕 | 深绿 |

### 3. 材料状态 (material)

**字典**: `mmwrMatStatus`

| 状态值 | 显示文本 | 颜色 |
| ------ | -------- | ---- |
| 0      | 在库     | 灰色 |
| 1      | 在线     | 蓝色 |
| 2      | 已使用   | 绿色 |
| 3      | 待检     | 橙色 |
| 4      | 异常     | 红色 |

### 4. 进程状态 (process)

**字典**: `mmwrProcessStatus`

| 状态值 | 显示文本 | 颜色 |
| ------ | -------- | ---- |
| 0      | 待上料   | 灰色 |
| 1      | 上料中   | 蓝色 |
| 2      | 已产出   | 绿色 |
| 3      | 已取消   | 红色 |
| A      | 待处理   | 灰色 |
| B      | 处理中   | 橙色 |
| C      | 已完成   | 绿色 |

### 5. 切取确认状态 (sampling)

**字典**: `mmwrSampLingStus`

| 状态值 | 显示文本 | 颜色 |
| ------ | -------- | ---- |
| 0      | 未确认   | 灰色 |
| 1      | 已确认   | 绿色 |
| 2      | 已取消   | 红色 |

### 6. 试样状态 (sample)

**字典**: `mmwrSampleStatus`

| 状态值 | 显示文本 | 颜色 |
| ------ | -------- | ---- |
| 0      | 待检验   | 灰色 |
| 1      | 检验中   | 橙色 |
| 2      | 已完成   | 绿色 |
| 3      | 不合格   | 红色 |

### 7. 出炉状态 (slab)

**字典**: `mmwrSlabStatus`

| 状态值 | 显示文本 | 颜色 |
| ------ | -------- | ---- |
| 0      | 待出炉   | 灰色 |
| 1      | 已出炉   | 绿色 |
| 2      | 在线     | 蓝色 |

### 8. 布尔状态 (boolean)

**用于**: 是/否 类型字段

| 状态值          | 显示文本 | 颜色 |
| --------------- | -------- | ---- |
| true/1/"1"/"Y"  | 是       | 绿色 |
| false/0/"0"/"N" | 否       | 灰色 |

---

## 🔧 高级用法

### 1. 扩展自定义状态

```typescript
import { registerStatusConfig } from "@/components/global/C_TagStatus/config";

// 注册新的状态类型
registerStatusConfig("custom", [
  { value: "1", label: "自定义状态1", type: "success" },
  { value: "2", label: "自定义状态2", type: "warning", color: "#FF6B6B" }
]);
```

### 2. 创建自定义渲染器

```typescript
import { createStatusRenderer } from '@/util/status-render';

// 创建自定义渲染器
const renderMyStatus = createStatusRenderer('custom', {
  size: 'small',
  effect: 'dark'
});

// 在表格中使用
{
  label: "自定义状态",
  name: "myStatus",
  customRender: (row) => renderMyStatus(row, 'myStatus')
}
```

---

## 📦 文件结构

```
C_TagStatus/
├── index.vue      # 组件主体
├── config.ts      # 状态配置（颜色映射表）
├── types.ts       # TypeScript 类型定义
└── README.md      # 使用文档（本文件）
```

---

## 💡 最佳实践

1. **统一使用预定义渲染器**：优先使用 `renderPlanStatus`、`renderProductStatus` 等预定义函数
2. **保持配置集中**：所有状态配置统一在 `config.ts` 中管理
3. **类型安全**：充分利用 TypeScript 类型检查，避免配置错误
4. **性能优化**：表格中大量使用时，组件会自动复用，无需担心性能问题

---

## 🐛 常见问题

### Q: 状态显示为原始值，没有颜色？

A: 检查 `type` 属性是否正确，以及状态值是否在配置表中。

### Q: 如何添加新的状态值？

A: 在 `config.ts` 中对应的状态类型数组中添加配置项。

### Q: 可以使用自定义颜色吗？

A: 可以，在配置中添加 `color` 属性，优先级高于 `type`。

---

## 📚 相关文档

- [Element Plus Tag 组件](https://element-plus.org/zh-CN/component/tag.html)
- 表格自定义渲染文档
