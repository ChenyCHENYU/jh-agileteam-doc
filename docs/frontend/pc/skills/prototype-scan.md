# Skill 1：原型扫描（prototype-scan）

将 **Axure 导出的 HTML 原型包** 或 **详细设计文档（MD/Word/表格）** 解析为结构化的 **page-spec JSON 页面清单**，作为后续接口约定和代码生成的输入。

> 两种输入，同一输出：输出格式完全相同（page-spec JSON），消费方（page-codegen）无需感知来源。

## 触发方式

- **模式 A（Axure）**：提供 Axure HTML 文件包目录，AI 全量扫描 HTML
- **模式 B（详设文档）**：提供 MD/Word/表格格式的详细设计文档，AI 解析结构化字段

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
| 月份选择 | `component: () => ({ tag: "jh-date", type: "month" })` |
| 日期范围 | `component: () => ({ tag: "jh-date", type: "daterange" })` |
| 用户选择 | `component: () => ({ tag: "jh-user-picker" })` |
| 部门选择 | `component: () => ({ tag: "jh-dept-picker" })` |

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
| 日期选择 | jh-date / jh-date-range | 单日期 / 日期范围 |
| 用户选择 | jh-user-picker | 用户弹窗选择 |
| 部门选择 | jh-dept-picker | 部门树选择 |
| 文件上传 | jh-file-upload | 附件管理 |

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

每个页面输出一个 page-spec JSON 对象，所有页面汇总为数组。

**禁止在 JSON 中用"等"、"..."省略任何字段**，必须逐个列出。

```json
{
  "pageName": "客户档案",
  "kebabName": "customer-archive",
  "pattern": "LIST",
  "path": "views/sale/demo/khda/customer-archive/",
  "pagesTs": ["customer-archive", "客户档案"],
  "platformComponents": ["BaseQuery", "BaseTable", "jh-pagination"],

  "query": [
    { "field": "customerName", "label": "客户名称", "type": "input" },
    { "field": "customerType", "label": "客户类型", "type": "dict", "dictCode": "customer_type" }
  ],

  "toolbar": [
    { "label": "新增", "type": "primary", "action": "openModal" },
    { "label": "删除", "type": "danger", "action": "batchDelete" }
  ],

  "columns": [
    { "field": "customerName", "label": "客户名称", "width": 180 },
    { "field": "customerType", "label": "客户类型", "width": 120, "dict": "customer_type" }
  ],

  "operations": [
    { "label": "编辑", "action": "edit" },
    { "label": "删除", "action": "delete" }
  ],

  "features": {
    "tabSwitch": false,
    "viewSwitch": false,
    "hiddenMenu": false
  },

  "notes": ["客户分类下拉选项按产品线动态变化"]
}
```

## 自检清单

输出前必须逐项确认：

- query 数组数量与原型查询区字段一一对应、顺序一致
- columns 数组数量与原型表头一一对应、顺序一致
- toolbar 数组数量与原型按钮一一对应、颜色类型正确
- operations 数组与原型操作列按钮一一对应
- 所有 subTables 都标注了 editable + inlineEdit
- 所有 dict 字段都提取了 dictCode
- features.tabSwitch / viewSwitch / hiddenMenu 已正确标注
