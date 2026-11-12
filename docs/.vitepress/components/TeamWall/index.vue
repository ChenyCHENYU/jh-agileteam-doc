<script lang="ts" setup>
import { computed } from "vue";
import "../TeamHero/index.scss";
import MemberCard from "./MemberCard.vue";
import type { WallMember } from "../types";

/**
 * 通用团队英雄墙：标题 + 人数 + 成员卡网格 + 鼠标追光
 * TeamHero / BackendTeamHero / TestTeamHero / BusinessTeamHero 共用；
 * 传 groupBy 即按领域分组展示（业务团队变体），不传则扁平列表。
 */
export interface GroupableMember extends WallMember {
  domain?: string;
}

const props = withDefaults(
  defineProps<{
    members: GroupableMember[];
    title?: string;
    note?: string;
    /** 分组键（如业务团队的 domain）；传入后按分组渲染 */
    groupBy?: (member: GroupableMember) => string;
    /** 分组展示顺序（缺省按首次出现顺序） */
    groupOrder?: string[];
    /** 分组徽章配色 */
    groupColor?: Record<string, string>;
  }>(),
  { title: "团队英雄墙", note: "📢 未知或者信息错漏的的请相关伙伴告知补充" }
);

const groups = computed(() => {
  if (!props.groupBy) return null;
  const map = new Map<string, GroupableMember[]>();
  for (const m of props.members) {
    const key = props.groupBy(m);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  let entries = [...map.entries()];
  if (props.groupOrder?.length) {
    const order = props.groupOrder;
    entries = entries.sort(
      (a, b) => (order.indexOf(a[0]) + 1 || order.length + 1) - (order.indexOf(b[0]) + 1 || order.length + 1)
    );
  }
  return entries.filter(([, ms]) => ms.length > 0);
});
</script>

<template>
  <div class="team-hero">
    <div class="team-header">
      <div class="team-title-row">
        <h2 class="team-title">{{ props.title }}</h2>
        <span class="team-tag">{{ props.members.length }}人</span>
      </div>
      <div class="team-note">
        <span class="i-megaphone text-red-500"></span>
        <span>{{ props.note }}</span>
      </div>
    </div>

    <!-- 分组模式（业务团队领域变体） -->
    <template v-if="groups">
      <div v-for="[domain, members] in groups" :key="domain" class="domain-section">
        <div class="domain-header">
          <span class="domain-badge" :style="{ background: props.groupColor?.[domain] ?? '#6b7280' }">
            {{ domain }}
          </span>
          <span class="domain-count">{{ members.length }}人</span>
        </div>
        <div class="team-grid">
          <MemberCard v-for="member in members" :key="member.employeeId" :member="member" show-role :show-skills="false" />
        </div>
      </div>
    </template>

    <!-- 扁平模式 -->
    <div v-else class="team-grid">
      <MemberCard v-for="member in props.members" :key="member.employeeId" :member="member" />
    </div>
  </div>
</template>

<style scoped>
.domain-section {
  margin-bottom: 2rem;
}
.domain-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.domain-badge {
  display: inline-block;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.03em;
}
.domain-count {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
</style>
