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
 * @note 组件已通过 unplugin-vue-components 自动导入，无需手动注册
 */
export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    console.log("增强应用：", { app, router, siteData });
  },
} satisfies Theme;
