# lautumn's blog

样式来源: [jekyll-TeXt-theme](https://github.com/kitian616/jekyll-TeXt-theme/)

使用教程: [快速开始](https://tianqi.name/jekyll-TeXt-theme/docs/zh/quick-start)

本机启动, docker 方式 :

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

查看更多[TeXt安装教程](https://blog.lautumn.cn/text/2021/08/19/first-post.html)