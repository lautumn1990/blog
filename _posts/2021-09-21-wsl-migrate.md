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

ubuntu迁移

```bat
rem 重新设置ubuntu 位置  
wsl --export ubuntu "%wsl_path%\ubuntu.tar"  
wsl --unregister ubuntu  
wsl --import ubuntu %wsl_path%\ubuntu "%wsl_path%\ubuntu.tar" --version 2  

rem 删除多余的tar备份
del "%wsl_path%\ubuntu.tar"
```

ubuntu迁移默认用户失败, 参考[build no. 18980](https://docs.microsoft.com/zh-cn/windows/wsl/release-notes#build-18980)

`/etc/wsl.conf`文件

```conf
[user]
default=username
# 移除多余path参数
[interop]
appendWindowsPath = false
```

## wsl访问代理

WSL 每次启动的时候都会有不同的 IP 地址，所以并不能直接用静态的方式来设置代理(参考以下方式设置[静态ip](#wsl静态ip))。WSL2 会把 IP 写在 `/etc/resolv.conf` 中，因此可以用 `cat /etc/resolv.conf | grep nameserver | awk '{ print $2 }'` 这条指令获得宿主机 IP 。

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
protocol=${3:-'socks5'}

PROXY_HTTP="${protocol}://${hostip}:${port}"

set_proxy(){
    export http_proxy="${PROXY_HTTP}"
    export HTTP_PROXY="${PROXY_HTTP}"

    export https_proxy="${PROXY_HTTP}"
    export HTTPS_PROXY="${PROXY_HTTP}"
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

然后执行`. ./proxy.sh set 端口号 协议`, 默认`. ./proxy.sh set`相当于`. ./proxy.sh set 10808 socks5`

或者添加到`~/.bashrc`中

```shell
alias proxy="source /path/to/proxy.sh"
. /path/to/proxy.sh set
```

第一句话可以为这个脚本设置别名 proxy，这样在任何路径下都可以通过 proxy 命令使用这个脚本了，之后在任何路径下，都可以随时都可以通过输入 proxy unset 来暂时取消代理。

第二句话就是在每次 shell 启动的时候运行该脚本实现自动设置代理，这样以后不用额外操作就默认设置好代理啦~

## wsl中ls绿油油一片

主要是因为在 WSL 中，Microsoft 实现了两种文件系统，用于支持不同的使用场景：

- VolFs
    着力于在 Windows 文件系统上提供完整的 Linux 文件系统特性，通过各种手段实现了对 Inodes、Directory entries、File objects、File descriptors、Special file types 的支持。比如为了支持 Windows 上没有的 Inodes，VolFs 会把文件权限等信息保存在文件的 NTFS Extended Attributes 中。就是因为 Windows 中新建的文件缺少这个扩展参数，VolFs 无法正确获取该文件的 metadata，而且有些 Windows 上的编辑器会在保存时抹掉这些附加参数。

    `WSL 中的 / 使用的就是 VolFs 文件系统。`

- DrvFs
    着力于提供与 Windows 文件系统的互操作性。与 VolFs 不同，为了提供最大的互操作性，DrvFs 不会在文件的 NTFS Extended Attributes 中储存附加信息，而是从 Windows 的文件权限（Access Control Lists，就是你右键文件 > 属性 > 安全选项卡中的那些权限配置）推断出该文件对应的的 Linux 文件权限。

    `所有 Windows 盘符挂载至 WSL 下的 /mnt 时都是使用的 DrvFs 文件系统。`

解决方法, 在 WSL 中创建 `/etc/wsl.conf`，在其中填写如下内容：

```conf
[automount]
enabled = true
root = /mnt/
options = "metadata,umask=22,fmask=111"
mountFsTab = true
```

>通过此方法改动可能会产生通过`VS Code`的`WSL targets`打不开, 报错
>
>```text
>sh: 1: /mnt/c/Users/XXXX/.vscode-insiders/extensions/ms-vscode-remote.remote-wsl-0.42.0/scripts/wslServer.sh: Permission denied
>```
>
>在wsl2中进入报错目录,
>
>```shell
>chmod +x *
>```
>
>添加可执行权限
>
>或者直接
>
>```sh
>chmod +x /mnt/c/Users/*/.vscode/extensions/ms-vscode-remote.remote-wsl*/scripts/*.sh
>```
>
>参考
>
>- [Support WSL mount options with vscode remote](https://github.com/microsoft/vscode-remote-release/issues/2126)
>- [wslServer.sh: Permission denied](https://blog.csdn.net/WUDIxi/article/details/104760452)

## wsl修改host名称

修改`/etc/wsl.conf`, 参考[hostname](https://github.com/microsoft/WSL/issues/4305#issuecomment-680848763)

```conf
[network]
hostname=WSL
```

## wsl注册表

`HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Lxss`注册表地址

## wsl服务重启

```bat
net stop LxssManager
net start LxssManager

sc stop LxssManager
sc start LxssManager
rem 查看服务
sc query LxssManager
```

## 安装其他wsl版本的linux系统

[Project List Using wsldl](https://wsldl-pg.github.io/docs/Using-wsldl/)

安装方法

```shell
# 安装
{InstanceName}.exe
# 修改用户
{InstanceName}.exe config --default-user user
# 卸载
{InstanceName}.exe clean
# wsl 转 wsl2
wsl --set-version {name} 2
```

## wsl 限制内存

`%userprofile%\.wslconfig`, 参考[wsl-config](https://docs.microsoft.com/zh-cn/windows/wsl/wsl-config),
[英文原版](https://docs.microsoft.com/en-us/windows/wsl/wsl-config)

```conf
[wsl2]  
memory=2GB  
processors=4  
swap=512MB  
```

## wsl静态ip

1. 创建脚本,在`/home/lautumn`下, 注意修改为自己的ip地址, 如果没特殊要求的话, 可直接使用, 其中wsl的ip地址为`172.30.38.138`, "vEthernet (WSL)"的ip地址为`172.30.32.1`

   ```sh
   cat <<EOF > static_ip.sh
   #!/bin/bash
   
   # config wsl ip
   /sbin/ip addr flush dev eth0
   /sbin/ip addr add 172.30.38.138/20 broadcast 172.30.47.255 dev eth0 label eth0
   /sbin/route add default gw 172.30.32.1
   sed -i 's/nameserver.*/\n# this is replace by init script\nnameserver 172.30.32.1/' /etc/resolv.conf
   
   # config vEthernet (WSL) ip
   /mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe -c "Get-NetAdapter 'vEthernet (WSL)' -IncludeHidden | Get-NetIPAddress | Remove-NetIPAddress -Confirm:\\\$False; New-NetIPAddress -IPAddress 172.30.32.1 -PrefixLength 20 -InterfaceAlias 'vEthernet (WSL)';"

   # config WSLNat
   /mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe -c "Get-NetNat | ? Name -Eq WSLNat | Remove-NetNat -Confirm:\\\$False; New-NetNat -Name WSLNat -InternalIPInterfaceAddressPrefix 172.30.32.0/20;"
   EOF
   
   chmod +x static_ip.sh
   ```

   如果`/mnt/c/Windows/System32/netsh.exe`在wsl中不能用, 取消自动挂载, 启动mountFsTab挂载

   ```conf
   [automount]
   enabled = false
   mountFsTab = true
   ```

   如果还要去除绿油油的一片的话, 修改`/etc/fstab`

   ```sh
   LABEL=cloudimg-rootfs   /        ext4   defaults        0 1
   C: /mnt/c drvfs rw,relatime,uid=1000,gid=1000,fmask=111,umask=022,metadata,case=off 0 0
   //localhost/C$/Windows/System32 /mnt/c/Windows/System32 drvfs defaults,ro,relatime,uid=1000,gid=1000,fmask=222,umask=222,case=off 0 0
   D: /mnt/d drvfs rw,relatime,uid=1000,gid=1000,fmask=111,umask=022,metadata,case=off 0 0
   ```

1. windows启动目录`shell:startup`中添加脚本, `static-ip.vbs`, 内容如下

   ```vb
   Set ws = CreateObject("Wscript.Shell")
   ws.run "wsl -d Ubuntu -u root /home/lautumn/static_ip.sh", vbhide
   ```

   - 方式一, 由于`netsh.exe`需要管理员权限, 所以直接放到`启动`目录下不能用, 可以增加在`taskschd.msc`, 任务计划程序中, 添加任务, 勾选`使用最高权限运行`
   - 方式二, 脚本前增加, 以下代码, 参考[How to run vbs as administrator from vbs?](https://stackoverflow.com/a/17467283)

   ```vb
   If Not WScript.Arguments.Named.Exists("elevate") Then
   CreateObject("Shell.Application").ShellExecute WScript.FullName _
       , """" & WScript.ScriptFullName & """ /elevate", "", "runas", 1
   WScript.Quit
   End If
   'actual code
   ```

   如果此linux下的脚本不能用, 可使用windows下的脚本, 设置为`.bat`或`.cmd`格式, 管理员权限运行

   ```bat
   wsl -d Ubuntu -u root ip addr del $(ip addr show eth0 ^| grep 'inet\b' ^| awk '{print $2}' ^| head -n 1) dev eth0
   wsl -d Ubuntu -u root ip addr add 172.30.38.138/20 broadcast 172.30.47.255 dev eth0
   wsl -d Ubuntu -u root ip route add 0.0.0.0/0 via 172.30.32.1 dev eth0
   wsl -d Ubuntu -u root echo nameserver 172.30.32.1 ^> /etc/resolv.conf
   powershell -c "Get-NetAdapter 'vEthernet (WSL)' -IncludeHidden | Get-NetIPAddress | Remove-NetIPAddress -Confirm:$False; New-NetIPAddress -IPAddress 172.30.32.1 -PrefixLength 20 -InterfaceAlias 'vEthernet (WSL)'; Get-NetNat | ? Name -Eq WSLNat | Remove-NetNat -Confirm:$False; New-NetNat -Name WSLNat -InternalIPInterfaceAddressPrefix 172.30.32.0/20;"
   ```

## 脚本管理员权限

- bat文件, 参考[怎样自动以管理员身份运行bat文件? - 墨子 2200MHz的回答 - 知乎](https://www.zhihu.com/question/34541107/answer/137174053)

  ```bat
  @echo off
  cd /d "%~dp0"
  cacls.exe "%SystemDrive%\System Volume Information" >nul 2>nul
  if %errorlevel%==0 goto Admin
  if exist "%temp%\getadmin.vbs" del /f /q "%temp%\getadmin.vbs"
  echo Set RequestUAC = CreateObject^("Shell.Application"^)>"%temp%\getadmin.vbs"
  echo RequestUAC.ShellExecute "%~s0","","","runas",1 >>"%temp%\getadmin.vbs"
  echo WScript.Quit >>"%temp%\getadmin.vbs"
  "%temp%\getadmin.vbs" /f
  if exist "%temp%\getadmin.vbs" del /f /q "%temp%\getadmin.vbs"
  exit
  
  :Admin
  rem actual code
  ```

  一句命令版, 原理, 第一次`%1`为`""`, 第二次为`::`即注释, 为管理员权限, 适合没有参数的脚本

  ```bat
  %1 start "" mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd.exe","/c ""%~s0"" ::","","runas",1)(window.close)&&exit
  rem actual code
  ```

- vbs文件, 参考[How to run vbs as administrator from vbs?](https://stackoverflow.com/a/17467283)

  ```vb
  If Not WScript.Arguments.Named.Exists("elevate") Then
  CreateObject("Shell.Application").ShellExecute WScript.FullName _
      , """" & WScript.ScriptFullName & """ /elevate", "", "runas", 1
  WScript.Quit
  End If
  'actual code
  ```

## wsl2不能上网

- 有时重置网络时, 可能会把WSL的Nat删除, 需要重新设置一下, 在powershell中使用管理员权限执行以下代码

  ```powershell
  Get-NetNat | ? Name -Eq WSLNat | Remove-NetNat -Confirm:$False;
  New-NetNat -Name WSLNat -InternalIPInterfaceAddressPrefix 172.30.32.0/20;
  ```

----

## 参考

- [wsl2 docker 迁移](https://www.cnblogs.com/xzhg/p/14959196.html)
- [WSL2 中访问宿主机 Windows 的代理](https://zinglix.xyz/2020/04/18/wsl2-proxy)
- [WSL 配置指北：打造 Windows 最强命令行](https://segmentfault.com/a/1190000016677670)
- [drvfs fmask=111 breaks (e.g.) cmd.exe without workarounds?](https://github.com/microsoft/WSL/issues/3267#issuecomment-479414025)
- [static ip](https://github.com/MicrosoftDocs/WSL/issues/418#issuecomment-776861181)
- [给 WSL2 设置静态 IP 地址](https://zhuanlan.zhihu.com/p/380779630)
