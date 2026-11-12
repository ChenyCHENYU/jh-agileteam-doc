<script lang="ts" setup>
/**
 * 成员卡（TeamWall 与 BusinessTeamHero 共用）
 * 含鼠标追光效果与头像/姓名/工号/简介/技能标签渲染。
 */
import type { WallMember } from "../types";

withDefaults(
  defineProps<{
    member: WallMember;
    /** 是否展示角色行（业务团队用 member-spotlight 样式） */
    showRole?: boolean;
    /** 是否展示技能标签 */
    showSkills?: boolean;
  }>(),
  { showRole: false, showSkills: true }
);

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
  <div class="member-card" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
    <div class="member-avatar-wrapper">
      <img :src="member.avatar" :alt="member.name" class="member-avatar" />
    </div>

    <div class="member-info">
      <div class="member-name-row">
        <h3 class="member-name">{{ member.name }}</h3>
        <span v-if="member.employeeId" class="member-id">#{{ member.employeeId }}</span>
      </div>

      <p v-if="showRole && member.role" class="member-spotlight">{{ member.role }}</p>

      <p v-if="member.bio" class="member-bio">{{ member.bio }}</p>

      <div v-if="showSkills && member.skills?.length" class="member-skills">
        <span v-for="skill in member.skills" :key="skill" class="skill-tag">
          {{ skill }}
        </span>
      </div>
    </div>
  </div>
</template>
