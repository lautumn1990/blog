---
title: linux常用命令
tags: [ linux ]
categories: [ linux ]
key: linux-common-commands
pageview: true
---

linux常用命令(持续更新)

<!--more-->

## 如何查看linux系统名称和版本号

- RHEL
  - RHEL一般指Red Hat Enterprise Linux，Red Hat公司发布的面向企业用户的Linux操作系统
  - 社区版是CentOS, CentOS8在2021年底停止维护, 取而代之的是CentOS Stream, 这个版本可能是进入Red Hat Enterprise Linux所做的Beta测试版。

- Debian
  - 广义的Debian是指一个致力于创建自由操作系统的合作组织及其作品，由于Debian项目众多内核分支中以Linux宏内核为主
  - 而且 Debian开发者 所创建的操作系统中绝大部分基础工具来自于GNU工程 ，因此 “Debian” 常指Debian GNU/Linux

- openSUSE
  - openSUSE 项目是由 Novell 发起的开源社区计划。
  - 旨在推进 Linux 的广泛使用，提供了自由简单的方法来获得世界上最好用的 Linux 发行版之一:openSUSE。
  - openSUSE 项目为 Linux开发者和爱好者提供了开始使用 Linux 所需要的一切。
  - openSUSE是一个一般用途的基于Linux内核的GNU/Linux操作系统

- Arch
  - Arch Linux是一款基于 x86-64 架构的 Linux 发行版。系统主要由自由和开源软件组成，支持社区参与。
  接下来看看可以使用哪些基本命令来查看linux发行版名称和版本号

1. `lsb_release`

   ```sh
   lsb_release -a
   ```

1. `/etc/os-release`

   ```sh
   # RHEL
   cat /etc/os-release
   cat /etc/system-release
   cat /etc/redhat-release
   # CentOS
   cat /etc/centos-release
   # fedora
   cat /etc/fedora-release
   ```

1. `uname`

   uname(unix name)是一个打印系统信息的工具，包括：内核名称、版本号、系统详细信息以及所运行的操作系统等

   ```sh
   uname -a
   ```

1. `/proc/version`

   该文件记录了linux内核发行的版本、用于编译内核的gcc版本、内核编译的时间、以及内核编译者的用户名

   ```sh
   cat /proc/version
   ```

1. `dmesg`

   dmesg(展现信息display message 或者 驱动程序信息driver message)是大多数unix操作系统上面的一个命令，用于打印内核的消息缓冲区的信息

   ```sh
   dmesg | grep "Linux"
   ```

1. 包管理工具

   `yum`

   Yum是linux操作系统上的一个包管理工具，yum命令是被用于一些基本RedHat的linux发行版上的安装、更新、查找、删除软件包

   `rmp`

   RPM（红帽包管理器RedHat Package Manager）是在CentOS、Oracle、Linux、Fedora这些基于RedHat的操作系统上面的一个强大的命令行包管理工具，同样也可以帮助我们查看系统的版本信息

## touch

1. 创建空文件

   ```sh
   touch linux.txt
   ```

1. 批量创建空文件

   ```sh
   touch file{1..20}.txt
   ```

1. 改变或更新文件和目录的访问时间

   ```sh
   # 更新访问时间
   touch -a linux.txt
   # 更新修改时间
   touch -m linux.txt
   # 查看事件
   stat linux.txt
   ```

1. 更改访问时间而不用创建新文件

   ```sh
   touch -c linux.txt
   ```

1. 更改文件和目录的修改时间

   ```sh
   touch -m linux.txt
   ```

1. 将访问时间和修改时间设置为特定的日期和时间

   ```sh
   touch -c -t 202505211314.22 linux.txt
   touch -c -d "2025-05-21 13:14:22" linux.txt
   ```

## awk

1. 基本用法

   `awk`的基本用法就是下面的形式。

   示例

   ```sh
   # 格式
   awk 动作 文件名
   # 示例
   awk '{print $0}' demo.txt
   # 0是当前行, $1、$2、$3代表第一个字段、第二个字段、第三个字段等等。
   ```

   下面，我们先用标准输入（stdin）演示上面这个例子。

   ```sh
   $ echo 'this is a test' | awk '{print $0}'
   this is a test
   ```

   awk会根据空格和制表符，将每一行分成若干字段，依次用$1、$2、$3代表第一个字段、第二个字段、第三个字段等等。

   ```sh
   $ echo 'this is a test' | awk '{print $3}'
   a
   ```

   ```sh
   $ cat << EOF > demo.txt
   root:x:0:0:root:/root:/usr/bin/zsh
   daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
   bin:x:2:2:bin:/bin:/usr/sbin/nologin
   sys:x:3:3:sys:/dev:/usr/sbin/nologin
   sync:x:4:65534:sync:/bin:/bin/sync
   EOF

   $ awk -F ':' '{ print $1 }' demo.txt
   root
   daemon
   bin
   sys
   sync
   ```

