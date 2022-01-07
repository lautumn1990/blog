---
title: 增加机器性能
tags: [ linux ]
categories: [ linux ]
key: increase-computer-performance
pageview: true
---

工作中经常遇到单台电脑性能不足, 但是有多台电脑却不好扩展的问题, 可以将一些比较耗性能的应用放到远程执行, 以此增加本电脑的性能, 并行地进行开发任务

<!--more-->

## 通过VSCode

安装Remote-SSH插件, 在远程服务端安装vscode server, 此时本地相当于客户端, 可以方便的进行扩展

## 通过JetBrains Gateway

- 下载安装[JetBrains Gateway](https://www.jetbrains.com/remote-development/gateway/)
- 参考以下[教程](https://www.jetbrains.com/help/idea/remote-development-starting-page.html)
- 通过热心大佬的[开箱即用工具](https://jetbra.in/s)激活
- 结束远程服务, 在远程机器执行
  
  ```sh
  ps -ef | grep idea | grep -v grep | awk '{print $2}'| xargs kill -9
  ```

### ssh服务

windows的wsl远程服务

参考此文章设置ssh自启服务, [wsl的服务](/wsl/2021/09/09/wsl-systemd.html)

参考以下文件[wsl2-network.ps1](/assets/sources/2022/01/wsl2-network.ps1), 设置端口映射

- 权限`Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser`
- 执行`wsl2-network.ps1`
- 删除`wsl2-network.ps1 delete`
- 查看`wsl2-network.ps1 list`

也可以通过以下方式安装ssh服务

- 虚拟机安装linux系统
  - 通过桥接网络模式连接
  - 端口映射的方式, `frp`, `socat`等方式
- 直接安装linux系统

----

## 参考

- [IntelliJ IDEA 2021.3 发布！远程开发 (Beta) 、机器学习、体验优化......](https://zhuanlan.zhihu.com/p/440992104)
- [介绍一个"牛逼闪闪"开源库：ja-netfilter](https://zhile.io/2021/11/29/ja-netfilter-javaagent-lib.html)
- [How to SSH into WSL2 on Windows 10 from an external machine](https://www.hanselman.com/blog/how-to-ssh-into-wsl2-on-windows-10-from-an-external-machine)
- [wsl2-network.ps1](https://gist.github.com/daehahn/497fa04c0156b1a762c70ff3f9f7edae)
- [javaagent使用指南](https://www.cnblogs.com/rickiyang/p/11368932.html)
- [Java字节码指令大全](https://www.cnblogs.com/longjee/p/8675771.html)
