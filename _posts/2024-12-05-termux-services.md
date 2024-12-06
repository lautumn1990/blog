---
title: termux系统服务
tags: [ termux, android ]
categories: [ android ]
key: termux-services
pageview: true
---

通过安装termux-services作为系统服务

<!--more-->

## 安装服务 termux-services

```sh
pkg install termux-services -y
```

安装完成后会随软件开启自动运行。

用过Linux的朋友应该对runit并不陌生，runit是一个用于服务监控的UNIX软件，它提供以下两种服务：

- 当服务器启动的时候启动定义好的服务。
- 监控运行的服务，当服务发生意外中断的时候，自动重启服务。

而termux-services就是基于runit封装的，至此大部分runit功能及命令，并专门针对Termux特殊结构做了优化。

termux-services会主动监视`$PREFIX/var/service/`目录，会自动未目录下服务生成守护程序，当服务意外崩溃时，会第一时间将服务重新启动。

同时termux-services默认会后台启动服务，并将服务的输出流做重定向。

原生支持很多服务, 如`sshd`, `crond`

## 相关命令

```sh
# 这里以sshd为例：

sv-enable sshd       #sshd服务设为自启动
sv-disable sshd      #取消sshd自启动
sv down sshd         #停止sshd服务，并使本次Termux运行期间sshd自启动服务失效
sv up sshd           #启动sshd服务
sv status sshd       #查看sshd服务运行状态
```

## 自己编写启动脚本

以`_`分割, 有可能不识别, 尽量使用`-`分割
{:.warning}

### 创建启动脚本

在`$PREFIX/var/service/`下创建子目录，子目录名即为自启动服务名,这里使用`test-ato`作为自启动服务名

```sh
#创建目录
mkdir -p $PREFIX/var/service/test-ato

#创建执行脚本
vim $PREFIX/var/service/test-ato/run
```

内容如下

```sh
#!/data/data/com.termux/files/usr/bin/sh
exec 2>&1
exec ~/test/test.sh
```

`~/test/test.sh`内容如下

```sh
#!/data/data/com.termux/files/usr/bin/sh
while true
do
    echo 'I am still here!'
    sleep 5
done
exit 0
```

### 创建日志

```sh
#创建日志目录
mkdir -p $PREFIX/var/service/test-ato/log
#创建软连接
ln -sf $PREFIX/share/termux-services/svlogger $PREFIX/var/service/test-ato/log/run
```

### 设置开机启动

```sh
sv-enable test-ato
```

### 重启termux

```sh
#查看状态
sv status test-ato
```

### 查看日志

```sh
tail -f $PREFIX/var/log/sv/test-ato/current
```

----

## 参考

- [termux wiki Termux-services](https://wiki.termux.com/wiki/Termux-services)
- [Termux设置——服务自启动](https://blog.csdn.net/YiBYiH/article/details/127294017)
