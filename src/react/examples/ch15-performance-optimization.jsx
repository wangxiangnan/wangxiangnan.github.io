/**
 * 第15章 配套代码示例
 * 主题：React 性能优化 —— React.memo、useMemo、useCallback、React.lazy
 * 使用方式：将代码复制到 React 项目中使用
 * 学习要点：
 *   - React.memo：避免不必要的子组件重新渲染
 *   - useMemo：缓存计算结果
 *   - useCallback：缓存函数引用
 *   - React.lazy + Suspense：代码分割，按需加载
 */

import { useState, useMemo, useCallback, memo, lazy, Suspense } from 'react';

// ========================================
// 1. React.memo —— 避免不必要的重新渲染
// ========================================
/**
 * React.memo 包裹的组件只在 props 变化时才重新渲染
 * 适合渲染开销大、且 props 不常变化的组件
 */
const ExpensiveListItem = memo(function ExpensiveListItem({ item, onItemClick }) {
  // 模拟昂贵的渲染操作
  console.log(`渲染列表项: ${item.name}`);

  return (
    <li
      onClick={() => onItemClick(item.id)}
      style={{
        padding: '12px 16px',
        borderBottom: '1px solid #eee',
        cursor: 'pointer',
        backgroundColor: item.selected ? '#e3f2fd' : 'white',
        transition: 'background-color 0.2s',
      }}
    >
      <strong>{item.name}</strong>
      <span style={{ color: '#666', marginLeft: '8px' }}>{item.description}</span>
    </li>
  );
});

/**
 * 列表容器组件 —— 演示 React.memo 的效果
 */
function MemoDemo() {
  const [items] = useState([
    { id: 1, name: '苹果', description: '红色水果' },
    { id: 2, name: '香蕉', description: '黄色水果' },
    { id: 3, name: '葡萄', description: '紫色水果' },
  ]);

  const [selectedId, setSelectedId] = useState(null);
  const [unrelatedCount, setUnrelatedCount] = useState(0);

  // 使用 useCallback 缓存回调函数
  // 如果不缓存，每次父组件渲染都会创建新函数，导致 memo 失效
  const handleItemClick = useCallback((id) => {
    setSelectedId(id);
  }, []);

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3>React.memo + useCallback 演示</h3>
      <p style={{ color: '#666', fontSize: '13px' }}>
        点击"无关计数"按钮时，只有父组件重新渲染，列表项不会重新渲染（查看 console 输出）。
      </p>

      {/* 无关状态：点击这个按钮不应该导致列表项重新渲染 */}
      <button onClick={() => setUnrelatedCount((c) => c + 1)} style={{ marginBottom: '8px' }}>
        无关计数：{unrelatedCount}（点击我不应该触发列表项重新渲染）
      </button>

      <ul style={{ listStyle: 'none', padding: 0, border: '1px solid #eee', borderRadius: '8px' }}>
        {items.map((item) => (
          <ExpensiveListItem
            key={item.id}
            item={{ ...item, selected: item.id === selectedId }}
            onItemClick={handleItemClick}
          />
        ))}
      </ul>
    </div>
  );
}

// ========================================
// 2. useMemo —— 缓存昂贵的计算结果
// ========================================
function UseMemoDemo() {
  const [numbers, setNumbers] = useState([5, 12, 8, 130, 44, 3, 78, 21, 56, 9]);
  const [filterValue, setFilterValue] = useState(10);
  const [unrelatedState, setUnrelatedState] = useState(0);

  // 不使用 useMemo：每次渲染都会重新计算（包括无关状态变化时）
  // const filteredNumbers = numbers.filter(n => n > filterValue).sort((a, b) => a - b);

  // 使用 useMemo：只在 numbers 或 filterValue 变化时才重新计算
  const filteredAndSorted = useMemo(() => {
    console.log('执行过滤和排序计算...');
    return numbers
      .filter((n) => n > filterValue)
      .sort((a, b) => a - b);
  }, [numbers, filterValue]); // 依赖数组：只有这两个值变化才重新计算

  // 统计信息也用 useMemo 缓存
  const stats = useMemo(() => ({
    total: numbers.length,
    filtered: filteredAndSorted.length,
    sum: filteredAndSorted.reduce((acc, n) => acc + n, 0),
    average: filteredAndSorted.length > 0
      ? (filteredAndSorted.reduce((acc, n) => acc + n, 0) / filteredAndSorted.length).toFixed(1)
      : 0,
  }), [numbers, filteredAndSorted]);

  // 添加随机数
  function addRandomNumber() {
    setNumbers((prev) => [...prev, Math.floor(Math.random() * 200)]);
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3>useMemo 演示</h3>
      <p style={{ color: '#666', fontSize: '13px' }}>
        过滤和排序是昂贵操作，useMemo 确保只在依赖变化时才重新计算。
      </p>

      {/* 无关状态按钮 */}
      <button onClick={() => setUnrelatedState((c) => c + 1)} style={{ marginBottom: '8px' }}>
        无关状态：{unrelatedState}（改变它不会触发重新计算）
      </button>

      <div style={{ marginBottom: '8px' }}>
        <label>
          只显示大于{' '}
          <input
            type="number"
            value={filterValue}
            onChange={(e) => setFilterValue(Number(e.target.value))}
            style={{ width: '60px', padding: '4px' }}
          />{' '}
          的数字
        </label>
      </div>

      <button onClick={addRandomNumber} style={{ marginBottom: '8px' }}>
        添加随机数
      </button>

      {/* 原始数据 */}
      <p>原始数据：[{numbers.join(', ')}]</p>

      {/* 过滤后结果 */}
      <p>
        过滤后（大于 {filterValue}，已排序）：
        <strong>[{filteredAndSorted.join(', ')}]</strong>
      </p>

      {/* 统计 */}
      <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px', fontSize: '14px' }}>
        <div>总数：{stats.total} 个</div>
        <div>过滤后：{stats.filtered} 个</div>
        <div>总和：{stats.sum}</div>
        <div>平均值：{stats.average}</div>
      </div>
    </div>
  );
}

