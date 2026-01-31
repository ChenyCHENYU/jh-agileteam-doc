# BaseTable 表格组件

> 来源：`@jhlc/common-core` 远程组件

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

BaseTable 是一个功能强大的表格组件，支持数据展示、排序、筛选、选择、操作按钮、可编辑单元格等功能。支持 DataTable 和 AGGrid 两种渲染模式。

## 📦 导入方式

```typescript
// 全局注册（已在项目中配置）
// 直接使用 <BaseTable /> 即可

// 类型导入
import type { TableColumnDesc } from "@jhlc/common-core/src/components/table/base-table/type";
```

## 🚀 基本用法

```vue
<template>
  <BaseTable
    ref="tableRef"
    :data="list"
    :columns="columns"
    showToolbar
    border
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const tableRef = ref();
const list = ref([
  { id: 1, name: "张三", age: 25, status: "在职" },
  { id: 2, name: "李四", age: 30, status: "离职" },
]);

const columns = computed(() => [
  { type: "selection" },
  { type: "index" },
  { label: "姓名", name: "name" },
  { label: "年龄", name: "age" },
  { label: "状态", name: "status" },
]);
</script>
```

---

## 📋 Props 属性

### 基础属性

| 属性名        | 类型                            | 默认值       | 说明                       |
| ------------- | ------------------------------- | ------------ | -------------------------- |
| `data`        | `Array`                         | `[]`         | 表格数据源                 |
| `columns`     | `TableColumnDesc[]`             | `[]`         | 列配置数组                 |
| `renderType`  | `'' \| 'dataTable' \| 'agGrid'` | `''`         | 渲染类型                   |
| `rowId`       | `string`                        | `'_id'`      | 行数据唯一标识字段         |
| `rowKey`      | `string`                        | `'_id'`      | 行数据的键（树形表格必需） |
| `childrenKey` | `string`                        | `'children'` | 子节点字段名               |

### 外观属性

| 属性名        | 类型                              | 默认值  | 说明           |
| ------------- | --------------------------------- | ------- | -------------- |
| `border`      | `boolean`                         | `true`  | 是否显示边框   |
| `stripe`      | `boolean`                         | `true`  | 是否显示斑马纹 |
| `size`        | `'small' \| 'default' \| 'large'` | -       | 表格尺寸       |
| `height`      | `number`                          | -       | 表格高度       |
| `maxHeight`   | `number`                          | -       | 表格最大高度   |
| `autoHeight`  | `boolean`                         | `false` | 自动调整高度   |
| `showHeader`  | `boolean`                         | `true`  | 是否显示表头   |
| `showToolbar` | `boolean`                         | `false` | 是否显示工具栏 |
| `fixed`       | `boolean`                         | -       | 是否固定表头   |

### 选择相关

| 属性名                   | 类型                          | 默认值  | 说明                         |
| ------------------------ | ----------------------------- | ------- | ---------------------------- |
| `selectMethod`           | `'dblclick' \| 'click' \| ''` | `''`    | 选中方式                     |
| `selectedRow`            | `string \| number`            | -       | 单选选中行                   |
| `selectedValue`          | `string \| number`            | -       | 单选选中值                   |
| `selectionRows`          | `Array`                       | `[]`    | 多选选中的行                 |
| `selectionType`          | `number`                      | `2`     | 多选类型 2:全选 1:半选和全选 |
| `persistSelect`          | `boolean`                     | `false` | 持久化选择                   |
| `autoCheckedChildren`    | `boolean`                     | `true`  | 自动勾选子节点               |
| `highlightCurrentRow`    | `boolean`                     | `false` | 高亮当前行                   |
| `currentRowSelectMethod` | `'dblclick' \| 'click'`       | -       | 当前行选中方式               |

### 功能相关

