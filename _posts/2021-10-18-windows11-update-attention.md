---
title: windows11更新需要注意的地方
tags: [ windows ]
categories: [ windows ]
key: windows11-update-attention
pageview: true
---

Windows 11是由微软公司（Microsoft）开发的操作系统，应用于计算机和平板电脑等设备。于2021年6月24日发布，2021年10月5日发行。

<!--more-->

## 升级windows11

1. 兼容性检查

    [windows11介绍](https://www.microsoft.com/zh-cn/windows/windows-11)

    [下载电脑健康状况检查应用](https://aka.ms/GetPCHealthCheckApp)

2. 获取windows11

    [下载 Windows 11 地址](https://www.microsoft.com/zh-cn/software-download/windows11)

    直接通过[下载 Windows 11 安装助手 安装](https://go.microsoft.com/fwlink/?linkid=2171764)

## 升级之后产生的问题

### 右键菜单折叠

问题, 不能使用`右键`+`E`刷新, 不能使用`右键`+`W`+`F`新建文件夹, 不能直接显示扩展菜单

解决步骤

- 打开 `删除折叠` -> `重启explorer`(也可能自动重启, 不需要此步骤)
- 折叠 `恢复折叠`

#### 删除折叠

```bat
reg add HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32 /ve /d "" /f
```

#### 重启explorer

```bat

taskkill /f /im explorer.exe
start explorer.exe

```

#### 恢复折叠

```bat
reg delete HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2} /f
```

### 删除自带的微软拼音输入法

`设置` -> `时间和语言` -> `语言 & 区域` -> `中文...` -> `选项` -> `键盘` -> `微软拼音` -> `选项删除`

### 查看激活信息, 和win10一样

```bat
rem 查看过期时间
slmgr.vbs -xpr
rem 查看激活详情
slmgr.vbs -dlv
```

其他命令

```bat
rem 卸载当前产品密钥
slmgr.vbs /upk
rem 安装产品密钥，也可以说是替换现有密钥
slmgr.vbs /ipk W269N-WFGWX-YVC9B-4J6C9-T83GX
rem 设置设置KMS服务器IP地址及端口
slmgr.vbs /skms zh.us.to
rem 开始利用安装的秘钥尝试在线激活Windows，如果我没有理解错的话，ato就是attempt online的缩写
slmgr.vbs /ato
rem 这个命令是从注册表中清除产品密钥信息，这是一项安全举措，清除之后那些声称读取产品密钥的软件就读不到了。这个命令相当重要，尤其在企业内部
slmgr.vbs -cpky
rem 导入OEM证书，后面为OEM证书的路径
slmgr.vbs -ilc
```

### 打开控制面板

`win` + `r` 打开运行框, 管理员权限运行, `ctrl` + `shift` + `enter`

```bat
rem 控制面板
control
rem 快速打开windows功能
optionalfeatures

rem 快速安装telnet客户端
pkgmgr /iu:"TelnetClient"
rem 卸载
pkgmgr /uu:"TelnetClient"

rem 查看功能模块名称, 管理员运行
dism /online /Get-Features

rem 快速打开hosts
C:\Windows\System32\drivers\etc\hosts
rem 或者win+r
drivers
rem 然后打开etc文件夹, hosts文件
```

### windows setx

setx path会展开的问题

参考[How do I add to the Windows PATH variable using setx? Having weird problems](https://stackoverflow.com/a/59571160)

值中包含变量问题[How to setx without expanding variables?](https://stackoverflow.com/a/25180587/9304033)

```bat
rem 以下命令会出现问题
setx PATH "%PATH%;<new-path>"

rem system path
for /f "usebackq tokens=2,*" %A in (`reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH`) do set SYSPATH=%B
setx PATH "%SYSPATH%;C:\path1;C:\path2" /M

rem user path
for /f "usebackq tokens=2,*" %A in (`reg query HKCU\Environment /v PATH`) do set USERPATH=%B
setx PATH "%USERPATH%;C:\path3;C:\path4"

rem 如果值中有变量, 去掉引号通过^转义
setx var1 ^%nested_var^%\dir
setx var1 ^"^%nested_var^%\dir space^"
rem 如果是bat文件中, 通过%转义
setx var1 %%nested_var%%\dir
setx var1 "%%nested_var%%\dir space"
```

### 删除设备和驱动器下多余的项目

```bat
for /f "tokens=*" %A in ('reg query HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace') do reg delete %A /f
```

windows快捷命令, [shell](/windows/2021/09/10/windows-shell-commands.html)
windows快捷命令, [完整版](/windows/2021/12/27/windows-keyboard-shortcuts.html)

----

## 参考

- [How to Disable ‘Show More Options’ from the Right Click Menu in Windows 11](https://appuals.com/disable-show-more-options-windows-11/)
- [Remove Show More Options entry from Windows 11 Context menu](https://www.thewindowsclub.com/remove-show-more-options-entry-from-windows-11-context-menu)
- [Windows软件授权管理工具slmgr命令(激活系统)](https://jingyan.baidu.com/article/25648fc17b5d669191fd0091.html)
