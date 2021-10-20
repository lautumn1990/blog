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
docker-compose -p jekyll -f ./docker/docker-compose.default.yml up
```

然后访问 `http://localhost:4000/`

查看更多[TeXt安装教程](https://blog.lautumn.cn/text/2021/08/19/first-post.html)

## 无法watch

现阶段 `wsl2` 桥接 windows 文件系统存在问题, 导致监听不能及时, 如果强制使用 `--force_polling` 参数, 导致cpu使用率过高,
可直接使用 `wsl2` 内部的文件系统解决问题.

通过`\\wsl$\`访问文件系统, 可使用宿主机的 `vscode` 的插件, 而不用通过 `vscode server` 访问系统

参考[Speed up your builds...](https://www.forevolve.com/en/articles/2020/02/07/speed-up-your-builds-and-watch-for-changes-to-up-to-375-percent-using-this-workaround-on-wsl2-ubuntu-on-windows/)
