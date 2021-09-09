---
title: 在wsl上使用systemd
tags: [ wsl, systemd, docker ]
categories: [ wsl ]
key: wsl-systemd
pageview: true
---

## 在 WSL 上使用 systemd

<!--more-->

微软搞的 WSL 非常好用，然而，因为他们用了自定义的 init 启动，使用 systemd 会报下面的错误：

> System has not been booted with systemd as init system (PID 1). Can’t operate.

## 通过 genie 使用 systemd

参考 [genie readme install](https://github.com/arkane-systems/genie#installation)

genie 通过创建一个 pid 空间来实现在 WSL 上使用 systemd。

genie 基于 .NET Core 3 构建，使用前需要先安装 .NET Core 运行环境，安装方法参考微软的[官方文档](https://docs.microsoft.com/en-us/dotnet/core/install/linux)。

然后安装 genie 即可：

```shell
## 1. ubuntu 安装dotnet
wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

# 2. 切换root, 添加 wsl-translinux repository
sudo -s

wget -O /etc/apt/trusted.gpg.d/wsl-transdebian.gpg https://arkane-systems.github.io/wsl-transdebian/apt/wsl-transdebian.gpg
chmod a+r /etc/apt/trusted.gpg.d/wsl-transdebian.gpg

cat << EOF > /etc/apt/sources.list.d/wsl-transdebian.list
deb https://arkane-systems.github.io/wsl-transdebian/apt/ $(lsb_release -cs) main
deb-src https://arkane-systems.github.io/wsl-transdebian/apt/ $(lsb_release -cs) main
EOF

apt update

# 3. 安装 genie
sudo apt install systemd-genie
```

genie 的使用方法比较简单：

```shell
# 启动 systemd 环境
genie -i
# 启动 systemd 环境，并在环境中打开 shell
genie -s
# 启动 systemd 环境，并在环境中运行命令
genie -c command
```

## 开机启动

只做上面的配置，还无法完成开机自启 enabled services，需要继续配置启动项。

首先进入 WSL 环境，创建 `/etc/init.wsl` 文件，内容如下：

```shell
#!/bin/bash
/usr/bin/genie -i
```

添加可执行命令, `chmod +x /etc/init.wsl`

然后回到 Windows，`Win + R` 组合键打开运行，输入 `shell:startup` 进入启动目录。

创建一个 `vbs` 文件，名称随意，内容如下：

```vb
Set ws = CreateObject("Wscript.Shell")
ws.run "wsl -d Ubuntu -u root /etc/init.wsl", vbhide
```

> 注：参数中的 Ubuntu 需要改成你自己使用的 WSL 发行版名称。

## docker覆盖问题

通过systemd启动的docker可能会覆盖docker desktop的WSL Integration中的命令

进入`genie -s`中的`shell`

```shell
systemctl disable docker.service
systemctl disable docker.socket
```

## 参考

- [在 WSL 上使用 systemd](https://core.moe/posts/2021/02/wsl-systemd/)
