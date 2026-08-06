// import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid"

// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: "My website",
  description: "A VitePress Site",
  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true,
    },
  },
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
          { text: 'Go语言', link: '/golang/ch01' },
          { text: 'NodeJS语言', link: '/nodejs/ch01' },
          { text: 'Redis 完全教程', link: '/redis/ch00' },
          { text: 'Mysql 完全教程', link: '/mysql/ch00' },
          { text: 'Sqlite 完全教程', link: '/sqlite/ch01' },
        ]
      },
      {
        text: '运维&工具类',
        items: [
          { text: 'GitHub Actions 教程', link: '/github-actions/ch01' },
          { text: 'Docker 完全教程', link: '/docker/ch00' },
          { text: 'Linux命令行完全教程', link: '/linux-command/ch00' },
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

      '/docker/': [
        {
          text: 'Docker 完全教程：从容器化新手到Kubernetes老手',
          items: [
            { text: '第0章 Docker概览', link: '/docker/ch00' },
            { text: '第一章 Docker是什么？', link: '/docker/ch01' },
            { text: '第二章 安装Docker与运行第一个容器', link: '/docker/ch02' },
            { text: '第三章 镜像管理', link: '/docker/ch03' },
            { text: '第四章 容器生命周期管理', link: '/docker/ch04' },
            { text: '第五章 Dockerfile完全指南', link: '/docker/ch05' },
            { text: '第六章 多阶段构建与高级Dockerfile技巧', link: '/docker/ch06' },
            { text: '第七章 Docker数据持久化', link: '/docker/ch07' },
            { text: '第八章 Docker网络详解', link: '/docker/ch08' },
            { text: '第九章 Docker Compose 入门', link: '/docker/ch09' },
            { text: '第十章 Docker Compose 高级特性', link: '/docker/ch10' },
            { text: '第十一章 Docker 安全最佳实践', link: '/docker/ch11' },
            { text: '第十二章 Docker 性能优化', link: '/docker/ch12' },
            { text: '第十三章 Docker 日志管理与调试技巧', link: '/docker/ch13' },
            { text: '第十四章 Docker与CI/CD', link: '/docker/ch14' },
            { text: '第十五章 Docker Registry', link: '/docker/ch15' },
            { text: '第十六章 Docker Swarm', link: '/docker/ch16' },
            { text: '第十七章 Swarm 高级运维与故障排查', link: '/docker/ch17' },
            { text: '第十八章 Kubernetes核心概念', link: '/docker/ch18' },
            { text: '第十九章 K8s部署实战', link: '/docker/ch19' },
            { text: '第二十章 K8s进阶', link: '/docker/ch20' },
            { text: '第二十一章 生产环境最佳实践', link: '/docker/ch21' },
          ]
        }
      ],

      '/redis/': [
        {
          text: 'Redis 完全教程',
          items: [
            { text: '第0章 Redis概览', link: '/redis/ch00' },
            { text: '第一章 Redis是什么？', link: '/redis/ch01' },
            { text: '第二章 安装Redis与Node.js开发环境搭建', link: '/redis/ch02' },
            { text: '第三章 五大数据类型', link: '/redis/ch03' },
            { text: '第四章 Key的命名艺术与过期策略', link: '/redis/ch04' },
            { text: '第五章 事务与管道', link: '/redis/ch05' },
            { text: '第六章 持久化', link: '/redis/ch06' },
            { text: '第七章 安全', link: '/redis/ch07' },
            { text: '第八章 Pub/Sub与Pipeline', link: '/redis/ch08' },
            { text: '第九章 Redis Stream', link: '/redis/ch09' },
            { text: '第十章 Lua脚本', link: '/redis/ch10' },
            { text: '第十一章 RediSearch', link: '/redis/ch11' },
            { text: '第十二章 RedisJSON', link: '/redis/ch12' },
            { text: '第十三章 RedisGraph与RedisTimeSeries', link: '/redis/ch13' },
            { text: '第十四章 主从复制', link: '/redis/ch14' },
            { text: '第十五章 哨兵模式', link: '/redis/ch15' },
            { text: '第十六章 Cluster集群', link: '/redis/ch16' },
            { text: '第十七章 Cluster高级', link: '/redis/ch17' },
            { text: '第十八章 高可用架构设计', link: '/redis/ch18' },
            { text: '第十九章 性能调优', link: '/redis/ch19' },
            { text: '第二十章 缓存模式', link: '/redis/ch20' },
            { text: '第二十一章 分布式锁', link: '/redis/ch21' },
            { text: '第二十二章 排行榜与计数器', link: '/redis/ch22' },
            { text: '第二十三章 会话管理与限流', link: '/redis/ch23' },
            { text: '第二十四章 生产环境最佳实践与总结', link: '/redis/ch24' },
          ]
        }
      ],

      '/mysql/': [
        {
          text: 'mysql 完全教程',
          items: [
            { text: '第0章 Mysql概览', link: '/mysql/ch00' },
            { text: '第一章 MySQL 简介与安装', link: '/mysql/ch01' },
            { text: '第二章 数据库与表的设计', link: '/mysql/ch02' },
            { text: '第三章 CRUD 操作', link: '/mysql/ch03' },
            { text: '第四章 SELECT 查询进阶', link: '/mysql/ch04' },
            { text: '第五章 聚合函数与分组', link: '/mysql/ch05' },
            { text: '第六章 多表连接（JOIN）', link: '/mysql/ch06' },
            { text: '第七章 索引原理与优化', link: '/mysql/ch07' },
            { text: '第八章 视图、存储过程与触发器', link: '/mysql/ch08' },
            { text: '第九章 事务与锁机制', link: '/mysql/ch09' },
            { text: '第十章 用户管理与权限控制', link: '/mysql/ch10' },
            { text: '第十一章 备份与恢复', link: '/mysql/ch11' },
            { text: '第十二章 日志与监控', link: '/mysql/ch12' },
            { text: '第十三章 查询优化器深度解析', link: '/mysql/ch13' },
            { text: '第十四章 分库分表策略', link: '/mysql/ch14' },
            { text: '第十五章 主从复制与读写分离', link: '/mysql/ch15' },
            { text: '第十六章 高可用集群架构', link: '/mysql/ch16' },
            { text: '第十七章 性能调优实战', link: '/mysql/ch17' },
            { text: '第十八章 安全加固与审计', link: '/mysql/ch18' },
            { text: '第十九章 电商系统数据库设计', link: '/mysql/ch19' },
            { text: '第二十章 社交平台数据库设计', link: '/mysql/ch20' },
            { text: '第二十一章 数据迁移与版本升级', link: '/mysql/ch21' },
            { text: '第二十二章 云数据库服务对比与选型', link: '/mysql/ch22' },
            { text: '第二十三章 DBA日常工作与故障排查', link: '/mysql/ch23' },
          ]
        }
      ],

      '/nodejs/': [
        {
          text: 'NodeJS 完全教程',
          items: [
            { text: '第一章 启程——Node.js 是什么 & 环境搭建', link: '/nodejs/ch01' },
            { text: '第二章 模块系统', link: '/nodejs/ch02' },
            { text: '第三章 异步编程（上）', link: '/nodejs/ch03' },
            { text: '第四章 异步编程（下）', link: '/nodejs/ch04' },
            { text: '第五章 npm 与包管理', link: '/nodejs/ch05' },
            { text: '第六章 TypeScript + Node.js', link: '/nodejs/ch06' },
            { text: '第七章 文件系统(fs)', link: '/nodejs/ch07' },
            { text: '第八章 Stream', link: '/nodejs/ch08' },
            { text: '第九章 Buffer 与二进制', link: '/nodejs/ch09' },
            { text: '第十章 Events', link: '/nodejs/ch10' },
            { text: '第十一章 网络编程', link: '/nodejs/ch11' },
            { text: '第十二章 子进程与集群', link: '/nodejs/ch12' },
            { text: '第十三章 错误处理与调试', link: '/nodejs/ch13' },
            { text: '第十四章 HTTP模块', link: '/nodejs/ch14' },
            { text: '第十五章 Express.js', link: '/nodejs/ch15' },
            { text: '第十六章 Koa.js', link: '/nodejs/ch16' },
            { text: '第十七章 Fastify', link: '/nodejs/ch17' },
            { text: '第十八章 认证与鉴权', link: '/nodejs/ch18' },
            { text: '第十九章 RESTful API设计与最佳实践', link: '/nodejs/ch19' },
            { text: '第二十章 性能调优', link: '/nodejs/ch20' },
            { text: '第二十一章 Worker Threads', link: '/nodejs/ch21' },
            { text: '第二十二章 数据库集成', link: '/nodejs/ch22' },
            { text: '第二十三章 微服务架构', link: '/nodejs/ch23' },
            { text: '第二十四章 Docker容器化与CI/CD部署', link: '/nodejs/ch24' },
            { text: '第二十五章 全栈实战', link: '/nodejs/ch25' },
          ]
        }
      ],

      '/linux-command/': [
        {
          text: 'Linux命令行完全教程',
          items: [
            { text: '第一章 走进Linux世界', link: '/linux-command/ch01' },
            { text: '第二章 文件系统导航', link: '/linux-command/ch02' },
            { text: '第三章 文件与目录操作', link: '/linux-command/ch03' },
            { text: '第四章 查看与编辑文件', link: '/linux-command/ch04' },
            { text: '第五章 用户与权限', link: '/linux-command/ch05' },
            { text: '第六章 管道与重定向', link: '/linux-command/ch06' },
            { text: '第七章 进程管理', link: '/linux-command/ch07' },
            { text: '第八章 软件包管理', link: '/linux-command/ch08' },
            { text: '第九章 磁盘与存储', link: '/linux-command/ch09' },
            { text: '第十章 用户与组管理', link: '/linux-command/ch10' },
            { text: '第十一章 Systemd与服务管理', link: '/linux-command/ch11' },
            { text: '第十二章 计划任务与自动化', link: '/linux-command/ch12' },
            { text: '第十三章 系统日志与监控', link: '/linux-command/ch13' },
            { text: '第十四章 网络基础命令', link: '/linux-command/ch14' },
            { text: '第十五章 SSH远程访问', link: '/linux-command/ch15' },
            { text: '第十六章 防火墙与安全', link: '/linux-command/ch16' },
            { text: '第十七章 Web服务搭建', link: '/linux-command/ch17' },
            { text: '第十八章 下载与API调用', link: '/linux-command/ch18' },
            { text: '第十九章 DNS与域名解析', link: '/linux-command/ch19' },
            { text: '第二十章 Shell脚本入门', link: '/linux-command/ch20' },
            { text: '第二十一章 Shell脚本进阶', link: '/linux-command/ch21' },
            { text: '第二十二章 文本处理三剑客——grep、sed、awk', link: '/linux-command/ch22' },
            { text: '第二十三章 高级文本处理与正则表达式', link: '/linux-command/ch23' },
            { text: '第二十四章 性能调优与故障排查', link: '/linux-command/ch24' },
            { text: '第二十五章 Docker容器与Linux现代化', link: '/linux-command/ch25' },
          ]
        }
      ],

      '/sqlite/': [
        {
          text: 'SQLite 完全教程',
          items: [
            { text: '第一章 认识 SQLite', link: '/sqlite/ch01' },
            { text: '第二章 安装与工具链', link: '/sqlite/ch02' },
            { text: '第三章 SQL 基础（上）—— DDL 表结构设计', link: '/sqlite/ch03' },
            { text: '第四章 SQL 基础（中）—— DML 增删改查', link: '/sqlite/ch04' },
            { text: '第五章 SQL 基础（下）—— JOIN、子查询与聚合', link: '/sqlite/ch05' },
            { text: '第六章 数据类型与类型亲和性', link: '/sqlite/ch06' },
            { text: '第七章 约束与索引', link: '/sqlite/ch07' },
            { text: '第八章 事务与 ACID', link: '/sqlite/ch08' },
            { text: '第九章 视图、触发器与 CTE', link: '/sqlite/ch09' },
            { text: '第十章 Flutter 集成（一）——sqflite 上手实战', link: '/sqlite/ch10' },
            { text: '第十一章 Flutter 集成（二）——Drift 类型安全 ORM', link: '/sqlite/ch11' },
            { text: '第十二章 FTS5：让SQLite变身Elasticsearch（迷你版）', link: '/sqlite/ch12' },
            { text: '第十三章 JSON1：让SQLite变身MongoDB（迷你版）', link: '/sqlite/ch13' },
            { text: '第十四章 R-Tree：让SQLite变身PostGIS（迷你版）', link: '/sqlite/ch14' },
            { text: '第十五章 虚拟表与UDF', link: '/sqlite/ch15' },
            { text: '第十六章 窗口函数与递归CTE', link: '/sqlite/ch16' },
            { text: '第十七章 备份恢复', link: '/sqlite/ch17' },
            { text: '第十八章 SQLite 内部原理', link: '/sqlite/ch18' },
            { text: '第十九章 WAL 模式深度解析', link: '/sqlite/ch19' },
            { text: '第二十章 性能调优', link: '/sqlite/ch20' },
            { text: '第二十一章 现代生态', link: '/sqlite/ch21' },
            { text: '第二十二章 实战——Flutter 笔记应用完整项目', link: '/sqlite/ch22' },
          ]
        }
      ],

    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wangxiangnan/wangxiangnan.github.io' }
    ]
  },
  outDir: 'dist',
  srcDir: 'src',
  mermaid: {
    
  }
})
