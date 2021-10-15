---
title: curl 命令用法
tags: [ linux ]
categories: [ linux ]
key: curl-command
pageview: true
---

在Linux中curl是一个利用URL规则在命令行下工作的文件传输工具，可以说是一款很强大的http命令行工具。它支持文件的上传和下载，是综合传输工具，但按传统，习惯称curl为下载工具。

<!--more-->

语法

```shell
curl [option] [url]
```

常见参数

```shell
    -A/--user-agent <string>               设置用户代理发送给服务器
    -b/--cookie <name=string/file>         cookie字符串或文件读取位置
    -c/--cookie-jar <file>                 操作结束后把cookie写入到这个文件中
    -C/--continue-at <offset>              断点续转
    -D/--dump-header <file>                把header信息写入到该文件中
    -e/--referer                           来源网址
    -f/--fail                              连接失败时不显示http错误
    -o/--output                            把输出写到该文件中
    -O/--remote-name                       把输出写到该文件中，保留远程文件的文件名
    -r/--range <range>                     检索来自HTTP/1.1或FTP服务器字节范围
    -s/--silent                            静音模式。不输出任何东西
    -T/--upload-file <file>                上传文件
    -u/--user <user[:password]>            设置服务器的用户和密码
    -w/--write-out [format]                什么输出完成后
    -x/--proxy <[protocol://]host[:port]>  在给定的端口上使用HTTP代理
    -#/--progress-bar                      进度条显示当前的传送状态
```

## 基本用法

```shell
curl http://www.baidu.com
```

执行后，www.baidu.com 的html就会显示在屏幕上了
Ps：由于安装linux的时候很多时候是没有安装桌面的，也意味着没有浏览器，因此这个方法也经常用于测试一台服务器是否可以到达一个网站

## 保存访问的网页

### 使用linux的重定向功能保存

```shell
curl http://www.baidu.com >> baidu.html
```

### 可以使用curl的内置option:-o(小写)保存网页

```shell
curl -o baidu.html http://www.baidu.com
```

执行完成后会显示如下界面，显示100%则表示保存成功

```text
% Total    % Received % Xferd  Average Speed  Time    Time    Time  Current
                                Dload  Upload  Total  Spent    Left  Speed
100 79684    0 79684    0    0  3437k      0 --:--:-- --:--:-- --:--:-- 7781k

```

### 可以使用curl的内置option:-O(大写)保存网页中的文件

要注意这里后面的url要具体到某个文件，不然抓不下来

```shell
curl -O https://www.baidu.com/robots.txt
```

## 测试网页返回值

```shell
curl -o /dev/null -s -w %{http_code} www.baidu.com
```

Ps:在脚本中，这是很常见的测试网站是否正常的用法

## 指定proxy服务器以及其端口

很多时候上网需要用到代理服务器(比如是使用代理服务器上网或者因为使用curl别人网站而被别人屏蔽IP地址的时候)，幸运的是curl通过使用内置option：`-x`来支持设置代理

```shell
curl -x 192.168.100.100:1080 http://www.baidu.com
```

## cookie

有些网站是使用cookie来记录session信息。对于chrome这样的浏览器，可以轻易处理cookie信息，但在curl中只要增加相关参数也是可以很容易的处理cookie

### 保存http的response里面的cookie信息

内置option:-c（小写）

```shell
curl -c cookiec.txt  http://www.baidu.com
```

执行后cookie信息就被存到了cookiec.txt里面了

### 保存http的response里面的header信息

内置option: -D

```shell
curl -D cookied.txt http://www.baidu.com
```

执行后cookie信息就被存到了cookied.txt里面了

注意：`-c(小写)`产生的cookie和`-D`里面的cookie是不一样的。

### 使用cookie

很多网站都是通过监视你的cookie信息来判断你是否按规矩访问他们的网站的，因此我们需要使用保存的cookie信息。内置option: -b

```shell
curl -b cookiec.txt http://www.baidu.com
```

## 模仿浏览器

