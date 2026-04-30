# Skill ③：页面代码生成（page-codegen）

基于《页面清单》+ 原型信息，生成符合项目规范的完整 Vue 3 页面代码。

## Pre-flight 规范声明（AI 执行前必须输出）

```
🚀 已触发技能 page-codegen/SKILL.md          → 页面代码生成
✅ 已读取 templates/_index.md                → 模板注册表，匹配 → {TPL路径}
✅ 已读取 templates/{TPL-XXX.md}             → {当前模板说明}
✅ 已读取 standards/index.md                 → 规范门控
✅ 已读取 standards/02-code-structure.md     → 4文件原则 + 三段式 + script 9段顺序
✅ 已读取 standards/12-base-table.md         → AGGrid必用 + cid命名规范
✅ 已读取 standards/13-platform-components.md → 平台组件对照表
✅ 已读取 docs/{涉及的jh-*文档}              → 当前页涉及组件的使用规范
✅ 工具链检测：.prettierrc.js ✓  eslint.config.ts ✓  .husky/ ✓
✅ cid 已生成：{value}（{首字母缩写说明}）
```

> 如果 AI 没输出此声明，说明它跳过了前置检查，请提示"补 Pre-flight 声明"后重新触发。

## 前置检查

生成前需确认以下信息：

- 页面中文名
- 交互模式：LIST / MASTER_DETAIL / TREE_LIST / DETAIL_TABS / FORM_ROUTE / CHANGE_HISTORY / RECORD_FORM / OPERATION_STATION / TEMPLATE_DRIVEN
- page-spec JSON（必须存在，由 prototype-scan 输出）
- 文件路径：`src/views/[域]/[模块]/[子模块]/[kebab-case-目录名]/`
- pages.ts 注册名：`["kebab-目录名", "中文名"]`
- 服务缩写、资源名（CamelCase）

> **模式 0 快捷路径**：当用户直接口述需求（如"帮我生成一个客户管理页面"）而未提供 page-spec JSON 时，AI 内部自动调用 prototype-scan 模式 0 构建 page-spec JSON，然后继续执行代码生成，无需用户提供任何文件。

## 生成产物（默认 4 文件）

```
src/views/[域]/[模块]/[子模块]/[kebab-case-目录名]/
├── index.vue     ← 页面入口（纯模板 + 解构）
├── data.ts       ← 业务逻辑（AbstractPageQueryHook 类 / 直接导出 ref+函数）
├── index.scss    ← 页面样式
└── api.md        ← 接口约定（按 api-contract Skill 模板生成）
```

附加输出：

- `pages.ts` 注册片段
- **`reports/SYS_MENU_INFO.md`** — 集中式菜单配置，**追加写入**
- `mock/[页面kebab-name].ts`（vite-plugin-mock 自动加载，URL 和字段与 api.md 一致，URL 必须带 `/dev-api` 前缀）

## data.ts 基类模式

| 页面模式 | data.ts 模式 |
|---------|-------------|
| LIST / MASTER_DETAIL / TREE_LIST | `class extends AbstractPageQueryHook`，配置 `queryDef()` / `toolbarDef()` / `columnsDef()` |
| DETAIL_TABS | 直接导出 reactive + ref |
| FORM_ROUTE | useXxx composable |
| CHANGE_HISTORY | composable + mock |
| RECORD_FORM | 直接 ref + 函数 |
| OPERATION_STATION | 多个 createXxxPage |
| TEMPLATE_DRIVEN | 仅 config 对象 |

## 必须遵守的规则

1. index.vue 只有模板 + `createPage()` 解构 + `onMounted`，不写业务逻辑（例外：DETAIL_TABS / FORM_ROUTE / CHANGE_HISTORY 的 index.vue 可包含表单状态管理）
2. 最外层 class：`app-container app-page-container`
3. 样式用 `@import "./index.scss"`
4. API 用 `getAction` / `postAction` from `@jhlc/common-core/src/api/action`
5. 字典字段用 `logicType: BusLogicDataType.dict, logicValue: "dictCode"`
6. 同时生成 api.md（基于 api-contract Skill 模板）
7. 提供 pages.ts 注册片段
8. 同时在 `mock/` 目录下生成对应的 mock 文件（URL 与 api.md 一致，带 `/dev-api` 前缀）
9. **查询字段顺序**：`queryDef()` 中字段顺序必须与 page-spec `query` 数组顺序严格一致
10. **表格列顺序**：`columnsDef()` 中列顺序必须与 page-spec `columns` 数组顺序严格一致
11. **按钮顺序与颜色**：`toolbarDef()` 中按钮顺序和 `name` 必须与 page-spec `toolbar` 数组严格一致（`primary`=蓝底, `danger`=红色, `warning`=橙色, `default`=灰色; `plain: true`=线框）
12. **操作列按钮**：`columnsDef()` 操作列必须与 page-spec `operations` **严格一一对应**，不可遗漏也**不可自行添加**
13. **可点击列（蓝色链接列）**：原型中蓝色凸显的列（如编码、编号类字段）必须实现为可点击链接，使用 `defaultSlot` + `h()` 渲染蓝色链接样式
14. **按钮必须可交互**：所有按钮的 `onClick` 必须有真实处理逻辑，禁止空函数 `() => {}`；未知交互时使用 `ElMessage.info("需业务确认交互逻辑")` 作为占位

