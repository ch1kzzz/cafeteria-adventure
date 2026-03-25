# 技术方案 - 食堂大冒险

## 文档信息

| 项目 | 内容 |
|------|------|
| 项目名称 | 食堂大冒险 (Cafeteria Adventure) |
| 文档版本 | v1.0.0 |
| 创建日期 | 2026-03-25 |
| 文档状态 | 技术设计 |

---

## 1. 技术选型

### 1.1 前端框架

**选择: React 18 + TypeScript**

| 选型 | 理由 |
|------|------|
| React | 成熟的组件化方案，虚拟 DOM 提升性能 |
| TypeScript | 类型安全，减少运行时错误，提升开发体验 |
| Vite | 极速开发体验，优化的生产构建，内置 HMR |

### 1.2 UI 渲染

**选择: Canvas API**

| 方案 | 优势 | 劣势 | 选择 |
|------|------|------|------|
| Canvas API | 高性能 2D 渲染，适合动画密集场景 | 不支持无障碍访问 | ✅ 选择 |
| SVG DOM | 支持 CSS 动画，易于调试 | 大量 DOM 元素影响性能 | ❌ |
| CSS + DOM | 简单易用 | 难以实现复杂的转盘效果 | ❌ |

### 1.3 状态管理

**选择: React Hooks (useState + useContext)**

对于小型应用，内置 Hooks 已足够，无需引入 Redux/MobX 等重量级方案。

### 1.4 数据持久化

**选择: LocalStorage**

| 特性 | 说明 |
|------|------|
| 容量 | 5MB (足够满足需求) |
| API | 简单同步 API |
| 兼容性 | 所有现代浏览器 |
| 缺点 | 仅限本地，无法跨设备同步 |

### 1.5 PWA 支持

**选择: vite-plugin-pwa**

- 自动生成 Service Worker
- 离线缓存策略
- 自动更新检测
- 支持添加到主屏幕

### 1.6 部署方案

**选择: GitHub Pages (主选) / Netlify (备选)**

| 平台 | 优势 | 劣势 |
|------|------|------|
| GitHub Pages | 免费、稳定、支持自定义域名 | 部署较慢 |
| Netlify | 快速构建、表单功能、预览环境 | 免费版有限制 |
| Vercel | 优秀边缘网络、最佳部署体验 | 免费版有限制 |

---

