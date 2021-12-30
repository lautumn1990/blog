---
title: linux中find命令的用法
tags: [ linux ]
categories: [ linux ]
key: linux-find-files
pageview: true
---

linux查找文件总结

<!--more-->

## 大文件

### 查找大文件

```sh
# 查找大文件
find . -type f -size +800M
# 查找大文件并显示属性信息
find . -type f -size +800M  -print0 | xargs -0 ls -l
# 查找大文件, 并只显示大小
find . -type f -size +800M  -print0 | xargs -0 du -h
# 查找大小并排序
find . -type f -size +800M  -print0 | xargs -0 du -hm | sort -nr
# 查找所有文件和大小
sudo find / -type f -size +800M -exec ls -lh {} \; | awk '{ print $9 ": " $5 }'
```

### 查找大目录

```sh
# 查找大目录一层
du -h --max-depth=1
# 查找大目录两层并排序
du -h --max-depth=2 | sort -n
# 以MB排序
du -hm --max-depth=2 | sort -n
# 太多窃取12个
du -hm --max-depth=2 | sort -nr | head -12
```

## find 命令用法

```sh
find <指定目录> <指定条件> <指定动作>
```

实例

```sh
# 搜索当前目录（含子目录，以下同）中，所有文件名以my开头的文件。
find . -name 'my*'
# 搜索当前目录中，所有文件名以my开头的文件，并显示它们的详细信息。
find . -name 'my*' -ls
# 搜索当前目录中，所有过去10分钟中更新过的普通文件。如果不加-type f参数，则搜索普通文件+特殊文件+目录。
find . -type f -mmin -10
# -type TYPE ：搜寻档案的类型为TYPE 的，类型主要有：一般正规档案(f), 装置档案(b, c), 目录(d), 连结档(l), socket (s), 及FIFO (p) 等属性。
# 找出/run 目录下，档案类型为Socket 的档名有哪些？
find /run -type s
# -perm /mode ：搜寻档案权限『包含任一mode 的权限』的档案
find / -perm /7000
#-perm -mode ：搜寻档案权限『必须要全部囊括mode 的权限』的档案
find / -perm -0744

# 排除文件
find ./ -name "*test*"  ! -name "*.log" #排除.log文件
# 排除./test目录
find .  -path ./test -prune -o -name "*.txt"
# 排除 ./test 和 ./home 目录
find ./ ( -path "./test" -o -path "./home" ) -prune -o -name "*.txt"
# 或者 排除./test目录
find ./ -name "*.txt" ! -path "./test"
```

### 其他搜索命令

#### locate

locate命令其实是"find -name"的另一种写法，但是要比后者快得多，原因在于它不搜索具体目录，而是搜索一个数据库(`/var/lib/locatedb`)，这个数据库中含有本地所有文件信息。Linux系统自动创建这个数据库，并且每天自动更新一次，所以使用locate命令查不到最新变动过的文件。为了避免这种情况，可以在使用locate之前，先使用updatedb命令，手动更新数据库。

```sh
# 搜索etc目录下所有以sh开头的文件。
locate /etc/sh
# 搜索用户主目录下，所有以m开头的文件。
locate ~/m
# 搜索用户主目录下，所有以m开头的文件，并且忽略大小写。
locate -i ~/m
```

#### whereis

whereis命令只能用于程序名的搜索，而且只搜索二进制文件（参数-b）、man说明文件（参数-m）和源代码文件（参数-s）。如果省略参数，则返回所有信息。

whereis命令的使用实例：

```sh
whereis grep
```

#### which

which命令的作用是，在PATH变量指定的路径中，搜索某个系统命令的位置，并且返回第一个搜索结果。也就是说，使用which命令，就可以看到某个系统命令是否存在，以及执行的到底是哪一个位置的命令。

which命令的使用实例：

```sh
which grep
```

#### type

type命令其实不能算查找命令，它是用来区分某个命令到底是由shell自带的，还是由shell外部的独立二进制文件提供的。如果一个命令是外部命令，那么使用-p参数，会显示该命令的路径，相当于which命令。

type命令的使用实例：

```sh
# 系统会提示，cd是shell的自带命令（build-in）。
type cd
# 系统会提示，grep是一个外部命令，并显示该命令的路径。
type grep
# 加上-p参数后，就相当于which命令。
type -p grep
```

----

## 参考

- [Linux如何查找大文件或目录总结](https://www.cnblogs.com/kerrycode/p/4391859.html)
- [Linux的五个查找命令](https://www.ruanyifeng.com/blog/2009/10/5_ways_to_search_for_files_using_the_terminal.html)
- [find命令的高级用法总结](https://www.zhangqiongjie.com/1684.html)
