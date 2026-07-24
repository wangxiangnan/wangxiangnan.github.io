/**
 * 第13章 配套代码示例
 * 主题：用 Tailwind CSS 样式化的 Todo 应用（含暗色模式）
 * 使用方式：需要先安装 Tailwind CSS，将代码复制到项目中使用
 * 安装命令：
 *   npm install -D tailwindcss postcss autoprefixer
 *   npx tailwindcss init -p
 * 学习要点：
 *   - Tailwind CSS 的实用优先理念
 *   - 常用类名：布局、间距、颜色、圆角、阴影
 *   - 暗色模式使用 dark: 前缀
 *   - 响应式设计使用 sm: md: lg: 前缀
 */

import { useState } from 'react';

// ========================================
// 1. TodoItem 组件 —— 单个待办事项（Tailwind 样式）
// ========================================
function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  // 保存编辑
  function handleSave() {
    const trimmed = editText.trim();
    if (trimmed) {
      onEdit(todo.id, trimmed);
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  }

  return (
    // Tailwind 类名：flex 布局、对齐、间距、边框、暗色模式
    <li className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 group">
      {/* 自定义样式的复选框 */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-400 cursor-pointer"
      />

      {/* 文本内容 */}
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') { setEditText(todo.text); setIsEditing(false); }
          }}
          autoFocus
          className="flex-1 px-3 py-1 border-2 border-blue-400 rounded-md focus:outline-none dark:bg-gray-800 dark:text-white"
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          className={`flex-1 text-base cursor-pointer transition-all ${
            todo.completed
              ? 'line-through text-gray-400 dark:text-gray-500'
              : 'text-gray-800 dark:text-gray-200'
          }`}
        >
          {todo.text}
        </span>
      )}

      {/* 操作按钮：默认隐藏，hover 时显示 */}
      {!isEditing && (
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded"
          >
            编辑
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded"
          >
            删除
          </button>
        </div>
      )}
    </li>
  );
}

// ========================================
// 2. FilterButton 组件 —— 筛选按钮
// ========================================
function FilterButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
        isActive
          ? 'bg-blue-500 text-white shadow-md'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );
}

// ========================================
// 3. StatsBar 组件 —— 统计信息条
// ========================================
function StatsBar({ total, active, completed, onClearCompleted }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
      <span>
        共 {total} 项 / 未完成 {active} / 已完成 {completed}
      </span>
      {completed > 0 && (
        <button
          onClick={onClearCompleted}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs"
        >
          清除已完成
        </button>
      )}
    </div>
  );
}

// ========================================
// 4. 暗色模式切换按钮
// ========================================
function DarkModeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-sm"
    >
      {/* 根据模式显示不同的图标 */}
      <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
      <span className="text-gray-700 dark:text-gray-300">
        {isDark ? '亮色模式' : '暗色模式'}
      </span>
    </button>
  );
}

// ========================================
// 5. TailwindTodoApp 组件 —— 完整的 Todo 应用
// ========================================
function TailwindTodoApp() {
  // 待办事项列表
  const [todos, setTodos] = useState([
    { id: 1, text: '安装 Tailwind CSS', completed: true },
    { id: 2, text: '配置 tailwind.config.js', completed: true },
    { id: 3, text: '使用 Tailwind 构建 Todo 应用', completed: false },
    { id: 4, text: '添加暗色模式支持', completed: false },
  ]);

  const [newTodoText, setNewTodoText] = useState('');
  const [filter, setFilter] = useState('all');
  const [isDark, setIsDark] = useState(false);

  // 添加待办事项
  function handleAdd(e) {
    e.preventDefault();
    const text = newTodoText.trim();
    if (!text) return;
    setTodos((prev) => [{ id: Date.now(), text, completed: false }, ...prev]);
    setNewTodoText('');
  }

  // 切换完成状态
  function handleToggle(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  // 删除
  function handleDelete(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  // 编辑
  function handleEdit(id, newText) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  }

  // 清除已完成
  function handleClearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  // 切换暗色模式
  function toggleDarkMode() {
    setIsDark(!isDark);
    // 在实际项目中，需要给 html 元素添加/移除 'dark' 类
    document.documentElement.classList.toggle('dark');
  }

  // 筛选列表
  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  // 统计数据
  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    // 根容器：全屏高度、居中、渐变背景、暗色模式支持
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-lg mx-auto px-4 py-8 sm:py-16">
        {/* 头部：标题 + 暗色模式切换 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              我的待办
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Tailwind CSS 样式化版本
            </p>
          </div>
          <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
        </div>

        {/* 添加表单 */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="添加新的待办事项..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-blue-400 dark:focus:border-blue-500 focus:outline-none transition-colors shadow-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            添加
          </button>
        </form>

        {/* 筛选按钮 */}
        <div className="flex gap-2 mb-4">
          <FilterButton label="全部" isActive={filter === 'all'} onClick={() => setFilter('all')} />
          <FilterButton label="未完成" isActive={filter === 'active'} onClick={() => setFilter('active')} />
          <FilterButton label="已完成" isActive={filter === 'completed'} onClick={() => setFilter('completed')} />
        </div>

        {/* 待办列表卡片 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredTodos.length === 0 ? (
              <li className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">
                {filter === 'all' ? '还没有待办事项，添加一个吧！' : '没有匹配的待办事项'}
              </li>
            ) : (
              filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))
            )}
          </ul>

          {/* 底部统计 */}
          {todos.length > 0 && (
            <StatsBar
              total={todos.length}
              active={activeCount}
              completed={completedCount}
              onClearCompleted={handleClearCompleted}
            />
          )}
        </div>

        {/* 底部提示 */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          双击待办事项可编辑 | 支持暗色模式 | 响应式设计
        </p>
      </div>
    </div>
  );
}

// ========================================
// 6. 主应用组件
// ========================================
function App() {
  return <TailwindTodoApp />;
}

export default App;
