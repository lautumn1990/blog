---
title: windows和linux在脚本中获取时间戳
tags: [ windows, linux ]
categories: [ windows ]
key: windows-linux-timestamp
pageview: true
---


## windows时间戳

<!--more-->

[DateTime.bat](/assets/sources/2021/09/DateTime.bat)

```bat
:: 编码格式 GB2312
:: 脚本创建时最好选择GB2312编码(方式很简单，新建txt文件，输入几个中文字符保存后将后缀.txt改成.bat)
:: @echo off 表示不回显执行的命令
@echo off 
@echo =========Windows的原本日期时间格式=======================
:: 设置变量，使用变量时需要用一对%包起来
set ORIGINAL_DATE=%date% 
echo %ORIGINAL_DATE%
 
@echo =========日期按照YYYY-MM-DD格式显示======================
:: 日期截取遵从格式 %date:~x,y%，表示从第x位开始，截取y个长度(x,y的起始值为0)
:: windows下DOS窗口date的结果 2016/09/03 周六
:: 年份从第0位开始截取4位，月份从第5位开始截取2位，日期从第8位开始截取2位
 
set YEAR=%date:~0,4%
set MONTH=%date:~5,2%
set DAY=%date:~8,2%
set CURRENT_DATE=%YEAR%-%MONTH%-%DAY%
echo %CURRENT_DATE%
 
@echo =========时间按照HH:MM:SS格式显示========================
:: 时间截取遵从格式 %time:~x,y%，表示从第x位开始，截取y个长度(x,y的起始值为0)
:: windows下DOS窗口time的结果 12:05:49.02 
:: 时钟从第0位开始截取2位，分钟从第3位开始截取2位，秒钟从第6位开始截取2位
 
set HOUR=%time:~0,2%
set MINUTE=%time:~3,2%
set SECOND=%time:~6,2%
 
:: 当时钟小于等于9时,前面有个空格，这时我们少截取一位，从第1位开始截取
set TMP_HOUR=%time:~1,1%
set NINE=9
set ZERO=0
:: 处理时钟是个位数的时候前面补上一个0, LEQ表示小于等于
if %HOUR% LEQ %NINE% set HOUR=%ZERO%%TMP_HOUR%
 
set CURRENT_TIME=%HOUR%:%MINUTE%:%SECOND%
echo %CURRENT_TIME%
 
@echo =========日期时间按照YYYY-MM-DD HH:MM:SS格式显示=========
set CURRENT_DATE_TIME=%YEAR%-%MONTH%-%DAY% %HOUR%:%MINUTE%:%SECOND%
echo %CURRENT_DATE_TIME%
 
@echo =========日期时间按照YYYYMMDD_HHMMSS格式显示=============
set CURRENT_DATE_TIME_STAMP=%YEAR%%MONTH%%DAY%_%HOUR%%MINUTE%%SECOND%
echo %CURRENT_DATE_TIME_STAMP%
@echo =========================================================
```

## linux时间戳

[DateTime.sh](/assets/sources/2021/09/DateTime.sh)

```shell
echo "====================================================="
echo "show linux original format date and time:"
echo DateTime: $(date)
echo "====================================================="
 
echo "show date time like format: YYYY-MM-DD HH:MM:SS"
NOW_DATE_TIME=$(date "+%Y-%m-%d %H:%M:%S")
echo $NOW_DATE_TIME
echo "====================================================="
 
echo "show date time like format: YYYYMMDD-HHMMSS"
NOW_TIME=$(date "+%Y%m%d-%H%M%S")
echo $NOW_TIME
echo "====================================================="
 
echo "show last year:"
LAST_YEAR=$(date "+%Y-%m-%d %H:%M:%S" --date="-1 years")
echo $LAST_YEAR
echo "====================================================="
 
echo "show next year:"
NEXT_YEAR=$(date "+%Y-%m-%d %H:%M:%S" --date="1 years")
echo $NEXT_YEAR
echo "====================================================="
 
echo "show last month:"
LAST_MONTH=$(date "+%Y-%m-%d %H:%M:%S" --date="-1 months")
echo $LAST_MONTH
echo "====================================================="
 
echo "show next month:"
NEXT_MONTH=$(date "+%Y-%m-%d %H:%M:%S" --date="1 months")
echo $NEXT_MONTH
echo "====================================================="
 
echo "show last day:"
LAST_DAY=$(date "+%Y-%m-%d %H:%M:%S" --date="-1 days")
echo $LAST_DAY
echo "====================================================="
 
echo "show next day:"
NEXT_DAY=$(date "+%Y-%m-%d %H:%M:%S" --date="1 days")
echo $NEXT_DAY
echo "====================================================="
 
echo "show last hour:"
LAST_HOUR=$(date "+%Y-%m-%d %H:%M:%S" --date="-1 hours")
echo $LAST_HOUR
echo "====================================================="
 
echo "show next hour:"
NEXT_HOUR=$(date "+%Y-%m-%d %H:%M:%S" --date="1 hours")
echo $NEXT_HOUR
echo "====================================================="
 
echo "show last minute:"
LAST_MINUTE=$(date "+%Y-%m-%d %H:%M:%S" --date="-1 minutes")
echo $LAST_MINUTE
echo "====================================================="
 
echo "show next minute:"
NEXT_MINUTE=$(date "+%Y-%m-%d %H:%M:%S" --date="1 minutes")
echo $NEXT_MINUTE
echo "====================================================="
 
echo "show last second:"
LAST_SECOND=$(date "+%Y-%m-%d %H:%M:%S" --date="-1 seconds")
echo $LAST_SECOND
echo "====================================================="
 
echo "show next second:"
NEXT_SECOND=$(date "+%Y-%m-%d %H:%M:%S" --date="1 seconds")
echo $NEXT_SECOND
echo "====================================================="
```

## 参考

- [Windows下bat脚本获取时间对比Linux下shell脚本获取时间](https://blog.csdn.net/qq981378640/article/details/52422662)
