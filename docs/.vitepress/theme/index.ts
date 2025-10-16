import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import { useWalineComments } from "../composables/useWalineComments";
import { useRouter } from "vitepress";
import { watch } from "vue";

// UnoCSS
import "virtual:uno.css";
import "@unocss/reset/tailwind.css";

// 自定义样式
import "./custom.css";
import "./waline-custom.scss";

/**
 * VitePress 主题配置
 * @description 扩展默认主题，集成 UnoCSS 和 Waline 评论
 * @note 组件已通过 unplugin-vue-components 自动导入，无需手动注册
 */
export default {
  extends: DefaultTheme,
  setup() {
    // 监听 VitePress 路由变化
    const router = useRouter();
    watch(
      () => router.route.path,
      () => window.dispatchEvent(new Event("vitepress:route-change"))
    );
  },
  enhanceApp() {
    // Waline 评论系统配置
    const walinePlugin = useWalineComments({
      serverURL: "https://waline-comment-lilac.vercel.app",
      meta: ["nick", "link"],
      requiredMeta: ["nick", "link"],
      login: "enable",
      wordLimit: [0, 500],
      pageSize: 10,
      imageUploader: false,
      search: false,
      highlighter: false,
      mountDelay: 800,

      // 姓名验证（仅未登录用户）
      nicknameGuard: {
        pattern: /^[\u4e00-\u9fa5]{2,4}$/,
        hint: "请输入正确的姓名（2-4个中文字符，例：张三）",
      },
    });

    walinePlugin.enhanceApp();
  },
} satisfies Theme;