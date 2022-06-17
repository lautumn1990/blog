---
title: arp寻找新的设备
tags: [ windows ]
categories: [ windows ]
key: arp-find-dev
pageview: true
---

有时候新接入的设备没有显示器, 无法查找设备的ip地址, 有两种方式查看

- 一种方式通过路由器上去查看
- 还有一种方式通过arp方式

通过`arp -a`命令可以查找局域网内ip地址和mac地址的对应关系, 不过该列表是一个缓存列表, 需要进行过通信才可以显示出来. 所以可以通过ping命令缓存一遍网段内的ip地址

<!--more-->

## linux

单线程, 慢

```sh
#!/bin/bash
iprange="192.168.0."
for var in {1..254};
do
 ip=$iprange$var
 ping -c 1 -w 1 -W 1 $ip >/dev/null 2>&1 
 if [ $? = 0 ];then
  echo "$ip [yes]"
 else
  echo "$ip [no]"
fi
done
```

多线程方式

```sh
#!/bin/bash
iprange="192.168.0."

echo "ping log:" > ./ping.txt
for i in {1..254}
do
 ping -c 1 -w 1 -W 1 $iprange$i | grep -q "ttl=" && echo "$iprange$i [yes]" >> ./ping.txt || echo "$iprange$i [no]" >> ./ping.txt &
done
echo "wait 5s...."
sleep 5
cat ./ping.txt
cat ./ping.txt | wc -l
```

## windows

单线程

```bat
for /l %i in (1,1,255) do @ping -w 20 -n 1 192.168.0.%i | find /i "ttl"
```

多线程

参考 [ip_scan](https://github.com/GordonVi/ip_scan)

```powershell
# Works Cited: Runspaces Simplified - https://blog.netnerds.net/2016/12/runspaces-simplified/

<#
.SYNOPSIS
  Scan an IP range and report how many IPs are alive.
  
.DESCRIPTION
  Uses Multi Threading and only 1 ping to accomplish the task faster. (Inspired by Angry IP SCanner)

.PARAMETER <Parameter_Name>
   In the top of the script, set your IP ranges. You can scan multiple ranges. Handy for corporate nets.
    
.INPUTS
  None
  
.OUTPUTS
  Text to Powershell Console
  
.NOTES
  Version:        1.01
  Author:         Gordon Virasawmi
  GitHub:          https://github.com/GordonVi
  Creation Date:  10/25/2019 @ 6:56pm
  Purpose/Change: Initial script development
  License:          Free for all. Too simple to charge for. Too important to not publish.
  
.EXAMPLE
  .\ip_scan.ps1
  
#>

# --------------------------------------------------

$threads = 1000 # how many simultanious threads. I've tested up to 1000 ok against ~3600 local IPs, ~900 active.

$list = for ($a=1; $a -le 255; $a++) # set the last octlet range
            {
                "10.0.0.$a" # set the first 3 octlets.
            }

# --------------------------------------------------
    
clear

""
write-host "       Threads: " -nonewline -foregroundcolor yellow
$threads
"    Build Pool: "
"    Drain Pool: "
" ---------------------"
write-host "   Total Hosts: $($list.count)"
write-host "   Alive Hosts: "
write-host "    Dead Hosts: "


# BLOCK 1: Create and open runspace pool, setup runspaces array with min and max threads
$pool = [RunspaceFactory]::CreateRunspacePool(1, $threads)
$pool.ApartmentState = "MTA"
$pool.Open()
$runspaces = $results = @()

# --------------------------------------------------
    
# BLOCK 2: Create reusable scriptblock. This is the workhorse of the runspace. Think of it as a function.
$scriptblock = {
    Param (
    [string]$ip
    )

    $ping=$(Test-Connection -ComputerName $ip -Count 1).scope.isconnected
    if ($ping -eq "true") {
    
                            $DNS=([System.Net.Dns]::GetHostByAddress($ip)).Hostname
                            #$mac=$($(arp -a $ip)[3]).Split(" ",[System.StringSplitOptions]::RemoveEmptyEntries)[1]
                            $mac=$(get-netneighbor -ipaddress $ip).LinkLayerAddress
                            
                            } else {

                            $DNS=""
                            $mac=""
                            }
       
    # return whatever you want, or don't.
    return [pscustomobject][ordered]@{
                                ip         = $ip
                                ping     = $ping
                                DNS        = $DNS
                                MAC        = $mac
                            } 
}

# --------------------------------------------------
 
# BLOCK 3: Create runspace and add to runspace pool
$counter=0
foreach ($ip in $list) {
 
    $runspace = [PowerShell]::Create()
    $null = $runspace.AddScript($scriptblock)
    $null = $runspace.AddArgument($ip)

    $runspace.RunspacePool = $pool
 
# BLOCK 4: Add runspace to runspaces collection and "start" it
    # Asynchronously runs the commands of the PowerShell object pipeline
    $runspaces += [PSCustomObject]@{ Pipe = $runspace; Status = $runspace.BeginInvoke() }

    $Host.UI.RawUI.CursorPosition = New-Object System.Management.Automation.Host.Coordinates 16 , 2
    $counter++
    write-host "$counter " -nonewline
}

# --------------------------------------------------
 
# BLOCK 5: Wait for runspaces to finish

<#

do {

    $Host.UI.RawUI.CursorPosition = New-Object System.Management.Automation.Host.Coordinates 5 , 9
    $cnt = ($runspaces | Where {$_.Result.IsCompleted -ne $true}).Count
    write-host "$cnt   "
    
    } while ($cnt -gt 0)

#>

# --------------------------------------------------

$total=$counter
$counter=0

# BLOCK 6: Clean up
foreach ($runspace in $runspaces ) {
    # EndInvoke method retrieves the results of the asynchronous call
    $results += $runspace.Pipe.EndInvoke($runspace.Status)
    $runspace.Pipe.Dispose()
    
    $Host.UI.RawUI.CursorPosition = New-Object System.Management.Automation.Host.Coordinates 16 , 3
    $counter++
    write-host "$($total-$counter) " -nonewline

}
    
$pool.Close() 
$pool.Dispose()

# --------------------------------------------------
 
# Bonus block 7
# Look at $results to see any errors or whatever was returned from the runspaces

# Use this to output to JSON. CSV works too since it's simple data.
# $results | convertto-json -depth 10 > ip_scan.json

$total=$results.count
$alive = $($results | ? {$_.ping -eq "true"}).count
$dead = $($results | ? {$_.ping -ne "true"}).count

$Host.UI.RawUI.CursorPosition = New-Object System.Management.Automation.Host.Coordinates 0 , 5

write-host "   Total Hosts: " -nonewline -foregroundcolor cyan
$total

write-host "   Alive Hosts: " -nonewline -foregroundcolor green
$alive

write-host "    Dead Hosts: " -nonewline -foregroundcolor red
$dead

""

$results | ? {$_.ping -eq "true"} | select ip,DNS,MAC
```

修改powershell权限, `Set-ExecutionPolicy RemoteSigned`, 修改38行左右的ip地址, 然后`.\ip_scan.ps1`执行

----

## 参考

- [Linux ping本网段所有Ip](https://www.csdn.net/tags/MtjaAgzsOTE1MjctYmxvZwO0O0OO0O0O.html)
- [ip_scan](https://github.com/GordonVi/ip_scan)