| 属性名             | 类型       | 默认值  | 说明           |
| ------------------ | ---------- | ------- | -------------- |
| `disabled`         | `boolean`  | `false` | 禁用输入框     |
| `showSummary`      | `boolean`  | `false` | 显示汇总行     |
| `summaryMethod`    | `Function` | -       | 自定义汇总方法 |
| `defaultExpandAll` | `boolean`  | `false` | 默认展开所有行 |
| `virtual`          | `boolean`  | `true`  | 虚拟滚动       |
| `frontSort`        | `boolean`  | `false` | 前端排序       |
| `frontFiltering`   | `boolean`  | `false` | 前端过滤       |
| `manualFiltering`  | `boolean`  | `false` | 手动过滤       |
| `manualSorting`    | `boolean`  | `false` | 手动排序       |
| `grouping`         | `boolean`  | `false` | 分组           |
| `groupFields`      | `string[]` | -       | 分组字段       |
| `columnVisibility` | `boolean`  | `false` | 列可见性控制   |
| `showEditIcon`     | `boolean`  | `true`  | 显示编辑图标   |

### AGGrid 专用

| 属性名                          | 类型                                        | 默认值               | 说明                 |
| ------------------------------- | ------------------------------------------- | -------------------- | -------------------- |
| `tree`                          | `boolean`                                   | `false`              | 树形结构             |
| `quickEditCursor`               | `boolean`                                   | `true`               | 快速编辑光标         |
| `selection`                     | `Array`                                     | -                    | 选中项               |
| `isRowSelectable`               | `Function`                                  | -                    | 行是否可选           |
| `isGroupOpenByDefault`          | `Function`                                  | -                    | 分组默认展开         |
| `rowGroupPanelShow`             | `'never' \| 'onlyWhenGrouping' \| 'always'` | `'onlyWhenGrouping'` | 行分组面板显示       |
| `grandTotalRow`                 | `string`                                    | -                    | 总计行位置           |
| `pinnedTopRowData`              | `Array`                                     | -                    | 固定顶部行数据       |
| `pinnedBottomRowData`           | `Array`                                     | -                    | 固定底部行数据       |
| `isRowPinned`                   | `Function`                                  | -                    | 行是否固定           |
| `suppressRowClickSelection`     | `boolean`                                   | `false`              | 禁止行点击选择       |
| `rowClass`                      | `Function`                                  | -                    | 行样式类             |
| `rowStyle`                      | `Function`                                  | -                    | 行样式               |
| `rowClassRules`                 | `Object`                                    | -                    | 行样式规则           |
| `stopEditingWhenCellsLoseFocus` | `boolean`                                   | `false`              | 失焦停止编辑         |
| `isRowValidDropPosition`        | `Function`                                  | -                    | 行是否为有效拖放位置 |

---

## 📋 Events 事件

| 事件名                 | 参数                             | 说明           |
| ---------------------- | -------------------------------- | -------------- |
| `selectionChange`      | `selection: any[]`               | 多选项发生变化 |
| `select`               | `selection, row, status, params` | 选择某一行     |
| `selectAll`            | `selection, status`              | 全选/取消全选  |
| `currentChange`        | `currentRow`                     | 当前行变化     |
| `row-click`            | `row, column, event`             | 行点击事件     |
| `row-dblclick`         | `row, column, event`             | 行双击事件     |
| `expand-change`        | `row, expanded`                  | 展开/收起变化  |
| `filterModified`       | -                                | 过滤条件修改   |
| `filterChanged`        | -                                | 过滤条件变化   |
| `update:selectedRow`   | `row`                            | 单选行更新     |
| `update:selectedValue` | `value`                          | 单选值更新     |
| `mounted`              | `{ parentEl }`                   | 组件挂载完成   |

---

## 📋 Expose 方法 (通过 ref 调用)

### 选择相关

