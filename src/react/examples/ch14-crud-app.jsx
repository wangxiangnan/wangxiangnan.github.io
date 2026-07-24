/**
 * 第14章 配套代码示例
 * 主题：完整的 CRUD 应用（使用 fetch + 模拟 API）
 * 使用方式：将代码复制到 React 项目中使用
 * 功能列表：
 *   - Create：创建新记录
 *   - Read：读取并展示记录列表
 *   - Update：编辑已有记录
 *   - Delete：删除记录
 *   - 搜索过滤
 *   - Loading / Error 状态处理
 */

import { useState, useEffect, useCallback } from 'react';

// ========================================
// 1. 模拟 API 服务（替代真实后端）
// ========================================
// 在真实项目中，这些函数会调用实际的 API 端点
// 这里使用 setTimeout 模拟网络延迟

const mockDatabase = [
  { id: 1, name: 'React', category: '前端框架', description: '用于构建用户界面的 JavaScript 库', rating: 5 },
  { id: 2, name: 'Vue', category: '前端框架', description: '渐进式 JavaScript 框架', rating: 4 },
  { id: 3, name: 'Node.js', category: '后端技术', description: '基于 V8 的 JavaScript 运行时', rating: 4 },
  { id: 4, name: 'PostgreSQL', category: '数据库', description: '强大的开源关系型数据库', rating: 5 },
];

// 模拟延迟函数
function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 模拟 API：获取所有记录
async function apiGetAll() {
  await delay(300);
  return [...mockDatabase];
}

// 模拟 API：创建记录
async function apiCreate(item) {
  await delay(400);
  const newItem = { ...item, id: Date.now() };
  mockDatabase.push(newItem);
  return newItem;
}

// 模拟 API：更新记录
async function apiUpdate(id, updates) {
  await delay(400);
  const index = mockDatabase.findIndex((item) => item.id === id);
  if (index === -1) throw new Error('记录不存在');
  mockDatabase[index] = { ...mockDatabase[index], ...updates };
  return mockDatabase[index];
}

// 模拟 API：删除记录
async function apiDelete(id) {
  await delay(300);
  const index = mockDatabase.findIndex((item) => item.id === id);
  if (index === -1) throw new Error('记录不存在');
  mockDatabase.splice(index, 1);
  return { success: true };
}

// ========================================
// 2. CrudForm 组件 —— 创建/编辑表单
// ========================================
function CrudForm({ item, onSubmit, onCancel }) {
  // 表单数据：如果有 item 就是编辑模式，否则是创建模式
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || '',
    description: item?.description || '',
    rating: item?.rating || 3,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 更新表单字段
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // 提交表单
  async function handleSubmit(e) {
    e.preventDefault();

    // 基本验证
    if (!formData.name.trim()) {
      setError('名称不能为空');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        ...formData,
        rating: Number(formData.rating),
      });
    } catch (err) {
      setError('提交失败：' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // 是否是编辑模式
  const isEditing = !!item;

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '16px' }}>
      <h3>{isEditing ? '编辑记录' : '新建记录'}</h3>

      {error && <p style={{ color: '#d32f2f' }}>{error}</p>}

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>名称 *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          required
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>分类</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">请选择分类</option>
          <option value="前端框架">前端框架</option>
          <option value="后端技术">后端技术</option>
          <option value="数据库">数据库</option>
          <option value="工具">工具</option>
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>描述</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>评分：{formData.rating} 星</label>
        <input
          type="range"
          name="rating"
          min="1"
          max="5"
          value={formData.rating}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button type="submit" disabled={submitting} style={{ padding: '8px 20px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {submitting ? '提交中...' : isEditing ? '保存修改' : '创建'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ padding: '8px 20px', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>
            取消
          </button>
        )}
      </div>
    </form>
  );
}

// ========================================
// 3. CrudTable 组件 —— 数据表格
// ========================================
function CrudTable({ items, onEdit, onDelete }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>名称</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>分类</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>描述</th>
            <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>评分</th>
            <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{item.name}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '2px 8px', backgroundColor: '#e3f2fd', borderRadius: '4px', fontSize: '13px' }}>
                  {item.category || '未分类'}
                </span>
              </td>
              <td style={{ padding: '12px', color: '#666', fontSize: '14px' }}>{item.description}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button onClick={() => onEdit(item)} style={{ padding: '4px 10px', marginRight: '4px', border: '1px solid #1976d2', color: '#1976d2', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                  编辑
                </button>
                <button onClick={() => onDelete(item.id)} style={{ padding: '4px 10px', border: '1px solid #d32f2f', color: '#d32f2f', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ========================================
// 4. CrudApp 组件 —— 完整的 CRUD 应用
// ========================================
function CrudApp() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 加载数据
  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetAll();
      setItems(data);
    } catch (err) {
      setError('加载数据失败：' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 组件挂载时加载数据
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Create：创建新记录
  async function handleCreate(formData) {
    const newItem = await apiCreate(formData);
    setItems((prev) => [...prev, newItem]);
    setShowForm(false);
  }

  // Update：更新记录
  async function handleUpdate(formData) {
    const updatedItem = await apiUpdate(editingItem.id, formData);
    setItems((prev) =>
      prev.map((item) => (item.id === editingItem.id ? updatedItem : item))
    );
    setEditingItem(null);
  }

  // Delete：删除记录
  async function handleDelete(id) {
    if (!window.confirm('确定要删除这条记录吗？')) return;
    try {
      await apiDelete(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('删除失败：' + err.message);
    }
  }

  // 搜索过滤
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* 工具栏：搜索 + 新增按钮 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索名称、分类或描述..."
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '2px solid #ddd', fontSize: '14px' }}
        />
        <button
          onClick={() => { setShowForm(true); setEditingItem(null); }}
          style={{ padding: '10px 20px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          + 新增
        </button>
        <button onClick={loadItems} style={{ padding: '10px 20px', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '8px', cursor: 'pointer' }}>
          刷新
        </button>
      </div>

      {/* 创建表单 */}
      {showForm && (
        <CrudForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* 编辑表单 */}
      {editingItem && (
        <CrudForm
          item={editingItem}
          onSubmit={handleUpdate}
          onCancel={() => setEditingItem(null)}
        />
      )}

      {/* Loading 状态 */}
      {loading && <p style={{ textAlign: 'center', padding: '40px' }}>数据加载中...</p>}

      {/* Error 状态 */}
      {error && <p style={{ color: '#d32f2f', textAlign: 'center' }}>{error}</p>}

      {/* 数据表格 */}
      {!loading && !error && (
        <>
          {filteredItems.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              {searchQuery ? '没有找到匹配的记录' : '暂无数据，点击"新增"添加'}
            </p>
          ) : (
            <CrudTable items={filteredItems} onEdit={setEditingItem} onDelete={handleDelete} />
          )}
          <p style={{ textAlign: 'center', color: '#999', fontSize: '13px', marginTop: '8px' }}>
            显示 {filteredItems.length} / {items.length} 条记录
          </p>
        </>
      )}
    </div>
  );
}

// ========================================
// 5. 主应用组件
// ========================================
function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>CRUD 应用示例</h1>
      <p>演示增删改查的完整流程，使用模拟 API。</p>
      <CrudApp />
    </div>
  );
}

export default App;
