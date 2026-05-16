# BaseQuery 查询组件

> 来源：`@jhlc/common-core` 远程组件

BaseQuery 是一个功能强大的查询条件组件，支持多列布局、条件展开收起、自动查询、批量筛选等功能。适用于列表页的搜索条件区域。

## 📦 导入方式

```typescript
// 全局注册（已在项目中配置）
// 直接使用 <BaseQuery /> 即可

// 类型导入
import type { BaseQueryItemDesc } from "@jhlc/common-core/src/components/form/base-query/type";
```

## 🚀 基本用法

```vue
<template>
  <BaseQuery
    :form="queryParam"
    :items="queryItems"
    @select="handleSearch"
    @reset="handleReset"
  />
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";

const queryParam = reactive({
  orderNo: "",
  customerName: "",
  status: "",
  startDate: "",
  endDate: ""
});

const queryItems = computed(() => [
  {
    name: "orderNo",
    label: "订单号",
    placeholder: "请输入订单号"
  },
  {
    name: "customerName",
    label: "客户名称",
    placeholder: "请输入客户名称"
  },
  {
    name: "status",
    label: "状态",
    logicType: "dict",
    logicValue: "ORDER_STATUS"
  },
  {
    type: "range",
    label: "日期范围",
    startName: "startDate",
    endName: "endDate",
    logicType: "date"
  }
]);

const handleSearch = () => {
  console.log("查询条件:", queryParam);
  // 执行查询
};

const handleReset = () => {
  console.log("重置查询");
};
</script>
```

---

## 📋 Props 属性

| 属性名           | 类型                             | 默认值  | 说明                   |
| ---------------- | -------------------------------- | ------- | ---------------------- |
| `form`           | `Object`                         | -       | 查询表单数据对象       |
| `items`          | `BaseQueryItemDesc[]`            | `[]`    | 查询项配置数组         |
| `columns`        | `4 \| 5 \| 6 \| 7 \| 8 \| 9`     | `4`     | 列数                   |
| `labelWidth`     | `string`                         | -       | 标签宽度               |
| `size`           | `'small' \| 'default' \| 'large'`| `''`    | 表单尺寸               |
| `spaceX`         | `number`                         | -       | 水平间距               |
| `spaceY`         | `number`                         | -       | 垂直间距               |
| `suppressExpand` | `boolean`                        | `false` | 禁止展开收起           |
| `autoSelect`     | `boolean`                        | `true`  | 值变化时自动触发查询   |
| `button`         | `boolean`                        | `true`  | 是否显示查询/重置按钮  |
| `tools`          | `ActionButtonDesc[]`             | -       | 自定义按钮             |
| `class`          | `Array \| String \| Object`      | -       | 自定义类名             |
| `classnames`     | `Array`                          | -       | 自定义类名数组         |

---

## 📋 Events 事件

| 事件名   | 参数 | 说明               |
| -------- | ---- | ------------------ |
| `select` | -    | 点击查询按钮时触发 |
| `reset`  | -    | 点击重置按钮时触发 |

---

## 📋 Expose 方法 (通过 ref 调用)

| 方法名            | 参数 | 返回值 | 说明         |
| ----------------- | ---- | ------ | ------------ |
| `setDefaultValue` | -    | -      | 设置默认值   |
| `resetQuery`      | -    | -      | 重置查询条件 |

---

## 📋 查询项配置 BaseQueryItemDesc

### 基础属性

```typescript
interface BaseQueryItemDesc<T = any> {
  // 字段名
  name: string;
  // 标签文本
  label: string;
  // 占位提示
  placeholder?: string;
  // 是否必填
  required?: boolean;
  // 是否禁用
  disabled?: boolean | ((form: T) => boolean);
  // 是否可清空
  clearable?: boolean;
  // 显示冒号
  showColon?: boolean;
  // 栅格数
  span?: number;
  // 宽度百分比
  widthScale?: number;
  // 是否显示
  show?: () => boolean;
}
```

### 逻辑数据类型

```typescript
// 字典类型 - 下拉选择
{
  name: "status",
  label: "状态",
  logicType: "dict",
  logicValue: "ORDER_STATUS"
}

// 日期类型
{
  name: "createDate",
  label: "创建日期",
  logicType: "date"
}

// 月份类型
{
  name: "month",
  label: "月份",
  logicType: "month",
  dateFormat: "YYYY-MM"
}

// 日期时间
{
  name: "createTime",
  label: "创建时间",
  logicType: "datetime"
}

// 用户选择
{
  name: "userId",
  label: "负责人",
  logicType: "user"
}

// 部门选择
{
  name: "deptId",
  label: "部门",
  logicType: "dept"
}
```

### 范围查询