| 方法名                | 参数                                 | 返回值   | 说明                            |
| --------------------- | ------------------------------------ | -------- | ------------------------------- |
| `getSelection`        | `check?: 1\|2, firstLevel?: boolean` | `any[]`  | 获取选中行 (2:全选,1:半选+全选) |
| `getVisibleSelection` | `check?: 1\|2, firstLevel?: boolean` | `any[]`  | 获取可见选中行                  |
| `getRootSelection`    | `check?: 1\|2`                       | `any[]`  | 获取根节点选中行                |
| `getAllSelection`     | `check?: 1\|2`                       | `any[]`  | 获取所有选中行                  |
| `getTreeSelection`    | `type?: 'flat'\|'tree'`              | `any[]`  | 获取树形选中行                  |
| `getSingleSelectRow`  | -                                    | `object` | 获取单选行                      |
| `getSelectionRows`    | -                                    | `any[]`  | 获取选中的行                    |
| `toggleRowSelection`  | `row, selected: boolean`             | -        | 切换行选中状态                  |
| `toggleAllSelection`  | -                                    | -        | 切换全选状态                    |
| `setCurrentRow`       | `row`                                | -        | 设置当前高亮行                  |
| `clearSelection`      | -                                    | -        | 清空选中                        |
| `setSelect`           | `row, status: boolean`               | -        | 设置行选中状态                  |
| `setSelection`        | -                                    | -        | 设置选中                        |
| `selectAll`           | -                                    | -        | 全选                            |
| `deselectAll`         | -                                    | -        | 取消全选                        |

### 验证相关

| 方法名               | 参数                                 | 返回值 | 说明         |
| -------------------- | ------------------------------------ | ------ | ------------ |
| `validate`           | `callback: (valid: boolean) => void` | -      | 验证整个表格 |
| `validateRow`        | -                                    | -      | 验证单行     |
| `validateRows`       | `rows, cb: (valid: boolean) => void` | -      | 验证多行     |
| `clearValidation`    | -                                    | -      | 清除验证     |
| `clearRowValidation` | -                                    | -      | 清除行验证   |

### 数据操作

| 方法名         | 参数                      | 返回值    | 说明         |
| -------------- | ------------------------- | --------- | ------------ |
| `setRowValue`  | `row, name, index, value` | -         | 设置行字段值 |
| `setDataValue` | `row, key, value`         | -         | 设置数据值   |
| `updateRow`    | `data`                    | -         | 更新行数据   |
| `getTableData` | -                         | `any[]`   | 获取表格数据 |
| `getParentRow` | `row`                     | `object`  | 获取父行     |
| `isTableReady` | `row`                     | `boolean` | 表格是否就绪 |

### 编辑状态

| 方法名              | 参数 | 返回值 | 说明           |
| ------------------- | ---- | ------ | -------------- |
| `resetRowEditState` | -    | -      | 重置行编辑状态 |
| `resetEditState`    | -    | -      | 重置编辑状态   |

### 刷新相关

| 方法名                 | 参数   | 返回值 | 说明         |
| ---------------------- | ------ | ------ | ------------ |
| `refresh`              | -      | -      | 刷新表格     |
| `forceRefresh`         | -      | -      | 强制刷新     |
| `forceRefreshTable`    | -      | -      | 强制刷新表格 |
| `forceRefreshNode`     | `node` | -      | 强制刷新节点 |
| `refreshColumnVisible` | -      | -      | 刷新列可见性 |
| `refreshHeader`        | -      | -      | 刷新表头     |

### 展开/折叠

| 方法名        | 参数      | 返回值 | 说明       |
| ------------- | --------- | ------ | ---------- |
| `expandAll`   | -         | -      | 展开所有行 |
| `collapseAll` | -         | -      | 折叠所有行 |
| `expandRow`   | `rowList` | -      | 展开指定行 |
| `collRow`     | `row`     | -      | 折叠指定行 |

### 滚动/定位

| 方法名       | 参数            | 返回值 | 说明         |
| ------------ | --------------- | ------ | ------------ |
| `goToRow`    | `index: number` | -      | 滚动到指定行 |
| `goToColumn` | `name: string`  | -      | 滚动到指定列 |

### 导出

| 方法名        | 参数                             | 返回值 | 说明       |
| ------------- | -------------------------------- | ------ | ---------- |
| `exportExcel` | `option: ExportTableExcelOption` | -      | 导出 Excel |

### 其他

