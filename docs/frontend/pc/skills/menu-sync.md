# Skill ④：菜单同步（menu-sync）

将前端 `reports/SYS_MENU_INFO.md` 中定义的菜单结构，自动同步到指定环境的数据库（通过后端管理 API 创建菜单记录）。

> **核心价值**：前端开发完成页面后，不需要手动登录管理后台一条条录入菜单，AI 自动完成同步，保证路由与菜单配置完全一致。

## 触发关键词

`菜单同步` / `同步菜单` / `menu-sync` / `注册菜单` / `把菜单同步上去` / `帮我创建菜单` / `补菜单`

## 配置文件（统一 env.local.json）

菜单同步与字典同步共用同一个配置文件：

```
.github/skills/sync/env.local.json   ← 统一配置，不区分 Skill
```

```json
{
  "gatewayPath": "http://10.xx.xx.xx:8080",
  "sysAppNo": "应用编码（如 JH_AGILE）",
  "token": "Bearer eyJhbGciOiJSUzI1Ni...",
  "menu": {
    "parentMenuId": "父级菜单ID（数字字符串）"
  },
  "dict": {
    "moduleId": "字典模块ID"
  }
}
```

> ⚠️ 该文件已加入 `.gitignore`，**不可提交到仓库**（含 token、IP 等敏感信息）。

### 向后兼容

如果项目中仍有旧格式配置（`.github/skills/menu-sync/env/env.local.json`），仍可读取，但建议迁移到统一格式。

## 数据来源

| 信息 | 来源 |
|------|------|
| 菜单名称 / 路由路径 / 组件路径 / 权限标识 | `reports/SYS_MENU_INFO.md` |
| 父级菜单 ID | `env.local.json` > `menu.parentMenuId` |
| 网关地址 / Token | `env.local.json` |

## 执行步骤

### 步骤 1：查询子菜单（确认父级存在，防止重复）

```http
GET {gatewayPath}/uac/sysMenu/getChildrenMenuList/{parentMenuId}
Authorization: {token}
```

响应：
```json
{
  "code": 2000,
  "message": "操作成功",
  "data": [
    { "menuId": "1001", "menuName": "客户管理", "routerPath": "customerManage" }
  ]
}
```

> 如已存在同名菜单或同路由路径，跳过不重复创建，并输出提示。

### 步骤 2：批量创建菜单

对每条 `reports/SYS_MENU_INFO.md` 中的菜单记录，发送创建请求：

```http
POST {gatewayPath}/uac/sysMenu/save
Authorization: {token}
Content-Type: application/json

{
  "sysAppNo": "{sysAppNo}",
  "menuName": "客户管理",
  "parentId": "{parentMenuId}",
  "routerPath": "/aiflow/customerManage",
  "component": "aiflow/mmwr-customer-archive/index",
  "menuType": "1",
  "permission": "mmwr:mmwrCustomerArchive:list",
  "isFrame": "1",
  "visible": "0",
  "status": "0",
  "orderNum": 1
}
```

响应成功：
```json
{ "code": 2000, "message": "操作成功", "data": true }
```

> ⚠️ 注意：成功码是 `2000`，**不是 200**。

## reports/SYS_MENU_INFO.md 格式说明

AI 在 page-codegen 时生成此文件（追加写入），格式如下：

```markdown
## 客户档案管理

| 字段 | 值 |
|------|-----|
| menuName | 客户档案管理 |
| routerPath | /aiflow/mmwrCustomerArchive |
| component | aiflow/mmwr-customer-archive/index |
| permission | mmwr:mmwrCustomerArchive:list |
| parentMenuId | （从 env.local.json 读取） |
| visible | 0（正常显示） |
| orderNum | 1 |
```

## 权限标识格式

```
{服务缩写}:{资源名CamelCase}:list
```

示例：
- `mmwr:mmwrCustomerArchive:list`
- `pm:omptMillPlanOrder:list`
- `sale:saleOrder:list`

## 隐藏菜单规则

以下情况菜单 `visible` 设为 `"1"`（不在导航栏显示）：

| 场景 | 说明 |
|------|------|
| FORM_ROUTE 子页面（新增/编辑/详情） | 通过主页面跳转，不需要导航直接访问 |
| 变更历史页 | 通过主页面跳转 |
| 数据导入向导 | 通过按钮触发，非独立菜单 |

## 执行输出

