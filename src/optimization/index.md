# 网页性能优化实战教程

## 为什么要优化网页性能

网页性能直接影响用户体验和商业指标：

- **用户留存**：页面加载超过 3 秒，53% 的移动用户会离开
- **转化率**：加载时间每增加 1 秒，转化率下降约 7%
- **SEO 排名**：Google 将 Core Web Vitals 作为搜索排名因素
- **移动端体验**：弱网环境下，性能优化决定用户能否正常使用

## Core Web Vitals 核心指标

Google 定义了三个核心指标，分别衡量不同维度：

| 指标 | 含义 | 目标值 | 优化方向 |
| ------ | ------ | -------- | ---------- |
| LCP | 最大内容绘制时间 | ≤ 2.5s | 加载速度 |
| INP | 交互到下一次绘制 | ≤ 200ms | 响应速度 |
| CLS | 累积布局偏移 | ≤ 0.1 | 视觉稳定性 |

### LCP（Largest Contentful Paint）

LCP 衡量视口内最大内容元素（图片、视频封面、大块文本）完成渲染的时间。

**影响因素**：

- 服务器响应时间（TTFB）
- 资源加载延迟
- 渲染阻塞资源
- 客户端渲染时间

### INP（Interaction to Next Paint）

INP 衡量用户交互（点击、触摸、按键）到页面下一次绘制的延迟。

**三个阶段**：

1. **输入延迟**：主线程繁忙，事件未被处理
2. **处理时间**：事件回调执行耗时
3. **呈现延迟**：样式计算、布局、绘制耗时

### CLS（Cumulative Layout Shift）

CLS 衡量页面加载过程中的意外布局偏移。

**常见原因**：

- 图片/视频未设置尺寸
- 广告或 iframe 动态插入
- 字体加载导致文本重排
- 动态内容推挤下方元素

## 性能测量工具

### 实验室工具（Lab）

**Chrome DevTools Performance 面板**

- 录制页面加载或交互过程
- 分析主线程火焰图、长任务、网络瀑布
- 定位具体瓶颈代码

**Lighthouse**

- 自动化性能审计
- 提供优化建议和评分
- 可在 DevTools 或 CLI 运行

**WebPageTest**

- 真实浏览器测试
- 多地点、多设备模拟
- 详细的水瀑布图和指标

### 真实用户监控（Field）

**PageSpeed Insights**

- 基于 CrUX 真实用户数据
- 提供实验室和现场数据
- 给出具体优化建议

**Chrome UX Report (CrUX)**

- Google 收集的真实用户数据
- 按设备和网络类型分组
- 可通过 API 查询

**Search Console**

- 查看网站的 Core Web Vitals 表现
- 识别问题页面
- 监控优化效果

## Chrome DevTools 性能工具详解

Chrome DevTools 提供了一套完整的性能分析工具，从不同维度帮助你定位和解决性能问题。

### Performance 面板：时间轴录制与分析

Performance 面板是最核心的性能分析工具，它录制页面运行时的所有活动，以时间轴形式呈现。

#### 录制流程

1. **打开面板**：F12 → Performance 标签页
2. **准备录制**：
   - 勾选 Screenshots（截图，便于定位卡顿瞬间）
   - 设置 CPU 降速（4x 或 6x，模拟中低端设备）
   - 设置网络节流（Fast 3G 或 4G，模拟弱网）
3. **开始录制**：
   - **分析页面加载**：点击 "Record and reload"（刷新图标），从页面重新加载开始录制
   - **分析交互**：点击 "Record"，执行操作（点击、滚动、输入），然后点击 "Stop"
4. **控制时长**：一次录制 3-10 秒为宜，太长会混入无关信息

#### 时间轴轨道说明

| 轨道 | 作用 | 关注点 |
| ------ | ------ | -------- |
| Screenshots | 逐帧截图 | 定位卡顿发生的视觉瞬间 |
| Network | 请求瀑布图 | 慢请求、阻塞渲染的资源 |
| Frames | 帧渲染情况 | 长帧、丢帧（标红） |
| Interactions | 用户交互 | INP 拆解（输入延迟/处理/呈现） |
| Main | 主线程火焰图 | JS、样式、布局、绘制的耗时 |
| Timings | 关键时刻 | FCP、LCP 标记 |
| Experience | 体验指标 | CLS 布局偏移、长任务 |

#### 读火焰图