```typescript
{
  type: "range",
  label: "日期范围",
  startName: "startDate",
  endName: "endDate",
  logicType: "date",
  rangeSeparator: "至",
  // 默认最近7天
  defaultValue: "recentDay7"
}

{
  type: "range",
  label: "金额范围",
  startName: "minAmount",
  endName: "maxAmount",
  logicType: "number",
  startFormItem: {
    placeholder: "最小金额"
  },
  endFormItem: {
    placeholder: "最大金额"
  }
}
```

### 默认值配置

```typescript
// 静态默认值
{
  name: "status",
  label: "状态",
  defaultValue: "1"
}

// 动态默认值
{
  name: "createDate",
  label: "创建日期",
  logicType: "date",
  defaultValue: "currentDay"    // 当天
}

// 日期范围默认值
{
  type: "range",
  label: "日期",
  startName: "startDate",
  endName: "endDate",
  defaultValue: "recentDay7"    // 最近7天
}

// 异步默认值
{
  name: "deptId",
  label: "部门",
  defaultValue: async () => {
    // 异步获取默认值
    return await getCurrentUserDept();
  }
}
```

**支持的默认值类型：**

| 值                              | 说明                    |
| ------------------------------- | ----------------------- |
| `currentDay`                    | 当天                    |
| `currentMonth`                  | 当月                    |
| `currentYear`                   | 当年                    |
| `currentDept`                   | 当前部门                |
| `recentDay3`                    | 最近 3 天               |
| `recentDay7`                    | 最近 7 天               |
| `recentDay30`                   | 最近 30 天              |
| `rangeDatetimeToday`            | 当天时间范围            |
| `rangeDayCurrentMonth1ToToday`  | 当月 1 号到今天         |

### 自动查询控制

```typescript
// 全局控制：值变化时自动查询
<BaseQuery :autoSelect="true" />

// 单项控制：该字段值变化时不自动查询
{
  name: "keyword",
  label: "关键字",
  autoSelect: false   // 输入完成后手动点击查询
}
```

### 批量筛选

```typescript
{
  name: "orderNo",
  label: "订单号",
  multiQuery: true,   // 开启批量筛选，支持粘贴多个值
  placeholder: "支持批量筛选"
}
```

### 固定查询条件

```typescript
{
  name: "companyId",
  label: "公司",
  isFixValue: true,   // 重置时不清空此字段
  show: () => false   // 隐藏但参与查询
}
```

### 自定义组件

```typescript
// 方式一：使用 component
{
  name: "customField",
  label: "自定义",
  component: (form) => ({
    tag: "el-cascader",
    props: {
      options: cascaderOptions,
      clearable: true
    }
  })
}

// 方式二：自定义属性
{
  name: "amount",
  label: "金额",
  logicType: "number",
  customProps: (form) => ({
    min: 0,
    max: 999999,
    precision: 2
  })
}
```

### 历史记录置顶

```typescript
{
  name: "productCode",
  label: "产品编码",
  logicType: "dict",
  logicValue: "PRODUCT_CODE",
  historyTop: true    // 最近选择的选项置顶显示
}
```

---

## 💡 完整示例

### 标准查询区域

```vue
<template>
  <BaseQuery
    ref="queryRef"
    :form="queryParam"
    :items="queryItems"
    :columns="4"
    @select="handleSearch"
    @reset="handleReset"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import type { BaseQueryItemDesc } from "@jhlc/common-core/src/components/form/base-query/type";

const queryRef = ref();

const queryParam = reactive({
  orderNo: "",
  customerName: "",
  status: "",
  startDate: "",
  endDate: "",
  productType: ""
});

const queryItems = computed<BaseQueryItemDesc[]>(() => [
  {
    name: "orderNo",
    label: "订单号",
    placeholder: "请输入订单号",
    multiQuery: true  // 支持批量筛选
  },
  {
    name: "customerName",
    label: "客户名称",
    placeholder: "请输入客户名称"
  },
  {
    name: "status",
    label: "订单状态",
    logicType: "dict",
    logicValue: "ORDER_STATUS",
    clearable: true
  },
  {
    type: "range",
    label: "创建日期",
    startName: "startDate",
    endName: "endDate",
    logicType: "date",
    defaultValue: "recentDay7"
  },
  {
    name: "productType",
    label: "产品类型",
    logicType: "dict",
    logicValue: "PRODUCT_TYPE"
  }
]);

const handleSearch = () => {
  console.log("查询条件:", queryParam);
  // 调用接口查询
};

const handleReset = () => {
  // 重置后自动触发查询
  handleSearch();
};

onMounted(() => {
  // 设置默认值后查询
  queryRef.value?.setDefaultValue();
  handleSearch();
});
</script>
```