| 方法名               | 参数            | 返回值   | 说明                     |
| -------------------- | --------------- | -------- | ------------------------ |
| `loading`            | `time?: number` | -        | 显示加载状态(默认6000ms) |
| `closeLoading`       | -               | -        | 关闭加载状态             |
| `clearFilters`       | -               | -        | 清除过滤                 |
| `setSuppressRowDrag` | `flag: boolean` | -        | 设置是否可拖拽           |
| `getRowKey`          | -               | `string` | 获取行键                 |
| `currentRow`         | -               | `object` | 当前高亮行 (computed)    |
| `data`               | -               | `any[]`  | 表格数据 (computed)      |

---

## 📋 列配置 TableColumnDesc

### 基础属性

```typescript
interface TableColumnDesc<T = any> {
  // 列名（字段名）⚠️ 重要：使用 name 而非 prop
  name?: string;
  // 列标题
  label?: string;
  // 列类型
  type?: "index" | "selection" | "radio" | "expand";
  // 列宽
  width?: number;
  // 最小列宽
  minWidth?: number;
  // 弹性宽度
  flex?: number;
  // 对齐方式
  align?: "left" | "center" | "right";
  // 表头对齐
  headerAlign?: "left" | "center" | "right";
  // 固定列
  fixed?: "left" | "right";
  // 列宽可调整
  resizable?: boolean;
  // 是否可排序
  sortable?: boolean;
  // 超出省略号
  showOverflowTooltip?: boolean;
  // 允许换行
  wrapText?: boolean;
  // 自动调整行高
  autoHeight?: boolean;
  // 是否可过滤
  filterable?: boolean;
}
```

### 自定义渲染 (⚠️ 重要)

BaseTable 支持多种自定义渲染方式：

#### 1. defaultSlot - 默认插槽 (推荐)

```typescript
import { h } from "vue";

{
  name: "title",
  label: "标题",
  // ✅ 正确方式：使用 defaultSlot + h 函数
  defaultSlot: ({ row, $index }) => {
    return h(
      "span",
      { style: "color: #409eff; cursor: pointer;" },
      row.title
    );
  }
}
```

#### 2. defaultNode - 低代码插槽

```typescript
{
  name: "status",
  label: "状态",
  defaultNode: ({ row, $index, params }) => {
    return {
      tag: "el-tag",
      props: { type: row.status === 1 ? "success" : "danger" },
      children: row.status === 1 ? "启用" : "禁用"
    };
  }
}
```

#### 3. formatter - 文本格式化

```typescript
{
  name: "amount",
  label: "金额",
  // ⚠️ formatter 返回纯文本，不支持 HTML
  formatter: (row, params) => {
    return `¥${Number(row.amount).toLocaleString()}`;
  }
}
```

#### 4. headerSlot - 表头插槽

```typescript
import { h } from "vue";

{
  name: "price",
  label: "价格",
  headerSlot: () => {
    return h("span", { class: "custom-header" }, [
      h("span", "价格"),
      h("el-tooltip", { content: "含税价格" }, h("i", { class: "el-icon-info" }))
    ]);
  }
}
```

### 可编辑列

```typescript
{
  name: "quantity",
  label: "数量",
  // 开启编辑
  editable: true,
  // 或条件编辑
  editable: (row) => row.status !== "locked",
  // 单击编辑
  singleClickEdit: true,
  // 始终显示编辑框
  alwaysEditable: true,
  // 自动聚焦
  autoFocusInput: true,
  // 校验规则
  rules: [{ required: true, message: "请输入数量" }],
  required: true,
  // 生效校验规则
  effectRule: (row) => row.needValidate,
  // 自定义编辑组件
  editComponent: (row, value, params) => ({
    tag: "el-input-number",
    props: { min: 0, max: 100 }
  })
}
```

### 操作列

