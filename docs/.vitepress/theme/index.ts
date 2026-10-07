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
import Layout from "./Layout.vue";

// UnoCSS
import "virtual:uno.css";
import "@unocss/reset/tailwind.css";

// 自定义样式
import "./custom.css";
import "./waline-custom.scss";

// ─── 运行时稳定性保险（客户端） ───────────────────────
// 1) 发版后旧页面懒加载新 chunk 404（vite:preloadError）→ 自动整页刷新恢复；
//    带 5 秒防循环保护：刷新一次仍失败则不再连续刷新。
// 2) 全屏加载蒙层兜底：蒙层依赖 Vue 成功挂载才会隐藏，
//    若水合异常导致卡死，5 秒后由原生定时器强制移除，避免永久白屏。
if (typeof window !== "undefined") {
  const PRELOAD_RELOAD_KEY = "vp:preloadReloadAt";

  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    const last = Number(sessionStorage.getItem(PRELOAD_RELOAD_KEY) || 0);
    if (Date.now() - last > 5_000) {
      sessionStorage.setItem(PRELOAD_RELOAD_KEY, String(Date.now()));
      window.location.reload();
    }
  });

  window.setTimeout(() => {
    document.querySelectorAll(".app-loading").forEach((el) => el.remove());
  }, 5_000);
}

/**
 * VitePress 主题配置
 */
export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // 全局错误可见化：水合/渲染错误打到控制台，而不是静默挂死
    app.config.errorHandler = (err, _instance, info) => {
      console.error(`[Vue] ${info}:`, err);
    };

    // Waline 评论系统（懒加载 — 滚动到评论区域时才加载资源）
    const walinePlugin = useWalineComments({
      serverURL:
        (typeof import.meta !== "undefined" && (import.meta as Record<string, Record<string, string>>).env?.VITE_WALINE_SERVER_URL) ||
        "https://waline-comment-lilac.vercel.app",
      meta: ["nick", "mail"],
      requiredMeta: ["nick", "mail"],
      login: "enable",
      wordLimit: [0, 500],
      pageSize: 10,
      search: false,
      noCopyright: true,

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
