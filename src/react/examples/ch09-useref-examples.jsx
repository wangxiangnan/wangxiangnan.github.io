/**
 * 第9章 配套代码示例
 * 主题：useRef 各种用法 —— DOM 访问、存储值、forwardRef
 * 使用方式：将代码复制到 React 项目的组件文件中使用
 * 学习要点：
 *   - useRef 创建的引用在组件整个生命周期内保持不变
 *   - 修改 ref.current 不会触发重新渲染
 *   - 常用于：访问 DOM 元素、存储不触发渲染的值、配合 forwardRef 暴露子组件
 */

import { useState, useRef, useEffect, forwardRef } from 'react';

// ========================================
// 1. 使用 useRef 访问 DOM 元素
// ========================================
function DomRefDemo() {
  // 创建 ref，初始值为 null
  // ref 会在 JSX 中通过 ref={xxxRef} 绑定到 DOM 元素上
  const inputRef = useRef(null);
  const boxRef = useRef(null);

  // 聚焦到输入框
  function handleFocusInput() {
    // 通过 .current 访问 DOM 元素，调用原生 DOM 方法
    inputRef.current.focus();
  }

  // 清空输入框
  function handleClearInput() {
    inputRef.current.value = '';
    inputRef.current.focus();
  }

  // 修改盒子颜色
  function handlePaintBox(color) {
    // 直接操作 DOM 样式（不经过 React 状态）
    boxRef.current.style.backgroundColor = color;
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>1. DOM 访问：聚焦输入框 & 修改样式</h3>

      {/* 将 ref 绑定到 input 元素 */}
      <input
        ref={inputRef}
        type="text"
        placeholder="点击按钮聚焦到这个输入框"
        style={{ padding: '8px', width: '300px', marginBottom: '8px' }}
      />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={handleFocusInput}>聚焦输入框</button>
        <button onClick={handleClearInput}>清空输入框</button>
      </div>

      {/* 将 ref 绑定到 div 元素 */}
      <div
        ref={boxRef}
        style={{
          width: '200px',
          height: '100px',
          backgroundColor: '#e0e0e0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.3s',
          marginBottom: '8px',
        }}
      >
        可变色的盒子
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => handlePaintBox('#ef9a9a')}>红色</button>
        <button onClick={() => handlePaintBox('#a5d6a7')}>绿色</button>
        <button onClick={() => handlePaintBox('#90caf9')}>蓝色</button>
      </div>
    </div>
  );
}

// ========================================
// 2. 使用 useRef 存储不触发渲染的值
// ========================================
/**
 * 与 useState 不同，修改 useRef 的 .current 不会触发重新渲染
 * 适合存储：定时器 ID、上次的 props/state、DOM 测量值等
 */
function MutableRefDemo() {
  const [count, setCount] = useState(0);

  // 用 ref 存储渲染次数（不会触发重新渲染）
  const renderCountRef = useRef(0);
  // 用 ref 存储上一次的 count 值
  const prevCountRef = useRef(count);

  // 用 ref 存储定时器 ID
  const timerRef = useRef(null);
  const [seconds, setSeconds] = useState(0);

  // 每次渲染时增加渲染计数
  renderCountRef.current += 1;

  // 使用 useEffect 在渲染后更新 prevCountRef
  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  // 启动定时器
  function startTimer() {
    // 避免重复启动
    if (timerRef.current) return;

    // 将定时器 ID 存储在 ref 中
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  }

  // 停止定时器
  function stopTimer() {
    // 从 ref 中取出定时器 ID 并清除
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null; // 清除后重置为 null
    }
  }

  // 重置定时器
  function resetTimer() {
    stopTimer();
    setSeconds(0);
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>2. 存储值：不触发渲染的 Ref</h3>

      {/* 渲染次数不会触发渲染，所以这里显示的是上一次的计数 */}
      <p>组件已渲染 <strong>{renderCountRef.current}</strong> 次</p>

      <p>
        当前计数：<strong>{count}</strong>，
        上一次的计数：<strong>{prevCountRef.current}</strong>
      </p>
      <button onClick={() => setCount((c) => c + 1)}>
        增加计数（触发渲染）
      </button>

      <hr />

      <h4>定时器（使用 ref 存储 timer ID）</h4>
      <p style={{ fontSize: '24px', fontFamily: 'monospace' }}>
        {Math.floor(seconds / 60).toString().padStart(2, '0')}:
        {(seconds % 60).toString().padStart(2, '0')}
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={startTimer}>开始</button>
        <button onClick={stopTimer}>暂停</button>
        <button onClick={resetTimer}>重置</button>
      </div>
    </div>
  );
}

