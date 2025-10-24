<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-10-15 16:39:35
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-10-15 19:24:19
 * @FilePath: \jh-agileteam-doc\docs\.vitepress\components\AuthorTag\index.vue
 * @Description: 作者标签组件
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎. 
-->
<template>
  <div class="author-tag">
    <div class="author-tag-default">
      <div class="author-header">
        <span class="author-label">📝 作者</span>
      </div>
      
      <div class="author-content">
        <div v-if="showAvatar" class="author-avatar-container">
          <!-- 默认字母头像（始终存在，作为背景） -->
          <div
            class="author-avatar author-avatar-default"
            :class="{ 'avatar-hidden': avatarLoaded }"
            :title="authorInfo.name"
          >
            {{ authorInitial }}
          </div>
          
          <!-- 真实图片头像（加载成功后显示在上层） -->
          <img
            v-if="authorInfo.avatar"
            :src="authorInfo.avatar"
            :alt="authorInfo.name"
            class="author-avatar author-avatar-image"
            :class="{ 'avatar-loaded': avatarLoaded }"
            @load="handleAvatarLoad"
            @error="handleAvatarError"
          />
        </div>
        
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
import { ref, computed } from 'vue';
import { getAuthorInfo } from "./data";
import type { AuthorTagProps } from "./data";

const props = withDefaults(defineProps<AuthorTagProps>(), {
  showAvatar: true,
});

const authorInfo = computed(() => getAuthorInfo(props.author));

// 头像加载状态
const avatarLoaded = ref(false);
const avatarLoadError = ref(false);

// 头像加载成功
const handleAvatarLoad = () => {
  avatarLoaded.value = true;
};

// 头像加载失败
const handleAvatarError = () => {
  avatarLoadError.value = true;
  avatarLoaded.value = false;
};

// 获取作者名字首字母作为默认头像
const authorInitial = computed(() => {
  const name = authorInfo.value.name;
  if (!name) return '?';
  // 如果是中文名，取最后一个字
  if (/[\u4e00-\u9fa5]/.test(name)) {
    return name.slice(-1);
  }
  // 如果是英文名，取第一个字母
  return name.charAt(0).toUpperCase();
});

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
