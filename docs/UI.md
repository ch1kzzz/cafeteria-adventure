# UI 设计规范 - 食堂大冒险

## 文档信息

| 项目 | 内容 |
|------|------|
| 项目名称 | 食堂大冒险 (Cafeteria Adventure) |
| 文档版本 | v1.0.0 |
| 创建日期 | 2026-03-25 |
| 设计原则 | 移动优先、趣味性、易用性 |

---

## 1. 设计理念

### 1.1 核心价值

- **趣味性**: 转盘动画和即时反馈带来愉悦感
- **简洁性**: 一目了然的操作流程
- **高效性**: 最少步骤完成目标
- **包容性**: 适配各种设备和使用场景

### 1.2 设计原则

1. **移动优先**: 主要使用场景在手机端
2. **触摸友好**: 所有交互元素适合手指操作
3. **即时反馈**: 每个操作都有清晰的视觉反馈
4. **视觉层次**: 重要信息突出显示

---

## 2. 色彩系统

### 2.1 主色板

| 颜色名称 | 用途 | HEX | RGB | CSS 变量 |
|---------|------|-----|-----|----------|
| 主色 | 主要按钮、强调元素 | #FF6B6B | 255, 107, 107 | `--color-primary` |
| 辅色 | 次要按钮、标签 | #4ECDC4 | 78, 205, 196 | `--color-secondary` |
| 背景色 | 页面背景 | #F7F7F7 | 247, 247, 247 | `--color-bg` |
| 卡片色 | 卡片背景 | #FFFFFF | 255, 255, 255 | `--color-card` |

### 2.2 文字色

| 颜色名称 | 用途 | HEX | 对比度 |
|---------|------|-----|--------|
| 主要文字 | 标题、正文 | #2D3436 | 13.6:1 (AAA) |
| 次要文字 | 辅助说明 | #636E72 | 7.2:1 (AA) |
| 禁用文字 | 禁用状态 | #B2BEC3 | 4.1:1 (AA) |
| 反色文字 | 深色背景上的文字 | #FFFFFF | - |

### 2.3 功能色

| 颜色名称 | 用途 | HEX |
|---------|------|-----|
| 成功色 | 成功提示 | #2ECC71 |
| 警告色 | 警告提示 | #F1C40F |
| 危险色 | 删除、错误 | #E74C3C |
| 信息色 | 信息提示 | #3498DB |

### 2.4 转盘色板

```css
--wheel-color-1: #FF6B6B;
--wheel-color-2: #4ECDC4;
--wheel-color-3: #45B7D1;
--wheel-color-4: #FFA07A;
--wheel-color-5: #FFD93D;
--wheel-color-6: #6BCB77;
--wheel-color-7: #4D96FF;
--wheel-color-8: #FF6F91;
--wheel-color-9: #845EC2;
--wheel-color-10: #FF9671;
```

---

## 3. 字体系统

### 3.1 字体家族

```css
--font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
                     'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
                     'Helvetica Neue', sans-serif;
--font-family-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono',
                     'Droid Sans Mono', 'Source Code Pro', monospace;
```

### 3.2 字体大小

| 级别 | 大小 | 用途 | 行高 |
|------|------|------|------|
| h1 | 28px | 页面标题 | 1.2 |
| h2 | 24px | 区块标题 | 1.3 |
| h3 | 20px | 小标题 | 1.4 |
| body | 16px | 正文 | 1.5 |
| small | 14px | 辅助文字 | 1.4 |
| tiny | 12px | 提示文字 | 1.4 |

### 3.3 字重

| 级别 | 数值 | 用途 |
|------|------|------|
| regular | 400 | 正文 |
| medium | 500 | 强调 |
| semibold | 600 | 标题 |

---

## 4. 间距系统

### 4.1 间距单位

使用 4px 基础单位的倍数：

```css
--spacing-xs: 4px;    /* 0.25rem */
--spacing-sm: 8px;    /* 0.5rem */
--spacing-md: 16px;   /* 1rem */
--spacing-lg: 24px;   /* 1.5rem */
--spacing-xl: 32px;   /* 2rem */
--spacing-2xl: 48px;  /* 3rem */
```

### 4.2 间距使用指南

| 场景 | 间距 |
|------|------|
| 组件内部 | sm / md |
| 组件之间 | md / lg |
| 区块之间 | lg / xl |
| 页面边距 | md |

---

## 5. 组件规范

### 5.1 按钮

#### 主要按钮

