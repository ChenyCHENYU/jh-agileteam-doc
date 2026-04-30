/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-10-15 10:03:04
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-10-15 19:48:37
 * @FilePath: \jh-agileteam-doc\docs\.vitepress\config.ts
 * @Description: VitePress 主配置文件
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */
import { defineConfig } from "vitepress";
import { nav } from "./config/nav";
import { sidebar } from "./config/sidebar";
import { search } from "./config/search";
import { vite } from "./config/vite";

/**
 * VitePress 主配置文件
 * @description 站点的核心配置，包括标题、描述、主题等
 */
export default defineConfig({
  title: "AGILE TEAM",
  description: "AI工程体系 - 提升交付效率，赋能团队协作",
  lang: "zh-CN",

  // 站点图标
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["link", { rel: "apple-touch-icon", sizes: "180x180", href: "/logo.png" }],
    ["meta", { name: "theme-color", content: "#667eea" }],
    // Open Graph
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "AGILE TEAM — AI 工程体系文档站" }],
    ["meta", { property: "og:description", content: "金恒科技敏捷团队 AI 工程化知识库，涵盖 Skill 体系、规范、模板库与最佳实践" }],
    ["meta", { property: "og:image", content: "/logo.png" }],
    // Twitter Card
    ["meta", { name: "twitter:card", content: "summary" }],
    ["meta", { name: "twitter:title", content: "AGILE TEAM — AI 工程体系" }],
    ["meta", { name: "twitter:description", content: "金恒科技敏捷团队 AI 工程化知识库" }],
  ],

  // 主题配置
  themeConfig: {
    logo: "/logo.png",
    nav,
    sidebar,
    search,

    // 编辑链接
    editLink: {
      pattern:
        "https://github.com/ChenyCHENYU/jh-agileteam-doc/edit/main/docs/:path",
      text: "✏️ 在 GitHub 上编辑此页",
    },

    // 社交链接
    socialLinks: [
      { icon: "github", link: "https://github.com/ChenyCHENYU" },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
        },
        link: "https://www.tzagileteam.com/",
        ariaLabel: "友情链接",
      },
    ],

    // 页脚
    footer: {
      message:
        "You may not distribute, modify, or sell this software without permission.",
      copyright: "Copyright © 2026 金恒科技 AGILE TEAM",
    },

    // 最后更新时间
    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium",
      },
    },

    // 文档页脚
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    // 大纲
    outline: {
      label: "页面导航",
      level: [2, 4],
    },

    // 返回顶部
    returnToTopLabel: "返回顶部",
  },

  // Markdown 配置
  markdown: {
    lineNumbers: true,
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
  },
  // Vite 配置
  vite,
  // 忽略指定路径的死链（规划中页面）
  ignoreDeadLinks: [
    /\/backend\/quick-start/,
    /\/views\/troubleshooting\/(environment|build-deploy|performance-issues|compatibility|third-party|devtools|debugging-logs|error-tracking)/,
  ],
});
