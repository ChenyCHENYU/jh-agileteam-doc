# 晋钢 UI 字体优化方案

> **优化日期**: 2025 年 11 月 11 日  
> **优化目标**: 减少字体文件体积，提升大屏页面加载速度  
> **优化效果**: 字体体积从 37.4MB 降至 168KB，压缩率 **99.55%**  
> **影响范围**: 看板等 5 个大屏页面

---

## 问题背景

项目中使用了 3 个特殊字体文件用于大屏展示效果，但原始 TTF 格式文件过大：

```
public/fonts/
├── jiancheng500.ttf      18 MB  (建成体-Regular)
├── jiancheng700.ttf      18 MB  (建成体-Bold)
└── youshebiaotihei.ttf   1.4 MB (优设标题黑)
总计: 37.4 MB
```

这导致用户首次访问大屏页面时需要下载 37+ MB 字体，加载缓慢。

---

## 优化方案

### 核心思路

1. **字符白名单**: 只保留实际使用的 307 个字符
2. **格式转换**: TTF → WOFF2 (更好的压缩格式)
3. **自动化处理**: 脚本化字体子集化流程

### 技术实现

官方社区推荐使用 Python `fonttools` 库进行字体子集化：

```bash
# 安装工具
pip install fonttools brotli

# 字体子集化命令示例
pyftsubset jiancheng500.ttf \
  --text-file=font-whitelist.txt \
  --output-file=jiancheng500.woff2 \
  --flavor=woff2 \
  --layout-features='*' \
  --no-hinting
```

### 白名单管理

创建 `font-whitelist.txt` 文件，集中管理所有需要的字符：

```
# 数字 (0-9)
0123456789

# 当前使用的汉字 (200+ 个)
进出厂人员车辆当日预约申请违章待已结案...

# 标点符号
，。！？：；""''（）【】

# 英文字母 (大小写)
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz

# 新增字符记录区
# 2025-11-11: 添加"园区巡检报告"相关字
# 园检巡报告
```

---

## 优化成果

### 文件体积对比

| 字体文件          | 优化前 (TTF) | 优化后 (WOFF2) | 压缩率   |
| ----------------- | ------------ | -------------- | -------- |
| `jiancheng500`    | 18 MB        | **71 KB**      | 99.61% ↓ |
| `jiancheng700`    | 18 MB        | **71 KB**      | 99.61% ↓ |
| `youshebiaotihei` | 1.4 MB       | **21 KB**      | 98.50% ↓ |
| **总计**          | **37.4 MB**  | **168 KB**     | 99.55% ↓ |

加载性能提升是指数级的。


## 影响范围

### 修改的文件清单

本次优化共修改 **5 个 Vue 组件文件**，所有修改仅涉及字体引用路径（`.ttf` → `.woff2`），不涉及业务逻辑变更。

#### 1. 看板一

**文件路径**: `src/views/industrialParkGarden/parkDashBoard/index.vue`

**修改内容**:

```vue
<!-- 修改前 -->
src: url('/fonts/jiancheng500.ttf') format('truetype');

<!-- 修改后 -->
src: url('/fonts/jiancheng500.woff2') format('woff2');
```

**影响范围**: 3 个 @font-face 定义

- `CustomFont` (优设标题黑)
- `JianchengF` (建成 500)
- `JianchengS` (建成 700)

---

#### 2. 看板二

**文件路径**: `src/views/ism/dataStatistics/bulletinBoard/gymInspection/components/gymData.vue`

**修改内容**: 同上，3 个字体引用路径

**使用场景**: ISM 物业管理 → 数据统计 → 数据看板 → 体育馆看板

---

#### 3. 表格

**文件路径**: `src/views/ism/dataStatistics/bulletinBoard/gymInspection/components/table.vue`

**修改内容**: 同上，3 个字体引用路径

**使用场景**: ISM 物业管理 → 数据统计 → 数据看板 → 体育馆看板 → 表格组件

---

#### 4. 看板三

**文件路径**: `src/views/ism/dataStatistics/bulletinBoard/cateringSupermarket/components/gymData.vue`

**修改内容**: 同上，3 个字体引用路径

**使用场景**: ISM 物业管理 → 数据统计 → 数据看板 → 餐饮超市看板

---

#### 5. ISM 看板四

**文件路径**: `src/views/ism/dataStatistics/bulletinBoard/dormInspection/components/gymData.vue`

**修改内容**: 同上，3 个字体引用路径

**使用场景**: ISM 物业管理 → 数据统计 → 数据看板 → 宿舍看板

---

### 新增的文件

