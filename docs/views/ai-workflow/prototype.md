# 原型设计

<AuthorTag :authors="['ZhuXiang','CHENY','YangTianGuang']" />

::: tip ✅ 已落地（wl-skills-design v0.7.0）
`02-prototype.md` 规范已完成，定义了原型标注的深度标准和输出格式。  
原型标注 Skill 已随 `wl-skills-design` v0.7.0 发布，提供 `templates/`（空白模板）+ `examples/`（真实 D3 标注样例）双层资料，AI 生成后对照样例自检。
:::

## 版块定位

**原型设计**是 spec（需求设计说明书）与代码生成之间的桥梁。

```
spec IPO 表（确定字段+逻辑）
       ↓
原型标注（确定布局+交互模式+组件选型）  ← 本版块
       ↓
prototype-scan（wl-skills-kit，解析为 page-spec JSON）
       ↓
page-codegen（生成 Vue 代码）
```

原型的核心目的不是「画好看的图」，而是**固定页面布局、交互模式和字段位置**，为下游 `prototype-scan` → `page-codegen` 提供精确输入。

## 规范要点（02-prototype.md）

### 三级深度标准

| 等级 | 名称 | 适用阶段 | 精度 |
|------|------|---------|------|
| D1 | 布局骨架 | 需求评审前 | 确定模式+区域划分 |
| D2 | 字段完整 | 需求评审后 | 所有字段名+类型+字典确定 |
| **D3** | **开发就绪** | **进入开发前** | **满足全部 7 项标注，可直接 prototype-scan** |

### 页面交互模式（钢铁行业）

| 模式 | 典型场景 |
|------|---------|
| LIST | 炼钢计划列表、订单台账、质检记录 |
| MASTER_DETAIL | 轧钢计划+钢坯明细、订单+订单行 |
| TREE_LIST | 设备分类+设备列表 |
| FORM_MODAL | 新增/编辑弹窗 |
| COMPOSITE | 炼钢计划编制（查询+组炉+明细） |
| TAB_FORM | 推估试算（多工序 Tab） |
| DASHBOARD | 生产看板 |

### 每页必须标注的 7 项

1. 页面元信息（模式/目录名/服务缩写/关联流程）
2. 查询区字段（camelCase + 组件类型 + 字典编码）
3. 表格列（camelCase + 宽度 + 字典）
4. 工具栏按钮（文案 + 类型 + 动作）
5. 操作列按钮（文案 + 动作 + 条件显隐）
6. 表单字段（camelCase + 组件 + 必填 + 联动）
7. 特殊交互（状态机/批量/拖拽/行内编辑）

### 验证清单（22 项）

- PT-A：页面完整性（5 项）
- PT-B：字段规范性（7 项）
- PT-C：交互完整性（6 项）
- PT-X：跨文档一致性（4 项）— 原型字段 ⊆ spec IPO 字段

## 与 wl-skills-kit 的衔接

| wl-skills-design（设计阶段） | wl-skills-kit（开发阶段） |
|----------------------------|--------------------------|
| `create-prototype` → 输出 D3 标注 | `prototype-scan` → 解析为 page-spec |
| `validate-prototype` → 22 项验证 | `page-codegen` → 生成 Vue 代码 |

> D3 级原型 + prototype-scan 可达到 **95-100%** 的代码生成精度。

## 落地情况（v0.7.0）

- [x] 落地 `requirements/prototype/SKILL.md`（双层资料）
- [x] `templates/`：`page-annotation.md` 空白模板（7 区块）
- [x] `examples/`：炼钢计划列表 D3 完整标注（质量标杆）
- [x] 2 个 prompt：`create-prototype` / `validate-prototype`
- [x] 集成评审 D4 纳入原型维度校验

## 相关链接

- [L2 — Skill 总览](/views/best-practices/L2-skill)
- [AI 工作流概述](/views/ai-workflow/)
- [前端 Skills — prototype-scan](/skills/frontend/prototype-scan)
