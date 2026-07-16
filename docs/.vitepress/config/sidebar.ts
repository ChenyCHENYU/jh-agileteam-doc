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
      items: [{ text: "介绍", link: "/views/guide/" }],
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
        {
          text: "L3 — MCP 工具调用",
          link: "/views/best-practices/L3-skills-mcp",
        },
        { text: "L4 — CLI", link: "/views/best-practices/L4-cli" },
        {
          text: "L5 — Agent Pipeline",
          link: "/views/best-practices/L5-agent-pipeline",
          badge: { text: "试运行", type: "tip" },
        },
        {
          text: "L6 — Multi-Agent 协同",
          link: "/views/best-practices/L6-multi-agent",
          badge: { text: "远期", type: "info" },
        },
        {
          text: "L7 — 自演化体系",
          link: "/views/best-practices/L7-self-evolving",
          badge: { text: "远期", type: "info" },
        },
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
        {
          text: "⓪ 基本规范（约定俗成）",
          link: "/frontend/quick-start/development-standards",
        },
        {
          text: "① 工具链规范（ESLint · Prettier）",
          link: "/frontend/quick-start/01-toolchain",
        },
        {
          text: "② 代码结构与顺序规范",
          link: "/frontend/quick-start/02-code-structure",
        },
        { text: "③ 注释规范", link: "/frontend/quick-start/03-comments" },
        {
          text: "④ 基础编码规范",
          link: "/frontend/quick-start/04-coding-basics",
        },
        { text: "⑤ 日志输出规范", link: "/frontend/quick-start/05-logging" },
        { text: "⑥ 安全规范", link: "/frontend/quick-start/06-security" },
        { text: "⑦ 配置管理规范", link: "/frontend/quick-start/07-config" },
        { text: "⑧ Git 分支 & 提交规范", link: "/frontend/quick-start/08-git" },
        {
          text: "⑨ TypeScript 类型规范",
          link: "/frontend/quick-start/09-typescript",
        },
        {
          text: "⑩ Pinia 状态管理规范",
          link: "/frontend/quick-start/10-pinia",
        },
        {
          text: "⑪ 表单与校验规范",
          link: "/frontend/quick-start/11-form-validation",
        },
      ],
    },
    {
      text: "参考 & 附录",
      collapsed: true,
      items: [
        { text: "贡献指南", link: "/frontend/quick-start/contributing" },
        { text: "ESLint & Prettier 规范约定", link: "/frontend/quick-start/eslint-prettier-ts" },
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
        {
          text: "平台组件合规规范",
          link: "/frontend/pc/13-platform-components",
        },
      ],
    },
    {
      text: "Base 核心组件",
      collapsed: false,
      items: [
        { text: "BaseTable — 基础表格", link: "/frontend/pc/components/base-table" },
        { text: "BaseForm — 基础表单", link: "/frontend/pc/components/base-form" },
        { text: "BaseQuery — 查询栏", link: "/frontend/pc/components/base-query" },
        { text: "BaseToolbar — 操作栏", link: "/frontend/pc/components/base-toolbar" },
        { text: "AGGrid — 高性能表格", link: "/frontend/pc/components/ag-grid" },
      ],
    },
    {
      text: "jh- 平台组件",
      collapsed: false,
      items: [
        { text: "jh-input — 输入框", link: "/frontend/pc/components/jh-input" },
        { text: "jh-input-number — 数字输入", link: "/frontend/pc/components/jh-input-number" },
        { text: "jh-text — 文本展示", link: "/frontend/pc/components/jh-text" },
        { text: "jh-textarea — 多行文本", link: "/frontend/pc/components/jh-textarea" },
        { text: "jh-select — 字典下拉", link: "/frontend/pc/components/jh-select" },
        { text: "jh-radio-group — 单选组", link: "/frontend/pc/components/jh-radio-group" },
        { text: "jh-checkbox-group — 多选组", link: "/frontend/pc/components/jh-checkbox-group" },
        { text: "jh-switch — 开关", link: "/frontend/pc/components/jh-switch" },
        { text: "jh-cascader — 级联选择", link: "/frontend/pc/components/jh-cascader" },
        { text: "jh-date — 日期选择", link: "/frontend/pc/components/jh-date" },
        { text: "jh-date-range — 日期范围", link: "/frontend/pc/components/jh-date-range" },
        { text: "jh-tree-picker — 树选择", link: "/frontend/pc/components/jh-tree-picker" },
        { text: "jh-picker — 通用挑选", link: "/frontend/pc/components/jh-picker" },
        { text: "jh-dept-picker — 部门选择", link: "/frontend/pc/components/jh-dept-picker" },
        { text: "jh-user-picker — 用户选择", link: "/frontend/pc/components/jh-user-picker" },
        { text: "jh-file-upload — 文件上传", link: "/frontend/pc/components/jh-file-upload" },
        { text: "jh-pagination — 分页", link: "/frontend/pc/components/jh-pagination" },
        { text: "jh-tabs — 标签页", link: "/frontend/pc/components/jh-tabs" },
        { text: "jh-tabs-pane — 标签面板", link: "/frontend/pc/components/jh-tabs-pane" },
        { text: "jh-drag-row — 上下分栏", link: "/frontend/pc/components/jh-drag-row" },
        { text: "jh-drag-col — 左右分栏", link: "/frontend/pc/components/jh-drag-col" },
        { text: "jh-progress — 进度条", link: "/frontend/pc/components/jh-progress" },
        { text: "jh-button — 按钮", link: "/frontend/pc/components/jh-button" },
        { text: "jh-icon — 图标", link: "/frontend/pc/components/jh-icon" },
        { text: "jh-dialog — 对话框", link: "/frontend/pc/components/jh-dialog" },
        { text: "jh-drawer — 抽屉", link: "/frontend/pc/components/jh-drawer" },
      ],
    },
    {
      text: "C_ 全局组件",
      collapsed: true,
      items: [
        { text: "C_Tree — 树形组件", link: "/frontend/pc/components/c-tree" },
        { text: "C_TagStatus — 状态标签", link: "/frontend/pc/components/c-tag-status" },
      ],
    },
    {
      text: "c_ 本地组件",
      collapsed: true,
      items: [
        { text: "c_formModal — 表单弹窗", link: "/frontend/pc/components/c-form-modal" },
        { text: "c_formSections — 表单分区", link: "/frontend/pc/components/c-form-sections" },
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
      text: "12 个 AI Skill",
      collapsed: true,
      items: [
        { text: "① 原型扫描", link: "/frontend/pc/skills/prototype-scan" },
        { text: "② 说明书解析", link: "/frontend/pc/skills/spec-doc-parse" },
        { text: "③ 业务文档提取", link: "/frontend/pc/skills/business-doc-extract" },
        { text: "④ 接口约定", link: "/frontend/pc/skills/api-contract" },
        { text: "⑤ 页面代码生成", link: "/frontend/pc/skills/page-codegen" },
        { text: "⑥ 规范审计", link: "/frontend/pc/skills/convention-audit" },
        { text: "⑦ 模板提取", link: "/frontend/pc/skills/template-extract" },
        { text: "⑧ 菜单同步", link: "/frontend/pc/skills/menu-sync" },
        { text: "⑨ 字典同步", link: "/frontend/pc/skills/dict-sync" },
        { text: "⑩ 权限同步", link: "/frontend/pc/skills/permission-sync" },
        { text: "⑪ 受控自动修复", link: "/frontend/pc/skills/code-fix" },
        { text: "⑫ 环境配置", link: "/frontend/pc/skills/env-config" },
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
        { text: "wl-skills-kit 工具", link: "/frontend/pc/skills/cli" },
      ],
    },
  ],

  // 前端移动端 uniApp
  "/frontend/mobile-uniapp/": [
    {
      text: "移动端 uniApp",
      collapsed: false,
      items: [
        { text: "概览 & 技术选型", link: "/frontend/mobile-uniapp/" },
        { text: "H5 子应用集成方案", link: "/frontend/mobile-uniapp/integration" },
        { text: "App 集成与发布", link: "/frontend/mobile-uniapp/app-integration" },
        { text: "消息中心架构设计", link: "/frontend/mobile-uniapp/message-center" },
        { text: "钉钉集成方案", link: "/frontend/mobile-uniapp/dingtalk" },
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
      collapsed: true,
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

  // 工程脚手架
  "/scaffold/": [
    {
      text: "工程脚手架",
      collapsed: false,
      items: [
        { text: "概览 & 快速开始", link: "/scaffold/" },
        { text: "创建项目", link: "/scaffold/create" },
      ],
    },
    {
      text: "命令 & 配置",
      collapsed: false,
      items: [{ text: "命令参考", link: "/scaffold/commands" }],
    },
    {
      text: "模板体系",
      collapsed: false,
      items: [
        { text: "模板来源 & Catalog", link: "/scaffold/templates" },
        { text: "模板接入规范", link: "/scaffold/template-spec" },
      ],
    },
    {
      text: "参考",
      collapsed: true,
      items: [{ text: "常见问题", link: "/scaffold/faq" }],
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
      items: [{ text: "概述", link: "/backend/skills/" }],
    },
  ],

  // AI 工作流
  "/views/ai-workflow/": [
    {
      text: "AI 工作流",
      collapsed: false,
      items: [
        { text: "概述", link: "/views/ai-workflow/" },
        { text: "wl-skills-design 设计技能包", link: "/views/ai-workflow/design-skills" },
        { text: "原型设计", link: "/views/ai-workflow/prototype", badge: { text: "规划中", type: "warning" } },
        { text: "详细设计", link: "/views/ai-workflow/detail-design", badge: { text: "规划中", type: "warning" } },
        { text: "全栈开发", link: "/views/ai-workflow/fullstack-dev", badge: { text: "规划中", type: "warning" } },
        { text: "测试实践", link: "/views/ai-workflow/testing", badge: { text: "规划中", type: "warning" } },
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
        { text: "UI 设计系统", link: "/views/styling/ui-design-system" },
        { text: "wl-skills-ui 风格框架", link: "/views/styling/wl-skills-ui" },
      ],
    },
  ],

  // 组件库（统一在 /frontend/pc/components 维护，此处仅保留入口说明）
  "/ui-components/": [
    {
      text: "说明",
      collapsed: false,
      items: [{ text: "介绍", link: "/ui-components/" }],
    },
    {
      text: "平台组件文档",
      collapsed: false,
      items: [
        {
          text: "👉 前往 PC 组件文档（Base / jh- / C_ 全集）",
          link: "/frontend/pc/components/base-table",
        },
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

  // 团队
  "/views/team/": [
    {
      text: "团队",
      collapsed: false,
      items: [
        { text: "前端团队", link: "/views/team/" },
        { text: "业务团队", link: "/views/team/business" },
        { text: "后端团队", link: "/views/team/backend" },
      ],
    },
  ],

  // 疑难杂症
  "/views/troubleshooting/": [
    {
      text: "疑难杂症",
      collapsed: false,
      items: [
        { text: "概述", link: "/views/troubleshooting/" },
        {
          text: "环境配置问题",
          link: "/views/troubleshooting/",
          badge: { text: "待补充", type: "info" },
        },
        {
          text: "构建部署问题",
          link: "/views/troubleshooting/",
          badge: { text: "待补充", type: "info" },
        },
        {
          text: "性能问题排查",
          link: "/views/troubleshooting/",
          badge: { text: "待补充", type: "info" },
        },
        {
          text: "兼容性问题",
          link: "/views/troubleshooting/",
          badge: { text: "待补充", type: "info" },
        },
        {
          text: "第三方库问题",
          link: "/views/troubleshooting/",
          badge: { text: "待补充", type: "info" },
        },
        {
          text: "开发工具使用",
          link: "/views/troubleshooting/",
          badge: { text: "待补充", type: "info" },
        },
        {
          text: "日志调试",
          link: "/views/troubleshooting/",
          badge: { text: "待补充", type: "info" },
        },
        {
          text: "错误追踪",
          link: "/views/troubleshooting/",
          badge: { text: "待补充", type: "info" },
        },
      ],
    },
  ],
};