### 带自定义按钮

```vue
<template>
  <BaseQuery
    :form="queryParam"
    :items="queryItems"
    :tools="customTools"
    @select="handleSearch"
    @reset="handleReset"
  />
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";

const queryParam = reactive({
  keyword: ""
});

const queryItems = computed(() => [
  {
    name: "keyword",
    label: "关键字",
    placeholder: "请输入关键字"
  }
]);

const customTools = computed(() => [
  {
    name: "export",
    label: "导出",
    icon: "Download",
    onClick: () => {
      console.log("导出");
    }
  },
  {
    name: "import",
    label: "导入",
    icon: "Upload",
    onClick: () => {
      console.log("导入");
    }
  }
]);

const handleSearch = () => {};
const handleReset = () => {};
</script>
```

---

## ⚠️ 注意事项

1. **范围类型需要设置 startName 和 endName**

   ```typescript
   {
     type: "range",
     startName: "startDate",
     endName: "endDate",
     logicType: "date"
   }
   ```

2. **autoSelect 默认为 true**

   - 值变化时会自动触发 select 事件
   - 如需手动控制，设置 `autoSelect: false`

3. **使用 computed 包装 items**

   ```typescript
   const queryItems = computed(() => [...]);
   ```

4. **默认值需要调用 setDefaultValue**

   ```typescript
   onMounted(() => {
     queryRef.value?.setDefaultValue();
   });
   ```

5. **isFixValue 字段重置时不清空**

   - 适用于隐藏的固定查询条件

---

## � 高级用法：联动查询

### 三级联动（省市区）示例

BaseQuery 支持复杂的联动查询场景，通过 `customProps`、`disabled`、`autoSelect` 等配置实现多级联动。

#### 方案一：使用级联选择器（推荐单字段存储）

```vue
<template>
  <BaseQuery
    :form="queryParam"
    :items="queryItems"
    @select="handleSearch"
  />
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import type { BaseQueryItemDesc } from "@jhlc/common-core/src/components/form/base-query/type";

// 省市区数据
const regionOptions = [
  {
    value: '110000',
    label: '北京市',
    children: [
      { value: '110100', label: '市辖区', children: [
        { value: '110101', label: '东城区' },
        { value: '110102', label: '西城区' }
      ]}
    ]
  },
  // ... 更多数据
];

const queryParam = reactive({
  region: []  // 存储 [省code, 市code, 区code]
});

const queryItems = computed<BaseQueryItemDesc[]>(() => [
  {
    name: "region",
    label: "省市区",
    component: (form) => ({
      tag: "el-cascader",
      props: {
        options: regionOptions,
        clearable: true,
        placeholder: "请选择省市区",
        onChange: (value) => {
          console.log("选择的省市区：", value);
        }
      }
    })
  }
]);

const handleSearch = () => {
  console.log("查询条件:", queryParam);
};
</script>
```

#### 方案二：分成3个独立字段实现联动查询

适用于需要分别存储省、市、区的场景，支持通过接口动态加载下级选项。

```vue
<template>
  <BaseQuery
    :form="queryParam"
    :items="queryItems"
    :auto-select="false"
    @select="handleSearch"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import type { BaseQueryItemDesc } from "@jhlc/common-core/src/components/form/base-query/type";
import request from "@/utils/request";

// 动态选项数据
const cityOptions = ref([]);
const districtOptions = ref([]);

const queryParam = reactive({
  province: '',
  city: '',
  district: ''
});

const queryItems = computed<BaseQueryItemDesc[]>(() => [
  {
    name: "province",
    label: "省份",
    logicType: "dict",
    logicValue: "PROVINCE_LIST",
    placeholder: "请选择省份",
    autoSelect: false,  // 不自动触发查询
    clearable: true,
    customProps: (form) => ({
      onChange: async (value: string) => {
        // 重置下级选项
        form.city = '';
        form.district = '';
        cityOptions.value = [];
        districtOptions.value = [];
        
        if (value) {
          // 调用接口查询城市列表
          try {
            const res = await request.get('/api/region/cities', { 
              provinceCode: value 
            });
            cityOptions.value = res.data || [];
          } catch (error) {
            console.error('查询城市失败：', error);
          }
        }
      }
    })
  },
  {
    name: "city",
    label: "城市",
    logicType: "dict",
    logicValue: "CITY_LIST",
    placeholder: "请先选择省份",
    disabled: (form) => !form.province,  // 未选省份时禁用
    autoSelect: false,
    clearable: true,
    customProps: (form) => ({
      onChange: async (value: string) => {
        // 重置下级选项
        form.district = '';
        districtOptions.value = [];
        
        if (value) {
          // 调用接口查询区县列表
          try {
            const res = await request.get('/api/region/districts', { 
              cityCode: value 
            });
            districtOptions.value = res.data || [];
          } catch (error) {
            console.error('查询区县失败：', error);
          }
        }
      }
    })
  },
  {
    name: "district",
    label: "区县",
    logicType: "dict",
    logicValue: "DISTRICT_LIST",
    placeholder: "请先选择城市",
    disabled: (form) => !form.city,  // 未选城市时禁用
    autoSelect: false,  // 选完后手动点击查询按钮
    clearable: true
  }
]);

const handleSearch = () => {
  console.log("查询条件:", queryParam);
  // 执行查询逻辑
};
</script>
```

