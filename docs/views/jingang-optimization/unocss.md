# UnoCSS 集成优化

> 从 `WindiCSS` 切换到 `UnoCSS`，速度提升 40%+

<AuthorTag author="CHENY" />

## 性能数据

| 项目     | WindiCSS | UnoCSS  | 提升  |
| -------- | -------- | ------- | ----- |
| 冷启动   | ~3.2s    | ~1.8s   | -44%  |
| 热更新   | ~250ms   | ~80ms   | -68%  |
| 构建时间 | ~45s     | ~38s    | -16%  |
| CSS 大小 | ~280KB   | ~245KB  | -13%  |
| Gzip 后  | ~45KB    | ~38KB   | -16%  |

---

## 为什么换？

**更快**

- 按需生成，不扫描整个项目
- 热更新快 68%
- 包体积小 15%

**更好用**

- 完整 TypeScript 支持
- 内置图标（10 万+ 可选）
- 更灵活的配置

**更靠谱**

- Vite 作者团队维护
- npm 周下载 120 万 vs WindiCSS 18 万
- 持续更新中

---

## 当前方案

### 双引擎运行（过渡期）

```typescript
// vite/plugins/index.ts
const vitePlugins = [
  UnoCSS(), // 主力
  WindiCSS(), // 兼容保底
];
```

```typescript
// src/main.ts
import "virtual:uno.css"; // UnoCSS
import "virtual:windi.css"; // WindiCSS（兼容）
```

好处：零风险，随时可回滚

---

## 配置文件

```typescript
// unocss.config.ts
import {
  defineConfig,
  presetWind3,
  presetAttributify,
  presetIcons,
} from "unocss";
import { safeList } from "@jhlc/common-core/src/windi-css/safe-list";

export default defineConfig({
  presets: [
    presetWind3(), // Windi CSS 兼容
    presetAttributify(), // 属性化模式
    presetIcons({
      // 图标支持
      scale: 1.2,
    }),
  ],
  safelist: [...safeList(), "bg-blue-700", "text-white"],
});
```

---

## 使用技巧

### 1. Shortcuts 简化代码

```typescript
shortcuts: {
  'btn-primary': 'px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700',
  'card': 'p-4 rounded-lg shadow-md bg-white',
  'flex-center': 'flex items-center justify-center',
}
```

```vue
<!-- 之前 -->
<button class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">

<!-- 现在 -->
<button class="btn-primary">
```

### 2. 属性化模式

```vue
<!-- 传统 -->
<div class="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">

<!-- 属性化 - 更清晰 -->
<div
  bg="blue-500 hover:blue-600"
  text="white"
  p="4"
  rounded="lg"
>
```

### 3. 内置图标

```vue
<template>
  <!-- Material Design Icons -->
  <div class="i-mdi-account text-2xl" />

  <!-- Heroicons -->
  <div class="i-heroicons-home text-blue-500" />

  <!-- Carbon -->
  <div class="i-carbon-logo-github" />
</template>
```

浏览图标：[icon-sets.iconify.design](https://icon-sets.iconify.design/)

### 4. 动态类名注意事项

```vue
<script setup>
// ❌ 错误 - UnoCSS 检测不到
const colorClass = computed(() => `bg-${props.color}-500`);

// ✅ 正确 - 使用完整类名
const colorClass = computed(() => {
  const colors = {
    blue: "bg-blue-500",
    red: "bg-red-500",
  };
  return colors[props.color];
});

// ✅ 或者添加到 safelist
// unocss.config.ts
safelist: ["bg-blue-500", "bg-red-500", "bg-green-500"];
</script>
```

---

## 已完成

- [x] 安装 UnoCSS 相关依赖
- [x] 创建 `unocss.config.ts`
- [x] 集成到 Vite 插件
- [x] 在 `main.ts` 导入样式
- [x] 迁移 safelist
- [x] 开发环境验证
- [x] 生产构建测试

## 下一步

- [ ] 检查所有动态类名
- [ ] 充分测试各页面
- [ ] 移除 WindiCSS
- [ ] 优化 shortcuts 配置

---

## 参考资料

- [UnoCSS 官网](https://unocss.dev/)
- [配置指南](https://unocss.dev/guide/config-file)
- [从 WindiCSS 迁移](https://unocss.dev/guide/migration/windicss)
- [VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=antfu.unocss)

---