## 2. 系统架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────┐
│                    用户界面层                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ 转盘页面 │  │ 编辑页面 │  │ 历史页面 │          │
│  └──────────┘  └──────────┘  └──────────┘          │
├─────────────────────────────────────────────────────┤
│                    组件层                            │
│  ┌──────────────┐  ┌──────────────┐                │
│  │WheelOfFortune│  │  FoodEditor  │                │
│  │   (Canvas)   │  │HistoryList   │                │
│  └──────────────┘  └──────────────┘                │
├─────────────────────────────────────────────────────┤
│                   业务逻辑层                         │
│  ┌──────────────┐  ┌──────────────┐                │
│  │useWheelSpin  │  │useFoodOptions│                │
│  │  (动画逻辑)  │  │(数据管理)    │                │
│  └──────────────┘  └──────────────┘                │
├─────────────────────────────────────────────────────┤
│                   数据访问层                         │
│  ┌──────────────────────────────────────┐           │
│  │         StorageService               │           │
│  │    (LocalStorage 封装)               │           │
│  └──────────────────────────────────────┘           │
├─────────────────────────────────────────────────────┤
│                   浏览器存储                         │
│              LocalStorage (5MB)                     │
└─────────────────────────────────────────────────────┘
```

### 2.2 目录结构

```
cafeteria-adventure/
├── public/                      # 静态资源
│   ├── manifest.json           # PWA manifest
│   ├── icons/                  # 应用图标
│   │   ├── 192x192.png
│   │   ├── 512x512.png
│   │   └── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/             # 组件
│   │   ├── WheelOfFortune.tsx  # 转盘组件 (Canvas)
│   │   ├── FoodEditor.tsx      # 食物编辑器
│   │   ├── HistoryList.tsx     # 历史记录
│   │   ├── ResultModal.tsx     # 结果弹窗
│   │   └── Layout.tsx          # 布局组件
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useFoodOptions.ts   # 食物选项管理
│   │   ├── useHistory.ts       # 历史记录管理
│   │   └── useWheelSpin.ts     # 转盘旋转逻辑
│   ├── utils/                  # 工具函数
│   │   ├── storage.ts          # LocalStorage 封装
│   │   ├── animation.ts        # 动画工具函数
│   │   ├── colors.ts           # 颜色生成器
│   │   └── constants.ts        # 常量配置
│   ├── types/                  # TypeScript 类型
│   │   └── index.ts            # 类型定义
│   ├── App.tsx                 # 主应用组件
│   ├── main.tsx                # 应用入口
│   └── index.css               # 全局样式
├── tests/                      # 测试文件
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                       # 项目文档
│   ├── PRD.md
│   ├── TECHNICAL.md
│   ├── API.md
│   ├── DATA.md
│   └── TESTING.md
├── .github/workflows/          # CI/CD
│   └── deploy.yml
├── vite.config.ts
├── tsconfig.json
├── package.json
├── README.md
└── LICENSE
```

---

## 3. 核心模块设计

### 3.1 转盘组件 (WheelOfFortune)

**职责**: 使用 Canvas 绘制转盘并处理旋转动画

**关键属性**:
```typescript
interface WheelOfFortuneProps {
  options: FoodOption[];      // 食物选项列表
  size: number;               // 转盘尺寸
  onSpinEnd: (result: FoodOption) => void;  // 旋转结束回调
  disabled?: boolean;         // 是否禁用
}
```

**实现要点**:
1. 使用 `requestAnimationFrame` 实现流畅动画
2. 处理高 DPI 屏幕 (`devicePixelRatio`)
3. 支持触摸和鼠标事件
4. 使用缓动函数实现真实物理效果

**缓动公式**:
```typescript
// ease-out-cubic
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
```

### 3.2 数据管理 Hooks

**useFoodOptions**:
```typescript
interface UseFoodOptionsReturn {
  options: FoodOption[];
  addOption: (name: string, emoji?: string) => void;
  removeOption: (id: string) => void;
  updateOption: (id: string, data: Partial<FoodOption>) => void;
  reorderOptions: (fromIndex: number, toIndex: number) => void;
  resetToDefaults: () => void;
}
```

**useHistory**:
```typescript
interface UseHistoryReturn {
  history: HistoryRecord[];
  addRecord: (food: FoodOption) => void;
  clearHistory: () => void;
  deleteRecord: (id: string) => void;
  getStatistics: () => Statistics;
}
```

### 3.3 存储服务

**StorageService**:
```typescript
class StorageService {
  private static readonly KEYS = {
    FOOD_OPTIONS: 'cafeteria_food_options',
    HISTORY: 'cafeteria_history',
    SETTINGS: 'cafeteria_settings',
  };

  static get<T>(key: string): T | null;
  static set<T>(key: string, value: T): void;
  static remove(key: string): void;
  static clear(): void;
}
```

---

## 4. 性能优化

### 4.1 渲染优化

| 策略 | 说明 | 效果 |
|------|------|------|
| React.memo | 避免不必要的组件重渲染 | 减少 CPU 消耗 |
| useCallback | 稳定函数引用 | 配合 memo 使用 |
| Canvas 离屏渲染 | 预渲染转盘背景 | 减少 draw 调用 |
| 防抖/节流 | 限制事件处理频率 | 减少重绘 |

### 4.2 资源优化

| 策略 | 说明 | 效果 |
|------|------|------|
| 代码分割 | 路由级别懒加载 | 减少初始加载体积 |
| Tree Shaking | 移除未使用代码 | 减少包体积 |
| 图片优化 | 使用 WebP 格式 | 减少图片体积 |
| Gzip 压缩 | 服务器启用压缩 | 减少传输体积 |

### 4.3 PWA 缓存策略

```
┌─────────────────────────────────────────┐
│           Service Worker                │
├─────────────────────────────────────────┤
│  Cache First (静态资源)                  │
│  - HTML, CSS, JS                        │
│  - 图片、图标                            │
├─────────────────────────────────────────┤
│  Network First (API 请求)               │
│  - 未来扩展: 数据 API                   │
├─────────────────────────────────────────┤
│  Network Only (动态资源)                │
│  - 第三方脚本                           │
└─────────────────────────────────────────┘
```

---

## 5. 安全考虑

### 5.1 XSS 防护

- 使用 React 的自动转义机制
- 避免使用 `dangerouslySetInnerHTML`
- 用户输入仅用于显示，不作为 HTML 解析

### 5.2 数据验证

- 输入长度限制（食物名称最多 20 字符）
- 类型检查（TypeScript 编译时）
- 运行时类型验证（zod 或 yup）

### 5.3 隐私保护

- 无用户数据上传
- 所有数据本地存储
- 无第三方追踪

---

## 6. 兼容性处理

### 6.1 浏览器兼容

```typescript
// 特性检测
const supportsCanvas = () => {
  const canvas = document.createElement('canvas');
  return !!(canvas.getContext && canvas.getContext('2d'));
};

