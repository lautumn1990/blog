---
title: docker compose安装mysql redis
tags: [ docker ]
categories: [ docker ]
key: docker-compose-mysql-redis
pageview: true
---

## docker安装mysql

<!--more-->

使用`docker-compose`, 下载[示例](/assets/sources/2021/09/mysql.zip)

目录结构

```shell
docker-compose.yml
conf/my.cnf
data/
```

`docker-compose.yml`文件

```yml
version: '3.1'
services:
  mysql:
    image: mysql:5.7
    container_name: mysql
    privileged: true #一定要设置为true，不然数据卷可能挂载不了，启动不起
    ports: 
     - 3306:3306
    environment:
      MYSQL_ROOT_PASSWORD: root # 自己配置数据库密码
      TZ: Asia/Shanghai
      MYSQL_USER: lautumn
      MYSQL_PASS: root
    command:
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
      --explicit_defaults_for_timestamp=true
      --lower_case_table_names=1
      --max_allowed_packet=128M
      --sql-mode="STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO"   
    volumes:
      - ./data:/var/lib/mysql
      - ./conf/my.cnf:/etc/mysql/my.cnf
    restart: always
```

`conf/my.cnf`文件

```conf
[mysqld]
user=mysql
default-storage-engine=INNODB
character-set-server=utf8mb4
default-time_zone = '+8:00'
sql-mode=STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
[client]
default-character-set=utf8
[mysql]
default-character-set=utf8
```

启动

`docker-compose up -d`

## docker安装redis

参考[使用docker-compose配置redis服务](https://www.cnblogs.com/xpengp/p/12713374.html)

使用`docker-compose`, 下载[示例](/assets/sources/2021/09/redis.zip)

目录结构

```shell
docker-compose.yml
conf/redis.conf
data/
```

`docker-compose.yml`文件

```yml
version: '3.1'
services:
  redis:
    image: redis:5
    container_name: redis
    volumes:
      - ./data:/data
      - ./conf/redis.conf:/usr/local/etc/redis/redis.conf
    command:
      redis-server /usr/local/etc/redis/redis.conf
    ports:
      - 6379:6379
    restart: always
    
```

`conf/redis.conf`文件

```conf
port 6379 
timeout 0
loglevel verbose 
save 900 1
save 300 10
save 60 10000
rdbcompression yes
dbfilename dump.rdb
dir ./
# requirepass yourpass
appendonly yes
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
slowlog-log-slower-than 10000
slowlog-max-len 1024
list-max-ziplist-entries 512
list-max-ziplist-value 64
set-max-intset-entries 512
zset-max-ziplist-entries 128
zset-max-ziplist-value 64
activerehashing yes
```

启动

`docker-compose up -d`

## docker-compose禁止关闭自动启动

[Clarification on how to stop containers with --restart=always](https://github.com/moby/moby/issues/10032)

[List containers in the same docker-compose](https://stackoverflow.com/a/41943224)

```sh
# 查看docker compose project
docker-compose ls
# 使用wsl
# 禁用自动重启, 修改<project-name>
docker update --restart=no $(docker ps -aq -f label=com.docker.compose.project=<project-name>) &
# 自动重启, 修改<project-name>
docker update --restart=always $(docker ps -aq -f label=com.docker.compose.project=<project-name>) &
```

## docker-compose更新单个镜像

```sh
docker-compose stop <service_name>
docker-compose pull <service_name>
docker-compose up -d --no-deps <service_name>
```
