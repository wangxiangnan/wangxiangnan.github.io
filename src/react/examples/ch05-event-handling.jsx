/**
 * 第5章 配套代码示例
 * 主题：事件处理 —— 点赞按钮、表单事件、键盘事件
 * 使用方式：将代码复制到 React 项目的组件文件中使用
 * 学习要点：
 *   - React 事件使用驼峰命名（onClick 而非 onclick）
 *   - 事件处理函数接收的是 SyntheticEvent（合成事件），不是原生事件
 *   - 如何正确地向事件处理函数传递参数
 */

import { useState } from 'react';

// ========================================
// 1. 点赞按钮 —— 基础点击事件
// ========================================
function LikeButton() {
  // 点赞数
  const [likes, setLikes] = useState(0);
  // 是否已点赞
  const [isLiked, setIsLiked] = useState(false);

  // 处理点赞/取消点赞
  function handleLike() {
    if (isLiked) {
      // 取消点赞：数量减 1
      setLikes((prev) => prev - 1);
    } else {
      // 点赞：数量加 1
      setLikes((prev) => prev + 1);
    }
    // 切换点赞状态
    setIsLiked(!isLiked);
  }

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <h3>点赞按钮</h3>
      {/* 
        onClick 直接绑定函数引用
        注意：不要写成 onClick={handleLike()}，这样会在渲染时立即执行
      */}
      <button
        onClick={handleLike}
        style={{
          padding: '10px 24px',
          fontSize: '18px',
          backgroundColor: isLiked ? '#e91e63' : '#e0e0e0',
          color: isLiked ? 'white' : '#333',
          border: 'none',
          borderRadius: '24px',
          cursor: 'pointer',
          transition: 'all 0.3s',
        }}
      >
        {/* 根据状态显示不同的图标和文字 */}
        {isLiked ? '❤️ 已点赞' : '🤍 点赞'} ({likes})
      </button>
    </div>
  );
}

// ========================================
// 2. 事件对象的使用
// ========================================
function EventObjectDemo() {
  const [eventInfo, setEventInfo] = useState('点击按钮查看事件信息');

  // 处理函数接收事件对象 e（React 的合成事件）
  function handleClick(e) {
    // e.target 是触发事件的元素
    // e.currentTarget 是绑定事件的元素
    // e.type 是事件类型
    setEventInfo(
      `事件类型: ${e.type} | 目标元素: ${e.target.tagName} | 坐标: (${e.clientX}, ${e.clientY})`
    );
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>事件对象演示</h3>
      <button onClick={handleClick}>点击我查看事件信息</button>
      <p style={{ color: '#666', fontSize: '14px' }}>{eventInfo}</p>
    </div>
  );
}

