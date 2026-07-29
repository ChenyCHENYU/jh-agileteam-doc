# 字典翻译

> 适用范围：PC 端业务前端（`wl-ui-produce`、`wl-ui-safe`、`wl-ui-sale` 等）。所有字典翻译均走后端字典系统，不前端写死——客户在字典后台维护选项后，前端立即生效。

::: tip 一句话原则
字典数据来源只有一个：**后端字典系统 → common-core Pinia store**。所有渲染层、查询层、表单层都从同一个 store 取值，绝不复制选项到本地。
:::

## 架构

```text
后端字典系统
    │
    ▼
common-core / Pinia store          ← 数据层：加载、缓存、查 label
│  store.get(key)    → 选项数组
│  store.getLabel()  → 纯文本
│
├── wl-skills-ui / renderers       ← 渲染层：带颜色标签
│   renderDictClassifyTag()        ← setDictResolver 桥接查 store
│   registerDictColorMaps()        ← 注册配色
│
└── shared/dict-options.ts         ← 封装层：表单下拉 + 纯文本
    useDictOpts()    → 响应式选项（computed）
    getDictLabel()   → 纯文本（同步）
```

## 前置：全局初始化（main-core.ts，一次性）

::: warning 必须注入桥接
不调用 `setDictResolver` 注入桥接，`renderDictClassifyTag` 只会显示原始值（如 `0`/`1`），不会翻译成「失败」「成功」。
:::

```typescript
import { installCommonPreset } from "@agile-team/wl-skills-ui/runtime/common-preset";
import { registerDictColorMaps, setDictResolver } from "@agile-team/wl-skills-ui/runtime";
import useBusinessLogicDataStore from "@jhlc/common-core/src/store/business-logic-data";
import { BusLogicKey, BusLogicDataType } from "@jhlc/types/src/logical-data";

installCommonPreset();

// 桥接：让 wl-skills-ui 渲染器能从 store 查 label
// 不注入的话 renderDictClassifyTag 只会显示原始值（如 0/1），不会翻译
setDictResolver((dictKey: string, value: any) => {
  const store = useBusinessLogicDataStore();
  const key = new BusLogicKey({ logicType: BusLogicDataType.dict, logicValue: dictKey });
  const opts = store.get(key) ?? [];
  const found = opts.find((o: any) => String(o.value) === String(value));
  return found?.label ?? null;
});

// 注册配色（状态列用语义色，分类列可不注册自动轮转）
registerDictColorMaps({
  // 按各自项目业务字典 SN 配置，示例：
  // orderStatus:   { "0": "info", "1": "success", "2": "danger" },
  // pushResult:    { "0": "danger", "1": "success" },
});
```

---

## 场景速查

| 场景 | 用什么 | 返回值 | 颜色 |
|------|--------|--------|:----:|
| 列表列 | `renderDictClassifyTag(row.xxx, "dictSN")` | VNode 标签 | ✅ |
| 查询项下拉 | `logicType: dict, logicValue: "dictSN"` | 自动加载选项 | — |
| 表单下拉 | `useDictOpts("dictSN")` | `[{label, value}]` | — |
| 纯文本 | `getDictLabel("dictSN", value)` | 字符串 | ❌ |

---

## 场景一：列表列翻译（带颜色标签）

配合 [BaseTable](/frontend/pc/components/base-table)，在 `data.ts` 的列定义里用 `renderDictClassifyTag`：

```typescript
// data.ts
import { BusLogicDataType } from "@/types/page";
import { defineColumns, renderDictClassifyTag } from "@agile-team/wl-skills-ui/runtime";

columnsDef() {
  return defineColumns([
    {
      label: "推送结果",
      name: "receiveStatus",
      minWidth: 100,
      defaultSlot: ({ row }) =>
        renderDictClassifyTag(row.receiveStatus, "pushResult"),
    },
  ]);
}
// 渲染效果：值 0 → 红色标签「失败」 / 值 1 → 绿色标签「成功」
```

> `dictSN` 是后端字典编码，如 `pushResult`、`orderStatus`、`problemLevel`。

## 场景二：查询项下拉（自动加载）

配合 [BaseQuery](/frontend/pc/components/base-query)，无需手写 `options`，平台自动从后端字典加载（与 [jh-select](/frontend/pc/components/jh-select) 同源机制）：

```typescript
// data.ts — 无需手写 options，平台自动从后端字典加载
queryDef() {
  return [
    {
      name: "problemType",
      label: "问题类型",
      logicType: BusLogicDataType.dict,
      logicValue: "problemType",
    },
  ];
}
```

## 场景三：表单下拉（向导页 / 自定义表单）

需要先在项目 `shared/dict-options.ts` 封装（wl-mdata 已有，其他项目可复制）：

```typescript
// shared/dict-options.ts
import { computed, type ComputedRef } from "vue";
import { BusLogicKey, BusLogicDataType } from "@jhlc/types/src/logical-data";
import useBusinessLogicDataStore from "@jhlc/common-core/src/store/business-logic-data";

export function useDictOpts(dictSn: string): ComputedRef<{ label: string; value: any }[]> {
  return computed(() => {
    const store = useBusinessLogicDataStore();
    const key = new BusLogicKey({ logicType: BusLogicDataType.dict, logicValue: dictSn });
    return store.get(key) ?? [];
  });
}

export function getDictLabel(dictSn: string, value: unknown, fallback = "-"): string {
  if (value === null || value === undefined || value === "") return fallback;
  const store = useBusinessLogicDataStore();
  const key = new BusLogicKey({ logicType: BusLogicDataType.dict, logicValue: dictSn });
  const opts = store.get(key) ?? [];
  const found = opts.find((o: any) => String(o.value) === String(value));
  return found?.label ?? String(value);
}
```

页面使用：

```typescript
// data.ts 顶部
import { useDictOpts } from "@/views/xxx/shared/dict-options";

export const DATA_TYPE_OPTS = useDictOpts("dataType");
// 返回 ComputedRef，store 加载后自动更新
```

```html
<!-- index.vue -->
<el-select v-model="form.dataType">
  <el-option
    v-for="opt in DATA_TYPE_OPTS"
    :key="opt.value"
    :label="opt.label"
    :value="opt.value"
  />
</el-select>
```

## 场景四：纯文本翻译（alert / 模板插值）

```typescript
import { getDictLabel } from "@/views/xxx/shared/dict-options";

// 在消息提示中
ElMessage.info(`任务状态：${getDictLabel("execStatus", row.taskStatus)}`);
// → "任务状态：已完成"

// 在模板中
// <span>{{ getDictLabel("status", item.status) }}</span>
// → "启用"
```

> `getDictLabel` 同样走 store 实时查后端字典，不是写死的。首次调用时 store 可能还未加载完成，会返回原始值，store 加载后自动更新。

---

## 注意事项

- **后端返回 Integer（0/1/2），字典 key 是 String（"0"/"1"/"2"）**：`setDictResolver` 和 `getDictLabel` 内部均做了 `String()` 转换，Integer 值也能正确匹配。
- **el-select v-model 绑定 Integer 字段时**：回填需手动 `String(value)` 转换，否则严格相等匹配不上。
- **Tab 类布局不走路典**：Tab 是 UI 结构（顺序固定），用前端硬编码，不用字典。
- **配色规则**：状态列（*Status）用语义色必须注册；分类列（*Type）不注册会自动轮转配色。
- **新增字典配色**：在 `main-core.ts` 的 `registerDictColorMaps` 中添加即可，全局生效。
