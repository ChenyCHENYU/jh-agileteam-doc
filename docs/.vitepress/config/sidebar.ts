import type { DefaultTheme } from "vitepress";

/**
 * 侧边栏配置
 * @description 根据不同的路由路径，展示对应的侧边栏
 */
export const sidebar: DefaultTheme.Sidebar = {
  // 指南
  "/views/guide/": [
    {
      text: "快速上手",
      collapsed: false,
      items: [
        { text: "介绍", link: "/views/guide/" },
        { text: "快速开始", link: "/views/guide/getting-started" },
        { text: "安装配置", link: "/views/guide/installation" },
        { text: "项目结构", link: "/views/guide/project-structure" },
      ],
    },
    {
      text: "规范约定",
      collapsed: false,
      items: [
        { text: "开发规范", link: "/views/guide/development-standards" },
        { text: "提交规范", link: "/views/guide/commit-standards" },
        { text: "贡献指南", link: "/views/guide/contributing" },
      ],
    },
    {
      text: "元配置",
      collapsed: false,
      items: [
        { text: "项目配置", link: "/views/guide/project-config" },
        { text: "Git 配置", link: "/views/guide/git-config" },
        { text: "环境配置", link: "/views/guide/environment-config" },
        { text: "UnoCSS 配置", link: "/views/guide/unocss-config" },
      ],
    },
  ],

  // 工程化
  "/views/engineering/": [
    {
      text: "工程化",
      collapsed: false,
      items: [
        { text: "脚手架", link: "/views/engineering/scaffold" },
        { text: "构建工具", link: "/views/engineering/build" },
        { text: "代码质量", link: "/views/engineering/code-quality" },
        { text: "测试方案", link: "/views/engineering/testing" },
        { text: "CI/CD", link: "/views/engineering/ci-cd" },
      ],
    },
  ],

  // 最佳实践
  "/views/best-practices/": [
    {
      text: "最佳实践",
      collapsed: false,
      items: [
        { text: "架构设计", link: "/views/best-practices/architecture" },
        { text: "性能优化", link: "/views/best-practices/performance" },
        { text: "安全规范", link: "/views/best-practices/security" },
        { text: "编码规范", link: "/views/best-practices/coding-standards" },
      ],
    },
  ],

  // 样式方案
  "/views/styling": [
    {
      text: "样式方案",
      collapsed: false,
      items: [
        { text: "概述", link: "/views/styling" },
        { text: "UnoCSS", link: "/views/styling/unocss" },
      ],
    },
  ],

  // 组件库
  "/ui-components/": [
    {
      text: "开发指南",
      collapsed: false,
      items: [
        { text: "介绍", link: "/ui-components/" },
        { text: "快速开始", link: "/ui-components/guide/quickstart" },
        { text: "安装", link: "/ui-components/guide/installation" },
      ],
    },
    {
      text: "基础组件",
      collapsed: false,
      items: [
        { text: "Button 按钮", link: "/ui-components/basic/button" },
        { text: "Icon 图标", link: "/ui-components/basic/icon" },
        { text: "Input 输入框", link: "/ui-components/basic/input" },
        { text: "Select 选择器", link: "/ui-components/basic/select" },
      ],
    },
    {
      text: "布局组件",
      collapsed: false,
      items: [
        { text: "Container 容器", link: "/ui-components/layout/container" },
        { text: "Grid 栅格", link: "/ui-components/layout/grid" },
      ],
    },
    {
      text: "表单组件",
      collapsed: false,
      items: [
        { text: "Form 表单", link: "/ui-components/form/form" },
        { text: "FormItem 表单项", link: "/ui-components/form/form-item" },
      ],
    },
    {
      text: "数据展示",
      collapsed: false,
      items: [
        { text: "Table 表格", link: "/ui-components/data/table" },
        { text: "Pagination 分页", link: "/ui-components/data/pagination" },
      ],
    },
    {
      text: "反馈组件",
      collapsed: false,
      items: [
        { text: "Message 消息", link: "/ui-components/feedback/message" },
        { text: "Modal 对话框", link: "/ui-components/feedback/modal" },
      ],
    },
    {
      text: "业务组件",
      collapsed: false,
      items: [
        {
          text: "UserSelector 用户选择",
          link: "/ui-components/business/user-selector",
        },
        {
          text: "DepartmentTree 部门树",
          link: "/ui-components/business/department-tree",
        },
      ],
    },
  ],

  // 疑难杂症
  "/views/troubleshooting/": [
    {
      text: "常见问题",
      collapsed: false,
      items: [
        { text: "概述", link: "/views/troubleshooting/" },
        { text: "环境配置问题", link: "/views/troubleshooting/environment" },
        { text: "构建部署问题", link: "/views/troubleshooting/build-deploy" },
      ],
    },
    {
      text: "疑难问题",
      collapsed: false,
      items: [
        {
          text: "性能问题排查",
          link: "/views/troubleshooting/performance-issues",
        },
        { text: "兼容性问题", link: "/views/troubleshooting/compatibility" },
        { text: "第三方库问题", link: "/views/troubleshooting/third-party" },
      ],
    },
    {
      text: "调试技巧",
      collapsed: false,
      items: [
        { text: "开发工具使用", link: "/views/troubleshooting/devtools" },
        { text: "日志调试", link: "/views/troubleshooting/debugging-logs" },
        { text: "错误追踪", link: "/views/troubleshooting/error-tracking" },
      ],
    },
  ],

  // 晋钢优化日志
  "/views/jingang-optimization/": [
    {
      text: "优化记录",
      collapsed: false,
      items: [{ text: "概述", link: "/views/jingang-optimization/" }],
    },
  ],
};
