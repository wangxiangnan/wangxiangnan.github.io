/**
 * 第4章 配套代码示例
 * 主题：组件组合 —— Card、Button、UserCard 等组件的组合使用
 * 使用方式：将代码复制到 React 项目的组件文件中使用
 * 学习要点：
 *   - 如何拆分 UI 为独立的小组件
 *   - 如何通过 props 传递数据和回调函数
 *   - 如何使用 children 实现组件嵌套
 */

import { useState } from 'react';

// ========================================
// 1. Button 组件 —— 最基础的可复用组件
// ========================================
/**
 * 通用按钮组件
 * @param {string} variant - 按钮样式变体：'primary' | 'danger' | 'outline'
 * @param {string} size - 按钮尺寸：'small' | 'medium' | 'large'
 * @param {boolean} disabled - 是否禁用
 * @param {function} onClick - 点击事件的回调函数
 * @param {React.ReactNode} children - 按钮内部的文字或元素
 */
function Button({ variant = 'primary', size = 'medium', disabled = false, onClick, children }) {
  // 根据 variant 定义不同的背景色和边框
  const variantStyles = {
    primary: { backgroundColor: '#1976d2', color: 'white', border: 'none' },
    danger: { backgroundColor: '#d32f2f', color: 'white', border: 'none' },
    outline: { backgroundColor: 'transparent', color: '#1976d2', border: '2px solid #1976d2' },
  };

  // 根据 size 定义不同的内边距和字号
  const sizeStyles = {
    small: { padding: '4px 12px', fontSize: '12px' },
    medium: { padding: '8px 20px', fontSize: '14px' },
    large: { padding: '12px 32px', fontSize: '18px' },
  };

  // 合并样式对象
  const style = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s',
  };

  return (
    <button style={style} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

// ========================================
// 2. Avatar 组件 —— 用户头像
// ========================================
/**
 * 头像组件
 * @param {string} src - 图片地址
 * @param {string} alt - 图片替代文字
 * @param {number} size - 头像尺寸（像素）
 */
function Avatar({ src, alt = '头像', size = 48 }) {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%', // 圆形头像
    objectFit: 'cover',  // 图片填充方式
    border: '2px solid #e0e0e0',
  };

  // 如果没有提供图片地址，显示首字母占位
  if (!src) {
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1976d2',
          color: 'white',
          fontSize: `${size / 2}px`,
          fontWeight: 'bold',
        }}
      >
        {alt.charAt(0)}
      </div>
    );
  }

  return <img src={src} alt={alt} style={style} />;
}

// ========================================
// 3. Badge 组件 —— 标签/徽章
// ========================================
/**
 * 徽章组件
 * @param {string} color - 徽章颜色
 * @param {React.ReactNode} children - 徽章内容
 */
function Badge({ color = '#1976d2', children }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        backgroundColor: color,
        color: 'white',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        marginRight: '4px',
      }}
    >
      {children}
    </span>
  );
}

// ========================================
// 4. Card 组件 —— 通用卡片容器
// ========================================
/**
 * 卡片容器组件，使用了 children 模式
 * children 是 React 的特殊 prop，代表组件标签之间的内容
 * @param {string} title - 卡片标题
 * @param {React.ReactNode} footer - 卡片底部内容
 * @param {React.ReactNode} children - 卡片主体内容
 */
