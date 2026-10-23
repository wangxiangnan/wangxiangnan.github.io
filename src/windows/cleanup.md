# Windows 清理完全手册

> 适用系统：Windows 10 / Windows 11，含 Docker Desktop（WSL2 后端）
> 两条主线：**彻底卸载应用不留残留**、**清理 Docker 存储并真正回收磁盘空间**。

## 目录

第一部分 应用彻底卸载：为什么卸载不干净 / 标准卸载 / 残留文件 / 注册表 / 后台残留 / 特殊软件 / 工具自动化 / 验证

第二部分 Docker 存储清理：三层"只进不出" / 存储模型 / 体检 / 分层清理 / 压缩 vhdx / 长期实践

附录：速查清单与核心原则

---

## 通用原则：先把清理对象分三类

任何"占空间"的东西，动手之前先判断它属于哪一类：

| 类别 | 特征 | 处置 |
| ------ | ------ | ------ |
| **缓存** | 随时可删，会自动重建 | 放心删 |
| **可重建产物** | 删了费点时间但无损失（venv、镜像、模型文件、vhdx 空洞） | 该删就删，别舍不得 |
| **真实状态** | 删了就真没了（数据库卷、用户配置、你的代码） | 逐个确认，能备份先备份 |

全手册贯穿一个判断标准：**凡能从配置文件、安装清单、脚本重建出来的东西，都不要有心理负担；唯一需要谨慎的，是不可再生的数据。**

---

# 第一部分 应用彻底卸载

## 一、为什么"卸载"不等于"删除干净"

Windows 应用的文件分工是分散的：安装目录只放程序本体，运行数据按惯例写在别处。标准卸载程序通常只做两件事——删除安装目录、执行厂商自己写的卸载脚本。至于用户数据、缓存、注册表键，多数卸载器**故意保留**（为了你重装时配置还在），还有一部分是厂商偷懒没写清理逻辑。

各目录的分工：

| 位置 | 放什么 | 谁在写 |
| ------ | -------- | -------- |
| 安装目录（如 `Program Files\...`） | exe、dll、静态资源 | 只在安装/更新时写 |
| `AppData\Local` | 缓存、日志、索引等大头数据 | 运行时频繁写 |
| `AppData\Roaming` | 用户设置、偏好 | 少量写 |
| `ProgramData` | 所有用户共享的配置、服务数据 | 少量写 |
| 用户目录下的 `.xxx` | 开发工具的模型/缓存（Unix 传统） | 运行时频繁写 |

这样设计的原因有三：**权限**（写 Program Files 需要管理员权限，运行时数据放在用户可写的 AppData）、**多用户隔离**（各账户的设置和缓存互不干扰）、**卸载后保留用户数据**（重装时配置还在，副作用就是残留）。

所以一次"彻底卸载" = 标准卸载 + 手动清扫残留。

## 二、卸载前的准备

**1. 退出正在运行的程序**，包括系统托盘里的后台进程。可在任务管理器（`Ctrl+Shift+Esc`）确认没有相关进程。

**2. 创建系统还原点**（可选但推荐，尤其卸载大型软件或动注册表之前）：

```powershell
# 以管理员身份运行 PowerShell
Checkpoint-Computer -Description "卸载软件前备份"
```

或图形界面：系统属性 → 系统保护 → 创建。

## 三、第一步：标准卸载

三种入口，任选其一：

| 方式 | 打开方法 | 适用场景 |
| ------ | ---------- | ---------- |
| 设置 | `Win+I` → 应用 → 安装的应用 | Win11 首选，列表最全 |
| 控制面板 | `Win+R` 输入 `appwiz.cpl` | 传统桌面程序 |
| 命令行 | `winget uninstall 软件名` | 批量、脚本化操作 |

**关键动作：跟着卸载向导走完后，注意最后几屏。** 很多软件（尤其国产软件）会在这里塞"保留用户数据"的勾选项，取消勾选可以让它多清一点。

## 四、第二步：清扫残留文件

按顺序检查以下位置，把 `<软件名>` 或 `<厂商名>` 替换成实际关键词，**只删除能明确对应到该软件的文件夹**：

