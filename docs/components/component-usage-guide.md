# 组件使用指南

本文档说明如何在 VitePress 中使用组件。

## 方式一：全局组件（推荐）✨

AuthorTag 已经全局注册，可以直接在 Markdown 中使用，无需导入：

````markdown
---
outline: deep
---

<!-- 直接使用，无需导入 -->

# 组件使用指南

## 🎯 组件导入方式

本项目使用 **unplugin-vue-components** 实现组件自动导入，无需手动 import。

### ✨ 自动导入优势

1. **零导入**：直接在模板中使用,无需 import
2. **按需加载**：只打包使用的组件,Tree Shaking 生效
3. **类型安全**：自动生成 TypeScript 类型声明
4. **性能最优**：相比全局注册减少初始 bundle 大小

## 📦 使用方式

### 在 Markdown 中使用

```markdown
---
outline: deep
---

<!-- 无需导入,直接使用 -->
<AuthorTag author="ChenYu" date="2025-01-15" :reading-time="5" />

# 页面标题

页面内容...
```
````

### 在 Vue 组件中使用

```vue
<template>
  <div>
    <!-- 无需导入,直接使用 -->
    <AuthorTag
      author="ChenYu"
      date="2025-01-15"
      :reading-time="5"
      variant="card"
    />
  </div>
</template>

<script setup>
// 无需任何导入语句！
// Vue API 也自动导入（ref, computed, watch 等）
const count = ref(0);
</script>
```

## 🔧 配置说明

### Vite 配置 (`docs/.vitepress/config/vite.ts`)

```typescript
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

export const vite: UserConfig = {
  plugins: [
    // 自动导入 Vue API
    AutoImport({
      imports: ["vue", "vitepress"],
      dts: resolve(__dirname, "../../types/auto-imports.d.ts"),
    }),

    // 自动导入组件
    Components({
      dirs: [resolve(__dirname, "../components")],
      extensions: ["vue"],
      include: [/\.vue$/, /\.md$/],
      dts: resolve(__dirname, "../../types/components.d.ts"),
    }),
  ],
};
```

### 类型声明文件

插件会自动生成两个类型声明文件：

- `types/auto-imports.d.ts` - Vue API 类型声明
- `types/components.d.ts` - 组件类型声明

**注意**：这两个文件会自动生成,无需手动维护,已添加到 `.gitignore`。

## 🆚 对比：全局注册 vs 自动导入

### 全局注册 (不推荐)

```typescript
// ❌ 旧方式 - 性能差
app.component("AuthorTag", AuthorTag);
app.component("Button", Button);
app.component("Card", Card);
// 所有组件都会被打包，即使不使用
```

**缺点**：

- ❌ 即使不使用也会被打包
- ❌ Tree Shaking 失效
- ❌ 增加初始 bundle 大小
- ❌ 首屏加载慢

### 自动导入 (推荐) ✅

```vue
<template>
  <!-- ✅ 新方式 - 自动按需导入 -->
  <AuthorTag />
  <Button />
</template>

<!-- 无需任何 import -->
```

**优点**：

- ✅ 零配置使用
- ✅ 按需打包
- ✅ Tree Shaking 生效
- ✅ 性能最优
- ✅ 类型安全

## 📊 性能对比

| 方案     | Bundle 大小       | 首屏加载 | Tree Shaking | 类型提示   |
| -------- | ----------------- | -------- | ------------ | ---------- |
| 全局注册 | 大 (包含所有组件) | 慢       | ❌           | 需手动配置 |
| 自动导入 | 小 (只打包使用的) | 快       | ✅           | 自动生成   |

## 💡 最佳实践

### 1. 组件命名规范

组件文件应使用 PascalCase 命名：

```
docs/.vitepress/components/
  ├── AuthorTag/
  │   └── index.vue
  ├── CustomButton/
  │   └── index.vue
  └── DataTable/
      └── index.vue
```

### 2. 直接在模板中使用

```vue
<template>
  <AuthorTag />
  <CustomButton />
  <DataTable />
</template>
```

### 3. Vue API 也自动导入

```vue
<script setup>
// ✅ 无需导入，直接使用
const count = ref(0);
const doubled = computed(() => count.value * 2);

watch(count, (newVal) => {
  console.log("count changed:", newVal);
});

onMounted(() => {
  console.log("mounted");
});
</script>
```

## 🔍 支持的 API

### 自动导入的 Vue API

- 响应式：`ref`, `reactive`, `computed`, `watch`, `watchEffect`
- 生命周期：`onMounted`, `onUnmounted`, `onBeforeMount` 等
- 工具函数：`nextTick`, `toRef`, `toRefs`, `unref`
- VitePress：`useData`, `useRoute`, `useRouter`

