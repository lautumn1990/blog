---
title: CentOS升级内核到指定版本
tags: [ linux ]
categories: [ linux ]
key: centos-update-kernel
pageview: true
---

CentOS升级内核到指定版本

<!--more-->

## 最新内核

CentOS7 自带的内核是非常老的3.10，这里某些功能需要新的内核支持，所以记录下升级内核的方法

参考[elrepo](https://www.elrepo.org)

```sh
# 导入公钥
rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
# 安装ELRepo
yum install -y https://www.elrepo.org/elrepo-release-7.el7.elrepo.noarch.rpm
```

然后可以查看下当前最新的lt长期支持版，和最新的ml主要分支，生产线当然是推荐lt

```sh
yum list available --disablerepo=* --enablerepo=elrepo-kernel

# 查看内核版本？
yum --enablerepo=elrepo-kernel  list | grep kernel*
```

然后就可以安装

```sh
# 安装LongTerm内核
yum --disablerepo=\* --enablerepo=elrepo-kernel install  kernel-lt.x86_64  -y
# 安装工具包
yum --disablerepo=\* --enablerepo=elrepo-kernel install kernel-lt-tools.x86_64  -y

# 安装最新内核ml
yum --disablerepo=\* --enablerepo=elrepo-kernel install  kernel-ml.x86_64  -y
# 安装工具包
yum --disablerepo=\* --enablerepo=elrepo-kernel install kernel-ml-tools.x86_64  -y
```

接下来可以查看内核的启动顺序

```sh
# 查看插入顺序，看看而已
awk -F \' '$1=="menuentry " {print i++ " : " $2}' /etc/grub2.cfg
# 查看启动顺序
grub2-editenv list
```

修改启动顺序

```sh
# 方法
grub2-set-default 'CentOS Linux (4.4.249-1.el7.elrepo.x86_64) 7 (Core)'

## 然后查看启动顺序
grub2-editenv list
```

接下来重启

```sh
reboot now
```

重启后可以查看最新的内核，有需要也可以删除内核

```sh
uname -r
yum remove $(rpm -qa | grep kernel | grep -v $(uname -r))
```

## 指定内核

首先从如下链接选择内核版本 <http://mirrors.coreix.net/elrepo-archive-archive/kernel/el7/x86_64/RPMS/>，然后通过`rpm -ivh xx`进行安装。

下面以`kernel-lt-4.4.249-1.el7.elrepo.x86_64`来举例

```sh
# https://www.cnblogs.com/erlou96/p/12904902.html
wget http://mirrors.coreix.net/elrepo-archive-archive/kernel/el7/x86_64/RPMS/kernel-lt-4.4.249-1.el7.elrepo.x86_64.rpm

# 安装内核
rpm -ivh kernel-lt-4.4.249-1.el7.elrepo.x86_64.rpm --force

# 查看插入顺序，看看而已
awk -F \' '$1=="menuentry " {print i++ " : " $2}' /etc/grub2.cfg

# 设置需要的内核最为启动项目
grub2-set-default 'CentOS Linux (4.4.249-1.el7.elrepo.x86_64) 7 (Core)'

# 然后查看启动顺序
grub2-editenv list

# 重启
reboot now

# 重启进入新的内核后执行下述代码可以删除老的内核
yum remove $(rpm -qa | grep kernel | grep -v $(uname -r))
```

----

## 参考

- [CentOS7 升级内核到指定版本](https://hicode.club/articles/2021/08/24/1629807082331.html)
