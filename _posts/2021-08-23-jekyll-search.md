---
title: jekyll-TeXt-theme全文搜索
tags: [ TeXt, search, jekyll ]
categories: [ TeXt, search ]
key: jekyll-search
pageview: true
---
<!-- {% raw %} -->

## 默认是标题搜索

<!--more-->

`config.yml`

```yml
search:
  provider: default # "default" (default), false, "google", "custom"
```

## 可以修改为google search全文搜索

`config.yml`

`search.google.custom_search_engine_id` 需要在`https://cse.google.com/`申请

```yml
search:
  provider: google # "default" (default), false, "google", "custom"

  ## Google Custom Search Engine
  google:
    custom_search_engine_id: d5660e0d5c21e3ddf # Google Custom Search Engine ID
```

但是google搜索容易被墙, 而且google收录需要时间

## 自定义全文搜索

`config.yml`

使用[Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search)

```yml
search:
  provider: custom # "default" (default), false, "google", "custom"
```

在以下目录下`_includes/search-providers/custom`,

新建`search.js`

```js
window.simpleJekyllSearch = SimpleJekyllSearch({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('results-container'),
  json: '/assets/search.json?v={{ "now" | date: "%s"}}',
  noResultsText: 'No results found',
  limit: 10,
  searchResultTemplate: '<li class="search-result__item"><a href="{url}" class="button">{title}</a></li>'
})
```

新建`search.html`

```html
<div class="search search--dark">
  <div class="main">
    <div class="search__header">{{ _locale_search }}</div>
    <div class="search-bar">
      <div class="search-box js-search-box">
        <div class="search-box__icon-search"><i class="fas fa-search"></i></div>
        <input type="text" id="search-input"/>
        <div class="search-box__icon-clear js-icon-clear">
          <a><i class="fas fa-times"></i></a>
        </div>
      </div>
      <button class="button button--theme-dark button--pill search__cancel js-search-toggle">
        {{ _locale_cancel }}</button>
    </div>
    <div class="search-result js-search-result">
      <ul  id="results-container"></ul>
    </div>
  </div>
</div>
<script src="https://unpkg.com/simple-jekyll-search@latest/dest/simple-jekyll-search.min.js"></script>
<script>{%- include search-providers/custom/search.js -%}</script>
```

在`assets`目录新建`search.json`

```json
---
layout: none
---
[
  {% for post in site.posts %}
    {
      "title"    : "{{ post.title | escape }}",
      "category" : "{{ post.category }}",
      "tags"     : "{{ post.tags | join: ', ' }}",
      "url"      : "{{ site.baseurl }}{{ post.url }}",
      "date"     : "{{ post.date }}",
      "content": "{{ post.content | strip_html | strip_newlines | remove_chars | escape }}"
    } {% unless forloop.last %},{% endunless %}
  {% endfor %}
]
```

即可使用`Simple-Jekyll-Search`提供的全文搜索功能

还可以参考[码志](https://github.com/mzlogin/mzlogin.github.io)使用方式
<!-- {% endraw %} -->

## jekyll中使用{% raw %}{%{% endraw %}  %}被转义的问题

```html
{% raw %}{%{% endraw %} raw %}
{% raw %}{% comment %} 这里是各种包含奇怪花括号 {{0}} 的地方 {% endcomment %}{% endraw %}
{% raw %}{%{% endraw %} endraw %}
```

使用以下方式展示`{% raw %}{%{% endraw %} raw %}`

```html
{% raw %}{%{% endraw %} raw {% raw %}%}{%{%{% endraw %} endraw {% raw %}%}{% endraw %} raw {% raw %}%}{% endraw %}
{% raw %}{%{% endraw %} raw {% raw %}%}{%{%{% endraw %} endraw {% raw %}%}{% endraw %} endraw {% raw %}%}{% endraw %}
```

或者

```html
{% raw %}{%{% endraw %} assign openTag = '{% raw %}{%{% endraw %}' %}
{% raw %}{{{% endraw %} openTag }} raw %}    
    content # 代码块   
{% raw %}{{{% endraw %} openTag }} endraw %}
```

参考

{% assign openTag = '{%' %}

- [jekyll 如何转义字符](https://cloud.tencent.com/developer/article/1368561)
- [转义，解决花括号在 Jekyll 被识别成 Liquid 代码的问题](https://cloud.tencent.com/developer/article/1341165)
- [How to display {{openTag}} raw %} and {{openTag}} endraw %} using markdown?](https://stackoverflow.com/questions/47106191/how-to-display-raw-and-endraw-using-markdown)
