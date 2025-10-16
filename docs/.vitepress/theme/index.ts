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
      meta: ["nick", "mail"], // 只需要姓名和邮箱
      requiredMeta: ["nick", "mail"], // 姓名和邮箱都必填
      login: "enable",
      wordLimit: [0, 500],
      pageSize: 10,
      search: false,
      mountDelay: 800,

      locale: {
        placeholder: "💬 欢迎评论（支持 Markdown 语法）",
        sofa: "来发表第一条评论吧~",
        nick: "姓名",
        mail: "邮箱",
      },
    });

    walinePlugin.enhanceApp();
  },
} satisfies Theme;