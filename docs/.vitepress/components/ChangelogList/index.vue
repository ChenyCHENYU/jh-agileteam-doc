<template>
  <div class="cl-list">
    <p v-if="!items.length" class="cl-empty">加载中…（若持续为空，说明本次构建时 git log 不可用）</p>
    <ul v-else class="cl-items">
      <li v-for="item in items" :key="item.hash" class="cl-item">
        <span class="cl-date">{{ item.date }}</span>
        <a
          :href="`https://github.com/ChenyCHENYU/jh-agileteam-doc/commit/${item.hash}`"
          class="cl-hash"
          target="_blank"
          rel="noopener"
        >{{ item.hash }}</a>
        <span class="cl-subject">{{ item.subject }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

interface LogItem {
  hash: string;
  date: string;
  subject: string;
}

const items = ref<LogItem[]>([]);

onMounted(async () => {
  try {
    const res = await fetch("/data/changelog.json");
    if (res.ok) items.value = ((await res.json()) as { items: LogItem[] }).items || [];
  } catch {
    /* 保持空态提示 */
  }
});
</script>

<style scoped>
.cl-list {
  margin: 0.5rem 0;
}
.cl-empty {
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}
.cl-items {
  list-style: none;
  padding: 0;
  margin: 0;
}
.cl-item {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.45rem 0;
  border-bottom: 1px dashed var(--vp-c-divider);
  font-size: 0.9rem;
}
.cl-date {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}
.cl-hash {
  flex-shrink: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.82rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.cl-hash:hover {
  text-decoration: underline;
}
.cl-subject {
  color: var(--vp-c-text-2);
}
@media (max-width: 640px) {
  .cl-item {
    flex-wrap: wrap;
    gap: 0.4rem;
  }
}
</style>