### 自动导入的组件

位于 `docs/.vitepress/components/` 目录下的所有 `.vue` 文件。

## ⚙️ 高级配置

### 自定义组件目录

```typescript
Components({
  dirs: [
    resolve(__dirname, "../components"),
    resolve(__dirname, "../../src/components"), // 额外的组件目录
  ],
});
```

### 自定义导入规则

```typescript
AutoImport({
  imports: [
    "vue",
    "vitepress",
    {
      axios: [
        ["default", "axios"], // import { default as axios } from 'axios'
      ],
    },
  ],
});
```

## 🚀 开始使用

现在你可以在任何 Markdown 或 Vue 文件中直接使用组件,无需任何导入！

```markdown
---
outline: deep
---

<AuthorTag 
  author="ChenYu" 
  date="2025-01-15" 
  :reading-time="5" 
  variant="card"
/>

# 页面标题

页面内容...
```

# 页面标题

正文内容...

````

### 优点

- ✅ 使用简单，无需导入
- ✅ 代码更简洁
- ✅ 适合频繁使用的组件

## 方式二：按需导入

如果你需要使用别名路径导入：

```markdown
<script setup>
import AuthorTag from '@components/AuthorTag/index.vue'
</script>

<AuthorTag author="ChenYu" date="2025-10-15" />
````

### 已配置的路径别名

在 `vite.ts` 和 `tsconfig.json` 中已配置：

```typescript
// Vite 别名
{
  '@': 'docs/.vitepress/',
  '@components': 'docs/.vitepress/components'
}

// TypeScript 路径映射
{
  "@/*": ["docs/.vitepress/*"],
  "@components/*": ["docs/.vitepress/components/*"]
}
```

### 使用示例

```vue
<!-- 使用别名 -->
<script setup>
import AuthorTag from "@components/AuthorTag/index.vue";
import GlassHome from "@components/GlassHome/index.vue";
</script>

<!-- 或使用完整路径 -->
<script setup>
import AuthorTag from "../.vitepress/components/AuthorTag/index.vue";
</script>
```

## 方式三：自动导入（进阶）

如果需要更多组件自动导入，可以配置 `unplugin-vue-components`：

```bash
pnpm add -D unplugin-vue-components
```

```typescript
// vite.ts
import Components from "unplugin-vue-components/vite";

export default {
  plugins: [
    Components({
      dirs: ["docs/.vitepress/components"],
      include: [/\.vue$/, /\.md$/],
      dts: "components.d.ts",
    }),
  ],
};
```

## 全局组件列表

当前已全局注册的组件：

| 组件名      | 路径                              | 说明         |
| ----------- | --------------------------------- | ------------ |
| `AuthorTag` | `@components/AuthorTag/index.vue` | 作者标签组件 |

需要添加更多全局组件，请编辑 `docs/.vitepress/theme/index.ts`。

## 最佳实践

### 1. 常用组件使用全局注册

```typescript
// docs/.vitepress/theme/index.ts
import AuthorTag from "../components/AuthorTag/index.vue";
import CustomButton from "../components/CustomButton/index.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("AuthorTag", AuthorTag);
    app.component("CustomButton", CustomButton);
  },
};
```

### 2. 特定组件使用按需导入

```vue
<script setup>
import SpecialChart from "@components/SpecialChart/index.vue";
</script>

<SpecialChart :data="chartData" />
```

### 3. 组件命名规范

- 全局组件使用 PascalCase：`<AuthorTag />`
- 文件名使用 kebab-case 或 PascalCase
- 保持一致性

## 示例对比

### ❌ 旧的方式（相对路径）

```vue
<script setup>
import AuthorTag from "../../.vitepress/components/AuthorTag/index.vue";
</script>
```

### ✅ 推荐方式（别名）

```vue
<script setup>
import AuthorTag from "@components/AuthorTag/index.vue";
</script>
```

### 🎯 最佳方式（全局注册）

```markdown
<!-- 无需导入 -->
<AuthorTag author="ChenYu" date="2025-10-15" />
```

## 类型支持

TypeScript 会自动识别别名路径，提供智能提示和类型检查。

如果遇到类型错误，重启 TypeScript 服务器：

1. VS Code 中按 `Ctrl+Shift+P`
2. 选择 `TypeScript: Restart TS Server`

## 总结

- ✅ **全局组件**：适合频繁使用（如 AuthorTag）
- ✅ **别名导入**：适合特定页面使用
- ✅ **相对路径**：不推荐，路径复杂

推荐优先级：**全局注册 > 别名导入 > 相对路径**
