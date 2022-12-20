---
title: 常用软件代理设置
tags: [ linux ]
categories: [ linux ]
key: common-software-proxy-settings
pageview: true
---

由于国内的网络环境, 经常遇到网络无法连接的情况, 此时可以`使用代理`或者`使用镜像`来解决

<!--more-->

## 使用代理

假设代理配置如下

- socks5协议, 本地端口10808
- http协议, 本地端口10809

### pip使用代理

- **配置文件**

`~/.config/pip/pip.conf`

- `Unix:$HOME/.config/pip/pip.conf`
- `Mac: $HOME/Library/Application Support/pip/pip.conf`
- `Windows：%APPDATA%\pip\pip.ini`，%APPDATA% 的实际路径我电脑上是 C:\Users\user_xxx\AppData\Roaming，可在 cmd 里执行 echo %APPDATA% 命令查看

```ini
[global]
proxy=http://localhost:10809
```

注意不支持socks5代理, 如果使用socks5代理, 需要先安装`pip install pysocks`

- **单次使用**

```sh
pip install --proxy http://localhost:10809 requests
```

- **全局设置**

```sh
# 设置
pip config set global.proxy http://localhost:10809
# 取消设置
pip config unset global.proxy
```

### git使用代理

#### clone with ssh

- **配置文件**

`~/.ssh/config`

```ini
Host github.com
    # Mac下
    ProxyCommand nc -X 5 -x 127.0.0.1:10808 %h %p
    # Linux下
    ProxyCommand nc --proxy-type socks5 --proxy 127.0.0.1:10808 %h %p
    # Windows下
    ProxyCommand connect -S 127.0.0.1:10808 %h %p
```

#### clone with http

- **配置文件**

`~/.gitconfig`

```ini
[http]
    proxy = http://localhost:10809
[https]
    proxy = http://localhost:10809
```

- **单次使用**

```sh
git clone --config http.proxy=http://localhost:10809 <https://repository_url>
```

- **全局设置**

```sh
# 设置
git config --global http.proxy http://localhost:10809
git config --global https.proxy http://localhost:10809
# 取消设置
git config --global --unset http.proxy
git config --global --unset https.proxy
```

仅仅设置github的代理

```sh
# 仅设置github.com
git config --global --add http.https://github.com.proxy http://localhost:10809
git config --global --add https.https://github.com.proxy http://localhost:10809
# 取消设置
git config --global --unset http.https://github.com.proxy
git config --global --unset https.https://github.com.proxy
```

### apt使用代理

- **配置文件**

在 /etc/apt/apt.conf.d/ 目录下新增 proxy.conf 文件，加入：

```conf
Acquire::http::Proxy "http://127.0.0.1:8080/";
Acquire::https::Proxy "http://127.0.0.1:8080/";
```

如果希望使用 Socks5 代理，则加入：

```conf
Acquire::http::Proxy "socks5h://127.0.0.1:8080/";
Acquire::https::Proxy "socks5h://127.0.0.1:8080/";
```

### gradle使用代理

- **配置文件**

`~/.gradle/gradle.properties`

```ini
systemProp.http.proxyHost=127.0.0.1
systemProp.http.proxyPort=10809
systemProp.https.proxyHost=127.0.0.1
systemProp.https.proxyPort=10809
systemProp.socks.proxyHost=127.0.0.1
systemProp.socks.proxyPort=10808
```

- **单次使用**

```sh
gradle -Dhttp.proxyHost=127.0.0.1 -Dhttp.proxyPort=10809 -Dhttps.proxyHost=127.0.0.1 -Dhttps.proxyPort=10809 <command>
```

### maven使用代理

- **配置文件**

`~/.m2/settings.xml`

```xml
  <proxies>
     <proxy>
      <id>proxy</id>
      <active>true</active>
      <protocol>http</protocol>
      <host>127.0.0.1</host>
      <port>10809</port>
    </proxy>
  </proxies>
```

- **单次使用**

