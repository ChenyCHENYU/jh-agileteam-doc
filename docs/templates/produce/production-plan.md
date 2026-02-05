# 【棒线材】精整实绩管理通用模板

## 📚 概述

该模板为精整实绩管理类页面提供了统一的布局和业务逻辑，通过配置化的方式快速创建新页面。

<AuthorTag :authors="['CHENY', 'ZhaoBaoShan', 'YinHua']" />

## 🎯 适用场景

适用于以下页面：矫直、剥皮、抛丸、倒棱、探伤、酸洗、打包作业管理等相关类似的页面。

## 📂 文件结构

### 模板组件 (components/template/FinishingAchievementTemplate/)

```
components/template/FinishingAchievementTemplate/
├── index.vue     # 模板组件
├── index.scss    # 通用样式（所有页面共享）
├── data.ts       # 通用业务逻辑
├── types.ts      # 配置类型定义
└── README.md     # 使用说明
```

### 业务页面目录

```
mmwr-straightening-achievements/
├── index.vue    # 页面入口，调用模板（无需样式文件）
└── data.ts      # 页面配置
```

**注意**：使用模板后，业务页面不再需要 `index.scss` 文件！所有样式已在模板中统一定义。

## 🚀 快速开始

### 示例 1：使用默认列配置（推荐）

适用于矫直、剥皮、抛丸、倒棱、探伤、酸洗等通用精整页面。

#### data.ts - 精简配置

```typescript
import { BusLogicDataType } from "@/types/page";
import type { FinishingAchievementConfig } from "@/components/template/FinishingAchievementTemplate/types";

/**
 * 矫直实绩管理配置
 */
export const straighteningConfig: FinishingAchievementConfig = {
  // API 接口配置
  api: {
    planList: "/mmwr/mmwrTechFinish/queryTechList",
    materialList: "/mmwr/mmwrMatMain/getFeedMatList",
    qualifiedList: "/mmwr/mmwrMatMain/getQualifiedMatList",
    unqualifiedList: "/mmwr/mmwrMatMain/getUnqualifiedMatList",
    upMaterial: "/mmwr/mmwrPlanFinish/upMaterial",
    cancelUpMaterial: "/mmwr/mmwrPlanFinish/cancelUpMaterial",
    output: "/mmwr/mmwrPlanFinish/outPut",
    cancelPass: "/mmwr/mmwrPlanFinish/cancelPass",
    cancelUnPass: "/mmwr/mmwrPlanFinish/cancelUnPass",
    outputFinish: "/mmwr/mmwrPlanFinish/outPutFinish",
  },

  // 工序代码（必填）
  processCode: "JZ",

  // 查询配置
  query: {
    plan: {
      items: [
        {
          name: "firstProcess",
          label: "工序选择",
          placeholder: "请选择工序",
          logicType: BusLogicDataType.dict,
          logicValue: "mmwrFirstBackLogCode",
          autoSelect: false,
          customProps: () => ({ filterable: true }),
        },
        {
          name: "loNo",
          label: "轧制号",
          placeholder: "请输入轧制号/轧制序号",
          autoSelect: false,
        },
        {
          name: "dateRange",
          type: "range",
          startName: "startDate",
          endName: "endDate",
          label: "排产日期",
          logicType: BusLogicDataType.date,
          rangeSeparator: "至",
          autoSelect: false,
          customProps: () => ({ valueFormat: "YYYY-MM-DD", type: "date" }),
        },
      ],
      defaultParams: {
        firstProcess: "B",
      },
    },
  },
  // ✅ 列配置使用模板默认值，无需配置
};
```

**配置说明：**

- ✅ 只需配置 `api`、`processCode`、`query`
- ✅ 自动使用模板提供的通用列配置
- ✅ 代码精简到 ~70 行（相比原来 400+ 行）

### 示例 2：自定义列配置

当字段不同时（如打包作业），可以覆盖默认配置。

#### data.ts - 完整配置

```typescript
export const packagingConfig: FinishingAchievementConfig = {
  api: {
    /* API 配置同上 */
  },
  processCode: "DB",
  query: {
    /* 查询配置同上 */
  },

  // 自定义列配置（覆盖默认值）
  columns: {
    planColumns: [
      { type: "index", label: "序号", width: 60, fixed: "left" },
      { name: "loNo", label: "生产计划号", width: 140 },
      { name: "lotNo", label: "轧制序号", width: 140 },
      { name: "planReleaseTime", label: "排程日期", width: 160 },
      { name: "subBacklogSeq", label: "流程指示序号", width: 120 },
      // ... 其他自定义列
    ],
    materialColumns: [
      { type: "selection", width: 55, fixed: "left" },
      { name: "lotNo", label: "轧制序号", width: 120 },
      { name: "bunNo", label: "捆号", width: 120 },
      { name: "backlogSeq", label: "流程指示序号", width: 120 },
      // ... 不同的字段名称
    ],
    qualifiedColumns: [
      /* ... */
    ],
    unqualifiedColumns: [
      /* ... */
    ],
  },
};
```

**配置说明：**

- ⚙️ 通过 `columns` 属性覆盖默认列配置
- ⚙️ 可以只覆盖部分表格的列（如只覆盖 planColumns）
- ⚙️ 适用于字段名称或结构不同的特殊页面

### index.vue - 页面入口（统一）

所有页面的 `index.vue` 都一样，只需 10 行代码：

