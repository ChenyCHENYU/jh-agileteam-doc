# Waline 403 错误修复指南

## 问题现象

- 控制台错误：`403 Forbidden`
- 评论无法加载
- 提交评论失败

## 原因分析

Waline 服务器（waline-comment-lilac.vercel.app）配置了安全限制，需要在 Vercel 后台设置环境变量允许你的域名访问。

---

## 解决步骤

### 1. 登录 Vercel 后台

访问：https://vercel.com/dashboard

找到你的 Waline 项目：`waline-comment-lilac`

### 2. 配置环境变量

进入项目 → Settings → Environment Variables

添加以下环境变量：

#### 必需配置：

| 变量名           | 值                                  | 说明                               |
| ---------------- | ----------------------------------- | ---------------------------------- |
| `SITE_URL`       | `https://www.jhat.tech`             | 你的网站域名                       |
| `SECURE_DOMAINS` | `www.jhat.tech,jhat.tech,localhost` | 允许的域名白名单（多个用逗号分隔） |

#### 可选配置：

| 变量名              | 值                      | 说明                 |
| ------------------- | ----------------------- | -------------------- |
| `DISABLE_USERAGENT` | `true`                  | 禁用 User-Agent 检查 |
| `DISABLE_REGION`    | `true`                  | 禁用地域限制         |
| `CORS_ALLOW_ORIGIN` | `https://www.jhat.tech` | CORS 允许的源        |

### 3. 重新部署

配置完成后，在 Vercel 后台点击 **Redeploy** 重新部署项目。

---

## 临时测试方案（仅用于验证）

如果需要快速测试，可以临时禁用安全检查：

在 Vercel 环境变量中添加：

```
DISABLE_USERAGENT=true
DISABLE_REGION=true
```

**⚠️ 警告**：这会降低安全性，仅用于测试，生产环境请使用白名单方式。

---

## 验证配置

配置完成后，访问以下 URL 测试：

```
https://waline-comment-lilac.vercel.app/api/comment?path=/test&pageSize=10&page=1
```

如果返回 JSON 数据（而非 403），说明配置成功。

---

## 常见问题

### Q1: 配置后仍然 403？

- 确保已重新部署项目
- 检查域名拼写是否正确
- 清除浏览器缓存

### Q2: 本地开发如何测试？

在 `SECURE_DOMAINS` 中添加 `localhost,127.0.0.1`

### Q3: 多个域名如何配置？

用逗号分隔，例如：`domain1.com,domain2.com,www.domain1.com`

---

## 完整环境变量示例

```env
# Waline 服务端配置
SITE_URL=https://www.jhat.tech
SECURE_DOMAINS=www.jhat.tech,jhat.tech,localhost,127.0.0.1

# 数据库配置（LeanCloud/CloudBase/等）
LEAN_ID=your_lean_id
LEAN_KEY=your_lean_key
LEAN_MASTER_KEY=your_master_key

# 安全配置
DISABLE_USERAGENT=false
DISABLE_REGION=false

# CORS 配置
CORS_ALLOW_ORIGIN=https://www.jhat.tech
```

---

## 参考文档

- [Waline 服务端配置](https://waline.js.org/reference/server/env.html)
- [Vercel 环境变量文档](https://vercel.com/docs/concepts/projects/environment-variables)
