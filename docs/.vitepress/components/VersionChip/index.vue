<script lang="ts" setup>
/**
 * 版本徽章（NpmVersion / PackagesTable / EcosystemTable 共用）
 * 实时数据时带绿点前缀，否则展示构建时兜底值。
 */
withDefaults(
  defineProps<{
    /** 展示版本（优先实时值，缺省兜底值） */
    version: string;
    /** 是否来自 npm registry 实时数据 */
    live?: boolean;
    /** 内部源包（虚线边框灰底） */
    internal?: boolean;
    /** 徽章内边距（个别场景与默认微调） */
    padding?: string;
    /** 徽章字号 */
    fontSize?: string;
  }>(),
  { live: false, internal: false, padding: "0.1rem 0.5rem", fontSize: "0.82rem" }
);
</script>

<template>
  <span
    class="ver-chip"
    :class="{ 'is-live': live, 'is-internal': internal }"
    :style="{ padding, fontSize }"
    :title="
      internal
        ? '未发布到公共 npm registry（内部源），版本以内部制品库为准'
        : live
          ? '来自 npm registry 实时数据'
          : '构建时版本（实时获取失败时的兜底值）'
    "
    >{{ internal ? "内部源" : `v${version}` }}</span
  >
</template>

<style scoped>
.ver-chip {
  display: inline-block;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 500;
  white-space: nowrap;
}
.ver-chip.is-live::before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
  margin-right: 5px;
  vertical-align: 1px;
}
.ver-chip.is-internal {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px dashed var(--vp-c-divider);
}
</style>
