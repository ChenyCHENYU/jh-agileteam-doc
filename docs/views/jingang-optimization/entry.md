# 入口页面 `[index.html]`

> 加载动画速度优化，顺便干掉了 `App.vue` 里的重复代码

<AuthorTag author="CHENY" />

## 优化后的配置

### 主要参数调整

```javascript
const CONFIG = {
  minDisplayTime: 1500, // 最小展示时间：3秒 → 1.5秒 ⚡
  slideDelay: 200, // 分屏滑出延迟：300ms → 200ms ⚡
  removeDelay: 800, // DOM移除延迟：1500ms → 800ms ⚡
  maxDisplayTime: 8000, // 超时保护：10秒 → 8秒
  useSlideEffect: true, // 保持分屏效果
};
```

### CSS 过渡优化

```css
/* 淡出速度：0.5s → 0.4s */
transition: opacity 0.4s ease-out, visibility 0s linear 0.4s;

/* 分屏滑出：0.7s delay 0.3s → 0.6s delay 0.2s */
transition: transform 0.6s 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
```

### JavaScript 延迟调整

```javascript
// 页面渲染等待：500ms → 300ms
setTimeout(checkAndHide, 300);

// 隐藏后延迟：500ms → 400ms
setTimeout(function () {
  loader.style.display = "none";
}, 400);
```

---

## 优化后的时间轴

### 快速加载场景（应用加载 1 秒）

```
0ms      页面开始加载，显示加载动画
1000ms   Vue 应用挂载完成
1300ms   通知加载控制脚本（+300ms延迟）
         未到最小时间（1500ms），继续等待
1500ms   达到最小时间，开始淡出
1700ms   分屏开始滑出（+200ms延迟）
2300ms   分屏滑出完成（+600ms动画）
2700ms   加载器 display: none（+400ms延迟）
--------------------------------------------------
总耗时：约 2.7 秒（之前约 4.8 秒）
```

### 正常加载场景（应用加载 1.8 秒）

```
0ms      页面开始加载，显示加载动画
1800ms   Vue 应用挂载完成
2100ms   通知加载控制脚本（+300ms延迟）
         已超过最小时间，立即开始淡出
2300ms   分屏开始滑出（+200ms延迟）
2900ms   分屏滑出完成（+600ms动画）
3300ms   加载器 display: none（+400ms延迟）
--------------------------------------------------
总耗时：约 3.3 秒（之前约 5.6 秒）
```

---

## 性能对比

| 项目             | 优化前 | 优化后       | 提升            |
| ---------------- | ------ | ------------ | --------------- |
| 最小展示时间     | 3000ms | **1500ms**   | **-50%**        |
| 分屏滑出延迟     | 300ms  | **200ms**    | **-33%**        |
| 淡出动画         | 500ms  | **400ms**    | **-20%**        |
| 分屏动画         | 700ms  | **600ms**    | **-14%**        |
| 页面渲染等待     | 500ms  | **300ms**    | **-40%**        |
| **总体感知速度** | 较慢   | **快速流畅** | **约 40% 提升** |

---

## 自定义调整

### 想要稍慢一点？

**增加最小展示时间**

```javascript
minDisplayTime: 2000,  // 2秒，平衡感
```

**增加动画时间**

```css
transition: opacity 0.6s ease-out;
transition: transform 0.8s 0.3s;
```

---

## 推荐配置

### 当前配置（推荐）

- 平衡速度与体验
- 用户能看到完整动画
- 不会感觉等待太久
- 过渡流畅自然

### 极速配置（追求性能）

```javascript
const CONFIG = {
  minDisplayTime: 1000,
  slideDelay: 100,
  useSlideEffect: false, // 关闭分屏
};
```

效果：约 1.5 秒完成

### 优雅配置（注重体验）

```javascript
const CONFIG = {
  minDisplayTime: 2000,
  slideDelay: 300,
  useSlideEffect: true,
};
```

效果：约 3.5 秒完成

---

## 监控与调试

### 查看实际加载时间

打开浏览器控制台，查看日志：

```
加载器状态已重置
加载控制脚本已初始化
路由准备完成
收到Vue应用挂载完成通知
加载已用时: 1234ms  ← 查看这个值
```

### 性能测试

```javascript
// 在控制台运行
performance.mark("loader-start");
// 刷新页面
// 页面加载完成后
performance.mark("loader-end");
performance.measure("loader-duration", "loader-start", "loader-end");
console.log(performance.getEntriesByName("loader-duration"));
```

---

## 优化总结

### 主要改进

1.  **最小展示时间减半**：3 秒 → 1.5 秒
2.  **动画更快**：所有过渡时间减少 15-40%
3.  **响应更灵敏**：延迟时间大幅减少
4.  **保持流畅**：动画依然优雅，无生硬感
5.  **无副作用**：刷新正常，无白屏


---

## 配置文件位置

所有配置都在 `index.html` 中:

```html
<!-- 第 275 行左右：JavaScript 配置 -->
const CONFIG = { minDisplayTime: 1500, slideDelay: 200, // ... };

<!-- 第 40-50 行左右：CSS 过渡 -->
#loader-wrapper { transition: opacity 0.4s ease-out; }

<!-- 第 155-160 行左右：分屏动画 -->
.loader-section { transition: transform 0.6s 0.2s; }
```

---

性能提升：约 **40%**
