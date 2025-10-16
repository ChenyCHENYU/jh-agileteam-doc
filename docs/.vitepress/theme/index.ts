import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import { useWalineComments } from "../composables/useWalineComments";

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
  enhanceApp() {
    // 注册 Waline 评论插件
    const walinePlugin = useWalineComments({
      // Waline 服务器地址
      serverURL: "https://waline-comment-lilac.vercel.app",

      // 姓名验证规则（仅针对未登录用户）
      nicknameGuard: {
        // 验证格式：中文姓名(2-4字)
        pattern: /^[\u4e00-\u9fa5]{2,4}$/,
        hint: "请输入正确的姓名（2-4个中文字符，例：张三）",
      },

      // 评论字段配置
      // nick=姓名, link=工号（使用link字段避免邮箱验证）
      meta: ["nick", "link"],
      requiredMeta: ["nick", "link"], // 未登录用户必填
      login: "enable", // 支持 GitHub 登录（登录后无需填写）

      // 界面配置
      dark: "auto", // 自动切换深色模式
      wordLimit: [0, 500], // 字数限制
      pageSize: 10, // 每页评论数
      imageUploader: false, // 禁用图片上传
      search: false, // 禁用表情搜索

      // 挂载延迟（等待页面渲染完成）
      mountDelay: 500,

      // 自定义文本
      locale: {
        placeholder: "💬 欢迎评论（支持 Markdown 语法）",
        nick: "姓名",
        link: "工号（6位数字）",
      },
    });

    walinePlugin.enhanceApp();
  },
} satisfies Theme;

