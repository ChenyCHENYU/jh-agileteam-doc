# 前端 Skills 概述

前端 Skills 基于 `@agile-team/wl-skills-kit` v2.20.1 — 一条命令，将 **14 条编码规范、13 个 AI Skill、29 个 MCP Tool**、编辑器配置、组件文档、通用组件、领域样例导入到 Vue 3 前端项目，让 AI（Copilot / Cursor / Windsurf / Claude Code / Cline / Kiro / Kilo Code / Trae / Qoder / 通用 Agents）**真正理解项目规范**，从 Axure 原型 / 详细设计文档 / 口述需求 → 全流程自动化生成可运行的完整页面代码。

::: tip 确定性场景生成（v2.20 新增）
领域场景的"结构 + 展示方式"以 **wl-scenario JSON** 描述，由 kit 编译器**确定性渲染**页面（AI 零自由度）：render 单页 0.4~1ms、模型 token 恒为 0（AI 主流程每页约 2 万 token 输入）；`validate` 内置 W1 字节级防漂移（手改产物提交/CI 即拦截），extract/from-spec 支持存量页面提取与 page-spec 零手写引导，全部 pattern 通过往返等价性机器证明（49+26 用例）。CLI：`wl-skills scenario validate/render/extract/verify/from-spec`。
:::

## 快速开始

```bash
# 工程化前置（强制）
npx @robot-admin/git-standards init

# 安装 AI Skill 体系（在项目根目录执行）
npx @agile-team/wl-skills-kit

# 预览将写入哪些文件（不实际写入）
npx @agile-team/wl-skills-kit --dry-run

# 增量更新（仅覆盖有变化的文件）
npx @agile-team/wl-skills-kit@latest update

# 构建前清理 AI 开发辅助文件（保留组件代码）
npx @agile-team/wl-skills-kit clean

# Mock 清理（按域或全量）
npx @agile-team/wl-skills-kit mock-clean --domain <name>
npx @agile-team/wl-skills-kit mock-clean --all
```

## 包含什么

| 类别              | 数量  | 说明                                                                         |
| ----------------- | ----- | ---------------------------------------------------------------------------- |
| **AI Skills**     | 13 个 | prototype-scan / spec-doc-parse / api-contract / page-codegen / business-doc-extract / menu-sync / dict-sync / permission-sync / convention-audit / template-extract / code-fix / standard-env-config / status-column-audit |
| **MCP Tools**     | 29 个 | 菜单/字典/权限/项目感知/快照蓝图/模板治理/环境标准化/通知推送，全清单见下文 |
| **编码规范**      | 14 条 | 模块化规范（01-工具链 ~ 14-布局容器），AI 自动门控加载                       |
| **页面模板**      | 9 种  | LIST / FORM_ROUTE / MASTER_DETAIL / TREE_LIST / DETAIL_TABS 等               |
| **组件 API 文档** | 11 个 | jh-select / jh-date / jh-drag-row / jh-pagination 等                         |
| **通用组件**      | 7 个  | local 4（c_formModal/c_formSections/c_listModal/c_spliterTitle）+ global 3（C_ParentView/C_TagStatus/C_Tree） |
| **领域样例**      | 13 个 | 生产域 8 页 + 销售域 5 页                                                    |
| **编辑器配置**    | 10 个 | Copilot / Cursor / Windsurf / Kiro / Trae / Claude / Roo / Cline / AGENTS / Qoder  |

## 导入后的项目结构

```text
你的项目/
├── .github/
│   └── copilot-instructions.md       ← AI 主入口（精简 ~320 行）
├── .wl-skills/
│   ├── standards/                    ← 14 条模块化规范
│   │   ├── index.md                  ←   规范门控（任务类型 → 加载哪几条）
│   │   ├── 01-toolchain.md
│   │   ├── 02-code-structure.md
│   │   └── ... (共 14 条，含 14-layout-containers)
│   ├── skills/                       ← 13 个 AI Skill
│   │   ├── _registry.md              ←   触发词路由表（单一数据源）
│   │   ├── _best-practices.md        ←   场景索引（AI 每轮默认加载）
│   │   ├── _pipeline.md              ←   流水线编排
│   │   ├── core/
│   │   │   ├── prototype-scan/       ←   ① 原型扫描（原型线）
│   │   │   ├── spec-doc-parse/       ←   ② 说明书解析（规范线）
│   │   │   ├── business-doc-extract/ ←   ③ 业务文档提取（语义级触发）
│   │   │   ├── api-contract/         ←   ④ 接口约定
│   │   │   ├── page-codegen/         ←   ⑤ 页面代码生成（含 9 个 TPL-*.md 模板）
│   │   │   ├── convention-audit/     ←   ⑥ 规范审计
│   │   │   ├── template-extract/     ←   ⑦ 模板提取
│   │   │   └── status-column-audit/  ←   ⑬ 存量字典列 → 语义自动判色 Tag
│   │   ├── sync/
│   │   │   ├── menu-sync/            ←   ⑧ 菜单同步
│   │   │   ├── dict-sync/            ←   ⑨ 字典同步
│   │   │   ├── permission-sync/      ←   ⑩ 权限同步（角色+授权+动作）
│   │   │   ├── _mcp-guardrail.md     ←   MCP 公共护栏（L0~L4 自愈剧本）
│   │   │   └── env.local.json        ←   统一环境配置（gitignore）
│   │   └── ops/
│   │       ├── code-fix/             ←   ⑪ 受控自动修复
│   │       └── standard-env-config/  ←   ⑫ 环境标准化/迁移（scan → plan → apply → verify）
│   ├── contracts/                    ← 独立 API 契约（contract 命令产出）
│   └── templates/                    ← 模板资产（Blueprint / TPL）
├── docs/                             ← 11 个平台组件 API 文档
├── mock/
│   └── _utils.ts                     ← Mock 共享工具（pageResult/ok/paginate）
├── src/components/                   ← 全局 + 按需 + 远程组件
└── demo/                             ← 13 个领域样例页面
```

