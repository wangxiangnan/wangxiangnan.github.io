/**
 * 第18章 配套代码示例
 * 主题：Vitest + React Testing Library 测试示例
 * 使用方式：
 *   1. 安装依赖：
 *      npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
 *   2. 在 vite.config.js 中添加：
 *      test: { environment: 'jsdom', globals: true }
 *   3. 运行测试：npx vitest
 * 学习要点：
 *   - 使用 React Testing Library 的查询方法
 *   - 模拟用户交互（userEvent）
 *   - 测试异步操作
 *   - 测试自定义 Hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useState } from 'react';

// ========================================
// 1. 被测试的组件定义
// ========================================

// 简单计数器组件
function Counter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <h2>计数器</h2>
      {/* 使用 data-testid 提供测试钩子（不推荐作为首选查询方式） */}
      <p data-testid="count-display">
        当前计数：{count}
      </p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(count - 1)}>减少</button>
      <button onClick={() => setCount(0)}>重置</button>
    </div>
  );
}

// 表单组件
function LoginForm({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    // 验证
    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }
    if (password.length < 6) {
      setError('密码至少 6 个字符');
      return;
    }

    setError('');
    onSubmit({ username, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>登录</h2>

      {/* 错误提示区域 */}
      {error && (
        <div role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}

      <div>
        <label htmlFor="username">用户名</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="请输入用户名"
        />
      </div>

      <div>
        <label htmlFor="password">密码</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入密码"
        />
      </div>

      <button type="submit">登录</button>
    </form>
  );
}

// 异步数据组件
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 使用 useEffect 获取数据
  // 注意：这里直接内联了 useEffect 逻辑用于演示
  useState(() => {
    // 模拟 API 调用
    async function fetchUser() {
      try {
        setLoading(true);
        // 模拟网络延迟
        await new Promise((resolve) => setTimeout(resolve, 100));
        // 模拟数据
        if (userId === 999) {
          throw new Error('用户不存在');
        }
        setUser({ id: userId, name: '张三', email: 'zhangsan@example.com' });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  });

  if (loading) return <p>加载中...</p>;
  if (error) return <p role="alert">错误：{error}</p>;
  if (!user) return null;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>邮箱：{user.email}</p>
    </div>
  );
}

// 列表组件
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: input.trim(), done: false }]);
    setInput('');
  }

  function handleToggle(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  return (
    <div>
      <h2>待办事项</h2>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="添加待办..."
          aria-label="新待办事项"
        />
        <button type="submit">添加</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleToggle(todo.id)}
              />
              <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                {todo.text}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p>还没有待办事项</p>}
    </div>
  );
}

// ========================================
// 2. 测试用例 —— Counter 组件
// ========================================
describe('Counter 组件', () => {
  // 测试初始渲染
  it('应该显示初始计数值 0', () => {
    // render 将组件渲染到虚拟 DOM 中
    render(<Counter />);

    // screen.getByText 通过文本内容查找元素
    // toBeInTheDocument 来自 @testing-library/jest-dom
    expect(screen.getByText('当前计数：0')).toBeInTheDocument();
  });

  // 测试自定义初始值
  it('应该支持自定义初始计数值', () => {
    render(<Counter initialCount={10} />);
    expect(screen.getByText('当前计数：10')).toBeInTheDocument();
  });

  // 测试点击增加按钮
  it('点击"增加"按钮后计数应该加 1', async () => {
    // userEvent 模拟真实用户交互
    const user = userEvent.setup();
    render(<Counter />);

    // getByRole 通过 ARIA 角色查找元素
    const incrementButton = screen.getByRole('button', { name: '增加' });
    await user.click(incrementButton);

    // 验证计数变为 1
    expect(screen.getByText('当前计数：1')).toBeInTheDocument();
  });

  // 测试多次点击
  it('多次点击后计数应该正确累加', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const incrementButton = screen.getByRole('button', { name: '增加' });

    // 点击 3 次
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);

    expect(screen.getByText('当前计数：3')).toBeInTheDocument();
  });

  // 测试减少和重置
  it('点击"减少"和"重置"应该正确工作', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={5} />);

    // 点击减少
    await user.click(screen.getByRole('button', { name: '减少' }));
    expect(screen.getByText('当前计数：4')).toBeInTheDocument();

    // 点击重置
    await user.click(screen.getByRole('button', { name: '重置' }));
    expect(screen.getByText('当前计数：0')).toBeInTheDocument();
  });
});

