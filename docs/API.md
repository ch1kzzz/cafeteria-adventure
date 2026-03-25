# API 文档 - 食堂大冒险

## 文档信息

| 项目 | 内容 |
|------|------|
| 项目名称 | 食堂大冒险 (Cafeteria Adventure) |
| 文档版本 | v1.0.0 |
| 创建日期 | 2026-03-25 |
| API 类型 | 内部服务 API |

---

## 概述

本文档描述"食堂大冒险"应用的内部 API，包括自定义 Hooks、工具函数和组件接口。

---

## 1. StorageService

存储服务层，封装 LocalStorage 操作。

### 1.1 接口定义

```typescript
class StorageService {
  /**
   * 获取存储的数据
   * @param key 存储键名
   * @returns 解析后的数据，不存在时返回 null
   */
  static get<T>(key: string): T | null;

  /**
   * 存储数据
   * @param key 存储键名
   * @param value 要存储的值
   */
  static set<T>(key: string, value: T): void;

  /**
   * 删除指定键的数据
   * @param key 存储键名
   */
  static remove(key: string): void;

  /**
   * 清空所有应用数据
   */
  static clear(): void;

  /**
   * 检查键是否存在
   * @param key 存储键名
   */
  static has(key: string): boolean;
}
```

### 1.2 使用示例

```typescript
// 读取食物选项
const options = StorageService.get<FoodOption[]>(STORAGE_KEYS.FOOD_OPTIONS);

// 保存食物选项
StorageService.set(STORAGE_KEYS.FOOD_OPTIONS, newOptions);

// 删除历史记录
StorageService.remove(STORAGE_KEYS.HISTORY);

// 清空所有数据
StorageService.clear();
```

---

## 2. useFoodOptions Hook

食物选项管理 Hook。

### 2.1 接口定义

```typescript
interface UseFoodOptionsReturn {
  /** 当前食物选项列表 */
  options: FoodOption[];

  /** 添加新食物 */
  addOption: (name: string, emoji?: string) => void;

  /** 删除食物 */
  removeOption: (id: string) => void;

  /** 更新食物 */
  updateOption: (id: string, data: Partial<FoodOption>) => void;

  /** 重排序食物 */
  reorderOptions: (fromIndex: number, toIndex: number) => void;

  /** 重置为默认选项 */
  resetToDefaults: () => void;

  /** 是否正在加载 */
  isLoading: boolean;

  /** 错误信息 */
  error: Error | null;
}

function useFoodOptions(): UseFoodOptionsReturn;
```

### 2.2 方法详情

#### addOption

添加新的食物选项。

```typescript
addOption(name: string, emoji?: string): void
```

**参数**:
- `name`: 食物名称（1-20 字符）
- `emoji`: 可选的表情符号

**行为**:
1. 验证输入
2. 生成 UUID
3. 自动分配颜色
4. 保存到 LocalStorage

**示例**:
```typescript
const { addOption } = useFoodOptions();
addOption("兰州拉面", "🍜");
```

#### removeOption

删除指定的食物选项。

```typescript
removeOption(id: string): void
```

**参数**:
- `id`: 食物选项的 UUID

**行为**:
1. 从列表中删除
2. 保存到 LocalStorage
3. 触发重新渲染

**示例**:
```typescript
const { removeOption } = useFoodOptions();
removeOption("550e8400-e29b-41d4-a716-446655440001");
```

#### updateOption

更新食物选项。

```typescript
updateOption(id: string, data: Partial<FoodOption>): void
```

**参数**:
- `id`: 食物选项的 UUID
- `data`: 要更新的字段

**示例**:
```typescript
const { updateOption } = useFoodOptions();
updateOption("550e8400-e29b-41d4-a716-446655440001", { name: "牛肉面" });
```

---

## 3. useHistory Hook

历史记录管理 Hook。

### 3.1 接口定义

```typescript
interface UseHistoryReturn {
  /** 历史记录列表（按时间倒序） */
  history: HistoryRecord[];

  /** 添加记录 */
  addRecord: (food: FoodOption) => void;

  /** 删除单条记录 */
  deleteRecord: (id: string) => void;

  /** 清空所有记录 */
  clearHistory: () => void;

  /** 获取统计信息 */
  getStatistics: () => Statistics;

  /** 按日期分组的历史记录 */
  groupedHistory: Record<string, HistoryRecord[]>;
}

function useHistory(): UseHistoryReturn;
```

### 3.2 方法详情

#### addRecord

添加新的历史记录。

```typescript
addRecord(food: FoodOption): void
```

**参数**:
- `food`: 被抽取的食物选项

**行为**:
1. 创建历史记录对象
2. 添加到列表开头
3. 限制最多 100 条
4. 保存到 LocalStorage

**示例**:
```typescript
const { addRecord } = useHistory();
addRecord({ id: "xxx", name: "麻辣烫", emoji: "🍲", color: "#FF6B6B" });
```

#### getStatistics

获取历史统计信息。

```typescript
getStatistics(): Statistics
```

**返回值**:
```typescript
interface Statistics {
  totalSpins: number;
  topFoods: Array<{
    foodName: string;
    count: number;
    percentage: number;
  }>;
  recentSpins: number;  // 最近 7 天
  leastRecentFoods: Array<{
    foodName: string;
    daysSinceLastSpin: number;
  }>;
}
```

