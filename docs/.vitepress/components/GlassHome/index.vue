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
              <a href="/views/guide/" class="action-button primary">
                <span>开始使用</span>
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

    <!-- 数据统计 - 液态玻璃效果 -->
    <section class="glass-stats-section">
      <div class="glass-container">
        <div class="glass-stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="glass-stat-card">
            <div class="glass-card-inner">
              <div class="stat-icon-large">{{ stat.icon }}</div>
              <div class="stat-content">
                <div class="stat-number-large">{{ stat.number }}</div>
                <div class="stat-label-large">{{ stat.label }}</div>
                <div class="stat-desc">{{ stat.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="glass-bg-decoration"></div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { features, stats } from "./data";
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
