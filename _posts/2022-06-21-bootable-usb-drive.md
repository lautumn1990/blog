---
title: 制作启动U盘
tags: [ linux ]
categories: [ linux ]
key: bootable-usb-drive
pageview: true
---

手头有一个移动固态硬盘, 但是如果制作成启动盘的话, 需要频繁的格式化, 比较麻烦, 这时可以通过[ventoy](https://github.com/ventoy/Ventoy)这个工具进行启动盘制作, 同时还不影响U盘的日常使用。

<!--more-->

## ventoy

简单来说，Ventoy是一个制作可启动U盘的开源工具。
有了Ventoy你就无需反复地格式化U盘，你只需要把 `ISO/WIM/IMG/VHD(x)/EFI` 等类型的文件直接拷贝到U盘里面就可以启动了，无需其他操作。
你可以一次性拷贝很多个不同类型的镜像文件，Ventoy 会在启动时显示一个菜单来供你进行选择

![ventoy](/assets/images/2022/06/bootable-usb-drive-ventoy.png){:.image--xxl.rounded.shadow}

### 制作启动盘

[下载地址](https://github.com/ventoy/Ventoy/releases), 解压之后双击启动`Ventoy2Disk.exe`, 配置选项-->分区类型建议选`MBR`, 如果做其他系统盘, 在分区设置中在磁盘最后保留一段空间, 比如`100GB`

然后点击安装即可, 这时会清空U盘或移动硬盘中的所有数据, 一定要先`备份文件`

这时U盘或者移动硬盘会自动分为两个区, (如果保留会在硬盘最后保留一段空间, 但是不会自动初始化)

- 第一个分区会被格式化为exFAT格式, 之后的`ISO/WIM/IMG/VHD(x)/EFI`格式文件, 只需要放在此分区底下即可, 会自动搜索. 同时此分区也可以当做正常的数据盘.

- 第二个分区（32MB的VTOYEFI分区）为启动分区, 默认不会在此电脑的系统内显示.

- 第三段空间可以再新建多个分区, 这些不影响ventoy的启动

### 制作linux to go

将下好的linux镜像(如ubuntu)丢到ventoy中的第一个分区, 按照正常的步骤安装即可. 注意, 一定要放在当前U盘或者硬盘的最后一段空间中, 不要放错, 比如之前设置的是100GB, 看准大小. 新建ext4分区, 并设置挂载点为`/`, `/boot/efi`也为此硬盘分区

### 通过vmware进行linux to go的安装

由于安装linux to go的过程中, 可能会遇到问题需要联网解决, 同时双系统切换也比较麻烦, 这时可以通过vmware, 在虚拟机里进行安装.

`查看物理磁盘`

```bat
wmic diskdrive get Model,Name,SerialNumber,Size,Status
wmic diskdrive list brief
```

- 管理员启动vmware
- 新建虚拟机
- 稍后安装系统, 选择对应的linux版本
- 设置安装位置, cpu, 内存, 网络等
- 虚拟磁盘(NVMe), 使用物理磁盘(需要管理员权限), 选择对应的物理磁盘, 使用整个磁盘
- 然后开启虚拟机即可

同时也可以利用已经`存在的虚拟机`

- 在设置中添加磁盘, 也选择物理磁盘, 选择对应的物理磁盘, 使用整个磁盘
- 但是启动的时候需要在电源选项中选择`打开电源时进入固件`(如此选项不可选, 可先关闭虚拟机电源)
- 这时进入虚拟机的BIOS, 调整启动顺序即可

### 配置Ventoy引导菜单

这时安装的linux系统是无法引导进入的, Ventoy的菜单里面只会显示ISO文件的启动项

#### 查看`/etc/fstab`文件

这时可以通过`DiskGenius`访问移动硬盘安装linux的ext4分区, 将`/etc/fstab`复制出来, 找到根目录的硬盘UUID

如果没有`DiskGenius`, 也可以通过wsl2, 挂载此硬盘的ext4分区, 进行访问`/etc/fstab`文件, 命令参考

```bat
wmic diskdrive list brief

rem If a disk has a single partition, you can mount it using the command:
wsl --mount [DiskPath]
wsl --mount \\.\PHYSICALDRIVE0

rem Otherwise, if you wish to mount a particular partition, you would use the commands:
wsl --mount [DiskPath] --partition [PartitionNumber]
wsl --mount \\.\PHYSICALDRIVE0 --partition 1

rem Finally, to unmount a disk from WSL 2, you would use the following commands:
wsl --unmount [Diskpath]
wsl --unmount \\.\PHYSICALDRIVE0

rem By default, wsl --mount will attempt to mount the partition using ext4. To specify a different filesystem, you can use the following command:
wsl --mount [Diskpath] -p [PartitionNumber] -t [filesystem_type]
wsl --mount \\.\PHYSICALDRIVE0 -p 1 -t vfat
```

如第三块硬盘的第三个分区

```bat
rem 硬盘从0开始 分区从1开始
wsl --mount \\.\PHYSICALDRIVE2 --partition 3
rem 卸载
wsl --unmount \\.\PHYSICALDRIVE2
```

如果`/etc/fstab`, 中有`/boot/efi`, 同时因为此分区启动不了, 可将此行删掉, 重新启动

```conf
# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
# / was on /dev/nvme0n2p3 during installation
UUID=48a196ba-4155-4b4c-b260-cabdabe8e955 /               ext4    errors=remount-ro 0       1
# /boot/efi was on /dev/nvme0n1p2 during installation
UUID=A21C-47AE  /boot/efi       vfat    umask=0077      0       1
/swapfile                                 none            swap    sw              0       0
```

#### 编辑`ventoy/ventoy_grub.cfg`配置文件

在U盘/移动硬盘的第一个分区下创建`ventoy`文件夹, 在此文件夹下创建`ventoy_grub.cfg`文件, 编辑如下内容

```conf
menuentry "ubuntu22.04 on Sandisk" --class=custom {
    set root=($vtoydev,msdos3)
    linux /boot/vmlinuz-5.15.0-25-generic root=UUID=48a196ba-4155-4b4c-b260-cabdabe8e955
    initrd /boot/initrd.img-5.15.0-25-generic
    boot
}
menuentry '<-- Return to previous menu [Esc]' --class=vtoyret VTOY_RET {
    echo 'Return ...'
}
```

参考[Ventoy 自定义菜单插件](https://www.ventoy.net/cn/plugin_grubmenu.html)

配置文件里面主要是定义了两个`menuentry`菜单入口配置, 第二个是返回上一页的作用, 照抄官方文档, 第一个入口是引导U盘/移动硬盘上linux系统的, 其实主要就4行内容, 下面详细解释一下:

- `set root=($vtoydev,msdos3)` 这里使用了Ventoy内置的一个变量`$vtoydev`用来获取当前移动设备的名称和编号, 实际变量内容通常为hd1之类GRUB里面对存储设备进行编号的规则. MBR格式为`msdos3`, GPT格式为`gpt3`
- `linux /boot/vmlinuz-5.15.0-25-generic root=UUID=48a196ba-4155-4b4c-b260-cabdabe8e955` 这一行指定系统root位置的时候就用到了上面我们从fstab中复制过来的UUID内容, 定位移动设备更方便和准确. 另外需要注意一下/boot/vmlinuz-xx这个文件详细的名称可能会随系统更新而不同, 可以在Diskgenius里面对照改一下
- `initrd /boot/initrd.img-5.15.0-25-generic`同上, 和实际文件名保持一致
- `boot` 引导系统

#### 从Ventoy中引导linux to go

做好上面的配置后重启系统, 从移动设备启动到Ventoy菜单后按`F6`加载自定义菜单, 就可以看到上面我们配置的两个入口: 第一个启动ubuntu, 第二个返回上一级菜单. 直接选择第一个选项启动系统就OK啦!

## 主机启动可能遇到的问题

### 需要关闭`安全启动(Secure Boot)`

### 关闭bitlocker

启动成功后, 可能无法挂载主机硬盘, 提示需要密码, 但是明明又没有加密, 这时可能是windows中的硬盘状态是`bitlocker正在等待激活`, 这时没有key, 但是被加密了...

```bat
rem 解密
rem 管理员权限
manage-bde -off c:
manage-bde -off d:
rem 查看进度
manage-bde -status
```

### 制作pe镜像

[微PE工具箱](https://www.wepe.com.cn/download.html), 打开后点击右下角的光盘图标，让微型PE生成ISO镜像文件并保存到指定路径即可。这个镜像可用于 Ventoy 中的U盘里使用, 参考[微PE工具箱2.2 – 最好用的纯净 WinPE 启动盘/ U盘系统重装维护工具](https://www.jianeryi.com/wepe.html)

[优启通](https://www.upe.net/)

#### linux to go 中安装vmware-tools

参考[Install VMware tools on Ubuntu 22.04 Jammy Jellyfish Linux](https://linuxconfig.org/install-vmware-tools-on-ubuntu-22-04-jammy-jellyfish-linux)

```sh
# UBUNTU 22.04 SERVER:
$ sudo apt install open-vm-tools

# UBUNTU 22.04 DESKTOP:
$ sudo apt install open-vm-tools-desktop open-vm-tools

# then
reboot

# check
lsmod | grep vmw
```

### 双系统时差问题

参考[linux双系统切换时间,linux与windows双系统下时间不一致的解决办法](https://blog.csdn.net/weixin_36357157/article/details/116585392)

装完win7和Linux双系统后，进入Linux后再进入Windows，你会惊奇的发现时间不对了，差了有8个小时。

导致这样的原因是Winows和 Linux 对硬件时间的处理方法不同，Windows将硬件时间作为本地时间，而Linux则将硬件时间处理为UTC时间。因此在中国UTC+8时区的情况下使用 Windows 和 Linux 会有八个小时的差异。

解决方案：

> Linux命令：  
> hwclock可以查看硬件时间，  
> timedatectl可以查看本地时间、UTC时间、时区、是否开启时间同步等信息。  

思路：

- 将两个系统对硬件时间的处理统一化，统一将硬件时间做为本地时间。
- Windows时间不做处理，在Linux下处理时间
- `timedatectl set-local-rtc`命令可以将硬件时间 设置为本地时间或UTC时间

```sh
# 将硬件时间设置为本地时间
timedatectl set-local-rtc True --adjust-system-clock
# 不将硬件时间设置为本地时间
# timedatectl set-local-rtc False --adjust-system-clock
# 更新硬件时间
sudo hwclock -w
```

如果经过上述设置之后时间显示不正确了，可以通过下列命令同步时间。

```sh
# 开启时间同步服务
sudo systemctl restart systemd-timesyncd.service
# 开启同步
sudo timedatectl set-ntp true
# 更新硬件时间
sudo hwclock -w
```

### 修改卷标

```sh
# 在linux中
sudo lsblk
# 查看卷标
sudo e2label /dev/nvme0n1p3
# 修改卷标
sudo e2label /dev/nvme0n1p3 lautumn-ubuntu
```

### 出现initramfs

通常出现进入initramfs，是因为关机不当导致磁盘文件受损还是什么引起的，所以：我们要把主分区修复！

```sh
# 选择要修复的磁盘, 不要照抄
fsck -t ext4 -a /dev/nvme0n1p1
```

----

## 参考

- [Ventoy github](https://github.com/ventoy/Ventoy)
- [Ventoy home](https://www.ventoy.net/cn/index.html)
- [在已安装Ventoy的移动设备上安装Linux与配置引导](https://lpwmm.blog.csdn.net/article/details/119056455)
- [能否将一块U盘作为Ventoy启动盘的同时，安装一个Linux系统？](https://github.com/ventoy/Ventoy/issues/852)
- [辅助工具-VMware装系统教程-U盘启动安装](https://blog.csdn.net/u012077233/article/details/110305378)