1. 变量

   `除了`$ + 数字`表示某个字段，awk还提供其他一些变量。

   变量`NF`表示当前行有多少个字段，因此`$NF`就代表最后一个字段。

   ```sh
   $ echo 'this is a test' | awk '{print $NF}'
   test
   ```

   `$(NF-1)`代表倒数第二个字段。

   ```sh
   $ awk -F ':' '{print $1, $(NF-1)}' demo.txt
   root /root
   daemon /usr/sbin
   bin /bin
   sys /dev
   sync /bin
   ```

   上面代码中，print命令里面的逗号，表示输出的时候，两个部分之间使用空格分隔。

   变量`NR`表示当前处理的是第几行。

   ```sh
   $ awk -F ':' '{print NR ") " $1}' demo.txt
   1) root
   2) daemon
   3) bin
   4) sys
   5) sync
   ```

   上面代码中，print命令里面，如果原样输出字符，要放在双引号里面。

   awk的其他内置变量如下。

   - FILENAME：当前文件名
   - FS：字段分隔符，默认是空格和制表符。
   - RS：行分隔符，用于分割每一行，默认是换行符。
   - OFS：输出字段的分隔符，用于打印时分隔字段，默认为空格。
   - ORS：输出记录的分隔符，用于打印时分隔记录，默认为换行符。
   - OFMT：数字输出的格式，默认为％.6g。`

1. 函数

   awk还提供了一些内置函数，方便对原始数据的处理。

   函数toupper()用于将字符转为大写。

   ```sh
   $ awk -F ':' '{ print toupper($1) }' demo.txt
   ROOT
   DAEMON
   BIN
   SYS
   SYNC
   ```

   上面代码中，第一个字段输出时都变成了大写。

   其他常用函数如下。

   ```sh
   tolower()：字符转为小写。
   length()：返回字符串长度。
   substr()：返回子字符串。
   sin()：正弦。
   cos()：余弦。
   sqrt()：平方根。
   rand()：随机数。
   ```

1. 条件

   awk允许指定输出条件，只输出符合条件的行。

   输出条件要写在动作的前面。

   ```sh
   awk '条件 动作' 文件名
   ```

   请看下面的例子。

   ```sh
   $ awk -F ':' '/usr/ {print $1}' demo.txt
   root
   daemon
   bin
   sys
   ```

   上面代码中，print命令前面是一个正则表达式，只输出包含usr的行。

   下面的例子只输出奇数行，以及输出第三行以后的行。

   ```sh
   # 输出奇数行
   $ awk -F ':' 'NR % 2 == 1 {print $1}' demo.txt
   root
   bin
   sync
   ```

   ```sh
   # 输出第三行以后的行
   $ awk -F ':' 'NR >3 {print $1}' demo.txt
   sys
   sync
   ```

   下面的例子输出第一个字段等于指定值的行。

   ```sh
   $ awk -F ':' '$1 == "root" {print $1}' demo.txt
   root

   $ awk -F ':' '$1 == "root" || $1 == "bin" {print $1}' demo.txt
   root
   bin
   ```

1. if语句

   awk提供了`if`结构，用于编写复杂的条件。

   ```sh
   $ awk -F ':' '{if ($1 > "m") print $1}' demo.txt
   root
   sys
   sync
   ```

   上面代码输出第一个字段的第一个字符大于m的行。

   if结构还可以指定else部分。

   ```sh
   $ awk -F ':' '{if ($1 > "m") print $1; else print "---"}' demo.txt
   root
   ---
   ---
   sys
   sync
   ```

## 常用工具包

- docker中常用工具包, `centos`使用`yum`, `ubuntu`使用`apt`

  ```sh
  # 安装ifconfig、netstat命令
  yum install net-tools
  apt install net-tools
  # 安装ip命令
  yum install iproute
  apt install iproute2
  # 安装ping命令
  yum install iputils
  apt install inetutils-ping
  # 安装telnet命令
  yum install telnet
  apt install telnet
  ```

## 其他命令

- 查看软件安装时间
  - ubuntu

    ```sh
    zcat /var/log/apt/history.log.*.gz | cat - /var/log/apt/history.log | grep " install " -C 5
    ```

  - centos

    ```sh
    rpm -qa --last
    ```

----

## 站内相关连接

- [curl 命令用法](/linux/2021/10/14/curl-command.html)
- [用zsh增强shell](/shell/2021/09/20/shell-zsh.html)
- [find命令](/linux/2021/12/30/linux-find-files.html)

----

## 参考

- [技巧1——怎样查看linux发行版本名称和版本号？](https://blog.csdn.net/ymeng9527/article/details/90483687)
- [Linux发行版列表](https://zh.wikipedia.org/wiki/Linux%E5%8F%91%E8%A1%8C%E7%89%88%E5%88%97%E8%A1%A8)
- [awk 入门教程](https://www.ruanyifeng.com/blog/2018/11/awk.html)
