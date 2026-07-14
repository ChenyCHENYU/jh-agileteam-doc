# Skill ②：说明书解析（spec-doc-parse）

将 **`wl-skills-design` 产出的标准说明书**（含功能编码 / IPO 表 / 流程五要素）解析为结构化的 **page-spec JSON 页面清单**，作为 [prototype-scan](./prototype-scan) 的**规范线对等入口**。

> **双线隔离**：`prototype-scan`（原型线）与 `spec-doc-parse`（规范线）是**互斥的两个入口**，按输入类型二选一，输出格式完全相同，下游 [api-contract](./api-contract) / [page-codegen](./page-codegen) 无感知。详见 [AI Skill 流水线](./skill-pipeline#双线路由机制)。

## 触发关键词

`解析说明书` / `规范文档转页面` / `IPO 表` / `功能编码` / `说明书转 spec`

## 何时走规范线

| 走 prototype-scan（原型线） | 走 spec-doc-parse（规范线） |
|---|---|
| Axure HTML / 截图 / 口述 | `wl-skills-design` 标准说明书 |
| 自由格式详细设计文档 | 含**功能编码**、**IPO 表**、**流程五要素** |
| 无结构化约束的资料 | 路径含 `docs/spec/` |

> AI 根据输入自动判断：路径含 `docs/spec/` 或文档含功能编码 / IPO 表走规范线，其余走原型线。

---

## 标准说明书格式

规范线要求输入是 `wl-skills-design` 沉淀的结构化说明书，核心要素：

| 要素 | 说明 | 示例 |
|------|------|------|
| **功能编码** | 唯一标识一个功能点 | `SALE-ORDER-LIST` |
| **IPO 表** | 输入 / 处理 / 输出三段式描述 | 输入：订单号；处理：查询；输出：订单列表 |
| **流程五要素** | 触发条件 / 输入 / 活动 / 输出 / 约束 | 提交审批流转链 |
| **字段字典** | 字段名、类型、字典 code 明确给出 | `orderType: dict: order_type` |

### 与原型线的精度差异

| 输入来源 | 字段英文名 | 字典 code | 综合精度 |
|---------|-----------|----------|---------|
| Axure HTML（原型线） | 需推断 | 需推断 | 90-95% |
| **标准说明书（规范线）** | **直接读** | **直接读** | **95-100%** |

规范线因字段名和类型是明确写出的，不需要从视觉推断，精度更高。

---

## 解析流程

```text
标准说明书（docs/spec/）
  ↓
① 提取功能编码 → 确定页面归属与命名
② 解析 IPO 表 → 推导交互模式（LIST / MASTER_DETAIL / ...）
③ 读取字段字典 → 直接映射 query / columns / 表单字段（无需推断）
④ 解析流程五要素 → 推导工具栏按钮、操作列、子表交互
⑤ 输出 page-spec JSON + SPEC_PARSE 报告
```

### 输出产物

```text
reports/SPEC_PARSE_<模块>_<日期>.md
  ├── page-spec JSON（与 prototype-scan 格式完全相同）
  └── 解析报告（功能编码覆盖度 / IPO 完整性 / 歧义项 notes）
```

::: tip page-spec JSON 格式
与 [prototype-scan 的输出格式](./prototype-scan#输出格式-page-spec-json)完全一致，下游 Skill 无需感知来源差异。
:::

---

## 规范线独有能力：spec-align GAP 报告

规范线在 [convention-audit](./convention-audit) 阶段可追加 `--mode spec-align`，将生成代码与原始标准说明书逐项比对，输出 **GAP 报告**：

| GAP 类型 | 说明 |
|---------|------|
| 字段遗漏 | 说明书有、代码无 |
| 字段多余 | 代码有、说明书无 |
| 类型偏差 | 字典 code / 字段类型不一致 |
| 流程缺失 | 五要素中的流程未实现 |

> 原型线不支持 spec-align（原型无结构化基线可比对）。

---

## 标准对话示例

```
你：解析 docs/spec/订单管理说明书.md，生成页面清单。
AI：[Pre-flight]
    ├─ 来源：docs/spec/订单管理说明书.md（规范线，含 12 个功能编码）
    ├─ 输出：reports/SPEC_PARSE_订单管理_20260426.md
    └─ 检测到 2 个 IPO 表缺约束项，已在 notes 标注
    完成，页面清单：
    1. order-list (LIST) - 订单列表
    2. order-form (FORM_ROUTE) - 订单维护
    ... 共 12 项
```

---

## FAQ

**Q：说明书不是 wl-skills-design 标准格式，能用吗？**  
A：可以，但会自动降级走原型线（prototype-scan），精度略降。建议先用 `wl-skills-design` 沉淀标准说明书。

**Q：规范线和原型线能混用吗？**  
A：同一模块建议走同一条线。混用时以最后解析的 page-spec 为准。

**Q：spec-align 报告怎么用？**  
A：在 convention-audit 阶段说「用 spec-align 模式审计」，AI 会对照原始说明书生成 GAP 报告，再用 [code-fix](./code-fix) 批量修复。
