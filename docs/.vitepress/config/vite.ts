import type { UserConfig } from "vite";
import UnoCSS from "unocss/vite";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

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
        {
          vue: [
            // Composition API
            "computed",
            "ref",
            "reactive",
            "watch",
            "watchEffect",
            "onMounted",
            "onUnmounted",
            "onBeforeMount",
            "onBeforeUnmount",
            "toRefs",
            "toRef",
            "unref",
            "nextTick",
            // Lifecycle
            "onActivated",
            "onDeactivated",
            "onBeforeUpdate",
            "onUpdated",
            "onErrorCaptured",
            "onRenderTracked",
            "onRenderTriggered",
            // Others
            "provide",
            "inject",
            "getCurrentInstance",
            "useSlots",
            "useAttrs",
          ],
        },
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
