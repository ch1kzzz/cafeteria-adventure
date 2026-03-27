/**
 * 缓动函数 - ease-out-cubic
 * @param t 进度值 (0-1)
 * @returns 缓动后的值
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * 缓动函数 - ease-out-quart
 * @param t 进度值 (0-1)
 * @returns 缓动后的值
 */
export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * 缓动函数 - ease-out-expo
 * @param t 进度值 (0-1)
 * @returns 缓动后的值
 */
export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * 计算转盘旋转角度
 * @param selectedIndex 目标选项索引
 * @param totalOptions 总选项数
 * @param extraSpins 额外旋转圈数
 * @returns 旋转角度（度）
 */
export function calculateRotation(
  selectedIndex: number,
  totalOptions: number,
  extraSpins: number = 3,
): number {
  // 每个扇区的角度
  const sectorAngle = 360 / totalOptions;

  // 计算目标角度（指针在顶部，需要反向计算）
  // 目标是让选中扇区的中心对准顶部指针（270度或-90度位置）
  const targetAngle = 270 - selectedIndex * sectorAngle - sectorAngle / 2;

  // 加上额外旋转圈数
  const totalRotation = extraSpins * 360 + targetAngle;

  // 确保角度为正数
  return totalRotation < 0 ? totalRotation + 360 * Math.ceil(Math.abs(totalRotation) / 360) : totalRotation;
}

/**
 * 根据角度计算选中的索引
 * @param angle 当前角度（0-360）
 * @param totalOptions 总选项数
 * @returns 选中的索引
 */
export function getIndexFromAngle(angle: number, totalOptions: number): number {
  // 标准化角度到 0-360
  const normalizedAngle = ((angle % 360) + 360) % 360;

  // 指针在顶部（270度或-90度位置）
  // 计算哪个扇区对准了顶部
  const sectorAngle = 360 / totalOptions;
  const pointerAngle = (270 - normalizedAngle + 360) % 360;

  return Math.floor(pointerAngle / sectorAngle) % totalOptions;
}

/**
 * 动画帧辅助类
 */
export class AnimationFrame {
  private rafId: number | null = null;
  private startTime: number | null = null;
  private duration: number;
  private callback: (progress: number) => boolean | void;

  constructor(duration: number, callback: (progress: number) => boolean | void) {
    this.duration = duration;
    this.callback = callback;
  }

  /**
   * 开始动画
   */
  start(): void {
    this.startTime = performance.now();
    this.tick();
  }

  /**
   * 动画循环
   */
  private tick = (): void => {
    if (this.startTime === null) return;

    const currentTime = performance.now();
    const elapsed = currentTime - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);

    const shouldContinue = this.callback(progress);

    if (progress < 1 && shouldContinue !== false) {
      this.rafId = requestAnimationFrame(this.tick);
    } else {
      this.stop();
    }
  };

  /**
   * 停止动画
   */
  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.startTime = null;
  }

  /**
   * 取消动画
   */
  cancel(): void {
    this.stop();
  }
}

/**
 * 延迟执行
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = delay - (now - lastCall);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      fn.apply(this, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}
