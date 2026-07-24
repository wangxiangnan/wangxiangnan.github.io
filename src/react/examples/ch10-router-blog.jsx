/**
 * 第10章 配套代码示例
 * 主题：React Router v6 完整博客路由配置
 * 使用方式：需要安装 react-router-dom（v6），将代码集成到你的项目中
 * 安装命令：npm install react-router-dom
 * 学习要点：
 *   - BrowserRouter、Routes、Route 的基本配置
 *   - 嵌套路由（Outlet）
 *   - 动态路由参数（useParams）
 *   - 编程式导航（useNavigate）
 *   - 路由守卫（保护需要登录的页面）
 */

import { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Outlet,
  useParams,
  useNavigate,
  Navigate,
  useLocation,
} from 'react-router-dom';

// ========================================
// 1. 模拟数据 —— 博客文章列表
// ========================================
const blogPosts = [
  {
    id: 1,
    title: 'React Hooks 入门指南',
    summary: '本文详细介绍 useState、useEffect 等常用 Hooks 的使用方法。',
    content: 'React Hooks 是 React 16.8 引入的新特性，让函数组件也能使用状态和生命周期。最常用的 Hooks 包括 useState（状态管理）、useEffect（副作用处理）、useContext（上下文消费）等。',
    author: '张三',
    date: '2024-03-15',
    tags: ['React', 'Hooks'],
  },
  {
    id: 2,
    title: 'CSS Grid 布局完全教程',
    summary: '从零开始学习 CSS Grid，掌握二维布局的核心概念。',
    content: 'CSS Grid 是一种强大的二维布局系统。通过 grid-template-columns 和 grid-template-rows 定义网格结构，使用 grid-area 放置元素。',
    author: '李四',
    date: '2024-03-20',
    tags: ['CSS', '布局'],
  },
  {
    id: 3,
    title: 'TypeScript 与 React 最佳实践',
    summary: '如何在 React 项目中高效使用 TypeScript，提升代码质量。',
    content: 'TypeScript 为 React 项目带来了类型安全。通过定义 Props 接口、使用泛型组件、配合严格模式，可以在编译期捕获大量错误。',
    author: '王五',
    date: '2024-04-01',
    tags: ['TypeScript', 'React'],
  },
];

// ========================================
// 2. 布局组件 —— 定义页面的通用结构
// ========================================

// 导航栏组件
function Navbar() {
  // 简单的登录状态（实际项目中应该用 Context 或状态管理库）
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: '#1976d2',
        color: 'white',
      }}
    >
      {/* 网站 Logo / 标题 */}
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
        我的博客
      </Link>

      {/* 导航链接 —— NavLink 可以感知当前路由并高亮 */}
      <div style={{ display: 'flex', gap: '16px', marginLeft: '32px' }}>
        <NavLink
          to="/"
          end // end 属性确保只在精确匹配时才高亮
          style={({ isActive }) => ({
            color: 'white',
            textDecoration: 'none',
            padding: '4px 8px',
            borderBottom: isActive ? '2px solid white' : 'none',
          })}
        >
          首页
        </NavLink>
        <NavLink
          to="/blog"
          style={({ isActive }) => ({
            color: 'white',
            textDecoration: 'none',
            padding: '4px 8px',
            borderBottom: isActive ? '2px solid white' : 'none',
          })}
        >
          博客
        </NavLink>
        <NavLink
          to="/about"
          style={({ isActive }) => ({
            color: 'white',
            textDecoration: 'none',
            padding: '4px 8px',
            borderBottom: isActive ? '2px solid white' : 'none',
          })}
        >
          关于
        </NavLink>
      </div>

      {/* 右侧：登录/登出 */}
      <div style={{ marginLeft: 'auto' }}>
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          style={{
            padding: '6px 16px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {isLoggedIn ? '退出' : '登录'}
        </button>
      </div>
    </nav>
  );
}

// 页面布局：导航栏 + 内容区域（使用 Outlet 渲染子路由）
function Layout() {
  return (
    <div>
      <Navbar />
      {/* Outlet 会渲染当前匹配的子路由组件 */}
      <main style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        <Outlet />
      </main>
      <footer style={{ textAlign: 'center', padding: '20px', color: '#666', borderTop: '1px solid #eee' }}>
        &copy; 2024 我的博客 - React Router v6 示例
      </footer>
    </div>
  );
}

// ========================================
// 3. 页面组件
// ========================================

