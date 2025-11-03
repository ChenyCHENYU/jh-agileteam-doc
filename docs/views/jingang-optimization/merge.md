# 前端生产发版流程规范

> 应对生产环境有敬畏之心，避免生产环境事故和客诉。

::: warning 核心目标
**零生产事故**：通过镜像分支 + 本地验证 + MR合并，彻底杜绝生产环境问题

包括：白屏、功能异常、样式错乱、页面加载失败、控制台报错等
:::

<AuthorTag author="CHENY" />  

## 一、项目概况

### 技术栈
```yaml
构建工具: Vite
包管理: pnpm
代码仓库: GitLab
CI/CD: Jenkins（点击式构建）
项目结构: 伪 Monorepo（18个子项目，全量构建）
```

### 项目痛点
- ⚠️ 无法单独构建某个子项目 （`后续改造支持`）
- ⚠️ `pnpm run build` 构建所有项目
- ⚠️ 全量构建耗时：首次 8-10分钟，缓存后 3-5分钟

**解决策略**：镜像分支本地验证 + 构建缓存优化

---

## 二、分支模型

### 分支结构

```
master (生产) ← 严格保护，必须MR审批
  ↑
  镜像验证
  ↑
uat (测试) ← 轻管控，镜像验证后可直接合并
  ↑
  镜像验证
  ↑
business/* (业务开发) ← 日常开发
```

### 分支权限配置

| 分支 | 保护方式 | 合并方式 |
|------|---------|---------|
| `master` | 🔒 只有技术负责人能合并 | 务必Merge Request |
| `uat` | 🔓 项目负责人可推送 | 镜像验证后直接合并 |
| `business/*` | 项目技术经理 | 自定 |

::: danger 铁律
**永远不要直接在 UAT/Master 上解决冲突！**

必须在镜像分支上合并、验证，确认无误后再推送。
:::

---

## 三、UAT发布流程

### 操作步骤

```bash
# 1. 创建UAT镜像分支（1分钟）
git checkout uat && git pull
git checkout -b mirror-uat/项目名-日期

# 2. 合并业务分支（1分钟）
git merge origin/business/项目名
# 如有冲突，在镜像分支解决

# 3. 本地验证（8-10分钟，关键！）
pnpm install                # 安装依赖（30-60秒）
pnpm run dev                 # 启动测试
pnpm run build:uat           # 全量构建（3-8分钟）
pnpm run preview             # 预览产物

# 4. 合并到UAT（1分钟）
git checkout uat && git pull
git merge mirror-uat/项目名-日期
git push origin uat

# 5. 删除镜像分支
git branch -d mirror-uat/项目名-日期

# 6. Jenkins构建UAT
# 登录Jenkins → 选择uat分支 → 点击构建
```

### 本地验证检查清单

::: tip 必须全部通过才能合并
**开发模式**：
- [ ] `pnpm run dev` 启动无报错
- [ ] 改动功能运行正常
- [ ] 控制台无错误和警告

**构建验证**：
- [ ] `pnpm run build:uat` 构建成功
- [ ] 构建时间正常（3-8分钟）
- [ ] 无构建报错和警告

**产物预览**：
- [ ] `pnpm run preview` 可正常访问
- [ ] 功能在生产模式下正常
- [ ] 页面加载正常
:::

---

## 四、生产发布流程（严格管控）

### 操作步骤

```bash
# 1. 创建生产镜像分支（1分钟）
git checkout master && git pull
git checkout -b mirror-prod/项目名-v版本号

# 2. 合并业务分支（1分钟）
git merge origin/business/项目名
# 如有冲突，仔细解决

# 3. 本地完整验证（15-20分钟，极其重要！）
rm -rf node_modules && pnpm install  # 重新安装依赖
pnpm run dev                          # 完整测试所有功能
pnpm run build:prod                   # 生产构建
pnpm run preview                      # 预览产物
ls -lh dist/                         # 检查产物
find dist -name "*.map"              # 确认无.map文件

# 4. 推送镜像分支，提交MR
git push origin mirror-prod/项目名-v版本号
# 在GitLab提交MR到master

# 5. 等待审批通过，合并

# 6. 删除镜像分支
git branch -d mirror-prod/项目名-v版本号

# 7. Jenkins构建生产
# 登录Jenkins → 选择master分支 → 点击构建

# 8. 立即验证生产环境（见下文）
```

