# Part 4 自测

本卷覆盖 Part 4 的四章：图形扩展包、规模化渲染、交互与可视化编辑、工程化纵深。玩法：闭卷——合上书从第 1 题做到最后，全部做完再逐题打开 `<details>` 对答案；每题答案带一句推导与回指小节，答错的按回指重读该章「本章小结」的要点，隔 1 天重做错题。

---

## 题目

**T1**：六个图形扩展包做的事有什么共同点？为什么说「拔掉外部资产自带的那口钟」？

<details>
<summary>答案</summary>

共同点是**把外部的时间源换成 frame**，其余内容原样使用：`<Lottie>` 与 `<RemotionRiveCanvas>` 把外部时钟换成按帧号 seek，`<Gif>` 同理，`@remotion/three` 把 R3F 的 `useFrame` 换成 frame 表达式。

推导：自带动钟的资产在不同渲染批次里推进不同步，与「同一帧同一画面」直接冲突；换掉时钟就恢复了确定性。回指：9.1、9.3、9.4、9.5。
</details>

**T2**：`evolvePath(1.2, path)` 会发生什么？该怎么处理？

<details>
<summary>答案</summary>

不会「从头回退」：按 `strokeDashoffset = 总长 × (1 − progress)`，progress 超过 1 时虚线整体前移、实画段从**终点**往回缩（画出 2 − 1.2 = 80%）；progress 小于 0 时虚线被推出路径之外，结果是**整条不画**。所以描边动画总要 clamp 收口。

推导：描边是用 dasharray/dashoffset 模拟「笔尖走过多远」，progress 越界就是笔尖走过头或没起步。回指：9.1。
</details>

**T3**：Lottie 的 `animationData` 为什么有时会「动画重新初始化」？怎么防？

<details>
<summary>答案</summary>

因为 `animationData` 的**对象身份**变化会触发动画重新初始化。静态 import 天然稳定；从 props 传入时要用 `useMemo` 把引用钉住——这里 useMemo 管的是身份稳定，不是性能。

推导：React 组件每次渲染拿到新对象就等于「换了一份数据」，动画组件会当成新动画重放。回指：9.3。
</details>

**T4**：Node API 的三步是哪三步？批量出片时 `bundle()` 应该执行几次？

<details>
<summary>答案</summary>

`bundle()` → `selectComposition()` → `renderMedia()`。`bundle()` 只执行**一次**——打包产物与 props 无关，同一份代码服务所有数据；而 `selectComposition()` 必须在循环内逐条执行，因为不同 props 算出不同的总帧数。

推导：把「与数据无关的事」和「随数据变的事」分开，是批量脚本的第一条分水岭。回指：10.1、10.2。
</details>

**T5**：批量脚本怎么做到「失败不毁掉整批」并且能重跑？

<details>
<summary>答案</summary>

两条：①每条数据包在 `try/catch` 里，失败只记进 `failed` 数组不中断整批，最后统一汇报；②**幂等**——输出文件已存在就跳过（`existsSync(out)`），于是重跑时只补做没成功的那些。时间戳 JSON 也当正式产物存下来，重跑不必再调 TTS。

推导：一条失败不该毁掉整批；产物即状态，重跑才不会重复付费与重复合成。回指：10.2。
</details>

**T6**：`slowestFrames` 拿到手之后怎么用？单帧复测能区分出哪两种「慢」？

<details>
<summary>答案</summary>

用 `renderMedia({ frameRange: [frame, frame] })` 逐个单独渲染慢帧并计时。单独渲染仍慢 → 瓶颈在那一帧的内容（重资源元素、滤镜、OffthreadVideo 的抽帧）；单独渲染很快但全片慢 → 瓶颈在并发调度或编码阶段。

推导：这两种慢的修法完全不同——前者改画面，后者改参数。回指：10.3。
</details>

**T7**：什么时候该上 Lambda？它的三条硬边界是什么？

<details>
<summary>答案</summary>

一次性或低频 → 本地；量大且急（几百条、要分钟级出）→ Lambda；介于之间先把本地 concurrency 调满、复用 bundle 抽帧再考虑上云。硬边界：单函数 **15 分钟**超时（磁盘上限折算约 32 分钟 1080p）、每区域默认 1000 个并行函数可申请提升、渲染期按量计费（多分钟视频通常几美分）。

推导：上云不是「更快」而是「换一台机器」，代价是 AWS 账号、凭证、region、bucket 四样运维。回指：10.4。
</details>

**T8**：Player 的三个「带帧号」的事件各是什么区别？该用哪个？

<details>
<summary>答案</summary>

`frameupdate` 播放与 seek 都**逐帧**触发（全量）；`timeupdate` 是播放中的周期更新、节流到约 250ms 一次、会跳过帧；`seeked` 只在用户拖进度条或 `seekTo()` 时发。要「每一帧都知道」就用 `frameupdate`。

推导：三者只是同一帧号的三种送达方式，需求决定选谁——要精确联动就要全量，要省渲染就选节流。回指：11.1。
</details>

**T9**：`useCurrentFrame()` 能不能写在渲染 `<Player>` 的网页组件里？官方配方是什么？

<details>
<summary>答案</summary>

不能——它在组合外不工作（读的是最近一层 Sequence 的局部帧，而网页组件不在任何组合里）。官方配方是用 `useSyncExternalStore` 订阅 `frameupdate`：`subscribe` 负责注册回调并返回取消订阅函数，`getSnapshot` 读当前帧号，`getServerSnapshot` 固定返回 0。

