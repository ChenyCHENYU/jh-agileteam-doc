# c_formSections - 表单区块组件

> 基于配置的表单折叠面板组件，集成楼层导航、工具栏、布局切换等功能

## 📦 功能特性

### 核心功能

- ✅ **配置驱动** - 基于 JSON 配置自动渲染表单区块
- ✅ **类型丰富** - 支持 input、select、textarea、date、datetime、number 等多种类型
- ✅ **动态显示** - 支持根据条件动态显示/隐藏区块
- ✅ **插槽扩展** - 支持特殊区块和自定义字段插槽
- ✅ **TypeScript** - 完整的类型定义支持

### 🆕 增强功能

- ✅ **楼层导航** - 左侧/右侧导航，支持锚点跳转
- ✅ **工具栏** - 内置必填字段过滤开关，可扩展自定义工具
- ✅ **布局切换** - 支持 2/3/4/5 列布局快速切换
- ✅ **顶部操作栏** - 可配置标题和操作按钮
- ✅ **自动过滤** - 组件内部自动处理必填字段过滤逻辑

## 📖 基础用法

```vue
<template>
  <c_formSections
    :sections="sectionsConfig"
    :form="form"
    v-model:activeNames="activeNames"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import c_formSections from "@/components/local/c_formSections/index.vue";

const form = ref({
  name: "",
  type: "",
  description: ""
});

const activeNames = ref(["1", "2"]);

const sectionsConfig = [
  {
    name: "1",
    id: "section-1",
    title: "基本信息",
    fieldsConfig: [
      { prop: "name", label: "名称", type: "input", required: true },
      {
        prop: "type",
        label: "类型",
        type: "select",
        required: true,
        options: [
          { label: "类型A", value: "A" },
          { label: "类型B", value: "B" }
        ]
      }
    ]
  },
  {
    name: "2",
    id: "section-2",
    title: "详细信息",
    fieldsConfig: [
      { prop: "description", label: "描述", type: "textarea", rows: 4 }
    ]
  }
];
</script>
```

## 🆕 完整功能用法

```vue
<template>
  <c_formSections
    :sections="sectionsConfig"
    :form="form"
    v-model:activeNames="activeNames"
    show-header
    header-title="主档维护"
    :header-actions="headerActions"
    show-toolbar
    show-required-filter
    show-layout-switch
    :default-layout="5"
    :layout-options="[2, 3, 4, 5]"
    show-nav-tabs
    nav-tabs-position="left"
    :nav-tabs="navTabsConfig"
    label-width="100px"
    label-position="right"
    :gutter="20"
  >
    <!-- 特殊区块插槽 -->
    <template #special-3>
      <el-button>自定义内容</el-button>
    </template>
  </c_formSections>
</template>

<script setup lang="ts">
import { Check, Document } from "@element-plus/icons-vue";

const headerActions = [
  {
    label: "保存",
    type: "primary",
    icon: Check,
    onClick: () => console.log("保存")
  },
  {
    label: "取消",
    onClick: () => console.log("取消")
  }
];

const navTabsConfig = [
  { label: "基本信息", name: "basic", sectionName: "1" },
  { label: "详细信息", name: "detail", sectionName: "2" }
];
</script>
```

## 🔧 Props

### 基础属性

| 参数          | 说明                                     | 类型                         | 默认值    |
| ------------- | ---------------------------------------- | ---------------------------- | --------- |
| sections      | 表单区块配置数组                         | `SectionConfig[]`            | `[]`      |
| form          | 表单数据对象                             | `FormDataType`               | `{}`      |
| activeNames   | 激活的折叠面板 name 数组（支持 v-model） | `string[]`                   | `[]`      |
| rules         | 表单验证规则                             | `any`                        | -         |
| labelWidth    | 表单标签宽度                             | `string`                     | `'100px'` |
| labelPosition | 表单标签位置                             | `'left' \| 'right' \| 'top'` | `'right'` |
| gutter        | 栅格间距                                 | `number`                     | `20`      |
| fieldSpan     | 每个字段占据的栅格数（手动控制时使用）   | `number`                     | -         |

### 🆕 增强属性

