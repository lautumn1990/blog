---
title: vmware上网
tags: [ vmware ]
categories: [ vmware ]
key: vmware-network
pageview: true
---

虚拟机安装CentOS无法上网

<!--more-->

- 查看是否启用nmcli

```sh
# 检查是否是disable
nmcli n
# 变为enable
nmcli n on
```

nmcli其他命令

```sh
# 修改配置文件的主机名
hostnamectl  set-hostname lautumn.cn

# 查看网卡信息
nmcli connection
nmcli con show
# 显示具体的网络接口信息
nmcli connection show eth33

# 显示所有设配状态
nmcli device status 
# 显示所有设配状态
nmcli device status 
# 显示所有活动连接
nmcli connection show --active 
# 删除一个网卡连接
nmcli connection delete eth0 
# 添加一个网卡连接
nmcli connection add type ethernet con-name eth0 ifname eno33554992

# 网络接口的启用与停用：
# 停用：
nmcli connection down eth0 
# 启用：
nmcli connection up eth0 
# 给eth0添加一个IP（IPADDR）
nmcli connection modify eth0 ipv4.addresses 192.168.0.58
# 给eth0添加一个子网掩码（NETMASK）
nmcli connection modify eth0 ipv4.addresses 192.168.0.58/24
# IP获取方式设置成手动（BOOTPROTO=static/none）
nmcli connection modify eth0 ipv4.method manual
# 添加一个ipv4
nmcli connection modify eth0 +ipv4.addresses 192.168.0.59/24
# 删除一个ipv4
nmcli connection modify eth0 -ipv4.addresses 192.168.0.59/24
# 添加DNS
nmcli connection modify eth0 ipv4.dns 114.114.114.114
# 删除DNS
nmcli connection modify eth0 -ipv4.dns 114.114.114.114
# 添加一个网关（GATEWAY）
nmcli connection modify eth0 ipv4.gateway 192.168.0.2
# 可一块写入：
nmcli connection modify eth0 ipv4.dns 114.114.114.114 ipv4.gateway 192.168.0.2

# 修改网卡名称
# 删除网卡连接
nmcli connection delete eno16777736
# 修改内核参数配置文件
vi /etc/default/grub 
# 植入内核
grub2-mkconfig -o /boot/grub2/grub.cfg 
# 重启
reboot
# 添加网卡
nmcli connection add type ethernet con-name eth0
```

- 重启配置

```sh
# 修改配置文件执行生效
systemctl restart network
# 或者
nmcli connection reload 
# 或者
systemctl restart NetworkManager
```

- 配置文件

`/etc/sysconfig/network-scripts/ifcfg-ens33`

```sh
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=static # 静态
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
NAME=ens33
UUID=56b8c748-7471-444f-b272-d33fc379210c
DEVICE=ens33
ONBOOT=yes

GATEWAY=192.168.205.2   # 这里的网关地址就是第二步获取到的那个网关地址
IPADDR=192.168.205.130  # 配置ip，在第二步已经设置ip处于192.168.205.xxx这个范围，我就随便设为130了，只要不和网关相同均可
NETMASK=255.255.255.0   # 子网掩码
DNS1=192.168.205.2      # dns服务器1，填写你所在的网络可用的dns服务器地址即可
DNS2=114.114.114.114    # dns服器2
```

禁用缓存

使用 VMWare 虚拟机，虚拟机启动后，会在虚拟机目录下建立一个与虚拟内存大小相同的 .vmem文件，例如：564db13c-c92d-3d3a-41a0-f62af7536fda.vmem。这个文件主要是将虚拟机内存的内容映射到磁盘，以支持在虚拟机的暂停等功能。

如果你不用或不经常需要暂停、快速启动的话，可以禁用该功能，以提高性能并增加硬盘寿命。

1. 虚拟机的配置中 Options 中，Advanced项(高级)，启用`Disable memory page trimming`，也就是`禁止内存剪裁`。
2. 虚拟机的朽置文件 即 .vmx 文件中，加入 `mainMem.useNamedFile= "FALSE"`。

----

### 参考

- [解决CentOS7虚拟机无法上网并设置CentOS7虚拟机使用静态IP上网](https://blog.csdn.net/a785975139/article/details/53023590)
- [nmcli命令与配置文件对应关系](https://www.cnblogs.com/djlsunshine/p/9733182.html)