火焰图（Flame Chart）是 Performance 面板的核心：

- **横轴**：时间
- **纵轴**：调用栈（越上层越深）
- **块宽度**：耗时
- **颜色含义**：
  - 黄色：JavaScript 脚本
  - 紫色：样式计算、布局
  - 绿色：绘制
  - 蓝色：加载
  - 灰色：系统/其他
- **红色三角**：超过 50ms 的长任务，优先处理

#### 底部面板

- **Insights**：自动诊断结果（渲染阻塞、强制回流、LCP 问题等），点击可跳转到对应位置
- **Bottom-Up**：按函数聚合，按 Self Time（自身耗时）排序，找热点函数
- **Call Tree**：调用树，看总耗时（包含子调用）
- **Event Log**：事件日志，按时间顺序列出所有事件

#### 实用技巧

- 用 `performance.mark()` 和 `performance.measure()` 在代码里打标记，会直接显示在 trace 里
- 保存 profile（Save profile）便于分享和前后对比
- 用 Ctrl+E（Mac: Cmd+E）快速开始/停止录制

### Memory 面板：内存泄漏检测

Memory 面板用于检测内存泄漏和优化内存使用。

#### 三种分析模式

**1. Heap Snapshot（堆快照）**

捕获当前内存中所有 JavaScript 对象的快照。

使用场景：

- 查找内存泄漏
- 分析对象分布
- 对比两次快照的差异

操作步骤：

1. 选择 "Heap Snapshot"
2. 点击 "Take snapshot"
3. 执行一些操作（如打开/关闭弹窗）
4. 再次 "Take snapshot"
5. 选择 "Summary" 视图，按对象类型查看
6. 使用 "Comparison" 视图对比两次快照，找出新增的对象

常见泄漏模式：

- **Detached DOM**：DOM 节点已从文档移除，但仍被 JavaScript 引用
- **闭包引用**：闭包意外持有大对象引用
- **事件监听器**：未移除的事件监听器
- **定时器**：未清除的 `setInterval` 或 `setTimeout`
- **全局变量**：意外创建的全局对象

**2. Allocation instrumentation on timeline（分配时间线）**

实时记录内存分配情况，按时间轴展示。

使用场景：

- 找出哪个操作导致内存飙升
- 定位内存分配的热点代码

操作步骤：

1. 选择 "Allocation instrumentation on timeline"
2. 点击 "Start"
3. 执行操作
4. 点击 "Stop"
5. 查看时间轴上的内存分配峰值
6. 点击峰值，查看当时分配的对象和调用栈

**3. Allocation sampling（分配采样）**

轻量级的内存分配采样，开销较小，适合长时间录制。

使用场景：

- 长时间监控内存分配
- 初步定位内存问题

#### 内存优化实践

- 及时清理事件监听器：`element.removeEventListener()`
- 清除定时器：`clearInterval()` / `clearTimeout()`
- 避免闭包持有大对象
- 使用 WeakMap 和 WeakSet 替代 Map 和 Set（当不需要强引用时）
- 定期用 Memory 面板检查，尤其是单页应用

### Performance Monitor：实时性能指标

Performance Monitor 提供实时的性能指标面板，适合快速查看页面运行状态。

#### 打开方式

- 按 Ctrl+Shift+P（Mac: Cmd+Shift+P）
- 输入 "Show Performance Monitor"
- 回车打开

#### 监控指标

| 指标 | 含义 | 关注点 |
| ------ | ------ | -------- |
| CPU Usage | CPU 使用率 | 持续高位说明有性能问题 |
| JS Heap Size | JavaScript 堆内存 | 持续增长可能泄漏 |
| DOM Nodes | DOM 节点数 | 过多影响性能 |
| JS Event Listeners | 事件监听器数量 | 过多影响交互性能 |
| Documents | 文档数量 | 通常应为 1 |
| Frames | 帧率 | 低于 60fps 说明卡顿 |

#### 使用场景

- 开发时实时监控性能
- 快速判断是否有内存泄漏（JS Heap 持续增长）
- 检查帧率是否稳定
- 对比优化前后的指标变化

### Rendering 面板：渲染调试

Rendering 面板提供多种可视化工具，帮助调试渲染问题。

#### 打开方式

- 按 Ctrl+Shift+P（Mac: Cmd+Shift+P）
- 输入 "Show Rendering"
- 回车打开

#### 核心功能

