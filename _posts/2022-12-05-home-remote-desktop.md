---
title: windows家庭版远程桌面连接
tags: [ windows ]
categories: [ windows ]
key: home-remote-desktop
pageview: true
---

windows家庭版 使用RDPWrap开启远程桌面

<!--more-->

## 下载RDPWrap

下载地址[RDPWrap](https://github.com/stascorp/rdpwrap/releases), 下载zip包即可

## 安装RDPWrap

解压压缩包，以`管理员身份`运行`install.bat`

## 下载配置文件

下载最新配置文件[rdpwrap.ini](https://raw.githubusercontent.com/sebaxakerhtc/rdpwrap.ini/master/rdpwrap.ini), 替换`C:\Program Files\RDP Wrapper\rdpwrap.ini`文件

重启服务

```bat
net stop termService
net start termService
```

## 查看是否安装成功

双击运行`RDPConf.exe`. 如果全绿则成功. 通过`RDPCheck.exe`, 检测是否可用

## 配置防火墙

如果远程连接不上, 可能是由于远程桌面是通过3389 TCP端口进行访问的，Windows Home版是默认关闭了这个端口的，需要手工去放行这个端口，不然还是不能使用远程桌面访问。

`wf.msc`打开防火墙配置查看, 也可以通过以下脚本添加

```bat
rem 添加防火墙规则
netsh advfirewall firewall add rule name="0-my-rdp" dir=in action=allow protocol=TCP localport=3389

rem 删除防火墙规则
netsh advfirewall firewall delete rule name="0-my-rdp"
```

## 开启配置文件自动更新

由于windows的更新, 可能导致老的配置文件不可用, 参考[autoupdate](https://github.com/asmtron/rdpwrap/blob/master/binary-download.md), 直接[下载](https://github.com/asmtron/rdpwrap/raw/master/autoupdate.zip)

需要修改两个位置, 由于国内可能连不上`github`和`google`的情况

- `rdpwrap_ini_update_github_x`的地址前都加上`https://ghproxy.com/`代理前缀
- `ping -n 1 google.com>nul`改为`ping -n 1 baidu.com>nul`

## 手动更新rdpwrap.ini

有时网上更新的`rdpwrap.ini`配置不及时, 找不到对应的配置文件, 这时可以通过以下工具自动找到对应版本的配置文件, 手动更新到`rdpwrap.ini`文件中, 下载地址[RDPWrapOffsetFinder](https://github.com/llccd/RDPWrapOffsetFinder/releases), 找到对应版本的`RDPWrapOffsetFinder.exe`运行即可.

直接双击运行可能会一闪而过, 此时可通过以下脚本运行

```bat
@echo off
echo.
set "BASE_PATH=C:\ls\RDPWrapOffsetFinder\64bit"
set "EXE_PATH=%BASE_PATH%\RDPWrapOffsetFinder.exe"
set "TEMP_PATH=%BASE_PATH%\sym"

:parse
    IF "%~1"=="" GOTO start_and_clean
    IF "%~1"=="-s" GOTO start_and_save

:start_and_save
    call "%EXE_PATH%"
    goto :end

:start_and_clean
    call "%EXE_PATH%"
    goto :clean

:clean
    if exist "%TEMP_PATH%" (
        rd /s /q "%TEMP_PATH%"
    )
    goto :end
:end
    echo.
    echo.
    echo.
    echo 请将以上内容保存到对应的rdpwrap.ini文件中
    echo.
    pause
```

----

## 参考

- [Win11家庭版 使用RDPWrap开启远程桌面](https://blog.csdn.net/qq_41242689/article/details/124715297)
- [RDPWrapOffsetFinder](https://github.com/llccd/RDPWrapOffsetFinder)
