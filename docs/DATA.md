# 数据结构设计 - 食堂大冒险

## 文档信息

| 项目 | 内容 |
|------|------|
| 项目名称 | 食堂大冒险 (Cafeteria Adventure) |
| 文档版本 | v1.0.0 |
| 创建日期 | 2026-03-25 |
| 存储方案 | LocalStorage |

---

## 1. 数据模型概述

本项目使用 LocalStorage 作为本地持久化存储方案，所有数据存储在用户浏览器中，无需服务器端存储。

### 1.1 存储层次

```
LocalStorage (5MB 限制)
├── cafeteria_food_options    # 食物选项列表
├── cafeteria_history         # 历史记录
└── cafeteria_settings        # 应用设置
```

### 1.2 数据关系图

```
┌─────────────────┐         抽取         ┌─────────────────┐
│  FoodOption     │ ───────────────────→ │ HistoryRecord   │
│  (食物选项)      │                      │ (历史记录)       │
└─────────────────┘                      └─────────────────┘
        │                                         │
        │                                         │
        │ 包含                                    │ 引用
        │                                         │
        ↓                                         ↓
┌─────────────────┐                      ┌─────────────────┐
│  转盘渲染       │                      │  历史展示       │
└─────────────────┘                      └─────────────────┘
```

---

## 2. 核心数据结构

### 2.1 FoodOption (食物选项)

定义转盘上可用的食物选项。

```typescript
interface FoodOption {
  /**
   * 唯一标识符
   * @format UUID v4
   */
  id: string;

  /**
   * 食物名称
   * @minLength 1
   * @maxLength 20
   */
  name: string;

  /**
   * 可选的表情符号
   * @example "🍲"
   */
  emoji?: string;

  /**
   * 扇区颜色 (HEX)
   * @format ^#[0-9A-Fa-f]{6}$
   * @example "#FF6B6B"
   */
  color: string;

  /**
   * 可选的权重 (用于加权随机)
   * 默认值: 1
   * 范围: 1-10
   */
  weight?: number;
}
```

**示例数据**:

```typescript
const defaultFoodOptions: FoodOption[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "麻辣烫",
    emoji: "🍲",
    color: "#FF6B6B",
    weight: 1
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "黄焖鸡",
    emoji: "🍗",
    color: "#4ECDC4",
    weight: 1
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "盖浇饭",
    emoji: "🍚",
    color: "#45B7D1",
    weight: 1
  }
];
```

**验证规则**:
- `id`: 必须是有效的 UUID
- `name`: 不能为空，长度 1-20 字符
- `color`: 有效的 HEX 颜色值
- `weight`: 可选，范围 1-10

---

### 2.2 HistoryRecord (历史记录)

记录每次转盘抽取的结果。

```typescript
interface HistoryRecord {
  /**
   * 唯一标识符
   * @format UUID v4
   */
  id: string;

  /**
   * 关联的食物 ID
   * 注意: 保留此 ID 用于关联，但删除食物后可能失效
   */
  foodId: string;

  /**
   * 食物名称（冗余存储）
   * 原因: 防止删除食物选项后历史记录丢失信息
   */
  foodName: string;

  /**
   * 表情符号（冗余存储）
   */
  foodEmoji?: string;

  /**
   * 抽取时间戳（毫秒）
   */
  timestamp: number;
}
```

**示例数据**:

```typescript
const exampleHistory: HistoryRecord = {
  id: "660e8400-e29b-41d4-a716-446655440001",
  foodId: "550e8400-e29b-41d4-a716-446655440001",
  foodName: "麻辣烫",
  foodEmoji: "🍲",
  timestamp: 1711324800000
};
```

**设计说明**:

采用**冗余存储**策略，将 `foodName` 和 `foodEmoji` 直接存储在历史记录中，而非通过 `foodId` 关联查询。

**优点**:
- 删除食物选项后，历史记录仍然完整
- 查询历史记录无需关联查询，性能更好
- 数据结构简单，易于理解

**缺点**:
- 存储空间稍大（可忽略不计）
- 如果食物名称更新，历史记录不会同步

---

### 2.3 AppSettings (应用设置)

存储用户的个人偏好设置。

