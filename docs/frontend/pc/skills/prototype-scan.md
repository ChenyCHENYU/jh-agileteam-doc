# Skill ①：原型扫描（prototype-scan）

将 **Axure 导出的 HTML 原型包**、**详细设计文档（MD/Word/表格）** 或 **口述需求** 解析为结构化的 **page-spec JSON 页面清单**，作为后续接口约定和代码生成的输入。

> **两种输入，同一输出**：输出格式完全相同（page-spec JSON），消费方（page-codegen）无需感知来源。

## 触发关键词

`扫描原型` / `解析原型` / `页面清单` / `详设文档` / `口述需求` / `建个页面` / `写个页面`

## 三种输入模式

| 模式 | 输入 | 典型场景 |
|------|------|----------|
| **模式 0（自然语言）** | 用户口述需求，无文件 | 日常对话："帮我建一个客户管理页面，有XX字段" |
| **模式 A（Axure）** | Axure HTML 文件包目录 | 已有原型设计，AI 全量扫描 HTML |
| **模式 B（详设文档）** | MD/Word/表格格式的详细设计文档 | 已有详细设计文档，AI 解析结构化字段 |

---

## 模式 0 — 自然语言转 page-spec

> **核心原则**：模式 0 是 AI 的**内部推导流程**，不输出中间 JSON 给用户。
> AI 从口述中提取信息 → 内部构建 page-spec JSON → 直接传递给 page-codegen 消费。
> **不向用户索要文件**，用注释标注不确定项即可。

### 交互模式关键词映射

| 用户关键词 | 推断模式 |
|-----------|----------|
| "列表" / "查询" / "管理页" / 无特殊说明 | `LIST` |
| "主从" / "明细" / "上下表" | `MASTER_DETAIL` |
| "树形" / "左树右表" | `TREE_LIST` |
| "表单" / "详情" / "多Tab表单" | `DETAIL_TABS` |
| "独立表单" / "路由表单" / "复杂表单" | `FORM_ROUTE` |
| "变更历史" / "变更记录" | `CHANGE_HISTORY` |
| "记录表单" / "无分页" | `RECORD_FORM` |
| "工位" / "操作站" | `OPERATION_STATION` |

### 降级与默认值原则

| 信息缺失项 | 默认策略 |
|-----------|----------|
| 交互模式 | `LIST`（最常见的列表查询页） |
| 查询字段 | 基于业务资源名推断 1-2 个（"名称"、"编码"） |
| 工具栏按钮 | `[新增(primary), 删除(danger)]` |
| 表格列 | 基于资源语义推断 5-8 个常见字段（编码、名称、类型、状态、创建时间等） |
| 操作列 | `[编辑, 删除]` |
| 字段英文名 | AI 推断 camelCase，notes 标注"字段名为推断值" |
| 字典 code | 状态类字段自动标注推断 dictCode，notes 标注"dictCode 为推断值" |

---

## 模式 A：Axure HTML 扫描

## 模式 A：Axure HTML 扫描

### 步骤 1 — 全量扫描 HTML

遍历所有 `.html` 文件，提取：

| 区域 | 提取内容 |
|------|---------|
| 标题 | `<title>` / 标题文本 -> 页面名称 |
| 表格 | `<table>` / 网格布局 -> 表格列定义 |
| 表单 | `<input>` / `<select>` / 标签文本 -> 查询条件和表单字段 |
| 按钮 | `<button>` / 链接文本 -> 操作按钮列表 |
| 弹窗 | 遮罩层 / 弹出层 -> 弹窗组件 |
| 树形 | 侧边栏 / 树形导航 -> 树形结构 |
| 注释 | Axure 注解 -> 业务说明 |

### 步骤 2 — 交互模式分类

| 模式 | 特征 | 前端组件 |
|------|------|---------|
| `LIST` | 查询区 + 表格 + 分页 | BaseQuery + BaseTable + jh-pagination |
| `MASTER_DETAIL` | 上方主表 + 下方明细表 | jh-drag-row |
| `TREE_LIST` | 左侧树 + 右侧表格 | C_Splitter + C_Tree |
| `FORM_MODAL` | 弹窗中的表单 | el-dialog + el-form |
| `COMPOSITE` | 多种组合 | 组合使用 |

### 步骤 3 — 字段提取

对每个页面提取 3 类字段（字段名用 camelCase，与 data.ts 直接对应）：

