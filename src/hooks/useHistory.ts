import { useState, useEffect, useCallback, useMemo } from 'react';
import type { HistoryRecord, FoodOption, Statistics } from '@/types';
import { StorageService } from '@/utils/storage';
import { STORAGE_KEYS, MAX_HISTORY_RECORDS } from '@/utils/constants';
import { generateUUID } from '@/utils/validation';
import type { UseHistoryReturn } from '@/types';

/**
 * 历史记录管理 Hook
 */
export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  // 加载历史记录
  useEffect(() => {
    const stored = StorageService.get<HistoryRecord[]>(STORAGE_KEYS.HISTORY);
    setHistory(stored || []);
  }, []);

  // 保存历史记录
  const saveHistory = useCallback((newHistory: HistoryRecord[]) => {
    // 限制最大记录数
    const trimmed = newHistory.slice(0, MAX_HISTORY_RECORDS);
    setHistory(trimmed);
    StorageService.set(STORAGE_KEYS.HISTORY, trimmed);
  }, []);

  // 添加记录
  const addRecord = useCallback(
    (food: FoodOption) => {
      const record: HistoryRecord = {
        id: generateUUID(),
        foodId: food.id,
        foodName: food.name,
        foodEmoji: food.emoji,
        timestamp: Date.now(),
      };

      saveHistory([record, ...history]);
    },
    [history, saveHistory],
  );

  // 删除单条记录
  const deleteRecord = useCallback(
    (id: string) => {
      const newHistory = history.filter((record) => record.id !== id);
      saveHistory(newHistory);
    },
    [history, saveHistory],
  );

  // 清空所有记录
  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  // 获取统计信息
  const getStatistics = useCallback((): Statistics => {
    const totalSpins = history.length;

    if (totalSpins === 0) {
      return {
        totalSpins: 0,
        topFoods: [],
        recentSpins: 0,
        leastRecentFoods: [],
      };
    }

    // 统计每个食物的出现次数
    const foodCounts = new Map<string, number>();
    history.forEach((record) => {
      const count = foodCounts.get(record.foodName) || 0;
      foodCounts.set(record.foodName, count + 1);
    });

    // 最常抽取的食物（前5名）
    const topFoods = Array.from(foodCounts.entries())
      .map(([foodName, count]) => ({
        foodName,
        count,
        percentage: (count / totalSpins) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 最近7天的抽取次数
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentSpins = history.filter((record) => record.timestamp > sevenDaysAgo).length;

    // 最长未抽取的食物（所有历史记录中出现过的食物）
    const lastSpinTimes = new Map<string, number>();
    history.forEach((record) => {
      const existingTime = lastSpinTimes.get(record.foodName) || 0;
      if (record.timestamp > existingTime) {
        lastSpinTimes.set(record.foodName, record.timestamp);
      }
    });

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const leastRecentFoods = Array.from(lastSpinTimes.entries())
      .map(([foodName, lastTime]) => ({
        foodName,
        daysSinceLastSpin: Math.floor((now - lastTime) / oneDayMs),
      }))
      .sort((a, b) => b.daysSinceLastSpin - a.daysSinceLastSpin)
      .slice(0, 5);

    return {
      totalSpins,
      topFoods,
      recentSpins,
      leastRecentFoods,
    };
  }, [history]);

  // 按日期分组的历史记录
  const groupedHistory = useMemo(() => {
    const groups: Record<string, HistoryRecord[]> = {};

    history.forEach((record) => {
      const date = new Date(record.timestamp);
      const dateKey = formatDateKey(date);

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(record);
    });

    return groups;
  }, [history]);

  return {
    history,
    addRecord,
    deleteRecord,
    clearHistory,
    getStatistics,
    groupedHistory,
  };
}

/**
 * 格式化日期为分组 key
 */
function formatDateKey(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const recordDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffDays = Math.floor((today.getTime() - recordDate.getTime()) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) {
    return '今天';
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
}
