import type { FoodOption, AppSettings } from '@/types';

/**
 * 存储键名
 */
export const STORAGE_KEYS = {
  /** 食物选项列表 */
  FOOD_OPTIONS: 'cafeteria_food_options',
  /** 历史记录列表 */
  HISTORY: 'cafeteria_history',
  /** 应用设置 */
  SETTINGS: 'cafeteria_settings',
  /** 数据版本 */
  VERSION: 'cafeteria_version',
} as const;

/**
 * 当前数据版本
 */
export const CURRENT_DATA_VERSION = 1;

/**
 * 默认食物选项列表
 */
export const DEFAULT_FOOD_OPTIONS: FoodOption[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: '麻辣烫',
    emoji: '🍲',
    color: '#FF6B6B',
    weight: 1,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: '黄焖鸡',
    emoji: '🍗',
    color: '#4ECDC4',
    weight: 1,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: '盖浇饭',
    emoji: '🍚',
    color: '#45B7D1',
    weight: 1,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: '面条',
    emoji: '🍜',
    color: '#FFA07A',
    weight: 1,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: '炸鸡',
    emoji: '🍗',
    color: '#FFD93D',
    weight: 1,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: '沙拉',
    emoji: '🥗',
    color: '#6BCB77',
    weight: 1,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: '粥',
    emoji: '🥣',
    color: '#4D96FF',
    weight: 1,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    name: '烧烤',
    emoji: '🍢',
    color: '#FF6F91',
    weight: 1,
  },
];

/**
 * 默认应用设置
 */
export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: false,
  animationEnabled: true,
  spinDuration: 3,
  theme: 'light',
};

/**
 * 颜色面板
 */
export const COLOR_PALETTE = [
  '#FF6B6B', // 活力橙红
  '#4ECDC4', // 清新青
  '#45B7D1', // 天蓝
  '#FFA07A', // 浅橙
  '#FFD93D', // 明黄
  '#6BCB77', // 草绿
  '#4D96FF', // 宝蓝
  '#FF6F91', // 粉红
  '#845EC2', // 紫色
  '#FF9671', // 珊瑚
] as const;

/**
 * 最大历史记录数量
 */
export const MAX_HISTORY_RECORDS = 100;

/**
 * 最小食物选项数量
 */
export const MIN_FOOD_OPTIONS = 2;

/**
 * 最大食物选项数量
 */
export const MAX_FOOD_OPTIONS = 20;

/**
 * 最小转盘尺寸
 */
export const MIN_WHEEL_SIZE = 280;

/**
 * 最大转盘尺寸
 */
export const MAX_WHEEL_SIZE = 500;

/**
 * 食物名称最大长度
 */
export const MAX_FOOD_NAME_LENGTH = 20;

/**
 * 食物名称最小长度
 */
export const MIN_FOOD_NAME_LENGTH = 1;
