/**
 * GlassHome 组件数据配置
 */

import { packages, siteStats } from "../PackagesTable/data";

export interface Feature {
  icon: string;
  title: string;
  details: string;
  link: string;
}

export interface Stat {
  icon: string;
  number: string;
  label: string;
  desc: string;
}

const shortNames = packages.map((p) => p.name.replace("wl-skills-", "")).join(" / ");

export const features: Feature[] = [
  {
    icon: "📦",
    title: "五包工程能力",
    details: `${shortNames} 共 ${siteStats.packages} 包覆盖设计到测试全链路（${siteStats.skills} Skill / ${siteStats.mcp} MCP），契约同源、独立安装`,
    link: "/views/guide/",
  },
  {
    icon: "🤖",
    title: "AI 工作流",
    details: "AI 驱动的全流程工程化实践，从原型到测试的智能化协作",
    link: "/views/ai-workflow/",
  },
  {
    icon: "📚",
    title: "AI 最佳实践",
    details: "L1 提示词 → L2 Skill → L3 Skills & MCP → L4 CLI，四级能力体系",
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
    details: "wl-mbase 四端统一门户（小程序/钉钉/H5/App）与 Robot_H5 框架",
    link: "/frontend/mobile-uniapp/",
  },
  {
    icon: "🛠️",
    title: "工程脚手架",
    details: "jh4j-cloud-cli 一键创建 PC 子系统或移动端 H5 应用，结构一致可追溯",
    link: "/scaffold/",
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
];

export const stats: Stat[] = [
  {
    icon: "📦",
    number: String(siteStats.packages),
    label: "工程包",
    desc: "design / kit / ui / bd / test 全链路覆盖",
  },
  {
    icon: "🤖",
    number: String(siteStats.skills),
    label: "AI Skill",
    desc: "触发词驱动的结构化技能",
  },
  {
    icon: "🔌",
    number: String(siteStats.mcp),
    label: "MCP 工具",
    desc: "菜单/权限/快照/生成/执行全覆盖",
  },
  {
    icon: "⚡",
    number: String(siteStats.rules),
    label: "确定性审计规则",
    desc: "K19 + R39 + B31 + T25，机器判定",
  },
];
