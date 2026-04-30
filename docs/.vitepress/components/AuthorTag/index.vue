<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-10-15 16:39:35
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2026-02-09 16:05:20
 * @FilePath: \jh-agileteam-doc\docs\.vitepress\components\AuthorTag\index.vue
 * @Description: 作者标签组件
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎. 
-->
<template>
  <div class="author-tag">
    <!-- 多作者模式 -->
    <div v-if="isMultipleAuthors" class="author-tag-multiple">
      <span class="multi-label">📝 作者</span>
      <div class="author-pills">
        <div
          v-for="(authorData, index) in authorsList"
          :key="index"
          class="author-pill"
        >
          <div class="pill-avatar-wrapper">
            <div
              class="pill-avatar pill-avatar-default"
              :class="{ 'avatar-hidden': authorData.avatarLoaded }"
            >
              {{ getAuthorInitial(authorData.info.name) }}
            </div>
            <img
              v-if="authorData.info.avatar"
              :src="authorData.info.avatar"
              :alt="authorData.info.name"
              class="pill-avatar pill-avatar-image"
              :class="{ 'avatar-loaded': authorData.avatarLoaded }"
              @load="() => handleAvatarLoad(index)"
              @error="() => handleAvatarError(index)"
            />
          </div>
          <div class="pill-body">
            <a
              v-if="getAuthorLink(authorData.info)"
              :href="getAuthorLink(authorData.info)"
              target="_blank"
              rel="noopener noreferrer"
              class="pill-name pill-name-link"
            >
              {{ authorData.info.name }}
            </a>
            <span v-else class="pill-name">{{ authorData.info.name }}</span>
            <span class="pill-dept">{{ getDisplayDepartment(authorData.info) }}</span>
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
            @load="() => handleAvatarLoad(0)"
            @error="() => handleAvatarError(0)"
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
            
            <span class="author-role">
              {{ displayDepartment }}
            </span>
          </div>
          
          <div class="author-meta">
            <span class="employee-id">工号：{{ displayEmployeeId }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { getAuthorInfo } from "./data";
import type { AuthorTagProps, Author } from "./data";

const props = withDefaults(defineProps<AuthorTagProps>(), {
  showAvatar: true,
});

// 规范化作者列表：统一转换为数组形式
const normalizedAuthors = computed(() => {
  // 如果有 authors 数组，直接使用
  if (props.authors && props.authors.length > 0) {
    return props.authors;
  }
  // 如果只有 author，转换为数组
  if (props.author) {
    return [props.author];
  }
  // 兜底：返回空数组
  return [];
});

// 判断是否为多作者模式（大于1个作者才是多作者）
const isMultipleAuthors = computed(() => {
  return normalizedAuthors.value.length > 1;
});

// 单作者模式的信息
const authorInfo = computed(() => {
  if (normalizedAuthors.value.length > 0) {
    return getAuthorInfo(normalizedAuthors.value[0]);
  }
  return { name: '未知作者' } as Author;
});

// 头像加载状态数组（统一管理所有作者的头像状态）
const avatarsLoadedState = ref<Array<{ loaded: boolean; error: boolean }>>([]);

// 初始化或重置头像加载状态
watch(normalizedAuthors, (newAuthors) => {
  avatarsLoadedState.value = newAuthors.map(() => ({ loaded: false, error: false }));
}, { immediate: true });

// 多作者列表
const authorsList = computed(() => {
  return normalizedAuthors.value.map((author, index) => ({
    info: getAuthorInfo(author),
    get avatarLoaded() {
      return avatarsLoadedState.value[index]?.loaded || false;
    },
    get avatarLoadError() {
      return avatarsLoadedState.value[index]?.error || false;
    },
  }));
});

// 单作者头像状态（直接使用数组的第一个元素）
const avatarLoaded = computed(() => avatarsLoadedState.value[0]?.loaded || false);

// 头像加载成功（统一处理）
const handleAvatarLoad = (index: number = 0) => {
  if (avatarsLoadedState.value[index]) {
    avatarsLoadedState.value[index].loaded = true;
    avatarsLoadedState.value[index].error = false;
  }
};

// 头像加载失败（统一处理）
const handleAvatarError = (index: number = 0) => {
  if (avatarsLoadedState.value[index]) {
    avatarsLoadedState.value[index].loaded = false;
    avatarsLoadedState.value[index].error = true;
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
  if (normalizedAuthors.value.length === 0) return '';
  const depts = [...new Set(normalizedAuthors.value.map(author => {
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
