<script lang="ts" setup>
import TeamWall from "../TeamWall/index.vue";
import { TEST_TEAM_MEMBERS } from "./data";
</script>

<template>
  <TeamWall :members="TEST_TEAM_MEMBERS" />
</template>
