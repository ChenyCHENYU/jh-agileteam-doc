# MachTable — 企业数据表格

> 面向复杂 B 端业务的高性能 TypeScript 数据表格：框架无关内核、零核心运行时依赖、Vue 3 优先 + React 18+ 官方适配。生态中**下载量最高**的包（月下载 16 万+，28 个外部依赖方）。

::: warning 授权说明
MachTable 采用 **Source-Available License 1.0**——源码可见但**不是开源软件**：安装、运行、修改、集成、分发或商业使用均须事先取得作者书面授权（团队内部项目已有授权体系）。详见仓库 `LICENSING.md`。
:::

## 四件套矩阵

| 包 | 定位 |
|----|------|
| `@agile-team/mach-table` | 框架无关内核（原生 TS/JS 直接用） |
| `@agile-team/mach-table-vue` | Vue 3 官方适配（自动安装匹配 Core） |
| `@agile-team/mach-table-react` | React 18+ 官方适配 |
| `@agile-team/mach-table-xlsx` | 可选 XLSX 导入导出扩展 |

版本统一发布（当前 0.29.2）；业务**只装一个适配包**，Core 自动带入。

---

## 能力矩阵（高频复杂场景做成产品能力）

| 维度 | 已具备 |
|------|--------|
| 大数据 | 行列双虚拟化、行池复用、可变行高索引、随机访问远程块、LRU 与并发控制、可选 Worker |
| 数据模型 | 本地/服务端排序过滤、分页、无限滚动、树与懒加载、分组聚合、主从详情、固定行 |
| 编辑 | 单元格与原子整行编辑、同步/异步校验、脏数据、撤销重做、部分保存与冲突处理 |
| 交互 | 多选/范围选择、复制粘贴、填充柄、拖拽、列工作台、统一无闪烁下拉、上下文菜单、操作列 |
| 治理 | 分层配置、命名预设、配置来源解释、**12 个领域化 API**、版本化状态、稳定错误码、诊断快照 |
| 安全 | CSV 公式注入防护、安全字段路径、资源销毁与请求取消 |

---

## 60 秒上手（Vue 3）

```bash
pnpm add @agile-team/mach-table-vue
```

```vue
<script setup lang="ts">
import { ref } from "vue";
import { MachTable, defineVueColumns, indexColumn, selectionColumn, useMachTable } from "@agile-team/mach-table-vue";
import "@agile-team/mach-table-vue/styles.css";

const rows = ref([{ id: "SO-001", customer: "Acme", amount: 12800 }]);
const columns = defineVueColumns([
  selectionColumn(),
  indexColumn({ headerName: "序号" }),
  { field: "id", headerName: "订单号", width: 130, pinned: "left" },
  { field: "customer", headerName: "客户", flex: 1, editable: true },
]);
</script>

<template>
  <div style="height: 560px">
    <MachTable :column-defs="columns" :row-data="rows" row-key="id" />
  </div>
</template>
```

---

## 与 jh-* 生态的分工

| 场景 | 用什么 |
|------|--------|
| 标准 jh4j 列表页（配 BaseTable 基线、convention-audit 门禁） | kit 体系 + `jh-pagination` / BaseTable |
| 超大数据量、可编辑工作台、分组聚合、跨框架复用 | **MachTable** |
| 两者的审计与视觉规范 | 同受 wl-skills-ui R 系扫描与 kit validate 约束 |

> MachTable 与平台 BaseTable 是**互补关系**：标准列表用平台基线（审计全覆盖），复杂表格场景用 MachTable，不混用同一页面的两套表格内核。

---

## 工程质量基线（维护方承诺）

- Core **零运行时依赖**；可选能力（UI/Worker/编辑器/XLSX）全部独立子入口；
- 质量门禁：复杂度豁免 0、生产函数复杂度 ≤ 15、API 快照、ESM/CJS exports、gzip 预算、发布产物校验；
- E2E 覆盖 Chromium / Firefox / WebKit，含大数据与生命周期性能场景。

完整文档见仓库：[快速开始](https://github.com/ChenyCHENYU/MachTable/blob/main/docs/guide/getting-started.md) · [企业接入手册](https://github.com/ChenyCHENYU/MachTable/blob/main/docs/guide/enterprise-integration.md) · [API](https://github.com/ChenyCHENYU/MachTable/blob/main/docs/api/grid-options.md)
