---
title: docker安装为知笔记
tags: [ docker ]
categories: [ docker ]
key: docker-notebook
pageview: true
---

在内网之间临时传输文本、图片、文件时, 可能会有登录其他服务麻烦, 这时可以自己搭建一个笔记服务, 进行临时传输使用

<!--more-->

通过docker安装, 5 用户以下免费使用

## 安装

### 首次使用

```sh
docker run --name wiz --restart=always -it -d -v  ~/wizdata:/wiz/storage -v  /etc/localtime:/etc/localtime -p 80:80 -p 9269:9269/udp  wiznote/wizserver
```

### 更新

```sh
docker stop wiz
docker rm wiz
docker pull wiznote/wizserver:latest
docker run --name wiz --restart=always -it -d -v  ~/wizdata:/wiz/storage -v  /etc/localtime:/etc/localtime -p 80:80 -p 9269:9269/udp  wiznote/wizserver
```

### 镜像下载失败

使用阿里云镜像可能会出现版本滞后的情况, 这时可以手动拉取, 然后打tag的方式

```sh
docker pull registry.hub.docker.com/wiznote/wizserver:latest
docker tag registry.hub.docker.com/wiznote/wizserver:latest wiznote/wizserver:latest
```

## nginx

### nginx配置

```conf
server {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header x-wiz-real-ip $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-Forwarded-Proto $scheme;
    ...
}
```

### http跳转到https

```conf
server {
  listen      1234 ssl;
  server_name your.site.tld;
  ssl         on;
  ...
  error_page  497 https://$host:1234$request_uri;
  ...
}
```

## 账户设置

- 默认管理员账号`admin@wiz.cn`, 密码`123456`
- 新注册用户, 并禁用管理帐号

## docker-compose

```yaml
version: '3.1'
services:
  wiz:
    image: wiznote/wizserver:latest
    container_name: wiz
    ports: 
     - 80:80
     - 9269:9269/udp
    volumes:
      - ./wizdata:/wiz/storage
      - /etc/localtime:/etc/localtime
    restart: always
```

## 安装leanote笔记, 蚂蚁笔记

参考[leanote-docker](https://github.com/leanote/leanote-docker)

```sh
mkdir leanote
cd leanote
git clone https://github.com/leanote/leanote-docker.git
git clone https://github.com/leanote/leanote.git
cp -r leanote/mongodb_backup/leanote_install_data leanote-docker/
cd leanote-docker
# 编辑app.conf
# 修改docker-compose.yaml的时区为系统时区
docker-compose up -d
```

初始化帐号/密码: admin/abc123

leanote比wiz占用的资源小很多

----

## 参考

- [为知笔记服务端docker镜像使用说明](https://www.wiz.cn/zh-cn/docker)
- [为知笔记私有部署配置nginx反向代理和https的方法](https://www.wiz.cn/zh-cn/docker-https)
- [Force Redirect From HTTP to HTTPs On A Custom Port in Nginx](https://ma.ttias.be/force-redirect-http-https-custom-port-nginx/)
- [leanote-docker](https://github.com/leanote/leanote-docker)
