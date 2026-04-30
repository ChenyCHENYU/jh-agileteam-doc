import type { DefaultTheme } from "vitepress";

/**
 * 侧边栏配置
 * @description 根据不同的路由路径，展示对应的侧边栏
 */
export const sidebar: DefaultTheme.Sidebar = {
  // 指南
  "/views/guide/": [
    {
      text: "指南",
      collapsed: false,
      items: [
        { text: "介绍", link: "/views/guide/" },
      ],
    },
  ],

  // 最佳实践
  "/views/best-practices/": [
    {
      text: "AI 最佳实践",
      collapsed: false,
      items: [
        { text: "概述", link: "/views/best-practices/" },
        { text: "全景分析", link: "/views/best-practices/ai-landscape" },
      ],
    },
    {
      text: "能力层级（L0 → L7）",
      collapsed: false,
      items: [
        { text: "L0 — 氛围编程", link: "/views/best-practices/L0-vibe" },
        { text: "L1 — 提示词工程", link: "/views/best-practices/L1-prompt" },
        { text: "L2 — Skill", link: "/views/best-practices/L2-skill" },
        { text: "L3 — MCP 工具调用", link: "/views/best-practices/L3-skills-mcp" },
        { text: "L4 — CLI", link: "/views/best-practices/L4-cli" },
        { text: "L5 — Agent Pipeline", link: "/views/best-practices/L5-agent-pipeline" },
        { text: "L6 — Multi-Agent 协同", link: "/views/best-practices/L6-multi-agent" },
        { text: "L7 — 自演化体系", link: "/views/best-practices/L7-self-evolving" },
      ],
    },
  ],

  // 快速上手
  "/frontend/quick-start/": [
    {
      text: "快速上手",
      collapsed: false,
      items: [
        { text: "介绍", link: "/frontend/quick-start/" },
        { text: "快速开始", link: "/frontend/quick-start/getting-started" },
        { text: "安装配置", link: "/frontend/quick-start/installation" },
        { text: "项目结构", link: "/frontend/quick-start/project-structure" },
      ],
    },
    {
      text: "规范约定",
      collapsed: false,
      items: [
        { text: "⓪ 基本规范（约定俗成）", link: "/frontend/quick-start/development-standards" },
        { text: "① 工具链规范（ESLint · Prettier）", link: "/frontend/quick-start/01-toolchain" },
        { text: "② 代码结构与顺序规范", link: "/frontend/quick-start/02-code-structure" },
        { text: "③ 注释规范", link: "/frontend/quick-start/03-comments" },
        { text: "④ 基础编码规范", link: "/frontend/quick-start/04-coding-basics" },
        { text: "⑤ 日志输出规范", link: "/frontend/quick-start/05-logging" },
        { text: "⑥ 安全规范", link: "/frontend/quick-start/06-security" },
        { text: "⑦ 配置管理规范", link: "/frontend/quick-start/07-config" },
        { text: "⑧ Git 分支 & 提交规范", link: "/frontend/quick-start/08-git" },
        { text: "⑨ TypeScript 类型规范", link: "/frontend/quick-start/09-typescript" },
        { text: "⑩ Pinia 状态管理规范", link: "/frontend/quick-start/10-pinia" },
        { text: "⑪ 表单与校验规范", link: "/frontend/quick-start/11-form-validation" },
      ],
    },
    {
      text: "参考 & 附录",
      collapsed: true,
      items: [
        { text: "贡献指南", link: "/frontend/quick-start/contributing" },
        { text: "Waline 评论系统", link: "/frontend/quick-start/waline-usage" },
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
        { text: "架构设计", link: "/frontend/pc/architecture" },
      ],
    },
    {
      text: "扩展规范",
      collapsed: false,
      items: [
        { text: "规范概览", link: "/frontend/pc/standards" },
        { text: "BaseTable & AGGrid 规范", link: "/frontend/pc/12-base-table" },
        { text: "平台组件合规规范", link: "/frontend/pc/13-platform-components" },
      ],
    },
    {
      text: "Skills 集合",
      collapsed: false,
      items: [
        { text: "概述", link: "/frontend/pc/skills/" },
        { text: "AI Skill 流水线", link: "/frontend/pc/skills/skill-pipeline" },
        { text: "使用指南", link: "/frontend/pc/skills/usage-guide" },
      ],
    },
    {
      text: "9 个 AI Skill",
      collapsed: false,
      items: [
        { text: "① 原型扫描", link: "/frontend/pc/skills/prototype-scan" },
        { text: "② 接口约定", link: "/frontend/pc/skills/api-contract" },
        { text: "③ 页面代码生成", link: "/frontend/pc/skills/page-codegen" },
        { text: "④ 菜单同步", link: "/frontend/pc/skills/menu-sync" },
        { text: "⑤ 字典同步", link: "/frontend/pc/skills/dict-sync" },
        { text: "⑥ 权限同步", link: "/frontend/pc/skills/permission-sync" },
        { text: "⑦ 规范审计", link: "/frontend/pc/skills/convention-audit" },
        { text: "⑧ 受控自动修复", link: "/frontend/pc/skills/code-fix" },
        { text: "⑨ 模板提取", link: "/frontend/pc/skills/template-extract" },
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

  // 前端移动端 H5
  "/frontend/mobile-h5/": [
    {
      text: "移动端 H5",
      collapsed: false,
      items: [
        { text: "概览 & 技术选型", link: "/frontend/mobile-h5/" },
        { text: "扩展规范", link: "/frontend/mobile-h5/standards" },
      ],
    },
    {
      text: "Skills 集合",
      collapsed: false,
      items: [
        { text: "概述", link: "/frontend/mobile-h5/skills" },
        { text: "AI Skill 流水线", link: "/frontend/mobile-h5/skill-pipeline" },
      ],
    },
    {
      text: "7 个 AI Skill",
      collapsed: false,
      items: [
        { text: "① 原型扫描", link: "/frontend/mobile-h5/prototype-scan" },
        { text: "② 接口规格", link: "/frontend/mobile-h5/api-spec" },
        { text: "③ 接口约定", link: "/frontend/mobile-h5/api-contract" },
        { text: "④ 页面代码生成", link: "/frontend/mobile-h5/page-codegen" },
        { text: "⑤ 路由注册", link: "/frontend/mobile-h5/route-register" },
        { text: "⑥ Mock 生成", link: "/frontend/mobile-h5/mock-gen" },
        { text: "⑦ 规范审计", link: "/frontend/mobile-h5/convention-audit" },
      ],
    },
    {
      text: "@robot-h5/core",
      collapsed: false,
      items: [
        { text: "概览 & 快速开始", link: "/frontend/mobile-h5/h5-core/" },
        { text: "15 个 Hooks", link: "/frontend/mobile-h5/h5-core/hooks" },
        { text: "Bridge 适配层", link: "/frontend/mobile-h5/h5-core/bridge" },
        { text: "工具函数库", link: "/frontend/mobile-h5/h5-core/utils" },
        { text: "配置系统", link: "/frontend/mobile-h5/h5-core/config" },
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
