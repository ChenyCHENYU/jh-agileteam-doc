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
              <span
                v-if="pkg.internal"
                class="eco-version eco-version--internal"
                title="未发布到公共 npm registry（内部源），版本以内部制品库为准"
              >内部源</span>
              <span
                v-else
                class="eco-version"
                :class="{ 'is-live': live[pkg.name]?.version }"
                :title="live[pkg.name]?.version ? '来自 npm registry 实时数据' : '构建时版本（实时获取失败时的兜底值）'"
              >v{{ live[pkg.name]?.version || pkg.version }}</span>
            </td>
            <td class="eco-dl">
              {{ pkg.internal ? "—" : live[pkg.name]?.downloads != null ? live[pkg.name]!.downloads.toLocaleString("zh-CN") : "—" }}
            </td>
            <td class="eco-license">{{ pkg.license }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="eco-total-label">合计月下载（公共 npm）</td>
            <td class="eco-dl eco-total">
              {{ totalDownloads != null ? totalDownloads.toLocaleString("zh-CN") : "—" }}
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

interface LiveInfo {
  version?: string;
  downloads?: number;
}

const live = ref<Record<string, LiveInfo>>({});

const totalDownloads = computed(() => {
  const values = Object.values(live.value)
    .map((v) => v.downloads)
    .filter((n): n is number => n != null);
  return values.length ? values.reduce((a, b) => a + b, 0) : null;
});

onMounted(async () => {
  await Promise.allSettled(
    ecoPackages
      .filter((pkg) => !pkg.internal)
      .map(async (pkg) => {
        // 版本：dist-tags（独立失败互不影响）
        void fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg.name)}`, {
          headers: { Accept: "application/vnd.npm.install-v1+json" },
        })
          .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
          .then((d: { "dist-tags"?: Record<string, string> }) => {
            const latest = d["dist-tags"]?.latest;
            if (latest) live.value[pkg.name] = { ...live.value[pkg.name], version: latest };
          })
          .catch(() => {});

        // 月下载：last-month 窗口
        void fetch(`https://api.npmjs.org/downloads/point/last-month/${pkg.name}`)
          .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
          .then((d: { downloads?: number }) => {
            if (d.downloads != null) live.value[pkg.name] = { ...live.value[pkg.name], downloads: d.downloads };
          })
          .catch(() => {});
      })
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
.eco-version {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.82rem;
  white-space: nowrap;
}
.eco-version.is-live::before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
  margin-right: 5px;
  vertical-align: 1px;
}
.eco-version--internal {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px dashed var(--vp-c-divider);
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
