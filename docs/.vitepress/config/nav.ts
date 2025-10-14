/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-10-14 15:02:42
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-10-14 15:28:57
 * @FilePath: \jh-agileteam-doc\docs\.vitepress\config\nav.ts
 * @Description: 头部导航栏配置文件
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */
import type { DefaultTheme } from "vitepress";

/**
 * 导航栏配置
 * @description 顶部导航栏的配置项
 */
export const nav: DefaultTheme.NavItem[] = [
  {
    text: "指南",
    link: "/guide/",
    activeMatch: "/guide/",
  },
  {
    text: "工程化",
    items: [
      {
        text: "脚手架",
        link: "/engineering/scaffold/",
      },
      {
        text: "构建工具",
        link: "/engineering/build/",
      },
      {
        text: "代码质量",
        link: "/engineering/code-quality/",
      },
      {
        text: "测试方案",
        link: "/engineering/testing/",
      },
      {
        text: "CI/CD",
        link: "/engineering/ci-cd/",
      },
    ],
  },
  {
    text: "最佳实践",
    items: [
      {
        text: "架构设计",
        link: "/best-practices/architecture/",
      },
      {
        text: "性能优化",
        link: "/best-practices/performance/",
      },
      {
        text: "安全规范",
        link: "/best-practices/security/",
      },
      {
        text: "编码规范",
        link: "/best-practices/coding-standards/",
      },
    ],
  },
  {
    text: "样式方案",
    items: [{ text: "UnoCSS", link: "/styling/unocss" }],
  },
  {
    text: "组件库",
    link: "/components/",
    activeMatch: "/components/",
  },
];
