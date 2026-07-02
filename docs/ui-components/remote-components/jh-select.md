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

| 参数                 | 说明                        | 类型                                       | 默认值      |
| -------------------- | --------------------------- | ------------------------------------------ | ----------- |
| modelValue / v-model | 绑定值                      | `string \| number \| string[] \| boolean`  | -           |
| datasourceType       | 数据源类型                  | `"static" \| "interface"`                  | -           |
| items                | 静态选项（datasourceType=static 时） | `Array<{label, value}>`           | -           |
| showColon            | label 是否显示冒号          | `boolean`                                  | `true`      |
| label                | label 文本                  | `string`                                   | -           |
| placeholder          | 占位提示                    | `string`                                   | -           |
| multiple             | 是否多选                    | `boolean`                                  | `false`     |
| status               | 控件状态（禁用/只读用此属性） | `"default" \| "disabled" \| "readonly"`   | `"default"` |
| filterable           | 是否可搜索                  | `boolean`                                  | -           |
| dataType             | 多选返回类型                | `"array" \| "string"`                      | -           |
| collapseTag          | 多选时是否折叠 Tag          | `boolean`                                  | -           |
| teleported           | 下拉面板是否插入 body       | `boolean`                                  | -           |
| allowCreate          | 是否允许创建新项            | `boolean`                                  | -           |
| size                 | 控件尺寸                    | `"small" \| "default" \| "large"`          | -           |

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