**1. Frame Rendering Stats（帧渲染统计）**

显示帧率和掉帧情况。

- 绿色方块：正常帧（< 16.7ms）
- 红色方块：掉帧（> 16.7ms）
- 用于快速判断是否有卡顿

**2. Paint Flashing（绘制闪烁）**

高亮显示每次绘制的区域。

- 彩色闪烁：绘制发生的位置
- 用途：找出不必要的重绘，优化绘制区域
- 目标：减少闪烁范围和频率

**3. Layout Shift Regions（布局偏移区域）**

高亮显示发生布局偏移的区域。

- 红色边框：发生偏移的元素
- 用途：定位 CLS 问题的具体元素
- 配合 Performance 面板的 Experience 轨道使用

**4. Layer Borders（图层边框）**

显示合成图层的边界。

- 用于理解页面的图层结构
- 优化合成层可以减少绘制开销

**5. Scroll Snap Points（滚动吸附点）**

显示滚动吸附的位置。

- 用于调试滚动吸附行为

#### 渲染优化实践

- 使用 `transform` 和 `opacity` 做动画（只触发合成，不触发布局和绘制）
- 避免频繁触发重排（如读取 `offsetHeight` 后立即修改样式）
- 使用 `will-change` 提示浏览器优化
- 使用 CSS `contain` 限制重绘范围
- 减少 DOM 节点数量

### Coverage 面板：未使用代码检测

Coverage 面板检测页面加载时未使用的 CSS 和 JavaScript 代码。

#### 使用步骤

1. 按 Ctrl+Shift+P（Mac: Cmd+Shift+P）
2. 输入 "Show Coverage"
3. 点击刷新按钮开始录制
4. 页面加载后，操作一下（触发交互）
5. 点击停止按钮
6. 查看未使用的代码比例

#### 结果解读

- **绿色**：已使用的代码
- **红色**：未使用的代码
- 点击某一行，可以在 Sources 面板查看具体代码

#### 优化策略

**JavaScript**：

- 使用代码分割（Code Splitting），按需加载
- Tree Shaking 移除未使用的导出
- 动态导入非首屏组件

**CSS**：

- 提取关键 CSS 内联到 HTML
- 非关键 CSS 异步加载
- 使用 PurgeCSS 移除未使用的样式
- 考虑 CSS-in-JS 按需生成样式

#### 注意事项

- Coverage 只显示页面加载时的使用情况，交互后可能会用到更多代码
- 有些代码是预留的（如不同主题、不同状态），不能简单删除
- 结合 Lighthouse 的 "Unused JavaScript" 和 "Unused CSS" 审计

### Network 面板：网络请求分析

Network 面板分析所有网络请求，找出加载瓶颈。

#### 关键信息

**1. Waterfall（瀑布图）**

显示每个请求的时间线，包括：

- DNS 查询
- TCP 连接
- TLS 协商
- 等待服务器响应（TTFB）
- 下载内容

**2. Priority（优先级）**

浏览器为每个请求分配优先级：

- Highest：关键资源（如首屏 CSS、字体）
- High：重要资源（如首屏图片）
- Medium：普通资源
- Low：低优先级资源（如懒加载图片）
- Lowest：最低优先级

**3. Initiator（发起者）**

显示是谁发起了这个请求：

- Parser：HTML 解析器
- Script：JavaScript 代码
- Redirect：重定向

#### 性能优化点

**减少请求数**：

- 合并小图标为雪碧图（Sprite）
- 使用 Data URL 内联小图片
- 使用 HTTP/2 多路复用（不再需要合并文件）

**减少请求体积**：

- 压缩资源（Gzip/Brotli）
- 优化图片（WebP/AVIF）
- 移除未使用的代码

**优化请求顺序**：

- 关键资源优先加载（使用 `<link rel="preload">`）
- 非关键资源延迟加载（使用 `loading="lazy"`）
- 避免渲染阻塞（CSS 放 head，JS 放 body 底部或使用 `defer`）

**利用缓存**：

- 静态资源使用长期缓存（带 hash 的文件名）
- HTML 使用短缓存或不缓存
- 配置合理的 Cache-Control

#### 实用技巧

- 使用 "Disable cache" 勾选框测试无缓存场景
- 使用 "Throttling" 模拟弱网环境
- 右键请求可以 "Copy as fetch" 生成 fetch 代码
- 使用 "Save all as HAR with content" 导出请求记录

