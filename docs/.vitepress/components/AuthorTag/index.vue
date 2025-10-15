<template>
  <div :class="['author-tag', `author-tag--${variant}`]">
    <!-- 默认样式 - 更清晰直观 -->
    <div v-if="variant === 'default'" class="author-tag-default">
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

    <!-- 卡片样式 - 强调作者信息 -->
    <div v-else-if="variant === 'card'" class="author-tag-card">
      <div class="card-header">
        <span class="card-label">✍️ 文章作者</span>
      </div>
      
      <div class="card-content">
        <img
          v-if="showAvatar && authorInfo.avatar"
          :src="authorInfo.avatar"
          :alt="authorInfo.name"
          class="author-avatar-large"
        />
        
        <div class="card-info">
          <div class="author-name-line">
            <a
              v-if="authorLink"
              :href="authorLink"
              target="_blank"
              rel="noopener noreferrer"
              class="author-name-large"
            >
              {{ authorInfo.name }}
            </a>
            <span v-else class="author-name-large">{{ authorInfo.name }}</span>
          </div>
          
          <div class="card-badges">
            <span v-if="displayRole" class="role-badge">{{ displayRole }}</span>
            <span class="id-badge">工号 {{ displayEmployeeId }}</span>
            <span class="dept-badge">{{ displayDepartment }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 简洁样式 -->
    <div v-else class="author-tag-minimal">
      <span class="minimal-text">
        由
        <a
          v-if="authorLink"
          :href="authorLink"
          target="_blank"
          rel="noopener noreferrer"
          class="minimal-author"
        >
          {{ authorInfo.name }}
        </a>
        <strong v-else class="minimal-author">{{ authorInfo.name }}</strong>
        <span v-if="displayRole" class="minimal-role">（{{ displayRole }}）</span>
        撰写
      </span>
      <span class="minimal-id">工号 {{ displayEmployeeId }}</span>
      <span class="minimal-dept">{{ displayDepartment }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getAuthorInfo, formatDate } from "./data";
import type { AuthorTagProps } from "./data";

const props = withDefaults(defineProps<AuthorTagProps>(), {
  showAvatar: true,
  variant: "default",
  employeeId: "409322", // 默认工号
  department: "信息化部", // 默认部门
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
@import "./index.scss";
</style>
