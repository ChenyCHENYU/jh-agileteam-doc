# AI 辅助开发全景分析

> 基于 `@agile-team/wl-skills-kit` v2.7.3 架构梳理，更新日期：2026-05-16

<AuthorTag :authors="['CHENY']" />

## 为什么需要分层？

AI 辅助开发容易陷入两个极端：**"只会聊天"** 或 **"直接上 AI 自动化"**。前者浪费了 AI 的工程潜力，后者在规范、可靠性未就绪时引入大量不确定性。

分层模型的价值：**让每个团队清楚"我现在在哪里、下一步该做什么、成熟后能到哪里"**，避免跳级建设。

## 能力谱系总览

```
AI 辅助开发能力谱系（从低到高）
─────────────────────────────────────────────────
L0  氛围编程（Vibe Coding）
    │  纯自然语言 → AI 自由发挥 → 无规范约束
    │  适合：个人探索、学习、快速验证想法
    │
L1  提示词工程（Prompt Engineering）            ← 所有上层的基础
    │  结构化 Prompt → 规范注入 → 上下文压缩 → 触发词路由
    │  适合：团队有编码规范，希望 AI 稳定遵守
    │
L2  Skills（结构化技能文件）                    ← 当前项目核心
    │  触发词 → SKILL.md 剧本 → Pre-flight 声明 → 产物追加 reports/
    │  适合：高频重复任务（页面生成、接口约定、规范审计）
    │
L3  MCP（模型上下文协议）                       ← 当前项目已接入
    │  AI 主动调用工具 → 真实 I/O → 副作用执行 → 跨系统联动
    │  适合：需要 AI 直接操作系统（写文件、调接口、查数据库）
    │
L4  CLI（命令行工具）                           ← 当前项目已实现
    │  聚合命令 → 固化流程 → 零 AI 依赖 → CI/CD 集成
    │  适合：工程初始化、批量同步、流水线自动化
    │
L5  Agent Pipeline（智能体流水线）              ← 近期目标
    │  Skill 链式自动触发 → 状态传递 → 减少人工干预
    │  适合：多步骤标准化流程（原型→接口→代码→审计→同步）
    │
L6  Multi-Agent 协同                            ← 远期目标
    │  专家 Agent 分工 → 并发处理 → 上下文隔离 → 质量仲裁
    │  适合：超大规模批量生成、多域并发、专项增强
    │
L7  自演化体系（Self-Evolving）                 ← 终极形态
       高质量产出 → 反哺规范/模板 → 精度持续提升 → 正向飞轮
       适合：体系成熟后，让 AI 自主优化自身规则
─────────────────────────────────────────────────
```

## 各层级关键对比

| 层级 | Token 消耗 | 确定性 | 可 CI/CD | 实现成本 | 核心价值 |
|------|-----------|-------|---------|---------|---------|
| L0 | 高（无压缩） | 低 | ❌ | 零 | 探索验证 |
| L1 | 中（规范注入） | 中 | ❌ | 低 | 规范对齐 |
| L2 | 中（懒加载） | 高 | ❌ | 中 | 可复现产出 |
| L3 | 低（工具调用） | 高 | ⚠️ 有副作用 | 中 | 真实执行 |
| L4 | 极低（零推理） | 极高 | ✅ | 中 | 批量自动化 |
| L5 | 低（状态传递） | 高 | ⚠️ 需检查点 | 中高 | 流程自动串联 |
| L6 | 高（多 Agent） | 高 | ⚠️ 编排复杂 | 高 | 并发 + 专业化 |
| L7 | — | — | — | 极高 | 体系自优化 |

## 当前项目位置（v2.7.3）