```vue
<template>
  <FinishingAchievementTemplate :config="straighteningConfig" />
</template>

<script setup lang="ts">
import FinishingAchievementTemplate from "@/components/template/FinishingAchievementTemplate/index.vue";
import { straighteningConfig } from "./data";
</script>
```

**就这么简单！**

- ✅ 不需要任何样式文件，模板已包含所有样式
- ✅ 不需要重复的业务逻辑代码
- ✅ 只需维护配置文件 `data.ts`

## 📋 工序代码对照表

| 工序 | processCode | 使用默认列配置 | 目录名                          |
| ---- | ----------- | -------------- | ------------------------------- |
| 矫直 | JZ          | ✅             | mmwr-straightening-achievements |
| 剥皮 | BP          | ✅             | mmwr-peeling-achievements       |
| 抛丸 | PW          | ✅             | mmwr-blasting-achievements      |
| 倒棱 | DL          | ✅             | mmwr-chamfering-achievements    |
| 探伤 | TS          | ✅             | mmwr-inspection-achievements    |
| 酸洗 | SX          | ✅             | mmwr-pickling-achievements      |
| 打包 | DB          | ❌（自定义）   | mmwr-packaging-operations       |

## 🎨 默认列配置说明

模板提供了通用的默认列配置，适用于大部分精整页面：

### 计划排程表（planColumns）

- 序号、轧批号、轧制序号、排程日期、工序代码、工序序号
- 订单号、订单行项目、炉次号、热次号
- 计划数量、支数、计划重量、重量、计划状态、备注

### 待上料表（materialColumns）

- 多选框、序号、材料号、轧批号、轧制序号、捆号
- 牌号、直径、长度、支数、重量、材料状态、进程代码

### 合格产出表（qualifiedColumns）

- 多选框、序号、材料号、轧批号、轧制序号、捆号
- 牌号、直径、长度、支数、重量、订单编号、进程代码

### 不合格产出表（unqualifiedColumns）

- 多选框、序号、材料号、轧批号、轧制序号、捆号
- 牌号、直径、长度、支数、重量、产品状态、进程代码

**注意**：打包作业(DB)使用不同的字段名称（如 backlogSeq 代替 subBacklogSeq），因此需要自定义列配置。

## 💡 核心优势

### 1. 代码精简

- **传统方式**：每个页面 ~400 行（重复代码多）
- **使用模板（默认配置）**：每个页面 ~70 行（减少 82%）
- **使用模板（自定义配置）**：每个页面 ~160 行（减少 60%）

### 2. 智能默认

- 6 个通用页面共享默认列配置
- 特殊页面（如打包）可灵活覆盖
- 避免重复，保持灵活

### 3. 易于维护

- 修改模板 → 所有页面生效
- 类型安全，TypeScript 支持
- 统一样式，降低维护成本

### 4. 快速开发

- 新增通用页面：5 分钟（只需配置 API 和工序代码）
- 新增特殊页面：10 分钟（需要自定义列配置）

## 源码

<details>
<summary>📄 index.vue - 模板组件</summary>

