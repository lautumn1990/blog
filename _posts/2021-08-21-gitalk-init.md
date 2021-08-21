---
title: gitalk自动初始化
tags: [ TeXt, gitalk ]
categories: [ TeXt, gitalk ]
key: gitalk-init
pageview: true
---

## gitalk自动初始化

使用`jekyll-text-theme`之后, 使用`gitalk`作为评论系统, 需要自己手动初始化.

参考[利用 Github Action 自动初始化 Gitalk 评论之Python篇](https://www.lshell.com/post/use-github-action-and-python-to-automatically-initialize-gitalk-comments/)
{:.info}

<!--more-->

### 改造初始化gitalk的id方式

由于本主题使用的是自定义的`key`作为`gitalk`的`id`即`github/issues`的`label`, 而不是`hexo`使用的`md5`方式, 所以需要手动获取一下`gitalk`的`id`, 然后进行初始化

```python
import requests
from bs4 import BeautifulSoup
import re

def get_gitalk_id(url):
    r = requests.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    # title作为issue的标题
    # title = soup.title.string
    gitalk_container = soup.findAll(id='js-gitalk-container')[0].next_element
    key = str(re.findall(r"id: '([^']+)'", gitalk_container.string)[0])
    return key

# 将about, archive 和 首页排除
def filter_posts(urls):
    return list(filter(lambda x: not x.endswith(("about.html", "archive.html", "/")), urls))
```

### 整体思路如下

1. 通过sitemap获取网站url
1. 过滤不需要初始化的url
1. 抓取页面, 获取gitalk中的id, 和title
1. 判断不存在issue的label, 然后初始化

其他内容参考[init-gitalk](https://github.com/Ansen/automaticallyInitializeGitalk/blob/master/init-gitalk.py)
{:.info}

### 附上完整代码

`gitalk_init.py`{:.success}文件

启动命令`python gitalk_init.py https://blog.lautumn.cn https://blog.lautumn.cn/sitemap.xml xxxxxxxxxxxx lautumn1990 blog`, 其中`xxxxxxxxxxxx`{:.info} 为token

```python
#!/usr/bin/env python3
# -*- coding:utf-8 _*-

""" 
@author: lautumn 
@license: Apache Licence 
@file: gitalk_init.py
@time: 2021/8/20 18:45
"""

import requests
import json
import sys
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
import re

if len(sys.argv) != 6:
    print("Usage:")
    print(sys.argv[0], "site_url sitemap_url token username repo_name")

site_url = sys.argv[1]
sitemap_url = sys.argv[2]
token = sys.argv[3]
username = sys.argv[4]
repo_name = sys.argv[5]

# 根据url找key
url_key_map = {}
# 根据url找title
url_title_map = {}


def get_comments(session, label=''):
    issues = []

    if label is None or label == '':
        return issues
    url = 'https://api.github.com/repos/' + username + '/' + repo_name + '/issues?q=is&labels=Gitalk,' + label
    r = session.get(url=url)
    data = json.loads(r.text)
    for issue in data:
        issues.append(issue['body'].split('?')[0])

    return issues


def get_url_key_map(urls):
    global url_key_map, url_title_map
    for url in urls:
        key = ""
        title = ""
        try:
            r = requests.get(url)
            soup = BeautifulSoup(r.text, 'html.parser')
            title = soup.title.string
            gitalk_container = soup.findAll(id='js-gitalk-container')[0].next_element
            key = str(re.findall(r"id: '([^']+)'", gitalk_container.string)[0])
        except:
            print("pass url %s , error" % url)
            pass
        url_key_map[url] = key
        url_title_map[url] = title


def get_posts():
    global url_key_map
    post_urls = []
    r = requests.get(sitemap_url)
    root = ET.fromstring(r.text)
    for child in root:
        post_urls.append(child[0].text)

    post_urls = filter_posts(post_urls)
    print(post_urls)

    get_url_key_map(post_urls)
    post_urls = list(filter(lambda x: url_key_map.get(x) != '' and url_key_map.get(x) is not None, post_urls))
    print(url_key_map)
    return post_urls


def filter_posts(urls):
    return list(filter(lambda x: not x.endswith(("about.html", "archive.html", "/")), urls))


def get_post_title(url):
    global url_title_map
    return url_title_map[url]


def init_gitalk(session, not_initialized):
    github_url = "https://api.github.com/repos/" + username + "/" + repo_name + "/issues"

    for url in not_initialized:
        print("\n\n" + url)
        title = get_post_title(url=url)
        # issuse lable 限制最大长度为50，使用自定义的key, jekyll模板定义的
        gtalk_id = url_key_map.get(url)
        issue = {
            'title': title,
            'body': url,
            'labels': ['Gitalk', gtalk_id]
        }
        print('[{}] checking...'.format(title))
        is_existed = get_comments(session=session, label=gtalk_id)
        if is_existed:
            print(f"issues [ {gtalk_id} ] already exist")
            continue
        print('[{}] initializing...'.format(title))
        resp = session.post(url=github_url, data=json.dumps(issue))
        if resp.status_code == 201:
            print('Created')
        else:
            print(f'issuse: {issue}')
            print(f'failed: {resp.text}' )
            break


def main():
    print("\n\n-------------------")
    session = requests.Session()
    session.auth = (username, token)
    session.headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.59 Safari/537.36 Edg/85.0.564.30'
    }
    post_urls = get_posts()
    init_gitalk(session=session, not_initialized=post_urls)


if __name__ == '__main__':
    main()
```
