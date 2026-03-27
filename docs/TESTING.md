# 测试计划 - 食堂大冒险

## 文档信息

| 项目 | 内容 |
|------|------|
| 项目名称 | 食堂大冒险 (Cafeteria Adventure) |
| 文档版本 | v1.0.0 |
| 创建日期 | 2026-03-25 |
| 测试框架 | Vitest + Playwright |

---

## 1. 测试策略

### 1.1 测试金字塔

```
                /\
               /  \
              / E2E \        10% - 关键用户流程
             /--------\
            /  集成测试  \     30% - 组件交互
           /--------------\
          /     单元测试     \   60% - 函数/逻辑
         /------------------\
```

### 1.2 测试类型

| 测试类型 | 工具 | 覆盖率目标 | 用途 |
|---------|------|-----------|------|
| 单元测试 | Vitest | ≥ 80% | 测试独立函数和组件 |
| 集成测试 | Vitest + RTL | ≥ 60% | 测试组件交互 |
| E2E 测试 | Playwright | 关键流程 | 测试完整用户场景 |

---

## 2. 单元测试

### 2.1 工具函数测试

#### 2.1.1 storage.ts

```typescript
// utils/__tests__/storage.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StorageService } from '../storage';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should set and get data', () => {
    StorageService.set('test_key', { foo: 'bar' });
    const result = StorageService.get<{ foo: string }>('test_key');
    expect(result).toEqual({ foo: 'bar' });
  });

  it('should return null for non-existent key', () => {
    const result = StorageService.get('non_existent');
    expect(result).toBeNull();
  });

  it('should remove data', () => {
    StorageService.set('test_key', { foo: 'bar' });
    StorageService.remove('test_key');
    const result = StorageService.get('test_key');
    expect(result).toBeNull();
  });

  it('should clear all data', () => {
    StorageService.set('key1', 'value1');
    StorageService.set('key2', 'value2');
    StorageService.clear();
    expect(localStorage.length).toBe(0);
  });
});
```

#### 2.1.2 animation.ts

```typescript
// utils/__tests__/animation.test.ts
import { describe, it, expect } from 'vitest';
import { easeOutCubic, calculateRotation } from '../animation';

describe('animation utilities', () => {
  describe('easeOutCubic', () => {
    it('should return 0 at t=0', () => {
      expect(easeOutCubic(0)).toBe(0);
    });

    it('should return 1 at t=1', () => {
      expect(easeOutCubic(1)).toBe(1);
    });

    it('should return values between 0 and 1', () => {
      const result = easeOutCubic(0.5);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1);
    });
  });

  describe('calculateRotation', () => {
    it('should calculate rotation for 4 options', () => {
      const result = calculateRotation(1, 4, 3);
      expect(result).toBeGreaterThan(360 * 3);
    });

    it('should ensure result is within valid range', () => {
      const result = calculateRotation(0, 8, 5);
      expect(result % 360).toBeGreaterThanOrEqual(0);
      expect(result % 360).toBeLessThan(360);
    });
  });
});
```

#### 2.1.3 colors.ts

```typescript
// utils/__tests__/colors.test.ts
import { describe, it, expect } from 'vitest';
import { generateRandomColor, getColorByIndex } from '../colors';

describe('color utilities', () => {
  it('should generate valid hex color', () => {
    const color = generateRandomColor();
    expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('should get consistent color by index', () => {
    const color1 = getColorByIndex(0);
    const color2 = getColorByIndex(0);
    expect(color1).toBe(color2);
  });

  it('should get different colors for different indices', () => {
    const color1 = getColorByIndex(0);
    const color2 = getColorByIndex(1);
    expect(color1).not.toBe(color2);
  });
});
```

### 2.2 Hooks 测试

#### 2.2.1 useFoodOptions

