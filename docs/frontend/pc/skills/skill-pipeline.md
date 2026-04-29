# AI Skill 流水线

8 个 AI Skill 串联形成完整的 **原型 → 代码 → 审计 → 优化** 流水线：

```
  Axure 原型 / 详设文档 / 口述需求
         |
         v
  ① prototype-scan --- 扫描 -> page-spec JSON（结构化页面描述）
         |
         v
  ② api-contract ----- 生成 -> api.md（前后端接口约定，先于代码生成）
         |
         v
  ③ page-codegen ----- 生成 -> index.vue + data.ts + index.scss + api.md + mock
         |                     （4 文件/页 + pages.ts 注册 + mock 数据）
         |              写入 -> reports/SYS_MENU_INFO.md（追加模式）
         v
  ④ menu-sync -------- 读取 reports/SYS_MENU_INFO.md -> 同步到后端菜单表
         |
         v
  ⑤ dict-sync -------- 同步数据字典（pull/push/audit 三模式）
         |
         v
  ⑥ convention-audit -- 扫描源码 -> 偏差报告 + 组件提取建议（reports/ 目录）
         |
         v
  ⑦ code-fix ---------- 读取审计报告 -> 受控自动修复 🟢🟡 等级偏差
         |
         v
  ⑧ template-extract -- 识别重复模式 -> 提取组件到 domains/ 贡献库
```

## 各 Skill 速查

| # | Skill | 输入 | 输出 | 典型场景 |
|---|-------|------|------|---------|
| ① | prototype-scan | Axure HTML / 详设文档 / 口述 | page-spec JSON | 新模块开发启动 |
| ② | api-contract | page-spec JSON | api.md（每页一个） | 前后端接口对齐 |
| ③ | page-codegen | page-spec + api.md | 4 文件/页 + mock + SYS_MENU_INFO | 批量出代码 |
| ④ | menu-sync | SYS_MENU_INFO.md + env.local.json | 后端菜单表记录 | 联调环境准备 |
| ⑤ | dict-sync | env.local.json | SYS_DICT_INFO.md 或远端同步 | 字典拉取/推送 |
| ⑥ | convention-audit | 项目源码 + standards/01-13 | 偏差报告 + 组件提取建议 | 存量代码体检 |
| ⑦ | code-fix | 偏差报告 + 源码 | 已修复代码（仅 🟢🟡） | 批量修规范问题 |
| ⑧ | template-extract | 重复代码 + 命名信息 | 新组件 / 新模板 | 沉淀复用资产 |

## Skill 自动调度机制

所有编辑器配置文件均由 `copilot-instructions.md` 生成，其中内嵌了 **Skills 自动调度注册表**：

1. **触发关键词匹配** — 用户说"生成页面"/"扫描原型"/"接口约定"等关键词时，AI 必须先 `read_file` 对应的 `SKILL.md`
2. **完整流水线** — 用户提供原型/详设并要求批量生成时，按 ① → ② → ③ → ④ 顺序依次执行
3. **单独使用** — 用户只说"帮我生成客户档案页面"时，只读取 page-codegen 的 SKILL.md
4. **模式 0 快捷路径** — 用户直接口述需求时，AI 内部自动调用 prototype-scan 模式 0 跳过文件步骤

## 碎片化调用

| 你想做什么 | 对 AI 说 | 触发的 Skill |
|-----------|---------|-------------|
| 扫描原型，输出页面清单 | "扫描这些原型" | ① prototype-scan |
| 给页面生成接口文档 | "生成 api.md" | ② api-contract |
| 只生成单个页面代码 | "帮我生成客户档案页面" | ③ page-codegen |
| 把 pages.ts 同步到菜单表 | "帮我创建菜单" | ④ menu-sync |
| 同步 / 拉取数据字典 | "同步字典" / "拉取字典" | ⑤ dict-sync |
| 审计项目代码是否合规 | "规范审计" / "规范检查" | ⑥ convention-audit |
| 自动修复规范问题 | "修复偏差" / "code-fix" | ⑦ code-fix |
| 提取重复组件 | "提取组件" / "template-extract" | ⑧ template-extract |
| 查看组件怎么用 | "jh-select 怎么用" | AI 读取 docs/jh-select.md |

## 耗时预估

一个模块（5-8 个页面）完整走一遍 ① → ④ 流水线，约 **5-10 分钟**出完整代码。

```
  Axure 原型 / 详设文档
         |
         v
  1 prototype-scan --- 扫描 -> page-spec JSON（结构化页面描述）
         |
         v
  2 api-contract ----- 生成 -> api.md（前后端接口约定，先于代码生成）
         |
         v
  3 page-codegen ----- 生成 -> index.vue + data.ts + index.scss + api.md + mock
         |                     （4 文件/页 + pages.ts 注册 + mock 数据）
         |              写入 -> SYS_MENU_INFO.md（覆盖/追加模式）
         v
  4 menu-sync -------- 读取 SYS_MENU_INFO.md -> 同步到后端菜单表

  5 convention-audit    按需：用规范审计代码 -> 偏差报告 + 整改建议
```

## 各 Skill 速查

| # | Skill | 输入 | 输出 | 必须执行 |
|---|-------|------|------|---------|
| 1 | prototype-scan | Axure HTML / 详设文档 | page-spec JSON | 必须 |
| 2 | api-contract | page-spec JSON | api.md（每页一个） | 推荐 |
| 3 | page-codegen | page-spec + api.md | index.vue + data.ts + index.scss + mock | 必须 |
| 4 | menu-sync | SYS_MENU_INFO.md + env.local.json | 后端菜单表记录 | 推荐 |
| 5 | convention-audit | 项目源码 + copilot-instructions.md | 偏差报告 + 整改建议 | 按需 |

## Skill 自动调度机制

所有编辑器配置文件均由 `copilot-instructions.md` 生成，其中内嵌了 **Skills 自动调度注册表**：

1. **触发关键词匹配** — 用户说"生成页面"/"扫描原型"/"接口约定"等关键词时，AI 必须先 `read_file` 对应的 `SKILL.md`
2. **完整流水线** — 用户提供原型/详设并要求批量生成时，按 1 -> 2 -> 3 -> 4 顺序依次执行
3. **单独使用** — 用户只说"帮我生成客户档案页面"时，只读取 page-codegen 的 SKILL.md，不必跑完整流水线

## 碎片化调用

| 你想做什么 | 对 AI 说 | 触发的 Skill |
|-----------|---------|-------------|
| 扫描原型，输出页面清单 | "扫描这些原型" | prototype-scan |
| 给页面生成接口文档 | "生成 api.md" | api-contract |
| 只生成单个页面代码 | "帮我生成客户档案页面" | page-codegen |
| 把 pages.ts 同步到菜单表 | "帮我创建菜单" | menu-sync |
| 审计项目代码是否合规 | "审计项目规范" / "规范检查" | convention-audit |
| 查看组件怎么用 | "jh-select 怎么用" | AI 读取 docs/jh-select.md |
| 参考样例写代码 | "参考 demo 里的客户档案" | AI 读取 demo/ 下的代码 |

## 耗时预估

一个模块（5-8 个页面）完整走一遍流水线，约 **5-10 分钟**出完整代码。
