# TypeScript 类型规范（09）

> **平台规范第 09 条** · 强制度：🟡 建议。项目使用 `strict: false` 宽松模式起步。

::: info 来源
`@agile-team/wl-skills-kit` · `standards/09-typescript.md`
:::

<AuthorTag :authors="['ZhuXiang','CHENY','ZhongYu','XuQingYu']" />

---

## 类型定义优先级

- **`interface`**：可扩展的对象类型
- **`type`**：联合类型 / 工具类型 / 字面量类型

```typescript
// ✅ interface 用于对象
interface User {
  id: string;
  name: string;
}

// ✅ type 用于联合 / 工具类型
type Status = "pending" | "active" | "closed";
type PartialUser = Partial<User>;
```

## any 使用约束

❌ 禁止滥用 `any`。`as any` 仅允许出现在以下场景：

1. 对接外部 SDK 返回值的边界处
2. `AbstractPageQueryHook.create()` 的返回值接收（框架限制）
3. 确实无法确定类型时，加注释 `// TODO: 待补充类型`

```typescript
// ✅ 允许（框架限制）
return Page.create() as any

// ✅ 允许（外部边界，加注释）
const sdkResult = thirdPartySdk.call() as any // TODO(cheny): SDK 1.5 后补充类型

// ❌ 禁止（懒省事）
function handleClick(row: any) { ... }
```

## 类型导入

- 业务类型统一从 `@/types/page` 桶文件引入
- ❌ 不重复定义同名类型
- ✅ 复杂类型在 `@/types/` 下分文件管理

## 字段类型

- 业务字段优先用 `string` / `number` / `boolean`
- ❌ 不默认用 `any`
- ⚠️ 可选字段用 `?`，可空字段用 `| null`

```typescript
interface Customer {
  id: string;
  name: string;
  remark?: string;       // 可选
  closedAt: string | null; // 可空（后端明确返回 null）
}
```

## 与 @robot-admin/git-standards 兼容

| 项目状态             | 处理                                       |
| -------------------- | ------------------------------------------ |
| 已有 `tsconfig.json` | ✅ 直接安装 git-standards，零冲突          |
| 无 TS 环境           | 先 `tsc --init` 初始化，再装 git-standards |
| ESLint TS 规则       | `warn` 级别，不阻断提交，仅作质量提示      |
