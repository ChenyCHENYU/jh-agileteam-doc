# BaseForm 表单组件

> 来源：`@jhlc/common-core` 远程组件

BaseForm 是一个功能强大的表单组件，支持多列布局、数据验证、逻辑数据类型、自定义组件等功能。适用于新增、编辑场景。

## 📦 导入方式

```typescript
// 全局注册（已在项目中配置）
// 直接使用 <BaseForm /> 即可

// 类型导入
import type { BaseFormItemDesc } from "@jhlc/common-core/src/components/form/common/type";
```

## 🚀 基本用法

```vue
<template>
  <BaseForm
    ref="formRef"
    :form="form"
    :items="formItems"
    :columns="2"
    label-width="100px"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";

const formRef = ref();
const form = reactive({
  userName: "",
  phone: "",
  userType: ""
});

const formItems = computed(() => [
  {
    name: "userName",
    label: "用户名",
    required: true,
    placeholder: "请输入用户名"
  },
  {
    name: "phone",
    label: "手机号",
    placeholder: "请输入手机号"
  },
  {
    name: "userType",
    label: "用户类型",
    logicType: "dict",
    logicValue: "USER_TYPE"
  }
]);
</script>
```

---

## 📋 Props 属性

| 属性名       | 类型                           | 默认值    | 说明             |
| ------------ | ------------------------------ | --------- | ---------------- |
| `form`       | `Object`                       | -         | 表单数据对象     |
| `items`      | `BaseFormItemDesc[]`           | `[]`      | 表单项配置数组   |
| `columns`    | `number`                       | -         | 列数             |
| `labelWidth` | `string`                       | -         | 标签宽度         |
| `size`       | `'default' \| 'large' \| 'small'` | -      | 表单尺寸         |
| `disabled`   | `boolean`                      | `false`   | 是否禁用         |
| `isViewer`   | `boolean`                      | `false`   | 是否查看模式     |
| `noForm`     | `boolean`                      | `false`   | 不使用 form 包裹 |
| `style`      | `string \| Object`             | -         | 自定义样式       |
| `classnames` | `Array \| string`              | -         | 自定义类名       |

---

## 📋 Expose 方法 (通过 ref 调用)

| 方法名            | 参数                        | 返回值 | 说明           |
| ----------------- | --------------------------- | ------ | -------------- |
| `validate`        | `cb: (valid: boolean) => void` | -   | 验证表单       |
| `setDefaultValue` | -                           | -      | 设置默认值     |
| `reset`           | -                           | -      | 重置表单       |
| `resetFields`     | -                           | -      | 重置表单字段   |

---

## 📋 表单项配置 BaseFormItemDesc

### 基础属性

```typescript
interface BaseFormItemDesc<T = any> {
  // 字段名（绑定 form 对象的属性名）
  name?: string;
  // 标签文本
  label?: string;
  // 标签宽度
  labelWidth?: string;
  // 显示冒号
  showColon?: boolean;
  // 占位提示
  placeholder?: string;
  // 栅格数（24 格布局）
  span?: number;
  // 是否禁用
  disabled?: boolean | ((form: T) => boolean);
  // 是否可清空
  clearable?: boolean;
  // 是否显示
  show?: boolean | ((form: T) => boolean);
}
```

### 校验规则

```typescript
{
  name: "userName",
  label: "用户名",
  // 必填
  required: true,
  // 或使用函数动态判断
  required: (form) => form.userType === "admin",
  // 校验提示
  message: "请输入用户名",
  // 自定义校验规则
  rules: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "只能包含字母、数字和下划线",
      trigger: "blur"
    },
    {
      validator: (rule, value, callback) => {
        if (value === "admin") {
          callback(new Error("不能使用 admin 作为用户名"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
}
```

### 逻辑数据类型

组件会根据 `logicType` 自动选择合适的表单控件：

```typescript
{
  name: "status",
  label: "状态",
  // 字典类型 - 自动渲染为下拉选择
  logicType: "dict",
  logicValue: "ORDER_STATUS"
}

{
  name: "createTime",
  label: "创建时间",
  // 日期类型 - 自动渲染为日期选择器
  logicType: "date"
}

{
  name: "createDatetime",
  label: "创建时间",
  // 日期时间类型
  logicType: "datetime"
}

{
  name: "amount",
  label: "金额",
  // 数字类型 - 自动渲染为数字输入框
  logicType: "number"
}

{
  name: "isActive",
  label: "是否启用",
  // 布尔类型 - 自动渲染为开关
  logicType: "boolean"
}

{
  name: "userId",
  label: "负责人",
  // 用户类型 - 自动渲染为用户选择器
  logicType: "user"
}

{
  name: "deptId",
  label: "部门",
  // 部门类型 - 自动渲染为部门选择器
  logicType: "dept"
}

{
  name: "remark",
  label: "备注",
  // 多行文本
  logicType: "textarea"
}
```

### 默认值配置

```typescript
{
  name: "createTime",
  label: "创建时间",
  logicType: "date",
  // 支持多种默认值类型
  defaultValue: "currentDay"     // 当天
  // defaultValue: "currentMonth"  // 当月
  // defaultValue: "currentYear"   // 当年
}

// 日期范围默认值
{
  type: "range",
  name: "dateRange",
  startName: "startDate",
  endName: "endDate",
  logicType: "date",
  defaultValue: "recentDay7"      // 最近 7 天
  // defaultValue: "recentDay30"   // 最近 30 天
  // defaultValue: "rangeDayCurrentMonth1ToToday"  // 当月1号到今天
}
```