```vue
<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2026-02-04
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2026-02-04 10:57:43
 * @FilePath: \cx-ui-produce\src\components\template\FinishingAchievementTemplate\index.vue
 * @Description: 精整实绩管理 - 通用模板组件
 * Copyright (c) 2026 by CHENY, All Rights Reserved 😎.
-->
<template>
  <div class="app-container app-page-container" :class="uiConfig.mainClass">
    <!-- 查询区域 -->
    <BaseQuery
      :form="queryParam"
      :items="queryItems"
      :columns="config.query?.plan?.columns || 3"
      :labelWidth="config.query?.plan?.labelWidth || '100px'"
      @select="handleQuery"
      @reset="handleReset"
    />

    <!-- Tab 切换 -->
    <el-tabs v-model="activeTab" class="tabs-container">
      <!-- 计划排程信息 -->
      <el-tab-pane :label="uiConfig.planTabLabel" name="plan" lazy>
        <BaseTable
          ref="planTableRef"
          :data="planList"
          :columns="planColumns"
          showToolbar
          row-key="id"
          highlight-current-row
          @row-click="handlePlanRowClick"
        />

        <!-- 分页 -->
        <jh-pagination
          v-show="planPage.total && planPage.total > 0"
          :total="planPage.total || 0"
          v-model:currentPage="planPage.current"
          v-model:pageSize="planPage.size"
          @current-change="queryPlanList"
          @size-change="queryPlanList"
        />
      </el-tab-pane>

      <!-- 现场实绩信息 -->
      <el-tab-pane :label="uiConfig.actualTabLabel" name="actual" lazy>
        <jh-drag-row :top-height="400">
          <template #top>
            <!-- 上料信息清单 -->
            <div v-if="PlanPage.selectedPlanRow.value" class="section-header">
              <div class="title-bar"></div>
              <h3 class="section-title">{{ uiConfig.materialSectionTitle }}</h3>
            </div>

            <div v-if="!PlanPage.selectedPlanRow.value" class="empty-tip">
              <el-empty
                :description="`请先在【${uiConfig.planTabLabel}】Tab中点击选择一条计划排程记录`"
              />
            </div>
            <BaseTable
              v-else
              ref="tableRef"
              :data="materialList"
              :columns="materialColumns"
              showToolbar
              row-key="id"
              highlight-current-row
              @row-click="handleMaterialRowClick"
              @selection-change="handleMaterialSelectionChange"
            />

            <!-- 分页 -->
            <jh-pagination
              v-show="materialPage.total && materialPage.total > 0"
              :total="materialPage.total || 0"
              v-model:currentPage="materialPage.current"
              v-model:pageSize="materialPage.size"
              @current-change="queryMaterialList"
              @size-change="queryMaterialList"
            />
          </template>

          <template #bottom>
            <!-- 操作按钮区域 -->
            <div class="operation-toolbar">
              <div class="operation-left">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleUpMaterial"
                >
                  上料
                </el-button>
                <el-button
                  type="warning"
                  size="small"
                  @click="handleCancelUpMaterial"
                >
                  取消上料
                </el-button>
              </div>

              <div class="operation-center">
                <span class="label">支数:</span>
                <el-input-number
                  v-model="outputParams.pcs"
                  :min="1"
                  :controls="false"
                  size="small"
                  placeholder="请输入支数"
                  style="width: 120px; margin-right: 16px"
                />

                <span class="label">产品状态:</span>
                <el-select
                  v-model="outputParams.mmwrProdStatus"
                  size="small"
                  placeholder="请选择产品状态"
                  clearable
                  style="width: 120px; margin-right: 16px"
                >
                  <el-option label="合格" value="1" />
                  <el-option label="不合格" value="2" />
                  <el-option label="脱单" value="3" />
                  <el-option label="废品" value="4" />
                </el-select>

                <el-button type="success" size="small" @click="handleOutput">
                  产出
                </el-button>
              </div>

              <div class="operation-right">
                <el-button
                  type="danger"
                  size="small"
                  @click="handleOutputFinish"
                >
                  {{ uiConfig.outputFinishBtnText }}
                </el-button>
              </div>
            </div>

            <!-- 产出实绩区域：左右布局 -->
            <div class="results-container">
              <!-- 左侧：产出合格实绩 -->
              <div class="section left-section">
                <div class="section-header">
                  <div class="title-bar"></div>
                  <h3 class="section-title">
                    {{ uiConfig.qualifiedSectionTitle }}
                  </h3>
                </div>

                <div class="table-box">
                  <div v-if="!hasClickedMaterial" class="empty-tip">
                    <el-empty description="请先在上料信息清单中选择一行数据" />
                  </div>
                  <BaseTable
                    v-else
                    ref="qualifiedTableRef"
                    :data="qualifiedList"
                    :columns="qualifiedColumns"
                    row-key="id"
                    highlight-current-row
                    @row-click="handleQualifiedRowClick"
                  />
                </div>

                <jh-pagination
                  v-show="qualifiedPage.total && qualifiedPage.total > 0"
                  :total="qualifiedPage.total || 0"
                  v-model:currentPage="qualifiedPage.current"
                  v-model:pageSize="qualifiedPage.size"
                  :page-sizes="[10, 20, 50, 100]"
                  layout="prev, pager, next, sizes"
                  size="small"
                  @current-change="queryQualifiedList"
                  @size-change="queryQualifiedList"
                />

                <div class="section-footer">
                  <el-button
                    type="danger"
                    size="small"
                    :disabled="!hasQualifiedSelection"
                    @click="handleCancelPass"
                  >
                    合格取消
                  </el-button>
                </div>
              </div>

              <!-- 右侧：不合格实绩 -->
              <div class="section right-section">
                <div class="section-header">
                  <div class="title-bar"></div>
                  <h3 class="section-title">
                    {{ uiConfig.unqualifiedSectionTitle }}
                  </h3>
                </div>

                <div class="table-box">
                  <div v-if="!hasClickedMaterial" class="empty-tip">
                    <el-empty description="请先在上料信息清单中选择一行数据" />
                  </div>
                  <BaseTable
                    v-else
                    ref="unqualifiedTableRef"
                    :data="unqualifiedList"
                    :columns="unqualifiedColumns"
                    row-key="id"
                    highlight-current-row
                    @row-click="handleUnqualifiedRowClick"
                  />
                </div>

                <jh-pagination
                  v-show="unqualifiedPage.total && unqualifiedPage.total > 0"
                  :total="unqualifiedPage.total || 0"
                  v-model:currentPage="unqualifiedPage.current"
                  v-model:pageSize="unqualifiedPage.size"
                  :page-sizes="[10, 20, 50, 100]"
                  layout="prev, pager, next, sizes"
                  size="small"
                  @current-change="queryUnqualifiedList"
                  @size-change="queryUnqualifiedList"
                />

                <div class="section-footer">
                  <el-button
                    type="danger"
                    size="small"
                    :disabled="!hasUnqualifiedSelection"
                    @click="handleCancelUnPass"
                  >
                    不合格取消
                  </el-button>
                </div>
              </div>
            </div>
          </template>
        </jh-drag-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import type { FinishingAchievementConfig } from "./types";
import { DEFAULT_UI_CONFIG } from "./types";
import {
  createPlanPage,
  createMaterialPage,
  createQualifiedPage,
  createUnqualifiedPage,
  createOutputParams,
} from "./data";

// 接收配置
const props = defineProps<{
  config: FinishingAchievementConfig;
}>();

// 合并UI配置
const uiConfig = computed(() => ({
  ...DEFAULT_UI_CONFIG,
  ...props.config.ui,
}));

// 当前激活的 Tab
const activeTab = ref("plan");

// 是否已点击上料信息清单
const hasClickedMaterial = ref(false);

// 合格/不合格表格选中状态
const hasQualifiedSelection = ref(false);
const hasUnqualifiedSelection = ref(false);

// 表格 ref
const qualifiedTableRef = ref();
const unqualifiedTableRef = ref();

// 产出参数
const outputParams = createOutputParams();

// 创建各个页面实例
const PlanPage = createPlanPage(props.config);
const MaterialPage = createMaterialPage(props.config);
const QualifiedPage = createQualifiedPage(props.config);
const UnqualifiedPage = createUnqualifiedPage(props.config);

// 解构需要的属性
const {
  tableRef: planTableRef,
  queryParam,
  page: planPage,
  list: planList,
  columns: planColumns,
} = PlanPage;

const {
  tableRef,
  page: materialPage,
  list: materialList,
  columns: materialColumns,
} = MaterialPage;

const {
  page: qualifiedPage,
  list: qualifiedList,
  columns: qualifiedColumns,
} = QualifiedPage;

const {
  page: unqualifiedPage,
  list: unqualifiedList,
  columns: unqualifiedColumns,
} = UnqualifiedPage;

// 查询项
const queryItems = props.config.query?.plan?.items || [];

// 查询事件
const handleQuery = () => PlanPage.select();
const handleReset = () => {
  PlanPage.handleReset();
  PlanPage.select();
};
const queryPlanList = () => PlanPage.select();
const queryMaterialList = () => MaterialPage.select();
const queryQualifiedList = () => QualifiedPage.select();
const queryUnqualifiedList = () => UnqualifiedPage.select();

// 计划行点击事件
const handlePlanRowClick = (row: any) => {
  PlanPage.selectedPlanRow.value = row;
  MaterialPage.selectByPlan(row);
  // 清空合格和不合格列表
  QualifiedPage.list.value = [];
  UnqualifiedPage.list.value = [];
  // 重置待上料点击状态
  hasClickedMaterial.value = false;
  // 重置选中状态
  hasQualifiedSelection.value = false;
  hasUnqualifiedSelection.value = false;
};

// 待上料信息行点击事件
const handleMaterialRowClick = (row: any) => {
  MaterialPage.selectedMaterialRow.value = row;

  // 点击待上料信息行时，调用合格和不合格实绩接口
  if (PlanPage.selectedPlanRow.value) {
    hasClickedMaterial.value = true;
    // 重置选中状态
    hasQualifiedSelection.value = false;
    hasUnqualifiedSelection.value = false;
    QualifiedPage.selectByPlan(PlanPage.selectedPlanRow.value);
    UnqualifiedPage.selectByPlan(PlanPage.selectedPlanRow.value);
  }
};

// 上料信息清单勾选变化事件
const handleMaterialSelectionChange = (selection: any[]) => {
  // 如果勾选了数据但还没有点击过行，自动加载合格/不合格列表
  if (
    selection.length > 0 &&
    !hasClickedMaterial.value &&
    PlanPage.selectedPlanRow.value
  ) {
    hasClickedMaterial.value = true;
    QualifiedPage.selectByPlan(PlanPage.selectedPlanRow.value);
    UnqualifiedPage.selectByPlan(PlanPage.selectedPlanRow.value);
  }
};

// 合格/不合格行点击事件
const handleQualifiedRowClick = (row: any) => {
  // 行点击时自动设置为选中状态
  hasQualifiedSelection.value = true;
};

const handleUnqualifiedRowClick = (row: any) => {
  // 行点击时自动设置为选中状态
  hasUnqualifiedSelection.value = true;
};

// 业务操作
const handleUpMaterial = () => MaterialPage.handleUpMaterial();
const handleCancelUpMaterial = () => MaterialPage.handleCancelUpMaterial();
const handleOutput = () =>
  MaterialPage.handleOutput(outputParams, QualifiedPage, UnqualifiedPage);
const handleCancelPass = () =>
  QualifiedPage.handleCancelPass(qualifiedTableRef.value);
const handleCancelUnPass = () =>
  UnqualifiedPage.handleCancelUnPass(unqualifiedTableRef.value);
const handleOutputFinish = () =>
  MaterialPage.handleOutputFinish(
    PlanPage.selectedPlanRow.value,
    QualifiedPage,
    UnqualifiedPage,
    PlanPage,
  );

// 首次加载数据
onMounted(() => {
  handleQuery();
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
```

