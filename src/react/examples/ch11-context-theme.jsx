/**
 * 第11章 配套代码示例
 * 主题：完整的主题切换 Context（亮色/暗色模式）
 * 使用方式：将代码复制到 React 项目的组件文件中使用
 * 学习要点：
 *   - createContext 创建 Context
 *   - useContext 消费 Context
 *   - Context Provider 提供数据
 *   - 主题切换的完整实现
 */

import { useState, useContext, createContext, useEffect } from 'react';

// ========================================
// 1. 定义主题配置
// ========================================
// 将亮色和暗色主题的样式定义为对象
const themes = {
  light: {
    name: 'light',
    backgroundColor: '#ffffff',
    surfaceColor: '#f5f5f5',
    textColor: '#212121',
    textSecondary: '#666666',
    primaryColor: '#1976d2',
    borderColor: '#e0e0e0',
    shadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  dark: {
    name: 'dark',
    backgroundColor: '#121212',
    surfaceColor: '#1e1e1e',
    textColor: '#e0e0e0',
    textSecondary: '#aaaaaa',
    primaryColor: '#64b5f6',
    borderColor: '#333333',
    shadow: '0 2px 8px rgba(0,0,0,0.5)',
  },
};

// ========================================
// 2. 创建 ThemeContext
// ========================================
// createContext 的参数是默认值，当组件不在 Provider 内时使用
const ThemeContext = createContext({
  theme: themes.light,
  toggleTheme: () => {},
});

// ========================================
// 3. ThemeProvider 组件
// ========================================
/**
 * 主题提供者组件
 * 包裹在应用最外层，向下传递主题状态和切换函数
 */
function ThemeProvider({ children }) {
  // 从 localStorage 读取上次的主题选择，默认为 light
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme-preference');
    return saved === 'dark';
  });

  // 当前的主题对象
  const theme = isDark ? themes.dark : themes.light;

  // 切换主题的函数
  function toggleTheme() {
    setIsDark((prev) => {
      const newValue = !prev;
      // 保存用户偏好到 localStorage
      localStorage.setItem('theme-preference', newValue ? 'dark' : 'light');
      return newValue;
    });
  }

  // 监听系统主题偏好变化
  useEffect(() => {
    // matchMedia 可以检测系统的暗色模式偏好
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function handleChange(e) {
      // 只在用户没有手动设置过主题时跟随系统
      const saved = localStorage.getItem('theme-preference');
      if (!saved) {
        setIsDark(e.matches);
      }
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    // Provider 的 value 是所有消费组件可以访问的数据
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ========================================
// 4. useTheme 自定义 Hook（简化消费）
// ========================================
// 封装 useContext，让消费组件的代码更简洁
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme 必须在 ThemeProvider 内部使用');
  }
  return context;
}

// ========================================
// 5. ThemeToggle 组件 —— 主题切换按钮
// ========================================
function ThemeToggle() {
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '8px 20px',
        fontSize: '16px',
        backgroundColor: theme.primaryColor,
        color: isDark ? '#121212' : '#ffffff',
        border: 'none',
        borderRadius: '24px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontWeight: 'bold',
      }}
    >
      {isDark ? '切换到亮色模式' : '切换到暗色模式'}
    </button>
  );
}

// ========================================
// 6. 使用主题的子组件
// ========================================

// 标题卡片
function HeaderCard() {
  const { theme } = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.surfaceColor,
        padding: '24px',
        borderRadius: '12px',
        border: `1px solid ${theme.borderColor}`,
        boxShadow: theme.shadow,
        marginBottom: '16px',
      }}
    >
      <h1 style={{ color: theme.textColor, margin: '0 0 8px 0' }}>
        主题切换演示
      </h1>
      <p style={{ color: theme.textSecondary, margin: 0 }}>
        这个应用支持亮色和暗色两种主题，你的偏好会自动保存。
      </p>
    </div>
  );
}

// 功能卡片
function FeatureCard({ icon, title, description }) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.surfaceColor,
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${theme.borderColor}`,
        boxShadow: theme.shadow,
        transition: 'all 0.3s',
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
      <h3 style={{ color: theme.textColor, margin: '0 0 8px 0' }}>{title}</h3>
      <p style={{ color: theme.textSecondary, margin: 0, fontSize: '14px' }}>
        {description}
      </p>
    </div>
  );
}

// 文章列表
function ArticleList() {
  const { theme } = useTheme();

  const articles = [
    { id: 1, title: 'React Context 详解', date: '2024-03-15' },
    { id: 2, title: '暗色模式最佳实践', date: '2024-03-20' },
    { id: 3, title: 'CSS 变量与主题切换', date: '2024-04-01' },
  ];

  return (
    <div
      style={{
        backgroundColor: theme.surfaceColor,
        borderRadius: '12px',
        border: `1px solid ${theme.borderColor}`,
        overflow: 'hidden',
        marginTop: '16px',
      }}
    >
      <h3 style={{ padding: '16px 20px', margin: 0, color: theme.textColor, borderBottom: `1px solid ${theme.borderColor}` }}>
        最近文章
      </h3>
      {articles.map((article) => (
        <div
          key={article.id}
          style={{
            padding: '12px 20px',
            borderBottom: `1px solid ${theme.borderColor}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: theme.primaryColor, cursor: 'pointer' }}>
            {article.title}
          </span>
          <span style={{ color: theme.textSecondary, fontSize: '13px' }}>
            {article.date}
          </span>
        </div>
      ))}
    </div>
  );
}

// ========================================
// 7. 主应用组件
// ========================================
function AppContent() {
  const { theme } = useTheme();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        transition: 'all 0.3s',
        fontFamily: 'sans-serif',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* 顶部工具栏 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: theme.primaryColor, margin: 0 }}>ThemeApp</h2>
          <ThemeToggle />
        </div>

        {/* 标题卡片 */}
        <HeaderCard />

        {/* 功能卡片网格 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <FeatureCard
            icon="createContext"
            title="Context API"
            description="使用 createContext 创建主题上下文，跨组件传递数据。"
          />
          <FeatureCard
            icon="useContext"
            title="消费 Context"
            description="通过 useContext Hook 在任意子组件中获取当前主题。"
          />
          <FeatureCard
            icon="save"
            title="持久化"
            description="将主题偏好保存到 localStorage，刷新页面不丢失。"
          />
        </div>

        {/* 文章列表 */}
        <ArticleList />
      </div>
    </div>
  );
}

// 用 ThemeProvider 包裹整个应用
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
