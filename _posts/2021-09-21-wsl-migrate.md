---
title: wsl迁移和wsl访问代理
tags: [ wsl, docker ]
categories: [ wsl ]
key: wsl-migrate
pageview: true
---

## 用wsl迁移

<!--more-->

```bat
rem 关闭docker, 关闭wsl  
wsl --shutdown  
rem 查看有所的wsl应用  
wsl --list -v  
set wsl_path=D:\projects\wsl
mkdir %wsl_path%
rem 重新设置docker-desktop-data 位置  
wsl --export docker-desktop-data "%wsl_path%\docker-desktop-data.tar"  
wsl --unregister docker-desktop-data  
wsl --import docker-desktop-data %wsl_path%\docker-desktop-data "%wsl_path%\docker-desktop-data.tar" --version 2  
rem 重新设置docker-desktop 位置  
wsl --export docker-desktop "%wsl_path%\docker-desktop.tar"  
wsl --unregister docker-desktop  
wsl --import docker-desktop %wsl_path%\docker-desktop "%wsl_path%\docker-desktop.tar" --version 2  

rem 删除多余的tar备份
del "%wsl_path%\docker-desktop-data.tar"
del "%wsl_path%\docker-desktop.tar"
```

ubuntu迁移默认用户失败

```conf
[user]
default=username
# 移除多余path参数
[interop]
appendWindowsPath = false
```

## wsl访问代理

WSL 每次启动的时候都会有不同的 IP 地址，所以并不能直接用静态的方式来设置代理。WSL2 会把 IP 写在 `/etc/resolv.conf` 中，因此可以用 `cat /etc/resolv.conf | grep nameserver | awk '{ print $2 }'` 这条指令获得宿主机 IP 。

WSL2 自己的 IP 可以用 `hostname -I | awk '{print $1}'` 得到。

设置代理,别忘了代理软件中设置**允许来自局域网的连接**。

```shell
export http_proxy='http://<Windows IP>:<Port>'
export https_proxy='http://<Windows IP>:<Port>'
```

别忘了修改代理端口, 点击下载[proxy.sh](/assets/sources/2021/09/proxy.sh)

```shell
#!/bin/sh
hostip=$(cat /etc/resolv.conf | grep nameserver | awk '{ print $2 }')
wslip=$(hostname -I | awk '{print $1}')
port=${2:-'10808'}

PROXY_HTTP="http://${hostip}:${port}"

set_proxy(){
    export http_proxy="${PROXY_HTTP}"
    export HTTP_PROXY="${PROXY_HTTP}"

    export https_proxy="${PROXY_HTTP}"
    export HTTPS_proxy="${PROXY_HTTP}"
}

unset_proxy(){
    unset http_proxy
    unset HTTP_PROXY
    unset https_proxy
    unset HTTPS_PROXY
}

test_setting(){
    echo "Host ip:" ${hostip}
    echo "WSL ip:" ${wslip}
    echo "Current proxy:" $https_proxy
}

if [ "$1" = "set" ]
then
    set_proxy
elif [ "$1" = "unset" ]
then
    unset_proxy
elif [ "$1" = "test" ]
then
    test_setting
else
    echo "Unsupported arguments."
fi
```

如果希望 git 也能通过代理，可以分别在 set_proxy 和 unset_proxy 函数中加上如下命令

```shell
# 添加代理
git config --global http.proxy "${PROXY_HTTP}"
git config --global https.proxy "${PROXY_HTTP}"

# 移除代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

然后执行`. ./proxy.sh set 端口号`

或者添加到`~/.bashrc`中

```shell
alias proxy="source /path/to/proxy.sh"
. /path/to/proxy.sh set
```

第一句话可以为这个脚本设置别名 proxy，这样在任何路径下都可以通过 proxy 命令使用这个脚本了，之后在任何路径下，都可以随时都可以通过输入 proxy unset 来暂时取消代理。

第二句话就是在每次 shell 启动的时候运行该脚本实现自动设置代理，这样以后不用额外操作就默认设置好代理啦~

## 参考

- [wsl2 docker 迁移](https://www.cnblogs.com/xzhg/p/14959196.html)
- [WSL2 中访问宿主机 Windows 的代理](https://zinglix.xyz/2020/04/18/wsl2-proxy)