**查询字段组件类型对照：**

| 原型表现 | 组件配置 |
|---------|---------|
| 普通输入框 | 默认 input（无需 component 属性） |
| 下拉选择 | `logicType: BusLogicDataType.dict, logicValue: "dictCode"` |
| 单日期 | `component: () => ({ tag: "jh-date", type: "date" })` |
| 月份选择 | `component: () => ({ tag: "jh-date", type: "month", showFormat: "YYYY-MM", format: "YYYYMM" })` |
| 日期范围 | `component: () => ({ tag: "jh-date", type: "daterange", rangeSeparator: "至", showFormat: "YYYY-MM-DD", valueFormat: "YYYY-MM-DD" })`，需额外配 `startName`/`endName` |
| 用户选择 | `component: () => ({ tag: "jh-user-picker" })` |
| 部门选择 | `component: () => ({ tag: "jh-dept-picker" })` |

**表格列：** 字典列配置参考：`{ label: "状态", name: "status", minWidth: 120, logicType: BusLogicDataType.dict, logicValue: "dictCode", sortable: true, filterable: true }`

### 步骤 4 — 组件匹配

对照平台已有组件（详细 API 见 `docs/jh-*.md`）：

| 功能区 | 组件 | 说明 |
|--------|------|------|
| 查询区 | BaseQuery | 通过 `queryDef()` 声明式配置 |
| 工具栏 | BaseToolbar | 通过 `toolbarDef()` 声明式配置 |
| 表格 | BaseTable | 通过 `columnsDef()` 声明式配置 |
| 分页 | jh-pagination | 固定用法 |
| 上下分栏 | jh-drag-row | 主从表必备，需设 `:top-height` |
| 左右分割 | C_Splitter | 树形+列表必备 |
| 树形面板 | C_Tree | 含搜索+Tab 切换 |
| 下拉选择 | jh-select | dict 属性自动加载字典数据 |
| 日期选择 | jh-date / jh-date-range | 参见 `docs/jh-date.md` |
| 用户选择 | jh-user-picker | 参见 `docs/jh-user-picker.md` |
| 部门选择 | jh-dept-picker | 参见 `docs/jh-dept-picker.md` |
| 文件上传 | jh-file-upload | 参见 `docs/jh-file-upload.md` |

### 步骤 5 — pages.ts 注册名推断

根据 `gProd` / `gSale` 函数格式：

```typescript
// ["kebab-case-目录名", "中文label"]
// 路径: views/[域]/[模块]/[子模块]/[目录]/index.vue
```

---

## 模式 B：详细设计文档

详设文档输入比 Axure HTML **精度更高（95-100%）**，因为字段名和类型是明确写出的，不需要从视觉推断。

### 精度对比

| 输入来源 | 字段不遗漏 | 英文名准确 | 字典code准确 | 综合精度 |
|---------|-----------|-----------|------------|---------|
| Axure HTML | 高 | 需推断 | 需推断 | 90-95% |
| **详设文档（规范格式）** | **高** | **直接读** | **直接读** | **95-100%** |
| 详设文档（自由格式） | 高 | 需推断 | 需推断 | 85-95% |

### 推荐的详设文档格式

```markdown
## 客户档案

**基本信息**
- 交互模式：LIST
- 目录名：customer-archive
- 服务缩写：sale

### 查询条件

| 字段名(camelCase) | 中文名 | 类型 | 字典code |
|------------------|--------|------|---------|
| customerName | 客户名称 | input | - |
| enableStatus | 启用状态 | dict | enable_status |
| createDate | 建立日期 | dateRange | - |

### 表格列（按顺序）

| 字段名(camelCase) | 中文名 | 宽度 | 字典code |
|------------------|--------|------|---------|
| customerName | 客户名称 | 180 | - |
| customerType | 客户类型 | 120 | customer_type |
```

## 输出格式：page-spec JSON

> **核心原则**：结构化 JSON 确保字段不遗漏，notes 保留复杂语境。
> 每个页面输出一个 page-spec JSON 对象，所有页面汇总为数组。
> **禁止在 JSON 中用"等"、"..."省略任何字段**，必须逐个列出。

