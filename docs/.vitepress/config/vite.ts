/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2026-01-25 17:34:41
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2026-02-05 08:55:27
 * @FilePath: \jh-agileteam-doc\docs\.vitepress\config\vite.ts
 * @Description:
 * Copyright (c) 2026 by CHENY, All Rights Reserved 😎.
 */
import type { UserConfig } from "vite";
import UnoCSS from "unocss/vite";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

/**
 * Vite 配置
 * @description Vite 相关配置,包括插件、别名、构建选项等
 */
export const vite: UserConfig = {
  // 插件配置
  plugins: [
    UnoCSS(),

    // 自动导入 Vue API
    AutoImport({
      imports: [
        "vue",
        "vitepress",
      ],
      dts: resolve(__dirname, "../../types/auto-imports.d.ts"),
      eslintrc: {
        enabled: false,
      },
    }),

    // 自动导入组件
    Components({
      dirs: [resolve(__dirname, "../components")],
      extensions: ["vue"],
      include: [/\.vue$/, /\.md$/],
      dts: resolve(__dirname, "../../types/components.d.ts"),
      resolvers: [NaiveUiResolver()],
    }),
  ],

  // 路径别名
  resolve: {
    alias: {
      "@": resolve(__dirname, "../../"),
      "@components": resolve(__dirname, "../components"),
    },
  },

  // 开发服务器配置
  server: {
    port: 8866,
    host: true,
  },

  // 构建配置
  build: {
    chunkSizeWarningLimit: 1000,
    // 代码分割优化 — 将大依赖拆分为独立 chunk，利用浏览器并行加载和缓存
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("naive-ui")) return "vendor-naive";
          if (id.includes("@waline")) return "vendor-waline";
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },

  // 预优化依赖 — 减少首次访问时 Vite 发现新依赖触发的 reload
  optimizeDeps: {
    include: ["vue", "naive-ui", "@waline/client"],
  },

  // CSS 配置
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
};

