import type { UserConfig } from "vite";
import UnoCSS from "unocss/vite";

/**
 * Vite 配置
 * @description Vite 相关配置，包括插件、别名、构建选项等
 */
export const vite: UserConfig = {
  // 插件配置
  plugins: [UnoCSS()],

  // 路径别名
  resolve: {
    alias: {
      // 可以添加路径别名
      // '@': resolve(__dirname, '../'),
    },
  },

  // 开发服务器配置
  server: {
    port: 8866,
    host: true,
    // open: true, // 自动打开浏览器
  },

  // 构建配置
  build: {
    chunkSizeWarningLimit: 1000,
  },

  // CSS 配置
  css: {
    preprocessorOptions: {
      // scss: {
      //   additionalData: `@use "@/styles/variables.scss" as *;`,
      // },
    },
  },
};
