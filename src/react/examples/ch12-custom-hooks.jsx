/**
 * 第12章 配套代码示例
 * 主题：四个自定义 Hook —— useLocalStorage、useWindowSize、useFetch、useDebounce
 * 使用方式：将每个 Hook 提取到单独的文件中使用，或直接复制到你项目中
 * 学习要点：
 *   - 自定义 Hook 必须以 "use" 开头命名
 *   - 自定义 Hook 是复用逻辑的利器
 *   - 可以在自定义 Hook 中使用其他 Hook
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// ========================================
// 1. useLocalStorage —— 持久化存储到 localStorage
// ========================================
/**
 * 与 useState 用法相同，但会自动同步到 localStorage
 * @param {string} key - localStorage 中的键名
 * @param {any} initialValue - 初始值
 * @returns {[any, function]} - [当前值, 更新函数]
 */
function useLocalStorage(key, initialValue) {
  // 初始化状态：优先读取 localStorage，没有则使用初始值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // 如果有值，解析 JSON；否则返回初始值
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // JSON 解析失败时，返回初始值
      console.warn(`读取 localStorage key "${key}" 失败：`, error);
      return initialValue;
    }
  });

  // 封装 setValue，同时更新 state 和 localStorage
  const setValue = useCallback(
    (value) => {
      try {
        // 支持函数式更新（与 useState 保持一致）
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        // 同步写入 localStorage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`写入 localStorage key "${key}" 失败：`, error);
      }
    },
    [key, storedValue]
  );

  // 移除 localStorage 中的数据
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`删除 localStorage key "${key}" 失败：`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// ========================================
// 2. useWindowSize —— 监听窗口大小变化
// ========================================
/**
 * 返回当前浏览器窗口的宽度和高度
 * 窗口大小变化时自动更新
 * @returns {{ width: number, height: number }}
 */
function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // 定义 resize 处理函数
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // 监听 resize 事件
    window.addEventListener('resize', handleResize);

    // 清理函数：移除事件监听
    return () => window.removeEventListener('resize', handleResize);
  }, []); // 只在挂载和卸载时执行

  return size;
}

// ========================================
// 3. useFetch —— 通用的数据获取 Hook
// ========================================
/**
 * 封装了 fetch 请求的完整生命周期
 * @param {string} url - 请求地址
 * @param {object} options - fetch 的配置选项
 * @returns {{ data: any, loading: boolean, error: string|null, refetch: function }}
 */
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 将 options 序列化，用于依赖比较
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // 核心请求函数
  const fetchData = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...optionsRef.current,
        signal, // 传入取消信号
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      // 用户取消的请求不算错误
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    // 创建 AbortController 用于取消请求
    const controller = new AbortController();
    fetchData(controller.signal);

    // 清理：组件卸载或 url 变化时取消未完成的请求
    return () => controller.abort();
  }, [fetchData]);

  // 提供手动重新请求的方法
  const refetch = useCallback(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// ========================================
// 4. useDebounce —— 防抖 Hook
// ========================================
/**
 * 对值进行防抖处理，值变化后延迟一段时间才更新
 * @param {any} value - 需要防抖的值
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {any} - 防抖后的值
 */
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 设置定时器，delay 毫秒后更新防抖值
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 如果在 delay 内值又变化了，清除之前的定时器
    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue;
}

// ========================================
// 5. 演示组件 —— 展示各 Hook 的用法
// ========================================

// useLocalStorage 演示
function LocalStorageDemo() {
  // 用法和 useState 完全一样，但刷新页面后数据不丢失
  const [name, setName] = useLocalStorage('demo-name', '');
  const [count, setCount, removeCount] = useLocalStorage('demo-count', 0);
  const [settings, setSettings] = useLocalStorage('demo-settings', {
    notifications: true,
    language: 'zh-CN',
  });

  return (
    <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>useLocalStorage 演示</h3>
      <p style={{ color: '#666', fontSize: '13px' }}>
        刷新页面后数据不会丢失！
      </p>

      <div style={{ marginBottom: '12px' }}>
        <label>你的名字：</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入你的名字"
        />
        <span style={{ marginLeft: '8px' }}>你好，{name || '匿名'}！</span>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <span>计数：{count}</span>
        <button onClick={() => setCount(count + 1)} style={{ marginLeft: '8px' }}>+1</button>
        <button onClick={removeCount} style={{ marginLeft: '4px' }}>重置</button>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) =>
              setSettings({ ...settings, notifications: e.target.checked })
            }
          />
          开启通知
        </label>
      </div>
    </div>
  );
}

// useWindowSize 演示
function WindowSizeDemo() {
  const { width, height } = useWindowSize();

  // 根据窗口宽度判断设备类型
  const deviceType = width < 768 ? '手机' : width < 1024 ? '平板' : '桌面';

  return (
    <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>useWindowSize 演示</h3>
      <p>调整浏览器窗口大小查看变化：</p>
      <p>
        窗口尺寸：<strong>{width} x {height}</strong>
      </p>
      <p>
        设备类型：<strong>{deviceType}</strong>
      </p>
    </div>
  );
}

// useFetch 演示
function FetchDemo() {
  const { data, loading, error, refetch } = useFetch(
    'https://jsonplaceholder.typicode.com/users?_limit=3'
  );

  return (
    <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>useFetch 演示</h3>
      <button onClick={refetch}>刷新数据</button>

      {loading && <p>加载中...</p>}
      {error && <p style={{ color: 'red' }}>错误：{error}</p>}
      {data && (
        <ul>
          {data.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// useDebounce 演示
function DebounceDemo() {
  const [searchText, setSearchText] = useState('');
  // 对搜索文本进行 500ms 防抖
  const debouncedSearch = useDebounce(searchText, 500);

  return (
    <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>useDebounce 演示</h3>
      <p>快速输入时，防抖值会在停止输入 500ms 后才更新：</p>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="快速输入试试..."
        style={{ padding: '8px', width: '300px' }}
      />
      <p>
        实时值：<code style={{ backgroundColor: '#f5f5f5', padding: '2px 6px' }}>{searchText || '-'}</code>
      </p>
      <p>
        防抖值：<code style={{ backgroundColor: '#e8f5e9', padding: '2px 6px' }}>{debouncedSearch || '-'}</code>
      </p>
    </div>
  );
}

// ========================================
// 6. 主应用组件
// ========================================
function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h1>第12章：自定义 Hook 示例</h1>

      <LocalStorageDemo />
      <WindowSizeDemo />
      <FetchDemo />
      <DebounceDemo />
    </div>
  );
}

export default App;
