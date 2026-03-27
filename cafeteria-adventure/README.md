# 食堂大冒险 (Cafeteria Adventure)

<div align="center">

一个帮助选择困难症患者解决"今天吃什么"问题的趣味性 Web 应用。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF)](https://vitejs.dev/)

[在线体验](#) · [快速开始](#快速开始) · [功能特性](#功能特性) · [贡献指南](#贡献指南)

</div>

---

## 项目简介

"食堂大冒险"是一款基于转盘的随机食物选择应用，专为在校大学生和上班族设计。通过有趣的转盘动画，让选择今天吃什么变得简单而有趣。

### 核心特点

- 🎡 **转盘抽奖**: 流畅的转盘动画，随机抽取食物
- 📱 **移动优先**: 完美适配手机端，支持 PWA 离线使用
- 🍜 **自定义食物**: 自由添加、编辑、删除食物选项
- 📊 **历史记录**: 查看过去的抽取记录
- 🚀 **一键部署**: 支持多种静态托管平台

---

## 快速开始

### 在线体验

扫描二维码或在手机浏览器打开：

```
https://your-username.github.io/cafeteria-adventure/
```

### 本地开发

```bash
# 克隆项目
git clone https://github.com/yourusername/cafeteria-adventure.git
cd cafeteria-adventure

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开浏览器访问
# http://localhost:5173
```

### 添加到主屏幕

1. 在 Safari (iOS) 或 Chrome (Android) 中打开应用
2. 点击"分享"按钮
3. 选择"添加到主屏幕"
4. 像原生应用一样使用！

---

## 功能特性

### 🎡 转盘抽奖

- 随机抽取食物，无需纠结
- 流畅的旋转动画，模拟真实物理效果
- 即时反馈，结果清晰展示

### 🍱 自定义管理

- 预设常见食物选项
- 自定义添加喜欢的食物
- 支持表情符号，更生动
- 自定义颜色，个性化设置

### 📊 历史记录

- 记录每次抽取结果
- 按时间倒序展示
- 统计分析（v2.0）
- 一键清空

### 📱 PWA 支持

- 离线可用
- 添加到主屏幕
- 快速启动
- 原生应用体验

---

## 技术栈

| 技术 | 说明 |
|------|------|
| **React 18** | 用户界面库 |
| **TypeScript** | 类型安全的 JavaScript |
| **Vite** | 下一代前端构建工具 |
| **Canvas API** | 高性能 2D 渲染 |
| **PWA** | 渐进式 Web 应用 |
| **LocalStorage** | 本地数据持久化 |

---

## 项目结构

```
cafeteria-adventure/
├── public/              # 静态资源
├── src/
│   ├── components/      # 组件
│   ├── hooks/          # 自定义 Hooks
│   ├── utils/          # 工具函数
│   ├── types/          # TypeScript 类型
│   └── App.tsx         # 主应用
├── docs/               # 项目文档
│   ├── PRD.md          # 产品需求文档
│   ├── TECHNICAL.md    # 技术方案文档
│   ├── DATA.md         # 数据结构设计
│   ├── API.md          # API 文档
│   ├── TESTING.md      # 测试计划
│   └── UI.md           # UI 设计规范
├── DEVELOPMENT.md      # 开发手册
└── README.md           # 项目说明
```

---

## 文档

- [产品需求文档 (PRD)](docs/PRD.md)
- [技术方案文档](docs/TECHNICAL.md)
- [数据结构设计](docs/DATA.md)
- [API 文档](docs/API.md)
- [测试计划](docs/TESTING.md)
- [UI 设计规范](docs/UI.md)
- [开发手册](DEVELOPMENT.md)

---

## 开发指南

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 可用命令

```bash
# 开发
npm run dev          # 启动开发服务器

# 构建
npm run build        # 生产构建
npm run preview      # 预览构建结果

# 代码质量
npm run lint         # 代码检查
npm run format       # 代码格式化

# 测试
npm run test         # 运行单元测试
npm run test:e2e     # 运行 E2E 测试
npm run test:coverage # 生成覆盖率报告
```

### 开发规范

- 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 提交规范
- 使用 ESLint + Prettier 进行代码格式化
- 编写测试，保持覆盖率 ≥ 80%

---

## 部署

### GitHub Pages

1. Fork 本仓库
2. 在 Settings → Pages 中启用
3. 选择 GitHub Actions 作为部署源
4. 推送代码自动部署

### Netlify

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 部署
npm run build
netlify deploy --prod --dir=dist
```

### Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
npm run build
vercel --prod
```

---

## 路线图

### v1.0 (当前版本)

- [x] 转盘抽奖功能
- [x] 自定义食物管理
- [x] 历史记录
- [x] PWA 支持
- [x] 移动端适配

### v1.1 (计划中)

- [ ] 音效开关
- [ ] 粒子特效
- [ ] 分享功能
- [ ] 深色模式

### v2.0 (未来)

- [ ] 多人协作转盘
- [ ] 食物权重设置
- [ ] 附近餐厅推荐
- [ ] 数据云同步

---

## 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 提交 Issue

1. 搜索现有 Issues，避免重复
2. 使用清晰的标题描述问题
3. 提供详细的复现步骤

### 提交 PR

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 常见问题

**Q: 为什么添加到主屏幕后无法打开？**

A: 确保使用 HTTPS 访问，iOS Safari 可能需要手动信任证书。

**Q: 数据会丢失吗？**

A: 所有数据存储在本地，清除浏览器缓存会丢失数据。建议定期导出（v1.1）。

**Q: 可以自定义转盘颜色吗？**

A: 当前版本自动分配颜色，自定义颜色功能将在 v1.1 中提供。

---

## 许可证

本项目采用 [MIT](LICENSE) 许可证。

---

## 致谢

- [Vite](https://vitejs.dev/) - 强大的构建工具
- [React](https://react.dev/) - 优秀的前端框架
- [vite-plugin-pwa](https://github.com/antfu/vite-plugin-pwa) - PWA 支持

---

<div align="center">

Made with ❤️ by [Your Name]

[⬆ 返回顶部](#食堂大冒险-cafeteria-adventure)

</div>