## 技术栈

| 层面     | 技术                                           |
| -------- | ---------------------------------------------- |
| 框架     | Vue 3.2 + Vite + TypeScript                    |
| UI       | Element Plus + @jhlc/jh-ui + @jhlc/common-core |
| 状态     | Pinia                                          |
| 样式     | Windi CSS + SCSS                               |
| 架构     | Module Federation 子应用                       |
| 页面模式 | AbstractPageQueryHook 配置化驱动               |

## 多编辑器支持（10 种）

安装后自动生成 10 个编辑器配置文件，内容统一来自 `copilot-instructions.md`（单一源头）：

| AI 工具                      | 规范加载 | Skill 自动调度        |
| ---------------------------- | -------- | --------------------- |
| **GitHub Copilot** (VS Code) | ✅ 自动  | ✅ 原生 Skill 识别    |
| **Cursor**                   | ✅ 自动  | ✅ 注册表 `read_file` |
| **Windsurf (Cascade)**       | ✅ 自动  | ✅ 注册表 `read_file` |
| **Kiro**                     | ✅ 自动  | ✅ 注册表 `read_file` |
| **Trae**                     | ✅ 自动  | ✅ 注册表 `read_file` |
| **Claude Code / CLI**        | ✅ 自动  | ✅ 注册表 `read_file` |
| **Roo Code / Cline**         | ✅ 自动  | ✅ 注册表 `read_file` |
| **Qoder**                    | ✅ 自动  | ✅ 注册表 `read_file` |
| **通用 Agents**              | ✅ 自动  | ✅ AGENTS.md 加载     |

> v2.0 起，所有编辑器的编码规范 + Skill 调度均为**自动加载（零配置）**；`env.local.json` 填写一次，`menu-sync` / `dict-sync` 自动共用同一配置。

## 13 个 Skill 速览

| #  | Skill              | 触发关键词                           | 用途                                   |
| -- | ------------------ | ------------------------------------ | -------------------------------------- |
| ①  | prototype-scan     | 扫描原型 / 口述需求 / 页面清单       | 原型 / 截图 / 口述 → page-spec JSON（原型线） |
| ②  | spec-doc-parse     | 解析说明书 / 规范文档转页面 / IPO    | 标准说明书 → page-spec JSON（规范线）  |
| ③  | business-doc-extract | 语义级触发（不依赖固定关键词）       | 原型/详设/字段资料 → 结构化业务文档    |
| ④  | api-contract       | 接口约定 / api.md / 字段定义         | 生成接口约定文档（前后端零成本对齐）   |
| ⑤  | page-codegen       | 生成页面 / 帮我生成 / 代码生成       | 生成 4 文件 + Mock + 菜单注册          |
| ⑥  | convention-audit   | 规范审计 / 代码审计 / 项目体检       | 14 条规范扫描 + 双报告（AUDIT_AI + AUDIT_HUMAN） |
| ⑦  | template-extract   | 提取模板 / 沉淀模板 / 模板贡献       | 从标杆页面提取领域专属模板             |
| ⑧  | menu-sync          | 创建菜单 / 同步菜单 / 补菜单         | 菜单数据同步到后端（MCP 驱动）         |
| ⑨  | dict-sync          | 同步字典 / 创建字典 / 刷新字典基线   | 字典基线同步（pull / push / audit）    |
| ⑩  | permission-sync    | 权限同步 / 角色授权 / 挂动作         | 角色管理 + 菜单授权 + 动作挂载（MCP 驱动） |
| ⑪  | code-fix           | 自动修复 / 整改偏差 / 规范整改       | 受控自动修复 🟡/🟢 等级偏差 + 强制复扫 |
| ⑫  | standard-env-config| 切环境 / baseURL 标准化 / 客户迁移   | 环境扫描 → dry-run → apply → verify（MCP 驱动） |
| ⑬  | status-column-audit| 字典列 Tag 化 / 状态列审计           | 存量列表页字典列纯文本 → 文案语义自动判色 Tag（审计 → `--fix` 自动转换 → `--init-bridge` 一键桥接 `renderAutoTagByLabel`，v2.17.0） |

