import { useState, useRef, useEffect } from 'react'
import type { FoodOption, FoodEditorProps } from '@/types'
import { MAX_FOOD_NAME_LENGTH } from '@/utils/constants'
import './FoodEditor.css'

export function FoodEditor({ options, onAdd, onDelete, onUpdate }: FoodEditorProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmoji, setEditEmoji] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  // 常用表情符号
  const commonEmojis = ['🍲', '🍗', '🍚', '🍜', '🍝', '🍔', '🍕', '🥗', '🥘', '🍛', '🍜', '🍱']

  useEffect(() => {
    if (showAddForm && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showAddForm])

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingId])

  const handleAdd = () => {
    const trimmed = newName.trim()
    if (!trimmed) return

    try {
      onAdd(trimmed, newEmoji || undefined)
      setNewName('')
      setNewEmoji('')
      setShowAddForm(false)
    } catch (error) {
      alert(error instanceof Error ? error.message : '添加失败')
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个食物吗？')) {
      onDelete(id)
    }
  }

  const handleStartEdit = (option: FoodOption) => {
    setEditingId(option.id)
    setEditName(option.name)
    setEditEmoji(option.emoji || '')
  }

  const handleSaveEdit = () => {
    if (!editingId) return

    const trimmed = editName.trim()
    if (!trimmed) return

    try {
      onUpdate(editingId, { name: trimmed, emoji: editEmoji || undefined })
      setEditingId(null)
      setEditName('')
      setEditEmoji('')
    } catch (error) {
      alert(error instanceof Error ? error.message : '更新失败')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditEmoji('')
  }

  return (
    <div className="food-editor">
      <div className="food-editor-header">
        <h2>编辑食物</h2>
        <button className="btn-add" onClick={() => setShowAddForm(true)} disabled={showAddForm}>
          + 添加
        </button>
      </div>

      {/* 添加表单 */}
      {showAddForm && (
        <div className="food-form">
          <input
            ref={inputRef}
            type="text"
            className="food-input"
            placeholder="食物名称（如：兰州拉面）"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={MAX_FOOD_NAME_LENGTH}
          />
          <input
            type="text"
            className="emoji-input"
            placeholder="表情符号（可选）"
            value={newEmoji}
            onChange={(e) => setNewEmoji(e.target.value)}
            maxLength={2}
          />
          <div className="emoji-picker">
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="emoji-btn"
                onClick={() => setNewEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAdd}>
              确认
            </button>
            <button className="btn-secondary" onClick={() => setShowAddForm(false)}>
              取消
            </button>
          </div>
        </div>
      )}

      {/* 食物列表 */}
      <div className="food-list">
        {options.map((option) => (
          <div key={option.id} className="food-item" style={{ borderLeftColor: option.color }}>
            {editingId === option.id ? (
              // 编辑模式
              <div className="food-edit">
                <input
                  ref={inputRef}
                  type="text"
                  className="food-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={MAX_FOOD_NAME_LENGTH}
                />
                <input
                  type="text"
                  className="emoji-input"
                  placeholder="表情"
                  value={editEmoji}
                  onChange={(e) => setEditEmoji(e.target.value)}
                  maxLength={2}
                />
                <div className="edit-actions">
                  <button className="btn-icon btn-save" onClick={handleSaveEdit}>
                    ✓
                  </button>
                  <button className="btn-icon btn-cancel" onClick={handleCancelEdit}>
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              // 显示模式
              <>
                <div className="food-info">
                  {option.emoji && <span className="food-emoji">{option.emoji}</span>}
                  <span className="food-name">{option.name}</span>
                  <span
                    className="food-color"
                    style={{ backgroundColor: option.color }}
                    title={option.color}
                  />
                </div>
                <div className="food-actions">
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => handleStartEdit(option)}
                    title="编辑"
                  >
                    ✎
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handleDelete(option.id)}
                    title="删除"
                  >
                    🗑
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {options.length === 0 && (
        <div className="empty-state">
          <p>还没有食物选项，点击上方"添加"按钮添加</p>
        </div>
      )}
    </div>
  )
}
