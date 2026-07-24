/**
 * 第16章 配套代码示例
 * 主题：useReducer 购物车 + Zustand Store 示例
 * 使用方式：
 *   - useReducer 部分可直接复制到 React 项目中使用
 *   - Zustand 部分需要先安装：npm install zustand
 * 学习要点：
 *   - useReducer 适合管理复杂的状态逻辑
 *   - reducer 是纯函数，根据 action 返回新的 state
 *   - Zustand 是轻量级状态管理库，比 Redux 更简洁
 */

import { useReducer, useState, useCallback } from 'react';

// ========================================
// 第一部分：useReducer 购物车
// ========================================

// 1. 定义初始状态
const initialCartState = {
  items: [],         // 购物车中的商品列表
  totalPrice: 0,     // 总价
  totalItems: 0,     // 总数量
};

// 2. 定义 reducer 函数
/**
 * reducer 是一个纯函数：(state, action) => newState
 * 它根据 action.type 决定如何更新状态
 * 必须返回一个新的状态对象（不可变更新）
 */
function cartReducer(state, action) {
  switch (action.type) {
    // 添加商品到购物车
    case 'ADD_ITEM': {
      const { item } = action.payload;
      // 检查商品是否已在购物车中
      const existingIndex = state.items.findIndex((i) => i.id === item.id);

      let newItems;
      if (existingIndex >= 0) {
        // 已存在：增加数量
        newItems = state.items.map((i, index) =>
          index === existingIndex
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        // 不存在：添加到列表
        newItems = [...state.items, { ...item, quantity: 1 }];
      }

      // 重新计算总价和总数量
      return {
        items: newItems,
        totalPrice: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
      };
    }

    // 移除商品
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((i) => i.id !== action.payload.id);
      return {
        items: newItems,
        totalPrice: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
      };
    }

    // 更新商品数量
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      // 数量为 0 时移除商品
      if (quantity <= 0) {
        const newItems = state.items.filter((i) => i.id !== id);
        return {
          items: newItems,
          totalPrice: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
          totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
        };
      }

      const newItems = state.items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      );
      return {
        items: newItems,
        totalPrice: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
      };
    }

    // 清空购物车
    case 'CLEAR_CART': {
      return initialCartState;
    }

    // 默认：返回当前状态
    default:
      return state;
  }
}

// 3. 商品数据
const products = [
  { id: 1, name: 'React 入门教程', price: 59.00, image: '📘' },
  { id: 2, name: 'JavaScript 高级编程', price: 89.00, image: '📗' },
  { id: 3, name: 'TypeScript 实战', price: 79.00, image: '📕' },
  { id: 4, name: 'Node.js 开发指南', price: 69.00, image: '📙' },
];

// 4. 购物车组件
function CartWithReducer() {
  // useReducer 返回 [当前状态, dispatch 函数]
  // dispatch 用于发送 action，触发 reducer 更新状态
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);

  // dispatch 一个 action 来添加商品
  const addItem = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', payload: { item } });
  }, []);

  const removeItem = useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  return (
    <div>
      <h2>useReducer 购物车</h2>

      {/* 商品列表 */}
      <h3>商品列表</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {products.map((product) => (
          <div key={product.id} style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
            <div style={{ fontSize: '32px' }}>{product.image}</div>
            <h4 style={{ margin: '4px 0' }}>{product.name}</h4>
            <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>¥{product.price.toFixed(2)}</p>
            <button onClick={() => addItem(product)} style={{ padding: '6px 16px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              加入购物车
            </button>
          </div>
        ))}
      </div>

      {/* 购物车内容 */}
      <h3>购物车 ({cart.totalItems} 件商品)</h3>
      {cart.items.length === 0 ? (
        <p style={{ color: '#999' }}>购物车是空的</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>商品</th>
                <th style={{ padding: '8px', textAlign: 'center' }}>单价</th>
                <th style={{ padding: '8px', textAlign: 'center' }}>数量</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>小计</th>
                <th style={{ padding: '8px' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{item.image} {item.name}</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>¥{item.price.toFixed(2)}</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>
                    ¥{(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <button onClick={() => removeItem(item.id)} style={{ color: '#d32f2f', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <button onClick={clearCart} style={{ padding: '8px 16px', border: '1px solid #d32f2f', color: '#d32f2f', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>
              清空购物车
            </button>
            <div>
              <span style={{ fontSize: '14px', color: '#666' }}>总计：</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#d32f2f' }}>
                ¥{cart.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ========================================
// 第二部分：Zustand Store 示例（需要安装 zustand）
// ========================================
// 以下代码展示了 Zustand 的用法
// 需要先安装：npm install zustand

/**
 * Zustand Store 定义示例（不能直接运行，需要安装 zustand）
 * 
 * import { create } from 'zustand';
 * 
 * // 创建 store —— 比 Redux 简洁得多
 * const useStore = create((set, get) => ({
 *   // 状态
 *   count: 0,
 *   user: null,
 *   theme: 'light',
 * 
 *   // 操作方法
 *   increment: () => set((state) => ({ count: state.count + 1 })),
 *   decrement: () => set((state) => ({ count: state.count - 1 })),
 *   setUser: (user) => set({ user }),
 *   toggleTheme: () => set((state) => ({
 *     theme: state.theme === 'light' ? 'dark' : 'light',
 *   })),
 *   reset: () => set({ count: 0, user: null, theme: 'light' }),
 * }));
 * 
 * // 在组件中使用
 * function Counter() {
 *   // 按需选择需要的状态和方法
 *   const count = useStore((state) => state.count);
 *   const increment = useStore((state) => state.increment);
 *   return <button onClick={increment}>Count: {count}</button>;
 * }
 */

// Zustand 说明面板
function ZustandExplanation() {
  return (
    <div style={{ marginTop: '32px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
      <h2>Zustand 状态管理示例</h2>
      <p>Zustand 是一个轻量级的状态管理库，比 Redux 更简洁：</p>
      <ul>
        <li>不需要 Provider 包裹</li>
        <li>不需要 action 类型常量</li>
        <li>不需要 reducer 函数</li>
        <li>直接在 store 中定义方法</li>
        <li>自动避免不必要的重新渲染</li>
      </ul>
      <pre style={{ backgroundColor: '#1a1a2e', color: '#a8dadc', padding: '16px', borderRadius: '8px', fontSize: '13px', overflow: 'auto' }}>
{`// 安装：npm install zustand
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
}));

// 在组件中使用
function Counter() {
  const count = useStore((s) => s.count);
  const increment = useStore((s) => s.increment);
  return <button onClick={increment}>{count}</button>;
}`}
      </pre>
    </div>
  );
}

// ========================================
// 主应用组件
// ========================================
function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>第16章：useReducer 购物车 + Zustand</h1>
      <CartWithReducer />
      <ZustandExplanation />
    </div>
  );
}

export default App;
