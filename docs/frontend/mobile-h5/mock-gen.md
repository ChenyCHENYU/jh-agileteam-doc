# ⑥ Mock 生成 mock-gen

> 触发词：`生成 Mock` / `补充模拟数据` / `生成测试数据`

为接口约定文件自动生成配套的 Mock 数据，**双产物**：data.ts 本地常量 + vite-plugin-mock 端点。

---

## 输入

`data.ts` 中的类型定义（interface）

---

## 产物 A — data.ts 本地常量

在 `data.ts` 末尾生成 `MOCK_XXX` 常量数组，用于开发时页面预览：

```ts
export const MOCK_CUSTOMERS: Customer[] = [
    {
        id: 1,
        code: 'CUS-10000001',
        name: '杭州钢铁有限公司',
        category: 'hot_rolled',
        conversionStatus: 'converted',
        contactName: '张三',
        contactPhone: '13800138001',
        salesPerson: '李四',
        creator: '王五',
        createTime: '2024-01-15 09:30:00',
        lastFollower: '李四',
        lastFollowTime: '2024-03-20 14:00:00',
    },
    // ...6-10 条，轮流覆盖不同枚举值
];
```

---

## 产物 B — vite-plugin-mock 端点

文件位置：`mock/{module}.ts`（扁平化，不嵌套子目录）

```ts
import type { MockMethod } from 'vite-plugin-mock';
import type { requestParams } from './_util';
import { resultError, resultPageSuccess, resultSuccess } from './_util';

// ① 数据池
const dataPool: Customer[] = [
    { id: 1, code: 'CUS-10000001', name: '杭州钢铁有限公司', /* ...全部字段 */ },
    // ...6-10 条
];

export default [
    // ② 分页列表
    {
        url: '/api/customer/list',
        timeout: 300,
        method: 'get',
        response: ({ query }: requestParams) => {
            const { page = 1, pageSize = 10 } = query;
            return resultPageSuccess(Number(page), Number(pageSize), dataPool);
        },
    },
    // ③ 详情
    {
        url: '/api/customer/detail',
        timeout: 200,
        method: 'get',
        response: ({ query }: requestParams) => {
            const item = dataPool.find(i => i.id === Number(query.id));
            return item ? resultSuccess(item) : resultError('数据不存在');
        },
    },
    // ④ 新增
    {
        url: '/api/customer/add',
        timeout: 300,
        method: 'post',
        response: ({ body }: requestParams) => {
            const newItem = { ...body, id: dataPool.length + 1 };
            dataPool.push(newItem);
            return resultSuccess(newItem);
        },
    },
    // ⑤ 修改
    {
        url: '/api/customer/update',
        timeout: 300,
        method: 'put',
        response: ({ body }: requestParams) => {
            const index = dataPool.findIndex(i => i.id === body.id);
            if (index === -1) return resultError('数据不存在');
            dataPool[index] = { ...dataPool[index], ...body };
            return resultSuccess(dataPool[index]);
        },
    },
    // ⑥ 删除
    {
        url: '/api/customer/delete',
        timeout: 200,
        method: 'delete',
        response: ({ query }: requestParams) => {
            const index = dataPool.findIndex(i => i.id === Number(query.id));
            if (index === -1) return resultError('数据不存在');
            dataPool.splice(index, 1);
            return resultSuccess(null);
        },
    },
] as MockMethod[];
```

---

## 数据规范

| 规则 | 说明 |
|---|---|
| 数据量 | 6-10 条 |
| 字段覆盖 | 所有 interface 字段必须有值，不可留空 |
| 枚举覆盖 | 状态字段必须覆盖所有枚举值 |
| 时间格式 | `YYYY-MM-DD HH:mm:ss` |
| 编号格式 | 与业务一致（如 `CUS-10000001`、`EQ-2024-001`） |
| 真实感 | 使用合理的中文姓名、公司名、地址等 |

---

## 关键规则

1. 文件顶部必须 `import type { MockMethod } from 'vite-plugin-mock'`
2. 默认导出必须是 `MockMethod[]` 类型数组
3. `url` 路径必须与 `src/api/{module}.ts` 中的接口路径一致
4. 分页接口使用 `resultPageSuccess(page, pageSize, list)`
5. 单条接口使用 `resultSuccess(data)`
6. 错误响应使用 `resultError(message)`
7. 状态变更端点必须修改 `dataPool` 中对应项的状态字段
8. `timeout` 建议 200-500ms，模拟真实网络延迟

---

## 同步要求

- 新增字段时必须同步更新 Mock 数据
- Mock 字段名必须与 interface 定义一致
- 状态映射常量（`xxxMap`）的 key 必须在 Mock 数据中出现
- `src/api/{module}.ts` 每个 API 函数都必须有对应 Mock 端点

---

## 上下游

- 上游：[⑤ 路由注册](./route-register)
- 下游：[⑦ 规范审计](./convention-audit)
