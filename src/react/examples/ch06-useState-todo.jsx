/**
 * 第6章 配套代码示例
 * 主题：完整的 Todo 应用（useState 版本），含增删改查
 * 使用方式：将代码复制到 React 项目的组件文件中使用
 * 功能列表：
 *   - 添加待办事项
 *   - 删除待办事项
 *   - 编辑待办事项
 *   - 标记完成/未完成
 *   - 按状态筛选（全部/未完成/已完成）
 *   - 清除所有已完成项
 */

import { useState } from 'react';

// ========================================
// 1. TodoItem 组件 —— 单个待办事项
// ========================================
/**
 * 单个待办事项组件
 * @param {object} todo - 待办事项对象 { id, text, completed }
 * @param {function} onToggle - 切换完成状态
 * @param {function} onDelete - 删除
 * @param {function} onEdit - 编辑
 */
function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  // 是否处于编辑模式
  const [isEditing, setIsEditing] = useState(false);
  // 编辑时的临时文本
  const [editText, setEditText] = useState(todo.text);

  // 保存编辑
  function handleSave() {
    // 不允许保存空文本
    if (editText.trim() === '') {
      setEditText(todo.text); // 恢复原文
    } else {
      onEdit(todo.id, editText.trim());
    }
    setIsEditing(false);
  }

  // 按回车保存，按 Escape 取消
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text); // 恢复原文
      setIsEditing(false);
    }
  }

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #eee',
        backgroundColor: todo.completed ? '#f9f9f9' : 'white',
        transition: 'all 0.2s',
      }}
    >
      {/* 复选框：切换完成状态 */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        style={{ marginRight: '12px', width: '18px', height: '18px' }}
      />

      {/* 文本区域：编辑模式或显示模式 */}
      {isEditing ? (
        // 编辑模式：显示输入框
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave} // 失去焦点时保存
          onKeyDown={handleKeyDown}
          autoFocus // 自动聚焦
          style={{
            flex: 1,
            padding: '4px 8px',
            fontSize: '16px',
            border: '2px solid #1976d2',
            borderRadius: '4px',
          }}
        />
      ) : (
        // 显示模式：显示文本
        <span
          onDoubleClick={() => setIsEditing(true)} // 双击进入编辑
          style={{
            flex: 1,
            fontSize: '16px',
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? '#999' : '#333',
            cursor: 'pointer',
          }}
          title="双击编辑"
        >
          {todo.text}
        </span>
      )}

      {/* 操作按钮 */}
      <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
        {!isEditing && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '4px 10px',
                fontSize: '12px',
                border: '1px solid #1976d2',
                color: '#1976d2',
                backgroundColor: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              编辑
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              style={{
                padding: '4px 10px',
                fontSize: '12px',
                border: '1px solid #d32f2f',
                color: '#d32f2f',
                backgroundColor: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              删除
            </button>
          </>
        )}
      </div>
    </li>
  );
}

// ========================================
// 2. TodoApp 组件 —— 完整的 Todo 应用
// ========================================
function TodoApp() {
  // ---- 状态定义 ----
  // 待办事项列表
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React 基础', completed: true },
    { id: 2, text: '理解 useState Hook', completed: false },
    { id: 3, text: '构建一个 Todo 应用', completed: false },
  ]);

  // 新待办事项的输入值
  const [newTodoText, setNewTodoText] = useState('');

  // 当前筛选状态：'all' | 'active' | 'completed'
  const [filter, setFilter] = useState('all');

  // ---- 增：添加待办事项 ----
  function handleAddTodo(e) {
    e.preventDefault(); // 阻止表单默认提交

    const text = newTodoText.trim();
    if (text === '') return; // 不允许添加空内容

    // 创建新的待办事项对象
    const newTodo = {
      id: Date.now(), // 用时间戳作为唯一 ID
      text: text,
      completed: false,
    };

    // 添加到列表头部（使用展开运算符创建新数组）
    setTodos((prev) => [newTodo, ...prev]);
    // 清空输入框
    setNewTodoText('');
  }

  // ---- 删：删除待办事项 ----
  function handleDeleteTodo(id) {
    // filter 方法返回不包含指定 ID 的新数组
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  // ---- 改（状态）：切换完成状态 ----
  function handleToggleTodo(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        // 找到匹配的 todo，反转其 completed 状态
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  // ---- 改（文本）：编辑待办事项 ----
  function handleEditTodo(id, newText) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  }

  // ---- 清除所有已完成 ----
  function handleClearCompleted() {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }

  // ---- 查：根据筛选条件过滤列表 ----
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all' 显示全部
  });

  // 统计数据
  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  // ---- 渲染 ----
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>我的待办事项</h1>

      {/* 添加待办事项的表单 */}
      <form onSubmit={handleAddTodo} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="添加新的待办事项..."
          style={{
            flex: 1,
            padding: '10px 16px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 24px',
            fontSize: '16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          添加
        </button>
      </form>

      {/* 筛选按钮组 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', justifyContent: 'center' }}>
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              backgroundColor: filter === f ? '#1976d2' : '#e0e0e0',
              color: filter === f ? 'white' : '#333',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
            }}
          >
            {f === 'all' ? '全部' : f === 'active' ? '未完成' : '已完成'}
          </button>
        ))}
      </div>

      {/* 待办事项列表 */}
      <ul style={{ listStyle: 'none', padding: 0, border: '1px solid #eee', borderRadius: '8px' }}>
        {filteredTodos.length === 0 ? (
          <li style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
            {filter === 'all' ? '还没有待办事项，添加一个吧！' : '没有匹配的待办事项'}
          </li>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onEdit={handleEditTodo}
            />
          ))
        )}
      </ul>

      {/* 底部统计和操作 */}
      {todos.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            marginTop: '8px',
            fontSize: '14px',
            color: '#666',
          }}
        >
          <span>
            共 {todos.length} 项，未完成 {activeCount} 项，已完成 {completedCount} 项
          </span>
          {completedCount > 0 && (
            <button
              onClick={handleClearCompleted}
              style={{
                padding: '4px 12px',
                fontSize: '13px',
                color: '#d32f2f',
                backgroundColor: 'transparent',
                border: '1px solid #d32f2f',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              清除已完成
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ========================================
// 3. 主应用组件
// ========================================
function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <TodoApp />
    </div>
  );
}

export default App;