| 参数               | 说明                                       | 类型                      | 默认值       |
| ------------------ | ------------------------------------------ | ------------------------- | ------------ |
| showHeader         | 是否显示顶部标题栏                         | `boolean`                 | `false`      |
| headerTitle        | 标题栏标题文本                             | `string`                  | `'主档维护'` |
| headerActions      | 顶部操作按钮                               | `HeaderAction[]`          | `[]`         |
| showToolbar        | 是否显示工具栏                             | `boolean`                 | `false`      |
| showRequiredFilter | 是否显示必填字段过滤开关                   | `boolean`                 | `false`      |
| showLayoutSwitch   | 是否显示布局切换器                         | `boolean`                 | `false`      |
| defaultLayout      | 默认布局列数                               | `2 \| 3 \| 4 \| 5`        | `5`          |
| layoutOptions      | 可选布局列数                               | `Array<2 \| 3 \| 4 \| 5>` | `[2,3,4,5]`  |
| showNavTabs        | 是否显示楼层导航                           | `boolean`                 | `false`      |
| navTabsPosition    | 楼层导航位置                               | `'left' \| 'right'`       | `'left'`     |
| navTabs            | 楼层导航配置（不传则自动从 sections 生成） | `NavTabConfig[]`          | `[]`         |

## 📊 配置接口

### SectionConfig

```typescript
interface SectionConfig {
  /** 折叠面板的 name 值（唯一标识） */
  name: string;
  /** 折叠面板 ID（用于锚点跳转） */
  id: string;
  /** 显示的标题 */
  title: string;
  /** 字段配置数组 */
  fieldsConfig: FieldConfig[];
  /** 显示条件函数（可选） */
  visible?: () => boolean;
  /** 是否为特殊处理的区块 */
  isSpecial?: boolean;
}
```

### FieldConfig

```typescript
interface FieldConfig {
  /** 字段属性名 */
  prop: string;
  /** 字段标签 */
  label: string;
  /** 字段类型 */
  type?:
    | "input"
    | "select"
    | "textarea"
    | "date"
    | "datetime"
    | "number"
    | "custom";
  /** 栅格占据列数 */
  span?: number;
  /** 是否必填 */
  required?: boolean;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否可清空（select） */
  clearable?: boolean;
  /** 下拉选项（select） */
  options?: Array<{ label: string; value: string | number }>;
  /** 文本域行数（textarea） */
  rows?: number;
  /** 最小值（number） */
  min?: number;
  /** 最大值（number） */
  max?: number;
  /** 数字精度（number） */
  precision?: number;
  /** 步长（number） */
  step?: number;
}
```

### 🆕 HeaderAction

```typescript
interface HeaderAction {
  /** 按钮文本 */
  label: string;
  /** 按钮类型 */
  type?: "primary" | "success" | "warning" | "danger" | "info" | "text" | "";
  /** 图标（Element Plus Icon 组件） */
  icon?: Component;
  /** 点击事件回调 */
  onClick: () => void;
  /** 是否禁用 */
  disabled?: boolean;
}
```

### 🆕 NavTabConfig

```typescript
interface NavTabConfig {
  /** 标签名称（唯一标识） */
  name: string;
  /** 显示文本 */
  label: string;
  /** 关联的 section name（用于锚点跳转） */
  sectionName?: string | null;
}
```

## 🎨 插槽

### 🆕 工具栏插槽

**toolbar-left** - 工具栏左侧自定义内容：

```vue
<c_formSections>
  <template #toolbar-left>
    <el-button size="small">自定义按钮</el-button>
  </template>
</c_formSections>
```

**toolbar-right** - 工具栏右侧自定义内容：

```vue
<c_formSections>
  <template #toolbar-right>
    <span>自定义文本</span>
  </template>
</c_formSections>
```

### 特殊区块插槽

用于渲染 `isSpecial: true` 的区块自定义内容：

```vue
<c_formSections :sections="sections" :form="form">
  <template #special-3="{ section }">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-button type="primary" @click="addItem">+ 添加项</el-button>
      </el-col>
    </el-row>
  </template>
</c_formSections>
```

### 自定义字段插槽

用于渲染 `type: 'custom'` 的字段自定义内容：

```vue
<c_formSections :sections="sections" :form="form">
  <template #field-customField="{ field, form }">
    <custom-input v-model="form[field.prop]" />
  </template>
</c_formSections>
```

## 📝 完整示例

