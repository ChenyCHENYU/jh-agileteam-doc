<template>
  <div class="eco-table">
    <div class="eco-scroll">
      <table>
        <thead>
          <tr>
            <th>包</th>
            <th>层</th>
            <th>版本</th>
            <th>月下载</th>
            <th>许可证</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pkg in ecoPackages" :key="pkg.name" :class="{ 'is-featured': pkg.featured }">
            <td><code class="eco-name">{{ pkg.name }}</code></td>
            <td class="eco-layer">{{ pkg.layer }}</td>
            <td>
              <VersionChip
                :version="liveVersions[pkg.name] || pkg.version"
                :live="!!liveVersions[pkg.name]"
                :internal="pkg.internal"
              />
            </td>
            <td class="eco-dl">
              {{ pkg.internal ? "—" : formatDownloads(downloads[pkg.name]) }}
            </td>
            <td class="eco-license">{{ pkg.license }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="eco-total-label">合计月下载（公共 npm）</td>
            <td class="eco-dl eco-total">
              {{ formatDownloads(totalDownloads) }}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <p class="eco-note">
      团队全部 npm 包（{{ ecoPackages.length }} 个，跨 @agile-team / @robot-admin / @robot-h5 scope，@jhlc 为内部源）。版本与月下载为 npm 实时数据（registry / api.npmjs.org，下载量窗口为最近 30 天，约 1 天延迟），自动更新；断网或接口失败时显示兜底值。
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ecoPackages } from "./data";
import VersionChip from "../VersionChip/index.vue";
import { useNpmVersions } from "../../composables/useNpmDistTags";

// 版本：走共享 dist-tags 缓存（跨页面 30 分钟复用）
const liveVersions = useNpmVersions(() =>
  ecoPackages.filter((pkg) => !pkg.internal).map((pkg) => pkg.name)
);

// 月下载：last-month 窗口（仅本组件使用，页面级请求即可）
const downloads = ref<Record<string, number>>({});

const totalDownloads = computed(() => {
  const values = Object.values(downloads.value);
  return values.length ? values.reduce((a, b) => a + b, 0) : null;
});

const formatDownloads = (n: number | null | undefined) =>
  n != null ? n.toLocaleString("zh-CN") : "—";

onMounted(async () => {
  await Promise.allSettled(
    ecoPackages
      .filter((pkg) => !pkg.internal)
      .map((pkg) =>
        fetch(`https://api.npmjs.org/downloads/point/last-month/${pkg.name}`)
          .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
          .then((d: { downloads?: number }) => {
            if (d.downloads != null) downloads.value[pkg.name] = d.downloads;
          })
          .catch(() => {})
      )
  );
});
</script>

<style scoped>
.eco-table {
  margin: 0.5rem 0;
}
.eco-scroll {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
th,
td {
  padding: 0.55rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  text-align: left;
  vertical-align: top;
}
th {
  background: var(--vp-c-bg-soft);
  white-space: nowrap;
}
tfoot td {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
}
.is-featured .eco-name {
  font-weight: 700;
}
.eco-name {
  white-space: nowrap;
  font-weight: 600;
}
.eco-layer {
  white-space: nowrap;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
}
.eco-dl {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.eco-license {
  white-space: nowrap;
}
.eco-total-label {
  text-align: right;
}
.eco-total {
  color: var(--vp-c-brand-1);
}
.eco-note {
  margin: 0.5rem 0 0;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
}
</style>