### Lighthouse 面板：自动化审计

Lighthouse 是 Chrome 内置的自动化工具，对页面进行全面审计。

#### 审计类别

- **Performance**：性能评分和建议
- **Accessibility**：可访问性
- **Best Practices**：最佳实践
- **SEO**：搜索引擎优化
- **PWA**：渐进式 Web 应用

#### 使用步骤

1. 打开 Lighthouse 面板
2. 选择要审计的类别（通常全选）
3. 选择设备类型（Mobile 或 Desktop）
4. 点击 "Analyze page load"
5. 等待审计完成，查看报告

#### 性能评分

Lighthouse 性能评分基于以下指标：

- FCP（First Contentful Paint）
- LCP（Largest Contentful Paint）
- TBT（Total Blocking Time，INP 的实验室代理）
- CLS（Cumulative Layout Shift）
- Speed Index
- Time to Interactive

#### 优化建议

Lighthouse 会给出具体的优化建议，按影响排序：

- 消除渲染阻塞资源
- 减少未使用的 JavaScript
- 使用高效的缓存策略
- 优化图片
- 预连接必要的域名
- 减少主线程工作

#### 注意事项

- Lighthouse 分数不是唯一目标，真实用户体验更重要
- 不同设备、网络环境下分数会不同
- 定期运行 Lighthouse，监控性能退化
- 结合其他工具（Performance、Memory）深入分析

## 图片优化

图片通常占页面资源的 50% 以上，是优化的首要目标。

### 选择正确的格式

| 格式 | 适用场景 | 优势 |
| ------ | ---------- | ------ |
| WebP | 通用图片 | 比 JPEG 小 25-35%，支持透明 |
| AVIF | 高质量图片 | 比 WebP 再小 20%，动态范围更好 |
| SVG | 图标、图形 | 矢量无损，可缩放 |
| JPEG | 照片（兼容性优先） | 广泛支持 |
| PNG | 需要透明的简单图片 | 无损压缩 |

### 响应式图片

```html
<!-- 根据屏幕宽度加载不同尺寸 -->
<img src="image-800.jpg" 
     srcset="image-400.jpg 400w,
             image-800.jpg 800w,
             image-1200.jpg 1200w"
     sizes="(max-width: 600px) 400px,
            (max-width: 1000px) 800px,
            1200px"
     alt="示例图片">

<!-- 根据设备像素比加载 -->
<img src="image-1x.jpg"
     srcset="image-1x.jpg 1x,
             image-2x.jpg 2x"
     alt="高清图片">
```

### 懒加载

```html
<!-- 原生懒加载 -->
<img src="image.jpg" loading="lazy" alt="延迟加载">

<!-- 首屏关键图片不要懒加载 -->
<img src="hero.jpg" loading="eager" alt="首屏大图">
```

### 预加载关键图片

```html
<!-- 首屏大图预加载 -->
<link rel="preload" as="image" href="hero.jpg">

<!-- 带媒体查询的预加载 -->
<link rel="preload" as="image" href="hero-mobile.jpg" 
      media="(max-width: 768px)">
```

### 优化实践

- 使用构建工具自动压缩图片（如 `imagemin`）
- 提供多种尺寸，让浏览器选择最合适的
- 首屏图片用 `preload`，其他用 `loading="lazy"`
- 使用 CDN 分发图片，启用浏览器缓存
- 考虑使用 `<picture>` 元素做格式降级

## JavaScript 优化

JS 是主线程阻塞的主要原因，直接影响 INP。

### 代码分割

```javascript
// 路由级别分割
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

// 组件级别分割
const HeavyComponent = lazy(() => import('./components/Heavy'));
```

### 动态导入

```javascript
// 按需加载
button.addEventListener('click', async () => {
  const { openModal } = await import('./modal.js');
  openModal();
});
```

### 减少主线程工作

```javascript
// 使用 Web Worker 处理计算密集型任务
const worker = new Worker('worker.js');
worker.postMessage(data);
worker.onmessage = (result) => {
  // 处理结果
};

// 使用 requestIdleCallback 在空闲时执行低优先级任务
requestIdleCallback(() => {
  // 非关键任务
});

// 使用 scheduler.yield() 让出主线程（实验性）
async function processLargeData(data) {
  for (let i = 0; i < data.length; i++) {
    processData(data[i]);
    if (i % 100 === 0) {
      await scheduler.yield(); // 让出主线程
    }
  }
}
```