---

## 4. useWheelSpin Hook

转盘旋转逻辑 Hook。

### 4.1 接口定义

```typescript
interface UseWheelSpinReturn {
  /** 当前角度（0-360） */
  currentAngle: number;

  /** 是否正在旋转 */
  isSpinning: boolean;

  /** 旋转结果 */
  result: FoodOption | null;

  /** 开始旋转 */
  spin: () => void;

  /** 重置状态 */
  reset: () => void;
}

function useWheelSpin(
  options: FoodOption[],
  duration?: number
): UseWheelSpinReturn;
```

### 4.2 方法详情

#### spin

开始旋转转盘。

```typescript
spin(): void
```

**行为**:
1. 检查是否正在旋转
2. 计算目标角度（随机结果）
3. 执行动画
4. 返回结果

**示例**:
```typescript
const { spin, isSpinning, result } = useWheelSpin(options);

<button onClick={spin} disabled={isSpinning}>
  {isSpinning ? "旋转中..." : "开始"}
</button>
```

---

## 5. WheelOfFortune 组件

转盘组件。

### 5.1 Props

```typescript
interface WheelOfFortuneProps {
  /** 食物选项列表 */
  options: FoodOption[];

  /** 转盘尺寸（像素） */
  size?: number;

  /** 旋转结束回调 */
  onSpinEnd?: (result: FoodOption) => void;

  /** 是否禁用 */
  disabled?: boolean;

  /** 自定义类名 */
  className?: string;
}
```

### 5.2 使用示例

```typescript
<WheelOfFortune
  options={options}
  size={350}
  onSpinEnd={(result) => {
    console.log("结果:", result.name);
    addRecord(result);
  }}
  disabled={isSpinning}
/>
```

---

## 6. FoodEditor 组件

食物编辑器组件。

### 6.1 Props

```typescript
interface FoodEditorProps {
  /** 当前食物列表 */
  options: FoodOption[];

  /** 添加回调 */
  onAdd: (name: string, emoji?: string) => void;

  /** 删除回调 */
  onDelete: (id: string) => void;

  /** 更新回调 */
  onUpdate: (id: string, data: Partial<FoodOption>) => void;

  /** 重排序回调 */
  onReorder: (fromIndex: number, toIndex: number) => void;
}
```

---

## 7. HistoryList 组件

历史记录列表组件。

### 7.1 Props

```typescript
interface HistoryListProps {
  /** 历史记录列表 */
  history: HistoryRecord[];

  /** 删除回调 */
  onDelete: (id: string) => void;

  /** 清空回调 */
  onClear: () => void;

  /** 显示统计信息 */
  showStatistics?: boolean;
}
```

---

## 8. 工具函数

### 8.1 颜色工具

```typescript
/**
 * 生成随机颜色
 */
function generateRandomColor(): string;

/**
 * 获取预设颜色列表
 */
function getPresetColors(): string[];

/**
 * 根据索引获取颜色
 */
function getColorByIndex(index: number): string;
```

### 8.2 动画工具

```typescript
/**
 * 缓动函数 - ease-out-cubic
 */
function easeOutCubic(t: number): number;

/**
 * 计算旋转角度
 */
function calculateRotation(
  currentIndex: number,
  totalOptions: number,
  extraSpins: number
): number;
```

### 8.3 验证工具

```typescript
/**
 * 验证食物选项
 */
function isValidFoodOption(data: unknown): data is FoodOption;

/**
 * 验证历史记录
 */
function isValidHistoryRecord(data: unknown): data is HistoryRecord;

/**
 * 验证颜色值
 */
function isValidHexColor(color: string): boolean;
```

---

## 9. 常量定义

### 9.1 存储键

```typescript
const STORAGE_KEYS = {
  FOOD_OPTIONS: "cafeteria_food_options",
  HISTORY: "cafeteria_history",
  SETTINGS: "cafeteria_settings",
  VERSION: "cafeteria_version",
} as const;
```

### 9.2 默认值

```typescript
const DEFAULT_FOOD_OPTIONS: FoodOption[] = [
  // 预设食物列表
];

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: false,
  animationEnabled: true,
  spinDuration: 3,
  theme: "light",
};

const MAX_HISTORY_RECORDS = 100;
const MIN_FOOD_OPTIONS = 2;
const MAX_FOOD_OPTIONS = 20;
```

### 9.3 颜色配置

```typescript
const COLOR_PALETTE = [
  "#FF6B6B", // 活力橙红
  "#4ECDC4", // 清新青
  "#45B7D1", // 天蓝
  "#FFA07A", // 浅橙
  "#FFD93D", // 明黄
  "#6BCB77", // 草绿
  "#4D96FF", // 宝蓝
  "#FF6F91", // 粉红
  "#845EC2", // 紫色
  "#FF9671", // 珊瑚
] as const;
```

---

## 10. 类型导出

```typescript
// types/index.ts
export type {
  FoodOption,
  HistoryRecord,
  AppSettings,
  AppState,
  Statistics,
};

export type {
  WheelOfFortuneProps,
  FoodEditorProps,
  HistoryListProps,
};

export type {
  UseFoodOptionsReturn,
  UseHistoryReturn,
  UseWheelSpinReturn,
};
```

---

## 文档变更历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| v1.0.0 | 2026-03-25 | - | 初始版本 |

