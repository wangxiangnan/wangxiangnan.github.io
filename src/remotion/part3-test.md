# Part 3 自测

本卷覆盖 Part 3 的四章：时序组件与异步纪律、媒体深水区、字幕与语音生态、转场全谱。玩法：闭卷——合上书从第 1 题做到最后，全部做完再逐题打开 `<details>` 对答案；每题答案带一句推导与回指小节，答错的按回指重读该章「本章小结」的要点，隔 1 天重做错题。

---

## 题目

**T1**：`<Series>` 与 `<TransitionSeries>` 到底是什么关系？贯穿示例里两者对应的场景时长各是多少？

<details>
<summary>答案</summary>

`TransitionSeries ≈ Series + 强制声明转场`。贯穿示例的场景时长：TransitionSeries 版是 172/121/20（每个 duration 里预加了 15 帧转场），Series 版是名义差值 157/106/20（两者相加都是 283 帧）。

推导：Series 的子项自动首尾相接，TransitionSeries 把相邻两段重叠起来并插入转场；选型看场景边界是不是来自数据——踩点用前者，固定结构用后者。回指：5.1。
</details>

**T2**：`<Series.Sequence>` 内部的 `useCurrentFrame()` 返回第几帧？`<Freeze frame={157}>` 呢？

<details>
<summary>答案</summary>

`<Series.Sequence>` 内部从 **0** 重新计数（段内入场动画照常从 0 开始弹）；`<Freeze frame={157}>` 则无论套了多少层 Sequence，内部所有 `useCurrentFrame()` 都永远返回 **157**。

推导：Sequence 把子树平移到时间轴某处，局部帧号从 0 起；Freeze 把这口钟直接焊死，所以它也是封面图 `renderStill` 的实现基础。回指：5.1、5.3。
</details>

**T3**：`<Loop>` 与手写取模循环，什么时候用哪个？子组件怎么知道自己正处在第几轮？

<details>
<summary>答案</summary>

循环单位是「一整段动画」用 `<Loop>`（取模消失在组件边界里），只是给单个元素错相位仍用手写取模（offset 项天然错开 120 片雪花的起点）。子组件用 `Loop.useLoop()` 拿当前轮次 `iteration`（从 0 起）。

推导：`<Loop>` 的价值是把「重复」这件事交给官方、按 `durationInFrames` 切段，而不是在业务代码里写 `%`。回指：5.2、2.4。
</details>

**T4**：`delayRender` 的四条纪律是什么？它和 `calculateMetadata`、`preload` 该怎么选？

<details>
<summary>答案</summary>

四条纪律：句柄用 `useState(() => delayRender())` 惰性初始化；必须写在组件内不能写在模块顶层；默认 30 秒超时（报错里的 label 用来定位是哪个异步任务）；失败用 `cancelRender(err)` 让渲染带着错误退出。选型：**数据只影响「多长」→ `calculateMetadata`（每条组合只执行一次）；数据影响「每一帧长什么样」→ `delayRender`；数据是文件 → `preload`/`prefetch`**。

推导：`calculateMetadata` 跑一次就够，用 delayRender 跑它等于每个并发标签页各来一遍；反之逐帧相关的数据又不能在渲染前算。回指：5.5。
</details>

**T5**：BGM 的音量曲线怎么算？为什么「旁白一开口 BGM 就让位」这件事可以用时间戳驱动？

<details>
<summary>答案</summary>

音量曲线 = `useCurrentFrame()` + `interpolate` 算出数值传给 `volume`（回调形式已不推荐）。ducking 的触发信号不是「时间到了」而是**旁白的时间戳**——`sentences` 区间就是现成的触发器，区间内把 BGM 从 0.15 压到 0.04，边界留 0.2 秒斜坡避免「咔」一声。

推导：贯穿示例的一切都从时间戳派生，音量也不例外——旁白区间是数据，不是猜测。回指：6.1。
</details>

**T6**：`<Html5Video>` 与 `<OffthreadVideo>` 的关键差别是什么？素材要和时间戳对齐该选哪个？还有一个前提是什么？

<details>
<summary>答案</summary>

渲染出帧机制不同：前者靠浏览器 `<video>` seek 后截图，受关键帧间距限制、可能偏 1~2 帧；后者由 ffmpeg 在浏览器外按帧号抽帧、逐帧精确。要和时间戳对齐就用 `<OffthreadVideo>`。前提是**素材 fps 与成片一致**——25fps 的素材配 30fps 的成片，「第 157 帧」在两边不是同一时刻。

推导：抽帧方式决定了对齐精度，而 fps 是「第几帧」这个说法的前提；两者任一不对齐都会整体错位。回指：6.2。
</details>

**T7**：`visualizeAudio` 的 `numberOfSamples` 为什么必须是 2 的幂？低频偏重怎么办？

<details>
<summary>答案</summary>

必须填 2 的幂（16/32/64/128），传 100 直接报错。低频偏重是因为能量集中在低频，画柱子前做对数后处理压平，例如转成分贝再归一化：`Math.max(0, (20 * Math.log10(Math.max(v, 1e-6)) + 60) / 60)`。

推导：频段划分按对数频率走，段数只能取 2 的幂；线性振幅直接画会左边高右边矮，分贝映射把安静段抬到贴近 0、响的段顶到 1。回指：6.3。
</details>