// 首页
function HomePage() {
  return (
    <div>
      <h1>欢迎来到我的博客</h1>
      <p>这是一个使用 React Router v6 构建的博客应用示例。</p>
      <div>
        <h2>最新文章</h2>
        {blogPosts.map((post) => (
          <div key={post.id} style={{ padding: '12px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '8px' }}>
            {/* Link 组件用于路由跳转 */}
            <Link to={`/blog/${post.id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>{post.title}</h3>
            </Link>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>{post.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 博客列表页
function BlogListPage() {
  return (
    <div>
      <h1>博客文章</h1>
      {blogPosts.map((post) => (
        <div key={post.id} style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '12px' }}>
          <Link to={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
            <h2 style={{ color: '#1976d2', margin: '0 0 8px 0' }}>{post.title}</h2>
          </Link>
          <p style={{ color: '#666' }}>{post.summary}</p>
          <div style={{ fontSize: '13px', color: '#999' }}>
            <span>作者：{post.author}</span> | <span>日期：{post.date}</span>
            <div style={{ marginTop: '4px' }}>
              {post.tags.map((tag) => (
                <span key={tag} style={{ marginRight: '8px', padding: '2px 8px', backgroundColor: '#e3f2fd', borderRadius: '4px', fontSize: '12px' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 博客详情页 —— 使用 useParams 获取路由参数
function BlogPostPage() {
  // useParams 返回路由中定义的动态参数
  // 对应路由路径 /blog/:postId 中的 postId
  const { postId } = useParams();
  const navigate = useNavigate();

  // 根据 ID 查找文章
  const post = blogPosts.find((p) => p.id === Number(postId));

  // 文章不存在时显示 404
  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>文章未找到</h2>
        <p>找不到 ID 为 {postId} 的文章。</p>
        {/* useNavigate 实现编程式导航 */}
        <button onClick={() => navigate('/blog')}>返回博客列表</button>
      </div>
    );
  }

  return (
    <article>
      {/* 返回按钮 */}
      <button
        onClick={() => navigate(-1)} // navigate(-1) 相当于浏览器的"后退"
        style={{ marginBottom: '16px', padding: '6px 12px', cursor: 'pointer' }}
      >
        &larr; 返回
      </button>

      <h1>{post.title}</h1>
      <div style={{ color: '#666', marginBottom: '16px' }}>
        <span>作者：{post.author}</span> | <span>发布日期：{post.date}</span>
      </div>
      <div style={{ lineHeight: 1.8, fontSize: '16px' }}>
        {post.content}
      </div>
      <div style={{ marginTop: '16px' }}>
        {post.tags.map((tag) => (
          <span key={tag} style={{ marginRight: '8px', padding: '4px 12px', backgroundColor: '#e3f2fd', borderRadius: '12px', fontSize: '13px' }}>
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

// 关于页
function AboutPage() {
  return (
    <div>
      <h1>关于本站</h1>
      <p>这是一个使用 React + React Router v6 构建的博客示例项目。</p>
      <p>旨在演示路由配置的各种常见用法。</p>
    </div>
  );
}

// 仪表盘（需要登录）
function DashboardPage() {
  return (
    <div>
      <h1>个人仪表盘</h1>
      <p>这里是只有登录后才能看到的内容。</p>
    </div>
  );
}

// 404 页面
function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h1 style={{ fontSize: '72px', margin: '0' }}>404</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>页面未找到</p>
      <button onClick={() => navigate('/')} style={{ padding: '10px 24px', fontSize: '16px', cursor: 'pointer' }}>
        回到首页
      </button>
    </div>
  );
}

// ========================================
// 4. 路由守卫 —— 保护需要登录的页面
// ========================================
function ProtectedRoute({ children }) {
  // 实际项目中，登录状态应该来自 Context 或状态管理
  const [isLoggedIn] = useState(false);

  // 未登录则重定向到首页
  if (!isLoggedIn) {
    // Navigate 组件用于声明式重定向
    // replace 属性表示替换当前历史记录（而非添加）
    return <Navigate to="/" replace />;
  }

  return children;
}

// ========================================
// 5. 路由配置 —— 核心部分
// ========================================
function App() {
  return (
    // BrowserRouter 提供路由上下文
    <BrowserRouter>
      {/* Routes 包裹所有 Route 定义 */}
      <Routes>
        {/* 使用 Layout 作为父路由，子路由内容通过 Outlet 渲染 */}
        <Route path="/" element={<Layout />}>
          {/* index 属性表示这是默认子路由（访问 / 时匹配） */}
          <Route index element={<HomePage />} />

          {/* 博客相关路由 —— 嵌套路由 */}
          <Route path="blog" element={<BlogListPage />} />
          {/* 动态路由参数 :postId */}
          <Route path="blog/:postId" element={<BlogPostPage />} />

          {/* 关于页 */}
          <Route path="about" element={<AboutPage />} />

          {/* 受保护的路由 */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* 404 兜底路由 —— path="*" 匹配所有未匹配的路径 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