**支持的默认值类型：**

| 值                              | 说明                    |
| ------------------------------- | ----------------------- |
| `currentDay`                    | 当天 (2024-09-22)       |
| `currentMonth`                  | 当月 (2024-09)          |
| `currentYear`                   | 当年 (2024)             |
| `currentDept`                   | 当前部门                |
| `recentDay3`                    | 最近 3 天               |
| `recentDay7`                    | 最近 7 天               |
| `recentDay30`                   | 最近 30 天              |
| `rangeDatetimeToday`            | 当天 0 点到 23 点       |
| `rangeDayCurrentMonth1ToToday`  | 当月 1 号到今天         |
| `rangeDayCurrentMonth1ToLastDay`| 当月 1 号到月末         |

### 范围输入

```typescript
{
  type: "range",
  label: "日期范围",
  startName: "startDate",
  endName: "endDate",
  logicType: "date",
  rangeSeparator: "至",
  // 自定义起止表单项
  startFormItem: {
    placeholder: "开始日期"
  },
  endFormItem: {
    placeholder: "结束日期"
  }
}
```

### 自定义组件

```typescript
import { h } from "vue";

// 方式一：使用 component
{
  name: "color",
  label: "颜色",
  component: (form) => ({
    tag: "el-color-picker",
    props: { showAlpha: true }
  })
}

// 方式二：使用 componentVNode
{
  name: "custom",
  label: "自定义",
  componentVNode: (form) => {
    return h("div", { class: "custom-component" }, [
      h("span", form.custom),
      h("el-button", { onClick: () => {} }, "选择")
    ]);
  }
}

// 方式三：自定义属性
{
  name: "amount",
  label: "金额",
  logicType: "number",
  customProps: (form) => ({
    min: 0,
    max: 10000,
    precision: 2,
    step: 100
  })
}
```

---

## 💡 完整示例

### 基础表单

```vue
<template>
  <el-card>
    <BaseForm
      ref="formRef"
      :form="form"
      :items="formItems"
      :columns="2"
      label-width="100px"
    />
    <div class="form-footer">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import type { BaseFormItemDesc } from "@jhlc/common-core/src/components/form/common/type";

const formRef = ref();

const form = reactive({
  orderNo: "",
  customerName: "",
  amount: 0,
  orderDate: "",
  status: "",
  remark: ""
});

const formItems = computed<BaseFormItemDesc[]>(() => [
  {
    name: "orderNo",
    label: "订单号",
    required: true,
    placeholder: "请输入订单号"
  },
  {
    name: "customerName",
    label: "客户名称",
    required: true,
    placeholder: "请输入客户名称"
  },
  {
    name: "amount",
    label: "订单金额",
    logicType: "number",
    required: true,
    customProps: () => ({
      min: 0,
      precision: 2
    })
  },
  {
    name: "orderDate",
    label: "订单日期",
    logicType: "date",
    required: true
  },
  {
    name: "status",
    label: "订单状态",
    logicType: "dict",
    logicValue: "ORDER_STATUS"
  },
  {
    name: "remark",
    label: "备注",
    logicType: "textarea",
    span: 24
  }
]);

const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      console.log("表单数据:", form);
      // 提交逻辑
    }
  });
};

const handleReset = () => {
  formRef.value?.resetFields();
};
</script>
```

### 动态表单

```vue
<template>
  <BaseForm
    ref="formRef"
    :form="form"
    :items="dynamicItems"
    :columns="2"
    label-width="100px"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";

const form = reactive({
  type: "person",
  name: "",
  idCard: "",
  companyName: "",
  businessLicense: ""
});

const dynamicItems = computed(() => {
  const baseItems = [
    {
      name: "type",
      label: "类型",
      logicType: "dict",
      logicValue: "CUSTOMER_TYPE"
    }
  ];

  // 根据类型动态显示不同字段
  if (form.type === "person") {
    return [
      ...baseItems,
      { name: "name", label: "姓名", required: true },
      { name: "idCard", label: "身份证号", required: true }
    ];
  } else {
    return [
      ...baseItems,
      { name: "companyName", label: "公司名称", required: true },
      { name: "businessLicense", label: "营业执照", required: true }
    ];
  }
});
</script>
```

---

## ⚠️ 注意事项

1. **字段名使用 `name` 而非 `prop`**

   ```typescript
   // ✅ 正确
   { name: "userName", label: "用户名" }

   // ❌ 错误
   { prop: "userName", label: "用户名" }
   ```

2. **logicType 会自动选择组件**

   - 不需要手动指定 `type: "select"`
   - 设置 `logicType: "dict"` 即可

3. **范围类型需要设置 startName 和 endName**

   ```typescript
   {
     type: "range",
     startName: "startDate",
     endName: "endDate",
     logicType: "date"
   }
   ```

4. **使用 computed 包装 items 实现响应式**

   ```typescript
   const formItems = computed(() => [...]);
   ```

---

## 📚 相关文档

- [BaseQuery 查询组件](./base-query)
- [BaseTable 表格组件](./base-table)