#### 方案三：其他业务联动（产品类别 → 产品型号）

```typescript
const productModelOptions = ref([]);

const queryItems = computed<BaseQueryItemDesc[]>(() => [
  {
    name: "productCategory",
    label: "产品类别",
    logicType: "dict",
    logicValue: "PRODUCT_CATEGORY",
    autoSelect: false,
    customProps: (form) => ({
      onChange: async (categoryId: string) => {
        // 清空产品型号
        form.productModel = '';
        productModelOptions.value = [];
        
        if (categoryId) {
          // 根据类别查询型号
          const res = await request.get('/api/products/models', { 
            categoryId 
          });
          productModelOptions.value = res.data;
        }
      }
    })
  },
  {
    name: "productModel",
    label: "产品型号",
    component: (form) => ({
      tag: "el-select",
      props: {
        options: productModelOptions.value,
        placeholder: form.productCategory ? "请选择产品型号" : "请先选择产品类别",
        disabled: !form.productCategory,
        clearable: true
      }
    })
  }
]);
```

### 联动查询关键配置项

| 配置项 | 说明 | 示例 |
|--------|------|------|
| `autoSelect` | 控制值变化时是否自动触发查询 | `autoSelect: false` |
| `disabled` | 动态禁用，支持函数 | `disabled: (form) => !form.province` |
| `customProps` | 自定义属性和事件，可访问 form 对象 | `customProps: (form) => ({ onChange: ... })` |
| `component` | 自定义组件 | `component: (form) => ({ tag: "el-cascader" })` |
| `show` | 控制显示/隐藏 | `show: () => someCondition` |
| `clearable` | 是否可清空 | `clearable: true` |

### 联动查询最佳实践

1. **设置 `autoSelect: false`**：避免每次联动变化都触发查询，让用户选完所有条件后手动点击查询
2. **使用 `disabled` 函数**：未选择上级时禁用下级，提升用户体验
3. **重置下级数据**：在上级 `onChange` 中清空下级的值和选项
4. **错误处理**：接口调用加 try-catch 处理异常
5. **动态 placeholder**：根据表单状态提示用户操作顺序
6. **使用 `computed` 包装 `items`**：确保选项数据变化时配置能响应式更新

---

## 🎯 实用技巧

### 隐藏的固定查询条件

某些场景下需要固定传递某些查询条件，但不希望在界面上显示：

```typescript
{
  name: "companyId",
  label: "公司ID",
  defaultValue: "123456",
  isFixValue: true,      // 重置时不清空
  show: () => false      // 隐藏该字段
}
```

### 异步获取默认值

从接口获取默认值（如当前用户的部门）：

```typescript
{
  name: "deptId",
  label: "部门",
  logicType: "dept",
  defaultValue: async () => {
    const res = await request.get('/api/user/currentDept');
    return res.data.deptId;
  }
}
```

### 批量输入支持

支持粘贴多个值进行批量查询：

```typescript
{
  name: "orderNos",
  label: "订单号",
  multiQuery: true,
  placeholder: "支持批量输入，多个值用逗号或换行分隔"
}
```

### 动态控制字段显示

根据其他条件动态显示/隐藏字段：

```typescript
{
  name: "detailField",
  label: "详细信息",
  show: () => queryParam.showDetail === true
}
```

### 自定义查询按钮

添加自定义操作按钮：

```typescript
const customTools = [
  {
    name: "export",
    label: "导出",
    icon: "Download",
    onClick: () => {
      // 导出逻辑
    }
  },
  {
    name: "advanced",
    label: "高级查询",
    icon: "Setting",
    onClick: () => {
      // 打开高级查询弹窗
    }
  }
];
```

```vue
<BaseQuery
  :form="queryParam"
  :items="queryItems"
  :tools="customTools"
  @select="handleSearch"
/>
```

---

## �📚 相关文档

- [BaseForm 表单组件](../BaseForm/README.md)
- [BaseToolbar 工具栏组件](../BaseToolbar/README.md)
- [BaseTable 表格组件](../BaseTable/README.md)
