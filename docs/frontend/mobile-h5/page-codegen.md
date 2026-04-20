# ④ 页面代码生成 page-codegen

> 触发词：`生成页面` / `生成代码` / `帮我写页面`

根据 page-spec.json + 接口规格，一键生成完整的页面代码，严格遵循**三文件分离原则**。

---

## 输入

- `page-spec.json` + `api-spec/{module}.md`
- 或直接从详设文档 / 原型描述

## 输出

每个页面生成一组文件：

```
src/views/{domain}/{module}/
├── index.vue      ← 主页面（script setup 在上，template 在下，禁止 <style>）
├── index.scss     ← 样式（BEM 命名，--ds-* 令牌）
├── data.ts        ← 类型 + 常量映射 + Mock 数据
├── detail.vue     ← 详情页（如有）
├── detail.scss
├── form.vue       ← 表单页（如有）
└── form.scss
```

---

## 页面模板

### TPL-LIST — 搜索 + Tab + 卡片列表

参考：`src/views/demo/customer/index.vue`

```
C_NavBar
├── 搜索区（VanField + magnifying-glass 图标）
├── VanTabs shrink（TAB_LIST 数据驱动）
├── 卡片列表 v-for
│   ├── head：编号 VanTag + 状态 VanTag
│   ├── name：主标题
│   ├── meta：联系人 / 业务员 / 创建人
│   └── ops：操作按钮（条件显示）
├── VanEmpty 空状态
└── footer：VanButton 新增
```

### TPL-DETAIL — 信息展示

参考：`src/views/demo/customer/detail.vue`

```
C_NavBar
├── header 信息卡
│   ├── 编号 VanTag + 状态 VanTag
│   ├── 名称
│   ├── 操作按钮（转化/编辑等）
│   └── 关键 meta 信息
└── section × N（VanCellGroup inset）
    └── VanCell × N
```

### TPL-FORM — 分区表单（Liquid Glass 风格）

参考：`src/views/demo/c-form/index.vue`

```
hero 头部（渐变背景 + 标题 + 说明）
├── VanForm
│   └── card × N
│       ├── card-label（图标 + 分区标题，FORM_SECTIONS 数据驱动）
│       ├── VanField × N（输入字段）
│       ├── 自定义 pill 选择器（紧急程度等）
│       └── 自定义 chip 选择器（多选标签等）
└── footer（取消 + 提交按钮）
```

---

## 文件结构规范

```vue
<template>
<!-- 模板内容 -->
</template>
<!-- 禁止 <style> 块 -->

<script setup lang="ts">
import './index.scss';
import { ... } from 'vant';
import { ... } from './data';

defineOptions({ name: 'PageName' });
// 逻辑代码
</script>
```

---

## 样式规范

| 规则 | 说明 |
|---|---|
| 禁止硬编码 | 颜色/圆角/阴影必须用 `var(--ds-xxx)` 令牌 |
| BEM 命名 | `.{page-name}__{element}--{modifier}` |
| 间距网格 | 4px 网格：4 / 8 / 12 / 16 / 20 / 24 / 32 |
| 字号梯度 | 11 / 12 / 13 / 14 / 15 / 16 / 17 / 20 / 22 / 28 / 34 |
| 底部安全区 | `padding-bottom: calc(Xpx + env(safe-area-inset-bottom))` |
| 毛玻璃卡片 | `--ds-glass-bg` / `--ds-glass-blur` / `--ds-glass-border` |

---

## 组件使用规范

| 场景 | 用法 |
|---|---|
| 导航栏 | `<C_NavBar title="xxx" />` 必须作为页面第一个子元素 |
| 图标 | UnoCSS 类名 `i-ph:{name}-bold`，禁止 CDN |
| 状态标签 | `<VanTag :type round size="medium">`，通过 `STATUS_MAP` 映射 |
| 表单 | `<VanForm :show-error="false" scroll-to-error>` |
| Picker | `<VanPopup position="bottom" round>` + `<VanPicker :columns>` |

---

## data.ts 规范

```ts
// 类型定义
export interface Customer { id: number; name: string; ... }

// 常量映射（状态 → 标签色）
export const STATUS_MAP: Record<string, { text: string; type: string }> = {
    converted: { text: '已转化', type: 'success' },
    unconverted: { text: '未转化', type: 'warning' },
};

// 静态数据（驱动 v-for）
export const TAB_LIST = [
    { key: 'all', label: '全部' },
    { key: 'important', label: '重要客户' },
];

// Mock 数据（6-10 条，覆盖所有枚举值）
export const MOCK_CUSTOMERS: Customer[] = [ ... ];
```

---

## 生成后检查清单

- [ ] 原型对比：字段完整、按钮文案一致、状态标签齐全
- [ ] 类型检查：`pnpm type-check` 零错误
- [ ] 字段完整性：data.ts 的 interface 字段 ≥ 原型字段
- [ ] 接口无报错：Mock 端点与 API 配置一一对应
- [ ] 暗黑模式：切换后样式正常
- [ ] 安全区：底部固定栏有 `env(safe-area-inset-bottom)`

---

## 上下游

- 上游：[③ 接口约定](./api-contract)
- 下游：[⑤ 路由注册](./route-register)
