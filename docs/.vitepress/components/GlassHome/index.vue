<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-10-14 20:53:03
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2026-02-04 09:24:00
 * @FilePath: \jh-agileteam-doc\docs\.vitepress\components\GlassHome\index.vue
 * @Description: 首页组件
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎. 
-->
<template>
  <div class="glass-home">
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-bg-decoration"></div>
      <div class="hero-particles"></div>
      <div class="hero-grid-lines"></div>
      <div class="hero-glow-orb hero-glow-orb-1"></div>
      <div class="hero-glow-orb hero-glow-orb-2"></div>
      <div class="hero-glow-orb hero-glow-orb-3"></div>
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-text-content">
            <div class="hero-badge">
              <span class="badge-dot"></span>
              <span class="badge-text">Next Generation</span>
            </div>
            <h1 class="hero-title">
              <span class="title-name">AGILE TEAM</span>
            </h1>
            <p class="hero-text">前端工程体系</p>
            <p class="hero-tagline">提升研发效率，赋能团队协作</p>
            <div class="hero-actions">
              <a href="/views/guide/getting-started" class="action-button primary">
                <span class="button-content">
                  <span class="button-text">快速开始</span>
                  <svg class="button-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </a>
              <a href="/ui-components/" class="action-button secondary">
                <span class="button-content">
                  <span class="button-text">组件库</span>
                </span>
              </a>
            </div>
          </div>
          <div class="hero-image-content">
            <div class="hero-logo">
              <div class="logo-ring logo-ring-1"></div>
              <div class="logo-ring logo-ring-2"></div>
              <div class="logo-ring logo-ring-3"></div>
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
