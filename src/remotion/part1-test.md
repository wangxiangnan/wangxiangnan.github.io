# Part 1 自测

本卷覆盖 Part 1 的两章：帧时间轴（画面为什么是帧的纯函数）、动画工具箱（interpolate、spring、random、noise2D 四种映射）。玩法：闭卷——合上书从第 1 题做到最后，全部做完再逐题打开 `<details>` 对答案；每题答案带一句推导与回指小节，答错的按回指重读该章「本章小结」的要点，隔 1 天重做错题。

---

## 题目

**T1**：30fps 的视频里，`useCurrentFrame()` 在第 1 秒那一刻返回多少？为什么不是 1？

<details>
<summary>答案</summary>

返回 **30**。帧号从 0 数起，第 0 帧到第 29 帧是第 1 秒，第 30 帧已经是第 2 秒的第一帧。

推导：帧号是「第几帧」而不是「第几秒」，换算要除以 fps——`frame = 秒 × fps`，30fps 下 1 秒对应第 30 帧。回指：1.3。
</details>

**T2**：`interpolate(frame, [0, 100], [0, 200])` 在 `frame = 150` 时返回多少？想让它在 100 之后停在 200，该怎么写？

<details>
<summary>答案</summary>

返回 **300**——默认 `extrapolateRight` 是 extend，超出输入区间后按斜率继续外推。停在 200 要显式收口：`interpolate(frame, [0, 100], [0, 200], { extrapolateRight: "clamp" })`。

推导：查表器的区间外行为由 extrapolate 决定，extend 是「延长直线」、clamp 是「停在端点」；元素飞出画面几乎都是漏了 clamp。回指：2.1。
</details>

**T3**：一个组件里同时出现了 `Math.random()`、`Date.now()`、`setTimeout`，各自会在渲染时出什么问题？对应的替代是什么？

<details>
<summary>答案</summary>

- `Math.random()`：每次渲染结果不同 → 雪花之类的东西每帧乱跳 → 换 `random(seed)`（第二章）；
- `Date.now()`：结果随渲染时刻变化 → 画面随日期漂移、无法复现 → 换 `frame / fps`；
- `setTimeout`：截图机不等待定时器 → 定时器驱动的动画脱帧、截到的是没执行完的中间态 → 全部逻辑由 `frame` 驱动。

推导：渲染是逐帧冷启动页面，任何「跨帧的状态」都会在 283 次冷启动之间丢失或漂移，只有纯函数能稳住。回指：1.4。
</details>

**T4**：spring 的 progress 可能超过 1 吗？把它的过冲收住有哪两种办法？

<details>
<summary>答案</summary>

可能——弹簧会冲过目标值再回弹，所以 progress 会 >1，直接乘透明度会算出 >100% 的无效值。两种收口：开 `config: { overshootClamping: true }`（越过目标就封顶在目标值），或在外面用 `interpolate(progress, [0, 1], [0, 1], { extrapolateRight: "clamp" })` 裁一刀。

推导：spring 的时长默认由物理参数涌现（damping 越小弹得越久），要精确占位还可以加 `durationInFrames`（3.0.27 起）把曲线拉成固定帧数。回指：2.2。
</details>

**T5**：`useVideoConfig()` 返回哪四样？为什么不能把 fps 直接写死成 30？

<details>
<summary>答案</summary>

返回 `fps`、`width`、`height`、`durationInFrames` 四样。不能写死 fps：改一次 60fps，所有按写死的 30 换算的逻辑就会慢一倍——画面不报错，只是节奏全错，等成片才发现就晚了。

推导：fps 是「秒与帧的汇率」，代码里出现常数就等于把汇率钉死；配置会变，常数不会跟着变。回指：1.3。
</details>

**T6**：`random("base", i)` 这个写法有什么问题？正确写法是什么？

<details>
<summary>答案</summary>

`random()` **只收一个种子参数**（number 或 string），多传的 `i` 会被静默忽略——于是第 0 片到第 119 片雪花拿到**同一个**值、全部叠在一起，而且不报任何错。正确写法是自己把序号拼进种子字符串：`random(`base-${i}`)`。

推导：批量取值的正确姿势是拼串而不是多传参；官方示例同样是 `random(`random-x-${i}`)` 这种拼串写法。回指：2.3。
</details>

**T7**：贯穿示例是 283 帧。最后一帧的帧号是多少？区间 `[263, 283)` 里一共多少帧？

<details>
<summary>答案</summary>

最后一帧的帧号是 **282**——帧号从 0 数起，第 283 帧不存在。`[263, 283)` 是左闭右开，含 263 到 282 共 **20 帧**。

推导：区间记号统一「左闭右开、末帧 = 总帧数 − 1」，这样总帧数 283 与「最后一帧 282」不会打架——这是全书所有场景区间公式的地基。回指：1.1。
</details>

