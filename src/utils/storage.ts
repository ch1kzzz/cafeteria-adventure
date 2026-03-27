/**
 * LocalStorage 封装服务
 * 提供类型安全的本地存储操作
 */
export class StorageService {
  /**
   * 获取存储的数据
   * @param key 存储键名
   * @returns 解析后的数据，不存在或解析失败时返回 null
   */
  static get<T>(key: string): T | null {
    if (typeof window === 'undefined') {
      return null
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item === null) {
        return null
      }
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error)
      return null
    }
  }

  /**
   * 存储数据
   * @param key 存储键名
   * @param value 要存储的值
   */
  static set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const serialized = JSON.stringify(value)
      window.localStorage.setItem(key, serialized)
    } catch (error) {
      console.error(`Error writing to localStorage (key: ${key}):`, error)
      // 存储空间不足时的处理
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded, attempting to clear old data...')
        this.clearOldKeys()
        // 重试一次
        try {
          window.localStorage.setItem(key, JSON.stringify(value))
        } catch (retryError) {
          console.error('Failed to save after clearing old data:', retryError)
        }
      }
    }
  }

  /**
   * 删除指定键的数据
   * @param key 存储键名
   */
  static remove(key: string): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error)
    }
  }

  /**
   * 清空所有应用数据
   */
  static clear(): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }

  /**
   * 检查键是否存在
   * @param key 存储键名
   */
  static has(key: string): boolean {
    if (typeof window === 'undefined') {
      return false
    }

    try {
      return window.localStorage.getItem(key) !== null
    } catch (error) {
      console.error(`Error checking localStorage (key: ${key}):`, error)
      return false
    }
  }

  /**
   * 获取所有键名
   */
  static keys(): string[] {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      return Object.keys(window.localStorage)
    } catch (error) {
      console.error('Error getting localStorage keys:', error)
      return []
    }
  }

  /**
   * 清除不是应用相关的旧键
   * 用于存储空间不足时清理
   */
  private static clearOldKeys(): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const allKeys = Object.keys(window.localStorage)
      // 删除不是以 'cafeteria_' 开头的键
      const oldKeys = allKeys.filter((key) => !key.startsWith('cafeteria_'))

      // 删除旧键
      oldKeys.forEach((key) => {
        window.localStorage.removeItem(key)
      })

      console.log(`Cleared ${oldKeys.length} old keys from localStorage`)
    } catch (error) {
      console.error('Error clearing old keys:', error)
    }
  }

  /**
   * 获取存储大小（字节）
   */
  static getStorageSize(): number {
    if (typeof window === 'undefined') {
      return 0
    }

    try {
      let total = 0
      for (const key in window.localStorage) {
        if (Object.prototype.hasOwnProperty.call(window.localStorage, key)) {
          total += key.length + window.localStorage[key].length
        }
      }
      return total
    } catch (error) {
      console.error('Error calculating storage size:', error)
      return 0
    }
  }

  /**
   * 备份数据到另一个键
   */
  static backup(backupKey: string = 'cafeteria_backup'): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const backup: Record<string, string> = {}
      const appKeys = Object.keys(window.localStorage).filter((key) => key.startsWith('cafeteria_'))

      appKeys.forEach((key) => {
        const value = window.localStorage.getItem(key)
        if (value !== null) {
          backup[key] = value
        }
      })

      window.localStorage.setItem(backupKey, JSON.stringify(backup))
      window.localStorage.setItem(`${backupKey}_date`, Date.now().toString())
    } catch (error) {
      console.error('Error creating backup:', error)
    }
  }

  /**
   * 从备份恢复数据
   */
  static restore(backupKey: string = 'cafeteria_backup'): boolean {
    if (typeof window === 'undefined') {
      return false
    }

    try {
      const backupData = window.localStorage.getItem(backupKey)
      if (!backupData) {
        return false
      }

      const backup = JSON.parse(backupData) as Record<string, string>
      Object.entries(backup).forEach(([key, value]) => {
        window.localStorage.setItem(key, value)
      })

      return true
    } catch (error) {
      console.error('Error restoring from backup:', error)
      return false
    }
  }
}
