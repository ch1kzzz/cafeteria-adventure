# 开发手册 - 食堂大冒险

## 文档信息

| 项目 | 内容 |
|------|------|
| 项目名称 | 食堂大冒险 (Cafeteria Adventure) |
| 文档版本 | v1.0.0 |
| 创建日期 | 2026-03-25 |
| 文档用途 | 开发指南 |

---

## 1. 快速开始

### 1.1 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git >= 2.30.0

### 1.2 安装依赖

```bash
# 克隆项目
git clone https://github.com/yourusername/cafeteria-adventure.git
cd cafeteria-adventure

# 安装依赖
npm install
```

### 1.3 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看应用。

### 1.4 构建生产版本

```bash
npm run build
```

构建产物位于 `dist/` 目录。

---

## 2. 项目结构

```
cafeteria-adventure/
├── public/                      # 静态资源
│   ├── manifest.json           # PWA manifest
│   └── icons/                  # 应用图标
├── src/
│   ├── components/             # 组件
│   │   ├── WheelOfFortune.tsx  # 转盘组件
│   │   ├── FoodEditor.tsx      # 食物编辑器
│   │   ├── HistoryList.tsx     # 历史记录
│   │   └── Layout.tsx          # 布局组件
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useFoodOptions.ts   # 食物选项管理
│   │   ├── useHistory.ts       # 历史记录管理
│   │   └── useWheelSpin.ts     # 转盘旋转逻辑
│   ├── utils/                  # 工具函数
│   │   ├── storage.ts          # LocalStorage 封装
│   │   ├── animation.ts        # 动画工具
│   │   └── constants.ts        # 常量配置
│   ├── types/                  # TypeScript 类型
│   │   └── index.ts            # 类型定义
│   ├── App.tsx                 # 主应用组件
│   ├── main.tsx                # 应用入口
│   └── index.css               # 全局样式
├── docs/                       # 项目文档
│   ├── PRD.md                  # 产品需求文档
│   ├── TECHNICAL.md            # 技术方案文档
│   ├── DATA.md                 # 数据结构设计
│   ├── API.md                  # API 文档
│   └── TESTING.md              # 测试计划
├── .github/workflows/          # CI/CD
│   └── deploy.yml
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 3. 开发规范

### 3.1 代码风格

项目使用 ESLint + Prettier 进行代码格式化：

```bash
# 检查代码风格
npm run lint

# 自动修复
npm run lint:fix

# 格式化代码
npm run format
```

### 3.2 命名规范

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| 组件 | PascalCase | `WheelOfFortune.tsx` |
| 函数 | camelCase | `calculateRotation` |
| 常量 | UPPER_SNAKE_CASE | `MAX_HISTORY_RECORDS` |
| 类型 | PascalCase | `FoodOption` |
| 接口 | PascalCase | `StorageService` |
| 文件 | camelCase 或 PascalCase | `useFoodOptions.ts` |

### 3.3 Git 提交规范

遵循 Conventional Commits 规范：

```
<type>: <description>

[optional body]

[optional footer]
```

**类型 (type)**:
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例**:
```bash
git commit -m "feat: 添加转盘旋转动画"
git commit -m "fix: 修复历史记录时区问题"
git commit -m "docs: 更新 API 文档"
```

### 3.4 分支策略

```
main        → 生产环境
  ↓
develop     → 开发环境
  ↓
feature/xxx → 功能分支
hotfix/xxx  → 紧急修复
```

**工作流程**:
1. 从 `develop` 创建功能分支
2. 完成开发后提交 PR
3. Code Review 通过后合并到 `develop`
4. 定期从 `develop` 合并到 `main`

---

## 4. 组件开发

### 4.1 创建新组件

```bash
# 使用示例模板
src/components/WheelOfFortune.tsx
```

**组件模板**:

```tsx
import React from 'react';
import type { WheelOfFortuneProps } from '@/types';
import './WheelOfFortune.css';

export const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({
  options,
  size = 350,
  onSpinEnd,
  disabled = false,
}) => {
  // 组件逻辑

  return (
    <div className="wheel-of-fortune">
      {/* JSX */}
    </div>
  );
};

export default WheelOfFortune;
```

### 4.2 组件规范

- 使用函数组件 + Hooks
- 使用 TypeScript 定义 Props 类型
- 导出类型定义供其他组件使用
- 组件文件包含对应 CSS 文件
- 使用 React.memo 优化性能（如需要）

---

## 5. Hook 开发

### 5.1 创建自定义 Hook

```typescript
// hooks/useFoodOptions.ts
import { useState, useEffect } from 'react';
import type { FoodOption } from '@/types';
import { StorageService } from '@/utils/storage';