### 生产验证检查清单（100%通过）

::: danger 必须全部通过
**依赖和构建**：
- [ ] 删除node_modules重新安装
- [ ] 开发模式完整测试
- [ ] 核心业务流程验证（登录、下单等）
- [ ] 生产构建成功，无报错无警告
- [ ] 构建时间正常（对比之前）

**构建产物**：
- [ ] 无.map文件（`find dist -name "*.map"` 无输出）
- [ ] 文件大小合理（对比之前）
- [ ] 关键文件都存在

**生产预览**：
- [ ] preview可正常访问
- [ ] 所有功能正常
- [ ] 页面加载速度正常
:::

---

## 五、彻底预防生产事故的核心策略

::: danger 零容忍原则
**生产环境绝对不允许出现问题！**

问题必须在发布前全部解决，绝不能等到生产环境再发现。如果生产环境出现问题，说明前置验证流程失败了。
:::

### 5.1 三道防线（层层把关）

```
第一道防线：本地镜像分支验证（开发者）
    ↓ 必须100%通过
第二道防线：UAT环境测试（QA）
    ↓ 必须100%通过
第三道防线：生产发布前的最终检查（技术负责人）
    ↓ 确认无误才能发布
```

### 5.2 第一道防线：本地镜像分支验证（最关键）

**目标**：在本地就把所有问题解决，确保代码100%可用

#### 开发模式完整测试（必须做到）

```bash
# 1. 启动开发服务器
pnpm run dev

# 2. 建议使用多个浏览器测试 
✅ Chrome
✅ Microsoft Edge

# 3. 完整测试清单（逐项检查）
□ 本次改动的所有功能（每个细节都测）
□ 与改动相关的功能（可能受影响的）
□ 核心业务流程（自己冒烟）
□ 各种边界情况（根据业务的实际容错验证）

# 4. 控制台检查（极其重要）
□ Console：绝对不能有红色错误
□ Console：黄色警告要看清楚，不要跟业务代码有关
□ Network：所有请求都成功（200/304）
□ Network：无404、无500
□ Performance：页面加载时间合理
□ Application：Stores/localStorage/Cookie正常

# 生产发布，再谨慎都不为过，生产事故和客诉的后果！如果任何一项有问题，立即修复，重新测试！
```

#### 生产构建严格验证（必须做到）

```bash
# 1. 生产构建
pnpm run build:prod

# 2. 观察构建过程
□ 无任何红色错误
□ 无任何黄色警告（如果有，必须弄清楚原因）
□ 构建时间正常（对比之前的构建）

# 3. 检查构建产物
ls -lh dist/

□ dist目录存在且完整
□ 文件大小合理（对比之前的版本）
□ 无.map文件（find dist -name "*.map" 无输出）
□ 关键文件都存在（index.html、js、css、assets）

# 4. 预览构建产物（重要！）
pnpm run preview

# 在预览环境中再次完整测试：
□ 所有功能在生产模式下正常（不要只看首页！）
□ 刷新页面多次，确保路由正常
□ 清除浏览器缓存后再测试一遍
□ 打开控制台，确认无任何错误
□ 测试资源加载（图片、字体、图标等）
□ 测试API请求（确认地址正确）

# 如果预览有任何问题，说明构建有问题，必须修复！
```

#### 对比检查（防止遗漏）

```bash
# 1. 对比构建产物大小
du -sh dist/
# 与上一版本对比：
# - 增大很多？检查是否引入了大的依赖
# - 减少很多？检查是否有文件丢失

# 2. 对比功能（用上一版本对照）
# 如果可能，同时打开：
# - 本地preview的新版本
# - UAT环境的旧版本
# 对比两者的功能和样式，确保新版本正常
```

