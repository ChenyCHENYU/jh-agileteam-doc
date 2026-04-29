# Skill ⑦：受控自动修复（code-fix）

读取 `reports/规范审查报告.md` 中的偏差条目，在用户确认 diff 后执行单条或分组修复。

> **前置**：必须先运行 `convention-audit` 生成审计报告，code-fix 依赖其输出。  
> **范围**：仅修复 🟡 / 🟢 等级偏差；🔴 严重偏差必须人工或 page-codegen 重新生成。

## 触发关键词

`自动修复` / `整改偏差` / `修复报告` / `规范整改` / `修复偏差` / `code-fix` / `整改规范`

## 工作流

```
reports/规范审查报告.md（convention-audit 输出）
        │
        ▼
[1] 用户从报告挑选 issueId（或 issueGroup），或说"列出可修复项"
        │
        ▼
[2] 解析 issue → 定位文件 + 行号 + 偏差类型
        │
        ▼
[3] 选择修复策略：
    ├─ rule-based（如缺 :scoped、缺 cid 等）→ 直接按规则生成 patch
    └─ ai-based（语义性偏差）→ AI 生成 patch
        │
        ▼
[4] Pre-flight 输出 diff 预览（人读，必须等待确认）
        │
        ▼
[5] 用户 yes → 写入文件 + 在报告中标记该条目为 ✅ 已修复
    用户 no  → 跳过该 issue，回到挑选界面
```

## 受控原则（严格执行，不可绕过）

| 原则 | 说明 |
|------|------|
| **不修 🔴** | 严重偏差必须人工或 page-codegen 处理，code-fix 不介入 |
| **不破坏功能** | 只改报告点名的行，不顺手"重构"周边代码 |
| **不批量盲改** | 每个文件都先 diff 预览，禁止跳过用户确认 |
| **不生成新逻辑** | 只修偏差，不做功能补全（那是 page-codegen 的职责） |
| **范围明确** | 若用户引导修改业务逻辑，必须拒绝并说明原因 |

## 偏差类型 → 修复策略

| 偏差类型 | 来源规范 | 策略 |
|---------|---------|------|
| EColumn 缺 cid | standards/12-base-table.md | rule-based |
| 列级 cid 只用缩写前缀（如 `mca-steelCode`） | standards/12-base-table.md | rule-based |
| scss 文件缺 `:scoped` 包裹 | standards/02-code-structure.md | rule-based |
| import 路径不规范 | standards/04-coding-basics.md | rule-based |
| `any` 滥用（> 3 处/页） | standards/09-typescript.md | ai-based |
| API_CONFIG URL 命名偏差 | api-contract.md | ai-based |
| 表格列定义与 api.md 字段不一致 | api-contract + data.ts | ai-based |
| 业务语义偏差（流程不对） | 多 standards 综合 | **不修复，标记人工** |

## 触发命令形态

```
"修复 reports/规范审查报告.md 中的 issue#3"              → 单条修复
"修复 reports/规范审查报告.md 中所有 scss 偏差"          → 分组修复
"修复全部 rule-based 偏差，跳过 ai-based"                → 受控批量
"列出可修复的 issue"                                     → 仅列清单，不动任何文件
```

## 典型修复示例

### 示例 1：补 cid（rule-based）

审计报告中发现：
```
❌ issue#3 — EColumn 缺 cid
   文件：src/views/sale/order/data.ts，第 42 行
   现状：{ name: "orderNo", label: "订单编号" }
   应为：{ name: "orderNo", label: "订单编号", cid: "sao-orderNo" }
```

diff 预览：
```diff
- { name: "orderNo", label: "订单编号" }
+ { name: "orderNo", label: "订单编号", cid: "sao-orderNo" }
```

### 示例 2：补 :scoped（rule-based）

```diff
- .app-container {
+ :deep(.app-container) {  // 如需跨组件
+ }
+ .app-container {         // 或直接加 scoped
```

## 执行输出

```
✅ code-fix 完成
──────────────────────────────────────────────
已修复：5 条（rule-based 4 + ai-based 1）
跳过（用户拒绝）：1 条
跳过（🔴 严重，不介入）：2 条
──────────────────────────────────────────────
📌 reports/规范审查报告.md 中已标记已修复条目
```

## 与其他 Skill 的关系

| Skill | 关系 |
|-------|------|
| **convention-audit** | **前置**：必须先有审计报告，code-fix 才有输入 |
| **page-codegen** | 互斥：生成新页面用 codegen，不用 fix |
| **template-extract** | 无直接关系 |