| 文件路径                             | 作用                    | 维护频率 |
| ------------------------------------ | ----------------------- | -------- |
| `font-whitelist.txt`                 | 字符白名单 (307 个字符) | 需要时   |
| `scripts/subset-fonts.js`            | 字体子集化自动化脚本    | 无需修改 |
| `scripts/subset-fonts-simple.js`     | 简化版脚本 (备用)       | 无需修改 |
| `public/fonts/jiancheng500.woff2`    | 优化后字体文件 (71 KB)  | 自动生成 |
| `public/fonts/jiancheng700.woff2`    | 优化后字体文件 (71 KB)  | 自动生成 |
| `public/fonts/youshebiaotihei.woff2` | 优化后字体文件 (21 KB)  | 自动生成 |

---

### 快速追溯命令

```bash
# 查看本次优化涉及的所有文件变更
git log --oneline --grep="字体优化" -10

# 查看具体修改内容
git diff HEAD~1 src/views/industrialParkGarden/parkDashBoard/index.vue

# 搜索所有使用自定义字体的文件
grep -r "JianchengF\|CustomFont\|JianchengS" src/views --include="*.vue"

# 验证 WOFF2 字体是否存在
ls -lh public/fonts/*.woff2
```

---

## 代码改动示例

### 字体引用方式变更

**优化前 (使用 TTF)**:

```vue
<style scoped>
@font-face {
  font-family: "JianchengF";
  src: url("/fonts/jiancheng500.ttf") format("truetype");
  font-weight: normal;
  font-display: swap;
}
</style>
```

**优化后 (使用 WOFF2)**:

```vue
<style scoped>
@font-face {
  font-family: "JianchengF";
  src: url("/fonts/jiancheng500.woff2") format("woff2"); /* ✅ 71KB */
  font-weight: normal;
  font-display: swap;
}
</style>
```

### 使用方式不变

CSS 类名和字体使用方式完全一致，无需修改业务代码：

```vue
<template>
  <div class="text-family">{{ count }}</div>
  <!-- ✅ 显示效果完全一致 -->
  <div class="jc-5">进厂</div>
  <!-- ✅ 所有白名单字符正常显示 -->
</template>

<style scoped>
.text-family {
  font-family: "JianchengF" !important; /* 建成500 */
}
.jc-5 {
  font-family: "CustomFont" !important; /* 优设标题黑 */
}
.jc-7 {
  font-family: "JianchengS" !important; /* 建成700 */
}
</style>
```

---

## 日常维护指南

### 新增字符需求

**场景**: 新大屏页面需要显示"智慧工厂"字样，但发现显示为方块 (缺字)

**处理流程**:

1. **更新白名单文件**

```bash
# 编辑 font-whitelist.txt
vim font-whitelist.txt

# 在文件末尾添加新字符（带注释便于追溯）
# 2025-11-15: 智慧工厂大屏新增
智慧工厂
```

2. **重新生成字体**

```bash
# 运行自动化脚本
cd d:/office-project/jingangintegrate-ui
pnpm run font:subset

# 脚本会自动：
# 1. 读取 font-whitelist.txt
# 2. 生成新的 .woff2 文件
# 3. 输出体积对比报告
```

3. **验证效果**

```bash
# 启动开发服务器
pnpm run dev

# 访问对应页面，确认新字符显示正常
# 刷新浏览器缓存: Ctrl + Shift + R
```

4. **提交代码**

```bash
git add font-whitelist.txt public/fonts/*.woff2
git commit -m "feat: 字体白名单新增'智慧工厂'字符"
```

---

### 新增页面使用字体

**场景**: 新建一个大屏页面需要使用特殊字体

**步骤**:

1. **在 `<style>` 中定义字体**

```vue
<style scoped>
/* 复制标准字体定义 */
@font-face {
  font-family: "JianchengF";
  src: url("/fonts/jiancheng500.woff2") format("woff2");
  font-weight: normal;
  font-display: swap;
}

.my-number {
  font-family: "JianchengF", "PingFang SC", sans-serif; /* ✅ 添加降级字体 */
  font-size: 48px;
}
</style>
```

2. **确认所需字符在白名单中**

```bash
# 检查白名单内容
cat font-whitelist.txt | grep "你需要的字"

# 如果不存在，按照上一节流程添加
```

3. **测试显示效果**

```vue
<template>
  <!-- ✅ 白名单内的字符正常显示 -->
  <div class="my-number">12345</div>

  <!-- ⚠️ 白名单外的字符会显示为降级字体 (PingFang SC) -->
  <div class="my-number">①②③</div>
</template>
```

---


## 自动化脚本

### 字体子集化脚本

项目中已包含 `scripts/subset-fonts.js`，自动化处理流程：

