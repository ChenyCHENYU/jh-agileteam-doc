# 30 · 变更审查与平台集成适配（✅ 已落地）

> 📦 来源：`wl-skills-bd` v0.24.0 · `standards/30-change-review-integration-adapter.md` · 本文可判定条目由 `wl-skills-bd validate`（B 系列）与 `mvn verify -Pwl-quality` 自动执行。


> 目标：把代码规则、覆盖率、平台封装、供应链和修复证据汇总为可复现的变更门禁，同时不把 BD 自身约定强加给不同平台。

## 1. 事实、策略、动作分离

| 层 | 事实源 | 边界 |
|---|---|---|
| 事实 | Git diff、B1~B31、Maven POM、JaCoCo XML、项目证据文件 | 只采集可复现事实，不猜业务语义 |
| 策略 | `quality-gate.json`、`integration-adapters.json`、`quality-assertions.json`、`supply-chain.json` | 由项目/平台团队维护并明确 owner/sourceRef |
| 动作 | review、适配实现 plan、精确修复 plan | 写操作必须 planHash、确认、备份、复验和失败回滚 |

没有项目策略时，供应链只输出清单，平台断言和 MQ 适配不产生阻断；配置文件里出现 MQ 地址不能证明模块已经接线。

## 2. 变更级 review

```bash
wl-skills-bd review run --base origin/main --module order --json
wl-skills-bd review run --staged --module order --json
wl-skills-bd review run --module order --json
```

前两条用于增量反馈，最后一条用于交付前完整门禁。review 汇总新增、基线、有效豁免和阻断项。`baselineMode=new-only` 只把不在基线中的问题作为新增债务；门禁 fingerprint 由 source/rule/file/message/同类序号稳定生成，不因无关行号移动漂移，也不会合并同文件重复问题。豁免必须登记 fingerprint、负责人、原因、审批引用和到期时间，过期自动阻断。

JaCoCo XML 可同时评估总行覆盖率和 Git diff 中可执行变更行覆盖率。partial 规则扫描不得冒充完整门禁；是否允许增量阶段 partial 必须由 `requireCompleteRuleCoverage` 明确决定，默认 fail-closed。合并/交付门运行不带 `--base/--staged/--quick/--rules` 的 full review。

基线是受控写入：

```bash
wl-skills-bd review baseline plan --json
wl-skills-bd review baseline apply --plan-hash <hash> --confirm
```

基线文件属于项目级事实，只能由 full project review 建立；禁止带 `--module` 生成局部基线后覆盖其他模块 fingerprint。

## 3. 平台 MQ/集成适配

BD 不内置平台 Producer/Consumer API。平台描述符声明：

- 精确 Maven 坐标；
- producer、consumer、配置、测试和能力的字面证据标记；
- inbound/outbound 各自要求的成熟度阶段和能力；
- 项目模板及只新增文件的实现 recipe。

绑定把契约 integrationId、模块、方向、源码/配置/测试/运行证据引用连接起来。成熟度固定为：

`declared → dependency → configured → wired → tested → runtime-evidenced`

双向绑定必须由双向契约证明，且 Producer/Consumer 两侧源码标记都命中；单向契约不得冒充双向。运行证据文件不得为空，平台可通过 `runtimeEvidenceAnyOf` 要求部署号、观测时间等真实标记。

每一阶段只在描述符要求且事实命中时通过。BD 不读取 Nacos 服务端、不连接 Broker、不把 Outbox/Inbox 内核误报为外部 Transport。

平台实现 recipe 只能读取项目内模板并新增项目内文件；目标已存在时阻断，禁止覆盖不同平台的存量封装。

## 4. 通用边界断言

`quality-assertions.json` 用显式 evidenceRefs 和字面标记表达平台边界，例如 HTTP 超时、幂等组件、并发锁或追踪能力。断言必须有稳定 ID、owner、sourceRef 和说明。

- `activateAnyOf`：何时激活；
- `requireAnyOf`：至少出现一个批准证据；
- `forbidAnyOf`：不得出现的已知危险证据；
- `safeReplacements`：可选的项目批准精确替换。

不允许正则脚本执行或任意命令。精确修复要求 before 在指定文件中恰好命中一次，否则降级人工；复验未闭环则恢复备份。

## 5. 供应链策略

供应链门禁由项目决定是否启用版本收敛、动态版本/SNAPSHOT、必需 BOM、禁用坐标和仓库前缀。默认无策略时不阻断，避免把团队选择伪装成通用事实。

## 6. Token 与证据预算

- Git diff 先确定受影响文件；
- 非 POM 变更跳过供应链解析；
- 适配器只评估引用命中的 binding；
- MCP 默认返回 summary，详细 finding 使用统一 cursor；
- AI 只消费缺口、责任边界和少量定位证据，不重复读取完整源码。

## 7. 禁止事项

- 禁止因依赖或环境配置存在就声称 MQ 已完成接入；
- 禁止由 BD 猜 Topic、Group、ACK、幂等算法或平台注解；
- 禁止自动修改已有平台封装；
- 禁止把 warning、历史基线或过期豁免静默隐藏；
- 禁止让 `confirmApply=true` 代替用户对预览的实际评审。

## 变更记录

- 2026-08-31 v1：新增变更审查、质量基线、平台适配、通用断言、供应链与精确修复闭环。