### 5.3 第二道防线：UAT环境充分测试

**目标**：在真实环境中验证，确保无任何问题

#### UAT测试要求（QA必须做到）

```bash
# 1. 功能测试（全面）
□ 测试所有新增功能
□ 测试所有修改的功能
□ 回归测试：测试可能受影响的旧功能
□ 核心业务流程完整测试

# 2. 性能测试
□ 页面加载速度正常
□ 操作响应速度正常
□ 无明显卡顿

# 3. 异常场景测试
□ 接口报错的情况
□ 异常数据的情况

# 5. 用户体验测试
□ 交互流程顺畅
□ 提示信息清晰
□ 错误提示友好

# UAT测试不通过，绝对不能发布生产！
```

#### 开发者在UAT环境的验证（不能只依赖QA）

```bash
# 1. 自己也要在UAT测试
□ 测试真实业务场景
□ 测试各种边界情况

# 2. 让项目组其他同事测试
□ 产品经理测试
□ 其他开发测试
□ 让不熟悉功能的人测试（更容易发现问题）

# 多人测试，才能发现更多问题！
```

### 5.4 第三道防线：生产发布前的最终检查

**由技术负责人执行，再次确认**

#### 代码审查（技术负责人）

```bash
# 1. 审查MR的代码变更
□ 代码质量OK
□ 没有明显的bug
□ 没有console.log等调试代码
□ 没有注释掉的代码
□ 没有TODO/FIXME等标记

# 2. 审查测试情况
□ 本地验证完整（看检查清单）
□ UAT测试通过（如果有测试，看测试反馈或报告）
□ 无遗留问题
```

#### 发布前的二次确认

```bash
# 在点击Jenkins构建按钮前，再次确认：

□ 本地验证：100%通过
□ UAT测试：100%通过  
□ 代码审查：100%通过
□ 回滚预案：已准备好
□ 发布时间：合适（避开业务高峰，已上线给业务使用的项目特别注意，如物流）
□ 相关人员：已通知到位

# 所有都确认无误，才能发布！
```

### 5.5 发布后的二次验证（最后保险）

::: warning 重要说明
这一步是"最后的保险"，用于二次确认。

**但是！问题应该在前面的步骤就被发现和解决，绝不能依赖这一步！**

如果这一步发现了问题，说明前置验证流程有漏洞，需要反思和改进。
:::

#### 快速验证（花个2-3分钟）

```bash
# 发布完成后，技术负责人立即验证：

# 1. 访问生产URL（隐身窗口，避免缓存）
□ 页面正常加载，无白屏
□ 样式显示正常

# 2. 快速测试改动的功能
□ 核心功能正常（快速过一遍）

# 3. 检查控制台
□ 按F12，看Console，无红色错误

# 4. 如果一切正常，结束
# 5. 如果发现问题，立即回滚（见5.6）
```

### 5.6 紧急回滚（< 5分钟）

**回滚决策标准**（任何一条满足立即回滚）：
- ❌ 页面白屏或无法访问
- ❌ 核心功能不可用
- ❌ 控制台大量错误
- ❌ 用户报告问题

**回滚操作**（< 5分钟）：

```bash
# 方法1：回滚到上一个Tag（建议）
git checkout master
git reset --hard v上一个版本
git push origin master --force

# 方法2：Revert最近提交
git checkout master
git revert HEAD
git push origin master

# 然后在Jenkins重新构建master
```

---

## 六、GitLab配置（需运维伙伴设置）

### 6.1 Master分支保护（关键）

**Settings → Repository → Protected Branches → master**

```yaml
Allowed to merge: 仅技术负责人（或指定的master合并人）
Allowed to push: No one（任何人都不能直接推送）

# 建议GitLab支持MR审批，配置：
Require approval: Yes
Number of approvals: 1人（技术负责人）
```