```
C:\Users\<用户名>\AppData\Local\<软件名>        ← 缓存大头，常占几百 MB 到几 GB
C:\Users\<用户名>\AppData\Roaming\<软件名>      ← 用户配置
C:\Users\<用户名>\AppData\LocalLow\<软件名>     ← 低权限数据，浏览器类软件常见
C:\ProgramData\<软件名>                         ← 所有用户共享的数据
C:\Program Files\<软件名>                       ← 安装目录本体（确认卸载器没删干净）
C:\Program Files (x86)\<软件名>
C:\Users\<用户名>\.<软件名>                     ← 开发工具的 Unix 风格目录，如 .ollama、.vscode
```

**快速定位技巧**：在资源管理器地址栏直接粘贴 `%APPDATA%`、`%LOCALAPPDATA%`、`%ProgramData%` 可以跳转。找不到残留时，用 [Everything](https://www.voidtools.com/) 按软件名全盘搜索，比逐个翻文件夹快得多。

**开始菜单和桌面**：

```
%APPDATA%\Microsoft\Windows\Start Menu\Programs          ← 当前用户的开始菜单
%ProgramData%\Microsoft\Windows\Start Menu\Programs      ← 所有用户的开始菜单
```

删掉里面孤立的快捷方式。

## 五、第三步：清理注册表（谨慎操作）

**原则：只删能明确对应到该软件的键，宁可少删不可误删。不要使用"注册表清理大师"类工具做全盘扫描清理。**

先备份要删的键：右键键名 → 导出，保存 `.reg` 文件，误删可双击恢复。

检查这几个位置，找到以软件名命名的键后删除：

```
HKEY_CURRENT_USER\Software\<软件名>
HKEY_LOCAL_MACHINE\SOFTWARE\<软件名>
HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\<软件名>     ← 32 位软件在 64 位系统的位置
```

**处理"幽灵条目"**：文件已经删了，但"应用列表"里还显示着卸载项。搜索这个位置：

```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Uninstall
```

逐个点开子键，看右侧 `DisplayName` 值，找到目标软件后删除整个子键。

命令行查询（确认键是否存在）：

```powershell
reg query "HKCU\Software" /f "软件名" /k /s
```

## 六、第四步：检查后台残留

**服务**：`Win+R` 输入 `services.msc`，看是否有该软件的服务还在。删除方法（管理员 PowerShell）：

```powershell
sc query 服务名        # 确认存在
sc stop 服务名         # 停止
sc delete 服务名       # 删除
```

**计划任务**：`Win+R` 输入 `taskschd.msc`，任务计划程序库中删除相关条目。部分软件靠计划任务"复活"，卸载后不清理它，过几天可能又自己装回来。

**开机启动**：任务管理器 → 启动应用，禁用/删除残留项。

## 七、特殊类型软件的处理

### 7.1 Microsoft Store 应用（MSIX）

沙箱化封装，标准卸载基本就干净了，注册表残留极少。顽固应用用 PowerShell：

```powershell
Get-AppxPackage *应用名关键词* | Remove-AppxPackage
```

### 7.2 便携版 / 绿色软件

没有安装器，**直接删文件夹**就是完整卸载。个别会在用户目录写配置，搜一下软件名确认即可。

### 7.3 Electron 应用（VS Code、Discord、各类聊天工具）

特点是 AppData 缓存巨大。卸载后重点检查：

```
%APPDATA%\<应用名>          ← 常有几百 MB 到几 GB
%LOCALAPPDATA%\<应用名>
```

### 7.4 开发工具

这类软件的残留不在常规位置，按工具逐个清：

```powershell
pip cache purge                       # Python 包缓存
npm cache clean --force               # npm 缓存：%LOCALAPPDATA%\npm-cache
```

| 工具 | 残留位置 | 处理 |
| ------ | ---------- | ------ |
| Python venv | 各项目的 `.venv\` 文件夹 | 直接删，可随时重建 |
| Ollama | `~\.ollama\models\` | `ollama rm 模型名` 或整个删除 |
| Hugging Face | `~\.cache\huggingface\` | 模型文件很大，直接删 |
| Docker | 镜像、volume、vhdx 虚拟磁盘 | 见第二部分 |
| WSL 发行版 | 发行版的虚拟磁盘 | `wsl --unregister <发行版名>`（整个发行版连数据一起删除，不可逆） |

## 八、用工具自动完成

手动流程走熟之后，可以用工具加速。免费推荐两个：

- **Geek Uninstaller**：单文件绿色版，卸载后自动扫描残留文件和注册表，轻量够用。
- **Revo Uninstaller（免费版）**：残留扫描更彻底，可强制卸载列表里删不掉的软件。

工具的"残留扫描"逻辑和本手册第四、五节相同，区别只是它自动帮你匹配。**扫描结果仍要人工过目**，工具偶尔会把共享组件误判为残留。

## 九、验证是否卸载干净

1. `winget list` 确认列表里已经没有该软件
2. Everything 全盘搜索软件名，确认没有漏网文件夹
3. 重启一次，任务管理器里确认无相关进程和服务自动启动
4. 过几天再瞄一眼 `%TEMP%` 和 AppData，确认没有"复活"迹象

---

# 第二部分 Docker 存储清理

## 十、为什么需要清理：三个"只进不出"

很多人以为执行过 `docker rm` / `docker rmi` 就干净了，实际上 Docker 的存储行为有三层"只进不出"：

**第一层：镜像层的累积。** 镜像由多层只读层堆叠而成。拉取新版本镜像（如 `node:20` → `node:22`）时，旧镜像不会自动删除，只是失去标签，变成"悬空镜像"留在本地。升级 10 次软件，就攒下 9 份旧层。

**第二层：构建缓存的累积。** 每次 `docker build` 的中间层都会缓存，目的是下次构建加速。代价是：实验性 Dockerfile 改一次就多一批缓存，而且**缓存不会过期**。

**第三层：vhdx 虚拟磁盘只涨不缩（Windows 特有）。** Docker Desktop 把所有数据存进 WSL2 的一个虚拟磁盘文件（`docker_data.vhdx` / `ext4.vhdx`）。这个文件**动态扩容、但从不自动收缩**——你在容器里删掉 10GB 镜像，那 10GB 在 vhdx 内部变成"空洞"，Windows 看到的文件大小纹丝不动。

一个真实案例（本手册写作时的实测数据）：

```
docker_data.vhdx 文件大小：22 GB
镜像+容器+volume 实际占用：≈ 2.2 GB
差距：约 20 GB 全是空洞
```

清理的目的就是同时对付三层：**清掉无用数据（一、二层）+ 压缩虚拟磁盘回收空洞（第三层）**。只做前者，Windows 用户经常发现"清理了但磁盘没变"，原因就在第三层。

## 十一、先看懂账本：Docker 存储模型

Docker 管理四类对象，清理命令都围绕它们：

| 对象 | 是什么 | 删除的影响 |
| ------ | -------- | ------------ |
| **Images** | 镜像，多层只读文件系统 | 可重新拉取，零风险 |
| **Containers** | 容器运行实例 = 镜像 + 可写层 | 丢失容器内未持久化数据 |
| **Volumes** | 持久化数据卷（数据库等） | **不可再生——对应手册开头的"真实状态"** |
| **Build Cache** | 构建中间层缓存 | 安全，下次构建变慢一点 |

两个必须分清的概念：

- **悬空镜像（dangling）**：失去标签的旧层，如 `<none>:<none>`。删掉零风险。
- **未使用镜像（unused）**：有标签、但当前没有任何容器引用它。删掉后下次要用要重新拉取。

## 十二、第一步：体检，看清占用

```bash
docker system df          # 总览：四类对象的数量、大小、可回收量
docker system df -v       # 详细模式：每个镜像/容器/卷的单独大小
```

重点读 `RECLAIMABLE` 列——它告诉你"理论上能清多少"。再配合：

```bash
docker ps -a              # 所有容器（包括已停止的）
docker images -a          # 所有镜像，注意 <none> 标签的悬空镜像
docker volume ls          # 所有数据卷
docker builder du         # 构建缓存占用
```

**养成习惯：先体检后清理。**

## 十三、第二步：分层清理（从安全到危险）

清理命令的风险梯度是设计好的，按顺序执行，每一级都先看清会删什么。

### 13.1 已停止的容器（安全）

```bash
docker container prune
```

只删**已停止**的容器，运行中的不受影响。

### 13.2 无用网络（安全）

```bash
docker network prune
```

删掉没有被容器引用的自定义网络。

### 13.3 悬空镜像（安全）

```bash
docker image prune
```

只删 `<none>:<none>` 的悬空镜像。升级软件留下的旧层基本都在这里。

### 13.4 未使用镜像（需过目）

```bash
docker image prune -a                       # 删除所有没有被容器引用的镜像
docker image prune -a --filter "until=168h" # 只删创建超过 7 天的
```

执行前先 `docker images` 看一眼——你手动 `docker pull` 备用、还没起容器的镜像也会被算作"未使用"。

### 13.5 构建缓存（安全）

```bash
docker builder prune           # 清理悬空缓存
docker builder prune --all     # 全部构建缓存，下次构建全部重来
```

学习期实验 Dockerfile 频繁，这项往往积累最多。

### 13.6 数据卷（⚠️ 最高风险）

```bash
docker volume prune            # 删除所有没有被容器引用的卷
```

**这是唯一"删了就真没了"的清理**——对应通用原则里的"真实状态"。数据库数据、模型文件都存在卷里。典型的坑：项目做完、容器删了、卷还在，`prune` 会把它连同里面的 MySQL 数据一起删掉，镜像可以重拉，数据不可再生。

执行前必须：

```bash
docker volume ls
docker volume inspect 卷名      # 看创建时间和挂载点，确认是谁的
```

重要数据卷先备份再清，MySQL 示例：

```bash
docker exec 容器名 mysqldump -u root -p --all-databases > backup.sql
```

### 13.7 一键大扫除（谨慎版）

```bash
docker system prune                       # = 容器+网络+悬空镜像+构建缓存
docker system prune -a                    # 再加上未使用镜像
docker system prune -a --volumes          # 再加上数据卷 ← 初学者不建议
```

`--volumes` 会跳过 13.6 的确认直接删卷，学习期不建议带这个参数，分开执行更稳。

## 十四、第三步：压缩 vhdx，把空间真正要回来

前一步的所有 `prune` 只是在**虚拟磁盘内部**腾出了空洞，文件本身不会变小，必须手动压缩。

**原理**：vhdx 是动态扩容的稀疏磁盘，`compact vdisk` 会把内部未使用的块归还给宿主文件系统。**同样的压缩方法也适用于任何 WSL 发行版自己的 `ext4.vhdx`**（如 Ubuntu）。

### 先认识工具：diskpart

压缩要用到的 diskpart 是 **Windows 自带的命令行磁盘管理工具**（从 Windows NT 时代就有，无需安装）。可以把它理解成图形界面"磁盘管理"（`diskmgmt.msc`）的命令行版，但能力更强：它管理物理磁盘（disk）→ 分区（partition）→ 卷（volume）三层结构，还支持虚拟磁盘（VHD/VHDX）操作。

之所以压缩 vhdx 必须靠它，是因为 `compact vdisk` 这个功能**没有图形界面替代**——磁盘管理 GUI 压不了 vhdx，Hyper-V 管理器可以但要求安装 Hyper-V 组件。diskpart 是所有 Windows 版本都能用的唯一内置途径，家庭版用户尤其只有这一个选择。

它的用法和一般命令不同，是一个**交互式环境**：输入 `diskpart` 回车后进入它自己的提示符，之后的命令都发给它而非系统：

```
DISKPART> list disk                          ← 列出所有物理磁盘
DISKPART> select vdisk file="D:\...vhdx"     ← 选中一个虚拟磁盘文件
DISKPART> attach vdisk readonly              ← 挂载（只读模式）
DISKPART> compact vdisk                      ← 压缩，回收空洞
DISKPART> detach vdisk                       ← 卸载
DISKPART> exit                               ← 退出
```

三点安全须知：

1. **必须以管理员身份运行**，否则会报错。
2. **它威力大且不啰嗦**：比如 `clean` 一条命令直接清空整块磁盘、没有任何确认。所以在里面敲命令前，一定看清 `select` 选中的是哪个目标——选错物理磁盘后果严重。
3. **我们的用法是安全的**：`select vdisk file="..."` 明确指定了文件路径，操作只作用于那个 vhdx 文件，不会碰任何物理磁盘和分区。

### 步骤

1. **退出 Docker Desktop**：系统托盘右键 Docker 图标 → Quit Docker Desktop（必须彻底退出，否则文件被占用无法压缩）
2. **关闭所有 WSL 发行版**：以管理员身份打开 PowerShell：

```powershell
wsl --shutdown
```

1. **启动 diskpart**：

```powershell
diskpart
```

1. 在 diskpart 交互界面依次执行（路径换成你自己的 vhdx 位置）：

```
select vdisk file="D:\Docker_WSL\DockerDesktopWSL\disk\docker_data.vhdx"
attach vdisk readonly
compact vdisk
detach vdisk
exit
```

1. **验证效果**：

```powershell
Get-Item "D:\Docker_WSL\DockerDesktopWSL\disk\docker_data.vhdx" | Select-Object @{N='SizeGB';E={[math]::Round($_.Length/1GB,2)}}
```

**vhdx 位置怎么找**：Docker Desktop 的数据盘通常在 `%LOCALAPPDATA%\Docker\wsl\` 下；如果安装时改过盘符（如本例的 `D:\Docker_WSL\`），用注册表确认——`HKCU\Software\Microsoft\Windows\CurrentVersion\Lxss` 下每个发行版的 `BasePath` 就是它所在目录。

**替代命令**：装有 Hyper-V 模块的系统（专业版常见）可用一条命令代替 diskpart 中间四步：

```powershell
Optimize-VHD -Path "D:\Docker_WSL\DockerDesktopWSL\disk\docker_data.vhdx" -Mode Full
```

**预期效果**：压缩后文件大小会向实际占用靠拢。像"22 GB 但实际只用 2.2 GB"的情况，通常能缩回 3-5 GB 以内，一次回收近 20 GB。如果压缩后大小和 `docker system df` 的实际占用仍差很多，可能是 WSL 内部文件系统碎片，多次 compact 或重建数据盘（先导出再导入）可进一步解决。

## 十五、长期最佳实践：从源头少产生垃圾

**镜像管理**

- 锁定版本标签（`postgres:16`），不用 `latest`——版本可控，升级时旧镜像也明确可删
- 升级后随手 `docker image prune`，别让悬空层过夜
- Dockerfile 用多阶段构建（multi-stage），最终镜像只含运行时依赖，体积常能砍一半以上

**构建缓存**

- 写好 `.dockerignore`（排除 `node_modules`、`.venv`、`.git` 等），减少构建上下文，也避免无关文件变动导致缓存大面积失效
- Dockerfile 中不常变的层（装依赖）写在前面，常变的（拷代码）写在后面，让缓存命中率最大化

**卷的使用**

- 学习项目用完即弃时，`docker compose down` 想清楚要不要带 `-v`：不带，卷留下占空间；带，数据消失
- 重要数据一律用命名卷 + 明确用途的卷名（`docmind_pgdata`），别用默认的哈希名——三个月后没人认得 `a1b2c3...` 是什么

**例行维护**

- 每月 3 分钟：`docker system df` 看一眼 → `docker system prune`（不带 `-a` 和 `--volumes` 的保守版）→ 发现 vhdx 明显大于实际占用，做一次第十四章的压缩
- 在 `.wslconfig`（`C:\Users\<用户名>\.wslconfig`）里限制资源，防止单次实验吃满内存：

```ini
[wsl2]
memory=4GB
processors=4
```

**学习期的定位**：代码留在宿主机跑，容器里只放服务。清理对象始终是"服务的数据"而不是"你的代码环境"，prune 的心理成本低很多。

---

# 附录

## 速查清单 A：应用彻底卸载

```
□ 退出程序，结束后台进程
□ （可选）创建还原点
□ 设置/控制面板/winget 执行标准卸载
□ 清扫 AppData\Local、Roaming、LocalLow、ProgramData、安装目录
□ 清理开始菜单快捷方式
□ 备份后删除对应注册表键，处理幽灵条目
□ 检查服务、计划任务、开机启动
□ 开发工具额外清理缓存目录
□ 重启验证
```

## 速查清单 B：Docker 清理

```bash
# ── 体检 ──────────────────────────────
docker system df                     # 看总量和可回收量
docker ps -a && docker images -a     # 确认每一项是什么
docker volume ls                     # ⚠️ 重点确认数据卷

# ── 分层清理（按风险从低到高）─────────
docker container prune               # 停止的容器
docker network prune                 # 无用网络
docker image prune                   # 悬空镜像（安全）
docker image prune -a                # 未使用镜像（先看列表）
docker builder prune --all           # 构建缓存（安全）
# docker volume prune                # ⚠️ 数据卷，逐个确认后手动删

# ── Windows 回收空洞 ─────────────────
# 1. 退出 Docker Desktop
# 2. wsl --shutdown
# 3. diskpart → select vdisk → attach readonly → compact vdisk → detach
# 4. Get-Item 验证新大小
```

## 核心原则回顾

1. **先分类再动手**：缓存放心删，可重建产物果断删，真实状态（卷、用户数据）逐个确认。
2. **先体检再清理**：无论应用残留还是 Docker 占用，第一步永远是 `system df` / Everything 搜索，看清了再删。
3. **Windows 上清理分两步**：`prune` 删数据，`compact` 还空间，缺第二步等于白清。
4. **谨慎留给数据，果断留给缓存**：四类 Docker 对象里只有 Volume 不可再生，其余都能重建。
