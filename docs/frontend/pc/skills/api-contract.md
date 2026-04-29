# Skill ②：接口约定（api-contract）

基于《页面清单》为每个页面生成 `api.md` 文件，放在**页面目录下**（和 index.vue 同级）。

**双重作用：**

1. **前端** — data.ts 中 `API_CONFIG` 的 URL 和字段名直接基于 api.md
2. **后端** — 拿到 api.md 直接出接口（Controller + Service + Entity），字段名一致，联调零成本

## URL 命名规范

```
/[服务缩写]/[资源名CamelCase]/[操作]
```

| 服务缩写 | 含义 | 示例 |
|---------|------|------|
| pm | 生产管理 | `/pm/omptMillPlanOrder/list` |
| mmwr | 精整作业 | `/mmwr/mmwrTechFinish/queryTechList` |
| mmsm | 炼钢管理 | `/mmsm/mmsmRsltLadleUse/list` |
| sale | 销售管理 | `/sale/saleOrder/list` |
| hrms | 人力资源 | `/hrms/hrmsEmployee/list` |
| base | 基础数据 | `/base/cmUserGroup/list` |

## 标准操作集

| 操作 | 方法 | URL 后缀 | 说明 |
|------|------|---------|------|
| 分页列表 | POST | `/list` | 基类 `super({ url: { list } })` 自动调用 |
| 单条查询 | GET | `/getById?id=xxx` | `getAction(API_CONFIG.getById, { id })` |
| 新增 | POST | `/save` | `postAction(API_CONFIG.save, formData)` |
| 编辑 | POST | `/update` | `postAction(API_CONFIG.update, formData)` |
| 删除 | POST | `/remove` | 基类 `super({ url: { remove } })` + `this.remove(id)` |
| 导出 | GET | `/export` | `getAction(API_CONFIG.export, params)` |

## 业务操作命名规范

非标准 CRUD 操作按以下约定命名，URL 后缀使用**动词原形**（camelCase）：

| 操作 | 方法 | URL 后缀 | 请求说明 |
|------|------|---------|---------|
| 提交审批 | POST | `/submit` | `{ id }` 或 `{ ids: [] }` |
| 审批通过 | POST | `/approve` | `{ id, opinion? }` |
| 审批驳回 | POST | `/reject` | `{ id, opinion }` |
| 撤回 | POST | `/withdraw` | `{ id }` 撤回已提交的单据 |
| 启用/禁用 | POST | `/changeStatus` | `{ id, status }` |
| 转化 | POST | `/convert` | `{ id }` 临时→正式（如临时客户→正式） |
| 下发 | POST | `/release` | `{ id }` 计划/工单下发执行 |
| 关闭 | POST | `/close` | `{ id }` 关闭订单/计划 |
| 作废 | POST | `/cancel` | `{ id }` 作废单据 |
| 批量操作 | POST | `/batchXxx` | 如 `/batchSubmit`、`/batchRemove` |
| 子表查询 | POST | `/queryXxxList` | 如 `/queryDetailList`，主从表场景 |

> 命名原则：`/[服务缩写]/[资源名]/[动作]`，动作用英文动词原形，不用中文拼音，不加 `do` / `handle` 前缀。

## 统一响应结构（基于真实后端契约）

> ⚠️ **重要**：本项目后端响应外壳为 `{ code, message, data }`（**非 `result`**），成功码为 **`2000`**（**非 200**）。

### 1. 分页查询响应

```json
{
  "code": 2000,
  "message": "操作成功",
  "data": {
    "records": [{ /* Entity 字段 */ }],
    "total": 100,
    "current": 1,
    "size": 20,
    "pages": 5,
    "countId": null,
    "maxLimit": null,
    "orders": [],
    "searchCount": true
  }
}
```

| data 字段 | 类型 | 说明 |
|-----------|------|------|
| `records` | array | 当前页数据列表 |
| `total` | number | 总记录数 |
| `current` | number | 当前页码 |
| `size` | number | 每页条数 |
| `pages` | number | 总页数 |
| `countId` | any | MyBatis-Plus 分页计数 ID（前端忽略） |
| `maxLimit` | any | 最大单页限制（前端忽略） |
| `orders` | array | 排序条件回传（前端忽略） |
| `searchCount` | boolean | 是否执行总数查询（前端忽略） |

