---
title: TeXt安装教程
tags: TeXt
key: first post
---

TeXt安装教程 docker-compose方式

<!--more-->

样式来源: [jekyll-TeXt-theme](https://github.com/kitian616/jekyll-TeXt-theme/)

使用教程: [快速开始](https://tianqi.name/jekyll-TeXt-theme/docs/zh/quick-start)

本机启动, docker 方式 :

```shell
docker run --rm -v "$PWD":/usr/src/app -w /usr/src/app ruby:2.6 bundle install
docker-compose -f ./docker/docker-compose.build-image.yml build
docker-compose -f ./docker/docker-compose.default.yml up
```

然后访问 `http://localhost:4000/`

windows下不能监听文件的更新, 添加 `--force_polling` 和 `--watch` 参数