```typescript
{
  label: "操作",
  width: 200,
  fixed: "right",
  operations: [
    {
      name: "edit",
      label: "编辑",
      type: "primary",
      // 权限控制
      permission: ["user:edit"],
      // 点击事件
      onClick: (row, index, params) => {
        console.log("编辑", row);
      }
    },
    {
      name: "delete",
      label: "删除",
      type: "danger",
      // 禁用条件
      disabled: (row) => row.status === "locked",
      // 显示条件
      show: (row, index) => row.canDelete,
      onClick: (row, index) => {
        console.log("删除", row);
      }
    }
  ]
}
```

### 逻辑数据类型

```typescript
{
  name: "status",
  label: "状态",
  // 自动从字典获取显示值
  logicType: "ORDER_STATUS",
  logicValue: "status"
}
```

### 行合并配置

BaseTable 支持在列配置中直接定义行合并规则，无需手动编写 `span-method`。

#### 方式一：使用 `spanOnceRow` 自动合并相同值

```typescript
{
  name: "category",
  label: "类别",
  width: 120,
  // 自动合并相邻相同值的单元格
  spanOnceRow: true
}
```

#### 方式二：使用 `span` 函数自定义合并逻辑（推荐）

```typescript
{
  name: "testCategory",
  label: "试验种类",
  width: 150,
  align: "center",
  // 自定义行合并逻辑
  span: ({ rowIndex, data }: any) => {
    if (!data || data.length === 0) {
      return { rowSpan: 1, colSpan: 1 };
    }

    const currentCategory = data[rowIndex]?.testCategory;
    const prevCategory = rowIndex > 0 ? data[rowIndex - 1]?.testCategory : null;

    // 如果是分组的第一行，计算需要合并的行数
    if (rowIndex === 0 || currentCategory !== prevCategory) {
      let rowSpan = 1;
      for (let i = rowIndex + 1; i < data.length; i++) {
        if (data[i].testCategory === currentCategory) {
          rowSpan++;
        } else {
          break;
        }
      }
      return { rowSpan, colSpan: 1 };
    }

    // 非第一行则隐藏
    return { rowSpan: 0, colSpan: 0 };
  }
}
```

#### 完整示例：分组合并表格

```vue
<template>
  <BaseTable :data="experimentData" :columns="columns" border />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { h } from "vue";

const experimentData = ref([
  { id: 1, testCategory: "化学成分", testItem: "C", value: "0.15" },
  { id: 2, testCategory: "化学成分", testItem: "Si", value: "0.30" },
  { id: 3, testCategory: "化学成分", testItem: "Mn", value: "1.20" },
  { id: 4, testCategory: "力学性能", testItem: "抗拉强度", value: "≥500" },
  { id: 5, testCategory: "力学性能", testItem: "屈服强度", value: "≥350" },
]);

const columns = computed(() => [
  {
    type: "index",
    label: "序号",
    width: 60,
    // 序号列也需要合并
    span: ({ rowIndex, data }: any) => {
      if (!data || data.length === 0) return { rowSpan: 1, colSpan: 1 };

      const currentCategory = data[rowIndex]?.testCategory;
      const prevCategory =
        rowIndex > 0 ? data[rowIndex - 1]?.testCategory : null;

      if (rowIndex === 0 || currentCategory !== prevCategory) {
        let rowSpan = 1;
        for (let i = rowIndex + 1; i < data.length; i++) {
          if (data[i].testCategory === currentCategory) {
            rowSpan++;
          } else {
            break;
          }
        }
        return { rowSpan, colSpan: 1 };
      }
      return { rowSpan: 0, colSpan: 0 };
    },
  },
  {
    name: "testCategory",
    label: "试验种类",
    width: 120,
    align: "center",
    span: ({ rowIndex, data }: any) => {
      if (!data || data.length === 0) return { rowSpan: 1, colSpan: 1 };

      const currentCategory = data[rowIndex]?.testCategory;
      const prevCategory =
        rowIndex > 0 ? data[rowIndex - 1]?.testCategory : null;

      if (rowIndex === 0 || currentCategory !== prevCategory) {
        let rowSpan = 1;
        for (let i = rowIndex + 1; i < data.length; i++) {
          if (data[i].testCategory === currentCategory) {
            rowSpan++;
          } else {
            break;
          }
        }
        return { rowSpan, colSpan: 1 };
      }
      return { rowSpan: 0, colSpan: 0 };
    },
  },
  {
    name: "testItem",
    label: "试验项目",
    width: 150,
  },
  {
    name: "value",
    label: "标准值",
    width: 100,
  },
]);
</script>
```

