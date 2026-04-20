# ⑦ 规范审计 convention-audit

> 触发词：`审计` / `规范检查` / `代码审查` / `check conventions`

对已生成的代码执行三级审计：**P0 Error → P1 Warning → P2 Info**，确保产出物严格符合项目规范。

---

## 审计等级

| 等级 | 含义 | 处理 |
|---|---|---|
| P0 Error | 运行时会崩溃或功能缺失 | 必须修复 |
| P1 Warning | 不影响运行但违反规范 | 应当修复 |
| P2 Info | 代码风格 / 最佳实践 | 建议修复 |

---

## P0 Error — 必须修复

| 检查项 | 判定条件 |
|---|---|
| 三文件分离 | `.vue` 中出现 `<style>` 块 → Error |
| defineOptions | 缺少 `defineOptions({ name })` 或 name 与路由不一致 → Error |
| 接口路径一致 | `src/api/*.ts` 的路径与 `mock/*.ts` 的 URL 不匹配 → Error |
| 类型定义 | data.ts 缺少 `interface` 或 `type` 定义 → Error |
| Mock 数据池 | Mock 端点返回空数据或硬编码响应（未引用 dataPool） → Error |
| 路由注册 | modules.ts / menu.ts 中未注册新页面 → Error |
| 组件导入 | 使用了未注册的组件（如 `<VanButton>` 未引入 Vant） → Error |

---

## P1 Warning — 应当修复

| 检查项 | 判定条件 |
|---|---|
| 设计令牌 | 硬编码颜色值（如 `#fff`、`rgb()`） → 应使用 `var(--ds-xxx)` |
| BEM 命名 | class 名不符合 `.{page}__{element}--{modifier}` 模式 |
| 安全区 | 底部固定栏缺少 `env(safe-area-inset-bottom)` |
| 枚举覆盖 | Mock 数据未覆盖所有状态枚举值 |
| keepAlive | 列表页 `keepAlive: false`（应为 true）或表单页 `keepAlive: true`（应为 false） |
| 字段完整性 | page-spec.json 中有的字段在代码中缺失 |

---

## P2 Info — 建议修复

| 检查项 | 判定条件 |
|---|---|
| 间距网格 | margin/padding 值不在 4px 网格（4/8/12/16/20/24/32） |
| 字号梯度 | font-size 不在标准梯度（11/12/13/14/15/16/17/20/22/28/34） |
| import 顺序 | 第三方库 → 项目模块 → 相对路径，未按此顺序排列 |
| 注释 | API 函数缺少 JSDoc 注释 |
| Mock 数据量 | 数据不足 6 条或超过 10 条 |
| 文件命名 | 目录 / 文件名不符合 kebab-case |

---

## 原型对比检查

| 检查项 | 判定条件 |
|---|---|
| 字段完整 | 原型中出现的字段在页面中均有渲染 |
| 按钮文案 | 按钮文本与原型完全一致（不可自行替换，如"作废"不可改"删除"） |
| 按钮顺序 | 操作按钮顺序与原型视觉顺序一致 |
| 状态标签 | 原型中的状态值均有对应 Tag 渲染 |
| 颜色映射 | Tag 颜色与原型设计一致（success/warning/danger/info） |

---

## 执行步骤

```
1. 扫描目标目录下所有 .vue / .scss / .ts 文件
2. 逐项执行 P0 → P1 → P2 检查
3. 汇总输出审计报告

📋 审计报告 — {module}
━━━━━━━━━━━━━━━━━━━━━━
P0 Error (x 项)
  ❌ [文件:行号] 具体问题描述 → 修复建议

P1 Warning (x 项)
  ⚠️ [文件:行号] 具体问题描述 → 修复建议

P2 Info (x 项)
  ℹ️ [文件:行号] 具体问题描述 → 修复建议

总计: x P0 / x P1 / x P2
结论: ✅ 通过 / ❌ 未通过（存在 P0 错误）
```

---

## 上下游

- 上游：[⑥ Mock 生成](./mock-gen)
- 结束：完成全部 7 个 Skill 流水线
