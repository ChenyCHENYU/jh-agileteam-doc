# 表单与校验规范（11）

> **平台规范第 11 条** · 强制度：🔴 必遵。

::: info 来源
`@agile-team/wl-skills-kit` · `standards/11-form-validation.md`
:::

<AuthorTag :authors="['ZhuXiang','CHENY','ZhongYu','XuQingYu']" />

---

## c_formModal / c_formSections 场景

平台已封装组件，**内置完整生命周期**：

```
open → 数据回填 → validate → submit → close / resetFields
```

✅ AI 直接按组件文档使用即可，**不需要重复写 validate / resetFields 逻辑**。

参考：`src/components/local/c_formModal/README.md`

---

## FORM_ROUTE 独立路由表单页（c_formModal 不适用时）

无 c_formModal 托管的复杂表单（多 Tab、多子表、向导式），**必须遵守**：

### 1. 提交前调用 validate

```typescript
async function handleSubmit() {
  const valid = await formRef.value?.validate();
  if (!valid) return;
  await postAction(API_CONFIG.save, formData.value);
}
```

### 2. 取消/离开调用 resetFields

```typescript
function handleCancel() {
  formRef.value?.resetFields();
  router.back();
}

onBeforeRouteLeave(() => {
  formRef.value?.resetFields();
});
```

### 3. rules 在 data.ts 中独立导出

```typescript
// data.ts
export const formRules = {
  fieldName: [
    { required: true, message: "请输入字段名", trigger: "blur" },
    { max: 50, message: "不超过 50 字符", trigger: "blur" },
  ],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
};
```

::: danger 禁止
把 rules 写在 `<template>` 字面量里。
:::

---

## 校验时机

| 时机              | 触发                             |
| ----------------- | -------------------------------- |
| `blur` 失焦       | 字符串类、必填字段               |
| `change` 变更     | 选择类（select / date / picker） |
| 手动 `validate()` | 提交时全量校验                   |
| 字段间联动        | `watch` + 手动 `validateField()` |

## AI 检查清单

生成 FORM_ROUTE 模板代码时确认：

- [ ] 提交按钮 click 处理函数中调用了 `formRef.value?.validate()`
- [ ] 取消按钮 / 路由离开钩子中调用了 `resetFields()`
- [ ] rules 定义在 `data.ts` 而非 `<template>`
- [ ] 必填字段都加了 `required: true` 校验规则