```javascript
// scripts/subset-fonts.js (简化版)
const { execSync } = require("child_process");
const fs = require("fs");

const fonts = [
  { input: "jiancheng500.ttf", output: "jiancheng500.woff2" },
  { input: "jiancheng700.ttf", output: "jiancheng700.woff2" },
  { input: "youshebiaotihei.ttf", output: "youshebiaotihei.woff2" },
];

fonts.forEach((font) => {
  console.log(`处理字体: ${font.input}...`);

  const cmd = `pyftsubset public/fonts/${font.input} \\
    --text-file=font-whitelist.txt \\
    --output-file=public/fonts/${font.output} \\
    --flavor=woff2 \\
    --layout-features='*' \\
    --no-hinting`;

  execSync(cmd, { stdio: "inherit" });

  const size = fs.statSync(`public/fonts/${font.output}`).size;
  console.log(`✅ 生成成功: ${(size / 1024).toFixed(1)} KB\n`);
});
```

### 使用方式

```bash
# package.json 中已配置
{
  "scripts": {
    "font:subset": "node scripts/subset-fonts.js"
  }
}

# 执行命令
pnpm run font:subset

# 输出示例:
# 处理字体: jiancheng500.ttf...
# ✅ 生成成功: 71.2 KB
#
# 处理字体: jiancheng700.ttf...
# ✅ 生成成功: 71.5 KB
#
# 处理字体: youshebiaotihei.ttf...
# ✅ 生成成功: 21.3 KB
#
# 📊 优化汇总:
# 原始体积: 37.4 MB
# 优化体积: 168 KB
# 压缩率: 99.55%
```

---

## 注意事项

### 关键点

1. **只添加必需字符**  
   白名单字符越多，字体文件越大。添加前确认字符是否真的会用到。

2. **保留原始 TTF 文件**  
   原始字体文件已备份到 `public/fonts/originals/`，不要删除，方便后续重新生成。

3. **提交 WOFF2 文件到 Git**  
   生成的 `.woff2` 文件应该提交到代码仓库，确保团队成员和生产环境都使用优化后的字体。

4. **降级字体很重要**  
   始终为自定义字体设置降级方案：

   ```css
   font-family: "JianchengF", "PingFang SC", "Microsoft YaHei", sans-serif;
   ```

  `WOFF2` 在现代浏览器中支持良好，但建议在主流浏览器中测试：


### 性能建议

```vue
<style scoped>
@font-face {
  font-family: "JianchengF";
  src: url("/fonts/jiancheng500.woff2") format("woff2");
  font-weight: normal;
  font-display: swap; /* ✅ 关键属性: 先显示降级字体，再替换 */
}
</style>
```

`font-display: swap` 的作用：

- 字体加载期间先显示降级字体 (PingFang SC)
- 字体加载完成后平滑切换到自定义字体
- 避免页面出现"白屏"或"闪烁"

---

## 工具推荐

### 字体分析工具

```bash
# 1. 查看字体包含的字符数
pyftsubset jiancheng500.ttf --text-file=font-whitelist.txt --output-file=test.woff2 --flavor=woff2
# 会显示: Retained 307 glyphs

# 2. 查看字体文件详细信息
pip install fonttools
ttx -t head -t name public/fonts/jiancheng500.woff2

# 3. 在线工具
# https://transfonter.org/ - 字体格式转换
# https://fontdrop.info/ - 在线查看字体详情
```

### 浏览器调试

```javascript
// 在浏览器控制台运行，检查字体是否加载成功
document.fonts.ready.then(() => {
  const fonts = Array.from(document.fonts.values());
  fonts.forEach((font) => {
    console.log(`${font.family}: ${font.status}`);
    // JianchengF: loaded ✅
  });
});
```

---

## 附录: 完整文件清单

### 核心文件

```
项目根目录/
├── font-whitelist.txt              # 字符白名单 (307 个字符)
├── scripts/
│   └── subset-fonts.js             # 自动化字体子集化脚本
├── public/
│   └── fonts/
│       ├── jiancheng500.woff2      # 优化后字体 (71 KB)
│       ├── jiancheng700.woff2      # 优化后字体 (71 KB)
│       ├── youshebiaotihei.woff2   # 优化后字体 (21 KB)
│       └── originals/              # 原始 TTF 备份 (37.4 MB) 后续会删除
│           ├── jiancheng500.ttf
│           ├── jiancheng700.ttf
│           └── youshebiaotihei.ttf
```

### 使用字体的页面

```
src/views/
├── industrialParkGarden/
│   └── parkDashBoard/index.vue                 
└── ism/dataStatistics/bulletinBoard/
    ├── gymInspection/
    │   └── components/
    │       ├── gymData.vue                     
    │       └── table.vue                       
    ├── cateringSupermarket/
    │   └── components/gymData.vue              
    └── dormInspection/
        └── components/gymData.vue              
```

---

本方案已在测试环境验证通过，可直接用于生产环境。如遇问题请联系作者协助解决。
