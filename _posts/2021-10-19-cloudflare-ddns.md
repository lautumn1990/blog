---
title: cloudflare 动态域名
tags: [ cloudflare ]
categories: [ cloudflare ]
key: cloudflare-ddns
pageview: true
---

通过shell脚本控制

<!--more-->

## 脚本

下载脚本

```shell
sudo wget https://raw.githubusercontent.com/lautumn1990/cloudflare-api-v4-ddns/main/cf-v4-ddns.sh -O /usr/local/bin/cf-ddns.sh
sudo chmod +x /usr/local/bin/cf-ddns.sh
sudo vim /usr/local/bin/cf-ddns.sh
```

修改default config下的几个配置变量

添加定时任务

```shell
crontab -e
```

在最后加上

```shell
*/2 * * * * /usr/local/bin/cf-ddns.sh >/dev/null 2>&1
```

如果需要日志就换成这条

```shell
*/2 * * * * /usr/local/bin/cf-ddns.sh >> /var/log/cf-ddns.log 2>&1
```

## 其他的可通过python脚本

参考[ddns](https://github.com/NewFuture/DDNS)

----

## 参考

- [cloudflare-api-v4-ddns](https://github.com/zanjie1999/cloudflare-api-v4-ddns)
- [ddns](https://github.com/NewFuture/DDNS)
