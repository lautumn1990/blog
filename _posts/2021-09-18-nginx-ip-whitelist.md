---
title: nginx设置ip白名单
tags: [ nginx ]
categories: [ nginx ]
key: nginx-ip-whitelist
pageview: true
---

## nginx设置ip白名单

<!--more-->

### 通过allow, deny模块

```conf
allow 45.43.23.21;
deny all;
```

各模块下使用方式

```conf
http{
   ...
   allow 45.43.23.21;
   deny all;
   ...
}

server{
    ...
    allow 45.43.23.21;
    deny all;
    ...
}


location / {
   allow 45.43.23.21;
   deny all;
}
```

### 通过geo模块

http模块

```conf
http {
    ........
    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    geo $remote_addr $geo {
           default 1; #1表示禁止访问
           127.0.0.1 0; #0表示可以访问
    }

    include /usr/local/nginx/conf.d/*.conf;
}
```

server模块

```conf
server {
    listen 80;
    server_name jenkins.aa.bb;
    location / {
        # 如果不是白名单则 显示403 禁止访问
        if ( $geo  = 1 ) {
            return 403;
        }
        proxy_set_header        Host $host:$server_port;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto $scheme;
        proxy_pass          http://127.0.0.1:59932;
        proxy_read_timeout  90;
        proxy_http_version 1.1;
        proxy_request_buffering off;
    }
}
```

geo语法

```conf
Syntax:     geo [$address] $variable { ... }
Default:    —
Context:    http
```

address 默认是 `$remote_addr`, 可能生产上需要使用`$http_x_forwarded_for`才能获取到客户端ip
{:.info}

### 通过geo对指定ip地址流量限制

```conf
http{
     #定义白名单ip列表变量
     geo $whiteiplist {
         default 1 ;
         127.0.0.1/32 0;
         10.0.0.0/8 0;
         64.223.160.0/19 0;
     }
     
     map $whiteiplist $limit{
         1 $binary_remote_addr ;
         0 "";
     }
     
     #配置请求限制内容
     limit_conn_zone $limit zone=conn:10m;
     limit_req_zone $limit zone=allips:10m rate=20r/s;
     
     server{
         listen       8080;
         server_name  test.qiangsh.com;
                  
         location /app {
           proxy_pass http://192.168.1.111:8888/app;
           limit_conn conn 50;
           limit_rate 500k;
           limit_req zone=allips burst=5 nodelay;
         }
     }
}

# 测试方法：
# ab -c 100 -n 300 http://test.qiangsh.com:8080/app/docs/nginx_guide.pdf
```

1. `geo`指令定义一个白名单`$whiteiplist`, 默认值为`1`, 所有都受限制。 如果客户端IP与白名单列出的IP相匹配，则`$whiteiplist`值为`0`也就是不受限制。
1. `map`指令是将`$whiteiplist`值为`1`的，也就是`受限制的IP`，映射为客户端IP。将`$whiteiplist`值为`0`的，也就是`白名单IP`，映射为空的字符串。
1. `limit_conn_zone`和`limit_req_zone`指令对于键为空值的将会被忽略，从而实现对于列出来的IP不做限制。
1. `$remote_addr`和 `$binary_remote_addr` 区别, $remote_addr 是7-15字节, $binary_remote_addr是4字节ipv4, 16字节ipv6
1. 以上命令的限制是指白名单内的不限制, 不在白名单内的, 每个ip允许50个连接, 每个连接限速500k, 10m的容器, 按照32bytes/session， 可以处理320000个session, 每秒20个请求, 超过25(20+5, 其中前20个是有时间间隔匀速控制的, 后5个是缓存, 如果100ms内有10个请求, 则会通过7个)个的立即丢弃, 返回503

## 参考

- [geo语法](http://nginx.org/en/docs/http/ngx_http_geo_module.html)
- [ngx_http_limit_conn_module语法](http://nginx.org/en/docs/http/ngx_http_limit_conn_module.html)
- [ngx_http_limit_req_module语法](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html)
- [How To Whitelist IP in Nginx](https://ubiq.co/tech-blog/how-to-whitelist-ip-in-nginx/)
- [Nginx设置白名单、ip限制](https://blog.51cto.com/qiangsh/1768124)
- [nginx geo使用方法](http://www.ttlsa.com/nginx/using-nginx-geo-method/)
- [获取用户IP的标准姿势](https://zhuanlan.zhihu.com/p/21354318)
- [Nginx配置IP白名单](https://rorschachchan.github.io/2018/10/31/Nginx%E9%85%8D%E7%BD%AEIP%E7%99%BD%E5%90%8D%E5%8D%95/)
- [ngx_http_limit_req_module](https://www.cnblogs.com/pengyunjing/p/10662612.html)
- [Nginx限速模块初探](https://www.cnblogs.com/CarpenterLee/p/8084533.html)
- [Nginx开发从入门到精通](http://tengine.taobao.org/book/index.html)