**T8**：官方 `Caption` 结构的时间单位是什么？和贯穿示例自研的 `Word` 结构怎么互转？中文分页为什么常要自己写？

<details>
<summary>答案</summary>

官方用**毫秒**（`startMs`/`endMs`，语音识别的原始精度就在毫秒级），贯穿示例用秒。换算只发生在一个地方（适配函数）：秒 → 毫秒是 `Math.round(w.start * 1000)`，毫秒 → 秒是 `c.startMs / 1000`。中文分页要自己写，是因为官方的 `createTikTokStyleCaptions` **靠空格分词**，中文没有空格，整句会被当成一个词挤在一页。

推导：官方生态擅长英文形态，中文场景自研结构仍是务实选择——切页依据从「空格」换成「标点 + 时长上限」即可，产出结构与官方 `pages` 一致。回指：7.1、7.3。
</details>

**T9**：Whisper 反推时间戳为什么选 `medium` 而不是 `medium.en`？不开 `tokenLevelTimestamps` 会怎样？

<details>
<summary>答案</summary>

`.en` 后缀是**英文专用模型**，喂中文旁白会得到一串乱码；中文必须用不带后缀的多语言模型（`medium` 是起步档，`large-v3` 更准更慢）。不开 `tokenLevelTimestamps` 只有句级时间戳，词级高亮无从谈起。

推导：模型的训练语料决定了它能听懂什么；词级时间戳是「卡拉OK字幕」这个功能的前提开关，与 3.2 的 Edge-TTS 一次返回词级时间是同一件事。回指：7.2。
</details>

**T10**：转场 = presentation × timing，两者是独立的吗？官方内置的 presentation 有多少个？

<details>
<summary>答案</summary>

完全独立：presentation 决定画面怎么混（21 个内置），timing 决定混多少帧（`linearTiming` / `springTiming` 两种官方调度），任意配对。所有组合共享同一套时长语义，3.5 的踩点公式不用改一行。

推导：把「画面效果」与「时间调度」拆成两个维度后，转场就从「几十种配方」变成「两个旋钮」；公式只关心重叠了多少帧，与效果无关。回指：8.1、8.2。
</details>

**T11**：`springTiming({ config: { damping: 200 } })` 的时长是多少？为什么「调大 damping」能让它变短？

<details>
<summary>答案</summary>

**23 帧**（damping 200 @ 30fps，弹簧走到静止所需帧数）。damping 是阻尼：调大 → 更快停住、更少回弹 → 时长变短；调小 → 弹得更久。这个实测值必须用 `getDurationInFrames({ fps: 30 })` 查出来并喂回场景划分，不能手写常数。

推导：springTiming 的时长由物理模型涌现、随 fps 变化，只能查不能猜；单一来源原则在这里就是「帧数只能来自那一次查询」。回指：8.2。
</details>

**T12**：自定义 presentation 的组件会为进场和退场各渲染一次，两边的 `presentationProgress` 是同一个值吗？怎么判断自己是哪一侧？

<details>
<summary>答案</summary>

**是同一个值**——转场进行到进度 p 时两侧都渲染，两边的 `presentationProgress` 都是 p，由你自己决定怎么用。判断哪一侧看 `presentationDirection`：`"entering"` 或 `"exiting"`。约定俗成的套路是 **entering 侧包效果、exiting 侧原样放 children**。

推导：组件被渲染两次、进度相同，所以「两侧表现不同」这件事必须由 `presentationDirection` 显式区分——这正是遮罩类效果只在进场侧生效的写法。回指：8.3。
</details>

**T13**：`@remotion/preload` 的 `preloadAudio()` 能给贯穿示例的 `<Audio>` 提速吗？两个预加载 API 各管谁？

<details>
<summary>答案</summary>

不能——`preloadAudio()` 只对**原生 HTML5 标签**（`<audio>`、`<Html5Audio>`）生效，对 Remotion 自己的 `<Audio>` 无效；后者要用 `prefetch()`（完整下载成 Blob URL，`waitUntilDone()` 可等就绪，用完记得 `free()`）。官方首推的其实是 **premounting**。

推导：选型先看资源被谁消费——原生标签/字体/图片走 `preload*()`，Remotion 媒体组件走 `prefetch()`，都不理想就回到 premounting。回指：5.6。
</details>

**T14**：`<Gif>` 解决了什么问题？`<img src="x.gif">` 为什么是错法？

<details>
<summary>答案</summary>

GIF 自带播放时钟、与帧号脱节：每次冷启动截图都从 GIF 的第 0 帧开始，成片里它永远播前几帧。`<Gif>` 把它的时钟换成 `useCurrentFrame()`，于是 GIF 画面与整片时间轴对齐。

推导：任何自带时钟的资产都要先「拔掉它的钟」，这就是 2.5 判别标准的实体版本。回指：6.4。
</details>

---

## 下一站

Part 3 的四章补齐了官方工具箱，你的画面已经能到「专业片」的水准。接下来是规模与工程——Part 4 接管四件事：图形资产与 3D、批量出片与云端渲染、交互与可视化编辑、长期维护的仓库。从[第九章 图形扩展包](./ch09.md) 开始。

---