```jsonc
{
  // ===== 页面基本信息 =====
  "pageName": "客户档案",
  "kebabName": "customer-archive",
  "pattern": "LIST",   // LIST | MASTER_DETAIL | TREE_LIST | FORM_TAB | COMPOSITE
  "path": "views/sale/demo/khda/customer-archive/",
  "pagesTs": ["customer-archive", "客户档案"],
  "platformComponents": ["BaseQuery", "BaseTable", "jh-pagination"],
  "newComponents": [],  // 需要新建的组件名（空数组=不需要新建）

  // ===== 查询区字段（逐个列出，禁止省略） =====
  "query": [
    { "field": "customerName", "label": "客户名称", "type": "input" },
    { "field": "customerType", "label": "客户类型", "type": "dict", "dictCode": "customer_type" },
    {
      "field": "createDate", "label": "建立日期", "type": "dateRange",
      "startName": "createDateStart", "endName": "createDateEnd"
    }
  ],

  // ===== 工具栏按钮（逐个列出，与原型顺序严格一致） =====
  // toolbar.type 映射：蓝底填充="primary"，线框/白底="plain"，红色="danger"，灰色="default"
  "toolbar": [
    { "label": "新增", "type": "primary", "action": "openModal" },
    { "label": "删除", "type": "danger", "action": "batchDelete" },
    { "label": "导出", "type": "plain", "action": "export" }
  ],

  // ===== 表格列（逐列列出，禁止省略） =====
  "columns": [
    { "field": "customerName", "label": "客户名称", "width": 180 },
    { "field": "customerType", "label": "客户类型", "width": 120, "dict": "customer_type" }
  ],

  // ===== 操作列按钮 =====
  "operations": [
    { "label": "编辑", "action": "edit" },
    { "label": "删除", "action": "delete" }
  ],

  // ===== 内嵌子表（关键！必须标注交互属性） =====
  "subTables": [
    {
      "name": "businessInfo",
      "label": "业务信息",
      "editable": true,
      "inlineEdit": false,
      "columns": [{ "field": "salesType", "label": "销售别", "width": 80 }],
      "operations": [{ "label": "删除", "action": "removeRow" }]
    }
  ],

  // ===== 页面级特殊交互开关 =====
  "features": {
    "tabSwitch": false,
    "tabItems": [],              // [{ "label": "临时客户", "value": "temp" }]
    "viewSwitch": false,
    "viewItems": [],
    "hiddenMenu": false
  },

  // ===== 非结构化补充说明 =====
  "notes": ["客户分类下拉选项按产品线动态变化"]
}
```

### 子表交互判断规则

| 原型特征 | editable | inlineEdit |
|---------|----------|------------|
| 表格上方有"新增"按钮，行内有"删除"链接 | `true` | `false` |
| 表格单元格可直接编辑（输入框/下拉） | `true` | `true` |
| 纯展示表格，无任何编辑入口 | `false` | `false` |
| 表格仅有外部"导入"按钮填充数据 | `false` | `false` |

## 自检清单

输出前必须逐项确认：

```
□ query 数组 — 数量与原型查询区字段一一对应、顺序一致？
□ columns 数组 — 数量与原型表头一一对应、顺序一致？
□ toolbar 数组 — 数量与原型按钮一一对应、颜色类型正确？
□ operations 数组 — 与原型操作列按钮一一对应？
□ 所有 subTables 都标注了 editable + inlineEdit？
□ 所有 dict 字段都提取了 dictCode？
□ features.tabSwitch / tabItems — 原型中的 Tab 标签全部提取？
□ features.viewSwitch / viewItems — 原型中的视角切换（Radio）全部提取？
□ features.hiddenMenu 已正确标注？
□ notes 中补充了无法结构化的特殊逻辑？
```

### 顺序精度要求

> **顺序即规范**：原型设计师精心安排了查询区、按钮栏、表格列的顺序，AI 输出必须严格保持一致。

1. **查询区字段**：按原型从左到右、从上到下逐个提取，不可调换，不可遗漏
2. **工具栏按钮**：按原型从左到右逐个提取，标注颜色（蓝底填充=`primary`，线框=`plain`，红色=`danger`，灰色=`default`）
3. **表格列**：按原型表头从左到右逐列提取（不含复选框列和序号列，代码模板自动添加）
4. **操作列按钮**：逐个提取到 `operations`，保持原型中的文字和顺序
5. **按钮文字**：必须使用原型中的**原始文字**（如原型写"新增申请"不可简化为"新增"）
