# 26 · 任务驱动与精准触发（✅ 已落地）

> 📦 来源：`wl-skills-bd` v0.24.0 · `standards/26-task-driven.md` · 本文可判定条目由 `wl-skills-bd validate`（B 系列）与 `mvn verify -Pwl-quality` 自动执行。


> `wl-skills-bd task` 把自然语言需求路由到最小 Skill、Standards、B 规则子集和安全执行步骤。它是只读指挥层，不是第二套代码写入器。
>
> 强制度：🔴 必遵。机器实现：`lib/task-router.js`、CLI `task`、MCP `wls_be_task`。

## 1. 架构边界

```text
已评审需求 / 单点变更描述
          ↓
task-router（只读识别与计划）
          ↓
discover → context → validate → plan → approval → apply → verify
          ↓
┌──────────────────┬────────────────────┬──────────────────┐
│ contract/codegen │ safe-fix           │ config           │
│ planHash+confirm │ planHash+confirm   │ plan/confirm     │
│ 失败整批回滚      │ 备份+复扫           │ 备份/迁移报告     │
└──────────────────┴────────────────────┴──────────────────┘
          ↓
精准 B 规则 + Maven 质量门 + contract diff --strict
```

强制约束：

- `task` 只输出计划，不读取目标源码、不写文件、不连接数据库、不调用外部系统。
- CLI `task --apply` 必须失败；MCP Schema 不暴露 `apply`。
- 新接口、字段、业务命令统一修改 `wl-contract.json`，分别使用 `customOperations/relations/export`、`fields/alter` 等机器契约表达。
- 实际写入只允许走现有 codegen/safe-fix/config 计划链，禁止另建字符串拼接式 Java patch 引擎。
- bd 可仅基于已评审需求独立建立契约；design 稳定 ID 与 kit 前端契约均为可选协同增强，不是硬依赖。
- 每个任务必须返回确定性的 `pipelineHash` 和节点契约。只读任务省略 plan/approval/apply；有副作用节点禁止自动重试/不可取消超时，并强制确认。

## 2. 标准节点粒度

| 节点 | 输入/输出 | 副作用与失败语义 |
|---|---|---|
| discover | 工程根 → project-slice | 只读；允许有界重试/超时 |
| context | project-slice → context-plan | 只读；限制模块、一跳和预算 |
| validate | context-plan → validation-result | 只读；声明 complete/partial coverage |
| plan | validation-result → write-plan | 只读；输出当前 hash，不隐式 apply |
| approval | write-plan → approval | 人工卡口；未确认则后续节点 skipped |
| apply | approval → apply-result | 本地写；强制确认、禁止自动重试和无法取消的超时 |
| verify | apply/validate → assurance-result | 只读；验证失败不得宣称完成 |

节点失败、阻断、跳过、耗时、尝试次数和输出 hash 必须可观测。执行前重新计算 pipelineHash；漂移时整条流水线阻断。

## 3. 任务类型与最小验证面

| 任务 | 模式 | 主要入口 | 必跑规则/质量门 |
|---|---|---|---|
| `new-service` | full | codegen 全链路 | 相关 B 规则 + J1~J8 + strict contract |
| `add-api` | incremental-contract | `customOperations/relations/export` | B1/B2/B5/B8/B12/B20 |
| `add-field` | incremental-contract | `fields + alter` | B3/B4/B7/B18 + DDL 预览 |
| `add-business-cmd` | incremental-contract | `customOperations` | B5/B8/B17/B20 + completion |
| `fix-bug` | fix | troubleshoot + safe-fix/人工最小修复 | B3/B5/B7/B8/B17/B18 |
| `refactor` | fix | 基线审计 + 小步重构 | B5~B12/B23/B24/B25/B26 + Maven |
| `audit` | readonly | doctor + validate | B1~B31 + J1~J8 + production assurance；quick/staged 需补 full |
| `config-op` | config | config doctor/init/migrate/fix | standards/24/25 |

规则子集用于单点任务的快速反馈，不替代发布前全量质量门。

## 4. 安全增量闭环

### 4.1 加接口/业务命令

```bash
wl-skills-bd task "加个导出接口"
# 按计划更新 wl-contract.json
wl-skills-bd codegen validate wl-contract.json
wl-skills-bd codegen plan wl-contract.json --json
wl-skills-bd codegen apply wl-contract.json --plan-hash <hash> --confirm
wl-skills-bd validate src/main --rules B1,B2,B5,B8,B12,B20
wl-skills-bd contract diff wl-contract.json --frontend docs/contracts/page.api.md --strict
```

非确定性业务逻辑进入 `<wl-custom>` 保护区。补齐实现和 ServiceTest 后，completion 必须为 `confirmed`；生产就绪场景使用 `--require-complete`。

### 4.2 加字段落库

```bash
wl-skills-bd task --type add-field
# 按计划更新 fields 与 alter
wl-skills-bd codegen validate wl-contract.json
wl-skills-bd db preview wl-contract.json
wl-skills-bd codegen plan wl-contract.json --json
wl-skills-bd codegen apply wl-contract.json --plan-hash <hash> --confirm
wl-skills-bd validate src/main --rules B3,B4,B7,B18
```

DDL 仅生成和预览，由 DBA/CD 审批执行；工具不得持有数据库写凭据或伪造自动回滚。

## 5. 触发与歧义

```bash
wl-skills-bd task --list
wl-skills-bd task "改空指针 bug"
wl-skills-bd task --type add-api --target-file src/main/java/.../FooController.java
```

- 明确 `--type` 优先于自然语言猜测。
- 自然语言命中多个类型时输出前三候选及评分证据。
- 无匹配时返回失败并提示 `--list`，不得静默选择全量生成。
- `target-file` 仅用于计划上下文，不授权读取或写入该路径。

## 6. 正反例

正确：task 路由 → 契约增量 → validate/plan → 人工确认 → apply → 精准复扫 → strict 协作核对。

错误：

- `task --apply` 直接改源码；
- 用正则寻找类末尾并拼接 Java 方法或字段；
- 跳过 planHash、确认、备份或失败回滚；
- 只跑精准规则子集就宣称发布就绪；
- 没有业务实现和测试证据却把 completion 标为 confirmed。

## 变更记录

- 2026-08-24 v0.21：加入标准 DAG、节点契约、状态/输出 hash、只读重试与写节点确认边界。
- 2026-07-18 v0.13：落地 8 类任务路由与规则子集；写入统一收敛到既有事务安全链，移除重复 patch 内核。
