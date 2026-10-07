<template>
  <span
    class="npmv"
    :class="{ 'is-live': latest }"
    :title="latest ? '来自 npm registry 实时数据' : '构建时版本（实时获取失败时的兜底值）'"
  >v{{ latest || fallback }}</span>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = withDefaults(defineProps<{ pkg: string; fallback?: string }>(), { fallback: "—" });
const latest = ref("");

onMounted(async () => {
  try {
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(props.pkg)}`, {
      headers: { Accept: "application/vnd.npm.install-v1+json" },
    });
    if (!res.ok) return;
    const data = (await res.json()) as { "dist-tags"?: Record<string, string> };
    latest.value = data["dist-tags"]?.latest ?? "";
  } catch {
    /* 网络失败时保持兜底值 */
  }
});
</script>

<style scoped>
.npmv {
  display: inline-block;
  padding: 0.05rem 0.45rem;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.82em;
  font-weight: 500;
  white-space: nowrap;
}
.npmv.is-live::before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
  margin-right: 4px;
  vertical-align: 1px;
}
</style>
