# Skill ⑤：字典同步（dict-sync）

将 `data.ts` 中引用的数据字典（`logicType: BusLogicDataType.dict, logicValue: "DICT_CODE"`）同步到后端字典表，保持本地基线与线上一致。

> **与 menu-sync 的关系**：机制完全对称——同样读取本地基线报告 → 与线上对比 → 补齐差异。  
> 配置直接复用 `skills/sync/env.local.json` 统一配置文件，无需重复填写。

## 触发关键词

`同步字典` / `创建字典` / `刷新字典基线` / `字典对比` / `字典审计` / `拉字典` / `补字典`

## 配置文件（统一 env.local.json）

```json
{
  "gatewayPath": "http://10.xx.xx.xx:8080",
  "sysAppNo": "应用编码",
  "token": "Bearer eyJhbGci...",
  "menu": { "parentMenuId": "父级菜单ID" },
  "dict": {
    "moduleId": "字典模块ID"
  }
}
```

`moduleId` 获取方式：进入低代码平台「数据字典」模块 → 新增一条字典 → DevTools Network → 查找 `moduleId` 字段值。

## 三种工作模式

### 模式 1：pull — 刷新本地基线

**触发词**：`刷新字典基线` / `拉字典`

```http
GET {gatewayPath}/system/business/dict/getDictionaryTreeData
Authorization: Bearer {token}
Sysappno: {sysAppNo}
```

响应结构：
```json
{
  "code": 2000,
  "data": {
    "dictionary": {
      "children": [
        {
          "id": "节点ID",
          "strSn": "字典编码或模块编码",
          "strName": "字典名称",
          "children": [...]
        }
      ]
    }
  }
}
```

叶节点（无 `children`）= 实际字典，取其 `id` 和 `strSn`。

执行结果：解析 `data.dictionary.children`（递归），整理为 `reports/SYS_DICT_INFO.md` 覆盖写入。

---

### 模式 2：push — 推送新增字典（核心模式）

**触发词**：`同步字典` / `创建字典` / `补字典`

#### Step 1：扫描 data.ts 中的字典引用

从用户指定范围扫描所有：
```typescript
logicType: BusLogicDataType.dict, logicValue: "DICT_CODE"
```
收集所有 `logicValue` 值去重，得到「当前用到的字典码集合」。

#### Step 2：与本地基线 + 线上对比（去重双保险）

1. 读取 `reports/SYS_DICT_INFO.md` → 已知字典码（本地已记录）
2. 调用 `getDictionaryTreeData` → 当前线上实际存在的字典码（strSn 列表）
3. 待创建 = 用到的字典码 - 线上已有字典码

> **多人协同说明**：去重通过线上实时查询保证。A 创建了，B 运行时线上已有，自动跳过，不会重复创建。即使极端并发，后端 `strSn` 字段有唯一约束，第二次创建会返回"已存在"，Skill 将其视为成功跳过。

#### Step 3：Pre-flight 输出清单，等待确认

```
📋 待同步字典清单：
  新建：ORDER_STATUS（订单状态）— 含 4 项
  新建：SALES_COMPANY（销售公司）— 含 3 项
  跳过（线上已有）：PRODUCT_SEGMENT

确认执行？(yes/no)
```

#### Step 4：创建字典码

```http
POST {gatewayPath}/system/business/dict/save
Authorization: Bearer {token}
Sysappno: {sysAppNo}
Content-Type: application/json

{
  "strSn": "ORDER_STATUS",
  "strName": "订单状态",
  "moduleId": "{dict.moduleId}",
  "parentId": "{上级分类节点ID}"
}
```

**成功判断**：`response.code === 2000`  
**Token 失效**：`code === 401` → 停止执行，提示用户更新 token

#### Step 5：追加写入 reports/SYS_DICT_INFO.md

新增字典同步完成后追加记录到本地基线文件。

---

### 模式 3：audit — 审计字典使用

**触发词**：`字典对比` / `字典审计`

扫描 data.ts 中引用的所有字典码，对比 `reports/SYS_DICT_INFO.md`（本地基线），输出：

| 状态 | 说明 |
|------|------|
| ✅ 已同步 | 本地基线有记录 |
| ⚠️ 仅本地 | 在基线中有但线上未确认 |
| ❌ 缺失 | 使用了但未在基线记录，需要 push |

## reports/SYS_DICT_INFO.md 格式

```markdown
# 数据字典基线

> 最后更新：{YYYY-MM-DD HH:mm}（dict-sync pull）

## ORDER_STATUS — 订单状态

| logicValue（前端） | 字典值 | 字典项名称 | 备注 |
|-----------------|------|---------|------|
| 0 | 0 | 待提交 | |
| 1 | 1 | 待审批 | |
| 2 | 2 | 已审批 | |
| 3 | 3 | 已驳回 | 终态 |
```

## API 请求规范

所有接口使用以下 Headers：

```
Authorization: Bearer {token}
Sysappno: {sysAppNo}
Content-Type: application/json
```

## 执行输出示例

```
✅ 字典同步完成
──────────────────────────────────────────────
新建字典码：3 个（ORDER_STATUS / SALES_COMPANY / UNIT_TYPE）
跳过（已存在）：2 个（PRODUCT_LINE / CUSTOMER_TYPE）
失败：0 个
──────────────────────────────────────────────
📌 已更新 reports/SYS_DICT_INFO.md
```

---

## 标准对话示例

### 示例 1：同步 data.ts 里引用的字典

```
你：帮我把 src/views/mmwr/ 下所有 data.ts 里引用的字典码同步到后端。
AI：[Pre-flight] 扫描 BusLogicDataType.dict 引用...
    发现 8 个字典码，与线上对比：
    新建：ORDER_STATUS / SALES_COMPANY / UNIT_TYPE（3 个）
    已存在：5 个（跳过）
    ✅ 同步完成，已更新 SYS_DICT_INFO.md
```

### 示例 2：拉取线上字典到本地

```
你：把线上所有字典全部拉到本地基线文件。
AI：[Pre-flight] 模式：pull
    连接 http://10.xx.xx.xx:8080 ...
    共拉取 47 个字典码，已写入 reports/SYS_DICT_INFO.md
    本地基线已更新。
```

## 常见踩坑

| 现象 | 原因 | 解法 |
|------|------|------|
| 同步完但 jh-select 下拉为空 | moduleId 填错，字典挂到了其他模块 | 进低代码平台确认 moduleId，重写 env.local.json |
| 扫描不到字典引用 | data.ts 用了非标写法（如直接传数组） | 统一使用 `logicType: BusLogicDataType.dict, logicValue: "CODE"` |
| 字典码重复创建 | 没有先 pull 基线就 push | 先"刷新字典基线"再"同步字典" |

## FAQ

**Q：dict-sync 和 menu-sync 可以同时跑吗？**  
A：可以但建议顺序执行，先菜单后字典，避免网络并发请求被限流。

**Q：字典项的顺序能控制吗？**  
A：dict-sync 会按 data.ts 里 `options` 数组顺序同步，如需指定排序请在字典项里加 sort 字段。

**Q：能不能只同步某个字典码？**  
A：可以，说"只同步 ORDER_STATUS 这个字典"，AI 会只处理这一个。