```
✅ 菜单同步完成
──────────────────────────────────────────────
新增：5 条
跳过（已存在）：1 条
失败：0 条
──────────────────────────────────────────────
📌 已同步到：{gatewayPath}
   父级菜单：{parentMenuId}
```

| 数据 | 来源 | 说明 |
|------|------|------|
| 菜单名称、路径、组件、权限、排序等 | `SYS_MENU_INFO.md` | 原型/详设阶段自动生成，AI 直接读取 |
| `parentMenuNameCode` | API 自动查询 | AI 调 children 接口获取，无需手填 |
| **gatewayPath、parentMenuId、sysAppNo、token** | `env.local.json` | 每套环境不同，唯一需要手动维护的 4 个值 |

## 配置（只需填 4 个字段）

文件路径：`.github/skills/menu-sync/env/env.local.json`（已加入 `.gitignore`，本地维护）

```json
{
  "gatewayPath": "http://网关地址:端口",
  "parentMenuId": "父级菜单ID",
  "sysAppNo": "应用编码",
  "token": "Bearer Token"
}
```

> 字段获取方式详见 `env/guide.md`

## 使用步骤

1. **首次**：按 `env/guide.md` 填写 `env.local.json` 的 4 个字段
2. **之后**：直接对 AI 说「帮我创建菜单」/「同步菜单」/「补菜单」
3. AI 自动执行：读 `SYS_MENU_INFO.md` -> 读 `env.local.json` -> 查父级已有子节点 -> 逐条对比去重 -> 调 `/system/menu/save` -> 输出 created/skipped 结果表
4. **全程无需手动执行任何命令**

## 方案演进

| 阶段 | 方案 | 状态 | 说明 |
|------|------|------|------|
| **Phase 1** | AI 调用现有 API 逐条创建 | 当前可用 | 利用 `/system/menu/save` 接口 |
| **Phase 2** | 前端推送脚本 `pnpm run menu:push` | 待后端接口 | 需后端提供 `POST /system/menu/batchPush` upsert 接口 |

## 创建效果

AI 自动完成以下操作：

1. 读取 `SYS_MENU_INFO.md` 中所有菜单条目
2. 读取 `env.local.json` 获取网关地址和认证信息
3. 查询父级菜单下已有子节点，避免重复创建
4. 逐条调用 `/system/menu/save` 接口创建菜单
5. 输出结果表（created / skipped）

> 也可以按 `SYS_MENU_INFO.md` 表格在系统管理后台手动创建菜单，效果等价。

---

## 标准对话示例

### 示例 1：新项目首次同步

```
你：项目上线前把销售域所有菜单都同步到后端。
AI：[Pre-flight] 已读取 env.local.json
    父级菜单：销售管理 (id: mmwr-sale)
    待创建：9 条菜单
    created: 9 / skipped: 0 / failed: 0
    已更新 reports/SYS_MENU_INFO.md
```

### 示例 2：增量同步

```
你：我刚加了两个新页面，帮我把 pages.ts 新增的菜单同步上去。
AI：[Pre-flight] 检测到 SYS_MENU_INFO.md 与线上差异：
    新增 2 条（系统未存在）：mmwr-sales-forecast / mmwr-customer-tag
    已跳过 7 条（已存在）
    已写入并更新 SYS_MENU_INFO.md
```

## 常见踩坑

| 现象 | 原因 | 解法 |
|------|------|------|
| token 过期报 401 | env.local.json 里的 token 超时 | 重新登录系统，复制最新 token 到 env.local.json |
| 菜单创建了但路由打不开 | parentMenuId 挂到了错误节点 | 检查 env.local.json 的 parentMenuId，或在系统后台确认父节点 ID |
| 重复跑两次创建了重复菜单 | AI 没有先 pull 基线就直接 push | 先说"刷新菜单基线"再"同步菜单" |

## FAQ

**Q：手动在系统后台创建菜单和用 menu-sync 有什么区别？**  
A：功能等价，menu-sync 的优势是批量（一次处理 10+ 菜单）且自动维护 SYS_MENU_INFO.md 基线文件供后续对比。

**Q：env.local.json 需要提交到 Git 吗？**  
A：不需要，已在 `.gitignore` 里排除，包含 token 等敏感信息。

**Q：actions（功能按钮权限）也能同步吗？**  
A：menu-sync 只负责路由菜单，功能按钮权限由 `permission-sync` Skill ⑥ 处理。
