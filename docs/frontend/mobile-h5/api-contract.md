# ③ 接口约定 api-contract

> 触发词：`生成接口` / `接口约定` / `生成 api.md`

基于 page-spec.json 或页面需求描述，生成 TypeScript 接口定义文件。

---

## 输入

- `page-spec.json` 或页面需求描述

## 输出

- `src/api/{module}.ts` — 前端接口文件

---

## 规范约束

| 约束 | 说明 |
|---|---|
| HTTP 工具 | `import { get, post, put, del, toast } from '@/utils/http'` |
| 文件位置 | `src/api/{module}.ts` |
| 响应格式 | `{ code: number, data: T, msg: string }` |

### 命名规则

| 操作 | 命名 | 示例 |
|---|---|---|
| 查询列表 | `get{Module}List` | `getCustomerList` |
| 查看详情 | `get{Module}Detail` | `getCustomerDetail` |
| 新增 | `add{Module}` | `addCustomer` |
| 修改 | `update{Module}` | `updateCustomer` |
| 删除 | `delete{Module}` | `deleteCustomer` |

---

## 生成模板

```ts
import { get, post, put, del, toast } from '@/utils/http';

/** 获取{模块}列表 */
export const get{Module}List = (params?: object) =>
    get('/{module}/list', params);

/** 获取{模块}详情 */
export const get{Module}Detail = (id: string) =>
    get(`/{module}/detail/${id}`);

/** 新增{模块} */
export const add{Module} = (data: object) =>
    post('/{module}/add', data, toast('新增成功'));

/** 修改{模块} */
export const update{Module} = (data: object) =>
    put('/{module}/update', data, toast('修改成功'));

/** 删除{模块} */
export const delete{Module} = (id: string) =>
    del(`/{module}/delete/${id}`, {}, toast('删除成功'));
```

---

## 执行步骤

1. 根据 page-spec 确定模块名（kebab-case 文件名，PascalCase 函数名）
2. 生成 API 文件
3. 检查：每个 API 必须有对应 Mock 端点

---

## 上下游

- 上游：[② 接口规格](./api-spec)
- 下游：[④ 页面代码生成](./page-codegen)
