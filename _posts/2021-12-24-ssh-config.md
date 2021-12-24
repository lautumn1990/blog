---
title: ssh 配置文件
tags: [ ssh ]
categories: [ ssh ]
key: ssh-config
pageview: true
---

通过ssh连接远程linux服务器时, 通常使用~/.ssh/config减少命令行的参数

<!--more-->

## 什么是 ssh_config?

如果没有ssh_config, 非常复杂

```sh
ssh -i /users/virag/keys/us-west/ed25519 -p 1024 -l virag \ myserver.aws-west.example.com
```

转成ssh config配置

```config
Host myserver
    Hostname myserver.aws-west.example.com
    User virag
    Port 1024
    IdentityFile /users/virag/keys/us-west/ed25519
```

## ssh_config 如何工作

ssh 客户端从三个地方读取配置，顺序如下:

1. 系统范围内的 /etc/ssh/ssh_config
1. 在 ~/.ssh/ssh_config 中的用户特定配置(~/.ssh/config)。
1. 直接提供给 ssh 的命令行标志

这意味着命令行标志(#1)可以覆盖用户特定的配置(#2)，可以覆盖全局配置(#3)

当连接参数被重复使用时，通常在 ssh_config 中定义这些参数比较容易，它们会在连接时自动应用。虽然它们通常是在用户第一次运行 ssh 时创建的，但目录和文件可以通过以下方式手动创建。

```config
Host [alias]
    Option1 [Value]
    Option2 [Value]
    Option3 [Value]
```

示例

```config
Host myserver3
    Hostname myserver3.aws-west.example.com
    User virag3
    Port 1111
Host myserver2
    Hostname myserver2.aws-west.example.com
Host myserver*
    Hostname myserver1.aws-west.example.com
    User virag
    Port 1024
```

得到的配置如下

myserver1

```config
Hostname myserver1.aws-west.example.com
User virag
Port 1024
```

myserver2

```config
Hostname myserver2.aws-west.example.com
User virag
Port 1024
```

myserver3

```config
Hostname myserver3.aws-west.example.com
User virag3
Port 1111
```

ssh 接受每个选项的第一个值。所以通配符应该放在最后。

## 默认配置

```config
Host east-prod
    HostName east-prod.prod.example.com
Host *-prod
    HostName west-prod.prod.example.com
    User virag
    PasswordAuthentication no
    PubKeyAuthentication yes
    IdentityFile /users/virag/keys/production/ed25519
    Host east-test
    HostName east-test.test.example.com
Host *-test
    HostName west-test.test.example.com
    User root
Host east-dev
    HostName east-dev.east.example.com
Host *-dev
    HostName west-dev.west.example.com
    User virag   
Host * !prod
    PreferredAuthentications publickey
# 端口转发
Host testdf
    HostName west-test.test.example.com
    DynamicForward 33333
    RequestTTY no
    RemoteCommand cat
Host testlf
    HostName west-test.test.example.com
    LocalForward 12345:127.0.0.1:12345
    RequestTTY no
    RemoteCommand cat
Host testrf
    HostName west-test.test.example.com
    RemoteForward 12345:127.0.0.1:12345
    RequestTTY no
    RemoteCommand cat
# 默认配置
Host *
    IdentityFile ~/.ssh/id_rsa2
    IPQoS lowdelay throughput
    ServerAliveCountMax 5
    ServerAliveInterval 120
```

----

## 参考

- [SSH Configuration: ssh_config](https://ohmyweekly.github.io/notes/2020-10-01-ssh-configuration/)
- [SSH 客户端](https://wangdoc.com/ssh/client.html)
- [What is the .ssh/config corresponding option for ssh -N](https://unix.stackexchange.com/a/424192)