## 按钮颜色映射

| 原型颜色 | type 值 |
|---------|---------|
| 蓝底填充 | `primary` |
| 线框/白底 | `plain` |
| 红色 | `danger` |
| 橙色 | `warning` |
| 灰色/默认 | `default` |

## 禁止事项（严格遵守）

1. **❌ 禁止手写弹窗** — 必须使用 `c_formModal` 组件，通过 `modalConfig` 配置驱动（例外：纯只读详情弹窗可用 `jh-dialog` + `BaseForm :disabled="true"`）
2. **❌ 禁止原生 Element Plus 组件** — 弹窗中必须使用 jh-select / jh-date / jh-user-picker 等平台组件（通过 `BaseFormItemDesc` 的 `component` 属性配置）
3. **❌ 禁止 BaseToolbar 使用 slot** — BaseToolbar 不支持任何 slot，Tab/视角切换等额外 UI 必须放在 BaseToolbar **外部**
4. **❌ 禁止 el-radio-group 做 Tab 切换** — 必须使用 `el-tabs`（参考 `mmwr-steel-stripping-operations`）
5. **❌ 禁止 Mock 端点只返回成功不修改数据** — mock 文件中每个端点的 `response` 必须实际修改 `dataPool`
6. **❌ 禁止遗留未使用的 import** — data.ts 中不要导入未使用的模块
7. **❌ 禁止操作列自编按钮** — 操作列必须与原型严格一致，不可凭空添加
8. **❌ 状态列必须 `fixed: "right"` + ElTag 色块渲染** — 启用/审批/核实等状态类列必须固定右侧并用彩色标签渲染，不可纯文本显示
9. **❌ 禁止平台组件遗漏 `label=""`** — jh-select / jh-date / jh-file-upload 在 el-form-item 内必须传 `label=""` 隐藏自身标签
10. **❌ 禁止表单控件宽度不统一** — 用 `:deep()` 统一设为 `width: 100%`
11. **❌ 禁止表单页无滚动** — 独立路由表单页内容超出视口时必须可滚动，`.app-page-container` 须设 `overflow-y: auto`
12. **❌ 禁止内联 style 散落** — 所有样式统一写在 `index.scss` 中
13. **❌ 禁止按钮文字自行改动** — 操作列按钮 `label` 必须与原型严格一致（如"作废"不可改成"删除"）

## c_formModal 使用规范

所有标准 CRUD 弹窗**必须使用** `src/components/local/c_formModal/` 通用表单弹窗组件（支持 add/edit/view 三模式），不可重复编写。

```typescript
// data.ts 中定义 modalConfig
import type { BaseFormItemDesc } from "@jhlc/common-core/src/components/form/common/type";

export const modalConfig = {
  titlePrefix: "客户",       // 标题前缀：新增客户 / 编辑客户 / 查看客户
  width: "850px",
  columns: 2,
  labelWidth: "110px",
  formItems: [
    { name: "code", label: "编码", disabled: true, placeholder: "系统自动生成" },
    { name: "name", label: "名称", required: true, placeholder: "请输入" },
    {
      name: "type",
      label: "类型",
      component: () => ({ tag: "jh-select", items: OPTS.type })
    }
  ] as BaseFormItemDesc<any>[],
  api: {
    getById: API_CONFIG.getById,
    save: API_CONFIG.save,
    update: API_CONFIG.update
  }
};
```

```vue
<!-- index.vue 中使用 -->
<c_formModal ref="editModalRef" v-bind="modalConfig" @ok="select" />
```

调用方式：
- 新增：`_editModalRef?.value?.open()`
- 编辑：`_editModalRef?.value?.edit(row.id)`
- 查看：`_editModalRef?.value?.view(row.id)`

## FORM_ROUTE 路由导航规则

| 场景 | 方式 | 原因 |
|------|------|------|
| 菜单页 → 隐藏页（如列表→表单） | `envConfig()?.router` + `location.href` | 需要父壳刷新菜单高亮 |
| 隐藏页 → 隐藏页（如表单→变更历史） | `envConfig()?.router` + `location.href` | `router.push()` 跳过 shell 导致报错 |
| 返回上一页 | `useRouter().back()` | 任何页面均可用 |

