# Skill 3：页面代码生成（page-codegen）

基于页面清单 + 原型信息，生成符合项目规范的完整 Vue 3 页面代码。

## 前置检查

生成前需确认以下信息：

- 页面中文名
- 交互模式：LIST / MASTER_DETAIL / TREE_LIST / DETAIL_TABS / FORM_ROUTE / CHANGE_HISTORY / RECORD_FORM / OPERATION_STATION / TEMPLATE_DRIVEN
- page-spec JSON（由 prototype-scan 输出）
- 文件路径：`src/views/[域]/[模块]/[子模块]/[kebab-case-目录名]/`
- pages.ts 注册名：`["kebab-目录名", "中文名"]`
- 服务缩写、资源名（CamelCase）

## 生成产物（默认 4 文件）

```
src/views/[域]/[模块]/[子模块]/[kebab-case-目录名]/
  index.vue     页面入口（纯模板 + 解构）
  data.ts       业务逻辑（AbstractPageQueryHook 类）
  index.scss    页面样式
  api.md        接口约定（按 api-contract Skill 模板生成）
```

附加输出：

- `pages.ts` 注册片段
- `SYS_MENU_INFO.md` — 集中式菜单配置
- `mock/[页面kebab-name].ts` — Mock 数据（vite-plugin-mock 自动加载）

## 必须遵守的规则

### data.ts 基类模式

| 页面模式 | data.ts 模式 |
|---------|-------------|
| LIST / MASTER_DETAIL / TREE_LIST | `class extends AbstractPageQueryHook`，配置 `queryDef()` / `toolbarDef()` / `columnsDef()` |
| DETAIL_TABS | 直接导出 reactive + ref |
| FORM_ROUTE | useXxx composable |
| CHANGE_HISTORY | composable + mock |
| RECORD_FORM | 直接 ref + 函数 |
| OPERATION_STATION | 多个 createXxxPage |

### index.vue 规则

- 只有模板 + `createPage()` 解构 + `onMounted`，不写业务逻辑
- 最外层 class：`app-container app-page-container`
- 样式用 `@import "./index.scss"`

### 字段顺序

- **查询字段**：`queryDef()` 中字段顺序必须与 page-spec `query` 数组严格一致
- **表格列**：`columnsDef()` 中列顺序必须与 page-spec `columns` 数组严格一致
- **按钮**：`toolbarDef()` 中按钮顺序和颜色必须与 page-spec `toolbar` 严格一致
- **操作列**：必须与 page-spec `operations` 数组严格一一对应，不可自行添加

### 按钮颜色映射

| 原型颜色 | type 值 |
|---------|---------|
| 蓝底填充 | `primary` |
| 线框/白底 | `plain` |
| 红色 | `danger` |
| 橙色 | `warning` |
| 灰色/默认 | `default` |

## 禁止事项

1. **禁止手写弹窗** — 必须使用 `c_formModal` 组件，通过 `modalConfig` 配置驱动
2. **禁止原生 Element Plus 组件** — 弹窗中必须使用 jh-select / jh-date / jh-user-picker 等平台组件
3. **禁止 BaseToolbar 使用 slot** — BaseToolbar 不支持任何 slot
4. **禁止 el-radio-group 做 Tab 切换** — 必须使用 `el-tabs`
5. **禁止 Mock 端点只返回成功不修改数据** — mock 的 response 必须实际修改 dataPool
6. **禁止遗留未使用的 import**
7. **禁止操作列自编按钮** — 必须与原型严格一致
8. **状态列必须用 ElTag 渲染彩色标签** — 不可纯文本显示
9. **禁止平台组件遗漏 `label=""`** — jh-select / jh-date 等必须传 `label=""` 隐藏自身标签
10. **禁止表单控件宽度不统一** — 用 `:deep()` 统一 `width: 100%`

## c_formModal 使用规范

所有标准 CRUD 弹窗**必须使用** `src/components/local/c_formModal/` 通用表单弹窗组件（支持 add/edit/view 三模式），不可重复编写。

在 data.ts 中定义 `modalConfig` 配置驱动弹窗表单。

## 支持 9 种页面模板

每种模板对应一个独立的 `TPL-*.md` 文件：

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

> 详见 [9 种模板总览](/skills/frontend/page-templates)

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

同时检查 `vite.config.ts` 是否已注册 `viteMockServe`。
