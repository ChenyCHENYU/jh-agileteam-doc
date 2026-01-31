# jh-drag-row - 拖拽排序组件

> 平台统一的表格行拖拽排序组件，基于 Sortable.js 封装，适用于需要手动调整顺序的列表场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-drag-row />`。

---

## 基本用法

### 1️⃣ 基本拖拽（最常用）

```vue
<template>
  <jh-drag-row v-model="tableData" @change="handleSort">
    <el-table :data="tableData">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="order" label="排序" />
    </el-table>
  </jh-drag-row>
</template>

<script setup lang="ts">
import { ref } from "vue";

const tableData = ref([
  { id: 1, name: "项目1", order: 1 },
  { id: 2, name: "项目2", order: 2 },
  { id: 3, name: "项目3", order: 3 },
]);

const handleSort = (newData, oldIndex, newIndex) => {
  console.log("排序变化:", { newData, oldIndex, newIndex });
  // 提交到后端保存新顺序
};
</script>
```

---

## Props 属性

| 参数                 | 说明               | 类型         | 默认值     |
| -------------------- | ------------------ | ------------ | ---------- |
| modelValue / v-model | 绑定数据（数组）   | `Array<any>` | `[]`       |
| handle               | 拖拽手柄选择器     | `string`     | -          |
| animation            | 动画时长（ms）     | `number`     | `150`      |
| disabled             | 是否禁用拖拽       | `boolean`    | `false`    |
| ghostClass           | 拖拽时元素的样式类 | `string`     | `"ghost"`  |
| chosenClass          | 选中元素的样式类   | `string`     | `"chosen"` |

---

## Events 事件

| 事件名            | 说明               | 回调参数                                |
| ----------------- | ------------------ | --------------------------------------- |
| update:modelValue | v-model 更新时触发 | `(value: Array<any>) => void`           |
| change            | 排序改变时触发     | `(newData, oldIndex, newIndex) => void` |
| start             | 开始拖拽时触发     | `(evt) => void`                         |
| end               | 结束拖拽时触发     | `(evt) => void`                         |

---

## 常见场景

### 场景 1：菜单排序（推荐）

```vue
<jh-drag-row v-model="menuList" @change="saveMenuOrder">
  <el-table :data="menuList">
    <el-table-column prop="name" label="菜单名称" />
    <el-table-column prop="order" label="排序号" />
  </el-table>
</jh-drag-row>

<script setup lang="ts">
const saveMenuOrder = async (newData, oldIndex, newIndex) => {
  await request({
    url: "/api/menu/sort",
    method: "POST",
    data: {
      id: newData[newIndex].id,
      newOrder: newIndex + 1,
    },
  });
};
</script>
```

---

### 场景 2：使用拖拽手柄（推荐）

```vue
<jh-drag-row v-model="tableData" handle=".drag-handle">
  <el-table :data="tableData">
    <el-table-column label="拖拽" width="50">
      <template #default>
        <i class="drag-handle el-icon-rank" style="cursor: move;"></i>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="名称" />
  </el-table>
</jh-drag-row>
```

---

### 场景 3：卡片列表拖拽

```vue
<jh-drag-row v-model="cardList" @change="handleCardSort">
  <div v-for="card in cardList" :key="card.id" class="card-item">
    {{ card.title }}
  </div>
</jh-drag-row>
```

---

### 场景 4：树形结构拖拽排序

```vue
<jh-drag-row v-model="treeData" @change="handleTreeSort">
  <el-tree :data="treeData" node-key="id" draggable />
</jh-drag-row>
```

---

## 与 Sortable.js 对比

### 使用 jh-drag-row（推荐）

```vue
<jh-drag-row v-model="list" @change="handleSort">
  <el-table :data="list">...</el-table>
</jh-drag-row>
```

✅ 自动更新 v-model  
✅ 简化配置  
✅ 统一风格  
✅ 开箱即用

### 直接使用 Sortable.js（不推荐）

```ts
import Sortable from "sortablejs";

onMounted(() => {
  const el = document.querySelector(".el-table__body-wrapper tbody");
  Sortable.create(el, {
    onEnd: (evt) => {
      // 手动处理数据更新
      const oldIndex = evt.oldIndex;
      const newIndex = evt.newIndex;
      const movedItem = list.value.splice(oldIndex, 1)[0];
      list.value.splice(newIndex, 0, movedItem);
    },
  });
});
```

❌ 配置繁琐  
❌ 需要手动处理数据更新  
❌ 需要手动查找 DOM

---

## 最佳实践

### 1️⃣ 使用拖拽手柄（强烈推荐）

```vue
<jh-drag-row v-model="list" handle=".drag-handle">
  <el-table :data="list">
    <el-table-column label="拖拽" width="50">
      <template #default>
        <i class="drag-handle el-icon-rank" style="cursor: move;"></i>
      </template>
    </el-table-column>
    <!-- 其他列 -->
  </el-table>
</jh-drag-row>
```

避免整行都可拖拽，容易误操作

---

### 2️⃣ 拖拽后及时保存

```ts
const handleSort = async (newData, oldIndex, newIndex) => {
  try {
    await request({
      url: "/api/sort",
      method: "POST",
      data: {
        id: newData[newIndex].id,
        newOrder: newIndex + 1,
      },
    });
    ElMessage.success("排序保存成功");
  } catch (error) {
    // 保存失败，恢复原顺序
    tableData.value = [...originalData];
  }
};
```

---

### 3️⃣ 保留原始数据备份

```ts
const originalData = ref([...tableData.value]);

const handleSort = async (newData, oldIndex, newIndex) => {
  try {
    await saveOrder(newData);
  } catch (error) {
    // 恢复原顺序
    tableData.value = [...originalData.value];
  }
};
```

---

### 4️⃣ 禁用拖拽时的UI反馈

```vue
<jh-drag-row v-model="list" :disabled="isLoading">
  <el-table :data="list">...</el-table>
</jh-drag-row>
```

---

## 注意事项

1. **v-model 必须是数组**
   - 拖拽后会自动更新数组顺序
   - 推荐使用 ref 响应式数组

2. **拖拽手柄推荐使用**
   - 避免误操作
   - 提升用户体验

3. **拖拽后记得保存**
   - 拖拽只是前端排序
   - 需要调用接口保存到后端

4. **注意性能优化**
   - 数据量大时考虑虚拟滚动
   - 拖拽时避免频繁请求

---

## 🎯 真实项目示例

### 示例 1：菜单排序

```vue
<jh-drag-row v-model="menuList" handle=".drag-handle" @change="saveOrder">
  <el-table :data="menuList">
    <el-table-column label="拖拽" width="50">
      <template #default>
        <i class="drag-handle el-icon-rank" style="cursor: move;"></i>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="菜单名称" />
    <el-table-column prop="order" label="排序号" />
  </el-table>
</jh-drag-row>
```

### 示例 2：轮播图排序

```vue
<jh-drag-row v-model="bannerList" @change="saveBannerOrder">
  <div v-for="banner in bannerList" :key="banner.id" class="banner-item">
    <img :src="banner.image" />
    <span>{{ banner.title }}</span>
  </div>
</jh-drag-row>
```

---

## 🚀 快速开始

1. 使用数组字段绑定 v-model
2. 监听 `@change` 事件保存排序
3. 推荐使用 `handle` 指定拖拽手柄
4. 拖拽后调用接口保存新顺序

**推荐作为平台统一的拖拽排序组件使用！**
