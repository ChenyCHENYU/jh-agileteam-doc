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
          { text: "概览 & 技术选型", link: "/frontend/mobile-uniapp/" },
          { text: "H5 子应用集成方案", link: "/frontend/mobile-uniapp/integration" },
          { text: "App 集成与发布", link: "/frontend/mobile-uniapp/app-integration" },
        ],
      },
      {
        text: "样式方案",
        items: [
          { text: "概述", link: "/views/styling/" },
          { text: "UnoCSS 最佳实践", link: "/views/styling/unocss-best-practices" },
          { text: "SCSS 最佳实践", link: "/views/styling/scss-best-practices" },
        ],
      },
      {
        text: "模板库",
        items: [
          { text: "模板总览", link: "/templates/" },
          { text: "生产领域", link: "/templates/produce/" },
          { text: "销售领域", link: "/templates/sale/" },
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
    text: "工程脚手架",
    link: "/scaffold/",
    activeMatch: "/scaffold/",
  },
  {
    text: "AI 工作流",
    link: "/views/ai-workflow/",
    activeMatch: "/views/ai-workflow/",
  },
  {
    text: "知识库",
    link: "",
    activeMatch: "---",
  },
  {
    text: "爬坑建议",
    link: "",
    activeMatch: "---",
  },
  {
    text: "团队",
    items: [
      { text: "业务团队", link: "/views/team/business" },
      { text: "产品团队", link: "", activeMatch: "---" },
      { text: "前端团队", link: "/views/team/" },
      { text: "后端团队", link: "/views/team/backend" },
      { text: "测试团队", link: "", activeMatch: "---" },
    ],
  },
];
