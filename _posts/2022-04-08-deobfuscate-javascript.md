---
title: javascript反混淆
tags: [ javascript ]
categories: [ javascript ]
key: deobfuscate-javascript
pageview: true
---

有一些js代码由于代码保护的原因会增加混淆, 使代码逻辑看不懂, 这时可以使用部分反混淆工具对代码进行部分还原.

<!--more-->

## 常用工具介绍

### 混淆工具

- [YUI Compressor](http://yui.github.io/yuicompressor/)
- [Google Closure Compiler](https://developers.google.com/closure/compiler/)
- [UglifyJS](https://github.com/mishoo/UglifyJS)
- [JScrambler](https://jscrambler.com/)
- [obfuscator](https://obfuscator.io/)

### 反混淆工具

- [jsbeautifier](http://jsbeautifier.org/)
- [JSDetox](http://relentless-coding.org/projects/jsdetox/)
- [deobfuscator](https://kuizuo.cn/deobfuscator/)
- [deobfuscate](https://deobfuscate.io/)
- [synchrony](https://deobfuscate.relative.im/)  针对[obfuscator](https://obfuscator.io/)效果最好
- [JavaScript Deobfuscator](https://deo.sigr.io/)

## 使用python库还原字面量

针对数组类混淆, 可以找出变量函数然后进行代码替换

先使用[jsbeautifier](http://jsbeautifier.org/)进行一遍格式化

安装python库`PyExecJS`

```sh
pip install PyExecJS
```

参考如下代码[deobfuscate-javascript](https://github.com/lautumn1990/deobfuscate-javascript), 手动找到混淆函数

如果碰到`UnicodeEncodeError: 'gbk' codec can't encode character '\U0001f55b' in position 7226: illegal multibyte sequence`, 则修改`subprocess.py`文件,如`C:\Users\Lenovo\AppData\Local\Programs\Python\Python39\Lib\subprocess.py`, 中的`class Popen`->`def __init__`->`encoding=None`改成`encoding="utf-8"`

----

## 参考

- [JS 反混淆](http://jartto.wang/2017/10/31/js-anti-aliasing/)
- [js混淆还原](https://blog.csdn.net/weixin_42156283/article/details/104576280)
- [前端如何给 JavaScript 加密（不是混淆）？](https://www.zhihu.com/question/47047191)
