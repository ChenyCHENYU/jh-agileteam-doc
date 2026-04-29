<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-10-14 20:53:03
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2026-04-29 12:58:32
 * @FilePath: \jh-agileteam-doc\docs\.vitepress\components\GlassHome\index.vue
 * @Description: 首页组件 - Linear × Apple Premium Design
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
-->
<template>
  <div class="premium-home">

    <!-- ===== HERO ===== -->
    <section class="hero-section">
      <div class="hero-mesh" aria-hidden="true"></div>
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-noise" aria-hidden="true"></div>

      <div class="hero-inner">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span class="badge-label">Next Generation · AI工程体系</span>
        </div>

        <h1 class="hero-title">
          <span class="title-base">AGILE</span><span class="title-gradient"> TEAM</span>
        </h1>

        <p class="hero-tagline">提升交付效率，赋能团队协作</p>

        <div class="hero-cta">
          <a href="/frontend/quick-start/getting-started" class="cta-primary">
            <span>快速开始</span>
            <svg class="cta-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="/frontend/pc/skills/" class="cta-secondary">
            <span>探索 Skill</span>
          </a>
        </div>

        <div class="hero-stats">
          <div v-for="stat in stats" :key="stat.label" class="stat-item">
            <span class="stat-num">{{ stat.number }}</span>
            <span class="stat-lbl">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FEATURES ===== -->
    <section class="features-section">
      <div class="features-inner">
        <header class="section-header reveal-item">
          <div class="section-eyebrow">
            <span class="eyebrow-line"></span>
            <span>核心能力</span>
          </div>
          <h2 class="section-heading">六大模块，覆盖 AI 工程化全链路</h2>
          <p class="section-sub">系统性开发工程能力沉淀，助力研发团队提质增效</p>
        </header>

        <div class="feat-grid">
          <a
            v-for="(feature, idx) in features"
            :key="feature.title"
            :href="feature.link"
            class="feat-card reveal-item"
          >
            <div class="feat-top">
              <span class="feat-num">{{ String(idx + 1).padStart(2, '0') }}</span>
              <span class="feat-icon">{{ feature.icon }}</span>
            </div>
            <h3 class="feat-title">{{ feature.title }}</h3>
            <p class="feat-desc">{{ feature.details }}</p>
            <div class="feat-link">
              <span>了解更多</span>
              <svg class="link-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { features, stats } from "./data";

onMounted(() => {
  const items = document.querySelectorAll('.reveal-item');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));
});
</script>

<style scoped lang="scss">
@use "./index.scss";
</style>