```typescript
interface AppSettings {
  /**
   * 是否启用音效
   * @default false
   */
  soundEnabled: boolean;

  /**
   * 是否启用动画
   * @default true
   */
  animationEnabled: boolean;

  /**
   * 旋转时长（秒）
   * @default 3
   * @range 2-10
   */
  spinDuration: number;

  /**
   * 主题模式
   * @default "light"
   */
  theme: "light" | "dark";
}
```

**默认设置**:

```typescript
const defaultSettings: AppSettings = {
  soundEnabled: false,
  animationEnabled: true,
  spinDuration: 3,
  theme: "light"
};
```

---

### 2.4 AppState (应用状态)

运行时的应用状态，不需要持久化。

```typescript
interface AppState {
  /** 当前页面 */
  currentPage: "wheel" | "editor" | "history";

  /** 转盘是否正在旋转 */
  isSpinning: boolean;

  /** 当前转盘角度（用于动画） */
  currentAngle: number;

  /** 上次抽取的结果 */
  lastResult?: FoodOption;

  /** 是否显示结果弹窗 */
  showResultModal: boolean;
}
```

---

### 2.5 Statistics (统计数据)

从历史记录计算得出的统计信息。

```typescript
interface Statistics {
  /** 总抽取次数 */
  totalSpins: number;

  /** 最常抽取的食物 */
  topFoods: Array<{
    foodName: string;
    count: number;
    percentage: number;
  }>;

  /** 最近 7 天抽取次数 */
  recentSpins: number;

  /** 最长未抽取的食物 */
  leastRecentFoods: Array<{
    foodName: string;
    daysSinceLastSpin: number;
  }>;
}
```

---

## 3. 存储键名规范

### 3.1 键名定义

```typescript
const STORAGE_KEYS = {
  /** 食物选项列表 */
  FOOD_OPTIONS: "cafeteria_food_options",

  /** 历史记录列表 */
  HISTORY: "cafeteria_history",

  /** 应用设置 */
  SETTINGS: "cafeteria_settings",

  /** 数据版本（用于迁移） */
  VERSION: "cafeteria_version",
} as const;
```

### 3.2 数据版本

```typescript
const CURRENT_DATA_VERSION = 1;

// 未来可能的数据迁移场景
const migrations = {
  1: {
    // v1 → v2 迁移逻辑
  },
  2: {
    // v2 → v3 迁移逻辑
  }
};
```

---

## 4. 数据操作规范

### 4.1 读取操作

```typescript
// 读取食物选项
function getFoodOptions(): FoodOption[] {
  const data = localStorage.getItem(STORAGE_KEYS.FOOD_OPTIONS);
  return data ? JSON.parse(data) : defaultFoodOptions;
}

// 读取历史记录
function getHistory(): HistoryRecord[] {
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
  return data ? JSON.parse(data) : [];
}

// 读取设置
function getSettings(): AppSettings {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : defaultSettings;
}
```

### 4.2 写入操作

```typescript
// 保存食物选项
function saveFoodOptions(options: FoodOption[]): void {
  localStorage.setItem(STORAGE_KEYS.FOOD_OPTIONS, JSON.stringify(options));
}

// 添加历史记录
function addHistoryRecord(record: HistoryRecord): void {
  const history = getHistory();
  history.unshift(record); // 添加到开头

  // 限制最多 100 条
  if (history.length > 100) {
    history.splice(100);
  }

  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

// 保存设置
function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}
```

### 4.3 删除操作

```typescript
// 删除单个历史记录
function deleteHistoryRecord(id: string): void {
  const history = getHistory();
  const filtered = history.filter(record => record.id !== id);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered));
}

// 清空历史记录
function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}

// 重置所有数据
function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.FOOD_OPTIONS);
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}
```

---

## 5. 数据验证

### 5.1 FoodOption 验证

```typescript
function validateFoodOption(option: unknown): option is FoodOption {
  if (!option || typeof option !== "object") return false;

  const { id, name, color } = option as Partial<FoodOption>;

  return (
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) &&
    typeof name === "string" &&
    name.length > 0 &&
    name.length <= 20 &&
    typeof color === "string" &&
    /^#[0-9A-Fa-f]{6}$/.test(color)
  );
}
```

### 5.2 HistoryRecord 验证

