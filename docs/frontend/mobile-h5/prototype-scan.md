# ① 原型扫描 prototype-scan

> 触发词：`扫描原型` / `分析原型` / `解析设计稿`

将 Axure 导出的 HTML 原型包、设计文档（MD/Word）或截图描述解析为结构化的 **page-spec.json 页面骨架**，作为后续接口规格和代码生成的输入。

---

## 输入

- Axure HTML 文件路径
- 设计文档（Markdown）
- 截图描述

## 输出

结构化 `page-spec.json`，描述页面完整骨架：

```json
{
  "pageName": "customer-archive",
  "pageTitle": "客户档案",
  "pageType": "LIST",
  "search": { "fields": ["keyword"] },
  "tabs": [
    { "key": "all", "label": "全部客户" },
    { "key": "temp", "label": "临时客户" }
  ],
  "card": {
    "primary": "name",
    "secondary": "code",
    "tags": ["category", "conversionStatus"],
    "meta": [
      { "label": "联系人", "key": "contactName" },
      { "label": "业务员", "key": "salesPerson" }
    ]
  },
  "operations": [
    { "label": "转化", "action": "convert", "show": "row.conversionStatus === 'unconverted'" },
    { "label": "作废", "action": "void", "type": "danger" }
  ],
  "footer": { "type": "add", "label": "+ 新增客户档案" }
}
```

---

## 移动端适配要点

| PC 端表现 | 移动端转换 |
|---|---|
| 表格行 | 卡片，提取 `primary / secondary / tags / meta` 层级 |
| 左侧筛选面板 | 水平滑动 Tab 标签 |
| 工具栏按钮 | 底部固定操作栏（移动端特有） |
| 表格行操作列 | 卡片底部按钮区，用 `show` 条件控制显示 |

---

## 页面类型分类

| 类型 | 特征 |
|---|---|
| `LIST` | 搜索区 + Tab 过滤 + 卡片列表 + 底部新增按钮 |
| `FORM` | 分区表单（hero 头部 + card 分组 + 提交栏） |
| `DETAIL` | 信息展示（header 卡 + section × N） |
| `TABS` | 顶部 Tab 切换多个子视图 |
| `DASHBOARD` | 数据看板 |

---

## 执行步骤

1. 读取原型文件或文档
2. 识别页面类型：LIST / FORM / DETAIL / TABS / DASHBOARD
3. 提取字段列表、状态枚举、操作按钮
4. 对比规范：字段命名 camelCase，状态必须有 Map 映射
5. 输出 `page-spec.json`

---

## 下游 Skill

输出的 `page-spec.json` 将作为 [② 接口规格](./api-spec) 的输入。
