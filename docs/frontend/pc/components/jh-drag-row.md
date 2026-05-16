# jh-drag-row - 可拖拽分栏组件

> 上下分栏布局组件，支持拖拽调整上下区域高度，适用于双表联动、主从表等场景

## 📦 组件位置

```typescript
// 来自远程 common-core 包
import "@jhlc/common-core";
```

组件已在全局注册，无需手动导入，直接在模板中使用 `<jh-drag-row>`。

## ⚠️ 重要提醒

**使用 jh-drag-row 必须设置以下样式，否则拖拽手柄无法正常工作！**

```scss
// 在页面的 style 标签中添加（必需！）
:deep(.drager_row) {
  height: 100%;
}
```

> **核心说明**:  
> 1. 组件渲染时会自动生成 `.drager_row` CSS 类名  
> 2. 必须使用 `:deep()` 穿透 scoped 样式  
> 3. 如果使用全局样式文件,也可以: `.app-page-container .drager_row { height: 100%; }`

## 基本用法

### 标准双表布局（推荐）

```vue
<template>
  <div class="app-container app-page-container">
    <jh-drag-row :top-height="350">
      <template #top>
        <!-- 上表区域：搜索栏 -->
        <BaseQuery
          :form="queryParam"
          :items="queryItems"
          :columns="4"
          @select="select"
          @reset="select"
        />

        <!-- 上表区域：工具栏 -->
        <BaseToolbar :items="toolbars" />

        <!-- 上表区域：表格 -->
        <BaseTable
          ref="tableRef"
          :data="list"
          :columns="columns"
          showToolbar
          @row-click="handleRowClick"
        />

        <!-- 上表区域：分页 -->
        <jh-pagination
          v-show="page.total && page.total > 0"
          :total="page.total || 0"
          v-model:currentPage="page.current"
          v-model:pageSize="page.size"
          @current-change="select"
          @size-change="select"
        />
      </template>

      <template #bottom>
        <!-- 下表区域：工具栏 -->
        <BaseToolbar :items="bottomToolbars" />

        <!-- 下表区域：表格 -->
        <BaseTable
          ref="bottomTableRef"
          :data="bottomList"
          :columns="bottomColumns"
          showToolbar
        />

        <!-- 下表区域：分页（如果需要） -->
        <jh-pagination
          v-show="bottomPage.total && bottomPage.total > 0"
          :total="bottomPage.total || 0"
          v-model:currentPage="bottomPage.current"
          v-model:pageSize="bottomPage.size"
          @current-change="selectBottom"
          @size-change="selectBottom"
        />
      </template>
    </jh-drag-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const page = ref({ current: 1, size: 10, total: 0 });
const list = ref([]);
const bottomPage = ref({ current: 1, size: 10, total: 0 });
const bottomList = ref([]);

// 查询上表数据
const select = async () => {
  // 查询逻辑...
};

// 查询下表数据
const selectBottom = async () => {
  // 查询逻辑...
};

// 行点击事件：联动查询下表
const handleRowClick = (row: any) => {
  // 根据选中行的数据查询下表
  selectBottom();
};

onMounted(() => {
  select();
});
</script>

<style scoped lang="scss">
// ⚠️ 必需样式：让拖拽组件占满容器高度
:deep(.drager_row) {
  height: 100%;
}
</style>
```

### 在 Tab 标签页中使用

```vue
<template>
  <div class="app-container app-page-container my-page">
    <el-tabs v-model="activeTab" class="tabs-container">
      <el-tab-pane label="主从表" name="master">
        <jh-drag-row :top-height="400">
          <template #top>
            <!-- 上表内容 -->
          </template>
          <template #bottom>
            <!-- 下表内容 -->
          </template>
        </jh-drag-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.my-page {
  .tabs-container {
    height: calc(100vh - 120px);

    :deep(.el-tabs__content) {
      height: calc(100% - 55px);
      padding: 10px;
    }

    :deep(.el-tab-pane) {
      height: 100%;
    }

    // ⚠️ 核心样式：确保拖拽组件能正常工作
    :deep(.drager_row) {
      height: 100%;
    }
  }
}
</style>
```

