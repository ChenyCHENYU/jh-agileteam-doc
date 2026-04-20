# ② 接口规格 api-spec

> 触发词：`生成接口规格` / `接口字段说明` / `生成 api-spec`

在 `prototype-scan` 之后、`page-codegen` 之前，生成**完整的接口规格文档**。该文档同时服务于**前端开发**和**后端开发**，确保字段定义、接口路径、请求/响应结构三端（前端/后端/Mock）保持一致。

---

## 工作流位置

```
原型/设计稿 → [prototype-scan] → page-spec.json
                                       ↓
                               [api-spec] → api-spec.md（本技能）
                                       ↓
                           ┌───────────┼────────────┐
                           ↓           ↓            ↓
                    [api-contract]  [mock-gen]  [page-codegen]
                    生成前端API代码  生成Mock数据  生成页面代码
```

---

## 输入

- `page-spec.json`（由 prototype-scan 生成）
- 或直接的原型 / 详设文档描述

## 输出

`docs/api-spec/{module}.md` — 接口规格说明文档

---

## 文档模板

### 一、数据实体

```markdown
| 字段名 | 类型 | 必填 | 说明 | 前端展示 | 示例值 |
|--------|------|------|------|---------|--------|
| id | number | — | 主键 | 隐藏 | 1 |
| code | string | — | 编号 | 卡片副标题 | CUS-10000001 |
| name | string | ✅ | 名称 | 卡片主标题 | 杭州钢铁有限公司 |
| category | string | ✅ | 类别 | Tag（categoryMap） | hot_rolled |
| status | string | — | 状态 | Tag（statusMap） | active |
| contactName | string | ✅ | 联系人 | meta 行 | 张三 |
| salesPerson | string | — | 业务员 | meta 行 | 李四 |
| createTime | string | — | 创建时间 | meta 行 | 2024-01-15 09:30:00 |
```

### 二、枚举值定义

```markdown
| 字段 | 枚举值 | 显示文本 | Tag 类型 |
|------|--------|---------|---------|
| category | hot_rolled | 热轧 | primary |
| category | cold_rolled | 冷轧 | success |
| status | active | 活跃 | success |
| status | inactive | 停用 | danger |
| status | pending | 待审核 | warning |
```

### 三、接口列表

| 操作 | 方法 | 路径 | 说明 |
|---|---|---|---|
| 查询列表 | POST | `/api/{module}/list` | 分页查询，支持复杂筛选 |
| 查看详情 | GET | `/api/{module}/detail/{id}` | 单条详情 |
| 新增 | POST | `/api/{module}/add` | Entity 必填字段 |
| 修改 | PUT | `/api/{module}/update` | id + 可编辑字段 |
| 删除 | DELETE | `/api/{module}/delete/{id}` | 按 ID 删除 |
| 状态操作 | PUT | `/api/{module}/{id}/{action}` | 如 `/customer/1/convert` |

### 四、前端映射关系

```markdown
| 页面位置 | 显示内容 | 接口字段 | 渲染方式 |
|---------|---------|---------|---------|
| 卡片主标题 | 客户名称 | name | 纯文本 |
| 卡片副标题 | 编号 | code | 纯文本 |
| 右上角标签 | 类别 | category | VanTag + categoryMap |
| meta 行 | 联系人 | contactName | label:value |
| 搜索框 | 关键字 | keyword | VanField |
| Tab 过滤 | 类别 | category | VanTabs |
```

### 五、状态映射常量

```ts
export const STATUS_MAP: Record<string, { text: string; type: string }> = {
    active: { text: '活跃', type: 'success' },
    inactive: { text: '停用', type: 'danger' },
    pending: { text: '待审核', type: 'warning' },
};
```

---

## 字段类型规范

| 前端类型 | 后端类型 | 说明 |
|---|---|---|
| `string` | `String` | 文本、枚举值 |
| `number` | `Integer/Long` | 整数 ID、数量 |
| `number` | `BigDecimal` | 金额、价格 |
| `boolean` | `Boolean` | 开关状态 |
| `string` | `LocalDateTime` | 时间（`YYYY-MM-DD HH:mm:ss`） |
| `string[]` | `List<String>` | 多选标签 |

---

## 接口路径规范

- 统一前缀：`/api/{module}/`
- 列表：`POST`（支持复杂筛选条件）
- 详情/删除：路径参数 `/{id}`
- 状态操作：`PUT /api/{module}/{id}/{action}`

---

## Mock 数据要求

- 数据量：6-10 条
- 枚举覆盖：每个枚举值至少出现 1 次
- Mock 文件位置：`mock/{module}.ts`
- 使用 `vite-plugin-mock` 的 `MockMethod` 类型

---

## 执行步骤

1. 从 `page-spec.json` 或原型描述中提取所有数据字段
2. 确定每个字段的类型、是否必填、前端展示位置
3. 识别枚举字段，列出所有枚举值和对应的 Tag 渲染方式
4. 按 CRUD 标准模板生成接口列表
5. 生成前端映射关系表（页面位置 → 接口字段 → 渲染方式）
6. 生成 Mock 数据要求说明
7. 输出 `docs/api-spec/{module}.md`

---

## 上下游

- 上游：[① 原型扫描](./prototype-scan)
- 下游：[③ 接口约定](./api-contract) / [④ 页面代码生成](./page-codegen) / [⑥ Mock 生成](./mock-gen)
