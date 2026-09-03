# 数据库治理实操

> 四方对账（文档 ↔ 契约 ↔ Flyway ↔ 线上快照）+ 执行账本 + 豁免审批 + 环境分级。全部命令**只读或生成预览**，执行永远由人/DBA 完成。

## 命令速查

| 命令 | 作用 | 时机 |
|------|------|------|
| `db preview wl-contract.json` | DDL 预览 + 基线门禁 + 环境执行通道 | 生成后、执行前 |
| `db drift --snapshot snapshot.json` | 线上结构与三方对账（不连库） | 周期性 / 发版前 |
| `db executed --table t --column c --approval-ref JIRA-123` | 现场 DDL 执行回执入账本 | 每次手工/DBA 执行后 |
| `db ledger` | 审计 DDL 执行账本 | 复盘 / 审计 |

## 标准流程

```text
① 改文档 docs/db-spec（先文档）
      ↓
② 改契约 wl-contract.json（再契约）
      ↓
③ db preview → planHash → 生成 Flyway 迁移（后迁移）
      ↓
④ dev/sit：一次 planHash 审批后连续执行
   pre/prod：DBA/CD + 备份恢复 + 变更窗口
      ↓
⑤ 现场任何手工执行 → db executed 入账本
      ↓
⑥ 周期 db drift 对账 → 无主变更即暴露
```

## 三条红线

| 红线 | 规则 |
|------|------|
| 基线复用 | 文档基线表必须**同名复用**，字段名称/顺序/类型/可空性/默认值/注释精确对账；扩展字段末尾追加 |
| 事实源指纹 | 基线状态 fingerprint 进入 `planHash`——先改文档再生成，跳不过去 |
| 豁免留痕 | 改名/漏实现在 `.wl-skills-bd/naming-waivers.json` 审批登记，**warn 标识永久保留**，绝不静默 |

## 常见场景

**Q：线上有人手工加了一列，下轮 drift 报"无主变更"？**
核实业务依据 → 补 `db executed` 登记（带审批引用）→ drift 放行并保留标识；确属误加则走文档修订删除。

**Q：表要改名？**
`naming-waivers.json` 登记改名映射与 baselineFields → 审批 → 新旧名对照期间 drift 保留 warn 追溯。

**Q：环境差异？**
dev/sit 结构门禁完整、一次审批连续执行；pre/prod 保留 DBA/CD、备份恢复与变更窗口。工具在 pre/prod **默认零写入**。

---

> 实战背景：`wl-produce/docs/db-spec/` 即四方对账的文档镜像（炼钢服务）。
