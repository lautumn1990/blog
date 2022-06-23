---
title: 移动热点
tags: [ windows ]
categories: [ windows ]
key: wifi-hotspot
pageview: true
---

windows开启移动热点

<!--more-->

## 以前可以通过承载网络开启

```bat
netsh wlan show drivers
netsh wlan show wirelesscapabilities
netsh wlan set hostednetwork mode=allow ssid=GPNet key=GP123456
netsh wlan start hostednetwork
rem 关闭
netsh wlan stop hostednetwork
rem 删除
reg delete hklm\system\currentcontrolset\services\wlansvc\parameters\hostednetworksettings /v hostednetworksettings
```

## win10以后需要通过wifi-direct来进行开启

通过Windows设备共享 Internet 连接，将电脑转变为移动热点。 你可以共享 WLAN、以太网或手机网络数据连接。 如果你的电脑具有手机网络数据连接并且共享该连接，它将使用流量套餐数据。

1. 选择"开始"按钮，然后选择"设置>网络&">热点"。
1. 对于"从 共享我的 Internet 连接"，请选择要共享的 Internet 连接。
1. 对于"共享方式"，选择想要如何共享连接 - 通过Wi-Fi或蓝牙。 Wi-Fi速度通常更快且为默认值。
1. 选择"编辑>输入新的网络名称、密码和网络带>保存"。
1. 打开移动热点。
1. 若要在其他设备上进行连接，请转到该设备的 WLAN 设置、查找并选择网络名称、输入密码，然后进行连接。

但是如果暂时没有网络连接, 想通过移动热点组成局域网, 此方法就不行了
{:.info}

此时可以通过[WiFiDirectLegacyAPPlus](https://github.com/grzwolf/WiFiDirectLegacyAPPlus)的程序进行手动开启

```bat
.\WiFiDirectLegacyAPPlus.exe paramSSID paramPASS
```

默认是5G, 如果需要2.4G, 需要现在移动热点中进行一次2.4G设置, 然后再开启

可以通过bat文件把ssid和pass固定下来

```bat
@Echo off
Pushd "%~dp0"
.\WiFiDirectLegacyAPPlus.exe paramSSID paramPASS
popd
```

----

## 参考

- [将Windows电脑用作移动热点](https://support.microsoft.com/zh-cn/windows/%E5%B0%86windows%E7%94%B5%E8%84%91%E7%94%A8%E4%BD%9C%E7%A7%BB%E5%8A%A8%E7%83%AD%E7%82%B9-c89b0fad-72d5-41e8-f7ea-406ad9036b85)
- [WiFiDirectLegacyAPPlus](https://github.com/grzwolf/WiFiDirectLegacyAPPlus)
