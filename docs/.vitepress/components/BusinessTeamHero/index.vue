<script lang="ts" setup>
import { computed } from "vue";
import { BUSINESS_TEAM_MEMBERS, DOMAINS } from "./data";
import "../TeamHero/index.scss";

const totalCount = BUSINESS_TEAM_MEMBERS.length;

const membersByDomain = computed(() =>
  DOMAINS.map((domain) => ({
    domain,
    members: BUSINESS_TEAM_MEMBERS.filter((m) => m.domain === domain),
  })).filter((g) => g.members.length > 0)
);

const domainColor: Record<string, string> = {
  生产领域: "var(--vp-c-brand-1, #3b82f6)",
  销售领域: "var(--vp-c-yellow-1, #d97706)",
  质量领域: "var(--vp-c-green-1, #16a34a)",
  成本领域: "var(--vp-c-indigo-1, #6366f1)",
  安全领域: "var(--vp-c-red-1, #dc2626)",
  安防领域: "var(--vp-c-orange-1, #ea580c)",
  物流领域: "var(--vp-c-teal-1, #0d9488)",
  采购领域: "var(--vp-c-purple-1, #9333ea)",
  综合管理: "var(--vp-c-slate-1, #64748b)",
};

const handleMouseMove = (event: MouseEvent) => {
  const card = event.currentTarget as HTMLElement;
  const rect = card.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  card.style.setProperty("--mouse-x", `${x}%`);
  card.style.setProperty("--mouse-y", `${y}%`);
};

const handleMouseLeave = (event: MouseEvent) => {
  const card = event.currentTarget as HTMLElement;
  card.style.setProperty("--mouse-x", `50%`);
  card.style.setProperty("--mouse-y", `50%`);
};
</script>

<template>
  <div class="team-hero">
    <div class="team-header">
      <div class="team-title-row">
        <h2 class="team-title">业务团队</h2>
        <span class="team-tag">{{ totalCount }}人</span>
      </div>
      <div class="team-note">
        <span>📢 未知或者信息错漏的请相关伙伴告知补充，目前顺序按工号先后排列</span>
      </div>
    </div>

    <template v-for="group in membersByDomain" :key="group.domain">
      <div class="domain-section">
        <div class="domain-header">
          <span
            class="domain-badge"
            :style="{ background: domainColor[group.domain] ?? '#6b7280' }"
          >{{ group.domain }}</span>
          <span class="domain-count">{{ group.members.length }}人</span>
        </div>
        <div class="team-grid">
          <div
            v-for="member in group.members"
            :key="member.employeeId"
            class="member-card"
            @mousemove="handleMouseMove"
            @mouseleave="handleMouseLeave"
          >
            <div class="member-avatar-wrapper">
              <img :src="member.avatar" :alt="member.name" class="member-avatar" />
            </div>
            <div class="member-info">
              <div class="member-name-row">
                <h3 class="member-name">{{ member.name }}</h3>
                <span v-if="member.employeeId" class="member-id">#{{ member.employeeId }}</span>
              </div>
              <p class="member-spotlight">{{ member.role }}</p>
              <p v-if="member.bio" class="member-bio">{{ member.bio }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
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
