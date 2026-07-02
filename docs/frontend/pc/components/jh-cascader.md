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

| 参数            | 说明                          | 类型                                            | 默认值 |
| --------------- | ----------------------------- | ----------------------------------------------- | ------ |
| modelValue / v-model | 绑定值                    | `string \| number \| array`                     | -      |
| label           | label 文本                    | `string`                                        | `""`   |
| showColon       | label 是否显示冒号            | `boolean`                                       | `true` |
| prop            | 表单字段（校验用）            | `array`                                         | -      |
| placeholder     | 占位提示                      | `string`                                        | `""`   |
| tip             | 提示信息                      | `string`                                        | -      |
| status          | 控件状态                      | `"default" \| "disabled" \| "readonly"`         | `""`   |
| size            | 控件尺寸                      | `"small" \| "default" \| "large"`               | `""`   |
| labelWidth      | label 宽度                    | `string`                                        | -      |
| maxWidth        | 最大宽度                      | `string`                                        | `""`   |
| labelClass      | label 自定义类名              | `array`                                         | `[]`   |
| appendText      | 后置文本                      | `string`                                        | -      |
| separator       | 选项分隔符                    | `string`                                        | `""`   |
| options         | 选项数据（树状结构）          | `array`                                         | `[内置示例]` |
| propValue       | 节点值字段名                  | `string`                                        | `""`   |
| propLabel       | 节点标签字段名                | `string`                                        | `""`   |
| propChildren    | 子节点字段名                  | `string`                                        | `""`   |
| multiple        | 是否多选                      | `boolean`                                       | -      |
| collapseTags    | 多选时是否折叠标签            | `boolean`                                       | -      |
| tagType         | 标签类型                      | `"defalut" \| "primary" \| "success" \| "info" \| "warning" \| "danger"` | `""` |
| checkStrictly   | 是否可选择任意层级（含父节点）| `boolean`                                       | -      |
| filterable      | 是否可搜索                    | `boolean`                                       | -      |
| clearable       | 是否可清空                    | `boolean`                                       | -      |
| showAllLevels   | 是否显示完整路径              | `boolean`                                       | -      |
| emitPath        | 是否返回完整路径数组          | `boolean`                                       | -      |
| lazy            | 是否懒加载                    | `boolean`                                       | -      |
| leaf            | 叶子节点标识字段              | `string`                                        | -      |
| expandTrigger   | 展开触发方式                  | `"click" \| "hover"`                            | `""`   |
| debounce        | 搜索防抖（ms）                | `number`                                        | -      |
| viewer          | 是否为只读查看态              | `boolean`                                       | `false` |

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