## Props 属性

| 参数              | 说明                                         | 类型      | 默认值      |
| ----------------- | -------------------------------------------- | --------- | ----------- |
| topHeight         | 上部区域的初始高度（单位：px）               | `number`  | -           |
| topPercent        | 上部区域的初始百分比（与 topHeight 二选一）   | `number`  | -           |
| bottomHeight      | 下部区域的初始高度（单位：px）               | `number`  | -           |
| isNest            | 是否嵌套使用（嵌套在另一个 drag 组件内部）   | `boolean` | `false`     |
| width             | 容器总宽度                                   | `string`  | `"400px"`   |
| height            | 容器总高度                                   | `string`  | `"400px"`   |
| sliderWidth       | 拖拽分割线的高度（单位：px）                 | `number`  | `10`        |
| sliderColor       | 拖拽手柄指示线颜色                           | `string`  | `"#6f808d"` |
| sliderBgColor     | 拖拽手柄背景色                               | `string`  | `"#a7caec"` |
| sliderHoverColor  | 拖拽手柄悬停时指示线颜色                     | `string`  | `"#6f808d"` |
| sliderBgHoverColor| 拖拽手柄悬停时背景色                         | `string`  | `"#c8dcea"` |

> **提示**:
> - 推荐使用 `topHeight` 设置上部区域高度，下部区域会自动填充剩余空间
> - `topPercent` 与 `topHeight` 二选一；当两者都传时，`topHeight` 在 mounted 后会被转换为百分比
> - 实际项目中通常配合 CSS `height: 100%` 使容器占满可用空间，因此 `width`/`height` prop 仅作为兜底默认值

## Slots 插槽

| 插槽名 | 说明         |
| ------ | ------------ |
| top    | 上部区域内容 |
| bottom | 下部区域内容 |

## 使用场景

### 1. 主从表联动

```vue
<template>
  <div class="app-container app-page-container">
    <jh-drag-row :top-height="350">
      <template #top>
        <!-- 主表：订单列表 -->
        <BaseTable
          :data="orderList"
          :columns="orderColumns"
          @row-click="handleOrderClick"
        />
      </template>
      <template #bottom>
        <!-- 从表：订单明细 -->
        <BaseTable :data="orderDetailList" :columns="detailColumns" />
      </template>
    </jh-drag-row>
  </div>
</template>
```

### 2. 轧钢计划与钢坯信息

```vue
<template>
  <div class="app-container app-page-container">
    <jh-drag-row :top-height="380">
      <template #top>
        <!-- 上表：轧钢计划列表 -->
        <BaseTable
          :data="planList"
          :columns="planColumns"
          highlight-current-row
          @current-change="handlePlanChange"
        />
      </template>
      <template #bottom>
        <!-- 下表：钢坯信息 -->
        <BaseToolbar :items="slabToolbars" />
        <BaseTable :data="slabList" :columns="slabColumns" />
      </template>
    </jh-drag-row>
  </div>
</template>

<script setup lang="ts">
// 上表选中行变化时，查询下表数据
const handlePlanChange = (row: any) => {
  if (row && row.lotNo) {
    querySlabList(row.lotNo);
  }
};
</script>
```

### 3. 合并订单（左右+上下布局）

```vue
<template>
  <div class="app-container app-page-container">
    <jh-drag-row :top-height="300">
      <template #top>
        <!-- 上部：母订单列表 -->
        <BaseQuery :form="queryParam" :items="queryItems" />
        <BaseTable :data="motherOrderList" :columns="columns" />
      </template>
      <template #bottom>
        <!-- 下部：左右两个表格 -->
        <div class="bottom-container">
          <div class="left-table">
            <div class="title">已合并订单</div>
            <BaseTable :data="mergedList" :columns="mergedColumns" />
          </div>
          <div class="right-table">
            <div class="title">未合并订单</div>
            <BaseTable :data="unmergedList" :columns="unmergedColumns" />
          </div>
        </div>
      </template>
    </jh-drag-row>
  </div>
</template>

<style scoped lang="scss">
.bottom-container {
  display: flex;
  gap: 10px;
  height: 100%;

  .left-table,
  .right-table {
    flex: 1;
    overflow: auto;
  }
}

:deep(.drager_row) {
  height: 100%;
}
</style>
```

