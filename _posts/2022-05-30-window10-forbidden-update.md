---
title: window10禁用自动更新
tags: [ windows ]
categories: [ windows ]
key: window10-forbidden-update
pageview: true
---

禁用windows10自动更新

<!--more-->

ps脚本函数

```powershell
#系统自动更新禁用
Function DisableWindowsUpdate {
    Write-Output "start to disable windows update"
    Stop-Service -Name "Windows Update"
    #net stop wuauserv
    #sc config wuauserv start=disable
    #net stop trustedinstaller
    #sc config trustedinstaller start=disable
    #组策略1：启用指定internal Microsoft更新服务位置
    If (!(Test-Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU")) {
        New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" -Force | Out-Null
    }
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" -Name "UseWUServer" -Type DWord -Value 1
    #组策略2：禁用配置自动更新
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" -Name "NoAutoUpdate" -Type DWord -Value 1
    #组策略3：删除使用所有 Windows 更新功能的访问权限
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" -Name "SetDisableUXWUAccess" -Type DWord -Value 1
    
    #组策略1：故意执行错误配置
    If (!(Test-Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate")) {
        New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" -Force | Out-Null
    }
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" -Name "WUServer" -Type String -Value "..."
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" -Name "WUStatusServer" -Type String -Value "..."
    #组策略4：不允许更新延迟策略对 Windows 更新执行扫描
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" -Name "DisableDualScan" -Type DWord -Value 1
    #组策略5：策略名称：指定可选组件安装和组件修复的设置
    If (!(Test-Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\Servicing")) {
        New-Item -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\Servicing" -Force | Out-Null
    }
    Set-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\Servicing" -Name "RepairContentServerSource" -Type DWord -Value 2
    Set-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\Servicing" -Name "UseWindowsUpdate" -Type DWord -Value 2
    Write-Output "disable windows update successful"
}
#系统自动更新禁用的反向操作
Function EnableWindowsUpdate {
    Write-Output "start to enable windows update"
    Start-Service -Name "Windows Update"
    #组策略1：禁用指定internal Microsoft更新服务位置
    If (!(Test-Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU")) {
        New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" -Force | Out-Null
    }
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" -Name "UseWUServer" -Type DWord -Value 0
    #组策略2：启动配置自动更新
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" -Name "NoAutoUpdate" -Type DWord -Value 0
    #组策略3：不删除使用所有 Windows 更新功能的访问权限
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" -Name "SetDisableUXWUAccess" -Type DWord -Value 0
    
    #组策略1：恢复错误配置
    If (!(Test-Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate")) {
        New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" -Force | Out-Null
    }
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" -Name "WUServer" -Type String -Value ""
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" -Name "WUStatusServer" -Type String -Value ""
    #组策略4：允许更新延迟策略对 Windows 更新执行扫描
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" -Name "DisableDualScan" -Type DWord -Value 0
    #组策略5：策略名称：指定可选组件安装和组件修复的设置
    If (!(Test-Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\Servicing")) {
        New-Item -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\Servicing" -Force | Out-Null
    }
    Remove-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\Servicing" -Name "RepairContentServerSource"
    Remove-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\Servicing" -Name "UseWindowsUpdate"
    Write-Output "enable windows update successful"
}
```

ps使用方法

```powershell
# 关闭自用更新
DisableWindowsUpdate

# 打开自动更新
EnableWindowsUpdate
```

----

## 参考

- [彻底禁用win10自动更新功能及其powershell代码](https://blog.csdn.net/ebowtang/article/details/123314323)
