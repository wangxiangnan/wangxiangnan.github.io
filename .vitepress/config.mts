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
          { text: 'Flutter', link: '/flutter/flutter' }
        ]
      },
      {
        text: '后端',
        items: [
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
            { text: '第十三章：状态管理与InheritedWidget原理', link: '/flutter/flutter-13' }
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  outDir: 'dist',
  srcDir: 'src'
})
