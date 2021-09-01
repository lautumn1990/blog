---
title: jekyll中URL的设置
tags: [ TeXt , jekyll ]
categories: [ TeXt , jekyll ]
key: jekyll url config
pageview: true
---

## jekyll中URL的设置

配置文件为`_config.yml`

在配置文件中添加配置类似于

`permalink: date`

### 可用的参数值

- `year` 文章的年份:如2021
- `short_year` 文章的年份,不包含世纪,如:21
- `month` 文章的月份
- `i_month` 文章的月份,去掉前置的0
- `day` 文章的日期
- `i_day` 文章的日期,去掉前置的0
- `categories` 文章的分类,如果文章没分类,生成url时会将其忽略

### 内置搭配

- date/:categories/:year/:month/:day/:title.html
- pretty/:categories/:year/:month/:day/:title/
- none/:categories/:title.html

### 使用方式

```yml
permalink: date
permalink: pretty
permalink: none
```

### 自定义搭配

- /:categories/:year/:month/:day/:title.html 默认的搭配
- /:categories/:title.html 最精简的配置
- /:categories/:year-:month-:day-:title.html 自定义配置
- /:year-:month-:day/:title 也可以不跟html

### 参考

[jekyll中URL的设置](https://www.psvmc.cn/article/2014-07-05-jekyll-url.html)
