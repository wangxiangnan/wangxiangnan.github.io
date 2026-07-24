/**
 * 第3章 配套代码示例
 * 主题：JSX 各种用法演示 —— 表达式、条件渲染、列表渲染
 * 使用方式：将代码复制到 React 项目的组件文件中使用
 * 前置条件：需要安装 react
 */

import { useState } from 'react';

// ========================================
// 1. JSX 中嵌入 JavaScript 表达式
// ========================================
// JSX 中用花括号 {} 包裹任何合法的 JavaScript 表达式
function ExpressionDemo() {
  // 定义一些变量，后面会在 JSX 中使用
  const name = '小明';
  const age = 25;
  const hobbies = ['读书', '游泳', '编程'];

  // 定义一个函数，用于计算
  function getGreeting(hour) {
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  }

  // 获取当前小时数
  const currentHour = new Date().getHours();

  return (
    <section>
      <h2>1. JSX 中的表达式</h2>

      {/* 直接嵌入变量 */}
      <p>你好，我叫{name}，今年{age}岁。</p>

      {/* 嵌入计算表达式 */}
      <p>我出生于{new Date().getFullYear() - age}年。</p>

      {/* 嵌入函数调用 */}
      <p>{getGreeting(currentHour)}！现在是{currentHour}点。</p>

      {/* 嵌入数组方法 */}
      <p>我的爱好有：{hobbies.join('、')}</p>

      {/* 嵌入对象属性（需要先转为字符串） */}
      <p>当前时间：{new Date().toLocaleString('zh-CN')}</p>
    </section>
  );
}

// ========================================
// 2. 条件渲染 —— 四种常见方式
// ========================================
function ConditionalRenderingDemo() {
  // 登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 用户角色
  const [role, setRole] = useState('guest'); // guest | user | admin
  // 通知数量
  const [notifications, setNotifications] = useState(3);

  return (
    <section>
      <h2>2. 条件渲染</h2>

      {/* ---- 方式一：三元表达式 ---- */}
      {/* 适合简单的二选一场景 */}
      <h3>方式一：三元表达式</h3>
      <p>{isLoggedIn ? '欢迎回来！' : '请先登录'}</p>
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? '退出登录' : '登录'}
      </button>

      {/* ---- 方式二：逻辑与 (&&) ---- */}
      {/* 适合"满足条件就显示，否则不显示"的场景 */}
      <h3>方式二：逻辑与 (&&)</h3>
      {isLoggedIn && <p>你已登录，可以查看更多内容。</p>}
      {notifications > 0 && (
        <span style={{ color: 'red' }}>
          你有 {notifications} 条未读通知
        </span>
      )}

      {/* ---- 方式三：多条件用变量/函数 ---- */}
      {/* 适合复杂的多分支逻辑 */}
      <h3>方式三：变量存储渲染内容</h3>
      {(() => {
        // 用变量存储不同角色的欢迎语
        let welcomeMessage;
        if (role === 'admin') {
          welcomeMessage = <span style={{ color: 'gold' }}>管理员，欢迎回来！</span>;
        } else if (role === 'user') {
          welcomeMessage = <span style={{ color: 'green' }}>普通用户，你好！</span>;
        } else {
          welcomeMessage = <span style={{ color: 'gray' }}>游客，请登录。</span>;
        }
        return <p>角色提示：{welcomeMessage}</p>;
      })()}

      {/* 切换角色的按钮组 */}
      <div style={{ marginTop: '8px' }}>
        <button onClick={() => setRole('guest')}>切换为游客</button>
        <button onClick={() => setRole('user')}>切换为用户</button>
        <button onClick={() => setRole('admin')}>切换为管理员</button>
      </div>

      {/* ---- 方式四：提前 return ---- */}
      {/* 在子组件中使用，不在这里演示 */}

      <hr />
      <button onClick={() => setNotifications(notifications + 1)}>
        增加通知
      </button>
      <button onClick={() => setNotifications(0)}>
        清除通知
      </button>
    </section>
  );
}

