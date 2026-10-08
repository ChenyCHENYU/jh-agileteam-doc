<script lang="ts" setup>
import TeamWall from "../TeamWall/index.vue";
import { TEAM_MEMBERS } from "./data";
</script>

<template>
  <TeamWall title="鲁班营 · 前端团队" :members="TEAM_MEMBERS" />
</template>
