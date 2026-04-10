/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-10-14 15:02:42
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2026-02-05 10:08:52
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
    text: "AI 最佳实践",
    link: "/views/best-practices/architecture",
    activeMatch: "/views/best-practices/",
  },
  {
    text: "Skills 集合",
    items: [
      { text: "业务 Skill", link: "", activeMatch: "---" },
      { text: "产品 Skill", link: "", activeMatch: "---" },
      { text: "前端 Skill", link: "/skills/frontend/" },
      { text: "后端 Skill", link: "/skills/backend/" },
      { text: "测试 Skill", link: "", activeMatch: "---" },
    ],
  },
  {
    text: "AI 工作流",
    link: "/views/ai-workflow/",
    activeMatch: "/views/ai-workflow/",
  },
  {
    text: "知识库",
    items: [
      { text: "组件库", link: "/ui-components/" },
      { text: "模板库", link: "/templates/" },
      { text: "样式方案", link: "/views/styling" },
    ],
  },
  {
    text: "爬坑建议",
    link: "/views/troubleshooting/",
    activeMatch: "/views/troubleshooting/",
  },
  {
    text: "团队",
    items: [
      { text: "业务团队", link: "", activeMatch: "---" },
      { text: "产品团队", link: "", activeMatch: "---" },
      { text: "前端团队", link: "/views/team/" },
      { text: "后端团队", link: "/views/team/backend" },
      { text: "测试团队", link: "", activeMatch: "---" },
    ],
  },
];