// ========================================
// 3. 向事件处理函数传递参数
// ========================================
function VoteDemo() {
  // 各个选项的投票数
  const [votes, setVotes] = useState({
    react: 0,
    vue: 0,
    angular: 0,
  });

  // 投票处理函数，接收选项名称作为参数
  function handleVote(option) {
    // 使用展开运算符创建新的 votes 对象，更新对应选项的票数
    setVotes((prev) => ({
      ...prev,
      [option]: prev[option] + 1,
    }));
  }

  // 计算总票数
  const totalVotes = votes.react + votes.vue + votes.angular;

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>投票：你最喜欢的前端框架</h3>

      {/* 
        传递参数的两种方式：
        方式一：箭头函数包裹（推荐，更灵活）
        方式二：bind 方法
      */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        {/* 方式一：箭头函数 */}
        <button onClick={() => handleVote('react')}>
          React ({votes.react})
        </button>
        <button onClick={() => handleVote('vue')}>
          Vue ({votes.vue})
        </button>
        {/* 方式二：bind 方法 */}
        <button onClick={handleVote.bind(null, 'angular')}>
          Angular ({votes.angular})
        </button>
      </div>

      {/* 显示投票结果条形图 */}
      {totalVotes > 0 && (
        <div>
          {Object.entries(votes).map(([name, count]) => (
            <div key={name} style={{ marginBottom: '4px' }}>
              <span style={{ display: 'inline-block', width: '80px', textTransform: 'capitalize' }}>
                {name}
              </span>
              <div
                style={{
                  display: 'inline-block',
                  width: `${(count / totalVotes) * 200}px`,
                  height: '20px',
                  backgroundColor: '#1976d2',
                  borderRadius: '4px',
                  transition: 'width 0.3s',
                }}
              />
              <span style={{ marginLeft: '8px' }}>
                {((count / totalVotes) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
          <p>总票数：{totalVotes}</p>
        </div>
      )}
    </div>
  );
}

// ========================================
// 4. 表单事件处理
// ========================================
function FormEventDemo() {
  // 表单各字段的状态
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    gender: 'male',
    agreeTerms: false,
  });

  // 提交记录
  const [submissions, setSubmissions] = useState([]);

  // 通用的输入变化处理函数
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    // 根据输入类型取值：checkbox 用 checked，其他用 value
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue, // 使用计算属性名动态设置字段
    }));
  }

  // 表单提交处理
  function handleSubmit(e) {
    // 阻止表单默认的页面刷新行为
    e.preventDefault();

    // 将提交的数据添加到记录中
    setSubmissions((prev) => [...prev, { ...formData, id: Date.now() }]);

    // 清空表单
    setFormData({
      username: '',
      email: '',
      gender: 'male',
      agreeTerms: false,
    });
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>表单事件演示</h3>

      <form onSubmit={handleSubmit}>
        {/* 文本输入 */}
        <div style={{ marginBottom: '12px' }}>
          <label>用户名：</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="请输入用户名"
            required
          />
        </div>

        {/* 邮箱输入 */}
        <div style={{ marginBottom: '12px' }}>
          <label>邮箱：</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="请输入邮箱"
            required
          />
        </div>

        {/* 下拉选择 */}
        <div style={{ marginBottom: '12px' }}>
          <label>性别：</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
        </div>

        {/* 复选框 */}
        <div style={{ marginBottom: '12px' }}>
          <label>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            我同意服务条款
          </label>
        </div>

        {/* 提交按钮：未勾选协议时禁用 */}
        <button type="submit" disabled={!formData.agreeTerms}>
          提交
        </button>
      </form>

      {/* 显示提交记录 */}
      {submissions.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h4>提交记录：</h4>
          {submissions.map((sub) => (
            <div
              key={sub.id}
              style={{
                padding: '8px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                marginBottom: '4px',
                fontSize: '14px',
              }}
            >
              {sub.username} | {sub.email} | {sub.gender}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========================================
// 5. 键盘事件处理
// ========================================
function KeyboardEventDemo() {
  // 记录按下的键
  const [pressedKeys, setPressedKeys] = useState([]);
  // 搜索框内容
  const [searchText, setSearchText] = useState('');

  // 处理键盘按下事件
  function handleKeyDown(e) {
    // e.key 是按键的字符表示
    // e.code 是物理按键的标识
    // e.ctrlKey, e.shiftKey, e.altKey 表示修饰键是否按下
    const keyInfo = {
      key: e.key,
      code: e.code,
      ctrl: e.ctrlKey,
      shift: e.shiftKey,
      alt: e.altKey,
      time: new Date().toLocaleTimeString('zh-CN'),
    };

    setPressedKeys((prev) => [keyInfo, ...prev].slice(0, 5)); // 只保留最近 5 条

    // 示例：快捷键 Ctrl+Enter 提交
    if (e.ctrlKey && e.key === 'Enter') {
      alert('你按下了 Ctrl+Enter！');
    }
  }

  // 处理回车键搜索
  function handleSearchKeyDown(e) {
    if (e.key === 'Enter') {
      alert(`搜索：${searchText}`);
      setSearchText('');
    }
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>键盘事件演示</h3>

      {/* 搜索框：回车触发搜索 */}
      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="输入内容后按回车搜索..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          style={{ padding: '8px', width: '300px' }}
        />
      </div>

      {/* 键盘事件捕获区域 */}
      <div
        tabIndex={0} // tabIndex 让 div 可以获取焦点，从而接收键盘事件
        onKeyDown={handleKeyDown}
        style={{
          padding: '20px',
          border: '2px dashed #ccc',
          borderRadius: '8px',
          textAlign: 'center',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        点击此区域，然后按任意键查看事件信息
        <br />
        <small>试试按 Ctrl+Enter 触发快捷键</small>
      </div>

      {/* 显示最近按键记录 */}
      {pressedKeys.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <h4>最近按键记录：</h4>
          {pressedKeys.map((keyInfo, index) => (
            <div
              key={index}
              style={{
                padding: '4px 8px',
                backgroundColor: '#f5f5f5',
                marginBottom: '2px',
                fontSize: '13px',
                fontFamily: 'monospace',
              }}
            >
              [{keyInfo.time}] key="{keyInfo.key}" code="{keyInfo.code}"
              {keyInfo.ctrl && ' +Ctrl'}
              {keyInfo.shift && ' +Shift'}
              {keyInfo.alt && ' +Alt'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========================================
// 6. 鼠标事件处理
// ========================================
function MouseEventDemo() {
  // 跟踪鼠标位置
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // 跟踪鼠标是否进入区域
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>鼠标事件演示</h3>

      <div
        // onMouseMove：鼠标在元素上移动时触发
        onMouseMove={(e) => {
          // 获取鼠标相对于元素的位置
          const rect = e.currentTarget.getBoundingClientRect();
          setPosition({
            x: Math.round(e.clientX - rect.left),
            y: Math.round(e.clientY - rect.top),
          });
        }}
        // onMouseEnter：鼠标进入元素时触发（不冒泡）
        onMouseEnter={() => setIsHovered(true)}
        // onMouseLeave：鼠标离开元素时触发
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '300px',
          height: '200px',
          backgroundColor: isHovered ? '#e3f2fd' : '#f5f5f5',
          border: '2px solid #1976d2',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p>鼠标位置: ({position.x}, {position.y})</p>
          <p>状态: {isHovered ? '鼠标在区域内' : '鼠标在区域外'}</p>
        </div>
      </div>
    </div>
  );
}

// ========================================
// 7. 主应用组件
// ========================================
function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h1>第5章：事件处理示例</h1>

      <LikeButton />
      <hr />
      <EventObjectDemo />
      <hr />
      <VoteDemo />
      <hr />
      <FormEventDemo />
      <hr />
      <KeyboardEventDemo />
      <hr />
      <MouseEventDemo />
    </div>
  );
}

export default App;
