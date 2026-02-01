<script lang="ts" setup>
import { TEAM_MEMBERS } from "./data";
import "./index.scss";

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
    <div class="team-grid">
      <div
        v-for="member in TEAM_MEMBERS"
        :key="member.employeeId"
        class="member-card"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <div class="member-avatar-wrapper">
          <img :src="member.avatar" :alt="member.name" class="member-avatar" />
        </div>

        <div class="member-info">
          <h3 class="member-name">{{ member.name }}</h3>
          <span class="member-role">{{ member.role }}</span>

          <div class="member-meta">
            <div v-if="member.employeeId" class="meta-item">
              <span class="meta-icon">🔢</span>
              <span>{{ member.employeeId }}</span>
            </div>
            <div v-if="member.department" class="meta-item">
              <span class="meta-icon">🏢</span>
              <span>{{ member.department }}</span>
            </div>
          </div>

          <p v-if="member.bio" class="member-bio">{{ member.bio }}</p>

          <div v-if="member.skills?.length" class="member-skills">
            <span v-for="skill in member.skills" :key="skill" class="skill-tag">
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
