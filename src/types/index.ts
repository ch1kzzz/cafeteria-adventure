/**
 * 食物选项
 */
export interface FoodOption {
  /** 唯一标识符 (UUID) */
  id: string;
  /** 食物名称 (1-20 字符) */
  name: string;
  /** 可选的表情符号 */
  emoji?: string;
  /** 扇区颜色 (HEX) */
  color: string;
  /** 可选的权重 (1-10)，用于加权随机 */
  weight?: number;
}

/**
 * 历史记录
 */
export interface HistoryRecord {
  /** 唯一标识符 (UUID) */
  id: string;
  /** 关联的食物 ID */
  foodId: string;
  /** 食物名称（冗余存储） */
  foodName: string;
  /** 表情符号（冗余存储） */
  foodEmoji?: string;
  /** 抽取时间戳（毫秒） */
  timestamp: number;
}

/**
 * 应用设置
 */
export interface AppSettings {
  /** 是否启用音效 */
  soundEnabled: boolean;
  /** 是否启用动画 */
  animationEnabled: boolean;
  /** 旋转时长（秒） */
  spinDuration: number;
  /** 主题模式 */
  theme: 'light' | 'dark';
}

/**
 * 统计数据
 */
export interface Statistics {
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

/**
 * 应用状态（运行时，不持久化）
 */
export interface AppState {
  /** 当前页面 */
  currentPage: 'wheel' | 'editor' | 'history';
  /** 转盘是否正在旋转 */
  isSpinning: boolean;
  /** 当前转盘角度（用于动画） */
  currentAngle: number;
  /** 上次抽取的结果 */
  lastResult?: FoodOption;
  /** 是否显示结果弹窗 */
  showResultModal: boolean;
}

/**
 * 转盘组件 Ref 接口
 */
export interface WheelOfFortuneRef {
  spin: (targetIndex: number) => void;
  reset: () => void;
  isSpinning: boolean;
}

/**
 * 转盘组件 Props
 */
export interface WheelOfFortuneProps {
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

/**
 * 食物编辑器组件 Props
 */
export interface FoodEditorProps {
  /** 当前食物列表 */
  options: FoodOption[];
  /** 添加回调 */
  onAdd: (name: string, emoji?: string) => void;
  /** 删除回调 */
  onDelete: (id: string) => void;
  /** 更新回调 */
  onUpdate: (id: string, data: Partial<FoodOption>) => void;
  /** 重排序回调 */
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

/**
 * 历史记录组件 Props
 */
export interface HistoryListProps {
  /** 历史记录列表 */
  history: HistoryRecord[];
  /** 删除回调 */
  onDelete: (id: string) => void;
  /** 清空回调 */
  onClear: () => void;
  /** 显示统计信息 */
  showStatistics?: boolean;
}

/**
 * useFoodOptions Hook 返回值
 */
export interface UseFoodOptionsReturn {
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

/**
 * useHistory Hook 返回值
 */
export interface UseHistoryReturn {
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

/**
 * useWheelSpin Hook 返回值
 */
export interface UseWheelSpinReturn {
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
