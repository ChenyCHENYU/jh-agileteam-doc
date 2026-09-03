# convention-audit-be — 后端规范审计与变更审查

> 只发现和解释问题，**不修改源码**。确定性结果来自实际执行器（B1~B31 / J 门 / review 门禁），AI 只补充业务语义、DDL 风险与架构判断。

## 什么时候用

- 提交前 / 合并前自查（staged 或增量）
- 存量模块全量体检（audit 模式）
- 季度质量评审（review baseline 对比历史基线）

## 三种用法

```bash
# 1. 全量审计（SARIF 可贴 IDE / CI）
wl-skills-bd validate src/main --format sarif --output reports/backend.sarif

# 2. 按任务子集（增量开发只看相关规则）
wl-skills-bd validate src/main --task add-api

# 3. 变更审查统一质量门（v0.24：规则+基线+豁免+断言+供应链+覆盖率）
wl-skills-bd review run --module <模块名>
wl-skills-bd review baseline          # 冻结历史基线，之后只拦新增
```

## 输出怎么读

| 输出 | 含义 |
|------|------|
| complete / partial coverage | 覆盖完整性——partial 不能冒充完整审查 |
| 新增 / 历史 / 豁免 / 过期豁免 | 问题四分类，fingerprint 稳定（行号移动不算新增） |
| skippedRules | 本次未执行的规则，显式列出不静默 |
| JaCoCo 全量/变更行覆盖率 | Service 行/分支 ≥70%/60%，Controller 行 ≥50% |

## 红线

- 审计只读，不改文件；修复走 [code-fix-be](/backend/skills/code-fix-be)
- warning 预算、规则完整覆盖与覆盖率缺口计入**同一最终决策**，不允许局部扫描掩盖新增风险
- 项目级 baseline 拒绝 `--module` 切片（防止单模块 fingerprint 覆盖全局基线）

## 延伸阅读

- [变更审查与精准修复（v0.24）](/backend/skills/) · [code-fix-be](/backend/skills/code-fix-be) · 实战参照 `wl-produce`（炼钢服务，bd review canary 试点模块）
