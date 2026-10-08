<script lang="ts" setup>
import TeamWall from "../TeamWall/index.vue";
import { TEAM_MEMBERS } from "./data";
</script>

<template>
  <TeamWall :members="TEAM_MEMBERS" />
</template>