</details>

<details>
<summary>📄 data.ts - 业务逻辑</summary>

```typescript
/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2026-02-04
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2026-02-04
 * @FilePath: \cx-ui-produce\src\views\produce\production-mmwr\jzsj\template\data.ts
 * @Description: 精整实绩管理 - 通用业务逻辑
 * Copyright (c) 2026 by CHENY, All Rights Reserved 😎.
 */

import { ref } from "vue";
import {
  AbstractPageQueryHook,
  BaseQueryItemDesc,
  ActionButtonDesc,
  TableColumnDesc,
} from "@/types/page";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FinishingAchievementConfig } from "./types";

/**
 * 默认表格列配置
 * 适用于矫直、剥皮、抛丸、倒棱、探伤、酸洗等通用精整工序
 * 如页面字段不同（如打包作业），可在业务页面config中通过columns属性覆盖
 */
const DEFAULT_PLAN_COLUMNS: TableColumnDesc<any>[] = [
  { type: "index", label: "序号", width: 60, fixed: "left" },
  { name: "loNo", label: "轧批号", width: 140 },
  { name: "lotNo", label: "轧制序号", width: 120 },
  { name: "planReleaseTime", label: "排程日期", width: 150 },
  { name: "subBacklogCode", label: "工序代码", width: 100 },
  { name: "subBacklogSeq", label: "工序序号", width: 100 },
  { name: "orderNo", label: "订单号", width: 140 },
  { name: "orderItemNo", label: "订单行项目", width: 120 },
  { name: "htmHeatNo", label: "炉次号", width: 120 },
  { name: "heatNo", label: "热次号", width: 140 },
  { name: "planNum", label: "计划数量", width: 100 },
  { name: "pcs", label: "支数", width: 100 },
  { name: "planWgt", label: "计划重量(kg)", width: 120 },
  { name: "wgt", label: "重量(kg)", width: 120 },
  { name: "planStatus", label: "计划状态", width: 100 },
  { name: "remarkCraft", label: "备注", width: 150 },
];

const DEFAULT_MATERIAL_COLUMNS: TableColumnDesc<any>[] = [
  { type: "selection", width: 55, fixed: "left" },
  { type: "index", label: "序号", width: 60, fixed: "left" },
  { name: "matNo", label: "材料号", width: 140 },
  { name: "loNo", label: "轧批号", width: 120 },
  { name: "lotNo", label: "轧制序号", width: 100 },
  { name: "bunNo", label: "捆号", width: 120 },
  { name: "sgSign", label: "牌号", width: 100 },
  { name: "diameter", label: "直径(mm)", width: 100 },
  { name: "matLen", label: "长度(mm)", width: 100 },
  { name: "pcs", label: "支数", width: 80 },
  { name: "wgt", label: "重量(kg)", width: 100 },
  { name: "matStatus", label: "材料状态", width: 100 },
  { name: "processStatus", label: "进程代码", width: 100 },
];

const DEFAULT_QUALIFIED_COLUMNS: TableColumnDesc<any>[] = [
  { type: "index", label: "序号", width: 60, fixed: "left" },
  { name: "matNo", label: "材料号", width: 140 },
  { name: "loNo", label: "轧批号", width: 120 },
  { name: "lotNo", label: "轧制序号", width: 100 },
  { name: "bunNo", label: "捆号", width: 120 },
  { name: "sgSign", label: "牌号", width: 100 },
  { name: "diameter", label: "直径(mm)", width: 100 },
  { name: "matLen", label: "长度(mm)", width: 100 },
  { name: "pcs", label: "支数", width: 80 },
  { name: "wgt", label: "重量(kg)", width: 100 },
  { name: "orderNo", label: "订单编号", width: 140 },
  { name: "processStatus", label: "进程代码", width: 100 },
];

const DEFAULT_UNQUALIFIED_COLUMNS: TableColumnDesc<any>[] = [
  { type: "index", label: "序号", width: 60, fixed: "left" },
  { name: "matNo", label: "材料号", width: 140 },
  { name: "loNo", label: "轧批号", width: 120 },
  { name: "lotNo", label: "轧制序号", width: 100 },
  { name: "bunNo", label: "捆号", width: 120 },
  { name: "sgSign", label: "牌号", width: 100 },
  { name: "diameter", label: "直径(mm)", width: 100 },
  { name: "matLen", label: "长度(mm)", width: 100 },
  { name: "pcs", label: "支数", width: 80 },
  { name: "wgt", label: "重量(kg)", width: 100 },
  { name: "prodStatus", label: "产品状态", width: 100 },
  { name: "processStatus", label: "进程代码", width: 100 },
];

/**
 * 产出参数
 */
export const createOutputParams = () =>
  ref({
    pcs: undefined as number | undefined,
    mmwrProdStatus: "",
  });

/**
 * 创建计划排程页面逻辑
 */
export function createPlanPage(config: FinishingAchievementConfig) {
  // 获取配置值，支持简化配置
  const processCode = config.processCode;
  const defaultFirstProcess =
    config.query?.plan?.defaultParams?.firstProcess || "B";
  const queryItems = config.query?.plan?.items || [];
  const planColumns = config.columns?.planColumns || DEFAULT_PLAN_COLUMNS;

  return new (class extends AbstractPageQueryHook {
    selectedPlanRow = ref<any>(null);

    constructor() {
      super({
        url: {
          list: config.api.planList,
        },
        page: {
          current: 1,
          size: 10,
        },
      });
      // 初始化默认查询参数
      this.queryParam.value.subBacklogCode = processCode;
      this.queryParam.value.firstProcess = defaultFirstProcess;
    }

    queryDef(): BaseQueryItemDesc<any>[] {
      return queryItems;
    }

    toolbarDef(): ActionButtonDesc[] {
      return [];
    }

    columnsDef(): TableColumnDesc<any>[] {
      return planColumns;
    }

    async beforeQuery() {
      // 确保工序参数存在
      this.queryParam.value.firstProcess =
        this.queryParam.value.firstProcess || defaultFirstProcess;
      this.queryParam.value.subBacklogCode = processCode;
      return true;
    }

    handleReset() {
      this.queryParam.value.firstProcess = defaultFirstProcess;
      this.queryParam.value.loNo = "";
      this.queryParam.value.startDate = "";
      this.queryParam.value.endDate = "";
    }
  })();
}

/**
 * 创建待上料信息页面逻辑
 */
export function createMaterialPage(config: FinishingAchievementConfig) {
  const processCode = config.processCode;
  const defaultFirstProcess =
    config.query?.plan?.defaultParams?.firstProcess || "B";
  const materialColumns =
    config.columns?.materialColumns || DEFAULT_MATERIAL_COLUMNS;

  return new (class extends AbstractPageQueryHook {
    selectedMaterialRow = ref<any>(null);

    constructor() {
      super({
        url: {
          list: config.api.materialList,
        },
      });
    }

    queryDef(): BaseQueryItemDesc<any>[] {
      return [];
    }

    toolbarDef(): ActionButtonDesc[] {
      return [];
    }

    columnsDef(): TableColumnDesc<any>[] {
      return materialColumns;
    }

    async beforeQuery() {
      this.queryParam.value.subBacklogCode = processCode;
      return true;
    }

    async select() {
      const res = await super.select();
      let rawData = res?.data?.data ?? res?.data ?? res;
      if (Array.isArray(rawData)) {
        this.list.value = rawData;
        this.page.value.total = rawData.length;
      } else if (rawData && typeof rawData === "object") {
        this.list.value = rawData.records ?? rawData.list ?? [];
        this.page.value.total = rawData.total ?? this.list.value.length;
      } else {
        this.list.value = [];
        this.page.value.total = 0;
      }
      return res;
    }

    async selectByPlan(planRow: any) {
      if (planRow) {
        this.queryParam.value.firstProcess = defaultFirstProcess;
        this.queryParam.value.subBacklogCode = processCode;
        this.queryParam.value.loNo = planRow.loNo;
        this.queryParam.value.lotNo = planRow.lotNo;
        await this.select();
      } else {
        this.list.value = [];
      }
    }

    async handleUpMaterial() {
      const selection = this.getSelection();
      if (!selection || selection.length === 0) {
        ElMessage.warning("请先选择要上料的捆号");
        return;
      }

      try {
        await ElMessageBox.confirm(
          "确定要对选中的捆号进行上料操作吗？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          },
        );

        const bunNoStr = selection.map((row) => row.bunNo).join(",");
        const firstRow = selection[0];

        await this.getAction(config.api.upMaterial, {
          subBacklogCode: processCode,
          bunNoStr: bunNoStr,
          loNo: firstRow.loNo,
          lotNo: firstRow.lotNo,
        });

        ElMessage.success("上料成功");
        this.select();
      } catch (error: any) {
        if (error !== "cancel") {
          console.error("上料失败:", error);
        }
      }
    }

    async handleCancelUpMaterial() {
      const selection = this.getSelection();
      if (!selection || selection.length === 0) {
        ElMessage.warning("请先选择要取消上料的捆号");
        return;
      }

      try {
        await ElMessageBox.confirm("确定要取消选中捆号的上料吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        const bunNoStr = selection.map((row) => row.bunNo).join(",");
        const firstRow = selection[0];

        await this.getAction(config.api.cancelUpMaterial, {
          subBacklogCode: processCode,
          bunNoStr: bunNoStr,
          loNo: firstRow.loNo,
          lotNo: firstRow.lotNo,
        });

        ElMessage.success("取消上料成功");
        this.select();
      } catch (error: any) {
        if (error !== "cancel") {
          console.error("取消上料失败:", error);
        }
      }
    }

    async handleOutput(
      outputParams: any,
      qualifiedPage: any,
      unqualifiedPage: any,
    ) {
      const selection = this.getSelection();
      if (!selection || selection.length === 0) {
        ElMessage.warning("请先选择要产出的捆号");
        return;
      }

      if (!outputParams.value.pcs || !outputParams.value.mmwrProdStatus) {
        ElMessage.warning("支数和产品状态必须填写");
        return;
      }

      try {
        await ElMessageBox.confirm("确定要进行产出操作吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        const bunNoStr = selection.map((row) => row.bunNo).join(",");
        const firstRow = selection[0];

        await this.getAction(config.api.output, {
          subBacklogCode: processCode,
          loNo: firstRow.loNo,
          lotNo: firstRow.lotNo,
          bunNoStr: bunNoStr,
          writePcs: outputParams.value.pcs,
          prodStatus: outputParams.value.mmwrProdStatus,
        });

        ElMessage.success("产出成功");

        // 清空输入
        outputParams.value.pcs = undefined;
        outputParams.value.mmwrProdStatus = "";

        this.select();
        qualifiedPage.select();
        unqualifiedPage.select();
      } catch (error: any) {
        if (error !== "cancel") {
          console.error("产出失败:", error);
        }
      }
    }

    async handleOutputFinish(
      planRow: any,
      qualifiedPage: any,
      unqualifiedPage: any,
      planPage: any,
    ) {
      const selection = this.getSelection();
      if (!selection || selection.length === 0) {
        ElMessage.warning("请先勾选待上料信息中的数据");
        return;
      }

      const materialRow = selection[0];

      try {
        await ElMessageBox.confirm("确定要完成产出操作吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        await this.getAction(config.api.outputFinish, {
          subBacklogCode: processCode,
          bunNoStr: materialRow.bunNo,
          loNo: materialRow.loNo,
          lotNo: materialRow.lotNo,
        });

        ElMessage.success("产出完毕");

        this.selectedMaterialRow.value = null;

        planPage.select();
        this.select();
        qualifiedPage.select();
        unqualifiedPage.select();
      } catch (error: any) {
        if (error !== "cancel") {
          console.error("产出完毕失败:", error);
        }
      }
    }
  })();
}

/**
 * 创建产出合格实绩页面逻辑
 */
export function createQualifiedPage(config: FinishingAchievementConfig) {
  const processCode = config.processCode;
  const defaultFirstProcess =
    config.query?.plan?.defaultParams?.firstProcess || "B";
  const qualifiedColumns =
    config.columns?.qualifiedColumns || DEFAULT_QUALIFIED_COLUMNS;

  return new (class extends AbstractPageQueryHook {
    constructor() {
      super({
        url: {
          list: config.api.qualifiedList,
        },
      });
    }

    queryDef(): BaseQueryItemDesc<any>[] {
      return [];
    }

    toolbarDef(): ActionButtonDesc[] {
      return [];
    }

    columnsDef(): TableColumnDesc<any>[] {
      return qualifiedColumns;
    }

    async beforeQuery() {
      this.queryParam.value.subBacklogCode = processCode;
      return true;
    }

    async select() {
      const res = await super.select();
      let rawData = res?.data?.data ?? res?.data ?? res;
      if (Array.isArray(rawData)) {
        this.list.value = rawData;
        this.page.value.total = rawData.length;
      } else if (rawData && typeof rawData === "object") {
        this.list.value = rawData.records ?? rawData.list ?? [];
        this.page.value.total = rawData.total ?? this.list.value.length;
      } else {
        this.list.value = [];
        this.page.value.total = 0;
      }
      return res;
    }

    async selectByPlan(planRow: any) {
      if (planRow) {
        this.queryParam.value.firstProcess = defaultFirstProcess;
        this.queryParam.value.subBacklogCode = processCode;
        this.queryParam.value.loNo = planRow.loNo;
        this.queryParam.value.lotNo = planRow.lotNo;
        await this.select();
      } else {
        this.list.value = [];
      }
    }

    async handleCancelPass(tableRef: any) {
      if (!tableRef) {
        ElMessage.warning("表格ref不存在");
        return;
      }

      const row = tableRef.currentRow;
      if (!row) {
        ElMessage.warning("请先选择要取消的合格产品");
        return;
      }

      if (!row.id) {
        ElMessage.warning("选中的数据缺少id");
        return;
      }

      try {
        await ElMessageBox.confirm("确定要取消选中的合格产品吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        await this.getAction(config.api.cancelPass, {
          matId: row.id,
        });

        ElMessage.success("取消成功");
        this.select();
      } catch (error: any) {
        if (error !== "cancel") {
          console.error("合格取消失败:", error);
        }
      }
    }
  })();
}

/**
 * 创建不合格实绩页面逻辑
 */
export function createUnqualifiedPage(config: FinishingAchievementConfig) {
  const processCode = config.processCode;
  const defaultFirstProcess =
    config.query?.plan?.defaultParams?.firstProcess || "B";
  const unqualifiedColumns =
    config.columns?.unqualifiedColumns || DEFAULT_UNQUALIFIED_COLUMNS;

  return new (class extends AbstractPageQueryHook {
    constructor() {
      super({
        url: {
          list: config.api.unqualifiedList,
        },
      });
    }

    queryDef(): BaseQueryItemDesc<any>[] {
      return [];
    }

    toolbarDef(): ActionButtonDesc[] {
      return [];
    }

    columnsDef(): TableColumnDesc<any>[] {
      return unqualifiedColumns;
    }

    async beforeQuery() {
      this.queryParam.value.subBacklogCode = processCode;
      return true;
    }

    async select() {
      const res = await super.select();
      let rawData = res?.data?.data ?? res?.data ?? res;
      if (Array.isArray(rawData)) {
        this.list.value = rawData;
        this.page.value.total = rawData.length;
      } else if (rawData && typeof rawData === "object") {
        this.list.value = rawData.records ?? rawData.list ?? [];
        this.page.value.total = rawData.total ?? this.list.value.length;
      } else {
        this.list.value = [];
        this.page.value.total = 0;
      }
      return res;
    }

    async selectByPlan(planRow: any) {
      if (planRow) {
        this.queryParam.value.firstProcess = defaultFirstProcess;
        this.queryParam.value.subBacklogCode = processCode;
        this.queryParam.value.loNo = planRow.loNo;
        this.queryParam.value.lotNo = planRow.lotNo;
        await this.select();
      } else {
        this.list.value = [];
      }
    }

    async handleCancelUnPass(tableRef: any) {
      if (!tableRef) {
        ElMessage.warning("表格ref不存在");
        return;
      }

      const row = tableRef.currentRow;
      if (!row) {
        ElMessage.warning("请先选择要取消的不合格产品");
        return;
      }

      if (!row.id) {
        ElMessage.warning("选中的数据缺少id");
        return;
      }

      try {
        await ElMessageBox.confirm("确定要取消选中的不合格产品吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        await this.getAction(config.api.cancelUnPass, {
          matId: row.id,
        });

        ElMessage.success("取消成功");
        this.select();
      } catch (error: any) {
        if (error !== "cancel") {
          console.error("不合格取消失败:", error);
        }
      }
    }
  })();
}
```