```typescript
// hooks/__tests__/useFoodOptions.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFoodOptions } from '../useFoodOptions';

describe('useFoodOptions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should load default options on mount', () => {
    const { result } = renderHook(() => useFoodOptions());
    expect(result.current.options).toHaveLength(8);
  });

  it('should add new option', () => {
    const { result } = renderHook(() => useFoodOptions());

    act(() => {
      result.current.addOption('兰州拉面', '🍜');
    });

    expect(result.current.options).toHaveLength(9);
    expect(result.current.options[8].name).toBe('兰州拉面');
  });

  it('should remove option', () => {
    const { result } = renderHook(() => useFoodOptions());
    const initialLength = result.current.options.length;
    const idToRemove = result.current.options[0].id;

    act(() => {
      result.current.removeOption(idToRemove);
    });

    expect(result.current.options).toHaveLength(initialLength - 1);
    expect(result.current.options.find(o => o.id === idToRemove)).toBeUndefined();
  });

  it('should update option', () => {
    const { result } = renderHook(() => useFoodOptions());
    const idToUpdate = result.current.options[0].id;

    act(() => {
      result.current.updateOption(idToUpdate, { name: '更新后的名称' });
    });

    const updated = result.current.options.find(o => o.id === idToUpdate);
    expect(updated?.name).toBe('更新后的名称');
  });

  it('should reset to defaults', () => {
    const { result } = renderHook(() => useFoodOptions());

    act(() => {
      result.current.addOption('临时选项');
    });

    act(() => {
      result.current.resetToDefaults();
    });

    expect(result.current.options).toHaveLength(8);
  });
});
```

#### 2.2.2 useHistory

```typescript
// hooks/__tests__/useHistory.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../useHistory';
import type { FoodOption } from '@/types';

describe('useHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should start with empty history', () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.history).toHaveLength(0);
  });

  it('should add record', () => {
    const { result } = renderHook(() => useHistory());
    const food: FoodOption = {
      id: 'test-id',
      name: '测试食物',
      color: '#FF6B6B',
    };

    act(() => {
      result.current.addRecord(food);
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].foodName).toBe('测试食物');
  });

  it('should limit history to 100 records', () => {
    const { result } = renderHook(() => useHistory());
    const food: FoodOption = {
      id: 'test-id',
      name: '测试食物',
      color: '#FF6B6B',
    };

    // 添加 101 条记录
    for (let i = 0; i < 101; i++) {
      act(() => {
        result.current.addRecord({ ...food, id: `test-${i}` });
      });
    }

    expect(result.current.history).toHaveLength(100);
  });

  it('should clear all history', () => {
    const { result } = renderHook(() => useHistory());
    const food: FoodOption = {
      id: 'test-id',
      name: '测试食物',
      color: '#FF6B6B',
    };

    act(() => {
      result.current.addRecord(food);
    });

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toHaveLength(0);
  });
});
```

### 2.3 组件测试

#### 2.3.1 WheelOfFortune

```typescript
// components/__tests__/WheelOfFortune.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WheelOfFortune } from '../WheelOfFortune';
import { DEFAULT_FOOD_OPTIONS } from '@/utils/constants';

describe('WheelOfFortune', () => {
  it('should render wheel with options', () => {
    render(<WheelOfFortune options={DEFAULT_FOOD_OPTIONS} />);

    const canvas = screen.getByRole('img', { hidden: true });
    expect(canvas).toBeInTheDocument();
  });

  it('should call onSpinEnd after animation', async () => {
    const onSpinEnd = vi.fn();
    render(
      <WheelOfFortune
        options={DEFAULT_FOOD_OPTIONS}
        onSpinEnd={onSpinEnd}
      />
    );

    // 模拟动画完成后调用
    // 注意: 实际测试中需要 mock requestAnimationFrame
  });

  it('should be disabled when spinning', () => {
    const { rerender } = render(
      <WheelOfFortune options={DEFAULT_FOOD_OPTIONS} disabled={false} />
    );

    rerender(<WheelOfFortune options={DEFAULT_FOOD_OPTIONS} disabled={true} />);

    // 验证禁用状态
  });
});
```

---

## 3. 集成测试

