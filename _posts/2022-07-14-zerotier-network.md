---
title: Zerotier局域网
tags: [ linux, network ]
categories: [ linux ]
key: zerotier-network
pageview: true
---

异地组建局域网

<!--more-->

## 简介

### 目前主流的组网方案有

- 端口流量转发：Frp转发，花生壳等
- 虚拟局域网：Zerotier，N2N等

### 优缺点

- **Frp**是一款非常好用的内网穿透软件，非常稳定，但是Frp的有两个问题，
  1. 只能提供`端口级别`的内网穿透，如果只需要服务固定端口，比如22端口的SSH，还是很好用了，但是如果需要访问其它端口，需要独立映射。
  2. 需要`云服务器`来实现流量转发，而高带宽的云服务器价格较贵，花生壳提供类似的商业服务。

- **Zerotier**采用另一种策略，每台机器上安装一个虚拟网卡，实现虚拟局域网，这样处于公网中的机器也能够像在局域网中一样访问服务器，十分方便，并且它支持P2P，即便没有私有云服务器，也能够进行内网穿透，Zerotier是由一款商业公司维护的软件，技术方面的可​靠性还是不错的。当然，Zerotier也有它的问题
  1. 某些网络环境无法实现P2P穿透，这种情况，Zerotier就会采用流量转发，但是Zerotier的服务器在国外，且有带宽限制，会导致连接速度慢，甚至无法连接。
  2. 每台主机需要安装额外的客户端。这样扩展不方便，如果多台服务器，每一台服务器都需要安装一遍。

### 对比

- Frp适合有云服务器，低带宽需求，只需要固定端口服务（如SSH，FTP等）的用户。
- Zerotier适合高带宽（如远程桌面，需要支持P2P）需求，需要灵活访问（端口服务较多，或者不固定）的用户。

## 网络架构示例

```s
+-------------------------------+              +-------------------------------+
|  NET1: 192.168.100.0/24       |              |  NET2: 192.168.200.0/24       |
|                               |              |                               |
| +---------------------------+ |              | +---------------------------+ |
| |Host11                     | |              | |Host21                     | |
| |OS: Linux                  | |              | |OS: Windows                | |
| |LAN IP: 192.168.100.11     | |              | |LAN IP: 192.168.200.21     | |
| |Docker Net: 172.11.0.1/16  | |              | |Docker Net: 172.21.0.1/16  | |
| |Zerotier IP: 192.168.192.11| |  <-------->  | |Zerotier IP: 192.168.192.22| |
| +---------------------------+ |              | +---------------------------+ |
|                               |              |                               |
| +---------------------------+ |              | +---------------------------+ |
| |Host12                     | |              | |Host22                     | |
| |OS: Linux                  | |              | |OS: Linux                  | |
| |LAN IP: 192.168.100.12     | |              | |LAN IP: 192.168.200.22     | |
| |Docker Net: 172.12.0.1/16  | |              | |Docker Net: 172.22.0.1/16  | |
| +---------------------------+ |              | +---------------------------+ |
+-------------------------------+              +-------------------------------+

```

### 说明

1. NET1和NET2位于两个局域网内
1. NET1和NET2中分别只有一台主机(Host11/Host21)安装zerotier, 并加入zerotier虚拟局域网中
1. 共7个网段, 2个局域网网段, 1个zerotier网段, 4个docker网段. 如果要保证互通, 需要保证网段互不相同
1. Host11和Host21是两个局域网连通的关键

### 优点

1. 扩展方便：一个网段只需要一台主机安装zerotier即可，新增机器只需增加路由表即可。
1. IP一致性：无论在局域网内外，都使用局域网的ip访问主机。

### 安装