> 前端 `BaseTable` / `AbstractPageQueryHook` 已自动适配：取 `data.records` 渲染、`data.total` 设分页。无需在 data.ts 中处理。

### 2. 单条 / 非分页查询响应

```json
{ "code": 2000, "message": "操作成功", "data": { /* Entity 单对象 */ } }
```

### 3. 增删改响应

```json
{ "code": 2000, "message": "操作成功", "data": true }
```

### 4. 失败响应

```json
{ "code": 4001, "message": "参数缺失：customerName 不能为空", "data": null }
```

| code 范围 | 含义 |
|-----------|------|
| `2000` | 成功 |
| `4xxx` | 客户端错误（参数/权限/校验） |
| `5xxx` | 服务端错误 |
| `401` / `403` | 网关层未登录 / 无权限（统一拦截） |

> 业务代码**不需要**关心 `code` 判断，`request.ts` 拦截器统一处理：非 2000 自动 `Promise.reject` + Toast 提示。业务代码 `.then()` 拿到的就是 `data` 字段内容。

## 字段命名

| 端 | 规范 | 说明 |
|----|------|------|
| 前端 | `camelCase` | 所有请求/响应字段名 |
| 后端 | `snake_case` | 数据库字段，Jackson 自动转驼峰 |

## 生成产物：api.md 模板

每个页面目录下生成一个 `api.md`，包含：

```markdown
# 接口约定 - [页面中文名]

> 页面路径：`src/views/[域]/[模块]/[子模块]/[目录]/`
> 服务缩写：[pm / mmwr / sale / ...]
> 资源名：[camelCase 实体名]
> 状态：🟡 待后端确认

---

## API_CONFIG

```typescript
export const API_CONFIG = {
  list: "/[服务缩写]/[资源名]/list",
  remove: "/[服务缩写]/[资源名]/remove",
  getById: "/[服务缩写]/[资源名]/getById",
  save: "/[服务缩写]/[资源名]/save",
  update: "/[服务缩写]/[资源名]/update",
  export: "/[服务缩写]/[资源名]/export",
} as const;
```

---

## 实体定义

> 字段名与 data.ts 中 queryDef/columnsDef 使用的字段名**完全一致**

| 字段名 | 类型 | 说明 | 必填 | 字典(logicValue) | 备注 |
|--------|------|------|------|-----------------|------|
| id | string | 主键 | 自动 | - | 后端生成 |
| [field1] | string | [说明] | ✅ | - | |
| [statusField] | string | [状态] | ✅ | [dictCode] | 前端 logicValue 对应 |
| [dateField] | string | [日期] | ❌ | - | YYYY-MM-DD |
| createTime | string | 创建时间 | 自动 | - | YYYY-MM-DD HH:mm:ss |

---

## 接口清单

### 1. 分页查询
```
POST /[服务缩写]/[资源名]/list
```
**响应外壳**：`{ code: 2000, message, data: { records, total, current, size, pages, ... } }`

### 2. 详情查询
```
GET /[服务缩写]/[资源名]/getById?id=xxx
```
**响应外壳**：`{ code: 2000, message, data: {...} }`

### 3. 新增 / 编辑 / 删除
（省略，按标准操作集）

---

## 数据字典

| dictCode(logicValue) | 用途 | 出现位置 |
|---------------------|------|---------|
| [dictCode] | [说明] | queryDef / columnsDef / form |
```

## 联调注意

1. **响应外壳**：`{ code, message, data }`，成功 `code: 2000`（非 200，非 result）
2. 前端字段全部 camelCase，后端 JSON 序列化输出 camelCase
3. 时间字段统一 `YYYY-MM-DD HH:mm:ss`
4. 大数字 ID 后端转字符串（雪花 ID 超过 JS Number 精度）
5. 分页参数前端传 `current` / `size`（基类自动处理），后端响应 `data.records` / `data.total`
6. 枚举字段前端传 value，后端可返回 `[field]Label` 辅助展示，或前端自行通过 `logicValue` 字典翻译
7. 业务代码 `.then(res => res)` 拿到的就是 `data` 字段（拦截器已剥外壳）

## 状态标记

- 🟡 待后端确认 — 刚生成
- 🟢 已确认 — 双方对齐，可编码
- 🔴 有变更 — 需双方同步