// ========================================
// 3. 列表渲染
// ========================================
function ListRenderingDemo() {
  // 模拟一个水果列表数据
  const fruits = [
    { id: 1, name: '苹果', price: 8.5, color: 'red' },
    { id: 2, name: '香蕉', price: 5.0, color: 'yellow' },
    { id: 3, name: '葡萄', price: 15.0, color: 'purple' },
    { id: 4, name: '西瓜', price: 3.0, color: 'green' },
  ];

  // 简单字符串数组
  const skills = ['JavaScript', 'React', 'TypeScript', 'Node.js'];

  return (
    <section>
      <h2>3. 列表渲染</h2>

      {/* ---- 简单数组的渲染 ---- */}
      <h3>简单列表</h3>
      <ul>
        {/*
          map() 遍历数组，将每个元素转换为 JSX
          key 属性是 React 要求的唯一标识，帮助 React 识别哪些元素变化了
          注意：key 不要用数组索引，应该用稳定的唯一 ID
        */}
        {skills.map((skill, index) => (
          <li key={skill}>
            {index + 1}. {skill}
          </li>
        ))}
      </ul>

      {/* ---- 对象数组的渲染（更常见） ---- */}
      <h3>水果价目表</h3>
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: 'collapse', width: '100%' }}
      >
        <thead>
          <tr>
            <th>名称</th>
            <th>价格（元/斤）</th>
            <th>颜色</th>
          </tr>
        </thead>
        <tbody>
          {fruits.map((fruit) => (
            // 使用 fruit.id 作为 key，而不是数组索引
            <tr key={fruit.id}>
              <td>{fruit.name}</td>
              <td>{fruit.price.toFixed(2)}</td>
              <td>
                {/* 在列表中嵌套条件渲染和样式 */}
                <span style={{ color: fruit.color }}>
                  {fruit.color}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---- 嵌套列表的渲染 ---- */}
      <h3>嵌套列表</h3>
      {fruits.map((fruit) => (
        <div key={fruit.id} style={{ marginBottom: '10px' }}>
          <strong>{fruit.name}</strong>
          {/* 将水果名称拆成字符列表渲染 */}
          <ul>
            {fruit.name.split('').map((char, charIndex) => (
              // 嵌套列表也需要 key，这里用 水果ID + 字符索引 组合
              <li key={`${fruit.id}-${charIndex}`}>
                第{charIndex + 1}个字：{char}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* ---- 渲染过滤后的列表 ---- */}
      <h3>价格超过 5 元的水果</h3>
      <ul>
        {/* filter() 先过滤，再 map() 渲染 */}
        {fruits
          .filter((fruit) => fruit.price > 5)
          .map((fruit) => (
            <li key={fruit.id}>
              {fruit.name} - {fruit.price}元
            </li>
          ))}
      </ul>
    </section>
  );
}

// ========================================
// 4. JSX 中的样式处理
// ========================================
function StyleDemo() {
  const isActive = true;

  // 内联样式是一个对象，属性名用驼峰命名
  const boxStyle = {
    padding: '20px',
    backgroundColor: isActive ? '#e8f5e9' : '#ffebee',
    border: `2px solid ${isActive ? '#4caf50' : '#f44336'}`,
    borderRadius: '8px',
    marginTop: '10px',
  };

  return (
    <section>
      <h2>4. JSX 中的样式</h2>

      {/* 内联样式：直接写对象 */}
      <p style={{ color: 'blue', fontSize: '18px' }}>
        这是内联样式（直接写对象）
      </p>

      {/* 内联样式：使用预定义的对象 */}
      <div style={boxStyle}>
        这个盒子的样式来自 JavaScript 对象，
        状态为：{isActive ? '激活' : '未激活'}
      </div>

      {/* className 绑定 CSS 类名（需要在 CSS 文件中定义） */}
      <p className={isActive ? 'active-text' : 'inactive-text'}>
        这个元素使用了 CSS 类名
      </p>
    </section>
  );
}

// ========================================
// 5. 主应用组件
// ========================================
function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>第3章：JSX 语法全面演示</h1>
      <p>以下示例展示了 JSX 的各种常见用法。</p>

      <hr />
      <ExpressionDemo />
      <hr />
      <ConditionalRenderingDemo />
      <hr />
      <ListRenderingDemo />
      <hr />
      <StyleDemo />
    </div>
  );
}

export default App;