**说明**：
- 技术负责人：可以是技术经理、Team Leader、或指定的master合并负责人
- 如果项目有QA，可以加上QA审批（可选）
- 不需要搞得太复杂，1-2人审批就够了

### 6.2 UAT分支配置（轻管控）

```yaml
Allowed to merge: 项目负责人/技术经理
Allowed to push: 项目负责人/技术经理
Allow force push: No
```

### 6.3 MR模板（可选）

尽量规范MR描述，参考 `.gitlab/merge_request_templates/production.md`：

```markdown
## 生产发布

**版本号**: v1.2.0
**项目**: project-a
**负责人**: @张三

### 变更内容
- 新增XX功能
- 修复XX问题

### UAT测试
- 测试时间：2025-01-03
- 测试结论：✅ 通过

### 本地验证
- [x] 完整测试通过
- [x] 生产构建成功
- [x] 产物检查通过

### 回滚预案
- 回滚到：v1.1.0
- 负责人：@张三
```

**说明**：这个模板是可选的，如果觉得麻烦可以不用。关键是本地验证要做到位。

---

## 七、Jenkins配置说明（运维小哥支撑/晋钢王磊）

### 7.1 当前Jenkins配置

现在的Jenkins应该是这样的：

```groovy
pipeline {
    agent any
    
    parameters {
        choice(name: 'BRANCH', choices: ['uat', 'master'])
    }
    
    stages {
        stage('拉取代码') {
            steps {
                git branch: "${params.BRANCH}", url: '...'
            }
        }
        
        stage('安装依赖') {
            steps {
                sh 'pnpm install --frozen-lockfile'
            }
        }
        
        stage('构建') {
            steps {
                sh 'pnpm run build:${params.BRANCH == "master" ? "prod" : "uat"}'
            }
        }
    }
}
```

这个配置基本已经够用了

### 7.2 建议优化（主要是提升构建速度）


```groovy
pipeline {
    agent any
    
    parameters {
        choice(name: 'BRANCH', choices: ['uat', 'master'])
        choice(name: 'CLEAN_CACHE', choices: ['否', '是'], 
               description: '是否清理构建缓存？')
    }
    
    stages {
        stage('拉取代码') {
            steps {
                git branch: "${params.BRANCH}", 
                    url: 'https://gitlab.jggroup.cn/JinGangIntegrate/jingangintegrate-ui.git'  // 运维确认下地址
            }             
        }
        
        stage('清理缓存') {
            when { expression { params.CLEAN_CACHE == '是' } }
            steps {
                sh 'rm -rf node_modules/.vite'
            }
        }
        
        stage('智能安装依赖') {
            steps {
                script {
                    // 检查依赖是否变化
                    def lockChanged = sh(
                        script: 'git diff HEAD~1 HEAD --name-only | grep pnpm-lock.yaml || echo no',
                        returnStdout: true
                    ).trim()
                    
                    if (lockChanged != 'no') {
                        echo '依赖变化，重新安装'
                        sh 'rm -rf node_modules && pnpm install --frozen-lockfile'
                    } else if (!fileExists('node_modules')) {
                        echo '首次安装'
                        sh 'pnpm install --frozen-lockfile'
                    } else {
                        echo '依赖未变，跳过安装'
                    }
                }
            }
        }
        
        stage('构建') {
            steps {
                script {
                    def cmd = params.BRANCH == 'master' ? 'build:prod' : 'build:uat'
                    def start = System.currentTimeMillis()
                    
                    sh "pnpm run ${cmd}"
                    
                    def time = (System.currentTimeMillis() - start) / 1000
                    echo "构建完成，耗时: ${time}秒"
                }
            }
        }
        
        stage('检查产物') {
            steps {
                sh '''
                    if [ ! -d "dist" ]; then
                        echo "构建产物不存在"; exit 1
                    fi
                    
                    # 生产环境检查source map
                    if [ "${BRANCH}" = "master" ]; then
                        if find dist -name "*.map" | grep -q .; then
                            echo "发现.map文件"; exit 1
                        fi
                    fi
                    
                    du -sh dist/
                '''
            }
        }
    }
}
```

