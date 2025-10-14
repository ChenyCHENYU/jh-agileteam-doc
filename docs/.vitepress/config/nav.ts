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
 * @description 顶部导航栏的配置项（简化版，一级菜单）
 */
export const nav: DefaultTheme.NavItem[] = [
  {
    text: "指南",
    link: "/views/guide/",
    activeMatch: "/views/guide/",
  },
  {
    text: "工程化",
    link: "/views/engineering/scaffold",
    activeMatch: "/views/engineering/",
  },
  {
    text: "最佳实践",
    link: "/views/best-practices/architecture",
    activeMatch: "/views/best-practices/",
  },
  {
    text: "样式方案",
    link: "/views/styling",
    activeMatch: "/views/styling",
  },
  {
    text: "组件库",
    link: "/ui-components/",
    activeMatch: "/ui-components/",
  },
  {
    text: "疑难杂症",
    link: "/views/troubleshooting/",
    activeMatch: "/views/troubleshooting/",
  },
];
