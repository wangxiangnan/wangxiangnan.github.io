/**
 * 第17章 配套代码示例
 * 主题：任务看板（Kanban Board）完整应用 —— 组件 + Zustand Store
 * 使用方式：
 *   - 核心逻辑部分可直接复制运行
 *   - 如需完整 Zustand 集成，请先安装：npm install zustand
 * 功能列表：
 *   - 三列看板：待办、进行中、已完成
 *   - 添加任务卡片
 *   - 在列之间移动任务
 *   - 编辑和删除任务
 *   - 任务优先级标记
 */

import { useState, useCallback } from 'react';

// ========================================
// 1. Zustand Store 定义（模拟版，无需安装 zustand 即可运行）
// ========================================
/**
 * 在实际项目中，这里应该使用 Zustand 的 create 函数：
 *
 * import { create } from 'zustand';
 * const useKanbanStore = create((set) => ({ ... }));
 *
 * 这里为了示例可以直接运行，用 useReducer 模拟 Zustand 的行为。
 */

// 初始看板数据
const initialBoardData = {
  columns: {
    todo: {
      id: 'todo',
      title: '待办',
      color: '#f59e0b',    // 黄色
      taskIds: ['task-1', 'task-2', 'task-3'],
    },
    inProgress: {
      id: 'inProgress',
      title: '进行中',
      color: '#3b82f6',    // 蓝色
      taskIds: ['task-4', 'task-5'],
    },
    done: {
      id: 'done',
      title: '已完成',
      color: '#10b981',    // 绿色
      taskIds: ['task-6'],
    },
  },
  tasks: {
    'task-1': { id: 'task-1', title: '设计数据库结构', priority: 'high', description: '定义用户表、订单表、商品表的关系' },
    'task-2': { id: 'task-2', title: '搭建项目框架', priority: 'high', description: '使用 Vite + React + TypeScript 初始化项目' },
    'task-3': { id: 'task-3', title: '编写 API 文档', priority: 'low', description: '使用 Swagger 或 Apifox 编写接口文档' },
    'task-4': { id: 'task-4', title: '实现用户登录', priority: 'medium', description: '包含邮箱登录和第三方 OAuth 登录' },
    'task-5': { id: 'task-5', title: '首页 UI 开发', priority: 'medium', description: '根据设计稿实现首页布局' },
    'task-6': { id: 'task-6', title: '项目需求分析', priority: 'low', description: '与客户确认功能需求和交付时间' },
  },
  columnOrder: ['todo', 'inProgress', 'done'],
};

// 简单的状态管理 Hook（模拟 Zustand）
function useKanbanStore() {
  const [state, setState] = useState(initialBoardData);

  // 添加任务到指定列
  const addTask = useCallback((columnId, taskData) => {
    const taskId = `task-${Date.now()}`;
    setState((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: { id: taskId, ...taskData },
      },
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          taskIds: [...prev.columns[columnId].taskIds, taskId],
        },
      },
    }));
  }, []);

  // 删除任务
  const deleteTask = useCallback((taskId) => {
    setState((prev) => {
      // 从所有列中移除该任务
      const newColumns = { ...prev.columns };
      Object.keys(newColumns).forEach((colId) => {
        newColumns[colId] = {
          ...newColumns[colId],
          taskIds: newColumns[colId].taskIds.filter((id) => id !== taskId),
        };
      });
      // 从 tasks 中删除
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];
      return { ...prev, columns: newColumns, tasks: newTasks };
    });
  }, []);

  // 更新任务
  const updateTask = useCallback((taskId, updates) => {
    setState((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: { ...prev.tasks[taskId], ...updates },
      },
    }));
  }, []);

  // 移动任务到另一列
  const moveTask = useCallback((taskId, fromColumnId, toColumnId) => {
    if (fromColumnId === toColumnId) return;
    setState((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [fromColumnId]: {
          ...prev.columns[fromColumnId],
          taskIds: prev.columns[fromColumnId].taskIds.filter((id) => id !== taskId),
        },
        [toColumnId]: {
          ...prev.columns[toColumnId],
          taskIds: [...prev.columns[toColumnId].taskIds, taskId],
        },
      },
    }));
  }, []);

  return { ...state, addTask, deleteTask, updateTask, moveTask };
}