**T8**：雪花的最终位置由哪两个分量合成？各自的公式是什么？各自由谁提供数据？

<details>
<summary>答案</summary>

两个分量：纵向匀速下落 `y = (t × speed + offset) % (height + 60)`，横向噪声摆动 `x = baseX + noise2D("sway", t × 0.5, i) × swayAmp`。speed、offset、baseX、swayAmp 全部来自种子化随机 `random(seed)`，因此每片雪花天生不同、且逐帧可复现。

推导：下落管节奏、摆动管形态、随机种子管个性——三者都是 `t` 的纯函数，所以第 100 帧拖走再拖回画面逐像素一致。回指：2.4。
</details>

**T9**：`Composition` 上的 `durationInFrames` 与 `calculateMetadata` 是什么关系？出片时长对不上时先查什么？

<details>
<summary>答案</summary>

`durationInFrames` 是**兜底值**，`calculateMetadata` 是**真实值**——渲染时以 calculateMetadata 的返回为准（它按 props 算，比如「音频 8.81 秒 + 尾帧 0.6 秒 → 283 帧」）。出片时长对不上，第一反应就是查 calculateMetadata 有没有生效、props 字段名对不对，而不是重渲染碰运气。

推导：defaultProps 是 Studio 打开时的兜底、真实数据靠 `--props` 注入；两者不一致时就会出现「Studio 里好好的、出片是空的」。回指：1.2、4.2。
</details>

**T10**：`interpolate` 的 `easing` 参数改了什么、没改什么？

<details>
<summary>答案</summary>

改的是「帧号到进度的映射」——区间内的推进快慢（`Easing.out` 先快后慢、`Easing.inOut` 两头慢）；**没有**改的是转场占多少帧：15 帧仍是 15 帧，踩点公式一个字都不用动。

推导：easing 是曲线形状不是时间轴长度；要改「占多长」得改输入区间本身（4.2 的踩点公式就靠这个）。回指：2.1。
</details>

**T11**：渲染一条 283 帧（9.4 秒）的视频，为什么不需要 9.4 秒？默认并发是多少？并发该怎么调？

<details>
<summary>答案</summary>

因为渲染是**并行逐帧截图**而不是实时播放：每个标签页负责一段帧号（标签页 A 截 0~70、标签页 B 截 71~140……），默认并发是 CPU 线程数的一半（上限 8）。调法：CPU 没满就是并发太低，调高 `--concurrency`；CPU 满但仍慢，是某一帧太重，查 `slowestFrames`。

推导：每帧都是「打开页面 → 设定 frame → 截一张图」，283 帧是 283 次冷启动，并行摊开后就比实时快得多。回指：1.5、10.3。
</details>

**T12**：第三方动画库能不能直接用？判别标准是哪一条？

<details>
<summary>答案</summary>

判别标准只有一条：**这个库是替你「计算数值」，还是自己「驱动时间」**。GSAP 的 `Easing` 函数、d3-interpolate 可以直接用（纯计算）；GSAP 的 timeline、anime.js 的 `play()` 不行（自带时钟，与逐帧截图机制冲突）。自带时钟的库如果**能 seek**，就把时间参数换成 `frame / fps` 改造后再用。

推导：能 seek 的库都能救——把播放头拨到指定时刻再取状态；只能 play 的救不了，除非它暴露 seek。回指：2.5。
</details>

**T13**：spring 的三个物理参数 `damping` / `mass` / `stiffness` 各管什么？「回弹太夸张」该调哪个？

<details>
<summary>答案</summary>

`damping`（阻尼）调大 → 更快停住、几乎不回弹，调小 → 弹得更久；`mass`（质量）调大 → 起动迟缓、有重量感，调小 → 更轻更快；`stiffness`（劲度）调大 → 更硬更快、回弹更急。「回弹太夸张」→ **调大 damping**（贯穿示例的标题卡就用 `damping: 200`，因为卡片要落位利落，回弹会让人读不全字）。

推导：三个参数分别对应「停得多快」「起步多重」「弹簧多硬」，过冲来自阻尼不足。回指：2.2。
</details>

**T14**：渲染时音频轨是怎么进成片的？截图阶段截到的是什么？

<details>
<summary>答案</summary>

截图阶段只有画面——`<Audio>` 组件不参与截图，它负责在最终封装时把音频轨混进去。所以 283 张截图 + 一条音频轨 = 成片，这也是为什么「音频不是截图截来的」。

推导：每个标签页每帧都重新加载页面、重新执行组件，音频若靠组件实时播放就必然与截图不同步；把它留到封装阶段混流，才谈得上音画对齐。回指：1.5、3.3。
</details>

---

## 下一站

Part 1 的两章能闭卷说清了，就从「机制」走向「成品」——Part 2 接管一条真片：把一段中文旁白做成配音、字幕、转场全自动同步的短视频，再交到三个出口。从[第三章 音画同步](./ch03.md) 开始。

---