```css
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  min-height: 48px;  /* 触摸友好 */
  min-width: 120px;
}

.btn-primary:active {
  transform: scale(0.95);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

#### 次要按钮

```css
.btn-secondary {
  background: var(--color-secondary);
  color: white;
  /* 其他同上 */
}
```

#### 文字按钮

```css
.btn-text {
  background: transparent;
  color: var(--color-primary);
  padding: 8px 16px;
}
```

### 5.2 卡片

```css
.card {
  background: var(--color-card);
  border-radius: 16px;
  padding: var(--spacing-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-interactive {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card-interactive:active {
  transform: scale(0.98);
}
```

### 5.3 输入框

```css
.input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 16px;  /* 防止 iOS 自动缩放 */
  min-height: 48px;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.input::placeholder {
  color: #B2BEC3;
}
```

### 5.4 弹窗

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 24px;
  padding: var(--spacing-xl);
  max-width: 400px;
  width: 100%;
  animation: modal-in 0.3s ease-out;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### 5.5 转盘

```css
.wheel-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
  margin: 0 auto;
}

.wheel-canvas {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.15));
}

.wheel-pointer {
  position: absolute;
  top: 50%;
  right: -16px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 24px solid transparent;
  border-bottom: 24px solid transparent;
  border-right: 32px solid var(--color-primary);
}
```

---

## 6. 布局规范

### 6.1 断点

```css
--breakpoint-sm: 375px;   /* 小手机 */
--breakpoint-md: 428px;   /* 大手机 */
--breakpoint-lg: 768px;   /* 平板 */
--breakpoint-xl: 1024px;  /* 桌面 */
```

### 6.2 页面结构

```css
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

.page-header {
  padding: var(--spacing-md);
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.page-content {
  flex: 1;
  padding: var(--spacing-md);
  overflow-y: auto;
}

.page-footer {
  padding: var(--spacing-md);
  background: white;
  border-top: 1px solid #E0E0E0;
}
```

### 6.3 导航栏

```css
.nav-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  background: white;
  border-top: 1px solid #E0E0E0;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  color: var(--color-secondary);
  font-size: 12px;
}

.nav-item.active {
  color: var(--color-primary);
}
```

---

## 7. 动画规范

### 7.1 缓动函数

```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### 7.2 动画时长

| 类型 | 时长 |
|------|------|
| 快速反馈 | 150ms |
| 标准过渡 | 300ms |
| 页面切换 | 200ms |
| 转盘旋转 | 3000ms |

### 7.3 转盘动画

```css
@keyframes wheel-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(calc(360deg * var(--spins) + var(--target-angle)));
  }
}

.wheel-spinning {
  animation: wheel-spin var(--duration) var(--ease-out);
}
```

---

## 8. 图标系统

### 8.1 图标尺寸

| 尺寸 | 用途 | 大小 |
|------|------|------|
| xs | 小图标 | 16px |
| sm | 默认图标 | 20px |
| md | 中等图标 | 24px |
| lg | 大图标 | 32px |
| xl | 特大图标 | 48px |

### 8.2 图标使用

推荐使用内联 SVG 或图标字体：

```html
<!-- 内联 SVG -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <path d="..." />
</svg>
```

---

## 9. 可访问性

### 9.1 触摸目标

所有可交互元素最小尺寸为 44x44px（Apple HIG 标准）。

### 9.2 颜色对比度

所有文字与背景的对比度至少达到 WCAG AA 标准（4.5:1）。

### 9.3 焦点状态

```css
.focusable:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### 9.4 屏幕阅读器

```html
<!-- 添加 ARIA 标签 -->
<button aria-label="开始转盘">
  <span class="sr-only">开始</span>
</button>

<div role="img" aria-label="转盘">
  <canvas />
</div>
```

---

## 10. 响应式设计

### 10.1 移动优先

```css
/* 默认: 移动端 */
.wheel-container {
  max-width: 350px;
}

/* 平板及以上 */
@media (min-width: 768px) {
  .wheel-container {
    max-width: 450px;
  }
}
```

### 10.2 安全区域

```css
.page {
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));
  padding-top: max(16px, env(safe-area-inset-top));
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}
```

---

## 11. 暗色模式（v2.0）

### 11.1 颜色映射

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1A1A1A;
    --color-card: #2D2D2D;
    --color-text: #FFFFFF;
    --color-text-secondary: #B2BEC3;
  }
}
```

---

## 12. 设计资产

### 12.1 图标

- app-icon-192x192.png
- app-icon-512x512.png
- favicon.ico

### 12.2 Logo

- logo-horizontal.svg (水平版)
- logo-vertical.svg (垂直版)

---

## 文档变更历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| v1.0.0 | 2026-03-25 | - | 初始版本 |

