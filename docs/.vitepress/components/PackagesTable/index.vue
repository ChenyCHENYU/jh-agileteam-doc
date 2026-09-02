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
            <td><span class="pkg-version">v{{ pkg.version }}</span></td>
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
.pkg-scope {
  min-width: 16rem;
}
.pkg-install {
  white-space: nowrap;
  font-size: 0.82rem;
}
</style>
