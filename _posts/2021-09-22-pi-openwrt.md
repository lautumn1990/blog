---
title: 树莓派通过docker安装openwrt
tags: [ pi, docker ]
categories: [ pi ]
key: pi-openwrt
pageview: true
---

## 树莓派通过docker安装openwrt

参考教程[在Docker 中运行 OpenWrt 旁路网关](https://mlapp.cn/376.html)

<!--more-->

- 打开网络混杂模式

`sudo ip link set eth0 promisc on`

- 创建网络, 结合自己的网络情况, 一定要使用有线网卡`eth0`{:.info}

`docker network create -d macvlan --subnet=192.168.0.0/24 --gateway=192.168.0.1 -o parent=eth0 macnet`

- 拉取镜像

`docker pull sulinggg/openwrt:latest`

- 创建并启动容器

`docker run --restart always --name openwrt -d --network macnet --ip 192.168.0.201 --privileged sulinggg/openwrt:latest /sbin/init`

- 进入容器并修改相关参数

进入容器
`docker exec -it openwrt bash`
修改网络
`vim /etc/config/network`, 将以下配置中的123, 改为实际的网段和ip地址

```config
config interface 'lan'
        option type 'bridge'
        option ifname 'eth0'
        option proto 'static'
        option ipaddr '192.168.123.100'
        option netmask '255.255.255.0'
        option ip6assign '60'
        option gateway '192.168.123.1'
        option broadcast '192.168.123.255'
        option dns '192.168.123.1'
```

重启网络
`/etc/init.d/network restart`

- 进入控制面板

自定义的ip地址, 端口80, 帐号 root/password

- 关闭dhcp

网络 - 接口 - Lan - 修改 中, 忽略此接口, 并保存应用

- 验证网络

通过将其他设备网络的网关设置为openwrt的网址, 查看是否能正常上网

- 主路由设置

如果可以正常上网, 配置主路由的dhcp网关为openwrt的网址

- 设备重新连接路由器

其他设备重新连接路由器, 获取新的网关地址

- 配置科学上网

通过服务passwall的配置, 配置订阅地址, 自动更新, 上网规则等设置

注意规则列表可能更新失败, 多下载几次, 或者将`jsdelivr.net`加入直连列表

备份规则`docker cp openwrt:/etc/config/passwall passwall.backup`, 不过可能版本之间不兼容

- 配置防火墙

镜像中的防火墙配置可能有问题, 通过注释掉网络 - 防火墙 - 自定义规则中的 `iptables -t nat -I POSTROUTING -j MASQUERADE`{:.success}, 可能会正常

- 持久化开启promisc混合模式, 创建macvlan访问openwrt

备份

```shell
cp /etc/network/interfaces /etc/network/interfaces.bak # 备份文件
vim /etc/network/interfaces # 使用 vim 编辑文件
```

文件配置

```config
auto eth0
up ip link set eth0 promisc on
iface eth0 inet manual

auto macvlan
iface macvlan inet static
    address 192.168.123.200
    netmask 255.255.255.0
    gateway 192.168.123.1
    dns-nameservers 192.168.123.1
    pre-up ip link add macvlan link eth0 type macvlan mode bridge
    post-down ip link del macvlan link eth0 type macvlan mode bridge
```

ubuntu20.04, 请使用以下方法
{:.info}

可以通过service服务的方式自动开启`promisc`, 参考[askubuntu中的回答](https://askubuntu.com/a/1356228/1386748)

```shell
    $ sudo bash -c 'cat > /etc/systemd/system/bridge-promisc.service' <<'EOS'
    [Unit]
    Description=Makes interfaces run in promiscuous mode at boot
    After=network-online.target

    [Service]
    Type=oneshot
    ExecStart=/usr/sbin/ip link set dev eth0 promisc on
    TimeoutStartSec=0
    RemainAfterExit=yes

    [Install]
    WantedBy=default.target
    EOS
    $ sudo systemctl enable bridge-promisc
```

访问macvlan, 临时方案
参考[docker openwrt 踩坑的几个小问题解决过程分享](https://www.right.com.cn/forum/thread-1048535-1-1.html)

```shell
ip addr del 192.168.123.2/24 dev eth0; \
ip link add macvlan link eth0 type macvlan mode bridge; \
ip addr add 192.168.123.2/24 dev macvlan; \
ip link set macvlan up; \

ip route del 192.168.123.0/24 dev eth0; \
ip route del default; \
ip route add 192.168.123.0/24 dev macvlan; \
ip route add default via 192.168.123.6 dev macvlan;
```

ubuntu持久化

参考[netplan Support macvlan/macvtap interfaces](https://bugs.launchpad.net/netplan/+bug/1664847/comments/19)

通过增加配置修改主机上网方式

```shell
vim /etc/networkd-dispatcher/routable.d/10-macvlan-interfaces.sh
```

文件内容

```shell
#! /bin/bash
ip link add macvlan link eth0 type macvlan mode bridge
```

增加配置

```shell
vim /etc/netplan/60-docker.yaml
```

```yaml
network:
    version: 2
    renderer: networkd
    ethernets:
        macvlan:
            addresses:
                - 192.168.0.200/24
            #gateway4: 192.168.0.201
            routes:
                - to: 0.0.0.0/0
                  via: 192.168.0.1
                  metric: 0
```

修改文件权限

`chmod o+x,g+x,u+x /etc/networkd-dispatcher/routable.d/10-macvlan-interfaces.sh`

应用配置

`netplan apply` 或者 `netplan --debug apply`

## 端口转发

效果和 ssh -L 差不多，都是本地访问远程端口。

通过 SOCKS 代理

```sh
socat TCP4-LISTEN:<本地端口>,reuseaddr,fork SOCKS:<代理服务器IP>:<远程地址>:<远程端口>,socksport=<代理服务器端口>
```

通过 HTTP 代理

```sh
socat TCP4-LISTEN:<本地端口>,reuseaddr,fork PROXY:<代理服务器IP>:<远程地址>:<远程端口>,proxyport=<代理服务器端口>
```

socat作为系统服务

```sh
sudo bash -c '
cat <<EOF >/usr/lib/systemd/system/socat.service
[Unit]
Description=Socat Serial Loopback
After=network.target

[Service]
Type=simple
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=socat

ExecStart=socat TCP4-LISTEN:<本地端口>,reuseaddr,fork SOCKS:<代理服务器IP>:<远程地址>:<远程端口>,socksport=<代理服务器端口>
Restart=always

[Install]
WantedBy=multi-user.target
EOF
'
# 其中ExecStart改为自己的命令
sudo systemctl daemon-reload
sudo systemctl enable --now socat
sudo systemctl status socat
```

----

## 参考

- [在Docker 中运行 OpenWrt 旁路网关](https://mlapp.cn/376.html)
- [在 Docker 中运行 OpenWrt 旁路网关 透明网关](https://baymax.tips/posts/53042.html)
- [使用 socat 通过 HTTP/SOCKS 代理进行端口转发](https://zhuanlan.zhihu.com/p/70979782)
- [新版瑞士军刀：socat](https://zhuanlan.zhihu.com/p/347722248)
