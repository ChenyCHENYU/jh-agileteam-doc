<script lang="ts" setup>
import TeamWall from "../TeamWall/index.vue";
import { TEST_TEAM_MEMBERS } from "./data";
</script>

<template>
  <TeamWall title="谛听小队 · 测试团队" :members="TEST_TEAM_MEMBERS" />
</template>
