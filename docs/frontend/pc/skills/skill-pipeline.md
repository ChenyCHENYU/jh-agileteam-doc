# AI Skill 流水线

> **12 个 AI Skill** 按双线入口汇聚，串联形成完整的 **原型/说明书 → 代码 → 权限 → 审计 → 优化 → 环境迁移** 流水线。
> 源自 `@agile-team/wl-skills-kit` v2.13.0+，本页同步最新流水线协议。

---

## 流水线全景（双线隔离）

```text
┌─────────────────────────────────────────────────────────────────────┐
│  入口层（二选一，互斥）                                                │
│                                                                       │
│  ① prototype-scan ──── 原型线：Axure HTML / 截图 / 口述 / 非规范详设  │
│  ② spec-doc-parse ──── 规范线：wl-skills-design 标准说明书            │
│         │                         （含功能编码/IPO 表/流程五要素）     │
│         └──────────┬──────────┘                                       │
└────────────────────┼────────────────────────────────────────────────┘
                     ↓ 汇聚到同一份 page-spec JSON（下游无感知）
        ③ business-doc-extract（可选，资料达模块级时推荐）
                     ↓
        ④ api-contract ────────── 生成 src/views/**/api.md
                     ↓
        ⑤ page-codegen ───────── 生成 index.vue + data.ts + index.scss
                     │              + pages.ts 注册 + mock 数据
                     │              写入 reports/SYS_MENU_INFO.md
                     ↓
        ⑥ convention-audit ───── 扫描源码 → 偏差报告（reports/）
                     │              规范线可追加 --mode spec-align 生成 GAP 报告
                     ↓
        ⑦ code-fix ───────────── 受控修复 🟢🟡 等级偏差
                     │              ⚡ 强制复扫 wl-skills validate（自动执行）
                     ↓
        ⑧ menu-sync ──────────── 同步菜单到后端
        ⑨ dict-sync ──────────── 同步数据字典（pull/push/audit）
        ⑩ permission-sync ────── 角色管理 + 菜单授权 + 动作挂载
                     ↓
        ⑪ env-config ─────────── 环境标准化 / 客户迁移（dry-run → apply）
                     ↓
        ⑫ template-extract ───── 识别重复模式 → 提取组件到 domains/
```

> **双线隔离原则**：`prototype-scan`（原型线）与 `spec-doc-parse`（规范线）是**互斥的两个入口**，按输入类型二选一（调度规则优先级 0），输出格式完全相同，下游无感知。

> **灵活组合原则**：每个 Skill 都可单独触发，哪步不满意重跑哪步，不需要从头来过。

---

## 12 个 Skill 速查

| # | Skill | 分类 | 输入 | 输出 | 典型场景 |
|---|-------|------|------|------|---------|
| ① | [prototype-scan](./prototype-scan) | core | Axure HTML / 截图 / 口述 | `PROTOTYPE_SCAN_*.md`（含 page-spec JSON） | 新模块开发启动（原型线） |
| ② | [spec-doc-parse](./spec-doc-parse) | core | wl-skills-design 标准说明书 | `SPEC_PARSE_*.md`（含 page-spec JSON + 解析报告） | 规范线入口 |
| ③ | [business-doc-extract](./business-doc-extract) | core | 原型目录 / 详设 / 字段字典资料 | `docs/business/0X-xx/*.md`（业务沉淀） | 模块级业务梳理 |
| ④ | [api-contract](./api-contract) | core | page-spec / 业务文档 / 口述 | `src/views/**/api.md` | 前后端接口对齐 |
| ⑤ | [page-codegen](./page-codegen) | core | api.md / page-spec / 口述 | 4 文件/页 + mock + SYS_MENU_INFO | 批量出代码 |
| ⑥ | [convention-audit](./convention-audit) | core | 源码 + standards/01-14 | `AUDIT_*.md` 偏差报告 | 存量代码体检 |
| ⑦ | [code-fix](./code-fix) | ops | 审计报告 | 源码 diff / 修复摘要 | 批量修规范问题 |
| ⑧ | [menu-sync](./menu-sync) | sync | SYS_MENU_INFO.md + env.local.json | 后端菜单表记录 | 联调环境准备 |
| ⑨ | [dict-sync](./dict-sync) | sync | env.local.json | 字典同步摘要 | 字典拉取/推送 |
| ⑩ | [permission-sync](./permission-sync) | sync | env.local.json + 用户指令 | 角色/授权/动作 | 权限闭环 |
| ⑪ | env-config | ops | 项目根目录 + 客户环境 Profile | `ENV_CONFIG_*.md` + env/Vite diff | 环境迁移/标准化 |
| ⑫ | template-extract | core | 成熟页面目录 | `templates/domains/**/TPL-*.md` | 沉淀复用资产 |

> **Skill 分类**：`core`（核心通用） / `sync`（数据同步） / `ops`（运维构建） / `domain`（领域专属，按域扩展）

---

## Skill I/O 契约（next_suggest 链）

| Skill | 输出文件 | 建议下一步 |
|---|---|---|
| prototype-scan | `reports/PROTOTYPE_SCAN_*.md` | business-doc-extract（资料达模块级）或 api-contract |
| spec-doc-parse | `reports/SPEC_PARSE_*.md` | api-contract（处理完阻断/待确认项后） |
| business-doc-extract | `docs/business/index.md` + `0X-xx/*.md` | api-contract 或 page-codegen |
| api-contract | `src/views/**/api.md` | page-codegen |
| page-codegen | 4 文件/页 + `SYS_MENU_INFO.md` | convention-audit；有菜单则 menu-sync |
| convention-audit | `reports/AUDIT_*.md` | code-fix（有可修复项时） |
| code-fix | 源码 diff | ⚡ **强制** `wl-skills validate` 复扫（自动） |
| menu-sync | 后端菜单数据 | permission-sync（如需授权） |
| dict-sync | 字典同步摘要 | convention-audit 复扫（如页面依赖字典） |
| permission-sync | 角色/授权数据 | convention-audit 复扫权限码 |
| env-config | `ENV_CONFIG_*.md` + 配置 diff | `wl-skills validate` / 项目 build 验证 |
| template-extract | 模板草案 | page-codegen 复用新模板 |

