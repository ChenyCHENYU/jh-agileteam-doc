# 打印报表接入指南（业务工程视角）

<AuthorTag :authors="['ZhuXiang']" />

> 依据《打印报表平台_运维操作手册》（REQ-20260903-01）。平台侧操作（第 1~8 步）见 [运维操作手册](./report-ops)；本页只讲业务工程（以 wl-ui-produce 为例）如何挂载打印。
> 依据《打印报表平台_运维操作手册.docx》（REQ-20260903-01）。平台侧操作（建目录/数据源/模板/发布，手册第 1~8 步）不在本文范围。
> 远程模块 `jh4j-cloud-report` 已确认部署于 SIT（`https://ytiop-sit.walsin.com.cn:8443/sub/jh4j-cloud-report/assets/remoteEntry.js`，已实测可访问，expose 齐全）。**UAT/PRD 需各自确认一次部署**。

## 一、接入方式（本工程已封装）

组件封装：`src/components/global/C_ReportPreview/index.ts`（纯新增文件，不改任何既有代码）。

```vue
<script setup lang="ts">
import ReportPreview from "@/components/global/C_ReportPreview";
import { loadReportRemote } from "@/components/global/C_ReportPreview";

const tempId = ref("");            // 报表平台"批量发布"后拿到的报表ID
const params = ref<Record<string, string>>({ id: "" }); // 键名=报表参数登记名，区分大小写
const previewRef = ref<any>(null);
// 其他可用远程组件：reportHtmlPreview / reportFill / filePreview / richtextPreview
// const ReportHtmlPreview = defineAsyncComponent(() => loadReportRemote("reportHtmlPreview"));
</script>

<template>
  <ReportPreview
    v-if="tempId"
    ref="previewRef"
    :temp-id="tempId"
    :params="params"
    height="calc(100vh - 206px)"
  />
</template>
```

弹窗打印按钮：`previewRef.value?.print()`（iemp 现网范例：`wl-ui-iemp/src/views/emp/basedata/eqLedger/index.vue`）。

### 组件契约（实测自 SIT 部署产物，与手册 11.2 一致）

| prop | 类型/默认 | 说明 |
|---|---|---|
| temp-id | string \| string[]，必填 | 逗号串/数组＝多模板按序拼接 |
| furniture-temp-id | string | 公共页眉页脚/水印模板ID |
| params | Record，`{}` | 报表参数，键名与平台登记名一致（区分大小写） |
| height | string，`100vh` | 弹窗内建议 `calc(100vh - 280px)` |
| auto-load / show-export / show-print / show-pdf-window | boolean，`true` | 工具栏显隐 |

事件：`loaded(pageCount)`、`error(message)`；ref 暴露：`reload / print / exportAs(format) / openPdfWindow / gotoPage(n)`。
别照抄手册范例的 `:dpi="120"`（组件未声明该 prop，现网遗留无效写法）。

## 二、为什么用 fetchRemoteComponent 而不是手册的 fetchComp

手册/iemp 标准写法 `lowcodeEnv().fetchComp("jh4j-cloud-report", "...", true)` 在**部署态正常**，但本地 dev（`isBuild=false`）会走本地页面表查找（`pages-dev.ts` 为空桩），组件解析为 null，页面空白且不发起任何网络请求。

`fetchRemoteComponent`（`@/util/system`）强制走远程分支，**dev 与部署态行为一致**——与本工程 dev 启动加载 public/systemApp 远程模块是同一条代码路径。dev 下经 `/sub` 代理（`vite/config/server.ts`）从 SIT 拉取 remoteEntry，API 走 `/sit-api` 代理随平台请求链路带 token。

首次接入后本地验证（dev 登录后浏览器 Console）：

```js
const m = await import("/src/components/global/C_ReportPreview/index.ts");
const c = await m.loadReportRemote("reportPreview");
console.log(c); // 组件对象 => 链路通
```

## 三、注意事项

1. **tempId 集中管理**：放常量文件或字典，禁止散落各 .vue。跨环境迁移必须用报表平台"导出/导入 ZIP"（tempId 保持不变，代码零修改）；各环境手工重建则 ID 会变。
2. **参数三段链路严格一致**（区分大小写）：前端 `params` 键名 = 平台"报表参数"登记名 = 数据集 SQL `#{名字}`。预览空白优先查这里，其次动态 SQL 判空去掉了条件。
3. **先发布再挂载**：草稿模板技术上可渲染，必须遵守"PDF 验收 → 发布 → 挂载"，别把草稿 ID 写进代码。
4. **换单据闪旧内容**：打开时先 `tempId.value = ""` 再请求，并给组件加 `:key="tempId"`。
5. **数据源用只读账号**；SQL 数据集仅允许单条 SELECT。
6. **业务账号权限**：渲染走 `/report/codePrintReport/*` 接口，首个接入页面需用目标角色实测一次（iemp 业务账号已跑通，风险低）。
7. 升级 element-plus / @jhlc/common-core 时，回归一次报表预览（远程组件与宿主共享这些依赖的 singleton）。

## 四、后端 wl-produce：零改动

报表取数用 SQL 数据集直连业务库（只读账号）即可，wl-produce 无需任何代码。仅两种情况需要后端：

- **接口型数据集**：数据需业务逻辑加工时，把 wl-produce 接口注册到平台接口注册中心供报表回调；
- **动态模板**：按单据类型动态决定 tempId 串时，仿 pn-mes 的 `reportRef` 接口。一般场景用常量/字典即可，不必做。