### 优化事件处理

```javascript
// 防抖
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// 节流
function throttle(fn, interval) {
  let lastTime = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn(...args);
    }
  };
}

// 使用 passive 事件监听器优化滚动
element.addEventListener('scroll', handler, { passive: true });
```

### 优化实践

- 移除未使用的代码（Tree Shaking）
- 压缩和混淆生产代码
- 使用 `defer` 或 `async` 加载脚本
- 将第三方脚本延迟加载
- 避免长任务（>50ms），拆分为小任务

## CSS 优化

CSS 是渲染阻塞资源，影响 LCP。

### 关键 CSS 内联

```html
<!-- 将首屏关键 CSS 内联到 HTML -->
<style>
  /* 关键样式 */
  .header { ... }
  .hero { ... }
</style>

<!-- 非关键 CSS 异步加载 -->
<link rel="preload" as="style" href="styles.css" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>
```

### 减少 CSS 体积

```css
/* 使用现代 CSS 特性减少代码 */
/* 之前 */
.container {
  margin-left: auto;
  margin-right: auto;
}

/* 之后 */
.container {
  margin-inline: auto;
}

/* 使用 CSS 变量复用值 */
:root {
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}

.card {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}
```

### 避免布局抖动

```css
/* 为图片预留空间 */
.image-container {
  aspect-ratio: 16 / 9;
  background: #f0f0f0;
}

/* 使用 transform 而不是 top/left */
.element {
  transform: translateY(100px); /* 不触发布局 */
  /* 而不是 top: 100px; */
}

/* 使用 will-change 提示浏览器 */
.animated {
  will-change: transform;
}
```

## 网络优化

### 资源提示

```html
<!-- DNS 预解析 -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com">

<!-- 预连接（DNS + TCP + TLS） -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>

<!-- 预加载关键资源 -->
<link rel="preload" as="script" href="critical.js">
<link rel="preload" as="font" href="font.woff2" type="font/woff2" crossorigin>

<!-- 预获取下一页资源 -->
<link rel="prefetch" href="/next-page.js">

<!-- 预渲染整个页面（实验性） -->
<link rel="prerender" href="/about.html">
```

### 缓存策略

```
# HTTP 缓存头示例

# 静态资源（带 hash）- 长期缓存
Cache-Control: public, max-age=31536000, immutable

# HTML 文件 - 不缓存或短缓存
Cache-Control: no-cache, must-revalidate

# API 响应 - 根据业务设置
Cache-Control: private, max-age=60

# 使用 ETag 做条件请求
ETag: "abc123"
```

### HTTP/2 和 HTTP/3

- 启用 HTTP/2 多路复用，减少连接数
- 使用 HTTP/3 (QUIC) 提升弱网性能
- 合并小文件在 HTTP/2 下不再必要，按模块拆分更好

### CDN 优化

- 使用 CDN 分发静态资源
- 启用 Brotli 压缩（比 Gzip 小 15-20%）
- 配置合理的缓存策略
- 使用边缘计算减少回源

## 渲染优化

### 避免强制同步布局

```javascript
// ❌ 错误：读写交替触发强制布局
elements.forEach(el => {
  const height = el.offsetHeight; // 读
  el.style.height = height + 10 + 'px'; // 写
});

// ✅ 正确：批量读取，批量写入
const heights = elements.map(el => el.offsetHeight); // 批量读
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px'; // 批量写
});
```

### 使用 CSS containment

```css
/* 限制元素的影响范围 */
.sidebar {
  contain: layout style paint;
}

/* 严格包含 */
.card {
  contain: strict;
}

/* 内容包含 */
.list-item {
  contain: content;
}
```

### 虚拟列表

对于长列表，使用虚拟滚动只渲染可见区域：

```javascript
// 使用 react-window 或类似库
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={10000}
  itemSize={50}
>
  {Row}
</FixedSizeList>
```

## 服务端优化

### 减少 TTFB

- 使用 CDN 缓存静态资源
- 启用服务器端缓存（Redis、Memcached）
- 优化数据库查询
- 使用 SSR 或 SSG 减少客户端渲染

### 压缩响应

```nginx
# Nginx 配置
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;

# Brotli 压缩
brotli on;
brotli_types text/plain text/css application/json application/javascript;
```

### 服务器推送（HTTP/2）

