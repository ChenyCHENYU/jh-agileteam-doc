# jh-select - 字典选择组件

> 平台统一的字典选择组件，基于字典数据源的下拉选择，适用于状态、类型等需要从字典表选择的场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-select />`。

---

## 基本用法

### 1️⃣ 字典选择（最常用，logicType 配置式）

```ts
import { BusLogicDataType } from "@jhlc/types/src/logical-data";

export const queryItems: BaseQueryItemDesc<any>[] = [
  {
    name: "status",
    label: "状态",
    logicType: BusLogicDataType.dict,
    logicValue: "sys_status",
  },
];
```

> **源码映射规则**（`getFormItemByLogicType`）：
> - `BusLogicDataType.dict` → `SelectComponent`
> - `BusLogicDataType.company` → `SelectComponent`
> - ⚠️ `BusLogicDataType.enums` → **`InputComponent`（普通输入框）**，并非 SelectComponent

---

### 2️⃣ 静态选项

```vue
<jh-select
  v-model="form.type"
  datasource-type="static"
  :items="[
    { label: '是', value: 1 },
    { label: '否', value: 0 }
  ]"
/>
```

---

### 3️⃣ 多选模式

```vue
<jh-select v-model="form.types" logicType="BusLogicDataType.dict" logicValue="sys_type" multiple />
```

---

## Props 属性

### 基础属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 数据绑定 | `string \| number \| array \| boolean` | - |
| static | 静态仅用来展示和点击 | `boolean` | - |
| enableRefreshDict | 是否启用字典刷新 | `boolean` | `true` |
| label | 标题名称 | `string` | `下拉选择框` |
| showColon | 标题与输入框之间加英文冒号 | `boolean` | `true` |
| prop | 字段属性，用于表单校验确定字段，选择字段后自动设置数据绑定 | `array` | - |
| placeholder | 占位提示 | `string` | `请选择或输入` |
| tip | 描述性文案 | `string` | - |
| status | 状态 | `string` | `default` |
| size | 尺寸 | `string` | `default` |
| labelWidth | 标签宽度（styleY 样式，如 500px、100%，默认 450px） | `string` | - |
| maxWidth | 最大宽度（styleY 样式，如 500px、100%，默认 450px） | `string` | `450px` |
| viewer | 阅读模式，将输入框渲染为 span | `boolean` | `false` |
| labelClass | 标签样式 | `array` | `[]` |
| appendText | 后缀 | `string` | - |
| ctrlHidden | 控件隐藏表达式 | `string` | - |
| multiDataFormat | 数据格式（多选时数据存储格式） | `string` | `array` |
| collapseTag | 多选折叠，多选值是否折叠展示 | `boolean` | - |
| teleported | 是否插入 body | `boolean` | `true` |

### 交互配置

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| filterable | 可模糊搜索 | `boolean` | - |
| multiple | 可多选 | `boolean` | `false` |
| clearable | 可清除 | `boolean` | - |
| offset | 下拉选项偏移量 | `number` | - |
| allowCreate | 创建新条目 | `boolean` | - |

### 数据配置

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dataType | 数据类型 | `string` | `string` |
| datasourceType | 数据来源 | `string` | `static` |
| items | 选项 | `array` | - |
| _optionsDsId | 查询接口 | `string` | - |
| remote | 后端搜索 | `boolean` | - |
| remoteSearchKey | 搜索关键字 | `array` | - |
| _optionsDataAttr | 数据属性 | `array \| string` | `[""]` |
| _optionsValueAttr | 值属性 | `array \| string` | `[""]` |
| _optionsValueExpr | 值表达式 | `Function` | - |
| _optionsLabelAttr | 标签属性 | `array \| string` | `[""]` |
| _optionsLabelExpr | 标签表达式 | `Function` | - |
| _fixQueryParam | 固定查询参数 | `object` | `{}` |
| fetchDataCb | 数据获取回调 | `Function` | - |
| _optionsQuery | 查询参数 | `array` | `[]` |
| _optionsQueryAttr | 查询属性 | `array` | - |
| cid | 组件实例标识 | `string` | - |

> ⚠️ **没有 `dictType`/`disabled` 属性**。字典数据通过 BaseQuery/BaseForm 的 `logicType: BusLogicDataType.dict` + `logicValue` 自动加载；禁用用 `status="disabled"`（非 disabled）。

---

## Events 事件

| 事件名            | 说明               | 回调参数          |
| ----------------- | ------------------ | ----------------- |
| update:modelValue | v-model 更新时触发 | `(value) => void` |
| change            | 选中值改变时触发   | `(value) => void` |
| blur              | 失去焦点时触发     | `() => void`      |
| select            | 选中选项时触发     | `() => void`      |
| visibleChange     | 下拉显示/隐藏切换  | `() => void`      |

---

## 常见场景

### 场景 1：状态选择（BaseQuery/BaseForm 配置式，推荐）

```ts
{
  name: "status",
  label: "状态",
  logicType: BusLogicDataType.dict,
  logicValue: "sys_status",
}
```

通过 `logicType=dict` + `logicValue`（字典编码）自动加载选项。

---

### 场景 2：静态选项

```vue
<jh-select
  v-model="form.gender"
  datasource-type="static"
  :items="[
    { label: '男', value: 1 },
    { label: '女', value: 2 }
  ]"
/>
```

---

### 场景 3：禁用/只读

```vue
<jh-select v-model="form.status" :status="isView ? 'readonly' : 'default'" />
```

> 用 `status` 控制状态，不是 `disabled`。

---

## 注意事项

1. **字典选择走 logicType 配置式**
   - 在 BaseQuery/BaseForm 中用 `logicType: BusLogicDataType.dict` + `logicValue`
   - 不要用不存在的 `dict-type` / `dictType` 属性

2. **v-model 类型**
   - 单选: `string | number | boolean`
   - 多选: `string[] | number[]`

3. **多选返回类型**
   - 由 `dataType`（`"array"`/`"string"`）控制

4. **label 冒号**
   - `showColon` 默认 `true`，表单内 label 会带冒号；如需关闭传 `:show-colon="false"`

---

## 🎯 真实项目示例

### 示例 1：查询条件状态筛选

```ts
export const queryItems: BaseQueryItemDesc<any>[] = [
  {
    name: "status",
    label: "状态",
    logicType: BusLogicDataType.dict,
    logicValue: "sys_status",
  },
];
```

### 示例 2：静态是/否选择

```vue
<jh-select
  v-model="form.enabled"
  datasource-type="static"
  :items="[
    { label: '是', value: 1 },
    { label: '否', value: 0 }
  ]"
/>
```

**推荐作为平台统一的选择组件使用！**

> 字典选择通过 BaseQuery/BaseForm 的 `logicType=dict` + `logicValue` 配置式自动加载；静态选项用 `datasourceType="static"` + `items`。已全局注册，可直接使用 `<jh-select />`。
