# jh-cascader - 级联选择组件

> 平台统一的级联选择组件，支持多级联动、多选、可搜索、懒加载、任意层级选择，适用于地区、分类、组织等多级树状数据选择场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-cascader />`。

---

## 基本用法

### 1️⃣ 静态选项（最常用）

```vue
<template>
  <jh-cascader
    v-model="form.region"
    label="地区"
    :options="regionOptions"
    :prop-value="'value'"
    :prop-label="'label'"
    :prop-children="'children'"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const regionOptions = ref([
  {
    value: "zhejiang",
    label: "浙江",
    children: [
      { value: "hangzhou", label: "杭州" },
      { value: "ningbo", label: "宁波" },
    ],
  },
]);
</script>
```

`prop-value`/`prop-label`/`prop-children` 自定义节点字段名。

---

### 2️⃣ 多选 + 选择任意层级

```vue
<jh-cascader
  v-model="form.categories"
  label="分类"
  multiple
  check-strictly
  :options="categoryOptions"
/>
```

`multiple` 开启多选，`check-strictly` 允许选择任意层级（含父节点）。

---

### 3️⃣ 可搜索 + 懒加载

```vue
<jh-cascader
  v-model="form.org"
  label="组织"
  filterable
  lazy
  expand-trigger="hover"
  :options="orgOptions"
/>
```

---

## Props 属性

### 基础属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标题名称 | `string` | `级联选择` |
| showColon | 冒号，标题与输入框之间加英文冒号 | `boolean` | `true` |
| prop | 字段属性，用于表单校验，确定是哪个字段，选择字段后自动会设置数据绑定 | `Array` | - |
| modelValue / v-model | 数据绑定 | `string \| number \| Array` | - |
| placeholder | 占位提示 | `string` | `请选择` |
| tip | 描述性文案 | `string` | - |
| status | 状态 | `string` | `default` |
| size | 尺寸 | `string` | `default` |
| labelWidth | 标签宽度，styleY样式，比如500px,100%,默认450px | `string` | - |
| maxWidth | 最大宽度，styleY样式，比如500px,100%,默认450px | `string` | `450px` |
| viewer | 阅读模式，阅读模式将输入框渲染为span | `boolean` | `false` |
| labelClass | 标签样式 | `Array` | `[]` |
| appendText | 后缀 | `string` | - |
| multiple | 多选 | `boolean` | - |
| checkStrictly | 任意层级 | `boolean` | - |
| filterable | 可搜索 | `boolean` | - |
| clearable | 可清除 | `boolean` | - |
| separator | 分隔符 | `string` | - |
| showAllLevels | 完整路径，输入框内是否显示选中值的完整路径 | `boolean` | - |
| collapseTags | 折叠tag，多选模式下是否折叠Tag | `boolean` | - |
| expandTrigger | 展开方式，次级菜单的展开方式 | `string` | `click` |
| options | 数据源 | `Array` | `[内置示例]` |
| lazy | 懒加载，懒加载必须设置叶子节点，否则无法选中 | `boolean` | - |
| propValue | 值属性，存储值的属性名，默认value | `string` | - |
| propLabel | 显示属性，默认label | `string` | - |
| propChildren | 子属性，子元素属性名，默认children | `string` | - |
| leaf | 叶子标志，叶子节点标志位属性名，默认leaf | `string` | - |
| debounce | 防抖延迟，毫秒 | `number` | - |
| tagType | 标签类型 | `string` | - |

> ⚠️ **禁用/只读用 `status`**（`"disabled"` / `"readonly"`），不是 `disabled`。
> ⚠️ **`tagType` 的 `"defalut"` 是组件声明中的拼写**（保留原样），使用时注意。
> ⚠️ **字段名自定义用 `prop-value`/`prop-label`/`prop-children`**。

---

## Events 事件

| 事件名            | 说明                  | 回调参数                              |
| ----------------- | --------------------- | ------------------------------------- |
| update:modelValue | v-model 更新时触发    | `(value: string \| number \| array) => void` |
| blur              | 失去焦点时触发        | `() => void`                          |
| focus             | 获得焦点时触发        | `() => void`                          |
| expandChange      | 展开层级改变时触发    | `() => void`                          |
| visibleChange     | 下拉显示/隐藏切换时触发 | `() => void`                        |
| removeTag         | 多选移除标签时触发    | `() => void`                          |
| lazyLoad          | 懒加载时触发          | `() => void`                          |

---

## 常见场景

### 场景 1：省市区选择

```vue
<jh-cascader v-model="form.area" label="地区" :options="areaOptions" />
```

### 场景 2：多选分类（任意层级）

```vue
<jh-cascader
  v-model="form.categories"
  label="分类"
  multiple
  check-strictly
  collapse-tags
  :options="categoryOptions"
/>
```

### 场景 3：只读查看

```vue
<jh-cascader v-model="form.region" label="地区" status="readonly" :options="regionOptions" />
```

### 场景 4：可搜索 + 悬浮展开

```vue
<jh-cascader v-model="form.org" label="组织" filterable expand-trigger="hover" :options="orgOptions" />
```

---

## 注意事项

1. **状态用 `status`，无 `disabled`**
   - `status="disabled"` 禁用，`status="readonly"` 只读

2. **字段名自定义**
   - 用 `prop-value`/`prop-label`/`prop-children` 指定节点字段（如 `{ id, name, children }` 时设对应值）

3. **多选 + 任意层级**
   - `multiple` 开多选，`check-strictly` 允许直接选父节点（不强制选到叶子）

4. **返回值形态**
   - `emitPath` 控制是否返回完整路径数组；`showAllLevels` 控制输入框是否显示完整路径

5. **label 默认带冒号**
   - `showColon` 默认 `true`，不需冒号传 `:show-colon="false"`

6. **懒加载**
   - `lazy` 开启动态加载子节点，配合 `leaf` 标识叶子节点

**推荐作为平台统一的级联选择组件使用！**