| 层级 | 状态 | 说明 |
|------|------|------|
| L0 氛围编程 | 了解 | 每个人都用过，边界已清晰 |
| L1 提示词工程 | ✅ 已实现 | `copilot-instructions.md` + `standards` 懒加载 + 多编辑器适配 |
| L2 Skills | ✅ 已实现 | 10 个 Skill（含 business-doc-extract），pre-flight + registry + 模板分层 |
| L3 MCP | ✅ 已实现 | 17 个 Tool（菜单+字典+权限+项目感知+页面校验+UI体检+通知） |
| L4 CLI | ✅ 已实现 | 9 条命令：init / update / clean / check / diff / validate / validate-page / doctor-ui / export |
| L5 Agent Pipeline | 🟡 试运行中 | `_pipeline.md` 协议已落地，进入试运行阶段 |
| L6 Multi-Agent | ⏳ 远期 | L5 稳定后再规划 |
| L7 自演化体系 | 🔭 终极形态 | 需 L5 稳定 + 审计报告 ≥ 50 份 + 模板提取 ≥ 3 次 |


## 已实现的 17 个 MCP Tools

| 类别 | Tool | 能力 | 关联 Skill |
|------|------|------|----------|
| 菜单 | `wls_menu_query` | 查询完整菜单树 | menu-sync 前置 |
| 菜单 | `wls_menu_upsert` | 批量新增/更新菜单 | menu-sync 执行 |
| 菜单 | `wls_menu_sync_from_report` | 从报告文件确定性同步菜单 | menu-sync |
| 字典 | `wls_dict_query` | 查询字典模块 | dict-sync 前置 |
| 字典 | `wls_dict_upsert` | 新增/更新字典 | dict-sync 执行 |
| 权限 | `wls_role_query` | 查询角色列表 | permission-sync |
| 权限 | `wls_role_upsert` | 批量新增角色（按 code 去重） | permission-sync |
| 权限 | `wls_assignable_menus_query` | 查询全量可授权菜单 | permission-sync |
| 权限 | `wls_role_assign_menus` | 给角色批量分配菜单（全量覆盖） | permission-sync |
| 权限 | `wls_action_query` | 查询页面下的动作（type=A） | permission-sync |
| 权限 | `wls_action_upsert` | 批量新增动作（按 permission 去重） | permission-sync |
| 项目感知 | `wls_code_scan` | 扫描页面目录和文件完整性 | convention-audit 前置 |
| 项目感知 | `wls_route_check` | 检查页面是否在路由中可发现 | page-codegen 后置 |
| 项目感知 | `wls_validate_page` | 校验页面 AGGrid/cid/api.md/mock/操作列等 | convention-audit |
| 项目感知 | `wls_doctor_ui` | 检查 wl-skills-ui tokens/styles/preset/runtime 接入 | 全局 |
| 项目感知 | `wls_git_log_extract` | 提取近期 Git 提交摘要 | changelog-gen |
| 通知 | `wls_audit_report_push` | 推送审计报告到飞书 webhook（可选） | convention-audit |

> **整体效果**：菜单/权限同步 token 节省约 **87%**；操作时间压缩 **15-20 倍**；人工点击次数 → **0**。

## 已实现的 9 条 CLI 命令

| 命令 | 用途 |
|------|------|
| `init` | 全量安装 AI 体系 + 多编辑器配置 + MCP 配置生成 |
| `update` | MD5 比对增量更新，保护 `reports/` |
| `clean` | 移除 AI 文件（保留 components + types） |
| `check` | 一键环境预检：Node / 工具链 / env.local.json / MCP 连通性 |
| `diff` | 对比已安装文件与最新 kit 版本差异 |
| `validate` | 静态扫描页面完整性、AGGrid、cid、mock、api.md（CI 卡门）|
| `validate-page` | `validate` 别名，支持单页/目录路径 |
| `doctor-ui` | 检查 wl-skills-ui 接入完整性 |
| `export` | 导出菜单/字典/权限基线 xlsx |

## 延伸阅读

- [L0 — 氛围编程](./L0-vibe)
- [L2 — Skill](./L2-skill) — 10 个 Skill 详情
- [L3 — MCP](./L3-skills-mcp) — 17 个 MCP Tool 详情
- [L5 — Agent Pipeline](./L5-agent-pipeline) — Pipeline 协议与运行手册
- [L6 — Multi-Agent 协同](./L6-multi-agent) — 多智能体分工设计

