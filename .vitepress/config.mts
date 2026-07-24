import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My website",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      {
        text: '前端',
        items: [
          { text: 'Flutter常用 Widget', link: '/flutter/flutter' },
          { text: '深入理解Flutter主题', link: '/flutter/flutter-theme' },
          { text: 'React从零到实战', link: '/react/ch00' },
        ]
      },
      {
        text: '后端',
        items: [
          { text: 'go语言', link: '/golang/ch01' },
        ]
      },
      {
        text: '工具类',
        items: [
          { text: 'GitHub Actions 教程', link: '/github-actions/ch01' },
        ]
      }
    ],

    sidebar: {
      // 当用户位于 `flutter` 目录时，会显示此侧边栏
      '/flutter/': [
        {
          text: 'Flutter 常用 Widget 完全手册',
          items: [
            { text: '第一章：布局类', link: '/flutter/flutter-01' },
            { text: '第二章：滚动类', link: '/flutter/flutter-02' },
            { text: '第三章：交互类', link: '/flutter/flutter-03' },
            { text: '第四章：Material', link: '/flutter/flutter-04' },
            { text: '第五章：文本与样式类', link: '/flutter/flutter-05' },
            { text: '第六章：图片与图标', link: '/flutter/flutter-06' },
            { text: '第七章：动画类', link: '/flutter/flutter-07' },
            { text: '第八章：导航与路由', link: '/flutter/flutter-08' },
            { text: '第九章：对话框与浮层', link: '/flutter/flutter-09' },
            { text: '第十章：Cupertino (iOS)', link: '/flutter/flutter-10' },
            { text: '第十一章：异步与数据', link: '/flutter/flutter-11' },
            { text: '第十二章：工具与辅助', link: '/flutter/flutter-12' },
            { text: '第十三章：状态管理与InheritedWidget原理', link: '/flutter/flutter-13' },
            { text: '专题一：深入理解Flutter主题', link: '/flutter/flutter-theme' },
          ]
        }
      ],
      '/golang/': [
        {
          text: 'Go语言入门教程',
          items: [
            { text: '第一章 Go 语言初识', link: '/golang/ch01' },
            { text: '第二章 变量、类型与基础语法', link: '/golang/ch02' },
            { text: '第三章 函数', link: '/golang/ch03' },
            { text: '第四章 复合类型', link: '/golang/ch04' },
            { text: '第五章 接口与类型系统', link: '/golang/ch05' },
            { text: '第六章 并发编程', link: '/golang/ch06' },
            { text: '第七章 错误处理与工程实践', link: '/golang/ch07' },
            { text: '第八章 实战项目', link: '/golang/ch08' },
          ]
        }
      ],

      '/react/': [
        {
          text: 'React 完全教程：从零到实战',
          items: [
            { text: '第0章 React概览', link: '/react/ch00' },
            { text: '第一章 React 是什么', link: '/react/ch01' },
            { text: '第二章 环境搭建', link: '/react/ch02' },
            { text: '第三章 JSX', link: '/react/ch03' },
            { text: '第四章 组件', link: '/react/ch04' },
            { text: '第五章 事件处理与条件渲染', link: '/react/ch05' },
            { text: '第六章 useState', link: '/react/ch06' },
            { text: '第七章 useEffect', link: '/react/ch07' },
            { text: '第八章 表单处理', link: '/react/ch08' },
            { text: '第九章 useRef 与 DOM 操作', link: '/react/ch09' },
            { text: '第十章 React Router', link: '/react/ch10' },
            { text: '第十一章 Context', link: '/react/ch11' },
            { text: '第十二章 自定义 Hooks', link: '/react/ch12' },
            { text: '第十三章 样式方案大比拼', link: '/react/ch13' },
            { text: '第十四章 与后端 API 对话', link: '/react/ch14' },
            { text: '第十五章 性能优化', link: '/react/ch15' },
            { text: '第十六章 状态管理进阶', link: '/react/ch16' },
            { text: '第十七章 实战项目', link: '/react/ch17' },
            { text: '第十八章 测试与部署', link: '/react/ch18' },
          ]
        }
      ],

      '/github-actions/': [
        {
          text: 'GitHub Actions 教程',
          items: [
            { text: '第一章 什么是 GitHub Actions？', link: '/github-actions/ch01' },
            { text: '第二章 YAML 语法速查', link: '/github-actions/ch02' },
            { text: '第三章 Workflow 核心概念', link: '/github-actions/ch03' },
            { text: '第四章 你的第一个 Workflow', link: '/github-actions/ch04' },
            { text: '第五章 事件触发器深度解析', link: '/github-actions/ch05' },
            { text: '第六章 环境变量与 Secrets 管理', link: '/github-actions/ch06' },
            { text: '第七章 Actions Marketplace', link: '/github-actions/ch07' },
            { text: '第八章 构建矩阵', link: '/github-actions/ch08' },
            { text: '第九章 Artifacts与缓存', link: '/github-actions/ch09' },
            { text: '第十章 缓存依赖', link: '/github-actions/ch10' },
            { text: '第十一章 Reusable Workflows', link: '/github-actions/ch11' },
            { text: '第十二章 自定义 Action', link: '/github-actions/ch12' },
            { text: '第十三章 完整实战——Node.js 项目从测试到部署', link: '/github-actions/ch13' },
            { text: '第十四章 完整实战——Python 项目 CI/CD', link: '/github-actions/ch14' },
            { text: '第十五章 部署到云平台', link: '/github-actions/ch15' },
            { text: '第十六章 Workflow 调试与排错指南', link: '/github-actions/ch16' },
            { text: '第十七章 最佳实践与安全', link: '/github-actions/ch17' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wangxiangnan/wangxiangnan.github.io' }
    ]
  },
  outDir: 'dist',
  srcDir: 'src'
})
