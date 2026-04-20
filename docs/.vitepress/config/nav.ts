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
    link: "/views/best-practices/",
    activeMatch: "/views/best-practices/",
  },
  {
    text: "前端",
    items: [
      {
        text: "快速上手",
        items: [
          { text: "介绍", link: "/frontend/quick-start/" },
          { text: "快速开始", link: "/frontend/quick-start/getting-started" },
          { text: "安装配置", link: "/frontend/quick-start/installation" },
        ],
      },
      {
        text: "PC 端",
        items: [
          { text: "概览 & 技术选型", link: "/frontend/pc/" },
          { text: "架构设计", link: "/frontend/pc/architecture" },
          { text: "扩展规范", link: "/frontend/pc/standards" },
          { text: "Skills 集合", link: "/frontend/pc/skills/" },
        ],
      },
      {
        text: "移动端 H5",
        items: [
          { text: "概览 & 技术选型", link: "/frontend/mobile-h5/" },
          { text: "扩展规范", link: "/frontend/mobile-h5/standards" },
          { text: "Skills 集合", link: "/frontend/mobile-h5/skills" },
          { text: "@robot-h5/core", link: "/frontend/mobile-h5/h5-core/" },
        ],
      },
      {
        text: "移动端 uniApp",
        items: [
          { text: "概览 & 技术选型", link: "", activeMatch: "---" },
          { text: "开发规范", link: "", activeMatch: "---" },
          { text: "Skills 集合", link: "", activeMatch: "---" },
        ],
      },
    ],
  },
  {
    text: "后端",
    items: [
      { text: "概览 & 技术选型", link: "/backend/" },
      { text: "开发规范", link: "/backend/standards" },
      { text: "Skills 集合", link: "/backend/skills/" },
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
    link: "",
    activeMatch: "---",
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