- [管理面板](https://my.zerotier.com/), 注册登录, 邮箱激活
- [下载地址](https://www.zerotier.com/download/)

1. **linux安装**

   ```sh
   curl -s https://install.zerotier.com | sudo bash
   sudo zerotier-cli join xxxxxxxxxxxxxxx
   ```

1. **windows安装**

   [下载](https://download.zerotier.com/dist/ZeroTier%20One.msi), 安装, 加入网络, `join new network`->`xxxxxxxxxxxxxxx`

1. 在[管理面板](https://my.zerotier.com/)中新建`create a network`, 选择`NETWORK ID`

   - Members下, 勾选加入的设备
   - Advanced中设置zerotier网段, 如`192.168.192.*`
   - `Managed Routes`, 中添加
     - `172.11.0.1/16` via `192.168.192.11`
     - `172.12.0.1/16` via `192.168.192.11`
     - `172.21.0.1/16` via `192.168.192.21`
     - `172.22.0.1/16` via `192.168.192.21`
     - `192.168.100.0/24` via `192.168.192.11`
     - `192.168.200.0/24` via `192.168.192.21`

### Host11配置

#### 开启路由转发

```sh
#临时生效
echo "1" > /proc/sys/net/ipv4/ip_forward
#永久生效，需要修改sysctl.conf，然后执行sysctl -p
net.ipv4.ip_forward = 1
```

#### 防火墙设置

```sh
#这里zt3jn72ets为zerotier虚拟网卡
sudo iptables -A FORWARD -i zt3jn72ets -j ACCEPT
sudo iptables -A FORWARD -o zt3jn72ets -j ACCEPT
sudo iptables -t nat -A POSTROUTING  ! -o lo -j MASQUERADE
#保存iptable规则
sudo apt-get install iptables-persistent
sudo sh -c "iptables-save > /etc/iptables/rules.v4"
```

#### docker网段路由

```sh
#添加静态路由表，docker网络ip段需要不同，指向docker宿主机ip.
#临时方法
# sudo ip route add 172.11.0.0/16 via 192.168.100.11
sudo ip route add 172.12.0.0/16 via 192.168.100.12
# sudo ip route del 172.17.0.0/16 #删除路由
```

##### route 持久化

- ubuntu, 在`/etc/netplan/xxxx.yaml`中添加route

  ```yaml
  network:
    version: 2
    renderer: networkd
    ethernets:
      eth0:
        dhcp4: true
        routes:
        # 本机可以不加
        # - to: 172.11.0.0/16
        #   via: 192.168.100.11
        - to: 172.12.0.0/16
          via: 192.168.100.12
  ```

- centos

  ```sh
  # /etc/sysconfig/network-scripts/route-eth0
  # 本机可以不加
  # 172.11.0.0/16 via 192.168.100.11 dev eth0
  172.12.0.0/16 via 192.168.100.12 dev eth0
  ```

### 不同主机docker配置

为每一台主机修改默认docker桥接网（或创建新的网络），子网不能重复，避免路由冲突

```sh
# 修改默认docker0的ip,不同主机需要不一样
vim /etc/docker/daemon.json
# {"bip": "172.11.0.1/16"}
sudo systemctl daemon-reload
sudo systemctl restart docker
# 或者使用新的网桥
# docker network create --driver bridge --subnet=172.20.1.0/24 dockerlan1
# docker run -d --name nginx --network dockerlan1 nginx
```

### Host21配置

#### windows开启路由转发

参考[How can I enable packet forwarding on Windows?](https://serverfault.com/a/929089)

在windows中管理员权限运行`powershell`, 执行

```powershell
# 查询
Get-NetIPInterface | select ifIndex,InterfaceAlias,AddressFamily,ConnectionState,Forwarding | Sort-Object -Property IfIndex | Format-Table

# 设置
Set-NetIPInterface -ifindex <required_interface_index_from_table> -Forwarding Enabled
# 需要设置本地连接/WLAN和ZeroTier One

# 全部设置
Set-NetIPInterface -Forwarding Enabled
# 全部取消
Set-NetIPInterface -Forwarding Disabled

# 开启RemoteAccess, 所有的服务都会开启Forwarding, 效果和`Set-NetIPInterface -Forwarding Enabled`一样
# Set-Service RemoteAccess -StartupType Automatic; Start-Service RemoteAccess
```

#### 开启Nat路由转发

在windows中管理员权限运行`powershell`, 执行

```powershell
Get-NetNat | ? Name -Eq zero | Remove-NetNat -Confirm:$False;
New-NetNat -Name zero -InternalIPInterfaceAddressPrefix 192.168.192.0/24;
```

#### 开启windows主机访问docker镜像

由于windows主机无法通过`Container IP`直接访问docker中的服务, 如果没有此需求可以不安装以下服务

参考[[Docker]Mac&Windows访问Docker容器IP](https://blog.csdn.net/wenjun_xiao/article/details/106320242)

>##### 安装客户端
>
>如果是Windows系统，安装的是`Docker Desktop for Windows`，那么可以下载最新的[docker-connector-win-x86_64.zip](https://github.com/wenjunxiao/mac-docker-connector/releases/)解压。
>
>首次安装还需要安装驱动驱动[tap-windows](http://build.openvpn.net/downloads/releases/latest/tap-windows-latest-stable.exe)。
>
>在配置文件options.conf按照以下格式写入需要访问的bridge子网
>
>```sh
># addr 192.168.251.1/24
>route 172.21.0.0/16
>```
>
>可以通过脚本`start-connector.bat`直接启动应用，也可以通过脚本`install-service.bat`把应用安装成服务，然后通过脚本`start-service.bat`启动服务。
>
>##### Docker启动
>
>docker端运行`wenjunxiao/mac-docker-connector`（已修改为desktop-docker-connector），需要使用host网络，并且允许NET_ADMIN
>
>```sh
>docker run -it -d --restart always --net host --cap-add NET_ADMIN --name desktop-connector wenjunxiao/desktop-docker-connector
>```
>
>##### 其他机器
>
>参考[[Docker]Mac&Windows访问Docker容器IP](https://blog.csdn.net/wenjun_xiao/article/details/106320242), 安装[docker-accessor](https://github.com/wenjunxiao/mac-docker-connector/releases/)

#### 增加路由表

```bat
rem 管理员
route add 172.22.0.0 mask 255.255.0.0 192.168.200.22
rem 永久生效
rem route add 172.22.0.0 mask 255.255.0.0 192.168.200.22 -p
rem 删除 
rem route delete 172.22.0.0 mask 255.255.0.0 192.168.200.22
rem 查看
rem route print
```

### Host12路由配置

```sh
# 通过Host11转发
sudo ip route add 192.168.200.0/24 via 192.168.100.11
sudo ip route add 172.11.0.0/16 via 192.168.100.11
sudo ip route add 172.21.0.0/16 via 192.168.100.11
sudo ip route add 172.22.0.0/16 via 192.168.100.11
# 或者使用192.168.100.11充当默认网关
sudo ip route replace default via 192.168.100.11 dev eth0
# 路由持久化 参考Host11配置
```

### Host22路由配置

```sh
# 通过Host21转发
sudo ip route add 192.168.200.0/24 via 192.168.100.21
sudo ip route add 172.11.0.0/16 via 192.168.100.21
sudo ip route add 172.12.0.0/16 via 192.168.100.21
sudo ip route add 172.21.0.0/16 via 192.168.100.21
# 或者使用192.168.200.21充当默认网关
sudo ip route replace default via 192.168.200.21 dev eth0

# 路由持久化 参考Host11配置
```

通过以上设置, 异地的局域网就可以组成一个`大的局域网`{:.info}进行无障碍的通信了

其他通过VPS的操作可参考[基于Zerotier的虚拟局域网（内网穿透方案）](https://zhuanlan.zhihu.com/p/383471270)

## 站内相关连接

- [ip命令](/linux/2022/06/19/linux-ip.html)

## zerotier命令

```sh
# 安装
curl -s https://install.zerotier.com | sudo bash
# 查询节点：
zerotier-cli peers
# 如果是RELAY则是p2p失败, 网速较慢

# 加入网络(必须使用root权限):
sudo zerotier-cli join xxxxxxxxxxxxxxxx

# 离开网络：
zerotier-cli leave xxxxxxxxxxx

# 加入moon(自建节点)
zerotier-cli orbit xxxxxxx yyyyyyyy

# 离开moon
zerotier-cli deorbit xxxxxxxx

# 重启 zerotier-one
sudo killall -9 zerotier-one

# 重新启动moon服务器
systemctl restart zerotier-one

# zerotier-one目录
cd /var/lib/zerotier-one

# 检查应用的配置：
systemctl cat zerotier-one

# 编辑配置：
sudo systemctl edit zerotier-one --full

# ----------------------------------------------

# moon服务器, 启动moon服务器不需要加入节点
# 配置moon服务器步骤
cd /var/lib/zerotier-one

sudo zerotier-idtool initmoon /var/lib/zerotier-one/identity.public > moon.json
# 编辑配置文件
# 如果要修改端口
# 需要创建local.conf
# {"settings":{"primaryPort":9999}}
# 编辑 moon.json 文件，写入根服务器IP "stableEndpoints": [ "10.0.0.2/9993"], 注意是斜杠//////////
# 生成 .moon 文件
sudo zerotier-idtool genmoon moon.json
# 移动 .moon 文件到 moons.d 文件夹中(需要手动创建该文件夹)
sudo mv 000000deadbeef00.moon /var/lib/zerotier-one/moons.d/
# 重启 zerotier-one
systemctl restart zerotier-one

# 常规节点
# 将根服务器添加到常规节点
# moon服务器的安全性紧靠moon id保证, 任何人都可以通过moon id下载moon配置, 进而通过代理访问自己的zerotier局域网
sudo zerotier-cli orbit deadbeef00 deadbeef00
```

----

## 参考

- [基于Zerotier的虚拟局域网（内网穿透方案）](https://zhuanlan.zhihu.com/p/383471270)
- [基于Zerotier的虚拟局域网（VPS中继优化）](https://zhuanlan.zhihu.com/p/431770438)
- [[Docker]Mac&Windows访问Docker容器IP](https://blog.csdn.net/wenjun_xiao/article/details/106320242)
