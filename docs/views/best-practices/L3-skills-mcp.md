# L3 — MCP（模型上下文协议）

> 赋予 AI "手"和"眼"，从"说"到"做"的关键跃迁。L2 Skill 描述"做什么"，L3 MCP 让 AI 真正"执行操作"。

<AuthorTag :authors="['CHENY']" />

## 能力概览

MCP 层是体系的**执行层**——AI 通过 MCP Tools 主动发起操作，从「说」到「动手」的关键跳跃。

```
MCP Server 能力
│
├── 1. 网络 I/O
│   ├── HTTP / REST 调用
│   ├── GraphQL 查询
│   ├── WebSocket 实时连接
│   ├── 在线文档抓取 & 结构化解析
│   └── 业务接口代理、鉴权请求调试
│
├── 2. 本地文件系统
│   ├── 多格式文件读写（TS / JSON / Vue / YAML 等）
│   ├── 代码 / 配置文件生成与更新
│   ├── 目录扫描、项目结构分析
│   └── 文件监听、变更自动化触发
│
├── 3. 脚本 / 进程 & 系统命令
│   ├── 自定义脚本执行
│   ├── 构建、编译、测试、格式化指令
│   ├── 进程启停、端口占用管理
│   └── 原生 Shell / 系统命令调用
│
├── 4. Git 全链路操作
│   ├── 状态、差异、变更内容读取
│   ├── 提交日志、分支、标签信息查询
│   └── 辅助生成规范 Commit 信息
│
├── 5. 代码 AST 结构化解析
│   ├── TS 类型、接口、函数签名提取
│   ├── Vue SFC 组件结构解析（props / emits / setup）
│   ├── 依赖图谱分析、导入导出解析
│   └── 代码片段抄取、规范问题扫描
│
├── 6. 数据库 & 轻量存储
│   ├── SQLite 本地数据查询
│   ├── Redis 缓存与共享状态管理
│   └── JSON 本地 KV 轻量化存储
│
├── 7. 包管理 & 工程运维
│   ├── NPM 包版本查询、依赖版本检测
│   ├── 依赖过期扫描、版本升级辅助
│   └── 工程打包、发布流程联动
│
├── 8. 系统 & 基础设施能力
│   ├── 系统信息、环境变量读写
│   ├── Docker 容器、本地服务管理
│   └── 端口检测、本地服务运维
│
├── 9. 通用工具能力
│   ├── 加解密、编解码、数据校验
│   └── 配置文件格式化、语法校验
│
└── 10. AI 元能力增强
    ├── 本地向量检索、语义知识库查询
    └── 三方 AI 能力联动（审代码、翻译、总结）
```

> **核心特征**：细粒度、有副作用、AI 自由编排。每个 Tool 只做一件事，AI 根据 Skill 描述自行决定调用顺序和参数。

## 什么是 MCP？

MCP（Model Context Protocol）是 AI 调用外部工具的标准协议。通过 MCP，AI 可以：
- 调用后端接口（查询 / 新增 / 更新）
- 读写本地文件
- 执行任意有副作用的操作

**在 wl-skills-kit 中**：MCP Server（`mcp/` 目录）注册了一系列工具，AI 在执行 Skill 时直接调用这些工具，无需人工复制粘贴接口结果。

## 前端示例 — 已实现的 10 个 MCP Tools

| Tool | 能力 | 关联 Skill |
|------|------|-----------|
| `wls_menu_query` | 查询完整菜单树 | menu-sync 前置读取 |
| `wls_menu_upsert` | 批量新增/更新菜单 | menu-sync 执行 |
| `wls_dict_query` | 查询字典模块 | dict-sync 前置读取 |
| `wls_dict_upsert` | 新增/更新字典 | dict-sync 执行 |
| `wls_role_query` | 查询角色列表 | permission-sync · role-manage |
| `wls_role_upsert` | 批量新增角色（按 code 去重） | permission-sync · role-manage |
| `wls_assignable_menus_query` | 查询全量可授权菜单 | permission-sync · role-assign |
| `wls_role_assign_menus` | 给角色批量分配菜单（全量覆盖） | permission-sync · role-assign |
| `wls_action_query` | 查询页面下的动作（type=A） | permission-sync · action-attach |
| `wls_action_upsert` | 批量新增动作（按 permission 去重） | permission-sync · action-attach |

> 效果量化：菜单同步 token 节省约 **87%**，从 20 分钟 10 次手动操作 → **1 分钟 0 次手动操作**。权限同步原本需切换 3 个后台界面 ≥ 15 分钟，现在 **1 分钟 0 次手动操作**。

## MCP 三原语说明

### Tools（当前在用）
AI 主动调用，有副作用（读写/调接口）。所有主流编辑器均支持。这是当前项目的核心用法。

### Resources（未启用）
应用层暴露只读数据源，AI 订阅变更。适合内部 Swagger/OpenAPI 动态接口场景。当前静态文档用文件直接引用即可，引入 Resources 是过度设计。

### Prompts（了解即可）
在 MCP server 里注册"预制 slash command 模板"。编辑器支持情况：Claude Code ✅；Cursor ⚠️ 部分；VS Code Copilot / Windsurf / Cline ❌ 未支持。团队主力是 VS Code Copilot，故暂不实现。

## MCP 项目级配置（`init` 自动生成）

| 编辑器 | 配置文件路径 |
|--------|------------|
| Cursor | `.cursor/mcp.json` |
| Claude Code | `.mcp.json` |
| VS Code / GitHub Copilot | `.vscode/mcp.json` |
| Kiro | `.kiro/settings/mcp.json` |
| Windsurf / Cline / Trae / Qoder | 手动配置（参考 `.github/guides/mcp-setup.md`） |

## 待扩展 Tools（v2.4 计划）

| Tool | 优先级 | 用途 |
|------|--------|------|
| `wls_code_scan(path)` | P0 | 扫描 `src/views/` 返回页面清单，消除目录猜测 |
| `wls_route_check()` | P1 | 读取 `pages.ts`，验证路由注册情况 |
| `wls_git_log_extract(n)` | P1 | 提取最近 N 次 commit，供 changelog-gen 使用 |
| `wls_audit_report_push()` | P2 | 将审计报告推送到飞书群（webhook） |

## 延伸阅读

- [permission-sync Skill 文档](/frontend/pc/skills/permission-sync) — MCP 驱动的权限闭环
- [L4 — CLI](./L4-cli) — MCP 与 CLI 的协作关系
- [全景分析](./ai-landscape)

## 参考资料

| 资源 | 说明 |
|------|------|
| [Model Context Protocol 官网](https://modelcontextprotocol.io/) | MCP 协议完整规范，L3 的底层标准 |
| [MCP 规范 GitHub](https://github.com/modelcontextprotocol/specification) | MCP 协议源码与最新动态 |
| [MCP Servers 社区目录](https://github.com/modelcontextprotocol/servers) | 社区贡献的各类 MCP Server，可直接复用 |
| [GitHub Copilot MCP 文档](https://docs.github.com/en/copilot/customizing-copilot/using-model-context-protocol-tools) | Copilot 中配置 MCP 的官方指南 |
| [Cursor MCP 配置文档](https://docs.cursor.com/advanced/mcp) | Cursor 中配置 MCP Server |