### 项目真实代码示例

```vue
<!-- src/views/produce/production-order/sclk/ommt-steel-lib/index.vue -->
<template>
  <div class="app-container app-page-container">
    <jh-drag-row :top-height="350">
      <template #top>
        <!-- 搜索栏 -->
        <BaseQuery
          :form="queryParam"
          :items="queryItems"
          :columns="4"
          @select="select"
          @reset="select"
        />
        <!-- 工具栏 -->
        <BaseToolbar :items="toolbars" />
        <!-- 表格 -->
        <BaseTable
          ref="tableRef"
          :data="list"
          :columns="columns"
          showToolbar
        />
        <!-- 分页 -->
        <jh-pagination
          v-show="page.total && page.total > 0"
          :total="page.total || 0"
          v-model:currentPage="page.current"
          v-model:pageSize="page.size"
          @current-change="select"
          @size-change="select"
        />
      </template>
      <template #bottom>
        <BaseTable
          ref="bottomTableRef"
          :data="bottomList"
          :columns="bottomColumns"
          showToolbar
        />
      </template>
    </jh-drag-row>
  </div>
</template>

<style scoped lang="scss">
.app-page-container {
  // ⭐ 关键样式：让 drager_row 占满容器高度
  :deep(.drager_row) {
    height: 100%;
  }
}
</style>
```

### 另一种样式写法（全局样式）

```scss
// index.scss (非scoped)
.app-page-container .drager_row {
  height: 100%;
}
```

---

## 常见问题

### ❌ 问题 1：拖拽手柄无法拖动

**原因：** 缺少关键样式 `.drager_row { height: 100%; }`

**解决方案：**

```scss
// 方案 1：使用 :deep() 穿透（推荐）
:deep(.drager_row) {
  height: 100%;
}

// 方案 2：使用全局样式
.app-page-container .drager_row {
  height: 100%;
}
```

### ❌ 问题 2：上表只有一条数据时高度太矮，显示拥挤

**原因：** `top-height` 设置过小

**解决方案：**

```vue
<!-- 适当增加 top-height 值 -->
<jh-drag-row :top-height="400">
  <!-- 推荐值：350-450 之间 -->
</jh-drag-row>
```

### ❌ 问题 3：在 Tab 标签页中无法拖动

**原因：** Tab 容器没有设置高度，或 `.drager_row` 样式未正确应用

**解决方案：**

```scss
.tabs-container {
  height: calc(100vh - 120px); // 给 Tab 容器设置高度

  :deep(.el-tabs__content) {
    height: calc(100% - 55px);
  }

  :deep(.el-tab-pane) {
    height: 100%;
  }

  // ⚠️ 关键：必须添加这行
  :deep(.drager_row) {
    height: 100%;
  }
}
```

### ❌ 问题 4：拖拽后布局错乱

**原因：** 容器高度链条断裂

**检查清单：**

1. ✅ 父容器是否有明确的高度（如 `calc(100vh - 120px)`）
2. ✅ 所有中间层容器是否设置了 `height: 100%`
3. ✅ `.drager_row` 是否设置了 `height: 100%`
4. ✅ 是否使用了 `overflow: hidden` 阻止了拖拽

## 最佳实践

### ✅ 推荐做法

```vue
<template>
  <div class="app-container app-page-container my-component">
    <jh-drag-row :top-height="380">
      <template #top>
        <!-- 上表完整内容：搜索栏、工具栏、表格、分页 -->
        <BaseQuery />
        <BaseToolbar />
        <BaseTable />
        <jh-pagination />
      </template>
      <template #bottom>
        <!-- 下表完整内容 -->
        <BaseToolbar />
        <BaseTable />
      </template>
    </jh-drag-row>
  </div>
</template>

<style scoped lang="scss">
.my-component {
  // ⚠️ 必需样式
  :deep(.drager_row) {
    height: 100%;
  }
}
</style>
```

