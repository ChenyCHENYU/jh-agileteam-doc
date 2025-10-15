import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

/**
 * UnoCSS 配置
 * @description 原子化 CSS 引擎配置
 */
export default defineConfig({
  // 预设
  presets: [
    presetUno(), // 基础预设，包含常用工具类
    presetAttributify(), // 属性化模式
    presetIcons({
      // 图标预设
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
    presetTypography(), // 排版预设
    presetWebFonts({
      // Web 字体预设
      fonts: {
        sans: "DM Sans",
        serif: "DM Serif Display",
        mono: "DM Mono",
      },
    }),
  ],

  // 转换器
  transformers: [
    transformerDirectives(), // 支持 @apply 等指令
    transformerVariantGroup(), // 支持变体组语法
  ],

  // 快捷方式
  shortcuts: [
    // 自定义快捷方式
    [
      "btn",
      "px-4 py-2 rounded inline-block bg-primary text-white cursor-pointer hover:bg-primary-dark disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50",
    ],
    [
      "icon-btn",
      "inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-primary",
    ],
    ["glass", "backdrop-blur-md bg-white/30 border border-white/20 shadow-lg"],
  ],

  // 主题配置
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
    breakpoints: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },

  // 安全列表
  safelist: [
    // 确保某些类始终被包含
    "prose",
    "prose-sm",
    "m-auto",
    "text-left",
  ],

  // 扫描文件
  content: {
    filesystem: [
      "docs/**/*.{vue,js,ts,jsx,tsx,md,mdx,html}",
      "docs/.vitepress/**/*.{vue,js,ts,jsx,tsx}",
    ],
  },
});