```vue
<template>
  <div class="form-container">
    <!-- 必填字段过滤开关 -->
    <el-switch v-model="showRequiredOnly" />

    <!-- 表单区块组件 -->
    <c-form-sections
      :sections="visibleSections"
      :form="form"
      v-model:activeNames="activeNames"
      :rules="formRules"
      :fieldSpan="layoutColumns === 2 ? 12 : 6"
    >
      <!-- 特殊需求区块 -->
      <template #special-3>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-button type="primary" plain @click="addRequirement">
              + 添加需求
            </el-button>
          </el-col>
        </el-row>
      </template>
    </c-form-sections>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import CFormSections from "@/components/local/c_formSections/index.vue";
import { filterFieldsByRequired } from "@/components/local/c_formSections/data";

const showRequiredOnly = ref(false);
const layoutColumns = ref(5);
const activeNames = ref(["1", "2", "3"]);

const form = ref({
  name: "",
  code: "",
  type: "",
  count: 0,
  date: null
});

const sectionsConfigRaw = [
  {
    name: "1",
    id: "section-1",
    title: "基本信息",
    fieldsConfig: [
      { prop: "name", label: "名称", required: true },
      { prop: "code", label: "编码", required: true },
      {
        prop: "type",
        label: "类型",
        type: "select",
        options: [
          { label: "类型A", value: "A" },
          { label: "类型B", value: "B" }
        ]
      }
    ]
  },
  {
    name: "2",
    id: "section-2",
    title: "详细信息",
    fieldsConfig: [
      { prop: "count", label: "数量", type: "number", min: 0 },
      { prop: "date", label: "日期", type: "date" }
    ]
  },
  {
    name: "3",
    id: "section-3",
    title: "特殊需求",
    fieldsConfig: [],
    isSpecial: true,
    visible: () => !showRequiredOnly.value
  }
];

// 动态过滤字段
const visibleSections = computed(() => {
  return sectionsConfigRaw.map((section) => ({
    ...section,
    fieldsConfig: filterFieldsByRequired(
      section.fieldsConfig,
      showRequiredOnly.value
    )
  }));
});

const formRules = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入编码", trigger: "blur" }]
};

const addRequirement = () => {
  console.log("添加特殊需求");
};
</script>
```

## 🛠️ 工具函数

### filterFieldsByRequired

根据必填条件过滤字段配置：

```typescript
import { filterFieldsByRequired } from "@/components/local/c_formSections/data";

const filteredFields = filterFieldsByRequired(fieldsConfig, true);
```

### hasSectionFields

判断区块是否有可显示的字段：

```typescript
import { hasSectionFields } from "@/components/local/c_formSections/data";

const hasFields = hasSectionFields(section.fieldsConfig);
```

### generateDefaultFormData

生成默认表单数据：

```typescript
import { generateDefaultFormData } from "@/components/local/c_formSections/data";

const defaultForm = generateDefaultFormData(sectionsConfig);
```

## 💡 最佳实践

1. **配置管理** - 将 sections 配置放在独立的 data.ts 文件中
2. **类型安全** - 使用 TypeScript 定义表单数据接口
3. **动态过滤** - 使用 computed 实现响应式字段过滤
4. **插槽使用** - 对于复杂的自定义字段，使用插槽扩展
5. **验证规则** - 配合 Element Plus 的 rules 实现表单验证

## 🎯 应用场景

- ✅ 订单新增/编辑页面
- ✅ 配置管理表单
- ✅ 多区块复杂表单
- ✅ 需要动态显示/隐藏字段的表单
- ✅ 企业级业务系统表单页面

## 📚 真实项目示例

项目中已有完整可用的示例页面，可作为开发模板：

### 新增编辑页示例

**路径**: `src/views/sale/demo/add-demo/`

**特性**:

- ✅ 使用 c_formSections 组件展示所有功能
- ✅ 集成楼层导航、布局切换、必填过滤
- ✅ 配置驱动的表单字段（50+ 字段）
- ✅ 真实的保存/草稿/取消逻辑（使用 request + Mock）
- ✅ 项次信息管理（带分页，使用 jh-pagination）
- ✅ 全屏模式支持
- ✅ C_Splitter 拖动调整布局

**使用方式**:

1. 复制 `add-demo` 目录作为模板
2. 修改 `data.ts` 中的 API_CONFIG 为实际接口地址
3. 修改 `formFieldsData` 配置为业务字段
4. 修改 `modalConfig` 为业务需求
5. 创建对应的 Mock 文件（开发阶段）

**关键代码结构**:

```
add-demo/
├── index.vue      # 视图层（176行）- 组件使用和布局
├── data.ts        # 逻辑层（400+行）- 配置和业务逻辑
├── index.scss     # 样式层（207行）- 页面样式
└── mock/
    └── add-demo.ts  # Mock 数据（50条项次数据）
```

**推荐作为团队内部的标准模板使用！**
