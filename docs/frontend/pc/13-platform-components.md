# 平台组件合规规范（13）

> **平台规范第 13 条** · 强制度：🔴 必遵 + 阻断式。这是防止 AI 绕过平台封装、自由发挥使用 `el-*` 原生组件的核心规则。

::: info 位置说明
本规范属于 PC 端扩展规范系列，涉及 `@jhlc/jh-ui` 平台组件与 Robot_Admin 封装组件的强制使用约定。来源：`@agile-team/wl-skills-kit` · `standards/13-platform-components.md`
:::

<AuthorTag :authors="['ZhuXiang','CHENY','ZhongYu','XuQingYu']" />

---

## 总原则

> **优先使用平台封装组件；无对应封装时才允许使用 `el-*` 原生组件；
> 跨 3+ 页面相同 `el-*` 模式 → convention-audit 输出"组件提取建议"到 `reports/`，由人工评审决定是否封装。**

---

## 组件强制对照表

| 场景                | 优先使用（有则必用）                              | 替代方案                     |
| ------------------- | ------------------------------------------------- | ---------------------------- |
| 查询栏              | `BaseQuery`                                       | ❌ el-form 手写查询区        |
| 工具栏 / 操作按钮行 | `BaseToolbar`                                     | ❌ 自定义按钮排列             |
| 列表 / 表格         | `BaseTable` (`render-type="agGrid"`)              | ❌ el-table                  |
| 表单弹窗            | `c_formModal`                                     | ❌ el-dialog + el-form 手写  |
| 列表选择弹窗        | `c_listModal`                                     | ❌ el-dialog + el-table 手写 |
| 表单内容分区        | `c_formSections`                                  | ❌ 裸分组                    |
| 分割标题            | `c_spliterTitle`                                  | ❌ el-divider                |
| 复杂路由表单页      | FORM-ROUTE 模板                                   | ❌ 完全手写                  |
| 日期 / 日期范围     | `jh-date` / `jh-date-range`                       | ❌ el-date-picker            |
| 文件上传            | `jh-file-upload`                                  | ❌ el-upload                 |
| 用户选择            | `jh-user-picker`                                  | ❌ 自定义弹窗选人             |
| 部门选择            | `jh-dept-picker`                                  | ❌ 同上                      |
| 下拉 / 选择器       | `jh-select` / `jh-picker`                         | ❌ el-select 手写 options    |
| 只读文本展示        | `jh-text`                                         | ❌ span/div 直接渲染         |
| 分页                | `jh-pagination`                                   | ❌ el-pagination             |
| 上下分栏            | `jh-drag-row`                                     | ❌ 手动 flex/grid            |
| 左右分割            | `C_Splitter`                                      | ❌ 手动 flex/grid            |
| 树形面板            | `C_Tree`                                          | ❌ el-tree 手写              |
| 状态标签            | `C_TagStatus`                                     | ❌ el-tag + 颜色映射         |
| HTTP 请求           | `getAction / postAction / putAction / deleteAction` | ❌ axios / fetch 直接调用  |

---

## 组件在 template 中的书写顺序

当页面同时存在多个区块时，**有则按下列顺序排列**（全部可选，不强制必须存在）：

```
BaseQuery → BaseToolbar → BaseTable → jh-pagination
```

- ✅ 仅有 BaseTable 的页面：直接写 BaseTable，没问题
- ✅ 仅 BaseQuery + BaseToolbar 的录入型页面：按此顺序，后接表单区即可
- ❌ 顺序颠倒：BaseToolbar 写在 BaseQuery 之前

---

## docs/ 文档前置读取清单

生成涉及以下场景的代码时，AI 必须先读取对应文档（按需，不全读）：

| 涉及组件 / 模式             | 必读文档                                       |
| --------------------------- | ---------------------------------------------- |
| `jh-date` / `jh-date-range` | `docs/jh-date.md` / `docs/jh-date-range.md`   |
| `jh-file-upload`            | `docs/jh-file-upload.md`                       |
| `jh-user-picker`            | `docs/jh-user-picker.md`                       |
| `jh-dept-picker`            | `docs/jh-dept-picker.md`                       |
| `jh-select`                 | `docs/jh-select.md`                            |
| `jh-picker`                 | `docs/jh-picker.md`                            |
| `jh-text`                   | `docs/jh-text.md`                              |
| `jh-pagination`             | `docs/jh-pagination.md`                        |
| `jh-drag-row`               | `docs/jh-drag-row.md`                          |
| HTTP 请求方式               | `docs/request.md`                              |
| 页面 Hook 模式              | `docs/page-query-hook-best-practices.md`       |
| BaseQuery / BaseTable 等    | `src/components/remote/{Component}/README.md`  |
| c_formModal / c_listModal   | `src/components/local/{component}/README.md`   |

> AI 在 Pre-flight 声明中明确列出已读文档。

---

## AbstractPageQueryHook（强制）

所有页面 `data.ts` **必须** `extends AbstractPageQueryHook`：

```typescript
import { AbstractPageQueryHook } from '@jhlc/common-core/src/page-hooks/page-query-hook.ts'

export function createPage() {
  let Page = new (class extends AbstractPageQueryHook {
    constructor() { super({ url: { list: '...' } }) }
    queryDef() { return [...] }
    toolbarDef() { return [...] }
    columnsDef() { return [...] }
  })()
  return Page.create() as any
}
```

---

## 提取建议触发规则

`convention-audit` 扫描发现 **3+ 个页面**出现相同的未封装 `el-*` 模式时，输出到 `reports/组件提取建议.md`：

```markdown
| 建议组件名    | 出现次数 | 页面路径                        | 菜单位置（来自文件头）  | 模式描述         |
| ------------- | -------- | ------------------------------- | ----------------------- | ---------------- |
| c_statusBadge | 5 处     | src/views/sale/.../index.vue 等 | 销售管理 > 国内贸易订单 | 状态枚举彩色标签 |
| c_priceFormat | 4 处     | ...                             | ...                     | 千分位金额显示   |
```

::: warning
AI **不自动提取**。人工确认后，触发 template-extract 或手动封装。
:::

---

## AI 检查清单（每次代码生成前自查）

- [ ] 查询区使用了 BaseQuery，没有自己写 el-form？
- [ ] 表格使用了 BaseTable + agGrid + cid，没有用 el-table？
- [ ] 弹窗使用了 c_formModal / c_listModal，没有手写 el-dialog？
- [ ] 日期组件用了 jh-date 系列，没有用 el-date-picker？
- [ ] HTTP 请求都走 `getAction / postAction`，没有 import axios？
- [ ] data.ts 继承了 AbstractPageQueryHook？
- [ ] 涉及 jh-\* 组件时已读取对应 `docs/jh-*.md`？
