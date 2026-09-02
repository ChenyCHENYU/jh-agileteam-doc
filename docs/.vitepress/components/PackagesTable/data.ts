/**
 * 五包工程能力单一数据源
 * 发版时只改这里：guide 指南页表格、GlassHome 首页统计自动同步。
 */

export interface Pkg {
  /** npm 包名 */
  name: string;
  /** 当前发布版本 */
  version: string;
  /** 一句话定位 */
  scope: string;
  /** 文档入口链接 */
  doc: string;
  /** 文档入口文案 */
  docLabel: string;
  /** 典型安装命令 */
  install: string;
  /** 确定性规则族（用于统计与展示） */
  rules: string;
}

export const packages: Pkg[] = [
  {
    name: "wl-skills-design",
    version: "0.11.1",
    scope: "需求设计：流程图 / 说明书 / 原型标注 / 数据库 / 接口 / 评审",
    doc: "/views/ai-workflow/design-skills",
    docLabel: "产品设计 Skills",
    install: "npx @agile-team/wl-skills-design",
    rules: "verify 四域机械校验",
  },
  {
    name: "wl-skills-kit",
    version: "2.20.1",
    scope: "前端 PC：页面生成 / 规范审计 / 菜单字典权限同步 / 场景渲染",
    doc: "/frontend/pc/skills/",
    docLabel: "前端 PC Skills",
    install: "npx @agile-team/wl-skills-kit",
    rules: "K1~K19",
  },
  {
    name: "wl-skills-ui",
    version: "1.12.0",
    scope: "视觉一致：设计令牌 / 扫描修复 / 运行时守护 / 页面契约",
    doc: "/views/styling/wl-skills-ui",
    docLabel: "UI 统一规范",
    install: "npx @agile-team/wl-skills-ui",
    rules: "R001~R043",
  },
  {
    name: "wl-skills-bd",
    version: "0.24.0",
    scope: "后端：契约驱动生成 / 数据治理 / 质量门 / 变更审查",
    doc: "/backend/skills/",
    docLabel: "后端 Skills",
    install: "npx @agile-team/wl-skills-bd",
    rules: "B1~B31 + J1~J8",
  },
  {
    name: "wl-skills-test",
    version: "0.11.0",
    scope: "测试：用例生成 / 深度执行 / 统一报告 / 质量门",
    doc: "/views/testing/",
    docLabel: "测试工程 Skills",
    install: "npx @agile-team/wl-skills-test",
    rules: "T1~T25",
  },
];

/** 站点级统计（GlassHome / 指南页共用，改包时同步维护） */
export const siteStats = {
  packages: packages.length,
  skills: 48, // kit 13 + design 10 + bd 13 + test 12
  mcp: 76, // kit 29 + ui 13 + bd 17 + test 17
  rules: 114, // K19 + R39 + B31 + T25
};