export function useFoodOptions() {
  const [options, setOptions] = useState<FoodOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 加载数据
    const loaded = StorageService.get<FoodOption[]>('cafeteria_food_options');
    setOptions(loaded || DEFAULT_FOOD_OPTIONS);
    setIsLoading(false);
  }, []);

  const addOption = (name: string, emoji?: string) => {
    const newOption: FoodOption = {
      id: crypto.randomUUID(),
      name,
      emoji,
      color: generateRandomColor(),
    };
    const updated = [...options, newOption];
    setOptions(updated);
    StorageService.set('cafeteria_food_options', updated);
  };

  return {
    options,
    addOption,
    isLoading,
  };
}
```

### 5.2 Hook 规范

- 使用 `use` 前缀命名
- 返回对象而非数组（除非返回值固定为 2 个）
- 提供清晰的类型定义
- 处理加载和错误状态

---

## 6. 测试

### 6.1 单元测试

使用 Vitest 进行单元测试：

```bash
# 运行测试
npm run test

# 监听模式
npm run test:watch

# 覆盖率报告
npm run test:coverage
```

**测试文件示例**:

```typescript
// hooks/__tests__/useFoodOptions.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFoodOptions } from '../useFoodOptions';

describe('useFoodOptions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should load default options', () => {
    const { result } = renderHook(() => useFoodOptions());
    expect(result.current.options).toHaveLength(8);
  });

  it('should add new option', () => {
    const { result } = renderHook(() => useFoodOptions());

    act(() => {
      result.current.addOption('测试食物', '🍜');
    });

    expect(result.current.options).toHaveLength(9);
  });
});
```

### 6.2 E2E 测试

使用 Playwright 进行 E2E 测试：

```bash
# 运行 E2E 测试
npm run test:e2e

# 打开测试 UI
npm run test:e2e:ui
```

**E2E 测试示例**:

```typescript
// e2e/wheel.spec.ts
import { test, expect } from '@playwright/test';

test('spin wheel and show result', async ({ page }) => {
  await page.goto('/');

  // 点击开始按钮
  await page.click('[data-testid="spin-button"]');

  // 等待动画结束
  await page.waitForSelector('[data-testid="result-modal"]');

  // 验证结果显示
  const result = await page.textContent('[data-testid="result-food-name"]');
  expect(result).toBeTruthy();
});
```

### 6.3 测试覆盖率要求

- 单元测试覆盖率 ≥ 80%
- 核心组件（转盘）覆盖率 ≥ 90%
- 关键业务逻辑覆盖率 100%

---

## 7. 调试

### 7.1 开发者工具

```bash
# 启动开发服务器（带调试）
npm run dev -- --debug
```

### 7.2 React DevTools

安装 [React DevTools](https://react.dev/learn/react-developer-tools) 浏览器扩展进行组件调试。

### 7.3 LocalStorage 调试

在浏览器控制台中：

```javascript
// 查看所有数据
localStorage.getItem('cafeteria_food_options');
localStorage.getItem('cafeteria_history');

// 清空数据
localStorage.clear();

// 重置为默认
// 重新加载页面时会自动加载默认数据
```

---

## 8. 构建与部署

### 8.1 本地构建

```bash
# 生产构建
npm run build

# 预览构建结果
npm run preview
```

### 8.2 环境变量

创建 `.env.local` 文件：

```env
VITE_APP_TITLE=食堂大冒险
VITE_APP_VERSION=1.0.0
```

在代码中访问：

```typescript
const version = import.meta.env.VITE_APP_VERSION;
```

### 8.3 部署到 GitHub Pages

1. 在项目根目录创建 `.github/workflows/deploy.yml`

2. 推送到 main 分支，自动触发部署

3. 在 GitHub 仓库设置中启用 Pages:
   - Settings → Pages
   - Source: GitHub Actions

### 8.4 部署到 Netlify

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
npm run build
netlify deploy --prod --dir=dist
```

---

## 9. 性能优化

### 9.1 代码分割

```typescript
// 路由级别懒加载
const History = lazy(() => import('./pages/History'));
const Editor = lazy(() => import('./pages/Editor'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/history" element={<History />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </Suspense>
  );
}
```

### 9.2 图片优化

使用 WebP 格式，提供多种尺寸：

```typescript
const icons = {
  '192': '/icons/icon-192x192.webp',
  '512': '/icons/icon-512x512.webp',
};
```

### 9.3 Bundle 分析

```bash
# 分析打包体积
npm run build -- --report
```

---

## 10. 常见问题

### 10.1 LocalStorage 数据丢失

**原因**: 浏览器隐私模式、清除缓存、存储空间不足

**解决**:
- 提示用户关闭隐私模式
- 实现 sessionStorage 备份
- 提供数据导出功能

### 10.2 转盘动画卡顿

**原因**: 设备性能不足、帧率过低

**解决**:
- 降低动画复杂度
- 提供"简化动画"选项
- 使用 will-change 优化

### 10.3 PWA 无法安装

**原因**: manifest 配置错误、缺少图标

**解决**:
- 检查 manifest.json 格式
- 确保所有必需的图标尺寸都存在
- 验证 HTTPS 配置

---

## 11. 资源链接

- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Vite 文档](https://vitejs.dev/)
- [PWA 指南](https://web.dev/progressive-web-apps/)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

## 12. 更新日志

### v1.0.0 (2026-03-25)

- 初始版本
- 完成核心功能开发
- PWA 支持
- 响应式设计

---

## 文档变更历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| v1.0.0 | 2026-03-25 | - | 初始版本 |