#### span 函数参数说明

```typescript
interface SpanParams {
  rowIndex: number; // 当前行索引
  columnIndex: number; // 当前列索引
  row: any; // 当前行数据
  column: any; // 当前列配置
  data: any[]; // 全部表格数据
}

// 返回值
interface SpanResult {
  rowSpan: number; // 行合并数量，0 表示隐藏
  colSpan: number; // 列合并数量，0 表示隐藏
}
```

#### 行合并最佳实践

1. **使用 `spanOnceRow: true`** - 适用于简单的相邻相同值合并
2. **使用 `span` 函数** - 适用于复杂的分组合并逻辑
3. **多列合并** - 需要合并的每一列都要配置 `span` 函数
4. **注意性能** - `span` 函数会在每次渲染时调用，避免复杂计算
5. **数据排序** - 确保数据按分组字段排序，否则合并效果不正确

### 样式控制

```typescript
{
  name: "amount",
  label: "金额",
  // 单元格样式类
  cellClass: (params) => {
    return params.value < 0 ? "negative-amount" : "";
  },
  // 单元格样式
  cellStyle: (params) => {
    return { color: params.value < 0 ? "red" : "green" };
  },
  // 链接样式
  isLink: (row) => true,
  // 单元格点击
  onCellClick: (params) => {
    console.log("点击", params.data);
  },
  onCellDblclick: (params) => {
    console.log("双击", params.data);
  }
}
```

### 分组与汇总

```typescript
{
  name: "amount",
  label: "金额",
  // 聚合函数
  aggregationFn: ["sum", "avg"],
  // 行分组
  rowGroup: true
}
```

### 数字精度

```typescript
{
  name: "price",
  label: "单价",
  logicType: "number",
  // 保留2位小数
  precision: 2,
  // 不足自动补0
  precisionAutoFillZero: true
}
```

---

## 🎯 操作按钮配置 TableRowOperation

```typescript
interface TableRowOperation {
  // 按钮标识
  name?: string;
  // 按钮文本
  label: string;
  // 主题颜色
  type?: "primary" | "success" | "warning" | "danger" | "info";
  // 图标
  icon?: string;
  // 自动加载状态
  autoLoading?: boolean;
  // 禁用
  disabled?: boolean | ((row) => boolean);
  // 显示条件
  show?: (row, index) => boolean;
  // 点击事件
  onClick?: (row, index, params) => void;
  // 按钮权限
  permission?: string[];
}
```

---

## 💡 完整示例

### 基础列表页

