<script lang="ts" setup>
import TeamWall from "../TeamWall/index.vue";
import { BACKEND_TEAM_MEMBERS } from "./data";
</script>

<template>
  <TeamWall :members="BACKEND_TEAM_MEMBERS" />
</template>
