---
title: 安装Mysql
date: 2021-04-19 19:29:02
tags:
---
mysql安装：
下载地址： http://mirrors.sohu.com/mysql/MySQL-8.0/mysql-8.0.11-winx64.zip

mysqld --initialize --user=wangyuda --basedir=E:\soft\mysql --datadir=E:\soft\mysql\data
// 添加服务
mysqld install mysql
// 添加服务
mysqld remove mysql
// 启动/停止服务
net start/stop mysql
注释：yourusername：你的用户名字

初始化密码：DESKTOP-V8LTKIB.err
A temporary password is generated for root@localhost: A_mBvrbnD0*r（你的密码）
修改密码：./mysqladmin -u root -p password 输入原始的 两次新的


配置环境变量
// 解压操作： tar -xzvf ${filename}
启动/停止服务：./support-files/mysql.server start/stop

// 配置环境变量
1.打开终端,输入： cd ~
会进入~文件夹
2.然后输入：touch .bash_profile
回车执行后，
2.再输入：open -e .bash_profile
会在TextEdit中打开这个文件（如果以前没有配置过环境变量，那么这应该是一个空白文档）。如果有内容，请在结束符前输入，如果没有内容，请直接输入如下语句：
export PATH=${PATH}:/usr/local/mysql/bin
然后，保存，退出TextEdit（一定是退出），关闭终端并退出。

git bash不能登录mysql的问题，前面加上winpty就可以了


mysqld --initialize --user=wangyuda --basedir=E:\soft\mysql --datadir=E:\soft\mysql\data

mysqld --install Mysql --defaults-file=E:\soft\mysql\my.ini
navicat链接失败：报2509

在8版本以后的MySql默认的加密方式都改为了caching_sha2_password

因此进入mysql的命令行更改加密方式即可

ALTER USER 'root'@'localhost' IDENTIFIED BY 'password' PASSWORD EXPIRE NEVER;   #更改加密方式
 

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '新密码';   #更新用户密码
 

FLUSH PRIVILEGES;   #刷新权限



