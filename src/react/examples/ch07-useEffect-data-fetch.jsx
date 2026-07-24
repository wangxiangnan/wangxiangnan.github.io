/**
 * 第7章 配套代码示例
 * 主题：useEffect 获取数据 —— loading/error 状态、清理函数
 * 使用方式：将代码复制到 React 项目的组件文件中使用
 * 学习要点：
 *   - useEffect 的基本用法和依赖数组
 *   - 数据获取的完整流程（loading → success/error）
 *   - useEffect 的清理函数（组件卸载时取消请求）
 *   - 使用 AbortController 取消 fetch 请求
 */

import { useState, useEffect } from 'react';

// ========================================
// 1. 基础 useEffect —— 组件挂载时执行
// ========================================
function BasicEffectDemo() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('zh-CN'));

  useEffect(() => {
    // 组件挂载后启动定时器，每秒更新时间
    const timerId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('zh-CN'));
    }, 1000);

    // 清理函数：组件卸载时清除定时器
    // 防止内存泄漏和"在已卸载组件上更新状态"的警告
    return () => {
      clearInterval(timerId);
    };
  }, []); // 空依赖数组 = 只在组件挂载时执行一次

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>基础 useEffect：实时时钟</h3>
      <p style={{ fontSize: '24px', fontFamily: 'monospace' }}>{currentTime}</p>
    </div>
  );
}

// ========================================
// 2. 带依赖的 useEffect
// ========================================
function DependencyEffectDemo() {
  const [userId, setUserId] = useState(1);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // 每当 userId 变化时，重新获取对应用户的数据
    console.log(`获取用户 ${userId} 的数据...`);

    // 模拟获取用户数据
    const mockUsers = {
      1: { name: '张三', role: '管理员', email: 'zhangsan@example.com' },
      2: { name: '李四', role: '编辑', email: 'lisi@example.com' },
      3: { name: '王五', role: '用户', email: 'wangwu@example.com' },
    };

    // 模拟网络延迟
    const timer = setTimeout(() => {
      setUserData(mockUsers[userId]);
    }, 300);

    return () => clearTimeout(timer);
  }, [userId]); // 依赖数组中有 userId，userId 变化时重新执行

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>带依赖的 useEffect</h3>
      <div style={{ marginBottom: '8px' }}>
        <label>选择用户：</label>
        <select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
          <option value={1}>用户 1 - 张三</option>
          <option value={2}>用户 2 - 李四</option>
          <option value={3}>用户 3 - 王五</option>
        </select>
      </div>
      {userData && (
        <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p><strong>姓名：</strong>{userData.name}</p>
          <p><strong>角色：</strong>{userData.role}</p>
          <p><strong>邮箱：</strong>{userData.email}</p>
        </div>
      )}
    </div>
  );
}

// ========================================
// 3. 完整的 fetch 数据获取组件
// ========================================
/**
 * 使用 JSONPlaceholder 模拟 API 获取文章列表
 * 完整展示了 loading → success/error 的状态管理
 */
function FetchPostsDemo() {
  // 三种状态
  const [posts, setPosts] = useState([]);   // 数据
  const [loading, setLoading] = useState(true); // 加载中
  const [error, setError] = useState(null);      // 错误信息

  useEffect(() => {
    // 创建 AbortController，用于取消请求
    const controller = new AbortController();

    // 定义异步获取数据的函数
    async function fetchPosts() {
      try {
        // 开始加载
        setLoading(true);
        setError(null);

        // 发起请求，将 signal 传给 fetch
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/posts?_limit=6',
          { signal: controller.signal } // 传入取消信号
        );

        // 检查 HTTP 状态码
        if (!response.ok) {
          throw new Error(`HTTP 错误：${response.status}`);
        }

        // 解析 JSON 数据
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        // 如果是用户主动取消的请求，不设置错误状态
        if (err.name === 'AbortError') {
          console.log('请求已取消');
        } else {
          setError(err.message);
        }
      } finally {
        // 无论成功还是失败，都结束加载状态
        setLoading(false);
      }
    }

    fetchPosts();

    // 清理函数：组件卸载时取消未完成的请求
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>fetch 数据获取：文章列表</h3>

      {/* 加载中状态 */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>加载中...</p>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div style={{ padding: '12px', backgroundColor: '#ffebee', color: '#d32f2f', borderRadius: '8px' }}>
          <p>获取数据失败：{error}</p>
          <button onClick={() => window.location.reload()}>重试</button>
        </div>
      )}

      {/* 成功状态：显示文章列表 */}
      {!loading && !error && (
        <div>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                padding: '12px',
                marginBottom: '8px',
                border: '1px solid #eee',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ margin: '0 0 4px 0' }}>{post.title}</h4>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                {post.body.substring(0, 80)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========================================
// 4. 带搜索的实时获取（防抖）
// ========================================
function SearchFetchDemo() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 如果搜索词为空，清空结果
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    // 设置加载状态
    setLoading(true);

    // 创建 AbortController
    const controller = new AbortController();

    // 防抖：延迟 500ms 后再发起请求
    const timerId = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_limit=5&q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setResults(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('搜索出错：', err);
        }
      } finally {
        setLoading(false);
      }
    }, 500);

    // 清理：取消之前的定时器和请求
    return () => {
      clearTimeout(timerId);
      controller.abort();
    };
  }, [query]); // query 每次变化都会重新执行

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>实时搜索（带防抖）</h3>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="输入关键词搜索..."
        style={{ padding: '10px', width: '100%', fontSize: '16px', borderRadius: '8px', border: '2px solid #ddd' }}
      />

      {loading && <p style={{ color: '#1976d2' }}>搜索中...</p>}

      {!loading && results.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {results.map((item) => (
            <li key={item.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
              {item.title}
            </li>
          ))}
        </ul>
      )}

      {!loading && query && results.length === 0 && (
        <p style={{ color: '#999' }}>没有找到相关结果</p>
      )}
    </div>
  );
}

// ========================================
// 5. useEffect 的常见陷阱演示
// ========================================
function EffectPitfallsDemo() {
  const [count, setCount] = useState(0);

  // 陷阱：在 effect 中不使用依赖数组
  // 这会导致每次渲染都执行 effect
  useEffect(() => {
    // 这个 effect 会在 count 变化时执行
    document.title = `你点击了 ${count} 次`;

    // 如果忘记将 count 加入依赖数组，就会使用旧值（闭包陷阱）
    // ESLint 的 react-hooks/exhaustive-deps 规则会提醒你
  }, [count]); // 正确：将 count 加入依赖数组

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>useEffect 常见陷阱</h3>
      <p>看看浏览器标签页的标题，它会随着点击次数变化。</p>
      <button onClick={() => setCount((c) => c + 1)}>
        点击次数：{count}
      </button>
    </div>
  );
}

// ========================================
// 6. 主应用组件
// ========================================
function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h1>第7章：useEffect 数据获取示例</h1>

      <BasicEffectDemo />
      <hr />
      <DependencyEffectDemo />
      <hr />
      <FetchPostsDemo />
      <hr />
      <SearchFetchDemo />
      <hr />
      <EffectPitfallsDemo />
    </div>
  );
}

export default App;
