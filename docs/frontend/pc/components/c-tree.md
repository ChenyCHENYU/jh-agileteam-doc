# C_Tree 全局树形组件

纯树形展示组件，提供标签页、搜索、过滤等功能。布局由页面自行控制。

## 设计原则

- ✅ **单一职责**：只负责树形展示，不管布局
- ✅ **解耦设计**：与页面布局完全独立
- ✅ **高复用性**：可在任何布局中使用
- ✅ **自动导入**：无需手动 import

## Props

| 参数              | 说明         | 类型                   | 默认值                                   | 必填   |
| ----------------- | ------------ | ---------------------- | ---------------------------------------- | ------ |
| tabs              | 标签页配置   | `Array<{label, name}>` | -                                        | 否     |
| treeData          | 树形数据     | `Array`                | -                                        | **是** |
| treeProps         | 树形配置     | `Object`               | `{children: 'children', label: 'label'}` | 否     |
| defaultActiveTab  | 默认激活标签 | `string`               | `'tab1'`                                 | 否     |
| showSearch        | 显示搜索     | `boolean`              | `true`                                   | 否     |
| searchPlaceholder | 搜索占位符   | `string`               | `'关键词搜索'`                           | 否     |
| defaultExpandAll  | 默认展开     | `boolean`              | `true`                                   | 否     |
| highlightCurrent  | 高亮当前     | `boolean`              | `true`                                   | 否     |

## Events

| 事件名     | 说明       | 参数                |
| ---------- | ---------- | ------------------- |
| node-click | 节点被点击 | `(data: any)`       |
| tab-change | 标签页切换 | `(tabName: string)` |

## Slots

| 插槽名 | 说明           | 参数       |
| ------ | -------------- | ---------- |
| node   | 自定义节点内容 | `{ data }` |

## 暴露方法

| 方法名      | 说明       | 参数                |
| ----------- | ---------- | ------------------- |
| clearSearch | 清空搜索   | -                   |
| switchTab   | 切换标签页 | `(tabName: string)` |

## 使用示例

### 1. 基础用法

```vue
<template>
  <C_Tree :tree-data="treeData" @node-click="handleNodeClick" />
</template>

<script setup>
const treeData = ref([
  {
    id: "1",
    label: "节点1",
    children: [{ id: "1-1", label: "子节点1-1" }]
  }
]);

const handleNodeClick = (data) => {
  console.log("点击节点:", data);
};
</script>
```

### 2. 带标签页和搜索

```vue
<template>
  <C_Tree
    :tabs="tabs"
    :tree-data="treeData"
    :default-active-tab="activeTab"
    @node-click="handleNodeClick"
    @tab-change="handleTabChange"
  />
</template>

<script setup>
const tabs = [
  { label: "基本信息", name: "tab1" },
  { label: "交付标准", name: "tab2" }
];

const activeTab = ref("tab1");
const treeData = ref([...]);

const handleTabChange = (tabName) => {
  activeTab.value = tabName;
  // 加载对应标签页的数据...
};
</script>
```

### 3. 左右布局（使用 jh-drag-col）

```vue
<template>
  <jh-drag-col :left-width="300">
    <!-- 左侧：树形 -->
    <template #left>
      <C_Tree
        :tabs="tabs"
        :tree-data="treeData"
        @node-click="handleNodeClick"
      />
    </template>

    <!-- 右侧：详情 -->
    <template #right>
      <div class="detail-panel">
        <h3>{{ selectedNode?.label }}</h3>
        <p>详情内容...</p>
      </div>
    </template>
  </jh-drag-col>
</template>

<script setup>
const tabs = [
  { label: "基本信息", name: "tab1" },
  { label: "交付标准", name: "tab2" }
];

const treeData = ref([...]);
const selectedNode = ref(null);

const handleNodeClick = (data) => {
  selectedNode.value = data;
};
</script>

<style scoped>
.detail-panel {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  height: 100%;
}
</style>
```

## 注意事项

1. **treeData 必填**：组件必须传入树形数据
2. **布局由页面控制**：组件本身只占满父容器的 100% 高度
3. **自动导入**：已配置 Vite 自动导入，无需手动 import
4. **事件名格式**：使用 kebab-case（`@node-click`、`@tab-change`）


