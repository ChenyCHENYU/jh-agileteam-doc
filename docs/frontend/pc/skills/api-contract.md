# Skill 2：接口约定（api-contract）

基于页面清单为每个页面生成 `api.md` 文件，放在**页面目录下**（和 index.vue 同级）。

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
| 删除 | POST | `/remove` | 基类 `this.remove(id)` |
| 导出 | GET | `/export` | `getAction(API_CONFIG.export, params)` |

## 业务操作命名

非标准 CRUD 操作按以下约定命名：

| 操作 | 方法 | URL 后缀 | 请求说明 |
|------|------|---------|---------|
| 提交审批 | POST | `/submit` | `{ id }` 或 `{ ids: [] }` |
| 审批通过 | POST | `/approve` | `{ id, opinion? }` |
| 审批驳回 | POST | `/reject` | `{ id, opinion }` |
| 撤回 | POST | `/withdraw` | `{ id }` |
| 启用/禁用 | POST | `/changeStatus` | `{ id, status }` |
| 转化 | POST | `/convert` | `{ id }` 临时到正式 |
| 下发 | POST | `/release` | `{ id }` 计划/工单下发 |
| 关闭 | POST | `/close` | `{ id }` |
| 作废 | POST | `/cancel` | `{ id }` |
| 批量操作 | POST | `/batchXxx` | 如 `/batchSubmit` |
| 子表查询 | POST | `/queryXxxList` | 如 `/queryDetailList` |

> 命名原则：`/[服务缩写]/[资源名]/[动作]`，动作用英文动词原形，不用中文拼音。

## 统一响应结构

```json
// 分页查询
{ "code": 200, "result": { "records": [], "total": 100, "current": 1, "size": 20 } }

// 单条查询
{ "code": 200, "result": { /* Entity */ } }

// 增删改
{ "code": 200, "message": "操作成功", "result": true }
```

## 字段命名

| 端 | 规范 | 说明 |
|----|------|------|
| 前端 | `camelCase` | 所有请求/响应字段名 |
| 后端 | `snake_case` | 数据库字段，Jackson 自动转驼峰 |

## 生成产物：api.md

每个页面目录下生成一个 `api.md`，包含：

- `API_CONFIG` 常量定义（URL 集合）
- 实体字段定义表（字段名、类型、必填、字典）
- 各接口的请求/响应说明
- 数据字典汇总

```typescript
export const API_CONFIG = {
  list: "/pm/omptMillPlanOrder/list",
  remove: "/pm/omptMillPlanOrder/remove",
  getById: "/pm/omptMillPlanOrder/getById",
  save: "/pm/omptMillPlanOrder/save",
  update: "/pm/omptMillPlanOrder/update",
  export: "/pm/omptMillPlanOrder/export",
} as const;
```

## 联调注意

1. 前端字段全部 camelCase，后端 JSON 序列化输出 camelCase
2. 时间字段统一 `YYYY-MM-DD HH:mm:ss`
3. 大数字 ID 后端转字符串
4. 分页参数是 `current` / `size`（基类自动处理）
5. 枚举字段前端传 value，后端可返回 `[field]Label` 辅助展示

## 状态标记

- :yellow_circle: 待后端确认 — 刚生成
- :green_circle: 已确认 — 双方对齐，可编码
- :red_circle: 有变更 — 需双方同步
