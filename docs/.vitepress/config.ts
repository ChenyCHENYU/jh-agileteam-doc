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
  description: "前端工程体系 - 提升研发效率，赋能团队协作",
  lang: "zh-CN",

  // 主题配置
  themeConfig: {
    logo: "/logo.svg",
    nav,
    sidebar,
    search,
    
    // 社交链接
    socialLinks: [{ icon: "github", link: "https://github.com/ChenyCHENYU" }],

    // 页脚
    footer: {
      message:
        "You may not distribute, modify, or sell this software without permission.",
      copyright: "Copyright © 2025 金恒科技 AGILE TEAM",
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
      level: [2, 3],
    },
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
});