// ========================================
// 3. 使用 useRef 测量 DOM 尺寸
// ========================================
function MeasureDomDemo() {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 测量容器尺寸
  function measureSize() {
    if (containerRef.current) {
      // getBoundingClientRect() 获取元素的尺寸和位置
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    }
  }

  // 组件挂载后自动测量一次
  useEffect(() => {
    measureSize();
  }, []);

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>3. 测量 DOM 尺寸</h3>

      <div
        ref={containerRef}
        style={{
          width: '100%',
          minHeight: '80px',
          padding: '20px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          boxSizing: 'border-box',
        }}
      >
        这个容器的大小会被测量。尝试调整浏览器窗口大小后点击"测量"。
      </div>

      <button onClick={measureSize} style={{ marginTop: '8px' }}>
        测量尺寸
      </button>

      <p>
        宽度：<strong>{dimensions.width}px</strong>，
        高度：<strong>{dimensions.height}px</strong>
      </p>
    </div>
  );
}

// ========================================
// 4. forwardRef —— 将 ref 从父组件传递到子组件
// ========================================
/**
 * forwardRef 让父组件可以访问子组件内部的 DOM 元素
 * 常用于：封装 Input、Modal 等基础组件时暴露 focus() 方法
 */

// 子组件：使用 forwardRef 包裹，接收 ref 作为第二个参数
const FancyInput = forwardRef(function FancyInput({ placeholder, style }, ref) {
  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      {/* 将父组件传来的 ref 绑定到内部的 input 元素 */}
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        style={{
          padding: '10px 16px',
          fontSize: '16px',
          border: '2px solid #1976d2',
          borderRadius: '8px',
          outline: 'none',
          ...style,
        }}
      />
      {/* 装饰性的小图标 */}
      <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
        *
      </span>
    </div>
  );
});

// 父组件：使用 FancyInput 并通过 ref 控制它
function ForwardRefDemo() {
  // 创建 ref，会传递给 FancyInput
  const fancyInputRef = useRef(null);

  function handleFocus() {
    // 虽然 FancyInput 是封装的组件，但父组件依然可以访问内部的 input DOM
    fancyInputRef.current.focus();
  }

  function handleSelectAll() {
    fancyInputRef.current.focus();
    fancyInputRef.current.select();
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>4. forwardRef：父组件控制子组件的 DOM</h3>
      <p>
        FancyInput 是一个封装的组件，但父组件通过 forwardRef
        依然可以控制它内部的 input 元素。
      </p>

      {/* 将 ref 传递给子组件 */}
      <FancyInput
        ref={fancyInputRef}
        placeholder="我是封装的 FancyInput"
      />

      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button onClick={handleFocus}>聚焦</button>
        <button onClick={handleSelectAll}>全选文字</button>
      </div>
    </div>
  );
}

// ========================================
// 5. useImperativeHandle（补充）—— 自定义暴露给父组件的方法
// ========================================
// forwardRef 默认暴露整个 DOM 节点
// useImperativeHandle 可以让你精确控制暴露哪些方法

// 注意：实际项目中需要在组件内 import { useImperativeHandle }
// 这里用注释说明用法
function ImperativeHandleExplanation() {
  return (
    <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#fff8e1', borderRadius: '8px' }}>
      <h3>5. 补充：useImperativeHandle</h3>
      <p>useImperativeHandle 配合 forwardRef 使用，可以自定义父组件能调用的方法：</p>
      <pre style={{ fontSize: '13px', overflow: 'auto' }}>
{`// 子组件内部
useImperativeHandle(ref, () => ({
  focus: () => inputRef.current.focus(),
  clear: () => { inputRef.current.value = ''; },
  getValue: () => inputRef.current.value,
}));

// 这样父组件只能调用 focus、clear、getValue
// 而不能直接操作 DOM 节点`}
      </pre>
    </div>
  );
}

// ========================================
// 6. 主应用组件
// ========================================
function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h1>第9章：useRef 用法示例</h1>

      <DomRefDemo />
      <hr />
      <MutableRefDemo />
      <hr />
      <MeasureDomDemo />
      <hr />
      <ForwardRefDemo />
      <hr />
      <ImperativeHandleExplanation />
    </div>
  );
}

export default App;
