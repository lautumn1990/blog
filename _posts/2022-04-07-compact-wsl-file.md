---
title: 压缩wsl文件的大小
tags: [ wsl, docker ]
categories: [ wsl ]
key: compact-wsl-file
pageview: true
---

随着使用时间的加长, wsl的`ext4.vhdx`文件会越来越大, 这时候就需要对其进行清理

<!--more-->

## 清理docker

先清理docker不用的资源

```sh
# 已停止的容器（container）
# 未被任何容器所使用的卷（volume）
# 未被任何容器所关联的网络（network）
# 所有悬空镜像（image）。
docker system prune

# 单独的选项
# 删除 dangling 或所有未被使用的镜像
docker image prune
# 删除所有退出状态的容器
docker container prune
# 删除未使用的网络
docker network prune
# 删除未被使用的数据卷
docker volume prune
```

在进行资源清理之前我们有必要搞清楚 docker 都占用了哪些系统的资源。这需要综合使用不同的命令来完成。

```sh
# 默认只列出正在运行的容器，-a 选项会列出包括停止的所有容器。
docker container ls
# 列出镜像信息，-a 选项会列出 intermediate 镜像(就是其它镜像依赖的层)。
docker image ls
# 列出数据卷。
docker volume ls
# 列出 network。
docker network ls
# 显示系统级别的信息，比如容器和镜像的数量等。
docker info
```

## 清理wsl-file

在清理wsl的`ext4.vhdx`文件

```sh
# 关闭wsl
wsl --shutdown
#使用diskpart, 以下命令手动执行
diskpart
# open window Diskpart
select vdisk file="D:\project\wsl\docker-desktop-data\ext4.vhdx"
attach vdisk readonly
compact vdisk
detach vdisk
exit
```

如何安装的`hyper-v`, 可以使用`Optimize-VHD`命令

```sh
wsl --shutdown
optimize-vhd -Path .\ext4.vhdx -Mode full
```

## 清理VMWare

`设置`->`硬件`->`硬盘`->`硬盘实用工具`->`碎片整理`/`压缩`

----

## 参考

- [Docker 空间使用分析与清理](https://zhuanlan.zhihu.com/p/31820191)
- [如何快速清理 docker 资源](https://www.cnblogs.com/sparkdev/p/9177283.html)
- [WSL 2 should automatically release disk space back to the host OS](https://github.com/microsoft/WSL/issues/4699#issuecomment-627133168)
