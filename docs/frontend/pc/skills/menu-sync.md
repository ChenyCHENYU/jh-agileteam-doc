# Skill 4：菜单同步（menu-sync）

将 pages.ts 中注册的页面同步到后端菜单表，使系统能够路由到新页面。

> 本项目是 Module Federation 子应用，页面在 `pages.ts` 注册后，还需要在后端菜单表中创建对应记录，系统才能路由到该页面。

## 数据来源分工

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