const supportsLocalStorage = () => {
  try {
    return 'localStorage' in window && window.localStorage !== null;
  } catch (e) {
    return false;
  }
};
```

### 6.2 响应式设计

```css
/* 移动优先策略 */
.wheel-container {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
}

@media (min-width: 768px) {
  .wheel-container {
    max-width: 500px;
  }
}
```

### 6.3 触摸优化

```typescript
// 统一触摸和鼠标事件
const isTouchEvent = (event: Event): event is TouchEvent => {
  return 'touches' in event;
};

const getEventCoordinates = (event: Event) => {
  if (isTouchEvent(event)) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }
  return { x: (event as MouseEvent).clientX, y: (event as MouseEvent).clientY };
};
```

---

## 7. 错误处理

### 7.1 全局错误边界

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  // 捕获组件树中的错误
  // 显示友好的错误页面
}
```

### 7.2 优雅降级

```typescript
// Canvas 不支持时的降级方案
if (!supportsCanvas()) {
  return <FallbackWheel options={options} />; // 使用 DOM 实现
}

// LocalStorage 不支持时的降级方案
if (!supportsLocalStorage()) {
  return <SessionOnlyApp />; // 仅使用 sessionStorage
}
```

---

## 8. 开发规范

### 8.1 代码风格

- 使用 ESLint + Prettier 统一代码风格
- 遵循 Airbnb JavaScript Style Guide
- 组件命名: PascalCase
- 函数命名: camelCase
- 常量命名: UPPER_SNAKE_CASE

### 8.2 Git 提交规范

```
<type>: <description>

类型: feat, fix, docs, style, refactor, test, chore

示例:
feat: 添加转盘旋转动画
fix: 修复历史记录时区问题
docs: 更新部署文档
test: 添加转盘组件单元测试
```

### 8.3 分支策略

```
main        → 生产环境
develop     → 开发环境
feature/*   → 功能分支
hotfix/*    → 紧急修复
```

---

## 9. 部署架构

### 9.1 CI/CD 流程

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   Push   │ ──→ │  Lint    │ ──→ │  Test    │ ──→ │  Build   │
│   Code   │     │  Check   │     │  Run     │     │  Bundle  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                           │
                                                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Deploy to GitHub Pages                   │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 环境配置

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - checkout
      - setup Node.js
      - install dependencies
      - run tests
      - build
      - deploy to GitHub Pages
```

---

## 10. 监控与日志

### 10.1 前端监控（可选）

- **Sentry**: 错误追踪
- **Google Analytics**: 用户行为分析
- **Lighthouse CI**: 性能监控

### 10.2 日志记录

```typescript
// 简单的日志工具
class Logger {
  static info(message: string, data?: unknown) {
    console.log(`[INFO] ${message}`, data);
  }

  static error(message: string, error?: Error) {
    console.error(`[ERROR] ${message}`, error);
    // 可选: 发送到远程日志服务
  }

  static event(name: string, properties?: Record<string, unknown>) {
    console.log(`[EVENT] ${name}`, properties);
    // 可选: 发送到分析平台
  }
}
```

---

## 文档变更历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| v1.0.0 | 2026-03-25 | - | 初始版本 |