**优化说明**：
- **智能安装**：只在pnpm-lock.yaml变化时才重新安装，节省构建时间
- **缓存清理**：提供可选的清理选项，大版本发布时用
- **构建时间**：统计并显示构建耗时
- **产物检查**：自动检查构建产物质量，排查源码映射文件

---

## 八、构建缓存优化

在梳理完 模块联邦重构之前。以下是目前现状的进一步优化：

### 8.1 确认Vite缓存已启用

检查 `vite.config.js`：

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  // 确认有这一行（Vite默认启用）
  cacheDir: 'node_modules/.vite',
  
  build: {
    // 生产环境禁用sourcemap（重要！）
    sourcemap: false,
    
    // 使用esbuild压缩（比terser快）
    minify: 'esbuild',
    
    // 手动分包（提升缓存效率）但是纠结的点是，分包太多构建快了，但是启动加载会变慢
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],  
          'utils': ['lodash-es', 'axios', 'dayjs']
        }
      }
    }
  }
})
```

### 8.2 补充.npmrc配置

项目根目录的 `.npmrc`：

```ini
# 使用淘宝镜像
registry=https://registry.npmmirror.com

# 严格模式
strict-peer-dependencies=false
lockfile=true
```

### 8.3 清理缓存的时机

**必须清理的场景**：
1. 大版本发布（v1.x → v2.x）
2. 升级核心依赖（Vite、Vue等）
3. 构建产物异常

**清理命令**：
```bash
rm -rf node_modules/.vite
```

**日常开发**：不要清理，让缓存自动工作。

### 8.4 优化效果 （预测）

| 场景 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 首次构建 | 8-10分钟 | 8-10分钟 | - |
| 二次构建 | 8-10分钟 | 3-5分钟 | **50-60%** |
| 依赖未变 | 8-10分钟 | 6-7分钟 | 30% |

---

## 九、快速操作（免干扰步骤）

### UAT发布

```bash
# 1. 创建镜像
git checkout uat && git pull
git checkout -b mirror-uat/项目名-日期

# 2. 合并
git merge origin/business/项目名

# 3. 验证
pnpm install
pnpm run dev          # 测试
pnpm run build:uat    # 构建
pnpm run preview      # 预览

# 4. 推送
git checkout uat && git pull
git merge mirror-uat/项目名-日期
git push origin uat
git branch -d mirror-uat/项目名-日期

# 5. Jenkins构建uat
```

### 生产发布（耐心细致一些。。。）

```bash
# 1. 创建镜像
git checkout master && git pull
git checkout -b mirror-prod/项目名-v版本号

# 2. 合并
git merge origin/business/项目名

# 3. 完整验证（关键！）
rm -rf node_modules && pnpm install
pnpm run dev           # 完整测试
pnpm run build:prod    # 生产构建
pnpm run preview       # 预览
find dist -name "*.map"  # 确认无.map

# 4. 提交MR
git push origin mirror-prod/项目名-v版本号
# GitLab提交MR

# 5. 审批通过后合并，删除镜像分支

# 6. Jenkins构建master

# 7. 立即验证生产
```

### 紧急回滚（< 5分钟）

```bash
# 回滚到上一版本
git checkout master
git reset --hard v上一版本
git push origin master --force

# Jenkins重新构建master
```

---

## 十、检查清单（建议严格执行）

### UAT发布清单

```
【镜像分支创建】
□ 创建 mirror-uat/项目名-日期
□ 合并业务分支
□ 解决冲突（如有）

【本地开发模式验证】（最重要！）
□ pnpm install 安装成功
□ pnpm run dev 启动无报错
□ 测试改动功能（每个细节）
□ 测试相关功能（可能受影响的）
□ 测试核心业务流程
□ 测试各种边界情况
□ 测试多个浏览器（Chrome + Microsoft Edge）
□ 检查控制台：无红色错误，无异常警告
□ 检查Network：所有请求成功，无404/500

