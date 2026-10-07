<template>
  <div class="packages-table">
    <div class="packages-scroll">
      <table>
        <thead>
          <tr>
            <th>包</th>
            <th>版本</th>
            <th>定位</th>
            <th>文档</th>
            <th>安装</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pkg in packages" :key="pkg.name">
            <td><code class="pkg-name">{{ pkg.name }}</code></td>
            <td>
              <span
                class="pkg-version"
                :class="{ 'pkg-version--live': liveVersions[pkg.name] }"
                :title="liveVersions[pkg.name] ? '来自 npm registry 实时数据' : '构建时版本（实时获取失败时的兜底值）'"
              >v{{ liveVersions[pkg.name] || pkg.version }}</span>
            </td>
            <td class="pkg-scope">{{ pkg.scope }}</td>
            <td><a :href="pkg.doc">{{ pkg.docLabel }}</a></td>
            <td><code class="pkg-install">{{ pkg.install }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { packages } from "./data";

/**
 * 版本号实时化：页面加载后并发查询 npm registry 的 dist-tags.latest，
 * data.ts 中的静态版本仅作为 SSG 首屏与网络失败时的兜底。
 */
const NPM_SCOPE = "@agile-team";
const liveVersions = ref<Record<string, string>>({});

onMounted(async () => {
  const results = await Promise.allSettled(
    packages.map(async (pkg) => {
      const res = await fetch(
        `https://registry.npmjs.org/${encodeURIComponent(`${NPM_SCOPE}/${pkg.name}`)}`,
        { headers: { Accept: "application/vnd.npm.install-v1+json" } }
      );
      if (!res.ok) throw new Error(`${pkg.name}: HTTP ${res.status}`);
      const data = (await res.json()) as { "dist-tags"?: Record<string, string> };
      const latest = data["dist-tags"]?.latest;
      if (!latest) throw new Error(`${pkg.name}: dist-tags.missing`);
      return [pkg.name, latest] as const;
    })
  );
  for (const r of results) {
    if (r.status === "fulfilled") liveVersions.value[r.value[0]] = r.value[1];
  }
});
</script>

<style scoped>
.packages-table {
  margin: 0.5rem 0;
}
.packages-scroll {
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
.pkg-name {
  white-space: nowrap;
  font-weight: 600;
}
.pkg-version {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.82rem;
  white-space: nowrap;
}
.pkg-version--live::before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
  margin-right: 5px;
  vertical-align: 1px;
}
.pkg-scope {
  min-width: 16rem;
}
.pkg-install {
  white-space: nowrap;
  font-size: 0.82rem;
}
</style>
