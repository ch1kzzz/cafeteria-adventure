# 部署指南 - 食堂大冒险

## 文档信息

| 项目 | 内容 |
|------|------|
| 项目名称 | 食堂大冒险 (Cafeteria Adventure) |
| 文档版本 | v1.0.0 |
| 创建日期 | 2026-03-25 |
| 部署类型 | 静态站点 |

---

## 1. 部署概览

"食堂大冒险"是一个纯静态 Web 应用，可部署到任何支持静态托管的服务。

### 支持的部署平台

| 平台 | 免费额度 | 特点 | 推荐度 |
|------|---------|------|--------|
| GitHub Pages | 1GB | 免费、稳定、支持自定义域名 | ⭐⭐⭐⭐⭐ |
| Netlify | 100GB | 快速构建、表单功能、预览环境 | ⭐⭐⭐⭐ |
| Vercel | 100GB | 优秀边缘网络、最佳部署体验 | ⭐⭐⭐⭐⭐ |
| Cloudflare Pages | 无限 | 全球 CDN、无限带宽 | ⭐⭐⭐⭐ |

---

## 2. GitHub Pages 部署

### 2.1 创建仓库

```bash
# 创建新仓库
git init
git add .
git commit -m "chore: initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/cafeteria-adventure.git
git push -u origin main
```

### 2.2 配置 GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 2.3 启用 Pages

1. 进入仓库 Settings → Pages
2. Source 选择 **GitHub Actions**
3. 等待部署完成

### 2.4 访问应用

```
https://yourusername.github.io/cafeteria-adventure/
```

### 2.5 自定义域名（可选）

1. 在仓库根目录创建 `CNAME` 文件：
   ```
   app.yourdomain.com
   ```

2. 在域名 DNS 设置中添加 CNAME 记录：
   ```
   app.yourdomain.com → yourusername.github.io
   ```

---

## 3. Netlify 部署

### 3.1 通过 Netlify CLI 部署

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 初始化
netlify init

# 部署
npm run build
netlify deploy --prod --dir=dist
```

### 3.2 通过 Git 集成部署

1. 在 [Netlify](https://netlify.com) 中创建新站点
2. 导入 GitHub 仓库
3. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 部署

### 3.3 配置重定向（PWA）

创建 `public/_redirects`：

```
/*    /index.html   200
```

---

## 4. Vercel 部署

### 4.1 通过 Vercel CLI 部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
npm run build
vercel --prod
```

### 4.2 通过 Vercel Dashboard

1. 在 [Vercel](https://vercel.com) 中创建新项目
2. 导入 GitHub 仓库
3. 自动检测 Vite 配置，直接部署

### 4.3 配置环境变量（可选）

在 Vercel Dashboard 中设置：

```env
VITE_APP_TITLE=食堂大冒险
VITE_APP_VERSION=1.0.0
```

---

## 5. Cloudflare Pages 部署

### 5.1 通过 Git 集成

1. 在 [Cloudflare Pages](https://pages.cloudflare.com) 创建新项目
2. 连接 GitHub 仓库
3. 配置构建设置：
   - Build command: `npm run build`
   - Build output directory: `dist`
4. 部署

### 5.2 配置 _headers

创建 `public/_headers`：

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
```

---

## 6. 配置说明

### 6.1 Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/cafeteria-adventure/',  // GitHub Pages 子路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});
```

### 6.2 PWA Manifest

```json
{
  "name": "食堂大冒险",
  "short_name": "食堂大冒险",
  "description": "今天吃什么？转盘来决定！",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F7F7F7",
  "theme_color": "#FF6B6B",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 7. 域名配置

### 7.1 购买域名

推荐域名注册商：
- [Namecheap](https://www.namecheap.com)
- [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)
- [阿里云](https://wanwang.aliyun.com)

### 7.2 DNS 配置

| 平台 | 类型 | 名称 | 值 |
|------|------|------|-----|
| GitHub Pages | CNAME | app | yourusername.github.io |
| Netlify | CNAME | app | your-site.netlify.app |
| Vercel | CNAME | app | cname.vercel-dns.com |

### 7.3 HTTPS 证书

所有推荐平台均提供免费 HTTPS 证书，自动配置。

---

## 8. 性能优化

### 8.1 启用压缩

```nginx
# nginx 配置
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    gzip on;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

### 8.2 CDN 配置

大多数平台自带 CDN，无需额外配置。

### 8.3 缓存策略

```typescript
// vite.config.ts - Service Worker 配置
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    })
  ]
});
```

---

## 9. 监控与分析

### 9.1 Google Analytics

```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 9.2 Sentry 错误追踪

```typescript
// main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'your-dsn-here',
  integrations: [new Sentry.BrowserTracing()],
});
```

---

## 10. 故障排查

### 10.1 部署失败

**问题**: 构建失败

**解决**:
```bash
# 本地测试构建
npm run build

# 检查错误日志
# 在平台部署日志中查看详细错误
```

### 10.2 PWA 无法安装

**问题**: 浏览器不显示安装提示

**解决**:
- 检查 manifest.json 是否正确
- 确保使用 HTTPS
- 验证 Service Worker 是否注册成功

### 10.3 离线不可用

**问题**: 离线后无法访问

**解决**:
- 检查 Service Worker 缓存策略
- 确保所有资源被正确缓存
- 在开发者工具 → Application → Service Workers 中检查状态

---

## 11. 更新与维护

### 11.1 自动部署

配置 GitHub Actions 或平台提供的自动部署，每次 push 到 main 分支自动构建部署。

### 11.2 版本管理

```bash
# 更新版本号
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# 推送标签
git push origin main --tags
```

### 11.3 回滚

大多数平台支持一键回滚到之前的版本。

---

## 文档变更历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| v1.0.0 | 2026-03-25 | - | 初始版本 |