【本地构建验证】（关键！）
□ pnpm run build:uat 构建成功
□ 构建过程无错误、无警告
□ 构建时间正常（对比之前）
□ pnpm run preview 预览成功
□ 在预览环境再次完整测试所有功能
□ 刷新页面多次，路由正常
□ 清除缓存后再测试一遍
□ 检查控制台，无任何错误

【合并和构建】
□ 合并到uat（或提交MR）
□ 删除镜像分支
□ Jenkins构建uat

【UAT测试】（必须通过）
□ QA完整测试（项目中如有测试人员）
□ 测试反馈或报告通过
□ 无遗留问题
```

### 生产发布清单（100%执行）

```
【前提条件】（必须满足）
□ UAT测试100%通过
□ 无任何遗留问题
□ 已准备回滚预案

【镜像分支创建】
□ 创建 mirror-prod/项目名-v版本号
□ 合并业务分支
□ 仔细解决冲突（如有）

【本地完整验证】（极其重要！每项必做！）
□ 删除node_modules，重新安装依赖
□ pnpm install 安装成功，无警告

【开发模式完整测试】
□ pnpm run dev 启动无报错
□ 测试所有改动功能（尽量细致点，毕竟要上到生产提供客户使用的东西，需严谨）
□ 测试相关联的功能
□ 测试核心业务流程
□ 测试各种边界情况
□ 测试多个浏览器
□ 检查控制台：
  - Console：绝对无红色错误
  - Console：无异常的黄色警告
  - Network：所有请求成功
  - Performance：页面加载时间正常
□ 让其他同事也测试（不熟悉功能的人更容易发现问题）

【生产构建验证】
□ pnpm run build:prod 构建成功
□ 构建过程：无任何错误
□ 构建过程：无任何警告（如有，必须弄清楚）
□ 构建时间正常（对比之前）
□ 检查构建产物：
  - ls -lh dist/ 查看文件
  - find dist -name "*.map" 确认无.map文件
  - 文件大小合理（对比之前）
  - 关键文件都存在

【生产预览完整测试】
□ pnpm run preview 预览成功
□ 在预览环境完整测试所有功能（不要只看首页！）
□ 刷新页面多次，路由正常
□ 清除浏览器缓存，重新访问
□ 检查控制台，绝对无错误
□ 测试资源加载（图片、字体、图标等）
□ 测试API请求（地址正确，请求成功）
□ 对比旧版本，确认新版本无问题

【代码审查】（技术负责人）
□ 代码质量OK，无明显bug
□ 无console.log等调试代码
□ 无注释掉的代码
□ 构建配置正确

【发布前最终确认】
□ 本地验证：100%通过（看上面的清单）
□ UAT测试：100%通过
□ 代码审查：100%通过
□ 回滚预案：已准备（知道如何回滚）
□ 发布时间：合适（避开业务高峰）

【提交和审批】
□ 推送镜像分支
□ 提交MR（填写完整信息）
□ 等待审批通过
□ 合并到master
□ 删除镜像分支

【构建和验证】
□ Jenkins构建master
□ 构建成功后，技术负责人立即验证生产：
  - 访问生产URL（隐身窗口）
  - 页面正常，无白屏
  - 快速测试核心功能
  - 检查控制台，无错误
  
【如果以上任何一项不通过，绝对不能发布！】
```

### 重点提醒

::: danger 必须严格执行
这些检查清单不是走过场，是防止生产事故的**最后防线**！

**每一项都必须认真检查，不能跳过任何一项！**

**如果某一项不通过，必须修复后重新验证所有项！**

**宁可晚发布，也不能带着问题发布！**
:::

---

```

### 必须注意！

1. **永远使用镜像分支** - UAT和生产都必须，这是安全沙箱
2. **本地验证要完整** - dev + build + preview
3. **生产发布要MR** - 至少技术负责人审批
4. **发布后立即验证** - 按上面清单步骤检查
5. **准备回滚预案** - 知道如何快速回滚