```sh
mvn -Dhttp.proxyHost=127.0.0.1 -Dhttp.proxyPort=10809 -Dhttps.proxyHost=127.0.0.1 -Dhttps.proxyPort=10809 <command>
```

### go使用代理

- **单次使用**

```sh
HTTP_PROXY=socks5://localhost:10808 go get
```

### npm使用代理

不支持socks5代理

- **配置文件**

`~/.npmrc`

```ini
proxy=http://localhost:10809
https-proxy=http://localhost:10809
```

- **单次使用**

```sh
npm --proxy http://localhost:10809 install packagename
```

- **全局设置**

```sh
# 设置
npm config set proxy http://localhost:10809
npm config set https-proxy http://localhost:10809
# 取消设置
npm config delete proxy
npm config delete https-proxy
```

### yarn使用代理

- **配置文件**

`~/.yarnrc`

```ini
proxy "http://localhost:10809"
https-proxy "http://localhost:10809"
```

- **单次使用**

```sh
yarn --proxy http://localhost:10809 add packagename
```

- **全局设置**

```sh
# 设置
yarn config set proxy http://localhost:10809
yarn config set https-proxy http://localhost:10809
# 取消设置
yarn config delete proxy
yarn config delete https-proxy
```

### yarn2使用代理

- **配置文件**

`~/.yarnrc.yml`

```yml
httpProxy: "http://localhost:10809"
httpsProxy: "http://localhost:10809"
```

- **单次使用**

```sh
yarn --proxy http://localhost:10809 add packagename
```

- **全局设置**

```sh
# 设置
yarn config set httpProxy http://localhost:10809
yarn config set httpsProxy http://localhost:10809
# 取消设置
yarn config delete httpProxy
yarn config delete httpsProxy
```

### gem使用代理

- **配置文件**

`~/.gemrc`

```ini
http_proxy: http://localhost:10809
```

### wget使用代理

- **配置文件**

`~/.wgetrc`

```ini
use_proxy = yes
http_proxy = http://localhost:10809
https_proxy = http://localhost:10809
```

- **单次使用**

```sh
wget --proxy=on --http-proxy=http://localhost:10809 --https-proxy=http://localhost:10809 <url>
```

### curl使用代理

- **配置文件**

`~/.curlrc`

```ini
proxy = http://localhost:10809
```

- **单次使用**

```sh
curl --proxy http://localhost:10809 <url>
curl -x http://localhost:10809 <url>
curl --proxy socks5://localhost:10808 <url>
curl --proxy socks5h://localhost:10808 <url>
```

### brew使用代理

- **单次使用**

```sh
ALL_PROXY=socks5://localhost:10808 brew ...
```

### snap使用代理

- **全局设置**

```sh
# 设置
sudo snap set system proxy.http=http://localhost:10809
sudo snap set system proxy.https=http://localhost:10809
# 取消设置
sudo snap unset system proxy.http
sudo snap unset system proxy.https
```

### docker使用代理

#### 使用代理拉取镜像

必须是socks5，http不生效

```sh
# 创建配置文件夹
sudo mkdir -p /etc/systemd/system/docker.service.d
# 编辑配置文件
sudo vim /etc/systemd/system/docker.service.d/proxy.conf

# 添加以下内容
[Service]
Environment="HTTP_PROXY=socks5://127.0.0.1:10808/" "HTTPS_PROXY=socks5://127.0.0.1:10808/" "NO_PROXY=localhost,127.0.0.1,*.aliyuncs.com,*.mirror.aliyuncs.com,"

# 重启服务
sudo systemctl daemon-reload
sudo systemctl restart docker

#删除配置
sudo rm /etc/systemd/system/docker.service.d/proxy.conf
sudo systemctl daemon-reload
sudo systemctl restart docker
```

#### build中使用代理