### ❌ 不推荐做法

```vue
<!-- ❌ 错误 1：忘记设置 .drager_row 高度 -->
<style scoped lang="scss">
.my-component {
  // 缺少 .drager_row 的高度设置
}
</style>

<!-- ❌ 错误 2：在 jh-drag-row 外层包裹不必要的容器 -->
<div class="wrapper">
  <jh-drag-row>
    <!-- 内容 -->
  </jh-drag-row>
</div>

<!-- ❌ 错误 3：top-height 设置过小 -->
<jh-drag-row :top-height="100">
  <!-- 上表会显得很拥挤 -->
</jh-drag-row>
```

## 高度设置建议

| 场景                   | 推荐 top-height | 说明                           |
| ---------------------- | --------------- | ------------------------------ |
| 简单表格（无搜索栏）   | 250-300         | 足够显示表头和 5-8 条数据      |
| 标准表格（含搜索栏）   | 350-400         | 显示搜索栏、工具栏、表格、分页 |
| 复杂表格（多搜索条件） | 400-450         | 搜索条件多，需要更多空间       |
| 强调上表（主表更重要） | 450-500         | 上表占据更多空间               |
| 强调下表（从表更重要） | 250-300         | 给下表留更多空间               |

## 样式定制

### 通过 Props 自定义手柄颜色（推荐）

```vue
<jh-drag-row
  :top-height="380"
  slider-color="#409eff"
  slider-bg-color="#e6f0fa"
  slider-hover-color="#1890ff"
  slider-bg-hover-color="#bae0ff"
>
  ...
</jh-drag-row>
```

### 通过 CSS 覆盖手柄样式

```scss
:deep(.drager_row) {
  height: 100%;

  // 拖拽手柄（CSS 类名为 .slider_row）
  > .slider_row {
    background: #e0e0e0;
    cursor: row-resize;

    &:hover {
      background: #1890ff;
    }
  }
}
```

> **源码 CSS 类名参考**: `.drager_row`（主容器）、`.drager_top`（上部区域）、`.drager_bottom`（下部区域）、`.slider_row`（拖拽手柄）

### 调整上下区域内边距

```scss
:deep(.drager_row) {
  height: 100%;

  .drager_top {
    padding-bottom: 10px;
  }

  .drager_bottom {
    padding-top: 10px;
  }
}
```

## 性能优化

### 避免频繁重渲染

```vue
<script setup lang="ts">
// ✅ 使用防抖，避免拖拽时频繁触发查询
import { debounce } from "lodash-es";

const handleRowChange = debounce((row: any) => {
  queryBottomData(row);
}, 300);
</script>
```

### 虚拟滚动（大数据量）

```vue
<!-- 上下表格数据量大时，配合虚拟滚动 -->
<template #top>
  <BaseTable
    :data="list"
    :columns="columns"
    virtual-scroll
    :virtual-scroll-height="300"
  />
</template>
```

## 参考示例

- 📄 钢坯利库：`src/views/produce/production-order/sclk/ommt-billet-lib/index.vue`
- 📄 订单合并：`src/views/produce/production-order/scdd/omom-order-merge/index.vue`
- 📄 轧钢计划：`src/views/produce/production-mmwr/jhgl/mmwr-steel-rolling-plan/index.vue`
- 📄 剔钢作业：`src/views/produce/production-mmwr/sjgl/mmwr-steel-stripping-operations/index.vue`

## 总结

✅ **使用 jh-drag-row 的核心要点：**

1. **必须设置** `:deep(.drager_row) { height: 100%; }`
2. **合理设置** `top-height` 属性（推荐 350-450）
3. **确保高度链完整**（父容器 → Tab → 拖拽组件都要有高度）
4. **上下区域内容完整**（包含搜索栏、工具栏、表格、分页等）
5. **在 Tab 中使用时**额外注意样式穿透

遵循以上规范，jh-drag-row 组件能够提供流畅的拖拽体验和良好的用户交互！
