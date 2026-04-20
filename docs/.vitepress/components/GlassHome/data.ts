/**
 * GlassHome 组件数据配置
 */

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

export const features: Feature[] = [
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
    icon: "📖",
    title: "知识库",
    details: "组件库、模板库、样式方案等团队知识资产，统一沉淀共享",
    link: "/views/guide/",
  },
  {
    icon: "🔥",
    title: "爬坑建议",
    details: "收集常见问题和解决方案，快速定位和解决开发问题",
    link: "/views/troubleshooting/",
  },
  {
    icon: "🤝",
    title: "团队",
    details: "业务、产品、前端、后端、测试全角色团队协作与分享",
    link: "/views/team/",
  },
];

export const stats: Stat[] = [
  {
    icon: "🎯",
    number: "✦",
    label: "精选 Skill",
    desc: "持续沉淀的工程化技能集合",
  },
  {
    icon: "�",
    number: "✦",
    label: "最佳实践",
    desc: "全链路 AI 工程化最佳实践",
  },
  {
    icon: "🤖",
    number: "✦",
    label: "AI 工作流",
    desc: "AI 驱动的全流程开发实践",
  },
  {
    icon: "⚡",
    number: "∞",
    label: "持续迭代",
    desc: "跟随前沿技术不断演进",
  },
];
