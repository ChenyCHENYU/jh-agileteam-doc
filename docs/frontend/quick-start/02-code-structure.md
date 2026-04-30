# 代码结构与顺序规范（02）

> **平台规范第 02 条** · 强制度：🔴 必遵。AI 生成代码必须严格按下列顺序输出。

::: info 来源
`@agile-team/wl-skills-kit` · `standards/02-code-structure.md`
:::

<AuthorTag :authors="['ZhuXiang','CHENY','ZhongYu','XuQingYu']" />

---

## 4 文件原则（页面目录强制结构）

```
src/views/[域]/[模块]/[子模块]/[kebab-case目录]/
├── index.vue    ← 纯模板 + 解构，不写业务逻辑
├── data.ts      ← AbstractPageQueryHook 类 + API_CONFIG
├── index.scss   ← 页面样式（可为空）
└── api.md       ← 接口约定文档
```

**禁止**：把业务逻辑写在 index.vue；缺少 data.ts；缺少 api.md。

## 弹窗组件归属

| 场景                    | 位置                                 |
| ----------------------- | ------------------------------------ |
| 通用弹窗（2+ 页面复用） | `src/components/local/c_xxxModal/`   |
| 极个性弹窗（仅单页面）  | 页面目录下 `components/xxxModal.vue` |

---

## index.vue 三段式（顺序固定，不可调换）

```vue
<template>
  <!-- 纯模板 + 组件组合 -->
</template>

<script setup lang="ts">
/* 业务逻辑全部从 data.ts 导入，按下方 9 段式 */
</script>

<style scoped lang="scss">
@import "./index.scss";
/* 仅允许这一行 import，全部样式写在 index.scss */
</style>
```

---

## `<script setup>` 9 段式（按需使用，用到的必须遵守此顺序）

```typescript
// ===== 1. import 语句（外部库 → 内部模块 → 类型）=====
import { ref, computed, onMounted } from "vue";
import { createPage } from "./data";

// ===== 2. 组件宏（defineOptions / defineProps / defineEmits）=====
defineOptions({ name: "PageName" });

// ===== 3. 路由 & Store =====
const route = useRoute();

// ===== 4. createPage() 调用 + 解构（核心模式）=====
const Page = createPage();
const {
  tableRef,
  page,
  queryParam,
  list,
  queryItems,
  columns,
  toolbars,
  select,
} = Page;

// ===== 5. 页面补充状态（ref / reactive / computed）=====
const loading = ref(false);

// ===== 6. watch / watchEffect =====

// ===== 7. 业务方法（API 调用 / 事件处理）=====
async function handleSubmit() {}

// ===== 8. 生命周期 =====
onMounted(() => select());

// ===== 9. defineExpose =====
defineExpose({ select });
```

---

## data.ts 内部顺序（强制）

```typescript
// 1. import（类型 → 基类 → API 工具 → 工具函数）
// 2. API_CONFIG（接口路径集中声明，as const）
// 3. createPage()（constructor → queryDef → toolbarDef → columnsDef → 业务方法）
// 4. 页面共用辅助函数（可选，纯函数）
```

---

## index.scss 顺序（建议）

```scss
// 1. 变量覆盖
// 2. 容器级样式 (.app-page-container)
// 3. 区域级样式 (.search-area / .table-area)
// 4. 组件深层覆盖 (:deep(.el-table))
// 5. 响应式 (@media)
```

> 禁止 `::v-deep` / `/deep/`，统一使用 `:deep()`。