// ========================================
// 3. 测试用例 —— LoginForm 组件
// ========================================
describe('LoginForm 组件', () => {
  // 测试表单渲染
  it('应该渲染所有表单元素', () => {
    render(<LoginForm onSubmit={() => {}} />);

    // getByLabelText 通过 label 文本查找对应的 input
    expect(screen.getByLabelText('用户名')).toBeInTheDocument();
    expect(screen.getByLabelText('密码')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
  });

  // 测试空表单提交
  it('用户名为空时应该显示错误', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={() => {}} />);

    await user.click(screen.getByRole('button', { name: '登录' }));

    // role="alert" 的元素应该显示错误信息
    expect(screen.getByRole('alert')).toHaveTextContent('请输入用户名');
  });

  // 测试密码为空
  it('密码为空时应该显示错误', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={() => {}} />);

    // 输入用户名但不输入密码
    await user.type(screen.getByLabelText('用户名'), 'testuser');
    await user.click(screen.getByRole('button', { name: '登录' }));

    expect(screen.getByRole('alert')).toHaveTextContent('请输入密码');
  });

  // 测试密码太短
  it('密码少于 6 位时应该显示错误', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={() => {}} />);

    await user.type(screen.getByLabelText('用户名'), 'testuser');
    await user.type(screen.getByLabelText('密码'), '12345');
    await user.click(screen.getByRole('button', { name: '登录' }));

    expect(screen.getByRole('alert')).toHaveTextContent('密码至少 6 个字符');
  });

  // 测试成功提交
  it('表单验证通过后应该调用 onSubmit', async () => {
    const user = userEvent.setup();
    // vi.fn() 创建一个模拟函数（spy）
    const mockSubmit = vi.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    // 输入完整的表单数据
    await user.type(screen.getByLabelText('用户名'), 'testuser');
    await user.type(screen.getByLabelText('密码'), 'password123');
    await user.click(screen.getByRole('button', { name: '登录' }));

    // 验证 onSubmit 被调用，且参数正确
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });

    // 不应该有错误信息
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

// ========================================
// 4. 测试用例 —— TodoList 组件
// ========================================
describe('TodoList 组件', () => {
  it('初始应该显示空提示', () => {
    render(<TodoList />);
    expect(screen.getByText('还没有待办事项')).toBeInTheDocument();
  });

  it('应该能添加待办事项', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    // 在输入框中输入文字
    const input = screen.getByLabelText('新待办事项');
    await user.type(input, '学习 React 测试');

    // 点击添加按钮
    await user.click(screen.getByRole('button', { name: '添加' }));

    // 待办事项应该出现在列表中
    expect(screen.getByText('学习 React 测试')).toBeInTheDocument();
    // 空提示应该消失
    expect(screen.queryByText('还没有待办事项')).not.toBeInTheDocument();
  });

  it('不应该添加空的待办事项', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    // 不输入任何内容就点击添加
    await user.click(screen.getByRole('button', { name: '添加' }));

    // 应该仍然显示空提示
    expect(screen.getByText('还没有待办事项')).toBeInTheDocument();
  });

  it('应该能添加多个待办事项', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByLabelText('新待办事项');
    const addButton = screen.getByRole('button', { name: '添加' });

    // 添加第一个
    await user.type(input, '第一个任务');
    await user.click(addButton);

    // 添加第二个
    await user.type(input, '第二个任务');
    await user.click(addButton);

    // 两个都应该出现
    expect(screen.getByText('第一个任务')).toBeInTheDocument();
    expect(screen.getByText('第二个任务')).toBeInTheDocument();
  });

  it('勾选复选框应该标记为完成', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    // 添加一个任务
    const input = screen.getByLabelText('新待办事项');
    await user.type(input, '待完成的任务');
    await user.click(screen.getByRole('button', { name: '添加' }));

    // 找到复选框并勾选
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    // 复选框应该变为已勾选状态
    expect(checkbox).toBeChecked();
  });
});

// ========================================
// 5. 测试工具函数示例
// ========================================
describe('工具函数测试', () => {
  // 模拟一个简单的纯函数
  function formatCurrency(amount) {
    return `¥${amount.toFixed(2)}`;
  }

  it('应该正确格式化货币', () => {
    expect(formatCurrency(0)).toBe('¥0.00');
    expect(formatCurrency(10)).toBe('¥10.00');
    expect(formatCurrency(99.9)).toBe('¥99.90');
    expect(formatCurrency(1234.56)).toBe('¥1234.56');
  });

  // 测试数组操作
  function uniqueBy(arr, key) {
    const seen = new Set();
    return arr.filter((item) => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }

  it('uniqueBy 应该按指定字段去重', () => {
    const input = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 1, name: 'c' }, // 重复的 id
    ];
    const result = uniqueBy(input, 'id');
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('a');
    expect(result[1].name).toBe('b');
  });
});
