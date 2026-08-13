# 非必填过滤

<AuthorTag :authors="['CHENY']" />

> 大表单中混合必填/非必填字段时，一键切换"仅显示必填"，隐藏字段同步清理校验且不丢数据。

::: tip 版本要求
- `@agile-team/wl-skills-kit` ≥ v2.16.0
- `@robot-admin/form-validate` ≥ v3.4.1（R18 校验库版本检查）
:::

---

## 适用场景

| 场景 | 说明 |
|------|------|
| 大型弹窗表单 | 30+ 字段，其中 10 个必填，用户只想快速填必填项 |
| 分区表单 | 多个 Section，每区有必填和非必填混合 |
| 多 Tab 子表单 | 每个 Tab 独立控制必填过滤 |
| 独立路由表单 | 页面级 BaseForm，需要必填过滤开关 |

---

## 四种接入形态

### 1. 弹窗表单（c_formModal）

```vue
<c-form-modal
  show-required-toggle
  :form-data="formData"
  :rules="rules"
  @submit="handleSubmit"
/>
```

| 属性 | 类型 | 说明 |
|------|------|------|
| `show-required-toggle` | `boolean` | 开启"仅必填"切换按钮 |

开启后弹窗顶部出现切换开关，勾选时隐藏所有非必填字段，隐藏字段的校验规则同步清理（不触发校验错误），取消勾选时恢复全部字段且数据不丢失。

### 2. 分区表单（c_formSections）

```vue
<c-form-sections
  show-required-filter
  :sections="sections"
  :rules="rules"
/>
```

| 属性 | 类型 | 说明 |
|------|------|------|
| `show-required-filter` | `boolean` | 开启分区级"仅必填"过滤 |

每个 Section 独立判断是否有必填字段，只有混合了必填/非必填的 Section 才显示切换开关。全必填的 Section 不显示（无需切换）。

### 3. 普通 BaseForm（useFormRequiredOnly）

```typescript
import { useFormRequiredOnly } from "@/hooks/useFormRequiredOnly";

const { filteredFields, showToggle, isRequiredOnly } = useFormRequiredOnly({
  fields: formFields,
  rules: formRules,
});

// 在模板中使用
// <el-switch v-if="showToggle" v-model="isRequiredOnly" />
// <el-form-item v-for="field in filteredFields" :key="field.prop" ...>
```

| 返回值 | 类型 | 说明 |
|--------|------|------|
| `filteredFields` | `ComputedRef<Field[]>` | 过滤后的字段列表（仅必填模式下只含必填字段） |
| `showToggle` | `ComputedRef<boolean>` | 是否显示切换开关（只有混合必填/非必填时为 true） |
| `isRequiredOnly` | `WritableComputedRef<boolean>` | 切换状态（双向绑定） |

### 4. 多 Tab 子表单

```vue
<el-tabs v-model="activeTab">
  <el-tab-pane label="基本信息">
    <c-form-sections
      show-required-filter
      :sections="basicSections"
      :rules="basicRules"
    />
  </el-tab-pane>
  <el-tab-pane label="扩展信息">
    <c-form-sections
      show-required-filter
      :sections="extSections"
      :rules="extRules"
    />
  </el-tab-pane>
</el-tabs>
```

每个 Tab 的表单独立判断，互不影响——基本信息 Tab 开启过滤不影响扩展信息 Tab。

---

## 数据安全

| 关注点 | 保证 |
|--------|------|
| 隐藏字段的数据 | ✅ 保留在 form 对象中，不丢失 |
| 隐藏字段的校验 | ✅ 同步清理，不触发校验错误 |
| 切换回来后 | ✅ 字段和数据完整恢复 |
| 提交时 | ✅ 完整 form 提交，包含隐藏字段值 |

---

## 审计规则

| 规则 | 说明 |
|------|------|
| **R17** | 表单仅必填开关按每个实际绑定逐项判断（弹窗/独立页面/分区表单全覆盖） |
| **R18** | 表单校验库 `@robot-admin/form-validate@^3.4.1` 版本范围检查 |

convention-audit 会检测项目中是否正确使用 `show-required-toggle` / `show-required-filter` / `useFormRequiredOnly`，以及表单校验库版本是否达标。

---

## 常见问题

**Q：全必填的表单会显示开关吗？**
A：不会。只有混合了必填和非必填字段的表单才会显示切换开关。

**Q：隐藏的字段会被提交吗？**
A：会。隐藏只是 UI 层面的过滤，form 数据对象不变，提交时包含所有字段值。

**Q：切换过程中数据会丢失吗？**
A：不会。`useFormRequiredOnly` 只操作字段显示列表和校验规则，不触碰数据。

**Q：同一个页面有多个大表单会互相影响吗？**
A：不会（v2.16.9 修复）。每个表单独立判断，单个已开启弹窗不会掩盖同页其他大表单的检查。