```typescript
function validateHistoryRecord(record: unknown): record is HistoryRecord {
  if (!record || typeof record !== "object") return false;

  const { id, foodId, foodName, timestamp } = record as Partial<HistoryRecord>;

  return (
    typeof id === "string" &&
    typeof foodId === "string" &&
    typeof foodName === "string" &&
    typeof timestamp === "number" &&
    timestamp > 0
  );
}
```

---

## 6. 数据迁移

### 6.1 版本检查

```typescript
function checkAndMigrate(): void {
  const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
  const version = storedVersion ? parseInt(storedVersion, 10) : 0;

  if (version < CURRENT_DATA_VERSION) {
    migrateData(version, CURRENT_DATA_VERSION);
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_DATA_VERSION.toString());
  }
}

function migrateData(from: number, to: number): void {
  for (let v = from; v < to; v++) {
    const migration = migrations[v as keyof typeof migrations];
    if (migration) {
      migration();
    }
  }
}
```

### 6.2 迁移示例

```typescript
// v0 → v1: 添加颜色字段
const migrations = {
  0: () => {
    const options = getFoodOptions();
    const migrated = options.map((option, index) => ({
      ...option,
      color: option.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
    }));
    saveFoodOptions(migrated);
  }
};
```

---

## 7. 数据导出/导入

### 7.1 导出格式

```typescript
interface ExportData {
  version: number;
  exportDate: string;
  foodOptions: FoodOption[];
  history: HistoryRecord[];
  settings: AppSettings;
}

function exportData(): string {
  const data: ExportData = {
    version: CURRENT_DATA_VERSION,
    exportDate: new Date().toISOString(),
    foodOptions: getFoodOptions(),
    history: getHistory(),
    settings: getSettings()
  };
  return JSON.stringify(data, null, 2);
}
```

### 7.2 导入验证

```typescript
function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as ExportData;

    // 验证必要字段
    if (!data.foodOptions || !Array.isArray(data.foodOptions)) {
      throw new Error("Invalid food options");
    }

    // 保存数据
    saveFoodOptions(data.foodOptions);
    if (data.history) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data.history));
    }
    if (data.settings) {
      saveSettings(data.settings);
    }

    return true;
  } catch (error) {
    console.error("Import failed:", error);
    return false;
  }
}
```

---

## 8. 存储容量管理

### 8.1 容量估算

| 数据类型 | 单条大小 | 最大条数 | 总大小 |
|---------|---------|---------|--------|
| FoodOption | ~100 bytes | 20 | 2 KB |
| HistoryRecord | ~150 bytes | 100 | 15 KB |
| AppSettings | ~200 bytes | 1 | 0.2 KB |
| **总计** | - | - | **~17 KB** |

**结论**: 数据量远小于 5MB 限制，无需额外优化。

### 8.2 清理策略

```typescript
// 自动清理旧历史记录
function cleanupOldHistory(): void {
  const history = getHistory();
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  const filtered = history.filter(record => record.timestamp > thirtyDaysAgo);

  if (filtered.length < history.length) {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered));
  }
}
```

---

## 9. 数据一致性保证

### 9.1 事务模拟

```typescript
function updateFoodOption(id: string, updates: Partial<FoodOption>): boolean {
  try {
    const options = getFoodOptions();
    const index = options.findIndex(opt => opt.id === id);

    if (index === -1) {
      return false;
    }

    // 创建新对象（不可变更新）
    options[index] = { ...options[index], ...updates };
    saveFoodOptions(options);

    return true;
  } catch (error) {
    console.error("Update failed:", error);
    return false;
  }
}
```

### 9.2 数据恢复

```typescript
// 备份到另一个键
function backupData(): void {
  const backup: Record<string, string> = {};

  Object.values(STORAGE_KEYS).forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      backup[key] = data;
    }
  });

  localStorage.setItem("cafeteria_backup", JSON.stringify(backup));
  localStorage.setItem("cafeteria_backup_date", Date.now().toString());
}

// 从备份恢复
function restoreFromBackup(): void {
  const backup = localStorage.getItem("cafeteria_backup");
  if (backup) {
    const data = JSON.parse(backup) as Record<string, string>;
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  }
}
```

---

## 文档变更历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| v1.0.0 | 2026-03-25 | - | 初始版本 |

