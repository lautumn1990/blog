---
title: docker 远程连接
tags: [ docker ]
categories: [ docker ]
key: docker-remote-connect
pageview: true
---

## docker 远程连接

参考[Docker客户端连接远程Docker服务](https://zhuanlan.zhihu.com/p/94224305)

<!--more-->

Docker的Client和Engine之间的通讯有一下几种方式

- Unix Socket 这是类unix系统进程间通讯的一种方式，当Client操作本机的Engine是就是使用这种方式。缺省的socket文件是`unix:///var/run/docker.sock`
- Systemd socket activation : 这是systemd提供的一种为了服务并行启动设计的socket，缺省值为fd:// 对这个技术感兴趣的小伙伴可以进一步了解一下。 [systemd for Developers](http://0pointer.de/blog/projects/socket-activation.html) 这还有一篇中文的文章讲解的不错 [一次socket activation的探索体验](https://segmentfault.com/a/1190000017132823)
- TCP : 上面两种都是只能连接本地Engine，需要连接远程Engine，必须在服务端开始TCP连接。此连接为不安全连接，数据通过明文进行传输。缺省端口2375。
- TCP_TLS : 在TCP的基础之上加上了SSL的安全证书，以保证连接安全。缺省端口2376。

## docker remote

官方教程[Protect the Docker daemon socket](https://docs.docker.com/engine/security/protect-access/)

- Use SSH to protect the Docker daemon socket

    ```shell
    # 18.09+以后支持
    docker context create --docker host=ssh://docker-user@host1.example.com --description="Remote engine" my-remote-engine
    docker context use my-remote-engine
    docker info
    # 恢复
    docker context use default
    ```

- Use TLS (HTTPS) to protect the Docker daemon socket

    ```shell
    # 自签发证书, 输入密码
    openssl genrsa -aes256 -out ca-key.pem 4096
    openssl req -new -x509 -days 365 -key ca-key.pem -sha256 -out ca.pem

    # 服务端证书
    openssl genrsa -out server-key.pem 4096
    openssl req -subj "/CN=$HOST" -sha256 -new -key server-key.pem -out server.csr
    echo subjectAltName = DNS:$HOST,IP:10.10.10.20,IP:127.0.0.1 >> extfile.cnf
    echo extendedKeyUsage = serverAuth >> extfile.cnf
    openssl x509 -req -days 365 -sha256 -in server.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem -extfile extfile.cnf

    # 客户端证书
    openssl genrsa -out key.pem 4096
    openssl req -subj '/CN=client' -new -key key.pem -out client.csr
    echo extendedKeyUsage = clientAuth > extfile-client.cnf
    openssl x509 -req -days 365 -sha256 -in client.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out cert.pem -extfile extfile-client.cnf

    # 删除多余文件, 修改文件权限
    rm -v client.csr server.csr extfile.cnf extfile-client.cnf
    chmod -v 0400 ca-key.pem key.pem server-key.pem
    chmod -v 0444 ca.pem server-cert.pem cert.pem

    # vi /lib/systemd/system/docker.service
    # ExecStart=/usr/bin/dockerd-current -H tcp://0.0.0.0:2375 -H unix://var/run/docker.sock
    # 服务端启动
    dockerd --tlsverify --tlscacert=ca.pem --tlscert=server-cert.pem --tlskey=server-key.pem -H=0.0.0.0:2376

    # 客户端启动
    docker --tlsverify --tlscacert=ca.pem --tlscert=cert.pem --tlskey=key.pem -H=$HOST:2376 version

    
    ```

    以上生成证书命令也可以参考[Docker客户端连接远程Docker服务](https://zhuanlan.zhihu.com/p/94224305)

    ```shell
    $ # ------服务端操作------
    $ # 创建临时目录
    $ mkdir -p ~/.ssh/tls
    $ cd ~/.ssh/tls
    $ 
    $ # 下载脚本
    $ curl https://raw.githubusercontent.com/Si-He-Xiang/Docker-Tech/master/Docker%E7%A7%91%E6%99%AE/scripts/%E7%94%9F%E6%88%90%E8%BF%9E%E6%8E%A5%E8%AF%81%E4%B9%A6/gen-server.sh > gen-server.sh
    $ curl https://raw.githubusercontent.com/Si-He-Xiang/Docker-Tech/master/Docker%E7%A7%91%E6%99%AE/scripts/%E7%94%9F%E6%88%90%E8%BF%9E%E6%8E%A5%E8%AF%81%E4%B9%A6/gen-user.sh >  gen-user.sh
    $ chmod +x gen-server.sh gen-user.sh
    $
    $ # 生成服务器端证书
    $ # gen-server.sh至少需要三个参数 
    $ # --pass 表示更证书Key的密钥
    $ # --email 邮箱地址
    $ # --domain 服务器的域名 或 使用 --ip 制定服务器IP
    $ ./gen-server.sh --pass 111111 --altauto --domain <服务器域名> --email <邮件地址>
    $ 
    $ # 将这4个文件复制到docker配置目录
    $ sudo mkdir -p /etc/docker/tls
    $ sudo cp ./server/* /etc/docker/tls/
    $
    $ # 生成客户端证书
    $ # 密码需要和上面的CAKey密码一致
    $ # -t 参数可以将生成的客户端证书打包，以方便下载。（可以通过"--tar filename"指定打包文件名）
    $ ./gen-user.sh --pass 111111 --user tester -t
    $ ls -l tester*
    -rw-rw-r-- 1 op op 4932 11月 28 16:27 tester-cert.tar.gz
    $
    $ # 证书生成完毕
    ```

    修改 /etc/docker/daemon.json

    ```json
    {
        "hosts":[
            "fd://",
            "tcp://0.0.0.0:2375"
        ]
    }
    ```

    使用证书

    ```json
    {
        "hosts":[
            "fd://",
            "tcp://0.0.0.0:2376"
        ],
        "tlsverify":true,
        "tlscacert":"/etc/docker/tls/ca.pem",
        "tlscert":"/etc/docker/tls/server-cert.pem",
        "tlskey":"/etc/docker/tls/server-key.pem"
    }
    ```

    重启docker

    ```shell
    sudo systemctl restart docker
    ```

## docker vscode

推荐开发时使用此方法, 通过ssh保证安全性, 不需要额外生成证书, 生产一般也不会直接使用docker, 会使用k8s等工具
{:.success}

直接使用`remote`插件即可, 先用`remote ssh`连接服务器, 然后通过docker插件连接docker服务

### 普通用户无法启动docker的问题

```shell
# 验证
docker ps
#将当前登录用户加入到docker用户组中
sudo gpasswd -a $USER docker
#更新用户组
newgrp docker
#测试docker命令普通用户是否可以正常使用
docker ps
```

### vscode无法刷新用户组的问题

在远程服务器, 重启`vscode server`, `ctrl+shift+p`, `Remote-SSH: Kill VS Code Server on Host...`

## docker intellij idea

可以通过加密的TCP连接, 也可以通过ssh连接保证安全
{:.info}

[Native support for running Docker on the remote machine](https://youtrack.jetbrains.com/issue/PY-33489#focus=streamItem-27-3922425.0-0)

```shell
ssh -fnNT -L localhost:3333:/var/run/docker.sock me@dockerhost
# then
docker -H tcp://localhost:3333 ps
```

在`view->tool windows->services(alt+8)`中添加`docker connection`, tcp socket中`tcp://localhost:3333`填写即可

## 参考

- [Docker客户端连接远程Docker服务](https://zhuanlan.zhihu.com/p/94224305)
- [Protect the Docker daemon socket](https://docs.docker.com/engine/security/protect-access/)
- [Native support for running Docker on the remote machine](https://youtrack.jetbrains.com/issue/PY-33489#focus=streamItem-27-3922425.0-0)