推导：`useSyncExternalStore` 让 React 自己决定何时重渲染，且**只有真正读了这个值的组件**会重渲染——这正是「时间敏感 UI 要拆到 Player 相邻组件」的机制。回指：11.2。
</details>

**T10**：`<Interactive.Div>` 的渲染产物和普通 div 有区别吗？它的价值在哪？写回源码的模式带来哪三条最佳实践？

<details>
<summary>答案</summary>

渲染产物**没有区别**，就是一个普通 div；价值全在 Studio 里——可选中、可拖拽、右侧面板可改属性、可打关键帧，修改**直接写回组件源码**。三条最佳实践：可编辑的值保持内联；关键帧用硬编码的 `interpolate()` 数组；动画一律走 `translate / scale / rotate / opacity`。

推导：写回是「往源码某个确定位置插一段代码」，抽成变量或拼字符串的 transform 就没有落脚锚点，机器改不了。回指：11.3。
</details>

**T11**：两套 schema 各管什么？Player 上的 schema 做不做运行时校验？

<details>
<summary>答案</summary>

zod schema 挂在 `<Composition schema>` 上，管 **props 的类型 + Studio 属性面板表单**；InteractivitySchema 挂在 `Interactive.create(组件, { schema })` 上，管 **Studio 时间轴控件与关键帧**，它不是 zod 而是轻量对象字面量。Player 上的 schema **只用于类型推断，不做运行时校验**——校验与表单是 Studio 的职责。

推导：改「输入数据」用 zod，改「画面元素与动画」用 InteractivitySchema，两者是不同的编辑面。回指：11.4。
</details>

**T12**：多组合项目组织的三条规则是什么？为什么要「helpers 横切所有组合」？

<details>
<summary>答案</summary>

三条：①**组合 = 组件 + 规格**（各自声明 id、defaultProps、calculateMetadata 与 schema）；②**helpers 横切所有组合**（`getDurationInFrames` 只写一份，Winter 与 Summer 都 import）；③**shared 组件不感知组合**（雪花不关心自己在哪条片里，靠 props 拿参数）。横切的理由：哪条组合偷偷复制了一版取整逻辑，4.5 排错表里「进度条与成片时长对不上」就会复活。

推导：差异收敛到入口组件一层，公共逻辑只留一份——这是「单一来源」在仓库结构上的形态。回指：12.1。
</details>

**T13**：CI 渲染为什么要 `browser ensure` 加缓存？缓存 key 跟什么走？

<details>
<summary>答案</summary>

CI 每次都是全新机器，不预热就要重下约 100 MB 的 Chrome Headless Shell。`npx remotion browser ensure` 幂等地预下载，配合 `actions/cache` 缓存 Remotion 的浏览器目录。缓存 key 跟 **`package-lock.json`** 走——锁文件变了就是一份新缓存，浏览器版本随之更新。

推导：key 绑锁文件才能保证「代码与浏览器版本」同时更新；升级 Remotion 后不同步缓存 key，就会出现「本地好的、CI 坏的」。回指：12.2。
</details>

**T14**：三层测试分别测什么？为什么没有第四层「画面快照比对」？

<details>
<summary>答案</summary>

三层：①**纯函数单测**（帧数、场景区间、时间戳清洗，最便宜最值得）；②**确定性自检**（禁用 API 零命中，grep 或 lint 即可）；③**单帧冒烟渲染**（渲染最贵的一帧，确认管线还活着）。没有第四层，是因为画面是 283 张图，golden 文件体积巨大、字体与浏览器版本一变就全红——机器守纪律，人守观感。

推导：把「画面本身」的回归交给 4.1 的「三查」人工逐帧检查，机器只做它擅长的断言。回指：12.3。
</details>

**T15**：`npx remotion versions` 查什么？升级为什么不能随手跑 `npm update`？

<details>
<summary>答案</summary>

`versions` 逐包报告 `remotion` 与 `@remotion/*` 生态包的版本差，并检查 `zod`、`mediabunny` 等附属包是否用了推荐版本（全对时输出 `All packages have the correct version.`）。不能随手升级，是因为 Remotion 的 changelog 节奏很快，patch 版也可能改变渲染行为；官方明确不建议用 `npm update` 代替——它会把项目里所有依赖一起升级。

推导：升级的正确姿势是七步：锁版本 → 读 changelog → `remotion upgrade` → 跑单测 → 跑冒烟 → 同步 CI 缓存 key → 提交。回指：12.4。
</details>

**T16**：License 合规三问是什么？云端渲染有什么额外要求？

<details>
<summary>答案</summary>

三问：团队多大（个人与 ≤3 人公司免费，更大团队需商业授权）、在哪渲染（本地与 CI 走免费/商业授权即可；云端渲染需要商业授权的团队须以 **Automators 授权**覆盖）、`licenseKey` 配了吗（4.0.409 起 `renderMedia`/`renderStill`/Lambda 都支持，符合免费条款的传 `"free-license"`，密钥走环境变量与 secrets，不进仓库）。

推导：授权是选型时就算进总账的成本，不是上线前才发现的问题。回指：12.4。
</details>

---

## 下一站

Part 4 的四章走完，你已经有了一条能长期维护的仓库路线：**批量出片**靠第十章的 Node API，**交互与可视化编辑**靠第十一章，**CI 与合规**靠第十二章。接下来是全书毕业测试——跨 Part 的综合操作题，用来确认这十二章在你手里是一套东西，而不是十二块零件。从[全书毕业测试](./final-test.md) 开始。

---
