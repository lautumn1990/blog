---
title: python jupyter theme
tags: [ python, jupyter ]
categories: [ python ]
key: python-jupyter-theme
pageview: true
---

## python安装

[python download](https://www.python.org/downloads/)

<!--more-->

## jupyter安装

```shell
pip install jupyter notebook
# 代码补全插件
pip install jupyter_contrib_nbextensions
jupyter contrib nbextension install --user
```

启动

```shell
jupyter notebook
# open http://localhost:8888
```

## jupyter-theme安装

github: [jupyter-themes](https://github.com/dunovank/jupyter-themes)

```shell
# 安装jupyter主题
pip install jupyterthemes
# 加载可用主题列表 onedork | grade3 | oceans16 | chesterish | monokai | solarizedl | solarizedd
jt -l
# 选择主题, 应用 -T 显示toolbar -N 显示名称和logo
jt -t onedork -T -N
```

### toolbar悬浮的问题

参考: [Toolbar background not visible](https://github.com/dunovank/jupyter-themes/issues/310)

修改文件`<python-site-packages-path>/jupyterthemes/layout/notebook.less`

找到`div#maintoolbar`, 然后注释掉`position:absolute;`

```css
div#maintoolbar {
    /* position: absolute; */
    width: 90%;
    margin-left: -10%;
    padding-right: 8%;
    float: left;
    background: transparent !important;
}
```

## anaconda安装

[Anaconda Installers](https://www.anaconda.com/products/individual#Downloads)

Anaconda就是可以便捷获取包且对包能够进行管理，同时对环境可以统一管理的发行版本。Anaconda包含了conda、Python在内的超过180个科学包及其依赖项。

conda是包及其依赖项和环境的管理工具。

```shell
# 显示创建环境
conda info -e
# 复制环境
conda create --name <new_env_name> --clone <copied_env_name>
# 删除环境
conda remove --name <env_name> --all

# 激活环境
source activate <env_name>
# windows 激活环境
activate <env_name>
# 退出环境
source deactivate
# windows 退出环境
deactivate

# 查找包
conda search --full-name <package_full_name>
# 模糊查找
conda search <text>
# 显示所有包
conda list
# 在指定环境中安装包
conda install --name <env_name> <package_name>
# 在当前环境中安装包
conda install <package_name>
# 也可以通过pip安装
pip install <package_name>
# 卸载指定环境中的包
conda remove --name <env_name> <package_name>
# 卸载当前环境中的包
conda remove <package_name>
# 更新所有包
conda update --all
# 更新指定包
conda update <package_name>
```

## python 启动报错

```python
Python 3.9.5 (tags/v3.9.5:0a7dcbd, May  3 2021, 17:27:52) [MSC v.1928 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
Failed calling sys.__interactivehook__
Traceback (most recent call last):
  File "C:/Users/Lenovo/AppData/Local/Programs/Python/Python39/lib/site.py", line 449, in register_readline
    readline.read_history_file(history)
  File "C:/Users/Lenovo/AppData/Local/Programs/Python/Python39/lib/site-packages/pyreadline/rlmain.py", line 165, in read_history_file
    self.mode._history.read_history_file(filename)
  File "C:/Users/Lenovo/AppData/Local/Programs/Python/Python39/lib/site-packages/pyreadline/lineeditor/history.py", line 82, in read_history_file
    for line in open(filename, 'r'):
UnicodeDecodeError: 'gbk' codec can't decode byte 0xbd in position 15: illegal multibyte sequence
```

解决方法

由于默认`.python_history`历史命令写的是`utf-8`格式, 而读取的是使用的`gbk`格式, 导致的问题

1. 删除`.python_history`文件, 之后还会出现
1. 修改`history.py`文件

```python
for line in open(filename, 'r', encoding='utf-8'):
```

参考

- [Anaconda介绍、安装及使用教程](https://www.jianshu.com/p/62f155eb6ac5)
- [让你的Jupyter Notebook不再辣眼睛](https://zhuanlan.zhihu.com/p/46242116)
- [python启动时Failed calling sys.__interactivehook__错误原因及解决方法](https://blog.csdn.net/hongxingabc/article/details/102610442)
