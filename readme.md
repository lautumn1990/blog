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

~~通过`\\wsl$\`访问文件系统, 可能导致无法使用`markdownlint`进行格式提醒, 可以通过`net use s: \\wsl$\ubuntu`进行映射, 然后通过`S盘`进行访问. 删除方法 `net use s: /del`~~

目前`markdownlint`在`\\wsl$\`已经可以正常使用, 参考[issue](https://github.com/DavidAnson/markdownlint/issues/462#issuecomment-1018136715)

## 增加复制代码功能

- [为博客添加代码块一键复制功能](https://be-my-only.xyz/blog/TeXt-copy-to-clipboard/)
- [Feature request: 增加代码块的一键复制功能](https://github.com/kitian616/jekyll-TeXt-theme/issues/200)
- [feat: copy to clipboard for code blocks](https://github.com/kitian616/jekyll-TeXt-theme/pull/218)

用法与它相反, 默认是添加代码块, 把不需要复制的代码块, 添加`{: .notcopyable}`样式

比如

<!-- markdownlint-disable MD033 MD040 MD048 -->
<div class="snippet" markdown="1">

~~~
```python
def hello():
    print("Hello world!")
```
{: .notcopyable}
~~~

</div>
