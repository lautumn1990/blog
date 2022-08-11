---
title: VPN网络LAN共享
tags: [ linux, network ]
categories: [ linux ]
key: vpn-share
pageview: true
---

有时需要不止一台电脑进行公司VPN的访问, 此时可将某台电脑作为中转节点, 进行中转访问

<!--more-->

## 配置VPN

首先登录VPN账户, 完成VPN的配置

## 路由方式

1. VPN电脑配置路由转发, 假设ip地址是192.168.0.119

   ```powershell
   # 开启路由转发
   # 全部设置
   Set-NetIPInterface -Forwarding Enabled
   # 全部取消
   Set-NetIPInterface -Forwarding Disabled
   
   # 假设电脑的IP地址段是192.168.0.0/24, IP地址是192.168.0.119
   # 设置nat
   Get-NetNat | ? Name -Eq zero | Remove-NetNat -Confirm:$False;
   New-NetNat -Name zero -InternalIPInterfaceAddressPrefix 192.168.0.0/24;
   ```

1. 其他windows电脑

   ```powershell
   # 查询所有的网络接口名
   netsh interface ipv4 show interfaces
   # 配置ip地址为手动, 如"本地连接"
   netsh interface ip set address name="本地连接" source=static addr=192.168.0.130 mask=255.255.255.0 gateway=192.168.0.119 1
   netsh interface ip set dns name="本地连接" source=static addr=1.1.1.1
   netsh interface ip add dns name="本地连接" source=static addr=114.114.114.114
   # 设置mtu
   # 由于windows vpn默认是1400的MTU而且不好更改, 所以建议在其他电脑上更改
   # 查询
   netsh interface ipv4 show subinterfaces
   # 设置
   netsh interface ipv4 set subinterface "本地连接" mtu=1400 store=active
   # 持久
   netsh interface ipv4 set subinterface "本地连接" mtu=1400 store=persistent
   ```

   参考[静态ip地址](/windows/2022/06/19/static-ip)

1. linux 设置 MTU

   ```shell
   # ubuntu
   # 查看
   ip a | grep mtu
   # 临时生效
   ifconfig ens33 mtu 1000 up
   # 永久生效DHCP
   sudo vi /etc/dhcp/dhclient.conf
   # 在request行上追加
   interface "ens33" {
     default interface-mtu 1000;
     supersede interface-mtu 1000;
   }
   # 重启
   sudo service networking restart
   # 或者
   sudo ifup ens33

   # 永久生效 静态IP
   sudo vi /etc/network/interfaces
   # 添加
   post-up /sbin/ifconfig ens33 mtu 1000 up

   # netplan
   # /etc/netplan/10-ens7.yaml
   network:
        version: 2
        renderer: networkd
        ethernets:
            ens7:
                mtu: 1000
                addresses: [192.168.0.29/24]
                gateway4: 192.168.0.1
                dhcp4: no
                nameservers:
                    addresses: [192.168.0.1,192.168.0.2]
   ```

   ```shell
   # centos
   sudo vi /etc/sysconfig/network-scripts/ifcfg-eth0
   # 添加
   MTU=1000
   # 重启
   ifdown eth0
   ifup eth0
   ```

但是安卓和iOS不能通过此种方式进行修改, 所以需要其他的方式

## 代理方式

### v2ray配置

在VPN电脑上配置v2ray的socks5代理

[下载v2rayN](https://github.com/2dust/v2rayN/releases)

添加自定义配置

添加`vpoint_socks_vmess.json`模板的配置, 修改配置如下

```json
{
  "log": {
    "loglevel": "warning"
  },
  "inbounds": [{
    "port": 1080,
    "listen": "0.0.0.0",
    "protocol": "socks",
    "settings": {
      "auth": "noauth",
      "udp": true,
      "ip": "0.0.0.0"
    }
  }],
  "outbounds": [{
    "protocol": "freedom",
    "settings": {},
    "tag": "direct"
  }],
  "policy": {
    "levels": {
      "0": {"uplinkOnly": 0}
    }
  }
}
```

### clash配置

```yaml
port: 7890
socks-port: 7891
redir-port: 7892
allow-lan: true
mode: Rule
log-level: info
external-controller: '127.0.0.1:9090'
cfw-conn-break-strategy:
    proxy: all
    profile: true
    mode: true
cfw-latency-timeout: 5000
proxies:
  - name: aorenvpn
    type: socks5
    server: 192.168.0.119
    port: 1080
proxy-groups:
  - name: Proxy
    type: select
    proxies:
      - aorenvpn
  - name: "Final"
    type: select
    proxies:
      - "Proxy"
rules:
  - "MATCH,Final"
```

----

## 参考

- [How to change MTU size in Linux](https://linuxhint.com/how-to-change-mtu-size-in-linux/)
