---
title: TeXt安装教程
tags: [ TeXt ]
categories: [ TeXt ]
key: first post
pageview: true
---

## TeXt安装教程 docker-compose方式

<!--more-->

样式来源: [jekyll-TeXt-theme](https://github.com/kitian616/jekyll-TeXt-theme/)

使用教程: [快速开始](https://tianqi.name/jekyll-TeXt-theme/docs/zh/quick-start)

### 本机启动, docker 方式

```shell
# see https://stackoverflow.com/a/41489151/9304033
# linux 
# docker run --rm -v "$PWD":/usr/src/app -w /usr/src/app ruby:2.7 bundle install
# windows cmd
docker run --rm -v "%cd%":/usr/src/app -w /usr/src/app ruby:2.7 bundle install
# windows power shell 
# docker run --rm -v "${PWD}":/usr/src/app -w /usr/src/app ruby:2.7 bundle install

docker-compose -f ./docker/docker-compose.build-image.yml build
docker-compose -f ./docker/docker-compose.default.yml up
```

然后访问 `http://localhost:4000/`

windows下不能监听文件的更新, 添加 `--force_polling` 和 `--watch` 参数

### 登录 `gitalk` 时可能会出现403错误，参考

- [如何搭建个人博客站点](https://www.hz-bin.cn/BuildBlog)
- [Gitalk 评论登录 403 问题解决](https://cuiqingcai.com/30010.html)
- [在cloudflare上创建一个免费的在线代理来解决gitalk授权登录报403问题](https://www.chenhanpeng.com/create-own-cors-anywhere-to-resolve-the-request-with-403/#create-cors-by-self)

### 增加网站流量统计

在`_include/footer.html`中增加, 参考 [两行代码 搞定计数](https://busuanzi.ibruce.info)

```html
<!-- 网站统计 -->
<script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>

<!-- 最后增加 -->
<span id="busuanzi_container_site_pv" style='display:none'>本站总访问量：<span id="busuanzi_value_site_pv"></span>次</span>
<span id="busuanzi_container_site_uv" style='display:none'> - 本站总访客数：<span id="busuanzi_value_site_uv"></span>人</span>
```
