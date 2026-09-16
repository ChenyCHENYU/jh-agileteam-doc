/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-10-14 15:02:42
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @FilePath: \jh-agileteam-doc\docs\.vitepress\config\nav.ts
 * @Description: 头部导航栏配置文件
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */
import type { DefaultTheme } from "vitepress";

/**
 * 导航栏配置
 * 原则：一级 ≤ 9 项；每个入口必须有真实落地页（禁止空 link 占位）
 */
export const nav: DefaultTheme.NavItem[] = [
  {
    text: "指南",
    link: "/views/guide/",
    activeMatch: "/views/guide/",
  },
  {
    text: "工程生态",
    items: [
      { text: "生态全景", link: "/views/ecosystem/" },
      { text: "MachTable 数据表格", link: "/views/ecosystem/mach-table" },
      { text: "工程工具链", link: "/views/ecosystem/toolchain" },
      { text: "基础设施库", link: "/views/ecosystem/foundation" },
    ],
  },
  {
    text: "AI 实践",
    items: [
      { text: "AI 最佳实践（L0-L7）", link: "/views/best-practices/" },
      { text: "成熟度对照（部门 L0-L5）", link: "/views/best-practices/maturity" },
      { text: "AI 工作流", link: "/views/ai-workflow/" },
    ],
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
          { text: "消息中心架构设计", link: "/frontend/mobile-uniapp/message-center" },
          { text: "钉钉集成方案", link: "/frontend/mobile-uniapp/dingtalk" },
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
      { text: "快速上手", link: "/backend/quick-start" },
      { text: "架构设计", link: "/backend/architecture" },
      { text: "MES 集成实战", link: "/backend/integration-mes" },
      { text: "开发规范", link: "/backend/standards" },
      { text: "Skills 集合", link: "/backend/skills/" },
    ],
  },
  {
    text: "测试",
    link: "/views/testing/",
    activeMatch: "/views/testing/",
  },
  {
    text: "工程脚手架",
    link: "/scaffold/",
    activeMatch: "/scaffold/",
  },
  {
    text: "宣贯方案",
    link: "/views/rollout/",
    activeMatch: "/views/rollout/",
  },
  {
    text: "更多",
    items: [
      { text: "平台手册", link: "/platform/" },
      { text: "疑难杂症", link: "/views/troubleshooting/" },
      { text: "团队", link: "/views/team/" },
    ],
  },
];