### 双线路由机制（v2.0+）

```
原型线：Axure / 截图 / 口述 → prototype-scan → page-spec JSON
规范线：标准说明书 / IPO 表  → spec-doc-parse → page-spec JSON
                                                    ↓
                                    两线汇聚到同一份 page-spec
                                                    ↓
                              api-contract → page-codegen → convention-audit → sync/ops
```

> AI 根据输入自动判断走哪条线：路径含 `docs/spec/` 或文档含功能编码/IPO 表走规范线，其余走原型线。

---

## 29 个 MCP Tools（权威清单）

| 类别 | Tool | 能力 | 关联 Skill |
|------|------|------|----------|
| 菜单 | `wls_menu_query` | 查询完整菜单树 | menu-sync 前置 |
| 菜单 | `wls_menu_upsert` | 批量新增/更新菜单 | menu-sync 执行 |
| 菜单 | `wls_menu_delete` | 删除菜单 | menu-sync |
| 菜单 | `wls_menu_sync_from_report` | 从报告文件确定性同步菜单 | menu-sync |
| 字典 | `wls_dict_query` | 查询字典模块 | dict-sync 前置 |
| 字典 | `wls_dict_upsert` | 新增/更新字典 | dict-sync 执行 |
| 字典 | `wls_dict_bootstrap` | 字典基线自举 | dict-sync |
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
| 项目感知 | `wls_domain_query` | 查询业务域清单 | 通用 |
| 项目感知 | `wls_project_snapshot` | 项目快照 / Page Blueprint（按页隔离、默认脱敏、fingerprint 防漂移） | page-codegen / template-extract |
| 模板治理 | `wls_template_search` | 从快照检索候选页面（低 token 蓝图） | template-extract |
| 模板治理 | `wls_template_extract` | 提取页面 Blueprint（`confirmWrite` 门禁） | template-extract |
| 模板治理 | `wls_template_validate` | Blueprint 结构校验 | template-extract |
| 模板治理 | `wls_template_audit` | 模板资产审计 | template-extract |
| 模板治理 | `wls_template_diff` | Blueprint 差异比较（脱敏门禁） | template-extract |
| 环境标准化 | `wls_standard_env_scan` | 环境配置扫描 | standard-env-config |
| 环境标准化 | `wls_standard_env_apply` | 环境配置应用（受控） | standard-env-config |
| 环境标准化 | `wls_standard_env_verify` | 环境配置验证 | standard-env-config |
| 通知 | `wls_audit_report_push` | 推送审计报告到飞书 webhook（可选） | convention-audit |

> **整体效果**：菜单/权限同步 token 节省约 **87%**；操作时间压缩 **15-20 倍**；人工点击次数 → **0**。

---

## 表单校验与"仅必填"快速填写（v2.16.x）

v2.16.1 起新增统一表单能力，支持大表单中混合必填/非必填字段的"仅必填"模式切换：

| 接入形态 | API / 属性 | 适用场景 |
|---------|-----------|---------|
| 弹窗表单 | `show-required-toggle` | c_formModal prop |
| 分区表单 | `show-required-filter` | c_formSections prop |
| 普通 BaseForm | `useFormRequiredOnly` composable | 页面内表单 |
| 多 Tab 子表单 | 按实际绑定逐项控制 | 复杂表单 |

**配套审计规则（v2.18.0 起编号命名空间与 wl-skills-ui 解耦，R 前缀更名为 K 前缀；存量豁免配置新旧前缀等价兼容）**：
- **K17**（原 R17）：表单仅必填开关按每个实际绑定逐项判断（弹窗/独立页面/分区表单全覆盖）
- **K18**（原 R18）：表单校验库 `@robot-admin/form-validate@^3.4.1` 版本范围检查（缺失依赖/废弃拆包/Naive API 误用/通用规则重复手写）
- **K19**（原 R19）：弹窗内 AG Grid 必须用 `v-if` 延迟挂载（防止弹窗动画期间初始化导致零高度渲染）

**其他确定性门禁（v2.16.5–v2.16.6）**：
- **D3**：字典字段绑定门禁，逐字段核对 `dict/dictCode/logicValue`，缺失或错绑给确定性错误
- **S7**：进阶查询（lookupFlows）门禁，查询操作必须唯一、回填来源/目标字段必须覆盖

---

## 伴生工程

- 后端 Skills：[wl-skills-bd](/backend/skills/)（契约驱动代码生成 + 数据库事实源治理）
- 测试工程：[wl-skills-test](/views/testing/)（13 Skill + 25 条审计规则 + 3 个执行器 + 18 MCP）
- 视觉一致性：[wl-skills-ui](/views/styling/wl-skills-ui)
- 产品设计：[wl-skills-design](/views/ai-workflow/design-skills)
- 后端使用指南：[后端 Skills 使用指南](/backend/skills/usage-guide)
