import { useState, useEffect, useCallback } from 'react';
import type { FoodOption } from '@/types';
import { StorageService } from '@/utils/storage';
import { STORAGE_KEYS, DEFAULT_FOOD_OPTIONS } from '@/utils/constants';
import { generateUUID, validateFoodName, validateFoodOptions } from '@/utils/validation';
import { generateRandomColor } from '@/utils/colors';
import type { UseFoodOptionsReturn } from '@/types';

/**
 * 食物选项管理 Hook
 */
export function useFoodOptions(): UseFoodOptionsReturn {
  const [options, setOptions] = useState<FoodOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 加载食物选项
  useEffect(() => {
    try {
      const stored = StorageService.get<FoodOption[]>(STORAGE_KEYS.FOOD_OPTIONS);
      setOptions(stored || DEFAULT_FOOD_OPTIONS);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load food options'));
      setOptions(DEFAULT_FOOD_OPTIONS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 保存食物选项
  const saveOptions = useCallback((newOptions: FoodOption[]) => {
    const validation = validateFoodOptions(newOptions);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    setOptions(newOptions);
    StorageService.set(STORAGE_KEYS.FOOD_OPTIONS, newOptions);
  }, []);

  // 添加新食物
  const addOption = useCallback(
    (name: string, emoji?: string) => {
      const validation = validateFoodName(name);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const newOption: FoodOption = {
        id: generateUUID(),
        name: name.trim(),
        emoji,
        color: generateRandomColor(),
        weight: 1,
      };

      saveOptions([...options, newOption]);
    },
    [options, saveOptions],
  );

  // 删除食物
  const removeOption = useCallback(
    (id: string) => {
      const newOptions = options.filter((opt) => opt.id !== id);

      const validation = validateFoodOptions(newOptions);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      saveOptions(newOptions);
    },
    [options, saveOptions],
  );

  // 更新食物
  const updateOption = useCallback(
    (id: string, data: Partial<FoodOption>) => {
      const index = options.findIndex((opt) => opt.id === id);
      if (index === -1) {
        throw new Error('Food option not found');
      }

      // 如果更新名称，验证新名称
      if (data.name !== undefined) {
        const validation = validateFoodName(data.name);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        data.name = data.name.trim();
      }

      const newOptions = [...options];
      newOptions[index] = { ...newOptions[index], ...data };

      saveOptions(newOptions);
    },
    [options, saveOptions],
  );

  // 重排序食物
  const reorderOptions = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex < 0 || fromIndex >= options.length || toIndex < 0 || toIndex >= options.length) {
        throw new Error('Invalid index');
      }

      const newOptions = [...options];
      const [removed] = newOptions.splice(fromIndex, 1);
      newOptions.splice(toIndex, 0, removed);

      saveOptions(newOptions);
    },
    [options, saveOptions],
  );

  // 重置为默认选项
  const resetToDefaults = useCallback(() => {
    setOptions(DEFAULT_FOOD_OPTIONS);
    StorageService.set(STORAGE_KEYS.FOOD_OPTIONS, DEFAULT_FOOD_OPTIONS);
  }, []);

  return {
    options,
    addOption,
    removeOption,
    updateOption,
    reorderOptions,
    resetToDefaults,
    isLoading,
    error,
  };
}
