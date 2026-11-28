# Part 2 自测

本卷覆盖 Part 2 的七章：进程管理、软件包管理、磁盘与存储、用户与组管理、Systemd 与服务、计划任务、日志与监控。玩法：闭卷——合上书从第 1 题做到最后，全部做完再逐题打开 `<details>` 对答案；每题答案带一句推导与回指小节，答错的按回指重读该章「本章小结」的要点，隔 1 天重做错题。

---

## 题目

**T1**：预测输出：实战里用 `sudo kill -9 $(systemctl show -p MainPID myapp --value)` 杀掉主进程，`sleep 6` 后执行 `systemctl is-active myapp`，输出什么？为什么？这体现了 unit 文件里哪条配置？

<details>
<summary>答案</summary>

输出 active；Restart=on-failure + RestartSec=5 自愈。

推导：异常被杀属 failure，systemd 等 5 秒重启，6 秒后已恢复——托管在 systemd 手里，kill -9 也拦不住重新拉起。回指：11.8（配置定义见 11.4）。
</details>

**T2**：`dpkg -S` 和 `dpkg -L` 的方向正好相反，分别是什么？写出「查 /etc/nginx/nginx.conf 属于哪个包」的命令。

<details>
<summary>答案</summary>

-L 包→文件清单；-S 文件→包名；`dpkg -S /etc/nginx/nginx.conf`。

推导：「这包装了什么」用 -L，「这文件归谁管」用 -S，方向相反场景互补。回指：8.3。
</details>

**T3**：三种状况：有人疑似在暴力破解 SSH、nginx 服务起不来、U 盘插上没反应。分别先查哪里？

<details>
<summary>答案</summary>

SSH 爆破查 auth.log + lastb；服务起不来查 journalctl -u nginx -p err；硬件没反应查 dmesg -T。

推导：登录异常在认证日志、服务异常在 unit 日志、硬件异常在内核消息——先按来源选对入口。回指：13.1–13.4。
</details>

**T4**：把新盘上架的步骤排序：写入 fstab、mkfs.ext4 格式化、lsblk 确认新盘、mount 挂载、parted 分区。

<details>
<summary>答案</summary>

lsblk → parted → mkfs.ext4 → mount → fstab（mount -a 验证）。

推导：先认盘再分区，格式化后才能挂进目录树，最后写 fstab 持久化——正是 9.10 实战那条链路。回指：9.10（贯穿 9.1–9.8）。
</details>

**T5**：SIGTERM 和 SIGKILL 的编号各是多少？哪个能被进程捕获？为什么终止进程要先 kill 再 kill -9？

<details>
<summary>答案</summary>

SIGTERM=15 可捕获；SIGKILL=9 不可捕获；先礼后兵给清理机会。

推导：kill 默认发 TERM，进程可清理后优雅退出；等几秒仍在才 kill -9，内核直接回收无法挽留，9 是最后手段。回指：7.5。
</details>

**T6**：对比 cron 和 systemd timer：错过执行、日志、精度三方面各有什么差别？生产环境为什么倾向 timer？

<details>
<summary>答案</summary>

错过：跳过（anacron 补）vs Persistent=true 补；日志：无 vs journalctl 全记；精度：分钟 vs 秒。

推导：timer 另有依赖管理与 cgroup 限制，可靠性整体更高，生产倾向 timer。回指：12.7。
</details>

**T7**：`su - alice` 里的 `-` 起什么作用？`sudo -u alice ls -la /home/alice` 与 `sudo -i` 各做什么？

<details>
<summary>答案</summary>

`-` 以登录 Shell 切换并加载对方环境；sudo -u 单条授权；sudo -i 拿 root 登录 Shell。

推导：带 `-` 才按登录顺序加载目标用户环境；sudo 是单条授权、su 是整段会话，按需选。回指：10.7、10.8。
</details>

**T8**：unit 文件里 After、Wants、WantedBy 三条指令各起什么作用？哪条决定「顺带拉起」，哪条由 enable 建立？

<details>
<summary>答案</summary>

After 只定先后；Wants 顺带拉起；WantedBy 由 enable 建立挂入。

推导：After=network.target 只保证顺序不拉起；Wants 才顺带启动 mysql；enable 依 WantedBy 挂入 multi-user.target 实现开机自启。回指：11.4。
</details>

**T9**：预测：df -h 显示某分区 Use% 只有 50%，创建新文件却报 "No space left on device"。可能是什么原因？用哪条命令验证？

<details>
<summary>答案</summary>

inode 耗尽；`df -i`。

推导：每文件至少占一个 inode，海量小文件可先耗光 inode——空间有余也建不了文件，IUse%=100% 即证实。回指：9.3。
</details>

**T10**：为什么退出终端时后台进程也会跟着死？写出用 nohup 后台运行 backup.py、把标准输出和错误都写进 backup.log 的命令。disown 和 nohup 的分工是什么？

<details>
<summary>答案</summary>

终端退出发 SIGHUP；`nohup python3 backup.py > backup.log 2>&1 &`；nohup 启动前挡、disown 事后补救。

推导：nohup 令进程忽略 SIGHUP，适合启动前已知要长跑；disown 把已在跑的后台作业移出作业表，忘了加 nohup 时补救。回指：7.7（承接 7.6）。
</details>

**T11**：预测判读：`vmstat 1 10` 的 si/so 持续不为 0、`iostat -xz 1` 里某块盘 %util 接近 100% 且 await 很高、vmstat 的 wa 列很高，各说明什么？

<details>
<summary>答案</summary>

si/so≠0 内存不足换页；%util≈100%+await 高磁盘瓶颈；wa 高 CPU 等磁盘 I/O。

推导：三个读数分别指向内存、磁盘、CPU-等存储三条路径，配合判读即可定位瓶颈类型。回指：13.9。
</details>

**T12**：源码编译安装的主要步骤是什么？`./configure --prefix=/usr/local` 指定了什么？`make -j$(nproc)` 里的 `$(nproc)` 起什么作用？

<details>
<summary>答案</summary>

configure→make→make install→ldconfig；--prefix 定安装位置；$(nproc) 取核心数并行加速。

推导：configure 生成 Makefile、make 并行编译、install 落盘后刷动态库缓存——仓库没有时的最后手段。回指：8.8。
</details>

**T13**：实战中共享目录执行 chmod 2775 /opt/projects，开头的 2 是什么？它解决了团队协作的什么问题？

<details>
<summary>答案</summary>

2=setgid，新文件继承目录的组；解决成员主组不一致协作卡住。

推导：配 chown root:developers 后新文件都归 developers 组，组内可读写——5.9 特殊权限位在共享目录的应用。回指：10.9（原理见 5.9）。
</details>

**T14**：`>> /var/log/backup.log 2>&1` 里 `2>&1` 是什么意思？为什么追加用 `>>` 而不是 `>`？

<details>
<summary>答案</summary>

2=stderr 并入 1=stdout 一起进日志；`>>` 追加、`>` 覆盖。

推导：cron 输出不进终端必须自己接住，`>` 每次清空丢历史——第 6 章重定向在 cron 场景的直接应用。回指：12.3。
</details>

---

## 下一站

Part 2 的七件事都有台账了——机器开始联网。Part 3 把机器接上网：连得上 → 进得来 → 拦得住 → 开得了门 → 用得上 → 找得到，六关全过才算一台对外的机器。从[第 14 章 网络基础命令](./ch14.md) 开始。

---
