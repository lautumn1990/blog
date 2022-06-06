---
title: windows安装sshd服务
tags: [ windows ]
categories: [ windows ]
key: windows-sshd
pageview: true
---

## Windows安装OpenSSH服务

<!--more-->

下载地址, [Win32-OpenSSH](https://github.com/PowerShell/Win32-OpenSSH/releases)

下载并解压`OpenSSH-Win64.zip`文件, 如解压到`C:\Program Files\OpenSSH`

管理员权限打开`powershell`, 进入解压文件夹, 安装方法参考[Install Win32 OpenSSH](https://github.com/PowerShell/Win32-OpenSSH/wiki/Install-Win32-OpenSSH)

```powershell
# 安装
powershell.exe -ExecutionPolicy Bypass -File install-sshd.ps1
# 创建防火墙规则
New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
# 低版本windows的请使用
netsh advfirewall firewall add rule name=sshd dir=in action=allow protocol=TCP localport=22

# 启动
net start sshd
#修改为自动启动
Set-Service sshd -StartupType Automatic
```

### 配置`sshd_config`

文件位置
%programdata%\ssh\sshd_config

```conf
# 端口号：
Port 22
# 密钥访问：
PubkeyAuthentication yes
# 密码访问 禁用：
PasswordAuthentication no
# 空密码 禁用：
PermitEmptyPasswords no
```

### 配置`authorized_keys`信任的公钥

从`v7.7.2.2`开始, `%programdata%/ssh/administrators_authorized_keys`, 以前版本文件位置`%userprofile%/.ssh/authorized_keys`

如果还是使用`%userprofile%/.ssh/authorized_keys`文件

修改`sshd_config`

```conf
# 注释掉以下两行
Match Group administrators
       AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

### 使用其他shell启动

[参考](https://github.com/PowerShell/Win32-OpenSSH/wiki/DefaultShell)

#### 使用powershell

```powershell
New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -Value "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -PropertyType String -Force
New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShellCommandOption -Value "/c" -PropertyType String -Force
```

#### 使用cmder作为默认的shell

下载cmder, [下载地址](https://cmder.net/), 解压到到指定位置, 如 `c:\ls\cmder`

```powershell
$cmderpath="c:\ls\cmder"
$cmderstartshell="$cmderpath\start-cmder.bat"
$cmderinit="$cmderpath\vendor\init.bat"
$value="
@echo off
cmd.exe /k $cmderinit
"

set-content -path $cmderstartshell -value $value

New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -Value "$cmderstartshell" -PropertyType String -Force
```

## 安装内网穿透

参考[frp](/linux/2022/02/16/proxy-frp.html)

参考以下用法配置windows服务

```sh
# 使用nssm安装frpc服务
nssm install frpc

# 修改 application
# path: <fullpathname>\frpc.exe
# arguments: -c frpc.ini

# 启动服务
net start frpc
```

## nssm做系统服务

[官网](https://www.nssm.cc/download), 下载地址[nssm-2.24-101-g897c7ad.zip](https://www.nssm.cc/ci/nssm-2.24-101-g897c7ad.zip)

输入nssm install <服务名>，按回车进入到设置界面

```sh
Service name：服务名
Application：应用**
Path：设置为服务启动的文件路径 （点击…选择路径）
Startup directory：启动目录 （Path选好后会自带出来）
Arguments：参数 （可不设）
Details：详情
    Display name：显示名称
    Dsecription：描述
    Startup type：启动类型
        Automatic-自动
        Automatic(Delayed Start)-自动(延迟启动)
        Manual-手动 
        Disabled-禁用
I/O：
    Input(stdin)：输入日志位置 （可不设）
    Output(stdout)：输出日志位置
    Error(stderr)：错误日志位置
```

nssm常见用法

```sh
nssm install <服务名> 安装服务
nssm remove <服务名> 删除服务
nssm remove <服务名> confirm 删除服务确定
nssm edit <服务名> 修改服务（显示界面修改）
nssm start <服务名> 启动服务
nssm stop <服务名> 停止服务
nssm restart <服务名> 重启服务
```

----

## 参考

- [Windows sshd密钥登陆失败的解决方案](https://blog.csdn.net/Franklins_Fan/article/details/119324249)
- [Install Win32 OpenSSH](https://github.com/PowerShell/Win32-OpenSSH/wiki/Install-Win32-OpenSSH)
- [使用nssm安装Windows服务](https://blog.csdn.net/omaidb/article/details/124923275)
- [将frpc注册成windows系统服务](https://blog.csdn.net/qq_37696855/article/details/122849406)
