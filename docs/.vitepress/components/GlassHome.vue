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
          <div 
            v-for="stat in stats" 
            :key="stat.label"
            class="glass-stat-card"
          >
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

<script setup>
const features = [
  {
    icon: '🚀',
    title: '工程化配置',
    details: '统一的脚手架、构建工具和开发规范，开箱即用的项目模板',
    link: '/views/engineering/scaffold'
  },
  {
    icon: '🧩',
    title: '组件库',
    details: '高质量的业务组件和基础组件库，经过生产环境验证',
    link: '/ui-components/'
  },
  {
    icon: '📚',
    title: '最佳实践',
    details: '沉淀团队技术经验，涵盖架构设计、性能优化、测试方案',
    link: '/views/best-practices/architecture'
  },
  {
    icon: '🎨',
    title: '样式方案',
    details: '基于 UnoCSS 的原子化 CSS，灵活高效的样式开发体验',
    link: '/views/styling'
  },
  {
    icon: '🔧',
    title: '开发工具链',
    details: '完整的 Lint、Format、Test 工具链，保障代码质量',
    link: '/views/engineering/code-quality'
  },
  {
    icon: '🔥',
    title: '疑难杂症',
    details: '收集常见问题和解决方案，快速定位和解决开发问题',
    link: '/views/troubleshooting/'
  }
]

const stats = [
  {
    icon: '📦',
    number: '20+',
    label: '精选组件',
    desc: '经过生产验证的高质量组件'
  },
  {
    icon: '🛠️',
    number: '5+',
    label: '开发工具',
    desc: '完整的工程化工具链支持'
  },
  {
    icon: '💎',
    number: '100%',
    label: 'TypeScript',
    desc: '完整的类型支持和智能提示'
  },
  {
    icon: '⚡',
    number: '∞',
    label: '持续迭代',
    desc: '跟随前沿技术不断演进'
  }
]
</script>

<style scoped>
.glass-home {
  width: 100%;
  overflow: hidden;
}

/* Hero 区域 */
.hero-section {
  position: relative;
  padding: 64px 24px 40px;
  overflow: hidden;
  background: linear-gradient(135deg, 
    var(--vp-c-bg) 0%,
    var(--vp-c-bg) 50%,
    rgba(102, 126, 234, 0.02) 85%,
    var(--vp-c-bg-soft) 100%
  );
  min-height: auto;
}

.dark .hero-section {
  background: linear-gradient(135deg, 
    var(--vp-c-bg) 0%,
    var(--vp-c-bg) 50%,
    rgba(102, 126, 234, 0.03) 85%,
    var(--vp-c-bg-soft) 100%
  );
}

.hero-bg-decoration {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 50% 30%, rgba(102, 126, 234, 0.06) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(167, 139, 250, 0.04) 0%, transparent 50%);
  animation: pulse 8s ease-in-out infinite;
  pointer-events: none;
}

.dark .hero-bg-decoration {
  background: radial-gradient(circle at 50% 30%, rgba(129, 140, 248, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(167, 139, 250, 0.06) 0%, transparent 50%);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.hero-container {
  max-width: 1152px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding: 0 24px;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
}

.hero-text-content {
  flex: 1;
  max-width: 550px;
  text-align: left;
}

.hero-image-content {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-logo {
  position: relative;
}

/* Logo 背后的光晕效果 */
.hero-logo::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, 
    rgba(102, 183, 255, 0.35) 0%,
    rgba(118, 75, 234, 0.25) 30%,
    rgba(167, 139, 250, 0.15) 50%,
    transparent 70%
  );
  filter: blur(60px);
  z-index: -1;
  animation: glowPulse 4s ease-in-out infinite;
}

.dark .hero-logo::before {
  background: radial-gradient(circle, 
    rgba(102, 183, 255, 0.45) 0%,
    rgba(118, 75, 234, 0.35) 30%,
    rgba(167, 139, 250, 0.25) 50%,
    transparent 70%
  );
}

/* 第二层光晕 - 更大更柔和 */
.hero-logo::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130%;
  height: 130%;
  background: radial-gradient(circle, 
    rgba(59, 130, 246, 0.2) 0%,
    rgba(139, 92, 246, 0.12) 40%,
    transparent 70%
  );
  filter: blur(80px);
  z-index: -2;
  animation: glowPulse 6s ease-in-out infinite reverse;
}

.dark .hero-logo::after {
  background: radial-gradient(circle, 
    rgba(59, 130, 246, 0.3) 0%,
    rgba(139, 92, 246, 0.2) 40%,
    transparent 70%
  );
}

