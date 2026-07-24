/**
 * 第2章 配套代码示例
 * 主题：Hello World 与简单计数器
 * 使用方式：将代码复制到 React 项目（如 Vite + React）的入口文件中使用
 * 前置条件：需要安装 react 和 react-dom
 */

// ========================================
// 1. 导入 React 核心库
// ========================================
// useState 是 React 最常用的 Hook，用于在函数组件中管理状态
import { useState } from 'react';
// createRoot 是 React 18 引入的新 API，用于创建根节点并渲染应用
import { createRoot } from 'react-dom/client';

// ========================================
// 2. 最简单的 Hello World 组件
// ========================================
// 这是一个纯展示组件，不接受 props，直接返回固定的 JSX
function HelloWorld() {
  return (
    <div>
      {/* JSX 中使用 className 代替 HTML 的 class */}
      <h1>Hello, World!</h1>
      <p>恭喜你，这是你的第一个 React 应用！</p>
    </div>
  );
}

// ========================================
// 3. 简单计数器组件
// ========================================
// 这个组件演示了 useState 的基本用法：点击按钮改变数字
function Counter() {
  // useState 返回一个数组：[当前状态值, 更新状态的函数]
  // 参数 0 是 count 的初始值
  const [count, setCount] = useState(0);

  // 增加计数的处理函数
  function handleIncrement() {
    // setCount 会触发组件重新渲染，页面上的数字会自动更新
    setCount(count + 1);
  }

  // 减少计数的处理函数
  function handleDecrement() {
    setCount(count - 1);
  }

  // 重置计数的处理函数
  function handleReset() {
    setCount(0);
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>简单计数器</h2>

      {/* 显示当前计数值 */}
      <p style={{ fontSize: '48px', fontWeight: 'bold' }}>
        {count}
      </p>

      {/* 按钮组：减少、增加、重置 */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {/* onClick 绑定点击事件，注意是驼峰命名 */}
        <button onClick={handleDecrement}>
          - 减少
        </button>
        <button onClick={handleIncrement}>
          + 增加
        </button>
        <button onClick={handleReset}>
          重置
        </button>
      </div>

      {/* 根据计数值显示不同的提示信息 */}
      <p>
        {count > 10
          ? '你已经点了很多次了！'
          : count > 0
            ? '继续点击试试！'
            : '点击上方按钮开始计数'}
      </p>
    </div>
  );
}

// ========================================
// 4. 带步长的计数器（进阶版）
// ========================================
// 演示 useState 的另一种更新方式：传入函数
function StepCounter() {
  // 计数状态
  const [count, setCount] = useState(0);
  // 步长状态 —— 每次点击增加/减少的数量
  const [step, setStep] = useState(1);

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <h2>带步长的计数器</h2>

      {/* 步长控制 */}
      <div>
        <label>步长：</label>
        <input
          type="number"
          value={step}
          // 使用箭头函数，e 是事件对象
          onChange={(e) => setStep(Number(e.target.value))}
          style={{ width: '60px' }}
        />
      </div>

      {/* 显示当前值 */}
      <p style={{ fontSize: '36px' }}>{count}</p>

      {/* 按钮：使用函数式更新 setCount(prev => ...) */}
      {/* 当新状态依赖旧状态时，推荐使用函数式更新 */}
      <button onClick={() => setCount((prev) => prev - step)}>
        减少 {step}
      </button>
      <button onClick={() => setCount((prev) => prev + step)}>
        增加 {step}
      </button>
    </div>
  );
}

// ========================================
// 5. 主应用组件 —— 组合以上所有组件
// ========================================
function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      {/* 渲染 Hello World 组件 */}
      <HelloWorld />

      {/* 用水平线分隔不同示例 */}
      <hr />

      {/* 渲染简单计数器 */}
      <Counter />

      <hr />

      {/* 渲染带步长的计数器 */}
      <StepCounter />
    </div>
  );
}

// ========================================
// 6. 挂载应用 —— 将 React 渲染到页面上
// ========================================
// 获取 index.html 中 id 为 root 的 DOM 节点
const rootElement = document.getElementById('root');
// 使用 createRoot 创建 React 根节点（React 18 的写法）
const root = createRoot(rootElement);
// 将整个 App 组件渲染到页面上
root.render(<App />);

// 导出 App 组件，方便在其他文件中导入使用
export default App;
