import {
  defineConfig,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

/**
 * UnoCSS 配置
 * @description 原子化 CSS 引擎配置，基于最新 v66+ 版本
 */
export default defineConfig({
  // 预设
  presets: [
    presetAttributify(), // 属性化模式支持
    presetIcons({
      // 图标预设
      scale: 1.2,
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
  ],

  // 转换器
  transformers: [
    transformerDirectives(), // 支持 @apply、@screen 等指令
    transformerVariantGroup(), // 支持变体组简写，如 hover:(bg-gray-400 text-white)
  ],

  // 自定义规则（保留常用工具类）
  rules: [
    // 添加自定义原子化规则
    [
      "glass",
      {
        "backdrop-filter": "blur(12px)",
        "background-color": "rgba(255, 255, 255, 0.3)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        "box-shadow": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
    ],
  ],

  // 快捷方式（保留必要的）
  shortcuts: {
    btn: "px-4 py-2 rounded inline-block bg-primary text-white cursor-pointer hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
    "icon-btn":
      "inline-block cursor-pointer select-none opacity-75 transition-all duration-200 hover:opacity-100 hover:text-primary",
  },

  // 主题扩展
  theme: {
    colors: {
      primary: {
        DEFAULT: "#667eea",
        dark: "#5568d3",
        light: "#7e91ff",
      },
      secondary: {
        DEFAULT: "#764ba2",
        dark: "#5f3d83",
        light: "#8d5fb8",
      },
    },
  },
});