@keyframes glowPulse {
  0%, 100% { 
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.logo-image {
  width: 392px;
  height: 392px;
  object-fit: contain;
  filter: drop-shadow(0 8px 32px rgba(102, 126, 234, 0.2));
  animation: logoFloat 6s ease-in-out infinite;
  position: relative;
  z-index: 1;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.dark .logo-image {
  filter: drop-shadow(0 8px 32px rgba(129, 140, 248, 0.3));
}

.hero-title {
  margin: 0 0 12px;
}

.title-name {
  font-size: 52px;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.02em;
  background: linear-gradient(120deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .title-name {
  background: linear-gradient(120deg, #818cf8 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-text {
  font-size: 26px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 10px;
  letter-spacing: -0.01em;
}

.hero-tagline {
  font-size: 17px;
  color: var(--vp-c-text-2);
  margin: 0 0 32px;
  font-weight: 400;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.action-button.primary {
  background: linear-gradient(120deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.action-button.secondary {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider);
}

.action-button.secondary:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  transform: translateY(-2px);
}

/* Features 区域 */
.features-section {
  padding: 56px 24px 48px;
  background: var(--vp-c-bg-soft);
  position: relative;
}

/* 添加顶部柔和过渡 */
.features-section::before {
  content: '';
  position: absolute;
  top: -80px;
  left: 0;
  right: 0;
  height: 160px;
  background: linear-gradient(180deg, 
    transparent 0%,
    var(--vp-c-bg-soft) 50%,
    var(--vp-c-bg-soft) 100%
  );
  pointer-events: none;
}

.features-container {
  max-width: 1152px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.feature-card {
  padding: 32px 28px;
  border-radius: 16px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: block;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.dark .feature-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.feature-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.dark .feature-card:hover {
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 12px;
}

.feature-details {
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}

/* 液态玻璃统计区域 */
.glass-stats-section {
  padding: 64px 24px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, 
    var(--vp-c-bg-soft) 0%,
    var(--vp-c-bg) 30%,
    var(--vp-c-bg-soft) 70%,
    var(--vp-c-bg) 100%
  );
}

.glass-bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.glass-bg-decoration::before,
.glass-bg-decoration::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.25;
  animation: floatAnim 20s ease-in-out infinite;
}

.glass-bg-decoration::before {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  top: -250px;
  left: -150px;
}

.glass-bg-decoration::after {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(118, 75, 162, 0.3) 0%, transparent 70%);
  bottom: -200px;
  right: -150px;
  animation-delay: 10s;
}

@keyframes floatAnim {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -40px) scale(1.08); }
  66% { transform: translate(-25px, 25px) scale(0.92); }
}

.dark .glass-bg-decoration::before {
  background: radial-gradient(circle, rgba(129, 140, 248, 0.25) 0%, transparent 70%);
}

.dark .glass-bg-decoration::after {
  background: radial-gradient(circle, rgba(167, 139, 250, 0.25) 0%, transparent 70%);
}

.glass-container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.glass-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.glass-stat-card {
  position: relative;
  border-radius: 32px;
  padding: 3px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.05) 100%
  );
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.dark .glass-stat-card {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    rgba(255, 255, 255, 0.03) 100%
  );
}

.glass-stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.3) 50%, 
    transparent 100%
  );
  transition: left 0.6s ease;
  z-index: 2;
  pointer-events: none;
}

.glass-stat-card:hover::before {
  left: 100%;
}

.glass-card-inner {
  position: relative;
  padding: 48px 36px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 
    0 8px 32px rgba(102, 126, 234, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    inset 0 -1px 0 rgba(0, 0, 0, 0.03);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark .glass-card-inner {
  background: rgba(30, 30, 46, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 -1px 0 rgba(0, 0, 0, 0.15);
}

.glass-stat-card:hover {
  transform: translateY(-12px);
}

.glass-stat-card:hover .glass-card-inner {
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 
    0 20px 60px rgba(102, 126, 234, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    inset 0 -1px 0 rgba(0, 0, 0, 0.03);
}

.dark .glass-stat-card:hover .glass-card-inner {
  background: rgba(30, 30, 46, 0.88);
  box-shadow: 
    0 20px 60px rgba(129, 140, 248, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    inset 0 -1px 0 rgba(0, 0, 0, 0.15);
}

.stat-icon-large {
  font-size: 64px;
  margin-bottom: 24px;
  display: block;
  filter: drop-shadow(0 4px 12px rgba(102, 126, 234, 0.2));
  transition: all 0.4s ease;
}

.glass-stat-card:hover .stat-icon-large {
  transform: scale(1.1) rotateY(10deg);
  filter: drop-shadow(0 8px 24px rgba(102, 126, 234, 0.35));
}

.stat-content {
  position: relative;
}

.stat-number-large {
  font-size: 56px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  line-height: 1;
  letter-spacing: -0.03em;
}

.stat-label-large {
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.stat-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  font-weight: 400;
  opacity: 0.9;
}

/* 响应式 */
@media (max-width: 960px) {
  .hero-section {
    padding: 48px 24px 64px;
  }
  
  .hero-container {
    padding: 0;
  }
  
  .hero-content {
    flex-direction: column-reverse;
    gap: 32px;
    text-align: center;
  }
  
  .hero-text-content {
    max-width: 100%;
    text-align: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .logo-image {
    width: 280px;
    height: 280px;
  }
  
  .title-name {
    font-size: 40px;
  }
  
  .hero-text {
    font-size: 22px;
  }
  
  .hero-tagline {
    font-size: 16px;
  }
  
  .features-section {
    padding: 48px 20px 40px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .glass-stats-section {
    padding: 48px 20px;
  }
  
  .glass-stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .glass-card-inner {
    padding: 36px 24px;
  }
  
  .stat-icon-large {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .stat-number-large {
    font-size: 44px;
    margin-bottom: 8px;
  }
  
  .stat-label-large {
    font-size: 17px;
  }
  
  .stat-desc {
    font-size: 13px;
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding: 40px 20px 56px;
  }
  
  .logo-image {
    width: 220px;
    height: 220px;
  }
  
  .title-name {
    font-size: 34px;
  }
  
  .hero-text {
    font-size: 20px;
  }
  
  .hero-tagline {
    font-size: 15px;
    margin-bottom: 24px;
  }
  
  .action-button {
    padding: 11px 24px;
    font-size: 14px;
  }
  
  .features-section {
    padding: 40px 20px 32px;
  }
  
  .glass-stats-section {
    padding: 40px 20px;
  }
  
  .glass-stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>