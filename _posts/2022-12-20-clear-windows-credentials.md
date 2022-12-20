---
title: 删除windows凭据管理器
tags: [ windows ]
categories: [ windows ]
key: clear-windows-credentials
pageview: true
---

删除windows凭据管理器

<!--more-->

脚本

```bat
@echo off
cmdkey.exe /list > "%TEMP%\List.txt"
findstr.exe 目标 "%TEMP%\List.txt" > "%TEMP%\tokensonly.txt"
FOR /F "tokens=1,2 delims= " %%G IN (%TEMP%\tokensonly.txt) DO cmdkey.exe /delete:%%H
del "%TEMP%\List.txt" /s /f /q
del "%TEMP%\tokensonly.txt" /s /f /q
echo All done
pause
```

一行命令

```bat
for /f "tokens=1*" %a in ('cmdkey /list^|find "目标:"') do cmdkey /delete "%b"

rem 删除adobe
for /f "tokens=1*" %a in ('cmdkey /list^|find /i "adobe"') do cmdkey /delete "%b"
```

----

## 参考

- [How to clear all Credentials from Credential Manager in Windows](https://www.thewindowsclub.com/clear-all-credentials-from-credential-manager)
