import { useState } from 'react';
import type { HistoryRecord, HistoryListProps, Statistics } from '@/types';
import { formatDateKey, formatTime } from '@/utils/format';
import './HistoryList.css';

export function HistoryList({ history, onDelete, onClear, showStatistics = true }: HistoryListProps) {
  const [showStats, setShowStats] = useState(false);

  // 按日期分组
  const groupedHistory = history.reduce<Record<string, HistoryRecord[]>>((acc, record) => {
    const dateKey = formatDateKey(new Date(record.timestamp));
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(record);
    return acc;
  }, {});

  // 获取统计信息
  const getStatistics = (): Statistics => {
    const totalSpins = history.length;

    if (totalSpins === 0) {
      return {
        totalSpins: 0,
        topFoods: [],
        recentSpins: 0,
        leastRecentFoods: [],
      };
    }

    const foodCounts = new Map<string, number>();
    history.forEach((record) => {
      foodCounts.set(record.foodName, (foodCounts.get(record.foodName) || 0) + 1);
    });

    const topFoods = Array.from(foodCounts.entries())
      .map(([foodName, count]) => ({
        foodName,
        count,
        percentage: (count / totalSpins) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentSpins = history.filter((record) => record.timestamp > sevenDaysAgo).length;

    return {
      totalSpins,
      topFoods,
      recentSpins,
      leastRecentFoods: [],
    };
  };

  const stats = getStatistics();

  const handleClear = () => {
    if (window.confirm('确定要清空所有历史记录吗？')) {
      onClear();
    }
  };

  return (
    <div className="history-list">
      <div className="history-header">
        <h2>历史记录</h2>
        {history.length > 0 && (
          <div className="header-actions">
            {showStatistics && (
              <button
                className="btn-stats"
                onClick={() => setShowStats(!showStats)}
              >
                {showStats ? '隐藏统计' : '统计'}
              </button>
            )}
            <button className="btn-clear" onClick={handleClear}>
              清空
            </button>
          </div>
        )}
      </div>

      {/* 统计信息 */}
      {showStats && stats.totalSpins > 0 && (
        <div className="statistics-panel">
          <div className="stat-item">
            <span className="stat-label">总抽取次数</span>
            <span className="stat-value">{stats.totalSpins}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">最近7天</span>
            <span className="stat-value">{stats.recentSpins}</span>
          </div>
          {stats.topFoods.length > 0 && (
            <div className="stat-item full-width">
              <span className="stat-label">最受欢迎</span>
              <div className="top-foods">
                {stats.topFoods.slice(0, 3).map((food) => (
                  <div key={food.foodName} className="top-food-item">
                    <span className="food-name">{food.foodName}</span>
                    <span className="food-count">{food.count}次</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 历史记录列表 */}
      {Object.keys(groupedHistory).length === 0 ? (
        <div className="empty-state">
          <p>还没有抽取记录</p>
          <p className="empty-hint">去转个食物吧！</p>
        </div>
      ) : (
        <div className="history-groups">
          {Object.entries(groupedHistory).map(([dateKey, records]) => (
            <div key={dateKey} className="history-group">
              <div className="history-date">{dateKey}</div>
              {records.map((record) => (
                <div key={record.id} className="history-item">
                  <div className="history-food">
                    {record.foodEmoji && <span className="history-emoji">{record.foodEmoji}</span>}
                    <span className="history-name">{record.foodName}</span>
                  </div>
                  <div className="history-meta">
                    <span className="history-time">{formatTime(record.timestamp)}</span>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(record.id)}
                      title="删除"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
