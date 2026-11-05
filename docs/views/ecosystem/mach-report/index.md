---
description: "面向业务宽表、明细台账与工业标签的 TypeScript 报表引擎：模板/数据/输出分离、毫米页面模型、Excel 模板绑定、PDF/XLSX/PNG/Word 输出、前后端共用契约；本板块含概览、快速上手、API 参考与场景示例…"
---

# MachReport — 分页报表引擎

<AuthorTag :authors="['CHENY']" />

> 面向**业务宽表、明细台账与工业标签**的 TypeScript 报表引擎：完整宽表、Excel 模板绑定、规则填报与数据核对、工业标签、前后端共用契约。核心运行时**零依赖**，TypeScript first，Vue 3 官方组件入口 + 框架无关引擎。

::: warning 授权说明
MachReport 采用 **Source-Available License 1.0**（授权需书面取得，与 MachTable 同体系）——源码公开供查看和评估，安装、运行、修改、集成、部署、分发或商业使用须事先取得作者书面授权。详见仓库 `LICENSING.md`。
:::

## 本板块导航

| 页面 | 内容 |
|------|------|
| [快速上手](./getting-started) | 安装与按需入口、Vue 插件注册、原生引擎、宽表 vs 标准纸张、`useMachReport()` |
| [API 参考](./api) | 能力入口速查、RenderPlan 数据模型、`createTableTemplate` 选项、预览组件 Props/事件/方法 |
| [场景示例](./recipes) | 生产日报宽表、工业标签、Excel 模板导入、单元格编辑、后端返回 RenderPlan 等 |

## 设计思想：模板、数据、输出分离

用 TypeScript DSL 或 JSON 定义布局与内容，由引擎生成统一的 `RenderPlan`，再交给预览、打印或文件导出。**设计、验收与执行共用一套模板**：

| 工作 | 包内提供 | 宿主只需提供 |
|------|---------|-------------|
| 可视化设计 | 毫米画布、样例对齐、组件锁定、列宽与多层表头 | 模板文档与保存回调 |
| Excel 业务化 | 选 Sheet → 标题/表头/明细/页尾区域 → 字段映射 → 预览 | 工作簿、数据集与字段契约 |
| 计算与复杂单据 | 声明式表达式、精确十进制、多级分组、主从关系与动态矩阵 | 业务数据与口径 |
| 发布验收 | 变更分类、字段依赖检查、显式样例、服务端真实 PDF/XLSX 编码 | 验收样例、字体、原子 CAS 存储 |
| 大任务 | 逐页生成、增量编辑历史、租约/幂等/取消/失败重试 | 调度与文件归档 |

数据接口、鉴权与业务规则由宿主应用决定；包内统一校验、分页、编辑事务、设计器和版本流程。

---

## 能力矩阵

| 维度 | 已具备的能力 |
|------|-------------|
| 页面模型 | 毫米单位、纸张预设与自定义尺寸、页边距、横纵向、文本与表格几何 |
| 完整宽表 | 自然列宽、横向滚动、默认 100% 预览；页级与宽表行列视口裁剪，Excel 自动合并连续 Sheet |
| 明细与汇总 | 自动分页、多级分组与加权小计、业务键主从明细、层级动态矩阵、重复页眉页脚 |
| 数据呈现 | 独立对齐与字段格式、组合条件、数据条/色阶、声明式聚合图表、富文本与格内子组件 |
| 预览交互 | 多选/级联/数值范围参数、远程字典、搜索与字段目录、跨页选区、原生固定列与 Sheet 导航 |
| 标识工作台 | `ReportLabelStudio` 直接传 rows/schema；包内完成标签设计、真实码图、逐记录预览与原尺寸输出 |
| 内容编辑 | 默认只读；双击/粘贴、整批候选校验、安全预填、原子保存、撤销/重做与差异审阅 |
| Excel 导入 | 混合字体与只读富文本、PNG/JPEG Logo、完整索引色、多 Sheet 会话复用、可取消预检、合并样式与缓存公式值转换为模板 |
| 输出 | 浏览器打印、HTML、PDF、真正的 `.xlsx`、逐页 PNG、Word 兼容 HTML `.doc` |
| 工程接入 | 局部组件、全局插件、异步入口、分层配置、结构化错误与导出告警 |
| 引擎复用 | 共用业务语义与计算、逐页排版、OpenAPI/Java 客户端、流式 Excel、可恢复持久任务 |

---

## 60 秒上手（Vue 3）

```bash
pnpm add @agile-team/mach-report
```

```vue
<script setup lang="ts">
import { createTableTemplate, createLocalFetcher, ReportPreview } from "@agile-team/mach-report/vue";
import "@agile-team/mach-report/vue/style.css";

const template = createTableTemplate({
  title: "产品出库单",
  columns: [
    { header: "物料", field: "name", flex: 2 },
    { header: "数量", field: "qty" }
  ]
});

const fetcher = createLocalFetcher({
  outbound: { template, datasets: { detail: [{ name: "物料 A", qty: 3 }] } }
});
</script>

<template>
  <ReportPreview report-id="outbound" :fetcher="fetcher" height="70vh" />
</template>
```

标准明细只定义标题和列：默认 A4、10mm 页边距、`detail` 数据集，自动分配列宽并分页。

---

## 与站内其他报表体系的关系

| 场景 | 用什么 |
|------|--------|
| 低代码平台打印报表（jh4j-cloud-report） | [平台打印报表](/platform/report-ops)（业务工程接入选型见[接入指南](/platform/report-guide)） |
| 前端自持模板的业务单据/宽表/工业标签，需要代码化版本管理 | **MachReport** |
| 团队内部 wl-report / wl-report-ui 项目 | 内部交付物，模板与取数按项目现状执行 |

---

## 工程质量基线（维护方承诺）

- 核心入口**零运行时依赖、零框架依赖**；PDF/XLSX/编码/设计器等重能力全部独立子路径；
- 全量 `pnpm verify` 门禁：类型 → lint/复杂度（生产函数 ≤ 20）→ 构建 → API 声明快照 → SBOM → 覆盖率（语句 85/分支 80）→ 文档 → 隔离消费 → 真实 PDF/XLSX 回读验收；
- E2E 真实 Chromium；axe 无障碍检查零规则豁免；有种子的格式属性模糊测试。

更多细节见仓库：[完整文档](https://github.com/ChenyCHENYU/MachReport/tree/main/docs) · [示例集](https://github.com/ChenyCHENYU/MachReport/tree/main/examples)。
