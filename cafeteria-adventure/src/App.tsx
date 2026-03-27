import { useState, useRef } from 'react';
import { WheelOfFortune } from './components/WheelOfFortune';
import { FoodEditor } from './components/FoodEditor';
import { HistoryList } from './components/HistoryList';
import { useFoodOptions } from './hooks/useFoodOptions';
import { useHistory } from './hooks/useHistory';
import type { FoodOption, WheelOfFortuneRef } from './types';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'wheel' | 'editor' | 'history'>('wheel');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<FoodOption | null>(null);
  const wheelRef = useRef<WheelOfFortuneRef>(null);

  const { options, addOption, removeOption, updateOption, isLoading } = useFoodOptions();
  const { history, addRecord, deleteRecord, clearHistory } = useHistory();

  // 开始旋转
  const handleSpin = () => {
    if (options.length === 0 || wheelRef.current?.isSpinning) return;

    // 随机选择一个索引
    const targetIndex = Math.floor(Math.random() * options.length);
    wheelRef.current?.spin(targetIndex);
  };

  // 旋转结束
  const handleSpinEnd = (food: FoodOption) => {
    setResult(food);
    setShowResult(true);
    addRecord(food);
  };

  // 关闭结果弹窗
  const handleCloseResult = () => {
    setShowResult(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">食堂大冒险</h1>
        <p className="app-subtitle">今天吃什么？转盘来决定！</p>
      </header>

      <main className="app-main">
        {currentPage === 'wheel' && (
          <div className="page wheel-page">
            <div className="wheel-container">
              <WheelOfFortune
                ref={wheelRef}
                options={options}
                size={Math.min(window.innerWidth - 48, 350)}
                onSpinEnd={handleSpinEnd}
                disabled={wheelRef.current?.isSpinning}
              />
            </div>

            <button
              className="btn-spin"
              onClick={handleSpin}
              disabled={options.length === 0 || wheelRef.current?.isSpinning}
            >
              {wheelRef.current?.isSpinning ? '旋转中...' : '开始'}
            </button>

            {isLoading && <p className="loading-text">加载中...</p>}
          </div>
        )}

        {currentPage === 'editor' && (
          <div className="page editor-page">
            <FoodEditor
              options={options}
              onAdd={addOption}
              onDelete={removeOption}
              onUpdate={updateOption}
            />
          </div>
        )}

        {currentPage === 'history' && (
          <div className="page history-page">
            <HistoryList
              history={history}
              onDelete={deleteRecord}
              onClear={clearHistory}
            />
          </div>
        )}
      </main>

      {/* 结果弹窗 */}
      {showResult && result && (
        <div className="modal-overlay" onClick={handleCloseResult}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="result-emoji">{result.emoji || '🎉'}</div>
            <h2 className="result-title">{result.name}</h2>
            <p className="result-subtitle">就是它了！</p>
            <button className="btn-modal-close" onClick={handleCloseResult}>
              太棒了
            </button>
          </div>
        </div>
      )}

      {/* 底部导航 */}
      <nav className="app-nav">
        <button
          className={`nav-item ${currentPage === 'wheel' ? 'active' : ''}`}
          onClick={() => setCurrentPage('wheel')}
        >
          <span className="nav-icon">🎡</span>
          <span className="nav-label">转盘</span>
        </button>
        <button
          className={`nav-item ${currentPage === 'editor' ? 'active' : ''}`}
          onClick={() => setCurrentPage('editor')}
        >
          <span className="nav-icon">✏️</span>
          <span className="nav-label">编辑</span>
        </button>
        <button
          className={`nav-item ${currentPage === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentPage('history')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">历史</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
