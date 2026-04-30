# ⑥ 权限同步（permission-sync）

> `@agile-team/wl-skills-kit` v2.3.6 正式激活，路径：`skills/sync/permission-sync/`

## 一句话理解

**permission-sync = 角色管理 + 角色授权 + 挂动作按钮**

覆盖"页面建好后，怎么让指定角色的人能看见、能点按钮"的完整闭环。底层通过 6 个 MCP Tool 驱动，无需手动切换后台界面。

## 三种工作模式

| 模式 | 触发词示例 | 用途 |
|------|-----------|------|
| `role-manage` | 创建角色 / 查询角色 | 角色查询与创建 |
| `role-assign` | 给角色分配菜单 / 角色授权 | 给角色批量分配菜单（全量覆盖，有二次确认） |
| `action-attach` | 给页面挂按钮 / 挂动作 | 注册动作到后端 + 在 data.ts 加 `permission` 字段 |

## 6 个 MCP Tools

| Tool | 用途 |
|------|------|
| `wls_role_query` | 查询角色列表（支持分页） |
| `wls_role_upsert` | 批量新增角色（按 `code` 字段去重） |
| `wls_assignable_menus_query` | 查询全量可授权菜单 |
| `wls_role_assign_menus` | 给角色批量分配菜单（**全量覆盖式**，使用前二次确认） |
| `wls_action_query` | 查询页面菜单下的动作（type=A） |
| `wls_action_upsert` | 批量新增动作（按 `permission` 字段去重） |

## 典型使用示例

### 1. 创建角色

```
用户：创建一个测试角色，code 是 test_qa
AI ：[Pre-flight] 模式 = role-manage
     调用 wls_role_query 检查 → code=test_qa 不存在
     调用 wls_role_upsert
     ✅ 创建成功
```

### 2. 给角色分配菜单

```
用户：给『档案普通人员』分配『客户档案』和『客户申请』两个菜单
AI ：[Pre-flight] 模式 = role-assign
     ⚠️ 注意：saveRoleMenus 是全量覆盖，原有菜单会被替换
     Pre-flight 列出完整菜单清单 → 是否继续？
用户：yes
AI ：调用 wls_role_assign_menus
     ✅ 角色授权成功
```

### 3. 挂动作按钮（数据驱动）

```
用户：给『客户档案』页面加上 新增/编辑/删除 三个按钮
AI ：[Pre-flight] 模式 = action-attach
     wls_action_query 查询已有动作 → 无
     wls_action_upsert 注册：customer_add / customer_edit / customer_remove
     在 data.ts 的 ActionButtonDesc 加 permission 字段：
       { name: 'add', label: '新增', permission: ['customer_add'], ... }
     ✅ 完成（报告写入 reports/PERMISSION_SYNC_*.md）
```

## 为什么不用 `v-permission` 指令？

本项目 `BaseToolbar` 内部读取 `ActionButtonDesc.permission` 字段做权限控制——**只需在 `data.ts` 的按钮配置对象里加 `permission` 字段**，不需要改 `.vue` 模板，不依赖全局指令注册。

```ts
// data.ts（加这一行即可）
{
  name: 'edit',
  label: '编辑',
  permission: ['qmmcProcessCodeMain_update'],  // ← 权限码，支持多个（OR 逻辑）
  onClick: (row: any) => modalRef.value?.edit(row.id)
}
```

## 安全约束

| 约束 | 说明 |
|------|------|
| 生产环境拒绝直接推送 | `gatewayPath` 含 `prod` / `.com` 时自动切换为导出模式 |
| 角色分配二次确认 | Pre-flight 必须列出完整菜单清单后才执行 |
| 仅新增不删除 | 防止误删导致大面积失权 |

## 配置

沿用 `.github/skills/sync/env.local.json` 中的公共配置（与 menu-sync / dict-sync 共用），无需额外配置文件。
