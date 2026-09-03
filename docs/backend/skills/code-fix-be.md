# code-fix-be — 受控修复

> 分级修复：只有满足确定性前置条件的 **B3（`SELECT *` → BaseColumns）/ B5（补 `@Transactional(rollbackFor)`）**，或项目批准的单次精确替换可自动修改。其余规则**不猜**。

## 什么时候用

审计报告出来后，对可自动修复项批量整改；修复完强制复扫确认。

## 分级机制（v0.24）

| 级别 | 处理 |
|------|------|
| 自动（白名单 B3/B5） | 生成补丁 → planHash → 显式确认 → 原子写 → **强制复扫** |
| 项目批准精确替换 | `quality-assertions.json` 批准的单次替换，走同一事务写链 |
| 建议补丁 | AI 生成 diff 建议，人工确认后应用 |
| 业务语义项 | 不自动应用，人工处理 |

## 用法

```bash
# 1. 预览修复计划（0 匹配或多次匹配会阻断，不会盲改）
wl-skills-bd fix advise src/main

# 2. 应用（必须携带预览时的 planHash）
wl-skills-bd safe-fix src/main --plan-hash <hash> --confirm
#    B3: SELECT * → <include refid="BaseColumns"/>
#    B5: 缺少 @Transactional(rollbackFor) → 补齐

# 3. 复扫确认（写后强制）
wl-skills-bd validate src/main
```

## 红线

- 不猜权限、SQL、租户、异常或业务文档——这四类问题留给人工
- 写前漂移（文件在 plan 后被改过）、受保护环境（pre/prod）、复验失败 → **阻断或回滚**
- 自动修复白名单不扩大：新规则要进白名单必须先证明确定性

## 延伸阅读

- [convention-audit-be](/backend/skills/convention-audit-be)（审计在前，修复在后）· [变更审查与精准修复](/backend/skills/)
