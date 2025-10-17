/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-10-15 08:46:20
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-10-17 09:28:22
 * @FilePath: \jh-agileteam-doc\docs\.vitepress\theme\index.ts
 * @Description: VitePress 主题入口文件
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */
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
      meta: ["nick", "mail"],
      requiredMeta: ["nick", "mail"],
      login: "enable",
      wordLimit: [0, 500],
      pageSize: 10,
      search: false,
      noCopyright: true, // 隐藏底部版权信息 "Powered by Waline"
      mountDelay: 800,

      locale: {
        placeholder: "💬 欢迎评论（支持 Markdown 语法，提交后正确渲染）",
        sofa: "来发表第一条评论吧~",
        nick: "姓名或工号",
        nickError: "请填写姓名或工号",
        mail: "邮箱",
        mailError: "请填写正确的邮箱地址",
      },
    });

    walinePlugin.enhanceApp();
  },
} satisfies Theme;
