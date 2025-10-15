<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-10-15 16:39:35
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-10-15 19:23:03
 * @FilePath: \jh-agileteam-doc\docs\.vitepress\components\AuthorTag\index.vue
 * @Description: 
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎. 
-->
<template>
  <div class="author-tag">
    <div class="author-tag-default">
      <div class="author-header">
        <span class="author-label">📝 作者</span>
      </div>
      
      <div class="author-content">
        <img
          v-if="showAvatar && authorInfo.avatar"
          :src="authorInfo.avatar"
          :alt="authorInfo.name"
          class="author-avatar"
        />
        
        <div class="author-details">
          <div class="author-main-info">
            <a
              v-if="authorLink"
              :href="authorLink"
              target="_blank"
              rel="noopener noreferrer"
              class="author-name"
            >
              {{ authorInfo.name }}
            </a>
            <span v-else class="author-name">{{ authorInfo.name }}</span>
            
            <span v-if="displayRole" class="author-role">
              {{ displayRole }}
            </span>
          </div>
          
          <div class="author-meta">
            <span class="employee-id">工号：{{ displayEmployeeId }}</span>
            <span class="department">{{ displayDepartment }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAuthorInfo } from "./data";
import type { AuthorTagProps } from "./data";

const props = withDefaults(defineProps<AuthorTagProps>(), {
  showAvatar: true,
});

const authorInfo = computed(() => getAuthorInfo(props.author));

// 显示的职位：优先使用传入的 role，否则使用预定义的，默认为"资深开发工程师"
const displayRole = computed(() => {
  return props.role || authorInfo.value.role || "资深开发工程师";
});

// 显示的工号：优先使用传入的 employeeId，其次使用预定义的，最后使用默认值
const displayEmployeeId = computed(() => {
  return props.employeeId || authorInfo.value.employeeId || "409322";
});

// 显示的部门：优先使用传入的 department，其次使用预定义的，最后使用默认值
const displayDepartment = computed(() => {
  return props.department || authorInfo.value.department || "信息化部";
});

const authorLink = computed(() => {
  if (authorInfo.value.link) {
    return authorInfo.value.link;
  }
  if (authorInfo.value.github) {
    return `https://github.com/${authorInfo.value.github}`;
  }
  return null;
});
</script>

<style scoped lang="scss">
@use "./index.scss";
</style>
