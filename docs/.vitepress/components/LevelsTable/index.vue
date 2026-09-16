<template>
  <div class="levels-table">
    <div class="levels-scroll">
      <table>
        <thead>
          <tr>
            <th>层级</th>
            <th>{{ mode === "detail" ? "说明" : "内容" }}</th>
            <th v-if="mode === 'detail'">对应部门定级</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="level in levels" :key="level.id">
            <td class="level-cell">
              <a :href="level.link" class="level-link">
                <strong>{{ level.id }}</strong>
                <span class="level-name">{{ level.name }}</span>
              </a>
            </td>
            <td>{{ mode === "detail" ? level.detail : level.desc }}</td>
            <td v-if="mode === 'detail'" class="dept-cell">{{ level.dept }}</td>
            <td>
              <span class="level-status" :class="`status-${level.status}`">{{ level.statusText }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="mode === 'detail'" class="dept-note">
      「对应部门定级」为与本团队技术栈层级的<strong>典型对应区间</strong>（非硬性换算）：部门 L0-L5（含 L2+）是部门下发的参考定级标准，衡量人的熟练度与沉淀；本页 L0-L7 是团队自研的技术栈实践模型。完整映射与负向行为兜底见 <a href="./maturity">成熟度对照</a>。
    </p>
  </div>
</template>

<script setup lang="ts">
import { levels } from "./data";

withDefaults(defineProps<{ mode?: "short" | "detail" }>(), { mode: "short" });
</script>

<style scoped>
.levels-table {
  margin: 0.5rem 0;
}
.levels-scroll {
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
.level-cell {
  white-space: nowrap;
}
.level-link {
  font-weight: 600;
}
.level-name {
  margin-left: 0.4rem;
}
.level-status {
  white-space: nowrap;
  font-size: 0.85rem;
}
.status-done {
  color: var(--vp-c-brand-1);
}
.status-doing {
  color: var(--vp-c-warning-1);
}
.status-known,
.status-next,
.status-future {
  color: var(--vp-c-text-2);
}
.dept-cell {
  white-space: nowrap;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
.dept-note {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
</style>