### 3.1 转盘流程

```typescript
// integration/wheel-flow.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '@/App';

describe('Wheel Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should complete full spin flow', async () => {
    render(<App />);

    // 1. 验证转盘显示
    const wheel = screen.getByTestId('wheel');
    expect(wheel).toBeInTheDocument();

    // 2. 点击开始按钮
    const spinButton = screen.getByTestId('spin-button');
    fireEvent.click(spinButton);

    // 3. 验证按钮禁用
    expect(spinButton).toBeDisabled();

    // 4. 等待结果显示
    await waitFor(() => {
      const resultModal = screen.getByTestId('result-modal');
      expect(resultModal).toBeInTheDocument();
    });

    // 5. 验证历史记录更新
    const historyTab = screen.getByTestId('history-tab');
    fireEvent.click(historyTab);

    await waitFor(() => {
      const historyItems = screen.getAllByTestId(/history-item/);
      expect(historyItems.length).toBeGreaterThan(0);
    });
  });
});
```

### 3.2 编辑流程

```typescript
// integration/editor-flow.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '@/App';

describe('Editor Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should add, edit, and delete food option', async () => {
    render(<App />);

    // 导航到编辑页
    const editorTab = screen.getByTestId('editor-tab');
    fireEvent.click(editorTab);

    // 添加新食物
    const addButton = screen.getByTestId('add-food-button');
    fireEvent.click(addButton);

    const nameInput = screen.getByTestId('food-name-input');
    fireEvent.change(nameInput, { target: { value: '兰州拉面' } });

    const confirmButton = screen.getByTestId('confirm-add-button');
    fireEvent.click(confirmButton);

    // 验证添加成功
    await waitFor(() => {
      expect(screen.getByText('兰州拉面')).toBeInTheDocument();
    });

    // 编辑食物
    const editButton = screen.getByTestId(`edit-兰州拉面`);
    fireEvent.click(editButton);

    fireEvent.change(nameInput, { target: { value: '牛肉拉面' } });
    fireEvent.click(confirmButton);

    // 验证编辑成功
    await waitFor(() => {
      expect(screen.getByText('牛肉拉面')).toBeInTheDocument();
      expect(screen.queryByText('兰州拉面')).not.toBeInTheDocument();
    });

    // 删除食物
    const deleteButton = screen.getByTestId(`delete-牛肉拉面`);
    fireEvent.click(deleteButton);

    // 验证删除成功
    await waitFor(() => {
      expect(screen.queryByText('牛肉拉面')).not.toBeInTheDocument();
    });
  });
});
```

---

## 4. E2E 测试

### 4.1 核心流程

```typescript
// e2e/basic-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Cafeteria Adventure E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load home page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('食堂大冒险');
    await expect(page.locator('[data-testid="wheel"]')).toBeVisible();
  });

  test('should spin wheel and show result', async ({ page }) => {
    // 点击开始按钮
    await page.click('[data-testid="spin-button"]');

    // 等待结果弹窗
    await page.waitForSelector('[data-testid="result-modal"]', { timeout: 10000 });

    // 验证结果显示
    const foodName = await page.textContent('[data-testid="result-food-name"]');
    expect(foodName).toBeTruthy();
    expect(foodName!.length).toBeGreaterThan(0);

    // 关闭弹窗
    await page.click('[data-testid="close-modal-button"]');

    // 验证弹窗关闭
    await expect(page.locator('[data-testid="result-modal"]')).not.toBeVisible();
  });

  test('should add new food option', async ({ page }) => {
    // 导航到编辑页
    await page.click('[data-testid="editor-tab"]');

    // 点击添加按钮
    await page.click('[data-testid="add-food-button"]');

    // 输入食物名称
    await page.fill('[data-testid="food-name-input"]', '兰州拉面');

    // 确认添加
    await page.click('[data-testid="confirm-add-button"]');

    // 验证添加成功
    await expect(page.locator('text=兰州拉面')).toBeVisible();
  });

  test('should view history', async ({ page }) => {
    // 先旋转一次
    await page.click('[data-testid="spin-button"]');
    await page.waitForSelector('[data-testid="result-modal"]');
    await page.click('[data-testid="close-modal-button"]');

    // 导航到历史页
    await page.click('[data-testid="history-tab"]');

    // 验证历史记录
    await expect(page.locator('[data-testid^="history-item-"]')).toHaveCount(1);
  });
});
```

