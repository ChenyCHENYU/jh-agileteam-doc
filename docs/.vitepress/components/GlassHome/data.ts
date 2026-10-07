/**
 * GlassHome 组件数据配置
 * 面向内部团队：只描述站内真实内容与入口，不做对外宣传
 */

import { packages } from "../PackagesTable/data";

export interface Feature {
  icon: string;
  title: string;
  details: string;
  link: string;
}

export interface QuickLink {
  label: string;
  link: string;
}

const shortNames = packages.map((p) => p.name.replace("wl-skills-", "")).join(" / ");

/** 高频直达入口（团队日常最常查阅的板块） */
export const quickLinks: QuickLink[] = [
  { label: "前端", link: "/frontend/quick-start/" },
  { label: "后端", link: "/backend/" },
  { label: "测试", link: "/views/testing/" },
  { label: "平台手册", link: "/platform/" },
  { label: "模板库", link: "/templates/" },
  { label: "疑难杂症", link: "/views/troubleshooting/" },
];

export const features: Feature[] = [
  {
    icon: "📦",
    title: "五包工程能力",
    details: `${shortNames} 五个工程包的安装配置、Skills 用法与规则说明，契约同源、独立安装`,
    link: "/views/guide/",
  },
  {
    icon: "🤖",
    title: "AI 工作流",
    details: "AI 驱动的全流程工程化实践，从需求设计、原型到测试的智能化协作流程",
    link: "/views/ai-workflow/",
  },
  {
    icon: "📚",
    title: "AI 最佳实践",
    details: "L1 提示词 → L2 Skill → L3 Skills & MCP → L4 CLI，四级能力体系与部门成熟度对照",
    link: "/views/best-practices/",
  },
  {
    icon: "🎯",
    title: "Skill 集合",
    details: "按角色分类的精选技能包、脚手架、服务，持续沉淀工程化能力",
    link: "/frontend/pc/skills/",
  },
  {
    icon: "📱",
    title: "移动端基座",
    details: "wl-mbase 四端统一门户（小程序/钉钉/H5/App）与 Robot_H5 框架的接入文档",
    link: "/frontend/mobile-uniapp/",
  },
  {
    icon: "🛠️",
    title: "工程脚手架",
    details: "jh4j-cloud-cli 一键创建 PC 子系统或移动端 H5 应用，结构一致可追溯",
    link: "/scaffold/",
  },
  {
    icon: "🌍",
    title: "工程生态",
    details: "MachTable 数据表格、工程工具链与基础设施库的使用文档",
    link: "/views/ecosystem/",
  },
  {
    icon: "🔥",
    title: "爬坑建议",
    details: "收集常见问题和解决方案，快速定位和解决开发问题",
    link: "/views/troubleshooting/",
  },
  {
    icon: "📣",
    title: "宣贯方案",
    details: "五包落地宣贯文档：能力、场景、接入流程与验收清单",
    link: "/views/rollout/",
  },
  {
    icon: "🏢",
    title: "平台手册",
    details: "FSI2 低代码平台操作手册：工作流、权限、菜单、报表、API 管理等日常配置",
    link: "/platform/",
  },
  {
    icon: "🗂️",
    title: "模板库",
    details: "生产、销售、成本、质量领域的业务页面模板，新页面直接复用起步",
    link: "/templates/",
  },
  {
    icon: "🎨",
    title: "样式方案",
    details: "UnoCSS 与 SCSS 的样式规范和最佳实践，保持页面视觉一致",
    link: "/views/styling/",
  },
];