---

## 强制 vs 建议执行

| 步骤 | 类型 | 说明 |
|------|------|------|
| code-fix → `wl-skills validate` | **强制** | 修复后自动复扫，不等用户确认 |
| code-fix → convention-audit --quick | 建议 | 大规模修复后推荐 |
| page-codegen → convention-audit | 建议 | 生成后建议审计 |
| convention-audit → code-fix | 建议 | 有可修复项时推荐 |
| 其他所有 next_suggest | 建议 | 用户确认后执行 |

---

## 高风险 Skill 确认机制

以下 Skill 触发前**必须二次确认**用户意图（输出"即将执行 XX，确认继续？"）：

| Skill | 原因 |
|---|---|
| page-codegen | 会创建/覆盖文件 |
| menu-sync / dict-sync / permission-sync | 会调用后端接口写数据 |
| code-fix | 会修改源码 |
| env-config | 会创建/更新环境文件与 Vite 配置（默认必须先 dry-run） |

---

## 自动调度机制

所有编辑器配置文件由 `copilot-instructions.md` 生成，内嵌 Skills 自动调度注册表（`_registry.md`）：

1. **优先级 0（双线隔离）**：输入含 `.wl-skills/docs/spec/` 或功能编码 `/[A-Z]{2,6}[0-9]{3}/` → 强制走 spec-doc-parse（规范线），跳过 prototype-scan
2. **场景索引优先**：先加载 `_best-practices.md`，按语义判断场景
3. **触发词匹配**：用户说"生成页面"/"扫描原型"/"接口约定"等 → 加载对应 SKILL.md
4. **完整流水线**：用户提供原型/详设要求批量生成 → 按序执行
5. **误触发防护**：消息匹配 2+ Skill 且非流水线意图 → 先列出候选询问用户

---

## 碎片化调用

| 你想做什么 | 对 AI 说 | 触发的 Skill |
|-----------|---------|-------------|
| 扫描原型，输出页面清单 | "扫描这些原型" | ① prototype-scan |
| 解析标准说明书 | "解析说明书" / "根据说明书生成" | ② spec-doc-parse |
| 沉淀业务文档 | 提供原型/详设/字段资料 | ③ business-doc-extract |
| 给页面生成接口文档 | "生成 api.md" | ④ api-contract |
| 只生成单个页面代码 | "帮我生成客户档案页面" | ⑤ page-codegen |
| 审计项目代码是否合规 | "规范审计" / "规范检查" | ⑥ convention-audit |
| 自动修复规范问题 | "修复偏差" / "code-fix" | ⑦ code-fix |
| 把 pages.ts 同步到菜单表 | "帮我创建菜单" | ⑧ menu-sync |
| 同步 / 拉取数据字典 | "同步字典" / "拉取字典" | ⑨ dict-sync |
| 创建角色 / 授权菜单 / 挂动作 | "创建角色" / "权限同步" | ⑩ permission-sync |
| 环境迁移 / 切 baseURL | "切环境" / "baseURL 标准化" / "172迁移" | ⑪ env-config |
| 提取重复组件 | "提取组件" / "template-extract" | ⑫ template-extract |
| 查看组件怎么用 | "jh-select 怎么用" | AI 读取 docs/jh-*.md |

---

## 常见流水线变体

| 场景 | 流水线 |
|------|--------|
| 口述碎片需求 | page-codegen → convention-audit（不走业务文档） |
| 标准说明书闭环 | spec-doc-parse → api-contract → page-codegen → convention-audit --mode spec-align |
| 存量项目反向梳理 | business-doc-extract → convention-audit |
| 原型/详设完整资料 | business-doc-extract → api-contract → page-codegen |
| 存量项目体检修复 | convention-audit → code-fix |
| 只同步菜单/字典/权限 | menu-sync / dict-sync / permission-sync（单独触发） |
| 环境迁移/标准化 | env-config（dry-run → apply） |

---

## MCP/CLI 辅助能力

| 能力 | 推荐调用时机 | 用途 |
|---|---|---|
| `wls_code_scan` | Pipeline 开始或审计前 | 获取页面目录、文件完整性、API_CONFIG 概览 |
| `wls_route_check` | page-codegen 或 menu-sync 后 | 检查页面目录是否在路由中可发现 |
| `wls_validate_page` | page-codegen 后 | 验证生成的页面文件完整性 |
| `wls_doctor_ui` | 风格/UI 问题时 | wl-skills-ui 接入体检 |
| `wls_git_log_extract` | convention-audit 前 | 提取近期提交，辅助 Git 规范审计 |
| `wls_env_scan` / `wls_env_apply` | env-config | 扫描并标准化 env/Vite 配置，apply 默认 dry-run |
| `wl-skills check` | 新成员接入 | 本地工具链与 MCP 配置预检 |
| `wl-skills validate` | CI 或 code-fix 复扫 | 无 AI 静态检查页面完整性 |

---

## 耗时预估

一个模块（5-8 个页面）完整走一遍 ① → ⑤ 流水线，约 **5-10 分钟**出完整代码。

---

> 📚 源文件：`wl-skills-kit/files/.wl-skills/skills/_pipeline.md` + `_registry.md`
> 🏗️ 每个 Skill 有 SKILL.md（AI 读）+ USAGE.md（团队读）双文档
