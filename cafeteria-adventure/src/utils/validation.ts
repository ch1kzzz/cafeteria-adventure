import type { FoodOption, HistoryRecord } from '@/types';
import {
  MAX_FOOD_NAME_LENGTH,
  MIN_FOOD_NAME_LENGTH,
  MIN_FOOD_OPTIONS,
  MAX_FOOD_OPTIONS,
} from './constants';

/**
 * UUID 验证正则
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * 验证是否为有效的 UUID
 * @param id 待验证的字符串
 * @returns 是否为有效 UUID
 */
export function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

/**
 * 生成 UUID v4
 * @returns UUID 字符串
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 验证食物选项
 * @param data 待验证的数据
 * @returns 是否为有效的食物选项
 */
export function isValidFoodOption(data: unknown): data is FoodOption {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const { id, name, color } = data as Partial<FoodOption>;

  return (
    typeof id === 'string' &&
    isValidUUID(id) &&
    typeof name === 'string' &&
    name.length >= MIN_FOOD_NAME_LENGTH &&
    name.length <= MAX_FOOD_NAME_LENGTH &&
    typeof color === 'string' &&
    /^#[0-9A-Fa-f]{6}$/.test(color)
  );
}

/**
 * 验证历史记录
 * @param data 待验证的数据
 * @returns 是否为有效的历史记录
 */
export function isValidHistoryRecord(data: unknown): data is HistoryRecord {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const { id, foodId, foodName, timestamp } = data as Partial<HistoryRecord>;

  return (
    typeof id === 'string' &&
    isValidUUID(id) &&
    typeof foodId === 'string' &&
    typeof foodName === 'string' &&
    typeof timestamp === 'number' &&
    timestamp > 0
  );
}

/**
 * 验证食物名称
 * @param name 食物名称
 * @returns 验证结果
 */
export function validateFoodName(name: string): {
  valid: boolean;
  error?: string;
} {
  if (name.length < MIN_FOOD_NAME_LENGTH) {
    return { valid: false, error: `食物名称至少需要 ${MIN_FOOD_NAME_LENGTH} 个字符` };
  }

  if (name.length > MAX_FOOD_NAME_LENGTH) {
    return { valid: false, error: `食物名称最多 ${MAX_FOOD_NAME_LENGTH} 个字符` };
  }

  return { valid: true };
}

/**
 * 验证食物选项列表
 * @param options 食物选项列表
 * @returns 验证结果
 */
export function validateFoodOptions(options: FoodOption[]): {
  valid: boolean;
  error?: string;
} {
  if (options.length < MIN_FOOD_OPTIONS) {
    return { valid: false, error: `至少需要 ${MIN_FOOD_OPTIONS} 个食物选项` };
  }

  if (options.length > MAX_FOOD_OPTIONS) {
    return { valid: false, error: `最多支持 ${MAX_FOOD_OPTIONS} 个食物选项` };
  }

  // 检查是否有重复的 ID
  const ids = new Set(options.map((o) => o.id));
  if (ids.size !== options.length) {
    return { valid: false, error: '存在重复的食物 ID' };
  }

  // 检查是否有重复的名称
  const names = options.map((o) => o.name.toLowerCase());
  const uniqueNames = new Set(names);
  if (uniqueNames.size !== names.length) {
    return { valid: false, error: '存在重复的食物名称' };
  }

  return { valid: true };
}

/**
 * 清理输入的字符串
 * @param str 输入字符串
 * @returns 清理后的字符串
 */
export function sanitizeString(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * 截断字符串
 * @param str 输入字符串
 * @param maxLength 最大长度
 * @returns 截断后的字符串
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength - 1) + '…';
}