有些网站需要使用特定的浏览器去访问他们，有些还需要使用某些特定的版本。curl内置option:-A可以让我们指定浏览器去访问网站

```shell
curl -A "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.0)" http://www.baidu.com
```

这样服务器端就会认为是使用IE8.0去访问的

## 伪造referer（盗链）

很多服务器会检查http访问的referer从而来控制访问。比如：你是先访问首页，然后再访问首页中的邮箱页面，这里访问邮箱的referer地址就是访问首页成功后的页面地址，如果服务器发现对邮箱页面访问的referer地址不是首页的地址，就断定那是个盗连了
curl中内置option：-e可以让我们设定referer

```shell
curl -e "www.baidu.com" http://mail.baidu.com
```

这样就会让服务器其以为你是从www.baidu.com点击某个链接过来的

## 下载文件

### 利用curl下载文件

使用内置option：-o(小写)

```shell
curl -o dodo1.jpg http:www.baidu.com/dodo1.JPG
```

使用内置option：-O（大写)

```shell
curl -O http://www.baidu.com/dodo1.JPG
```

这样就会以服务器上的名称保存文件到本地

### 循环下载

有时候下载图片可以能是前面的部分名称是一样的，就最后的尾椎名不一样

```shell
curl -O http://www.baidu.com/dodo[1-5].JPG
```

这样就会把dodo1，dodo2，dodo3，dodo4，dodo5全部保存下来

### 下载重命名

```shell
curl -O http://www.baidu.com/{hello,bb}/dodo[1-5].JPG
```

由于下载的hello与bb中的文件名都是dodo1，dodo2，dodo3，dodo4，dodo5。因此第二次下载的会把第一次下载的覆盖，这样就需要对文件进行重命名。

```shell
curl -o #1_#2.JPG http://www.baidu.com/{hello,bb}/dodo[1-5].JPG
```

这样在hello/dodo1.JPG的文件下载下来就会变成hello_dodo1.JPG,其他文件依此类推，从而有效的避免了文件被覆盖

### 分块下载

有时候下载的东西会比较大，这个时候我们可以分段下载。使用内置option：-r

```shell
curl -r 0-100 -o dodo1_part1.JPG http://www.baidu.com/dodo1.JPG
curl -r 100-200 -o dodo1_part2.JPG http://www.baidu.com/dodo1.JPG
curl -r 200- -o dodo1_part3.JPG http://www.baidu.com/dodo1.JPG
cat dodo1_part* > dodo1.JPG
```

这样就可以查看dodo1.JPG的内容了

### 通过ftp下载文件

curl可以通过ftp下载文件，curl提供两种从ftp中下载的语法

```shell
curl -O -u 用户名:密码 ftp://www.baidu.com/dodo1.JPG
curl -O ftp://用户名:密码@www.baidu.com/dodo1.JPG
```

### 显示下载进度条

```shell
curl -# -O http://www.baidu.com/dodo1.JPG
```

8.7、不会显示下载进度信息

```shell
curl -s -O http://www.baidu.com/dodo1.JPG
```

## 断点续传

在windows中，我们可以使用迅雷这样的软件进行断点续传。curl可以通过内置option:-C同样可以达到相同的效果
如果在下载dodo1.JPG的过程中突然掉线了，可以使用以下的方式续传

```shell
curl -C -O http://www.baidu.com/dodo1.JPG
```

## 上传文件

curl不仅仅可以下载文件，还可以上传文件。通过内置option:-T来实现

```shell
curl -T dodo1.JPG -u 用户名:密码 ftp://www.baidu.com/img/
```

这样就向ftp服务器上传了文件dodo1.JPG

## 显示抓取错误

```shell
curl -f http://www.baidu.com/error
```

## 分析耗时

### 测试过程

```shell
curl 'https://www.baidu.com' -o /dev/null -s -w '@curl-format.txt'

  time_namelookup:    0.031000
  time_connect:       0.047000
  time_appconnect:    0.156000
  time_redirect:      0.000000
  time_pretransfer:   0.156000
  time_starttransfer: 0.172000
--------------------------------
  time_total:         0.172000

```