// ========================================
// 2. TaskCard 组件 —— 单个任务卡片
// ========================================
function TaskCard({ task, columnId, onDelete, onEdit, onMove, columnIds, columnTitles }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  // 优先级对应的颜色
  const priorityColors = {
    high: { bg: '#fee2e2', text: '#dc2626', label: '高' },
    medium: { bg: '#fef3c7', text: '#d97706', label: '中' },
    low: { bg: '#dcfce7', text: '#16a34a', label: '低' },
  };

  const priority = priorityColors[task.priority] || priorityColors.low;

  // 保存编辑
  function handleSave() {
    if (editTitle.trim()) {
      onEdit(task.id, { title: editTitle.trim() });
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  }

  return (
    <div
      style={{
        padding: '12px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '8px',
        borderLeft: `4px solid ${priority.text}`,
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* 优先级标签 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: priority.bg,
            color: priority.text,
            borderRadius: '4px',
          }}
        >
          {priority.label}优先级
        </span>
        <button
          onClick={() => onDelete(task.id)}
          style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#999', fontSize: '16px' }}
          title="删除任务"
        >
          ×
        </button>
      </div>

      {/* 任务标题 */}
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
          autoFocus
          style={{ width: '100%', padding: '4px', fontSize: '14px', border: '1px solid #3b82f6', borderRadius: '4px', boxSizing: 'border-box' }}
        />
      ) : (
        <p
          onDoubleClick={() => setIsEditing(true)}
          style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
          title="双击编辑"
        >
          {task.title}
        </p>
      )}

      {/* 任务描述 */}
      {task.description && (
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', lineHeight: 1.4 }}>
          {task.description}
        </p>
      )}

      {/* 移动到其他列的按钮 */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {columnIds
          .filter((id) => id !== columnId)
          .map((targetColId) => (
            <button
              key={targetColId}
              onClick={() => onMove(task.id, columnId, targetColId)}
              style={{
                padding: '2px 8px',
                fontSize: '11px',
                border: '1px solid #ddd',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              → {columnTitles[targetColId]}
            </button>
          ))}
      </div>
    </div>
  );
}

// ========================================
// 3. KanbanColumn 组件 —— 看板列
// ========================================
function KanbanColumn({ column, tasks, onDelete, onEdit, onMove, onAddTask, columnIds, columnTitles }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  // 添加新任务
  function handleAddTask(e) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(column.id, {
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      description: '',
    });
    setNewTaskTitle('');
    setShowAddForm(false);
  }

  return (
    <div
      style={{
        flex: 1,
        minWidth: '260px',
        backgroundColor: '#f1f5f9',
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 列标题 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: column.color }} />
          <h3 style={{ margin: 0, fontSize: '16px' }}>{column.title}</h3>
          <span style={{ backgroundColor: '#e2e8f0', padding: '1px 8px', borderRadius: '10px', fontSize: '13px', color: '#64748b' }}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}
        >
          {showAddForm ? '−' : '+'}
        </button>
      </div>

      {/* 添加任务的表单 */}
      {showAddForm && (
        <form onSubmit={handleAddTask} style={{ marginBottom: '8px', padding: '8px', backgroundColor: 'white', borderRadius: '8px' }}>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="任务标题..."
            autoFocus
            style={{ width: '100%', padding: '6px 8px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', marginBottom: '6px' }}
          />
          <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
            {['high', 'medium', 'low'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setNewTaskPriority(p)}
                style={{
                  padding: '2px 8px',
                  fontSize: '11px',
                  border: newTaskPriority === p ? '2px solid #3b82f6' : '1px solid #ddd',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {p === 'high' ? '高' : p === 'medium' ? '中' : '低'}
              </button>
            ))}
          </div>
          <button type="submit" style={{ width: '100%', padding: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
            添加
          </button>
        </form>
      )}

      {/* 任务卡片列表 */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={column.id}
            onDelete={onDelete}
            onEdit={onEdit}
            onMove={onMove}
            columnIds={columnIds}
            columnTitles={columnTitles}
          />
        ))}
        {tasks.length === 0 && (
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', padding: '20px' }}>
            暂无任务
          </p>
        )}
      </div>
    </div>
  );
}

// ========================================
// 4. KanbanBoard 组件 —— 完整看板
// ========================================
function KanbanBoard() {
  const store = useKanbanStore();

  // 从 store 获取数据和方法
  const { columns, tasks, columnOrder, addTask, deleteTask, updateTask, moveTask } = store;

  // 列标题映射（方便按钮显示）
  const columnTitles = {};
  columnOrder.forEach((colId) => {
    columnTitles[colId] = columns[colId].title;
  });

  return (
    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '4px' }}>
      {columnOrder.map((columnId) => {
        const column = columns[columnId];
        // 获取该列的所有任务
        const columnTasks = column.taskIds
          .map((taskId) => tasks[taskId])
          .filter(Boolean); // 过滤掉可能不存在的任务

        return (
          <KanbanColumn
            key={columnId}
            column={column}
            tasks={columnTasks}
            onDelete={deleteTask}
            onEdit={updateTask}
            onMove={moveTask}
            onAddTask={addTask}
            columnIds={columnOrder}
            columnTitles={columnTitles}
          />
        );
      })}
    </div>
  );
}

// ========================================
// 5. 主应用组件
// ========================================
function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '4px' }}>任务看板</h1>
        <p style={{ color: '#64748b', marginTop: '0' }}>
          双击卡片标题可编辑 | 点击按钮移动任务到其他列 | 点击 + 添加新任务
        </p>
        <KanbanBoard />
      </div>
    </div>
  );
}

export default App;