</details>

<details>
<summary>📄 index.scss - 通用样式</summary>

```scss
/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2026-02-04
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2026-02-04
 * @FilePath: \cx-ui-produce\src\components\template\FinishingAchievementTemplate\index.scss
 * @Description: 精整实绩管理 - 通用样式
 * Copyright (c) 2026 by CHENY, All Rights Reserved 😎.
 */

// 通用样式（所有精整实绩页面共享）
.app-page-container {
  :deep(.el-table) {
    overflow: hidden;
  }

  // Tab 样式
  .tabs-container {
    margin-top: 16px;
    height: calc(100vh - 180px);

    :deep(.el-tabs__content) {
      height: calc(100% - 55px);
      padding: 10px;
    }

    :deep(.el-tab-pane) {
      height: 100%;
    }

    // ⚠️ 核心样式：确保拖拽组件能正常工作（必需！）
    :deep(.drager_row) {
      height: 100%;
    }
  }

  // 章节标题
  .section-header {
    display: flex;
    align-items: center;
    margin: 0 0 12px 0;

    .title-bar {
      width: 4px;
      height: 16px;
      background: #409eff;
      margin-right: 8px;
      border-radius: 2px;
    }

    .section-title {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }
  }

  // 操作按钮区域
  .operation-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 4px;
    margin: 16px 0;

    .operation-left,
    .operation-center,
    .operation-right {
      display: flex;
      align-items: center;
    }

    .operation-center {
      flex: 1;
      justify-content: center;

      .label {
        font-size: 14px;
        color: #606266;
        margin-right: 8px;
      }
    }
  }

  // 产出实绩区域：左右布局
  .results-container {
    display: flex;
    gap: 16px;
    margin-top: 16px;
    height: 100%;
    overflow: hidden;

    .section {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      height: 100%;
      overflow: hidden;

      &.left-section {
        border-right: 1px solid #ebeef5;
        padding-right: 8px;
      }

      &.right-section {
        padding-left: 8px;
      }

      .section-header {
        margin: 0 0 12px 0;
        flex-shrink: 0;
      }

      .table-box {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
      }

      // 分页区域在section-footer内部
      .section-footer {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-top: 12px;
        padding: 12px 0 0 0;
        border-top: 1px solid #ebeef5;
        flex-shrink: 0;
        background: #fff;

        :deep(.jh-pagination) {
          margin-top: 8px;
        }
      }
    }
  }

  // 高亮当前行
  :deep(.el-table__body tr.current-row > td) {
    background-color: #ecf5ff !important;
  }

  // 空状态提示
  .empty-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 200px;
  }
}
```