```shell
-w ：从文件中读取要打印信息的格式
-o /dev/null ：把响应的内容丢弃，因为我们这里并不关心它，只关心请求的耗时情况
-s ：不要打印进度条
```

从这个输出，我们可以算出各个步骤的时间：

DNS 查询：124ms
TCP 连接时间：  pretransfter(148) - namelookup(124) = 24ms
服务器处理时间：starttransfter(382) - pretransfer(338) = 44ms
内容传输时间：  total(0.382) - starttransfer(0.382) = 0ms

### curl-format.txt文件配置

```shell
\n
  time_namelookup:    %{time_namelookup}\n
  time_connect:       %{time_connect}\n
  time_appconnect:    %{time_appconnect}\n
  time_redirect:      %{time_redirect}\n
  time_pretransfer:   %{time_pretransfer}\n
  time_starttransfer: %{time_starttransfer}\n
--------------------------------\n
  time_total:         %{time_total}\n
\n
```

### 变量解释

```shell
time_namelookup:       DNS 域名解析的时候，就是把 https://zhihu.com 转换成 ip 地址的过程
time_connect:          TCP 连接建立的时间，就是三次握手的时间
time_appconnect:       SSL/SSH 等上层协议建立连接的时间，比如 connect/handshake 的时间
time_redirect:         从开始到最后一个请求事务的时间
time_pretransfer:      从请求开始到响应开始传输的时间
time_starttransfer:    从请求开始到第一个字节将要传输的时间
time_total:            这次请求花费的全部时间
```

### 使用ab工具

安装ab工具

```shell
# centos
sudo yum install httpd-tools
# ubuntu
sudo apt install apache2-utils
```

参数说明

```shell
-n：执行的请求个数，默认时执行一个请求

-c：一次产生的请求个数，即并发个数

-p:模拟post请求，文件格式为gid=2&status=1,配合-T使用

-T:post数据所使用的Content-Type头信息，如果-T 'application/x-www-form-urlencoded'
```

#### 1.模拟get请求

直接在url后面带参数即可

```shell
ab -c 10 -n 10 http://www.test.api.com/?gid=2
```

#### 2.模拟post请求

在当前目录下创建一个文件post.txt

编辑文件post.txt写入

```text
cid=4&status=1
```

相当于post传递cid,status参数

```shell
ab -n 100  -c 10 -p post.txt -T 'application/x-www-form-urlencoded' 'http://test.api.com/ttk/auth/info/'
```

## 常用参数

### 简介

curl 是常用的命令行工具，用来请求 Web 服务器。它的名字就是客户端（client）的 URL 工具的意思。

它的功能非常强大，命令行参数多达几十种。如果熟练的话，完全可以取代 Postman 这一类的图形界面工具。

