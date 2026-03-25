import { COLOR_PALETTE } from './constants';

/**
 * 生成随机颜色
 * @returns 随机 HEX 颜色值
 */
export function generateRandomColor(): string {
  return COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
}

/**
 * 根据索引获取颜色
 * @param index 索引
 * @returns HEX 颜色值
 */
export function getColorByIndex(index: number): string {
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
}

/**
 * 生成随机 HEX 颜色
 * @returns 随机 HEX 颜色值
 */
export function generateRandomHexColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * 验证 HEX 颜色值
 * @param color 颜色字符串
 * @returns 是否为有效的 HEX 颜色
 */
export function isValidHexColor(color: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);
}

/**
 * 调整颜色亮度
 * @param color HEX 颜色值
 * @param amount 亮度调整量 (-100 到 100)
 * @returns 调整后的 HEX 颜色值
 */
export function adjustColorBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const adjust = (value: number) => {
    const adjusted = Math.round(value + (amount * value) / 100);
    return Math.max(0, Math.min(255, adjusted));
  };

  const newR = adjust(r);
  const newG = adjust(g);
  const newB = adjust(b);

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * 获取颜色的对比色（黑色或白色）
 * @param color HEX 颜色值
 * @returns 对比色
 */
export function getContrastColor(color: string): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // 计算亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? '#000000' : '#FFFFFF';
}

/**
 * 颜色数组去重
 * @param colors 颜色数组
 * @returns 去重后的颜色数组
 */
export function uniqueColors(colors: string[]): string[] {
  return Array.from(new Set(colors));
}

/**
 * 将颜色转换为 RGBA
 * @param color HEX 颜色值
 * @param alpha 透明度 (0-1)
 * @returns RGBA 颜色值
 */
export function hexToRgba(color: string, alpha: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
