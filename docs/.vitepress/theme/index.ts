import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";

// UnoCSS
import "virtual:uno.css";
import "@unocss/reset/tailwind.css";

// 自定义样式
import "./custom.css";

/**
 * VitePress 主题配置
 * @description 扩展默认主题，集成 UnoCSS
 */
export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // 可以在这里注册全局组件
    // app.component('MyComponent', MyComponent)
  },
} satisfies Theme;
