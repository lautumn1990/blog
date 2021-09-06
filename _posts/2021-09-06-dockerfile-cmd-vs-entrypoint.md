---
title: Dockerfile中CMD和ENTRYPOINT区别
tags: [ docker, cmd, entrypoint, dockerfile ]
categories: [ docker ]
key: dockerfile-cmd-vs-entrypoint
pageview: true
---

## Dockerfile

Dockerfile中的最后一个命令往往是`CMD`或者`ENTRYPOINT`, 都是docker容器启动时执行命令的意思, 两者的区别如下

<!--more-->

## CMD

CMD有三种形式

- `CMD ["executable","param1","param2"]` (exec 形式, 首选, 没有ENTRYPOINT)
- `CMD ["param1","param2"]` (ENTRYPOINT的默认参数)
- `CMD command param1 param2` (shell 形式)

一个Dockerfile只有一个CMD, 如果有多个最后一个生效

如果当参数需要提供`ENTRYPOINT`

exec表单被解析为JSON数组，这意味着必须在单词周围使用双引号(")而不是单引号(')。

不同于shell形式, exec形式不对变量进行替换, 如`CMD [ "echo", "$HOME" ]`中`$HOME`不会替换,
如果想替换, 使用`CMD [ "sh", "-c", "echo $HOME" ]`. shell形式默认添加`/bin/sh -c`, 不想使用`shell -c`, 需要使用exec模式

如果`docker run`指定了参数, 会覆盖`CMD`

## ENTRYPOINT

ENTRYPOINT有两种形式

- `ENTRYPOINT ["executable", "param1", "param2"]`, exec形式
- `ENTRYPOINT command param1 param2`, shell形式

使用`--entrypoint`覆盖默认命令

示例

```Dockerfile
FROM ubuntu
ENTRYPOINT ["top", "-b"]
CMD ["-c"]
```

- 如果执行`docker run -it --rm --name test  top`, 实际执行的是`top -b -c`
- 如果执行`docker run -it --rm --name test  top -H`, 实际执行的是, `top -b -H`

## CMD vs ENTRYPOINT

参考[Understand how CMD and ENTRYPOINT interact](https://docs.docker.com/engine/reference/builder/#understand-how-cmd-and-entrypoint-interact)

`CMD`和`ENTRYPOTINT`都可以运行命令, 不过是有区别的, 两者都有shell模式和exec模式(推荐), 两者都有时, `CMD`作为`ENTRYPOTINT`的默认参数

1. Dockerfile至少有一个`CMD`或`ENTRYPOINT`
1. 容器作为可执行文件时需要定义`ENTRYPOINT`
1. `CMD`需要作为`ENTRYPOINT`的默认参数执行
1. 使用替代参数执行时, 会覆盖`CMD`

|                                | No ENTRYPOINT              | ENTRYPOINT exec_entry p1_entry | ENTRYPOINT ["exec_entry", "p1_entry"]          |
| :----------------------------- | :------------------------- | :----------------------------- | :--------------------------------------------- |
| **No CMD**                     | error, not allowed         | /bin/sh -c exec_entry p1_entry | exec_entry p1_entry                            |
| **CMD ["exec_cmd", "p1_cmd"]** | exec_cmd p1_cmd            | /bin/sh -c exec_entry p1_entry | exec_entry p1_entry exec_cmd p1_cmd            |
| **CMD ["p1_cmd", "p2_cmd"]**   | p1_cmd p2_cmd              | /bin/sh -c exec_entry p1_entry | exec_entry p1_entry p1_cmd p2_cmd              |
| **CMD exec_cmd p1_cmd**        | /bin/sh -c exec_cmd p1_cmd | /bin/sh -c exec_entry p1_entry | exec_entry p1_entry /bin/sh -c exec_cmd p1_cmd |

如果当前`Dockerfile`中定义了`ENTRYPOINT`, 那么会把`CMD`置空, `CMD`必须在当前`Dockerfile`重新定义
{:.info}

## 参考

- [Dockerfile cmd](https://docs.docker.com/engine/reference/builder/#cmd)
- [Dockerfile entrypoint](https://docs.docker.com/engine/reference/builder/#entrypoint)
- [Understand how CMD and ENTRYPOINT interact](https://docs.docker.com/engine/reference/builder/#understand-how-cmd-and-entrypoint-interact)