// ========================================
// 3. useCallback —— 缓存函数引用
// ========================================
function UseCallbackDemo() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  // 不使用 useCallback：每次渲染都会创建新的函数引用
  // 如果这个函数作为 props 传递给子组件，子组件会不必要地重新渲染

  // 使用 useCallback：只在 step 变化时创建新函数
  const increment = useCallback(() => {
    setCount((prev) => prev + step);
  }, [step]); // step 变化时才重新创建函数

  const decrement = useCallback(() => {
    setCount((prev) => prev - step);
  }, [step]);

  const reset = useCallback(() => {
    setCount(0);
  }, []); // 空依赖 = 函数永不变化

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3>useCallback 演示</h3>
      <p style={{ color: '#666', fontSize: '13px' }}>
        useCallback 缓存函数引用，避免子组件不必要的重新渲染。
      </p>

      <div style={{ marginBottom: '8px' }}>
        <label>
          步长：
          <input
            type="number"
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            style={{ width: '60px', padding: '4px' }}
          />
        </label>
      </div>

      <p style={{ fontSize: '24px' }}>计数：{count}</p>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={decrement}>- 减少</button>
        <button onClick={reset}>重置</button>
        <button onClick={increment}>+ 增加</button>
      </div>
    </div>
  );
}

// ========================================
// 4. React.lazy + Suspense —— 代码分割
// ========================================
/**
 * React.lazy 实现按需加载组件
 * 当组件不在视口内或不立即需要时，可以延迟加载
 * 减少初始 bundle 大小
 */

// 模拟一个"大"组件（实际项目中可能是从远程加载）
// React.lazy 接受一个返回动态 import() 的函数
// 这里用一个 Promise + setTimeout 模拟网络延迟
const LazyHeavyComponent = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        default: function HeavyComponent() {
          return (
            <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
              <h3>我是按需加载的重型组件</h3>
              <p>这个组件只有在用户点击按钮后才会被加载。</p>
              <p>在实际项目中，它可能是一个大型图表库、富文本编辑器等。</p>
              <p>好处：减少初始 bundle 大小，加快首屏加载速度。</p>
            </div>
          );
        },
      });
    }, 1000); // 模拟 1 秒加载时间
  });
});

function LazyDemo() {
  const [showHeavy, setShowHeavy] = useState(false);

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3>React.lazy + Suspense 演示</h3>
      <p style={{ color: '#666', fontSize: '13px' }}>
        点击按钮加载一个"重型"组件，观察 Suspense fallback 的效果。
      </p>

      <button
        onClick={() => setShowHeavy(!showHeavy)}
        style={{ padding: '8px 20px', marginBottom: '12px', cursor: 'pointer' }}
      >
        {showHeavy ? '隐藏' : '加载'}重型组件
      </button>

      {showHeavy && (
        // Suspense 包裹 lazy 组件，fallback 是加载时的占位内容
        <Suspense
          fallback={
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              组件加载中...
            </div>
          }
        >
          <LazyHeavyComponent />
        </Suspense>
      )}
    </div>
  );
}

// ========================================
// 5. 主应用组件
// ========================================
function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h1>第15章：性能优化示例</h1>
      <p>打开浏览器控制台查看渲染日志，理解各优化手段的效果。</p>

      <MemoDemo />
      <hr />
      <UseMemoDemo />
      <hr />
      <UseCallbackDemo />
      <hr />
      <LazyDemo />
    </div>
  );
}

export default App;
