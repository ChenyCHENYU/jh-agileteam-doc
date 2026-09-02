/**
 * L0~L7 能力层级单一数据源
 * 指南页 / best-practices/index / ai-landscape 三处表格统一从这里渲染，改层级状态只改这里。
 */

export type LevelStatus = "known" | "done" | "doing" | "next" | "future";

export interface Level {
  /** 层级编号，如 L0 */
  id: string;
  /** 层级名称，如 氛围编程 */
  name: string;
  /** 短描述（指南页 short 模式） */
  desc: string;
  /** 长描述（detail 模式：best-practices / ai-landscape） */
  detail: string;
  status: LevelStatus;
  statusText: string;
  /** 文档页链接 */
  link: string;
}

export const levels: Level[] = [
  {
    id: "L0",
    name: "氛围编程",
    desc: "纯对话驱动，了解边界",
    detail: "纯对话驱动，AI 自由发挥，高随机性",
    status: "known",
    statusText: "了解边界",
    link: "/views/best-practices/L0-vibe",
  },
  {
    id: "L1",
    name: "提示词工程",
    desc: "规范注入 + 上下文压缩 + 一致性保持",
    detail: "结构化 Prompt + 规范注入 + 上下文压缩（copilot-instructions.md + standards 懒加载 + 多编辑器适配）",
    status: "done",
    statusText: "✅ 已实现",
    link: "/views/best-practices/L1-prompt",
  },
  {
    id: "L2",
    name: "Skill",
    desc: "13 个触发词驱动的结构化技能文件",
    detail: "13 个触发词驱动的结构化技能文件 → 速查表见前端 Skills 使用指南",
    status: "done",
    statusText: "✅ 已实现",
    link: "/views/best-practices/L2-skill",
  },
  {
    id: "L3",
    name: "MCP 工具调用",
    desc: "29 个 Tool，菜单/字典/权限/项目感知/快照蓝图/环境标准化全覆盖",
    detail: "29 个 Tool，菜单/字典/角色/权限/项目感知/快照蓝图/环境标准化全覆盖",
    status: "done",
    statusText: "✅ 已实现",
    link: "/views/best-practices/L3-skills-mcp",
  },
  {
    id: "L4",
    name: "CLI",
    desc: "18 条命令，覆盖安装/校验/修复/契约/场景渲染全生命周期",
    detail: "18 条命令：init / update / clean / check / diff / validate / validate-page / fix / doctor-ui / export / mock-clean / contract / component / standard-env / template / snapshot / scenario",
    status: "done",
    statusText: "✅ 已实现",
    link: "/views/best-practices/L4-cli",
  },
  {
    id: "L5",
    name: "Agent Pipeline",
    desc: "Skill 链式自动触发，_pipeline.md 协议已落地",
    detail: "_pipeline.md 协议已落地，Skill 链式自动触发进入试运行",
    status: "doing",
    statusText: "🟡 践行中",
    link: "/views/best-practices/L5-agent-pipeline",
  },
  {
    id: "L6",
    name: "Multi-Agent 协同",
    desc: "专家 Agent 分工 + 并发处理",
    detail: "L5 试运行期间同步规划多智能体分工",
    status: "next",
    statusText: "▶ 近期目标",
    link: "/views/best-practices/L6-multi-agent",
  },
  {
    id: "L7",
    name: "自演化体系",
    desc: "高质量产出反哺规范，正向飞轮",
    detail: "高质量产出反哺规范，正向飞轮（启动条件：L5 稳定 + 审计报告 ≥ 50 份 + 模板提取 ≥ 3 次）",
    status: "future",
    statusText: "🔭 终极形态",
    link: "/views/best-practices/L7-self-evolving",
  },
];
