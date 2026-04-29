# BaseTable 渲染与 AGGrid cid 唯一性规范（12）

> **平台规范第 12 条** · 强制度：🔴 必遵。

::: info 位置说明
本规范属于 PC 端扩展规范系列，涉及 AGGrid 与 Module Federation 多子应用架构下的专项约定。来源：`@agile-team/wl-skills-kit` · `standards/12-base-table.md`
:::

<AuthorTag author="CHENY" />

---

## 渲染模式（强制）

所有 `BaseTable` 必须默认使用 **AGGrid** 渲染：

```vue
<BaseTable
  ref="tableRef"
  render-type="agGrid"
  cid="mca-lhfge5hc"
  :data="list"
  :columns="columns"
  showToolbar
/>
```

> 全局配置：`envConfig().componentConfig.table = { renderType: 'agGrid' }`
> 设置后所有未显式指定 `render-type` 的 BaseTable 默认 AGGrid。

---

## cid 命名规则（核心）

AGGrid 通过 `cid` 持久化列配置（列宽、顺序、显示），**cid 必须跨全部系统全局唯一**。

::: warning 为什么要用完整 base-36 时间戳
本项目包含 21 个 Module Federation 子应用，共享同一浏览器 origin（localStorage 共用）。
采用简短十进制后缀存在两个致命问题：
① 后 6 位每 ~11.5 天循环一次；
② 不同页面的首字母缩写高概率碰撞（如 `mca`、`dto`）。
因此后缀必须使用**完整 base-36 时间戳**，保证毫秒级全局唯一且永不重复。
:::

### 表格级 cid

```
格式：{页面目录首字母缩写}-{Date.now().toString(36)}
```

**生成规则（AI 执行）**：

1. 取页面 kebab-case 目录名，每个单词取首字母拼接为缩写
2. 执行 `Date.now().toString(36)`，将结果完整追加（当前约 9 位 base-36，只增不减）
3. 用 `-` 连接

**示例**：

| 页面目录                 | 缩写 | cid（base-36后缀）      |
| ------------------------ | ---- | ----------------------- |
| `mmwr-customer-archive`  | mca  | `mca-lhfge5hc`          |
| `domestic-trade-order`   | dto  | `dto-lhfge5hi`          |
| 同页面第二个表格（子表） | mca  | `mca-lhfge5hc-sub1`     |
| 同页面第三个表格         | mca  | `mca-lhfge5hc-sub2`     |

> **为什么不截断**：完整 base-36 值为单调递增，毫秒级唯一，9 位 base-36 ≈ 2199 亿组合，同一毫秒只生成一次。

::: warning AI 批量生成 cid 时的碰撞风险
AI 在同一上下文中连续生成多个 `Date.now().toString(36)` 时，返回值可能相同（AI 不会真实调用系统时钟）。
**正确做法**：AI 批量生成时，在基准时间戳上依次 +1ms 递增：

```typescript
const base = Date.now()
const cids = {
  table:  `mca-${base.toString(36)}`,           // mca-lhfge5hc
  sub1:   `mca-${(base+1).toString(36)}-sub1`,  // mca-lhfge5hd-sub1
  sub2:   `mca-${(base+2).toString(36)}-sub2`,  // mca-lhfge5he-sub2
}
```
:::

### 列级 cid

```
格式：{完整表格 cid}-{fieldName}
```

> ✅ 用完整表格 cid（而非仅缩写部分）作前缀，是防碰撞的关键。
>
> 同一页面两张表都有 `steelCode` 列时：
> - 主表（cid=`mca-lhfge5hc`）：`mca-lhfge5hc-steelCode` ✅
> - 子表（cid=`mca-lhfge5hc-sub1`）：`mca-lhfge5hc-sub1-steelCode` ✅
> - 如果用缩写作前缀：两张表同名列都会得到 `mca-steelCode` → 碰撞 ❌

```typescript
// 主表 cid="mca-lhfge5hc"
columnsDef(): TableColumnDesc<any>[] {
  return [
    { type: 'selection' },
    { type: 'index' },
    { label: '取样',     name: 'sampling',           cid: 'mca-lhfge5hc-sampling',           width: 70 },
    { label: '线上公告', name: 'onlineAnnouncement', cid: 'mca-lhfge5hc-onlineAnnouncement', width: 70 },
  ]
}

// 子表 cid="mca-lhfge5hc-sub1"
subColumnsDef(): TableColumnDesc<any>[] {
  return [
    { type: 'index' },
    { label: '钢种编码', name: 'steelCode', cid: 'mca-lhfge5hc-sub1-steelCode', width: 100 },
    { label: '规格',     name: 'spec',      cid: 'mca-lhfge5hc-sub1-spec',      width: 80 },
  ]
}
```

---

## 禁止事项

- ❌ 随机短字符串 `cid="ipiCfsb"`（AI 重新生成时极易碰撞）
- ❌ 纯字段名 `cid: "sampling"`（不同页面/不同表格同名字段必碰撞）
- ❌ 列级 cid 只用缩写 `cid: 'mca-steelCode'`（同页面两张表都有 steelCode 时碰撞）
- ❌ 省略 cid（列配置持久化完全失效）
- ❌ 跨页面复用同一 cid

---

## Pre-flight 声明示例

```
✅ cid 已生成：mca-lhfge5hc（mmwr-customer-archive）
✅ 列级 cid 前缀：mca-lhfge5hc-（完整表格 cid 加连接符）
```

---

## 完整代码示例

```vue
<!-- index.vue -->
<template>
  <BaseTable
    ref="tableRef"
    render-type="agGrid"
    cid="mca-lhfge5hc"
    :data="list"
    :columns="columns"
    showToolbar
  />
</template>
```

```typescript
// data.ts
columnsDef(): TableColumnDesc<any>[] {
  return [
    { type: 'selection' },
    { type: 'index' },
    { label: '客户名称', name: 'customerName', cid: 'mca-lhfge5hc-customerName', minWidth: 120 },
    { label: '状态',     name: 'status',       cid: 'mca-lhfge5hc-status',       minWidth: 80 },
  ]
}
```
