<template>
  <VersionChip :version="latest || fallback" :live="!!latest" padding="0.05rem 0.45rem" font-size="0.82em" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import VersionChip from "../VersionChip/index.vue";
import { fetchNpmLatest } from "../../composables/useNpmDistTags";

const props = withDefaults(defineProps<{ pkg: string; fallback?: string }>(), { fallback: "—" });
const latest = ref("");

onMounted(async () => {
  // 走共享缓存（fetchNpmLatest）：同页多实例/跨页面复用同一请求
  latest.value = (await fetchNpmLatest(props.pkg)) ?? "";
});
</script>
