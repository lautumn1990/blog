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

----

## 参考

- [How to Disable ‘Show More Options’ from the Right Click Menu in Windows 11](https://appuals.com/disable-show-more-options-windows-11/)
- [Remove Show More Options entry from Windows 11 Context menu](https://www.thewindowsclub.com/remove-show-more-options-entry-from-windows-11-context-menu)
