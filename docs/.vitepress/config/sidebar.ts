import type { DefaultTheme } from "vitepress";

/**
 * 侧边栏配置
 * @description 根据不同的路由路径，展示对应的侧边栏
 */
export const sidebar: DefaultTheme.Sidebar = {
  // 指南
  "/guide/": [
    {
      text: "快速开始",
      collapsed: false,
      items: [
        { text: "介绍", link: "/guide/" },
        { text: "快速开始", link: "/guide/getting-started" },
        { text: "安装配置", link: "/guide/installation" },
        { text: "项目结构", link: "/guide/project-structure" },
      ],
    },
  ],

  // 工程化
  "/engineering/": [
    {
      text: "脚手架",
      collapsed: false,
      items: [
        { text: "概述", link: "/engineering/scaffold/" },
        { text: "CLI 工具", link: "/engineering/scaffold/cli" },
        { text: "项目模板", link: "/engineering/scaffold/templates" },
      ],
    },
    {
      text: "构建工具",
      collapsed: false,
      items: [
        { text: "概述", link: "/engineering/build/" },
        { text: "Vite", link: "/engineering/build/vite" },
        { text: "Webpack", link: "/engineering/build/webpack" },
        { text: "Rollup", link: "/engineering/build/rollup" },
      ],
    },
    {
      text: "代码质量",
      collapsed: false,
      items: [
        { text: "概述", link: "/engineering/code-quality/" },
        { text: "ESLint", link: "/engineering/code-quality/eslint" },
        { text: "Prettier", link: "/engineering/code-quality/prettier" },
        { text: "Stylelint", link: "/engineering/code-quality/stylelint" },
        { text: "Husky", link: "/engineering/code-quality/husky" },
      ],
    },
    {
      text: "测试方案",
      collapsed: false,
      items: [
        { text: "概述", link: "/engineering/testing/" },
        { text: "单元测试", link: "/engineering/testing/unit-test" },
        { text: "E2E 测试", link: "/engineering/testing/e2e-test" },
        { text: "测试覆盖率", link: "/engineering/testing/coverage" },
      ],
    },
    {
      text: "CI/CD",
      collapsed: false,
      items: [
        { text: "概述", link: "/engineering/ci-cd/" },
        { text: "GitLab CI", link: "/engineering/ci-cd/gitlab-ci" },
        { text: "GitHub Actions", link: "/engineering/ci-cd/github-actions" },
      ],
    },
  ],

  // 最佳实践
  "/best-practices/": [
    {
      text: "架构设计",
      collapsed: false,
      items: [
        { text: "概述", link: "/best-practices/architecture/" },
        { text: "微前端", link: "/best-practices/architecture/micro-frontend" },
        { text: "Monorepo", link: "/best-practices/architecture/monorepo" },
        {
          text: "设计模式",
          link: "/best-practices/architecture/design-patterns",
        },
      ],
    },
    {
      text: "性能优化",
      collapsed: false,
      items: [
        { text: "概述", link: "/best-practices/performance/" },
        {
          text: "打包优化",
          link: "/best-practices/performance/bundle-optimization",
        },
        { text: "懒加载", link: "/best-practices/performance/lazy-loading" },
        {
          text: "缓存策略",
          link: "/best-practices/performance/cache-strategy",
        },
      ],
    },
    {
      text: "安全规范",
      collapsed: false,
      items: [
        { text: "概述", link: "/best-practices/security/" },
        { text: "XSS 防护", link: "/best-practices/security/xss-prevention" },
        { text: "依赖审计", link: "/best-practices/security/dependency-audit" },
      ],
    },
    {
      text: "编码规范",
      collapsed: false,
      items: [
        { text: "概述", link: "/best-practices/coding-standards/" },
        {
          text: "JavaScript",
          link: "/best-practices/coding-standards/javascript",
        },
        {
          text: "TypeScript",
          link: "/best-practices/coding-standards/typescript",
        },
        { text: "Vue", link: "/best-practices/coding-standards/vue" },
      ],
    },
  ],

  // 样式方案
  "/styling/": [
    {
      text: "样式方案",
      collapsed: false,
      items: [
        { text: "概述", link: "/styling/" },
        { text: "UnoCSS", link: "/styling/unocss" },
      ],
    },
  ],

  // 组件库
  "/components/": [
    {
      text: "开发指南",
      collapsed: false,
      items: [
        { text: "介绍", link: "/components/" },
        { text: "快速开始", link: "/components/guide/quickstart" },
        { text: "安装", link: "/components/guide/installation" },
      ],
    },
    {
      text: "基础组件",
      collapsed: false,
      items: [
        { text: "Button 按钮", link: "/components/basic/button" },
        { text: "Icon 图标", link: "/components/basic/icon" },
        { text: "Input 输入框", link: "/components/basic/input" },
        { text: "Select 选择器", link: "/components/basic/select" },
      ],
    },
    {
      text: "布局组件",
      collapsed: false,
      items: [
        { text: "Container 容器", link: "/components/layout/container" },
        { text: "Grid 栅格", link: "/components/layout/grid" },
      ],
    },
    {
      text: "表单组件",
      collapsed: false,
      items: [
        { text: "Form 表单", link: "/components/form/form" },
        { text: "FormItem 表单项", link: "/components/form/form-item" },
      ],
    },
    {
      text: "数据展示",
      collapsed: false,
      items: [
        { text: "Table 表格", link: "/components/data/table" },
        { text: "Pagination 分页", link: "/components/data/pagination" },
      ],
    },
    {
      text: "反馈组件",
      collapsed: false,
      items: [
        { text: "Message 消息", link: "/components/feedback/message" },
        { text: "Modal 对话框", link: "/components/feedback/modal" },
      ],
    },
    {
      text: "业务组件",
      collapsed: false,
      items: [
        {
          text: "UserSelector 用户选择",
          link: "/components/business/user-selector",
        },
        {
          text: "DepartmentTree 部门树",
          link: "/components/business/department-tree",
        },
      ],
    },
  ],
};
