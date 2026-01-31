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
    <!-- 多作者模式 -->
    <div v-if="isMultipleAuthors" class="author-tag-multiple">
      <div class="author-header">
        <span class="author-label">📝 作者</span>
      </div>
      
      <div class="authors-compact">
        <!-- 头像组 -->
        <div class="avatars-group">
          <div 
            v-for="(authorData, index) in authorsList" 
            :key="index"
            class="avatar-wrapper"
            :style="{ zIndex: authorsList.length - index }"
            :title="authorData.info.name"
          >
            <!-- 默认字母头像 -->
            <div
              class="author-avatar author-avatar-default"
              :class="{ 'avatar-hidden': authorData.avatarLoaded }"
            >
              {{ getAuthorInitial(authorData.info.name) }}
            </div>
            
            <!-- 真实图片头像 -->
            <img
              v-if="authorData.info.avatar"
              :src="authorData.info.avatar"
              :alt="authorData.info.name"
              class="author-avatar author-avatar-image"
              :class="{ 'avatar-loaded': authorData.avatarLoaded }"
              @load="() => handleAvatarLoad(index)"
              @error="() => handleAvatarError(index)"
            />
          </div>
        </div>
        
        <!-- 作者信息 -->
        <div class="authors-info">
          <div class="authors-names">
            <template v-for="(authorData, index) in authorsList" :key="index">
              <a
                v-if="getAuthorLink(authorData.info)"
                :href="getAuthorLink(authorData.info)"
                target="_blank"
                rel="noopener noreferrer"
                class="author-name-link"
              >
                {{ authorData.info.name }}
              </a>
              <span v-else class="author-name-text">{{ authorData.info.name }}</span>
              <span class="author-role-tag">{{ getDisplayRole(authorData.info) }}</span>
              <span v-if="index < authorsList.length - 1" class="author-separator">、</span>
            </template>
          </div>
          <div class="authors-meta">
            <span class="meta-item">
              <span class="meta-icon">👤</span>
              工号：{{ authorsList.map(a => getDisplayEmployeeId(a.info)).join(' · ') }}
            </span>
            <span class="meta-item">
              {{ getUniqueDepartments() }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 单作者模式 -->
    <div v-else class="author-tag-default">
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
import type { AuthorTagProps, Author } from "./data";

const props = withDefaults(defineProps<AuthorTagProps>(), {
  showAvatar: true,
});

// 判断是否为多作者模式
const isMultipleAuthors = computed(() => {
  return props.authors && props.authors.length > 0;
});

// 单作者模式的信息（兼容旧版）
const authorInfo = computed(() => {
  if (props.author) {
    return getAuthorInfo(props.author);
  }
  return { name: '未知作者' } as Author;
});

// 多作者列表
const authorsList = computed(() => {
  if (!props.authors) return [];
  
  return props.authors.map(author => ({
    info: getAuthorInfo(author),
    avatarLoaded: ref(false),
    avatarLoadError: ref(false),
  }));
});

// 头像加载状态（单作者）
const avatarLoaded = ref(false);
const avatarLoadError = ref(false);

// 头像加载成功（单作者）
const handleAvatarLoad = (index?: number) => {
  if (index !== undefined) {
    authorsList.value[index].avatarLoaded.value = true;
  } else {
    avatarLoaded.value = true;
  }
};

// 头像加载失败（单作者）
const handleAvatarError = (index?: number) => {
  if (index !== undefined) {
    authorsList.value[index].avatarLoadError.value = true;
    authorsList.value[index].avatarLoaded.value = false;
  } else {
    avatarLoadError.value = true;
    avatarLoaded.value = false;
  }
};

// 获取作者名字首字母作为默认头像
const getAuthorInitial = (name: string) => {
  if (!name) return '?';
  // 如果是中文名，取最后一个字
  if (/[\u4e00-\u9fa5]/.test(name)) {
    return name.slice(-1);
  }
  // 如果是英文名，取第一个字母
  return name.charAt(0).toUpperCase();
};

const authorInitial = computed(() => getAuthorInitial(authorInfo.value.name));

// 显示的职位：优先使用传入的 role，否则使用预定义的，默认为"资深开发工程师"
const getDisplayRole = (author: Author) => {
  return props.role || author.role || "资深开发工程师";
};

const displayRole = computed(() => getDisplayRole(authorInfo.value));

// 显示的工号：优先使用传入的 employeeId，其次使用预定义的，最后使用默认值
const getDisplayEmployeeId = (author: Author) => {
  return props.employeeId || author.employeeId || "409322";
};

const displayEmployeeId = computed(() => getDisplayEmployeeId(authorInfo.value));

// 显示的部门：优先使用传入的 department，其次使用预定义的，最后使用默认值
const getDisplayDepartment = (author: Author) => {
  return props.department || author.department || "信息化部";
};

const displayDepartment = computed(() => getDisplayDepartment(authorInfo.value));

// 获取去重后的部门列表（多作者）
const getUniqueDepartments = () => {
  if (!props.authors) return '';
  const depts = [...new Set(props.authors.map(author => {
    const info = getAuthorInfo(author);
    return getDisplayDepartment(info);
  }))];
  return depts.join(' · ');
};

const getAuthorLink = (author: Author) => {
  if (author.link) {
    return author.link;
  }
  if (author.github) {
    return `https://github.com/${author.github}`;
  }
  return null;
};

const authorLink = computed(() => getAuthorLink(authorInfo.value));
</script>

<style scoped lang="scss">
@use "./index.scss";
</style>