</details>

<details>
<summary>📄 types.ts - 配置类型定义</summary>

```typescript
/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2026-02-04
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2026-02-04 09:08:39
 * @FilePath: \cx-ui-produce\src\views\produce\production-mmwr\jzsj\template\config.type.ts
 * @Description: 精整实绩管理 - 通用模板配置类型定义
 * Copyright (c) 2026 by CHENY, All Rights Reserved 😎.
 */

import type { BaseQueryItemDesc, TableColumnDesc } from "@/types/page";

/**
 * API 配置接口
 */
export interface FinishingApiConfig {
  /** 计划排程列表 */
  planList: string;
  /** 待上料信息列表 */
  materialList: string;
  /** 产出合格实绩列表 */
  qualifiedList: string;
  /** 不合格实绩列表 */
  unqualifiedList: string;
  /** 上料操作 */
  upMaterial: string;
  /** 取消上料 */
  cancelUpMaterial: string;
  /** 产出操作 */
  output: string;
  /** 取消合格 */
  cancelPass: string;
  /** 取消不合格 */
  cancelUnPass: string;
  /** 产出完毕 */
  outputFinish: string;
}

/**
 * 工序配置接口
 */
export interface ProcessConfig {
  /** 第一道工序代码 */
  firstProcess: string;
  /** 第二道工序代码（子工序） */
  subBacklogCode: string;
  /** 工序名称（用于提示） */
  processName: string;
}

/**
 * 查询配置接口
 */
export interface QueryConfig {
  plan?: {
    /** 查询项配置 */
    items: BaseQueryItemDesc<any>[];
    /** 默认查询参数 */
    defaultParams?: Record<string, any>;
    /** 查询列数 */
    columns?: number;
    /** 标签宽度 */
    labelWidth?: string;
  };
}

/**
 * 表格列配置接口
 */
export interface ColumnsConfig {
  /** 计划排程表格列 */
  planColumns: TableColumnDesc<any>[];
  /** 待上料信息表格列 */
  materialColumns: TableColumnDesc<any>[];
  /** 产出合格实绩表格列 */
  qualifiedColumns: TableColumnDesc<any>[];
  /** 不合格实绩表格列 */
  unqualifiedColumns: TableColumnDesc<any>[];
}

/**
 * UI 配置接口
 */
export interface UiConfig {
  /** 页面主类名 */
  mainClass: string;
  /** 第一个Tab标题 */
  planTabLabel?: string;
  /** 第二个Tab标题 */
  actualTabLabel?: string;
  /** 待上料区域标题 */
  materialSectionTitle?: string;
  /** 合格实绩区域标题 */
  qualifiedSectionTitle?: string;
  /** 不合格实绩区域标题 */
  unqualifiedSectionTitle?: string;
  /** 产出完毕按钮文案 */
  outputFinishBtnText?: string;
}

/**
 * 精整实绩管理页面完整配置接口
 */
export interface FinishingAchievementConfig {
  /** API 配置 */
  api: FinishingApiConfig;
  /** 工序代码（简化配置，如 "JZ", "BP" 等） */
  processCode: string;
  /** 查询配置 */
  query?: QueryConfig;
  /** 表格列配置 */
  columns?: ColumnsConfig;
  /** UI 配置 */
  ui?: Partial<UiConfig>;
}

/**
 * 默认 UI 配置
 */
export const DEFAULT_UI_CONFIG: UiConfig = {
  mainClass: "mmwr-finishing-achievement",
  planTabLabel: "计划排程信息",
  actualTabLabel: "现场实绩信息",
  materialSectionTitle: "上料信息清单",
  qualifiedSectionTitle: "产出合格实绩",
  unqualifiedSectionTitle: "不合格实绩",
  outputFinishBtnText: "产出完毕",
};
```

</details>
