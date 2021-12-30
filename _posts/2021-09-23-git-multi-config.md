---
title: git多用户设置
tags: [ git ]
categories: [ git ]
key: git-multi-config
pageview: true
---

## github多用户

生成多个key, 如 user1, user2

<!--more-->

```shell
ssh-keygen -t rsa -C user1 -f ~/.ssh/user1
ssh-keygen -t rsa -C user2 -f ~/.ssh/user2
```

上传 key 到分别的 github 账户

`~/.ssh/config`

```ssh
Host user1
    HostName github.com
    IdentityFile ~/.ssh/user1

Host user2
    HostName github.com
    IdentityFile ~/.ssh/user2
```

克隆时使用, 使用@`host`区分用户

```shell
git clone git@user1:project
git clone git@user2:project
```

如果已经clone下来了, 进入项目修改remote地址

```shell
git remote origin set-url <url>
```

## git多用户

### 通过目录区分, `推荐`{:.info}

参考[includeIf](https://git-scm.com/docs/git-config#_includes), [示例](https://git-scm.com/docs/git-config#_example)

在2017年，git新发布的版本2.13.0包含了一个新的功能includeIf配置

```shell
git config --global user.name "FIRST_NAME LAST_NAME"
git config --global user.email "MY_NAME@example.com"
```

如个人和公司区分开, 使用`includeIf`引入多个配置

```conf
# 通过以下配置来引入新的用户名和邮箱
[includeIf "gitdir:D:/project/company/"]
    path = C:/Users/Lenovo/.gitconfig-company
```

另一个配置文件`C:/Users/Lenovo/.gitconfig-company`

```conf
[user]
    name = zhangsan
    email = zs@compay.com
```

### 通过项目区分, `项目少, 临时设置`

进入A项目

```shell
git config user.name "USER_A"
git config user.email "USER_A@example.com"
```

进入B项目

```shell
git config user.name "USER_B"
git config user.email "USER_B@example.com"
```

### git批量删除远程分支

[Delete multiple remote branches in git](https://stackoverflow.com/questions/10555136/delete-multiple-remote-branches-in-git/30619317)

```sh
git branch -r | awk -Forigin/ '/\/release/ {print $2}' | xargs -I {} git push origin :{}
# 命令解释
# awk -F 指定分隔符, /\release/, 只输出release开头的行
# xargs -I 指定占位符 {}
# git push origin :release-xxx 删除release-xxx分支
```

如果private key有密码, 可能需要一次次输入, 通过启动ssh-agent, ssh-add, 添加私钥输入密码, 避免每次都输入密码, 参考[Adding your SSH key to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#adding-your-ssh-key-to-the-ssh-agent)

## 参考

- [git 多用户配置（多用户 & 公司/个人）](https://segmentfault.com/a/1190000038722640)
- [git config配置多用户场景实践](https://segmentfault.com/a/1190000019714862)