function Card({ title, footer, children }) {
  return (
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '16px',
        backgroundColor: 'white',
      }}
    >
      {/* 卡片头部 */}
      {title && (
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          {title}
        </div>
      )}

      {/* 卡片主体 —— 通过 children 渲染 */}
      <div style={{ padding: '20px' }}>{children}</div>

      {/* 卡片底部（可选） */}
      {footer && (
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#fafafa',
            fontSize: '13px',
            color: '#666',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

// ========================================
// 5. UserCard 组件 —— 组合 Avatar + Badge + Card
// ========================================
/**
 * 用户卡片组件 —— 展示组件组合的核心示例
 * 将 Avatar、Badge、Button、Card 组合在一起
 */
function UserCard({ user, onFollow, onMessage }) {
  // 跟踪是否已关注
  const [isFollowing, setIsFollowing] = useState(false);

  // 点击关注按钮的处理函数
  function handleFollowClick() {
    setIsFollowing(!isFollowing);
    // 如果父组件传了回调函数，就调用它
    if (onFollow) {
      onFollow(user.id, !isFollowing);
    }
  }

  return (
    <Card
      title="用户资料"
      footer={`注册时间：${user.joinDate || '2024-01-15'}`}
    >
      {/* 头部区域：头像 + 基本信息 */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Avatar src={user.avatar} alt={user.name} size={64} />
        <div>
          <h3 style={{ margin: '0 0 4px 0' }}>{user.name}</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            {user.bio || '这个人很懒，什么都没写'}
          </p>
        </div>
      </div>

      {/* 标签区域 */}
      <div style={{ margin: '16px 0' }}>
        {user.tags && user.tags.map((tag) => (
          <Badge key={tag} color="#1976d2">
            {tag}
          </Badge>
        ))}
      </div>

      {/* 统计信息 */}
      <div style={{ display: 'flex', gap: '24px', margin: '16px 0' }}>
        <div>
          <strong>{user.followers || 0}</strong>
          <span style={{ color: '#666', marginLeft: '4px' }}>粉丝</span>
        </div>
        <div>
          <strong>{user.following || 0}</strong>
          <span style={{ color: '#666', marginLeft: '4px' }}>关注</span>
        </div>
        <div>
          <strong>{user.posts || 0}</strong>
          <span style={{ color: '#666', marginLeft: '4px' }}>文章</span>
        </div>
      </div>

      {/* 操作按钮区域 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button
          variant={isFollowing ? 'outline' : 'primary'}
          onClick={handleFollowClick}
        >
          {isFollowing ? '已关注' : '关注'}
        </Button>
        <Button variant="outline" onClick={() => onMessage && onMessage(user.id)}>
          发消息
        </Button>
      </div>
    </Card>
  );
}

// ========================================
// 6. StatCard 组件 —— 数据统计卡片
// ========================================
function StatCard({ label, value, trend }) {
  // 根据趋势方向决定颜色
  const trendColor = trend > 0 ? '#4caf50' : trend < 0 ? '#d32f2f' : '#666';
  const trendIcon = trend > 0 ? '↑' : trend < 0 ? '↓' : '—';

  return (
    <Card>
      <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '14px' }}>
        {label}
      </p>
      <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>
        {value}
      </p>
      <p style={{ margin: '8px 0 0 0', color: trendColor, fontSize: '14px' }}>
        {trendIcon} {Math.abs(trend)}% 较上周
      </p>
    </Card>
  );
}

// ========================================
// 7. 主应用组件 —— 将所有组件组合在一起
// ========================================
function App() {
  // 模拟用户数据
  const userData = {
    id: 1,
    name: '张三',
    avatar: '', // 留空测试 Avatar 的占位逻辑
    bio: '全栈开发工程师，热爱开源',
    tags: ['React', 'Node.js', 'TypeScript'],
    followers: 1280,
    following: 256,
    posts: 42,
    joinDate: '2023-06-15',
  };

  // 关注事件的回调
  function handleFollow(userId, isFollowing) {
    console.log(`用户 ${userId} 的关注状态变为：${isFollowing}`);
  }

  // 发消息事件的回调
  function handleMessage(userId) {
    console.log(`给用户 ${userId} 发送消息`);
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>第4章：组件组合示例</h1>

      {/* 展示 Button 组件的各种变体 */}
      <Card title="Button 组件变体展示">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button variant="primary">主要按钮</Button>
          <Button variant="danger">危险按钮</Button>
          <Button variant="outline">轮廓按钮</Button>
          <Button variant="primary" size="small">小号</Button>
          <Button variant="primary" size="large">大号</Button>
          <Button variant="primary" disabled={true}>禁用</Button>
        </div>
      </Card>

      {/* 展示 UserCard 组件 */}
      <UserCard
        user={userData}
        onFollow={handleFollow}
        onMessage={handleMessage}
      />

      {/* 展示 StatCard 组件 */}
      <Card title="数据概览">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <StatCard label="访问量" value="12,580" trend={12.5} />
          <StatCard label="新用户" value="328" trend={-3.2} />
          <StatCard label="转化率" value="4.8%" trend={0} />
        </div>
      </Card>
    </div>
  );
}

export default App;
