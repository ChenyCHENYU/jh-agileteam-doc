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
  ],

  // 最佳实践
  "/views/best-practices/": [
    {
      text: "标准动作",
      collapsed: false,
      items: [
        { text: "架构设计", link: "/views/best-practices/architecture" },
        { text: "HTTP 请求", link: "/views/best-practices/request-usage" },
      ],
    },
  ],

  // 前端 PC 端
  "/frontend/pc/": [
    {
      text: "PC 端前端",
      collapsed: false,
      items: [
        { text: "概览 & 技术选型", link: "/frontend/pc/" },
        { text: "开发规范", link: "/frontend/pc/standards" },
      ],
    },
    {
      text: "Skills 集合",
      collapsed: false,
      items: [
        { text: "概述", link: "/frontend/pc/skills/" },
        { text: "AI Skill 流水线", link: "/frontend/pc/skills/skill-pipeline" },
      ],
    },
    {
      text: "5 个 AI Skill",
      collapsed: false,
      items: [
        { text: "① 原型扫描", link: "/frontend/pc/skills/prototype-scan" },
        { text: "② 接口约定", link: "/frontend/pc/skills/api-contract" },
        { text: "③ 页面代码生成", link: "/frontend/pc/skills/page-codegen" },
        { text: "④ 菜单同步", link: "/frontend/pc/skills/menu-sync" },
        { text: "⑤ 规范审计", link: "/frontend/pc/skills/convention-audit" },
      ],
    },
    {
      text: "页面模板",
      collapsed: false,
      items: [
        { text: "9 种模板总览", link: "/frontend/pc/skills/page-templates" },
      ],
    },
    {
      text: "实践",
      collapsed: false,
      items: [
        { text: "使用指南", link: "/frontend/pc/skills/usage-guide" },
        { text: "CLI 工具", link: "/frontend/pc/skills/cli" },
      ],
    },
  ],

  // 前端移动端
  "/frontend/mobile/": [
    {
      text: "移动端前端",
      collapsed: false,
      items: [
        { text: "概览（规划中）", link: "/frontend/mobile/" },
      ],
    },
  ],

  // 后端
  "/backend/": [
    {
      text: "后端",
      collapsed: false,
      items: [
        { text: "概览 & 技术选型", link: "/backend/" },
        { text: "开发规范", link: "/backend/standards" },
      ],
    },
    {
      text: "Skills 集合",
      collapsed: false,
      items: [
        { text: "概述", link: "/backend/skills/" },
      ],
    },
  ],

  // AI 工作流
  "/views/ai-workflow/": [
    {
      text: "AI 工作流",
      collapsed: false,
      items: [
        { text: "概述", link: "/views/ai-workflow/" },
        { text: "原型设计", link: "/views/ai-workflow/prototype" },
        { text: "详细设计", link: "/views/ai-workflow/detail-design" },
        { text: "全栈开发", link: "/views/ai-workflow/fullstack-dev" },
        { text: "测试实践", link: "/views/ai-workflow/testing" },
      ],
    },
  ],

  // 样式方案
  "/views/styling/": [
    {
      text: "样式方案",
      collapsed: false,
      items: [
        { text: "概述", link: "/views/styling/" },
        {
          text: "UnoCSS 最佳实践",
          link: "/views/styling/unocss-best-practices",
        },
        { text: "SCSS 最佳实践", link: "/views/styling/scss-best-practices" },
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

  // 模板库
  "/templates/": [
    {
      text: "生产领域",
      collapsed: false,
      items: [
        {
          text: "【棒线材】精整实绩",
          link: "/templates/produce/production-plan",
        },
        { text: "工艺管理", link: "/templates/produce/process-management" },
        { text: "设备管理", link: "/templates/produce/equipment-management" },
      ],
    },
    {
      text: "质量领域",
      collapsed: false,
      items: [
        { text: "质量检验", link: "/templates/quality/quality-inspection" },
        { text: "质量跟踪", link: "/templates/quality/quality-tracking" },
        { text: "质量报表", link: "/templates/quality/quality-report" },
      ],
    },
    {
      text: "销售领域",
      collapsed: false,
      items: [
        { text: "订单管理", link: "/templates/sale/order-management" },
        { text: "客户管理", link: "/templates/sale/customer-management" },
        { text: "销售分析", link: "/templates/sale/sales-analysis" },
      ],
    },
    {
      text: "成本领域",
      collapsed: false,
      items: [
        { text: "成本核算", link: "/templates/cost/cost-accounting" },
        { text: "成本分析", link: "/templates/cost/cost-analysis" },
        { text: "成本报表", link: "/templates/cost/cost-report" },
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
};
