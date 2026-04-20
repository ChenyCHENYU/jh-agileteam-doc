# Skill 5：规范审计（convention-audit）

以 `copilot-instructions.md` 为唯一规范源头，扫描项目源码，找出不符合规范的文件和写法，输出偏差报告及整改建议。

> **核心理念**：规范是"标准"，代码要对齐标准。不从代码提炼规范，而是用规范审计代码。

## 适用场景

| 场景 | 说明 |
|------|------|
| 新项目导入 wl-skills-kit 后 | 扫描旧代码，输出整改清单，逐步迁移到标准模式 |
| 日常 Code Review 辅助 | AI 比对单文件或目录，快速发现偏差 |
| 项目迁移/升级 | 老项目引入新架构，批量评估改造量 |
| 团队培训 | 新成员提交代码前，用审计验证是否符合规范 |

## 10 项审计维度

### 1. 页面结构审计

每个页面目录必须包含 4 个文件：

```
[kebab-case目录]/
  index.vue    纯模板+解构
  data.ts      AbstractPageQueryHook 类 + API_CONFIG
  index.scss   样式
  api.md       接口约定
```

- 目录名是否 kebab-case
- 是否缺少 data.ts（逻辑写在 index.vue 里）
- 是否缺少 api.md

### 2. data.ts 模式审计

- 是否有 `API_CONFIG` 常量（URL 集中管理）
- 是否继承 `AbstractPageQueryHook`
- 是否通过 `createPage()` 工厂函数导出
- `queryDef()` / `toolbarDef()` / `columnsDef()` 是否齐全
- 字典字段是否使用 `logicType: BusLogicDataType.dict`

### 3. index.vue 模式审计

- `<script setup>` 是否只有 import + createPage 解构 + onMounted
- 是否引用了 BaseQuery / BaseToolbar / BaseTable / jh-pagination 四件套
- 最外层 class 是否为 `app-container app-page-container`

### 4. 命名规范审计

| 位置 | 标准 | 偏差判定 |
|------|------|---------|
| 路由/目录 | kebab-case | 含大写或下划线 |
| 字段名 | camelCase | name 属性含下划线 |
| 全局组件 | `C_PascalCase/` | 非此格式 |
| 局部组件 | `c_camelCase/` | 非此格式 |
| API URL | `/服务缩写/资源名CamelCase/操作` | 含下划线或全小写 |

### 5. 组件使用审计

- 查询区域用 `<BaseQuery>` 而非手写 `<el-form>`
- 工具栏用 `<BaseToolbar>` 而非手写按钮行
- 表格用 `<BaseTable>` 而非裸 `<el-table>`
- 分页用 `<jh-pagination>` 而非 `<el-pagination>`
- 下拉用 `<jh-select>` 而非 `<el-select>`
- 日期用 `<jh-date>` 而非 `<el-date-picker>`

### 6. API 写法审计

- 是否使用 `getAction` / `postAction`（@jhlc/common-core）
- 是否禁止直接用 axios
- URL 是否集中在 `API_CONFIG` 中

### 7. 样式规范审计

- 使用 `:deep()` 而非 `::v-deep` / `/deep/`
- 页面样式写在 `index.scss` 中（非行内 style）

### 8. 状态管理审计

- 使用 Pinia 而非 Vuex
- Store 是否从主应用远程加载（微前端场景）

### 9. 弹窗/组件提取审计

- 2+ 页面复用的弹窗是否提取到 `src/components/local/c_xxxModal/`
- 页面私有弹窗是否只在 c_modal 无法满足时才内联

### 10. 路由导航审计（微前端）

- 前进导航使用 `location.href`（而非 `router.push()`）
- 返回使用 `useRouter().back()`

## 执行步骤

1. **确定审计范围** — 全量 / 模块 / 单页
2. **读取规范基线** — `.github/copilot-instructions.md`
3. **扫描源码** — 按页面目录逐个扫描文件结构、data.ts、index.vue、index.scss
4. **输出偏差报告** — 分严重/轻微/合规三级，含具体整改建议
5. **按需生成整改代码** — 对偏差页面逐个生成合规代码

## 偏差严重度

| 级别 | 定义 | 示例 |
|------|------|------|
| :red_circle: 严重 | 架构性违反，必须整改 | 不用 AbstractPageQueryHook、直接用 axios |
| :yellow_circle: 轻微 | 风格不统一，建议整改 | 目录名用 camelCase、缺少 api.md |
| :green_circle: 合规 | 完全符合规范 | 无需改动 |

## 注意事项

1. **规范不可协商** — 旧代码不合规就是不合规，不会因为"一直这么写"就放行
2. **AI 生成代码必须合规** — 如出现偏差是 Skill 模板的 bug，需反馈修复
3. **规范演进** — 调整规范时更新 `copilot-instructions.md`（唯一源头），然后重新审计
