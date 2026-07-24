<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useRouter } from 'vitepress'
import { ref, onMounted, watch, nextTick } from 'vue'

const { Layout } = DefaultTheme

// ─── 初始加载动画 ───
const showLoading = ref(true)

onMounted(() => {
  requestAnimationFrame(() => {
    setTimeout(() => {
      showLoading.value = false
    }, 600)
  })
})

// ─── 路由切换过渡 ───
const router = useRouter()
const isNavigating = ref(false)

const compactTableHeaders = new Set([
  '层级',
  '状态',
  '序号',
  '编号',
  '名称',
  '属性名',
  '方法名',
  '事件名',
  '参数',
  '类型',
  '默认值',
  '返回值',
  '必填',
  '版本',
  '数量',
  '操作'
])

const optimizeDocumentTables = () => {
  document.querySelectorAll<HTMLTableElement>('.vp-doc table').forEach((table) => {
    table.querySelectorAll('.is-compact-column').forEach((cell) => {
      cell.classList.remove('is-compact-column')
    })

    const headers = Array.from(table.querySelectorAll<HTMLTableCellElement>('thead th'))
    const rows = Array.from(table.querySelectorAll<HTMLTableRowElement>('tbody tr'))

    headers.forEach((header, columnIndex) => {
      const cells = rows
        .map((row) => row.children.item(columnIndex))
        .filter((cell): cell is Element => cell !== null)

      const headerText = header.textContent?.replace(/\s+/g, '') ?? ''
      const allCellsAreShort = cells.length > 0 && cells.every((cell) => {
        const text = cell.textContent?.replace(/\s+/g, ' ').trim() ?? ''
        const hasComplexContent = cell.querySelector('ul, ol, pre, br') !== null
        return !hasComplexContent && text.length <= 12
      })

      if (compactTableHeaders.has(headerText) || allCellsAreShort) {
        const compactCells = [header, ...cells]
        compactCells.forEach((cell) => {
          cell.classList.add('is-compact-column')
        })
      }
    })
  })
}

const scheduleTableOptimization = () => {
  nextTick(() => {
    requestAnimationFrame(optimizeDocumentTables)
  })
}

onMounted(scheduleTableOptimization)

watch(
  () => router.route.path,
  () => {
    // 通知 Waline 评论系统路由变化
    window.dispatchEvent(new Event('vitepress:route-change'))
    // 显示进度条
    isNavigating.value = true
    nextTick(() => {
      setTimeout(() => {
        isNavigating.value = false
      }, 350)
    })
    scheduleTableOptimization()
  }
)
</script>

<template>
  <!-- 初始加载屏 -->
  <Transition name="loading-fade">
    <div v-if="showLoading" class="app-loading">
      <div class="app-loading__container">
        <!-- SVG Logo 动画 -->
        <svg class="app-loading__logo" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- 外圈旋转光环 -->
          <circle
            cx="40" cy="40" r="36"
            stroke="url(#loading-gradient)"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-dasharray="180 226"
            class="app-loading__ring"
          />
          <!-- 内圈脉冲 -->
          <circle
            cx="40" cy="40" r="24"
            stroke="url(#loading-gradient)"
            stroke-width="1.5"
            stroke-dasharray="100 151"
            opacity="0.5"
            class="app-loading__ring app-loading__ring--inner"
          />
          <!-- 中心图标 — 代码符号 -->
          <path
            d="M32 34L26 40L32 46M48 34L54 40L48 46M43 30L37 50"
            stroke="url(#loading-gradient)"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="app-loading__icon"
          />
          <defs>
            <linearGradient id="loading-gradient" x1="0" y1="0" x2="80" y2="80">
              <stop offset="0%" stop-color="#667eea" />
              <stop offset="100%" stop-color="#764ba2" />
            </linearGradient>
          </defs>
        </svg>
        <!-- 品牌文字 -->
        <div class="app-loading__text">AGILE TEAM</div>
        <div class="app-loading__dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  </Transition>

  <!-- 路由切换进度条 -->
  <Transition name="nav-progress">
    <div v-if="isNavigating" class="nav-progress-bar" />
  </Transition>

  <!-- 主内容 -->
  <Layout />
</template>

<style>
/* ═══════════════════════════════════════════
   初始加载屏
   ═══════════════════════════════════════════ */
.app-loading {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}
.dark .app-loading {
  background: #09090b;
}

.app-loading__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.app-loading__logo {
  width: 80px;
  height: 80px;
}

/* 外圈旋转 */
.app-loading__ring {
  transform-origin: center;
  animation: ring-spin 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
.app-loading__ring--inner {
  animation-direction: reverse;
  animation-duration: 2.4s;
}

/* 中心图标描边动画 */
.app-loading__icon {
  stroke-dasharray: 120;
  stroke-dashoffset: 120;
  animation: icon-draw 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
}

/* 品牌文字 */
.app-loading__text {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 3px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 加载圆点 */
.app-loading__dots {
  display: flex;
  gap: 6px;
}
.app-loading__dots span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  animation: dot-pulse 1.2s ease-in-out infinite;
}
.app-loading__dots span:nth-child(2) { animation-delay: 0.15s; }
.app-loading__dots span:nth-child(3) { animation-delay: 0.3s; }

/* ═══════════════════════════════════════════
   路由切换进度条
   ═══════════════════════════════════════════ */
.nav-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9998;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
  background-size: 200% 100%;
  animation: progress-slide 0.8s ease-in-out infinite;
  border-radius: 0 1px 1px 0;
}

/* ═══════════════════════════════════════════
   过渡动画
   ═══════════════════════════════════════════ */
.loading-fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              filter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.loading-fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
  filter: blur(8px);
}

.nav-progress-enter-active {
  transition: opacity 0.15s ease;
}
.nav-progress-leave-active {
  transition: opacity 0.3s ease;
}
.nav-progress-enter-from,
.nav-progress-leave-to {
  opacity: 0;
}

/* ═══════════════════════════════════════════
   关键帧
   ═══════════════════════════════════════════ */
@keyframes ring-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes icon-draw {
  to { stroke-dashoffset: 0; }
}

@keyframes dot-pulse {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1.2); }
}

@keyframes progress-slide {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