路由路径命名规则：
- 目录名 `mmwr-customer-apply-add-form` → 路由 `/aiflow/mmwrCustomerApplyAddForm`
- 规则：`/[子模块名-camelCase]/[完整页面目录名转PascalCase]`

## 支持 9 种页面模板

| 模板文件 | 模式 | 说明 |
|---------|------|------|
| TPL-LIST.md | LIST | 查询 + 工具栏 + 表格 + 分页 |
| TPL-FORM-ROUTE.md | FORM_ROUTE | 复杂表单独立路由 |
| TPL-MASTER-DETAIL.md | MASTER_DETAIL | jh-drag-row 上下分栏主从表 |
| TPL-TREE-LIST.md | TREE_LIST | C_Splitter 左树 + 右列表 |
| TPL-DETAIL-TABS.md | DETAIL_TABS | 上方表单 + 下方 Tab 子表 |
| TPL-CHANGE-HISTORY.md | CHANGE_HISTORY | 左变更时间线 + 右字段比对 |
| TPL-RECORD-FORM.md | RECORD_FORM | 查询 + 表单录入（无分页） |
| TPL-OPERATION-STATION.md | OPERATION_STATION | 待处理 + 已处理联动操作 |
| TPL-DRIVEN.md | TEMPLATE_DRIVEN | 配置驱动模板识别参考 |

> 详见 [9 种模板总览](/frontend/pc/skills/page-templates)

## 生成后依赖自检

代码生成完成后，需检查项目是否安装了以下依赖：

```bash
# 核心依赖（项目大概率已有）
vue / vue-router / element-plus / @jhlc/common-core

# 易遗漏的依赖
pnpm add -D mockjs vite-plugin-mock    # Mock 数据支持
pnpm add lodash-es                      # RECORD_FORM 模板用到 debounce
pnpm add xlsx                           # 仅导出/导入功能需要
```

同时检查 `vite.config.ts` 是否已注册 `viteMockServe`、`mock/` 目录是否存在。

---

## 标准对话示例

### 示例 1：单页生成

```
你：帮我生成"炉次批次查询"页面，LIST 类型，输出到 src/views/ms/heat-batch-query/。
AI：[Pre-flight] 完成，已读取：
    ├─ page-spec → reports/PROTOTYPE_SCAN_ms_xxx.md 第 3 项
    ├─ 模板 → templates/LIST.md
    ├─ api.md → src/views/ms/heat-batch-query/api.md
    ✅ 已生成：
       src/views/ms/heat-batch-query/
       ├─ index.vue     (LIST + AGGrid)
       ├─ data.ts       (columns / queryItems / state)
       ├─ index.scss    (空文件，备扩展)
       └─ mock/ms-heat-batch-query.ts
    ✅ pages.ts 已注册：["ms-heat-batch-query", "炉次批次查询"]
```

### 示例 2：批量流水线

```
你：基于原型扫描报告和 api.md，批量生成销售域所有页面。
AI：[Pre-flight] 批量模式，共 9 页，按页面清单顺序生成...
    ① mmwr-order-list      ✅
    ② mmwr-order-detail    ✅
    ...
    耗时约 8 分钟，全部完成。
    ⚠ 以下 2 页的 api.md 状态仍为 🟡（待确认），代码使用了字段名建议值，待后端对齐后请更新 data.ts。
```

## 常见踩坑

| 现象 | 原因 | 解法 |
|------|------|------|
| 生成的 data.ts 里没有分页 | 模板匹配成 DETAIL 而非 LIST | 明确指定类型 "LIST 类型，带分页" |
| columns 顺序和原型不一致 | prototype-scan 没严格按原型列顺序提取 | 重新 prototype-scan，或手动调整 page-spec |
| 生成后 ESLint 报错 | 模板有遗留 TODO 或字段名不符合命名规范 | 运行 `pnpm lint --fix` 再让 AI "修复剩余 ESLint 问题" |
| mock 数据全是"string"/"number" | AI 没有接收到足够的字段语义 | 在 page-spec 或 api.md 里补充字段枚举值描述 |

## FAQ

**Q：page-spec JSON 必须先有才能生成？**  
A：需要原型或需求输入，但可以通过 prototype-scan 或直接口述需求来生成 page-spec。

**Q：生成后能修改吗？**  
A：生成的文件是普通代码文件，可随意修改。修改后再运行 convention-audit 自检。

**Q：MASTER_DETAIL / RECORD_FORM 等复杂模板支持吗？**  
A：支持，在触发时说明模板类型即可。复杂类型生成时间约 2-3 分钟/页。
