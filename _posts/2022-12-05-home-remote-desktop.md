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

----

## 参考

- [Win11家庭版 使用RDPWrap开启远程桌面](https://blog.csdn.net/qq_41242689/article/details/124715297)