## 参考资料

| 资源 | 说明 |
|------|------|
| [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | Anthropic 官方 Agent 构建最佳实践，L5/L6 设计基础 |
| [OpenAI — A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf) | OpenAI 官方 Agent 落地指南 |
| [Model Context Protocol 官网](https://modelcontextprotocol.io/) | MCP 协议完整规范（L3 基础）|
| [MCP 规范 — GitHub](https://github.com/modelcontextprotocol/specification) | MCP 协议源码与最新动态 |
| [GitHub Copilot 官方文档](https://docs.github.com/en/copilot) | Copilot 指令文件、Agent 模式、MCP 接入 |
| [Cursor 官方文档](https://docs.cursor.com/) | Cursor Rules、Agent 模式与 MCP 配置 |
| [Vibe Coding — Andrej Karpathy](https://x.com/karpathy/status/1886192184808149190) | "Vibe Coding" 概念出处（Karpathy，2025年2月）|

```
AI 辅助开发能力谱系（从低到高）

L0  氛围编程（Vibe Coding）
    │  纯对话 → AI 自由发挥 → 高随机性 → 低还原度
    │
L1  提示词工程（Prompt Engineering）
    │  结构化 Prompt → 少样本示例 → CoT → 上下文注入
    │
L2  Skills（结构化技能文件）              ← 当前项目核心
    │  触发词驱动 → SKILL.md → 规范门控 → Pre-flight 声明
    │
L3  MCP（模型上下文协议）                 ← 当前项目已接入
    │  工具调用 → 实时 I/O → 副作用执行 → 跨系统联动
    │
L4  CLI（命令行工具）                     ← 当前项目已实现
    │  独立可执行 → 无 AI 依赖 → 自动化脚本 → CI/CD 集成
    │
L5  Agent Pipeline（智能体流水线）        ← 🟡 试运行中
    │  Skill 链式自动触发 → 减少人工干预 → 批量处理
    │
L6  Multi-Agent 协同                      ← 远期目标（L5 稳定后再看）
    │  专家 Agent 分工 → 并发处理 → 质量仲裁
    │
L7  自演化体系（Self-Evolving）            ← 终极形态（条件成熟后规划）
       高质量产出反哺规范/模板 → 精度持续提升 → 正向飞轮
```

## 当前位置（v2.7.3）

| 层级 | 状态 | 说明 |
|------|------|------|
| L1 提示词工程 | ✅ 已实现 | `copilot-instructions.md` + `standards` 懒加载 + 多编辑器适配 |
| L2 Skills | ✅ 已实现 | 10 个 Skill（含 business-doc-extract），pre-flight + registry + 模板分层 |
| L3 MCP | ✅ 已实现 | 17 个 Tool（菜单+字典+权限+项目感知+页面校验+UI体检+通知） |
| L4 CLI | ✅ 已实现 | 9 条命令：init / update / clean / check / diff / validate / validate-page / doctor-ui / export |
| L5 Agent Pipeline | 🟡 试运行中 | `_pipeline.md` 协议已落地，进入试运行阶段 |
| L6 Multi-Agent | ⏳ 远期 | L5 稳定后再规划 |
| L7 自演化体系 | 🔭 终极形态 | 需 L5 稳定 + 审计报告 ≥ 50 份 + 模板提取 ≥ 3 次 |

## 延伸阅读

- [L0 — 氛围编程](./L0-vibe)
- [L2 — Skill](./L2-skill) — 10 个 Skill 详情
- [L3 — MCP](./L3-skills-mcp) — 17 个 MCP Tool 详情
- [L5 — Agent Pipeline](./L5-agent-pipeline) — Pipeline 协议与运行手册
- [L6 — Multi-Agent 协同](./L6-multi-agent) — 多智能体分工设计
