<template>
  <div :class="['author-tag', `author-tag--${variant}`]">
    <!-- 默认样式 -->
    <div v-if="variant === 'default'" class="author-tag-default">
      <div class="author-info">
        <img
          v-if="showAvatar && authorInfo.avatar"
          :src="authorInfo.avatar"
          :alt="authorInfo.name"
          class="author-avatar"
        />
        <div class="author-details">
          <div class="author-name-line">
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
            <span v-if="authorInfo.role" class="author-role">{{
              authorInfo.role
            }}</span>
          </div>
          <div v-if="authorInfo.bio" class="author-bio">
            {{ authorInfo.bio }}
          </div>
        </div>
      </div>

      <div class="meta-info">
        <span v-if="date" class="meta-item">
          <span class="meta-icon">📅</span>
          <span class="meta-text">{{ formattedDate }}</span>
        </span>
        <span v-if="updateDate" class="meta-item">
          <span class="meta-icon">🔄</span>
          <span class="meta-text">更新于 {{ formattedUpdateDate }}</span>
        </span>
        <span v-if="readingTime" class="meta-item">
          <span class="meta-icon">⏱️</span>
          <span class="meta-text">{{ readingTime }} 分钟阅读</span>
        </span>
      </div>
    </div>

    <!-- 卡片样式 -->
    <div v-else-if="variant === 'card'" class="author-tag-card">
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
          <span v-if="authorInfo.role" class="author-role-card">{{
            authorInfo.role
          }}</span>
          <p v-if="authorInfo.bio" class="author-bio-card">
            {{ authorInfo.bio }}
          </p>

          <div class="card-meta">
            <span v-if="date" class="card-meta-item">
              <span class="meta-icon">📅</span>
              {{ formattedDate }}
            </span>
            <span v-if="updateDate" class="card-meta-item">
              <span class="meta-icon">🔄</span>
              {{ formattedUpdateDate }}
            </span>
            <span v-if="readingTime" class="card-meta-item">
              <span class="meta-icon">⏱️</span>
              {{ readingTime }} min
            </span>
          </div>

          <div
            v-if="authorInfo.email || authorInfo.github"
            class="author-links"
          >
            <a
              v-if="authorInfo.email"
              :href="`mailto:${authorInfo.email}`"
              class="author-link-item"
              title="邮箱"
            >
              📧
            </a>
            <a
              v-if="authorInfo.github"
              :href="`https://github.com/${authorInfo.github}`"
              target="_blank"
              rel="noopener noreferrer"
              class="author-link-item"
              title="GitHub"
            >
              <svg class="github-icon" viewBox="0 0 16 16" fill="currentColor">
                <path
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                ></path>
              </svg>
            </a>
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
        撰写
      </span>
      <span v-if="date" class="minimal-date">· {{ formattedDate }}</span>
      <span v-if="readingTime" class="minimal-reading"
        >· {{ readingTime }} 分钟阅读</span
      >
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
});

const authorInfo = computed(() => getAuthorInfo(props.author));

const formattedDate = computed(() =>
  props.date ? formatDate(props.date) : ""
);

const formattedUpdateDate = computed(() =>
  props.updateDate ? formatDate(props.updateDate) : ""
);

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
