# jh-text - 文本显示组件

> 平台统一的文本显示组件，支持文本省略、提示、复制等功能，适用于列表、详情等需要展示文本的场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-text />`。

---

## 基本用法

### 1️⃣ 基本显示（最常用）

```vue
<template>
  <jh-text :content="text" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const text = ref("这是一段文本内容");
</script>
```

---

### 2️⃣ 文本省略

```vue
<jh-text :content="longText" :max-length="20" ellipsis tooltip />
```

---

## Props 属性

| 参数      | 说明                     | 类型                                                                     | 默认值      |
| --------- | ------------------------ | ------------------------------------------------------------------------ | ----------- |
| content   | 显示内容                 | `string`                                                                 | -           |
| maxLength | 最大显示长度（超出省略） | `number`                                                                 | -           |
| ellipsis  | 是否显示省略号           | `boolean`                                                                | `false`     |
| tooltip   | 超出时是否显示 tooltip   | `boolean`                                                                | `false`     |
| copyable  | 是否可复制               | `boolean`                                                                | `false`     |
| type      | 文本类型                 | `"default" \| "primary" \| "success" \| "warning" \| "danger" \| "info"` | `"default"` |
| tag       | HTML 标签                | `string`                                                                 | `"span"`    |

---

## Events 事件

| 事件名 | 说明           | 回调参数     |
| ------ | -------------- | ------------ |
| copy   | 复制成功时触发 | `() => void` |

---

## 常见场景

### 场景 1：表格列文本省略（推荐）

```vue
<el-table :data="tableData">
  <el-table-column label="描述">
    <template #default="{ row }">
      <jh-text
        :content="row.description"
        :max-length="50"
        ellipsis
        tooltip
      />
    </template>
  </el-table-column>
</el-table>
```

---

### 场景 2：可复制文本（推荐）

```vue
<jh-text :content="order.orderNo" copyable />
```

点击后复制订单号到剪贴板

---

### 场景 3：状态文本（带颜色）

```vue
<jh-text content="已完成" type="success" />
<jh-text content="进行中" type="primary" />
<jh-text content="已取消" type="danger" />
```

---

### 场景 4：BaseTable 配置式用法（推荐）

```ts
// columns.ts 列配置
export const columns: BaseTableColumnDesc[] = [
  {
    prop: "description",
    label: "描述",
    renderBodyCell: ({ row }) => {
      return h(resolveComponent("jh-text"), {
        content: row.description,
        maxLength: 50,
        ellipsis: true,
        tooltip: true,
      });
    },
  },
];
```

---

### 场景 5：详情页显示（带复制）

```vue
<el-descriptions :column="2">
  <el-descriptions-item label="订单号">
    <jh-text :content="detail.orderNo" copyable />
  </el-descriptions-item>
  <el-descriptions-item label="备注">
    <jh-text
      :content="detail.remark"
      :max-length="100"
      ellipsis
      tooltip
    />
  </el-descriptions-item>
</el-descriptions>
```

---

## 与直接使用文本对比

### 使用 jh-text（推荐）

```vue
<jh-text :content="text" :max-length="50" ellipsis tooltip />
```

✅ 自动处理省略  
✅ 鼠标悬停显示完整内容  
✅ 统一风格  
✅ 支持复制

### 直接使用文本（不推荐）

```vue
<span :title="text">
  {{ text.length > 50 ? text.slice(0, 50) + '...' : text }}
</span>
```

❌ 手动处理省略逻辑  
❌ tooltip 体验差  
❌ 不支持复制

---

## 最佳实践

### 1️⃣ 表格列长文本推荐省略（强烈推荐）

```vue
<el-table-column label="描述">
  <template #default="{ row }">
    <jh-text
      :content="row.description"
      :max-length="50"
      ellipsis
      tooltip
    />
  </template>
</el-table-column>
```

避免表格列过宽，影响整体布局

---

### 2️⃣ 订单号、流水号等推荐可复制（推荐）

```vue
<jh-text :content="order.orderNo" copyable />
```

方便用户复制

---

### 3️⃣ 状态文本推荐带颜色（推荐）

```vue
<jh-text :content="statusText" :type="statusType" />

<script setup lang="ts">
const statusType = computed(() => {
  switch (row.status) {
    case 1:
      return "success";
    case 2:
      return "warning";
    case 3:
      return "danger";
    default:
      return "default";
  }
});
</script>
```

---

### 4️⃣ 超长文本必须配置 maxLength

```vue
<jh-text :content="longText" :max-length="100" ellipsis tooltip />
```

避免页面撑爆

---

## 注意事项

1. **maxLength 与 ellipsis 配合使用**
   - `maxLength`: 限制显示长度
   - `ellipsis`: 显示省略号
   - `tooltip`: 鼠标悬停显示完整内容

2. **copyable 使用场景**
   - 订单号、流水号、ID 等
   - 用户需要复制的文本

3. **type 颜色类型**
   - `default`: 默认黑色
   - `primary`: 主题蓝色
   - `success`: 成功绿色
   - `warning`: 警告橙色
   - `danger`: 危险红色
   - `info`: 信息灰色

4. **性能优化**
   - 大量使用时注意性能
   - 避免在循环中使用复杂计算

---

## 🎯 真实项目示例

### 示例 1：表格列文本省略

```vue
<el-table-column label="描述" width="200">
  <template #default="{ row }">
    <jh-text
      :content="row.description"
      :max-length="50"
      ellipsis
      tooltip
    />
  </template>
</el-table-column>
```

### 示例 2：订单号（可复制）

```vue
<jh-text :content="order.orderNo" copyable />
```

### 示例 3：状态显示

```vue
<jh-text
  :content="row.statusText"
  :type="row.status === 1 ? 'success' : 'danger'"
/>
```

---

## 🚀 快速开始

1. 传入 `content` 显示内容
2. 超长文本配置 `maxLength` + `ellipsis` + `tooltip`
3. 需要复制的文本配置 `copyable`
4. 状态文本配置 `type` 颜色

**推荐作为平台统一的文本显示组件使用！**
