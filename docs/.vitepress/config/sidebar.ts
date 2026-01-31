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
      text: "说明",
      collapsed: false,
      items: [{ text: "介绍", link: "/ui-components/" }],
    },
    {
      text: "平台组件（远程）",
      collapsed: false,
      items: [
        {
          text: "BaseTable 表格组件",
          link: "/ui-components/remote-components/BaseTable",
        },
        {
          text: "BaseForm 表单组件",
          link: "/ui-components/remote-components/BaseForm",
        },
        {
          text: "BaseQuery 查询组件",
          link: "/ui-components/remote-components/BaseQuery",
        },
        {
          text: "AGGrid 高性能表格",
          link: "/ui-components/remote-components/AGGrid",
        },
        {
          text: "jh-date-range 日期范围选择",
          link: "/ui-components/remote-components/jh-date-range",
        },
        {
          text: "jh-date 单日期选择",
          link: "/ui-components/remote-components/jh-date",
        },
        {
          text: "jh-dept-picker 部门选择",
          link: "/ui-components/remote-components/jh-dept-picker",
        },
        {
          text: "jh-drag-row 可拖拽分栏",
          link: "/ui-components/remote-components/jh-drag-row",
        },
        {
          text: "jh-file-upload 文件上传",
          link: "/ui-components/remote-components/jh-file-upload",
        },
        {
          text: "jh-pagination 分页组件",
          link: "/ui-components/remote-components/jh-pagination",
        },
        {
          text: "jh-picker 通用挑选组件",
          link: "/ui-components/remote-components/jh-picker",
        },
        {
          text: "jh-select 字典下拉",
          link: "/ui-components/remote-components/jh-select",
        },
        {
          text: "jh-text 文本展示",
          link: "/ui-components/remote-components/jh-text",
        },
        {
          text: "jh-user-picker 用户选择",
          link: "/ui-components/remote-components/jh-user-picker",
        },
      ],
    },
    {
      text: "全局组件占位",
      collapsed: false,
      items: [
        { text: "全局组件（占位）", link: "/ui-components/global-components" },
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
      items: [
        { text: "概述", link: "/views/jingang-optimization/" },
        {
          text: "优化执行方案",
          link: "/views/jingang-optimization/optimization-plan",
        },
        {
          text: "入口页面【index.html】",
          link: "/views/jingang-optimization/entry",
        },
        {
          text: "css 引擎【unocss.config】",
          link: "/views/jingang-optimization/unocss",
        },
        {
          text: "头部组件【Navbar.vue】",
          link: "/views/jingang-optimization/navbar",
        },
        {
          text: "TypeScript 类型【tsconfig.ts】",
          link: "/views/jingang-optimization/typescript",
        },
        {
          text: "自动导入【auto-import】",
          link: "/views/jingang-optimization/auto-import-config",
        },
        {
          text: "菜单图标【icon-map.ts】",
          link: "/views/jingang-optimization/menu-icon",
        },
        {
          text: "菜单组件【menuNav】",
          link: "/views/jingang-optimization/menu",
        },
        {
          text: "我的收藏【index.vue】",
          link: "/views/jingang-optimization/collection",
        },
        {
          text: "接口调用【api】",
          link: "/views/jingang-optimization/api",
        },
        {
          text: "合并发布【防止事故】",
          link: "/views/jingang-optimization/merge",
        },
        {
          text: "代码构建【Vue SFC】",
          link: "/views/jingang-optimization/build",
        },
        {
          text: "uat脚本命令【package.json】",
          link: "/views/jingang-optimization/package-scripts",
        },
        {
          text: "vite优化【vite.config.ts】",
          link: "/views/jingang-optimization/vite",
        },
        {
          text: "架构优化【模块联邦迁移】",
          link: "/views/jingang-optimization/module-federation-migration",
        },
        {
          text: "字体优化【fonts】",
          link: "/views/jingang-optimization/font-optimiza",
        },
        {
          text: "成本项目【独立部署】",
          link: "/views/jingang-optimization/cost-optimiza",
        },
      ],
    },
  ],
};
