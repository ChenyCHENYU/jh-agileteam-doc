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
              <VersionChip :version="liveVersions[pkg.name] || pkg.version" :live="!!liveVersions[pkg.name]" />
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
import { packages } from "./data";
import VersionChip from "../VersionChip/index.vue";
import { useNpmVersions } from "../../composables/useNpmDistTags";

/**
 * 版本号实时化：页面加载后并发查询 npm registry 的 dist-tags.latest，
 * data.ts 中的静态版本仅作为 SSG 首屏与网络失败时的兜底。
 */
const NPM_SCOPE = "@agile-team";
const liveVersions = useNpmVersions(() => packages.map((pkg) => `${NPM_SCOPE}/${pkg.name}`));
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
.pkg-scope {
  min-width: 16rem;
}
.pkg-install {
  white-space: nowrap;
  font-size: 0.82rem;
}
</style>