```nginx
# Nginx 配置
location / {
  http2_push /styles.css;
  http2_push /main.js;
}
```

## 优化工作流

### 第一步：测量基线

1. 使用 Lighthouse 跑分，记录当前指标
2. 在 Performance 面板录制，找出主要瓶颈
3. 查看 PageSpeed Insights 的真实用户数据

### 第二步：设定目标

根据业务需求设定优化目标：

- LCP < 2.5s
- INP < 200ms
- CLS < 0.1
- 首屏时间 < 1.5s

### 第三步：优先级排序

按影响和难度排序：

1. **高影响、低难度**：图片优化、启用缓存
2. **高影响、高难度**：代码分割、服务端渲染
3. **低影响、低难度**：资源提示、压缩
4. **低影响、高难度**：复杂优化

### 第四步：实施优化

- 一次只改一个方面
- 每次改动后测量对比
- 记录优化效果

### 第五步：持续监控

- 部署后监控真实用户数据
- 设置性能预算
- 定期审计

## 常见误区

### 误区 1：只看实验室数据

实验室数据在理想环境下测试，不能反映真实用户体验。必须结合真实用户监控（RUM）。

### 误区 2：过度优化

- 不要为了合并文件而合并（HTTP/2 下不必要）
- 不要过度压缩图片导致质量下降
- 不要为了性能牺牲开发体验

### 误区 3：忽略移动端

- 移动设备 CPU 弱，需要 4-6 倍降速测试
- 弱网环境是常态，要考虑离线场景
- 触摸交互和鼠标交互不同

### 误区 4：只关注加载性能

INP 和 CLS 同样重要。用户不仅关心页面多快加载，还关心交互是否流畅、页面是否稳定。

### 误区 5：忽略第三方脚本

- 分析第三方脚本的影响
- 延迟加载非关键第三方
- 考虑自托管替代 CDN 引用

## 实战案例

### 案例 1：电商首页优化

**问题**：LCP 4.2s，首屏大图加载慢

**优化措施**：

1. 将 hero 图片从 JPEG 转为 WebP，体积减少 35%
2. 添加 `<link rel="preload">` 预加载图片
3. 使用 CDN 分发，启用浏览器缓存
4. 内联关键 CSS，异步加载其余样式

**结果**：LCP 降至 1.8s，提升 57%

### 案例 2：SaaS 应用交互优化

**问题**：INP 450ms，点击按钮响应慢

**优化措施**：

1. 使用 Web Worker 处理数据计算
2. 将长任务拆分为多个小任务
3. 使用 `requestIdleCallback` 延迟非关键任务
4. 优化事件处理函数，减少 DOM 操作

**结果**：INP 降至 120ms，提升 73%

### 案例 3：新闻网站布局稳定

**问题**：CLS 0.35，广告加载导致内容跳动

**优化措施**：

1. 为广告位预留固定高度空间
2. 图片添加 `width` 和 `height` 属性
3. 使用 `aspect-ratio` 为视频预留空间
4. 字体使用 `font-display: optional` 避免重排

**结果**：CLS 降至 0.05，提升 86%

## 工具和资源

### 开发工具

- **Chrome DevTools Performance**：性能分析
- **Lighthouse**：自动化审计
- **WebPageTest**：真实浏览器测试
- **PageSpeed Insights**：真实用户数据

### 构建工具

- **Webpack/Vite**：代码分割和 Tree Shaking
- **imagemin**：图片压缩
- **cssnano**：CSS 压缩
- **terser**：JS 压缩

### 监控工具

- **Google Analytics**：用户行为分析
- **Sentry**：性能和错误监控
- **New Relic**：全栈监控

### 学习资源

- [web.dev](https://web.dev) - Google 官方性能指南
- [Chrome DevTools 文档](https://developer.chrome.com/docs/devtools)
- [Core Web Vitals](https://web.dev/vitals)
- [HTTP Archive](https://httparchive.org) - 真实网站数据

## 总结

网页性能优化是一个持续的过程：

1. **测量先行**：没有数据就没有优化
2. **抓住重点**：图片、JS、CSS 是三大优化方向
3. **关注真实体验**：实验室数据只是参考
4. **持续监控**：性能会随代码变化而退化
5. **平衡取舍**：不要为了性能牺牲其他重要指标

记住，性能优化不是一次性任务，而是开发流程的一部分。将性能预算纳入 CI/CD，每次提交都检查，才能保持长期健康。
