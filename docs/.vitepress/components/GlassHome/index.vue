<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-10-14 20:53:03
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-10-15 08:59:29
 * @FilePath: \jh-agileteam-doc\docs\.vitepress\components\GlassHome\index.vue
 * @Description: 首页组件
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎. 
-->
<template>
  <div class="glass-home">
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-bg-decoration"></div>
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-text-content">
            <h1 class="hero-title">
              <span class="title-name">AGILE TEAM</span>
            </h1>
            <p class="hero-text">前端工程体系</p>
            <p class="hero-tagline">提升研发效率，赋能团队协作</p>
            <div class="hero-actions">
              <a href="/views/guide/getting-started" class="action-button primary">
                <span>快速开始</span>
              </a>
              <a href="/ui-components/" class="action-button secondary">
                <span>组件库</span>
              </a>
            </div>
          </div>
          <div class="hero-image-content">
            <div class="hero-logo">
              <img src="/logo.png" alt="AGILE TEAM" class="logo-image" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features 区域 -->
    <section class="features-section">
      <div class="features-container">
        <div class="features-grid">
          <a
            v-for="feature in features"
            :key="feature.title"
            :href="feature.link"
            class="feature-card"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-details">{{ feature.details }}</p>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { features } from "./data";
</script>

<style scoped lang="scss">
@use "./index.scss";
</style>