```sh
# 在启动 build 命令时指定网络模式为 host，类似这样：
docker build --network host --tag image-name .

# 修改 Dockerfile 文件，针对 RUN 命令使用适当的代理方式，比如：
RUN git config --global http.proxy socks5://127.0.0.1:10808
RUN git clone https://github.com/carsenk/explorer

# 如果 RUN 命令只需要环境变量即可设置代理，则不必修改 Dockerfile 文件，只要为 build 命令设置环境变量：
docker build --network host --build-arg http_proxy=socks5://127.0.0.1:10808 --tag image-name .
```

### chocolatey使用代理

从0.9.9.9版本开始，choco支持在配置文件显式配置代理。

- **单次使用**

```sh
choco install packagename --proxy=http://localhost:10809
```

- **全局设置**

```sh
# 设置
choco config set proxy http://localhost:10809
# 取消设置
choco config unset proxy
```

除此之外，从0.10.4版本开始，choco会自动寻找http_proxy和https_proxy或者noproxy环境变量，通过在命令行临时设置环境变量的方式也可以方便调整choco的代理设置。

## 使用镜像

完整镜像地址参考[Thanks Mirror](https://github.com/eryajf/Thanks-Mirror)

### pip使用镜像

- **单次使用**

```sh
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple <package>
```

- **全局设置**

```sh
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

### git使用镜像

参考[ghproxy](https://ghproxy.com/)

```sh
git clone https://ghproxy.com/<https_url>
```

### apt使用镜像

ubuntu使用镜像, 配置参考

- [阿里镜像](https://developer.aliyun.com/mirror/ubuntu/)
- [清华镜像](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/)

debian使用镜像, 配置参考

- [阿里镜像](https://developer.aliyun.com/mirror/debian)
- [清华镜像](https://mirrors.tuna.tsinghua.edu.cn/help/debian/)

### gradle使用镜像

- 单个项目, 在项目根目录下的build.gradle文件中添加

```gradle
buildscript {
 repositories {
  maven { url 'https://maven.aliyun.com/repository/google/' }
  maven { url 'https://maven.aliyun.com/repository/jcenter/'}
 }
 dependencies {
  classpath 'com.android.tools.build:gradle:2.2.3'

  // NOTE: Do not place your application dependencies here; they belong
  // in the individual module build.gradle files
 }  
}

allprojects {
 repositories {
  maven { url 'https://maven.aliyun.com/repository/google/' }
  maven { url 'https://maven.aliyun.com/repository/jcenter/'}
 }
}
```

- 所有项目生效, 在用户目录下的.gradle文件夹下的init.gradle文件中添加

```gradle
allprojects{
 repositories {
  def ALIYUN_REPOSITORY_URL = 'https://maven.aliyun.com/repository/public/'
  def ALIYUN_JCENTER_URL = 'https://maven.aliyun.com/repository/jcenter/'
  def ALIYUN_GOOGLE_URL = 'https://maven.aliyun.com/repository/google/'
  def ALIYUN_GRADLE_PLUGIN_URL = 'https://maven.aliyun.com/repository/gradle-plugin/'
  all { ArtifactRepository repo ->
   if(repo instanceof MavenArtifactRepository){
    def url = repo.url.toString()
    if (url.startsWith('https://repo1.maven.org/maven2/')) {
     project.logger.lifecycle "Repository ${repo.url} replaced by $ALIYUN_REPOSITORY_URL."
     remove repo
    }
    if (url.startsWith('https://jcenter.bintray.com/')) {
     project.logger.lifecycle "Repository ${repo.url} replaced by $ALIYUN_JCENTER_URL."
     remove repo
    }
    if (url.startsWith('https://dl.google.com/dl/android/maven2/')) {
     project.logger.lifecycle "Repository ${repo.url} replaced by $ALIYUN_GOOGLE_URL."
     remove repo
    }
    if (url.startsWith('https://plugins.gradle.org/m2/')) {
     project.logger.lifecycle "Repository ${repo.url} replaced by $ALIYUN_GRADLE_PLUGIN_URL."
     remove repo
    }
   }
  }
  maven { url ALIYUN_REPOSITORY_URL }
  maven { url ALIYUN_JCENTER_URL }
  maven { url ALIYUN_GOOGLE_URL }
  maven { url ALIYUN_GRADLE_PLUGIN_URL }
 }
}

```

### maven使用镜像

配置文件参考[阿里云镜像](https://developer.aliyun.com/mvn/guide)

```xml
<mirror>
  <id>aliyunmaven</id>
  <mirrorOf>*</mirrorOf>
  <name>阿里云公共仓库</name>
  <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```

### go使用镜像

- **写入配置文件**

```sh
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
```

- **本次执行**

```sh
# macOS 或 Linux
export GO111MODULE=on
export GOPROXY=https://goproxy.cn
# windows的powershell
$env:GO111MODULE = "on"
$env:GOPROXY = "https://goproxy.cn"
```

- **每次执行**

```sh
# macOS 或 Linux
echo "export GO111MODULE=on" >> ~/.profile
echo "export GOPROXY=https://goproxy.cn" >> ~/.profile
source ~/.profile
# windows添加环境变量
setx GO111MODULE on
setx GOPROXY https://goproxy.cn
```

### npm使用镜像

- **全局设置**

```sh
# npm配置淘宝镜像升级
npm config set registry https://registry.npmmirror.com
# 查看
npm config get registry
# 删除
npm config delete registry
```

- **单次使用**

```sh
npm --registry https://registry.npmmirror.com install <package>
```

### yarn使用镜像

- **全局设置**

```sh
# yarn配置淘宝镜像升级
yarn config set registry https://registry.npmmirror.com
# 查看
yarn config get registry
# 删除
yarn config delete registry
```

- **单次使用**

```sh
yarn --registry https://registry.npmmirror.com install <package>
```

### gem使用镜像

- **全局设置**

```sh
# gem配置中国镜像
gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/
# 查看
gem sources -l
# 删除
gem sources --remove https://gems.ruby-china.com/
```

- **单次使用**

```sh
gem install rails --source https://gems.ruby-china.com/
```

### brew使用镜像

参考[清华大学开源软件镜像站](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/)

```sh
echo 'export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git"' >> ~/.zshrc
echo 'export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git"' >> ~/.zshrc
echo 'export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"' >> ~/.zshrc

source ~/.zshrc
brew update
```

### docker使用镜像

- 方案一: 加前缀

  ```sh
  # 官方ubuntu镜像
  docker pull ubuntu
  # 上海交通大学镜像
  docker pull docker.mirrors.sjtug.sjtu.edu.cn/library/ubuntu
  # 重新打tag
  docker tag docker.mirrors.sjtug.sjtu.edu.cn/library/ubuntu ubuntu
  
  # 官方teddysun/xray镜像
  docker pull teddysun/xray
  # 上海交通大学镜像
  docker pull docker.mirrors.sjtug.sjtu.edu.cn/teddysun/xray
  # 重新打tag
  docker tag docker.mirrors.sjtug.sjtu.edu.cn/teddysun/xray teddysun/xray
  ```

- 方案二: 配置文件

  ```sh
  {
    "registry-mirrors": [
      "https://docker.mirrors.sjtug.sjtu.edu.cn",
      "https://docker.mirrors.ustc.edu.cn",
      "http://hub-mirror.c.163.com",
      "https://docker.nju.edu.cn"
    ]
  }
  ```

----

## 参考

- [package manager proxy settings](https://github.com/comwrg/package-manager-proxy-settings)
- [Thanks Mirror](https://github.com/eryajf/Thanks-Mirror)
- [各种常用软件设置代理的方法](https://github.com/maq128/temp/blob/master/kb/%E5%90%84%E7%A7%8D%E5%B8%B8%E7%94%A8%E8%BD%AF%E4%BB%B6%E8%AE%BE%E7%BD%AE%E4%BB%A3%E7%90%86%E7%9A%84%E6%96%B9%E6%B3%95.md)
