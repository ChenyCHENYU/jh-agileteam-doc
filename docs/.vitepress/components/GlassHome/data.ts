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
    icon: "🚀",
    title: "工程化配置",
    details: "统一的脚手架、构建工具和开发规范，开箱即用的项目模板",
    link: "/views/engineering/scaffold",
  },
  {
    icon: "🧩",
    title: "组件库",
    details: "高质量的业务组件和基础组件库，经过生产环境验证",
    link: "/ui-components/",
  },
  {
    icon: "📚",
    title: "最佳实践",
    details: "沉淀团队技术经验，涵盖架构设计、性能优化、测试方案",
    link: "/views/best-practices/architecture",
  },
  {
    icon: "🎨",
    title: "样式方案",
    details: "基于 UnoCSS 的原子化 CSS，灵活高效的样式开发体验",
    link: "/views/styling",
  },
  {
    icon: "🔧",
    title: "开发工具链",
    details: "完整的 Lint、Format、Test 工具链，保障代码质量",
    link: "/views/engineering/code-quality",
  },
  {
    icon: "🔥",
    title: "疑难杂症",
    details: "收集常见问题和解决方案，快速定位和解决开发问题",
    link: "/views/troubleshooting/",
  },
];

export const stats: Stat[] = [
  {
    icon: "📦",
    number: "20+",
    label: "精选组件",
    desc: "经过生产验证的高质量组件",
  },
  {
    icon: "🛠️",
    number: "5+",
    label: "开发工具",
    desc: "完整的工程化工具链支持",
  },
  {
    icon: "💎",
    number: "100%",
    label: "TypeScript",
    desc: "完整的类型支持和智能提示",
  },
  {
    icon: "⚡",
    number: "∞",
    label: "持续迭代",
    desc: "跟随前沿技术不断演进",
  },
];
