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

----

### 站内相关连接

- [curl 命令用法](/linux/2021/10/14/curl-command.html)
- [用zsh增强shell](/shell/2021/09/20/shell-zsh.html)

----

### 参考

- [技巧1——怎样查看linux发行版本名称和版本号？](https://blog.csdn.net/ymeng9527/article/details/90483687)
- [Linux发行版列表](https://zh.wikipedia.org/wiki/Linux%E5%8F%91%E8%A1%8C%E7%89%88%E5%88%97%E8%A1%A8)