### 4.2 移动端测试

```typescript
// e2e/mobile.spec.ts
import { test, expect, devices } from '@playwright/test';

test.use(devices['iPhone 12']);

test('should work on mobile', async ({ page }) => {
  await page.goto('/');

  // 验证移动端布局
  await expect(page.locator('[data-testid="wheel"]')).toBeVisible();

  // 触摸操作
  await page.tap('[data-testid="spin-button"]');

  // 等待结果
  await page.waitForSelector('[data-testid="result-modal"]');

  // 验证结果显示
  await expect(page.locator('[data-testid="result-food-name"]')).toBeVisible();
});
```

### 4.3 PWA 测试

```typescript
// e2e/pwa.spec.ts
import { test, expect } from '@playwright/test';

test('should support offline mode', async ({ page, context }) => {
  // 首次访问，缓存资源
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // 模拟离线
  await context.setOffline(true);

  // 刷新页面
  await page.reload();

  // 验证离线可用
  await expect(page.locator('[data-testid="wheel"]')).toBeVisible();

  // 恢复在线
  await context.setOffline(false);
});
```

---

## 5. 性能测试

### 5.1 Lighthouse CI

在 `.github/workflows/test.yml` 中配置：

```yaml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    urls: |
      http://localhost:4173
    uploadArtifacts: true
    temporaryPublicStorage: true
```

**性能目标**:
- Performance: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 80

### 5.2 Bundle 大小

```bash
npm run build -- --report
```

**目标**:
- gzip 后大小 < 500 KB
- 首屏 JS < 200 KB

---

## 6. 可访问性测试

### 6.1 自动化测试

```bash
npm run test:a11y
```

### 6.2 手动检查清单

- [ ] 所有交互元素可通过键盘访问
- [ ] 颜色对比度符合 WCAG AA 标准
- [ ] 屏幕阅读器可正确读取内容
- [ ] 焦点指示器清晰可见
- [ ] 表单有适当的标签

---

## 7. 测试覆盖率

### 7.1 生成覆盖率报告

```bash
npm run test:coverage
```

报告生成在 `coverage/` 目录。

### 7.2 覆盖率目标

| 模块 | 目标 | 优先级 |
|------|------|--------|
| utils/ | ≥ 90% | 高 |
| hooks/ | ≥ 80% | 高 |
| components/ | ≥ 70% | 中 |
| App.tsx | ≥ 60% | 中 |
| 总体 | ≥ 80% | - |

---

## 8. 持续集成

### 8.1 GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm ci

      - run: npm run lint

      - run: npm run test

      - run: npm run test:e2e

      - run: npm run test:coverage
```

---

## 9. 测试最佳实践

### 9.1 AAA 模式

每个测试遵循 Arrange-Act-Assert 模式：

```typescript
it('should add option', () => {
  // Arrange - 准备
  const { result } = renderHook(() => useFoodOptions());
  const initialLength = result.current.options.length;

  // Act - 执行
  act(() => {
    result.current.addOption('新选项');
  });

  // Assert - 断言
  expect(result.current.options).toHaveLength(initialLength + 1);
});
```

### 9.2 避免测试实现细节

**不好的测试**:
```typescript
expect(component.state.isSpinning).toBe(true);
```

**好的测试**:
```typescript
expect(spinButton).toBeDisabled();
```

### 9.3 使用描述性测试名称

```typescript
// 好的
it('should prevent adding empty food name', () => {});

// 不好的
it('should work', () => {});
```

---

## 文档变更历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| v1.0.0 | 2026-03-25 | - | 初始版本 |