```vue
<template>
  <div class="app-container">
    <BaseTable
      ref="tableRef"
      :data="list"
      :columns="columns"
      :loading="loading"
      showToolbar
      border
      @selectionChange="handleSelectionChange"
    />

    <jh-pagination
      v-show="page.total > 0"
      :total="page.total"
      v-model:currentPage="page.current"
      v-model:pageSize="page.size"
      @current-change="loadData"
      @size-change="loadData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from "vue";
import type { TableColumnDesc } from "@jhlc/common-core/src/components/table/base-table/type";

const tableRef = ref();
const list = ref([]);
const loading = ref(false);
const selectedRows = ref([]);
const page = ref({ current: 1, size: 10, total: 0 });

const columns = computed<TableColumnDesc[]>(() => [
  { type: "selection", width: 40 },
  { type: "index", label: "序号", width: 60 },
  {
    name: "orderNo",
    label: "订单号",
    width: 150,
    // 蓝色链接样式
    defaultSlot: ({ row }) => {
      return h(
        "span",
        {
          style: "color: #409eff; cursor: pointer;",
          onClick: () => viewDetail(row),
        },
        row.orderNo,
      );
    },
  },
  {
    name: "customerName",
    label: "客户名称",
    showOverflowTooltip: true,
  },
  {
    name: "amount",
    label: "金额",
    align: "right",
    formatter: (row) => `¥${Number(row.amount).toLocaleString()}`,
  },
  {
    name: "status",
    label: "状态",
    logicType: "ORDER_STATUS",
  },
  {
    name: "createTime",
    label: "创建时间",
    width: 180,
  },
  {
    label: "操作",
    width: 180,
    fixed: "right",
    operations: [
      {
        name: "view",
        label: "查看",
        onClick: (row) => viewDetail(row),
      },
      {
        name: "edit",
        label: "编辑",
        type: "primary",
        permission: ["order:edit"],
        onClick: (row) => editRecord(row),
      },
      {
        name: "delete",
        label: "删除",
        type: "danger",
        permission: ["order:delete"],
        disabled: (row) => row.status !== "draft",
        onClick: (row) => deleteRecord(row),
      },
    ],
  },
]);

const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
};

const viewDetail = (row) => {
  // 查看详情
};

const editRecord = (row) => {
  // 编辑记录
};

const deleteRecord = (row) => {
  // 删除记录
};

const loadData = async () => {
  loading.value = true;
  try {
    // 加载数据
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>
```

### 可编辑表格

```vue
<template>
  <BaseTable ref="tableRef" :data="list" :columns="editableColumns" border />
  <el-button @click="handleValidate">验证</el-button>
  <el-button @click="handleSave">保存</el-button>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const tableRef = ref();
const list = ref([{ id: 1, name: "", quantity: 0, price: 0 }]);

const editableColumns = computed(() => [
  { type: "index", label: "序号", width: 60 },
  {
    name: "name",
    label: "名称",
    editable: true,
    rules: [{ required: true, message: "请输入名称" }],
  },
  {
    name: "quantity",
    label: "数量",
    editable: true,
    editComponent: () => ({
      tag: "el-input-number",
      props: { min: 1 },
    }),
  },
  {
    name: "price",
    label: "单价",
    editable: true,
    precision: 2,
  },
]);

const handleValidate = () => {
  tableRef.value?.validate((valid) => {
    console.log("验证结果:", valid);
  });
};

const handleSave = () => {
  const data = tableRef.value?.getTableData();
  console.log("保存数据:", data);
};
</script>
```

---

## ⚠️ 注意事项

1. **列字段名使用 `name` 而非 `prop`**

   ```typescript
   // ✅ 正确
   { label: "姓名", name: "userName" }

   // ❌ 错误
   { label: "姓名", prop: "userName" }
   ```

2. **自定义渲染使用 `defaultSlot` 而非 `render`**

   ```typescript
   // ✅ 正确
   {
     name: "title",
     defaultSlot: ({ row }) => h("span", { style: "color: blue;" }, row.title)
   }

   // ❌ 错误
   {
     name: "title",
     render: (value) => `<span style="color: blue;">${value}</span>`
   }
   ```

3. **formatter 只能返回纯文本**

   ```typescript
   // ✅ 正确 - 返回文本
   formatter: (row) => `¥${row.amount}`;

   // ❌ 错误 - 返回 HTML（不会解析）
   formatter: (row) => `<span class="red">${row.amount}</span>`;
   ```

4. **操作按钮的权限控制**
   - 使用 `permission` 属性配置权限标识数组
   - 系统会自动根据用户权限显示/隐藏按钮

5. **表格高度设置**
   - 固定高度：`height="400"`
   - 自适应：配合 flex 布局，设置 `height="100%"` 或 `autoHeight`

6. **树形数据必须设置 `rowKey`**

   ```vue
   <BaseTable :data="treeData" :columns="columns" rowKey="id" />
   ```

---

## 📚 相关文档

- [AGGrid 高级表格](../AGGrid/README.md)
- [BaseToolbar 工具栏](../BaseToolbar/README.md)
- [BaseQuery 查询组件](../BaseQuery/README.md)