本文介绍它的主要命令行参数，作为日常的参考，方便查阅。内容主要翻译自[《curl cookbook》](https://catonmat.net/cookbooks/curl)。为了节约篇幅，下面的例子不包括运行时的输出，初学者可以先看我以前写的[《curl 初学者教程》](http://www.ruanyifeng.com/blog/2011/09/curl.html)。

不带有任何参数时，curl 就是发出 GET 请求。

```shell
curl https://www.example.com
```

上面命令向`www.example.com`发出 GET 请求，服务器返回的内容会在命令行输出。

### **-A**

`-A`参数指定客户端的用户代理标头，即`User-Agent`。curl 的默认用户代理字符串是`curl/[version]`。

```shell
curl -A 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36' https://google.com
```

上面命令将`User-Agent`改成 Chrome 浏览器。

```shell
curl -A '' https://google.com
```

上面命令会移除`User-Agent`标头。

也可以通过`-H`参数直接指定标头，更改`User-Agent`。

```shell
curl -H 'User-Agent: php/1.0' https://google.com
```

### **-b**

`-b`参数用来向服务器发送 Cookie。

```shell
curl -b 'foo=bar' https://google.com
```

上面命令会生成一个标头`Cookie: foo=bar`，向服务器发送一个名为`foo`、值为`bar`的 Cookie。

```shell
curl -b 'foo1=bar' -b 'foo2=baz' https://google.com
```

上面命令发送两个 Cookie。

```shell
curl -b cookies.txt https://www.google.com
```

上面命令读取本地文件`cookies.txt`，里面是服务器设置的 Cookie（参见`-c`参数），将其发送到服务器。

### **-c**

`-c`参数将服务器设置的 Cookie 写入一个文件。

```shell
curl -c cookies.txt https://www.google.com
```

上面命令将服务器的 HTTP 回应所设置 Cookie 写入文本文件`cookies.txt`。

### **-d**

`-d`参数用于发送 POST 请求的数据体。

```shell
curl -d'login=emma＆password=123'-X POST https://google.com/login
# 或者
curl -d 'login=emma' -d 'password=123' -X POST  https://google.com/login
```

使用`-d`参数以后，HTTP 请求会自动加上标头`Content-Type : application/x-www-form-urlencoded`。并且会自动将请求转为 POST 方法，因此可以省略`-X POST`。

`-d`参数可以读取本地文本文件的数据，向服务器发送。

```shell
curl -d '@data.txt' https://google.com/login
```

上面命令读取`data.txt`文件的内容，作为数据体向服务器发送。

### **--data-urlencode**

`--data-urlencode`参数等同于`-d`，发送 POST 请求的数据体，区别在于会自动将发送的数据进行 URL 编码。

```shell
curl --data-urlencode 'comment=hello world' https://google.com/login
```

上面代码中，发送的数据`hello world`之间有一个空格，需要进行 URL 编码。

### **-e**

`-e`参数用来设置 HTTP 的标头`Referer`，表示请求的来源。

```shell
curl -e 'https://google.com?q=example' https://www.example.com
```

上面命令将`Referer`标头设为`https://google.com?q=example`。

`-H`参数可以通过直接添加标头`Referer`，达到同样效果。

```shell
curl -H 'Referer: https://google.com?q=example' https://www.example.com
```

### **-F**

`-F`参数用来向服务器上传二进制文件。

```shell
curl -F 'file=@photo.png' https://google.com/profile
```

上面命令会给 HTTP 请求加上标头`Content-Type: multipart/form-data`，然后将文件`photo.png`作为`file`字段上传。

`-F`参数可以指定 MIME 类型。

```shell
curl -F 'file=@photo.png;type=image/png' https://google.com/profile
```

上面命令指定 MIME 类型为`image/png`，否则 curl 会把 MIME 类型设为`application/octet-stream`。

`-F`参数也可以指定文件名。

```shell
curl -F 'file=@photo.png;filename=me.png' https://google.com/profile
```

上面命令中，原始文件名为`photo.png`，但是服务器接收到的文件名为`me.png`。

### **-G**

`-G`参数用来构造 URL 的查询字符串。

```shell
curl -G -d 'q=kitties' -d 'count=20' https://google.com/search
```

上面命令会发出一个 GET 请求，实际请求的 URL 为`https://google.com/search?q=kitties&count=20`。如果省略`—G`，会发出一个 POST 请求。

如果数据需要 URL 编码，可以结合`--data--urlencode`参数。

```shell
curl -G --data-urlencode 'comment=hello world' https://www.example.com
```

### **-H**

`-H`参数添加 HTTP 请求的标头。

```shell
curl -H 'Accept-Language: en-US' https://google.com
```

上面命令添加 HTTP 标头`Accept-Language: en-US`。

```shell
curl -H 'Accept-Language: en-US' -H 'Secret-Message: xyzzy' https://google.com
```

上面命令添加两个 HTTP 标头。

```shell
curl -d '{"login": "emma", "pass": "123"}' -H 'Content-Type: application/json' https://google.com/login
```

上面命令添加 HTTP 请求的标头是`Content-Type: application/json`，然后用`-d`参数发送 JSON 数据。

### **-i**

`-i`参数打印出服务器回应的 HTTP 标头。

```shell
curl -i https://www.example.com
```

上面命令收到服务器回应后，先输出服务器回应的标头，然后空一行，再输出网页的源码。

### **-I**

`-I`参数向服务器发出 HEAD 请求，然会将服务器返回的 HTTP 标头打印出来。

```shell
curl -I https://www.example.com
```

上面命令输出服务器对 HEAD 请求的回应。

`--head`参数等同于`-I`。

```shell
curl -head https://www.example.com
```

### **-k**

`-k`参数指定跳过 SSL 检测。

```shell
curl -k https://www.example.com
```

上面命令不会检查服务器的 SSL 证书是否正确。

### **-L**

`-L`参数会让 HTTP 请求跟随服务器的重定向。curl 默认不跟随重定向。

```shell
curl -L -d 'tweet=hi' https://api.twitter.com/tweet
```

### **--limit-rate**

`--limit-rate`用来限制 HTTP 请求和回应的带宽，模拟慢网速的环境。

```shell
curl --limit-rate 200k https://google.com
```

上面命令将带宽限制在每秒 200K 字节。

### **-o**

`-o`参数将服务器的回应保存成文件，等同于`wget`命令。

```shell
curl -o example.html https://www.example.com
```

上面命令将`www.example.com`保存成`example.html`。

### **-O**

`-O`参数将服务器回应保存成文件，并将 URL 的最后部分当作文件名。

```shell
curl -O https://www.example.com/foo/bar.html
```

上面命令将服务器回应保存成文件，文件名为`bar.html`。

### **-s**

`-s`参数将不输出错误和进度信息。

```shell
curl -s https://www.example.com
```

上面命令一旦发生错误，不会显示错误信息。不发生错误的话，会正常显示运行结果。

如果想让 curl 不产生任何输出，可以使用下面的命令。

```shell
curl -s -o /dev/null https://google.com
```

### **-S**

`-S`参数指定只输出错误信息，通常与`-s`一起使用。

```shell
curl -s -o /dev/null https://google.com
```

上面命令没有任何输出，除非发生错误。

### **-u**

`-u`参数用来设置服务器认证的用户名和密码。

```shell
curl -u 'bob:12345' https://google.com/login
```

上面命令设置用户名为`bob`，密码为`12345`，然后将其转为 HTTP 标头`Authorization: Basic Ym9iOjEyMzQ1`。

curl 能够识别 URL 里面的用户名和密码。

```shell
curl https://bob:12345@google.com/login
```

上面命令能够识别 URL 里面的用户名和密码，将其转为上个例子里面的 HTTP 标头。

```shell
curl -u 'bob' https://google.com/login
```

上面命令只设置了用户名，执行后，curl 会提示用户输入密码。

### **-v**

`-v`参数输出通信的整个过程，用于调试。

```shell
curl -v https://www.example.com
```

`--trace`参数也可以用于调试，还会输出原始的二进制数据。

```shell
curl --trace - https://www.example.com
```

### **-x**

`-x`参数指定 HTTP 请求的代理。

```shell
curl -x socks5://james:cats@myproxy.com:8080 https://www.example.com
```

上面命令指定 HTTP 请求通过`myproxy.com:8080`的 socks5 代理发出。

如果没有指定代理协议，默认为 HTTP。

```shell
curl -x james:cats@myproxy.com:8080 https://www.example.com
```

上面命令中，请求的代理使用 HTTP 协议。

### **-X**

`-X`参数指定 HTTP 请求的方法。

```shell
curl -X POST https://www.example.com
```

上面命令对`https://www.example.com`发出 POST 请求。

----

## 参考

- [Linux curl命令详解](https://www.cnblogs.com/duhuo/p/5695256.html)
- [使用curl命令分析请求的耗时情况](https://www.cnblogs.com/husbandmen/articles/7509524.html)
- [curl 的用法指南](http://www.ruanyifeng.com/blog/2019/09/curl-reference.html)
- [ab压力测试之post与get请求](https://www.cnblogs.com/eedc/p/9934939.html)
