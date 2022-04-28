+++
title = "Find Installed .NET Version"
date =  2017-09-01T14:47:18-07:00
tags = [ "DOT_NET","Versions" ]
weight = 60
+++

## RootFS .NET Version

The version of the .NET Framework that an application runs with on PCF is controlled by rootfs of the container, and therefore the version of Windows you're using. The [rootfs](https://github.com/cloudfoundry/windows2016fs/blob/master/2019/Dockerfile) has the `Web-ASP-Net45` Windows feature enabled and uses the version of .NET that ships with the latest patched OS.

## Query PASW Installed .NET Version

You can find what version of .NET is installed on your Windows stack by running a PowerShell script pushed as an application in PCF without needing `cf ssh`. Copy the below script to a new file named `dotnetversion.ps1` on your workstation.

```PS
function GetDotNetVersion($k) {
  if ($k -ge 528040) { return "4.8" }
  if ($k -ge 461808) { return "4.7.2" }
  if ($k -ge 461308) { return "4.7.1" }
  if ($k -ge 460798) { return "4.7" }
  if ($k -ge 394802) { return "4.6.2" }
  if ($k -ge 394254) { return "4.6.1" }
  if ($k -ge 393295) { return "4.6" }
  if ($k -ge 379893) { return "4.5.2" }
  if ($k -ge 378675) { return "4.5.1" }
  if ($k -ge 378389) { return "4.5" }
  return "Unknown - $k"
}

$k = gci 'HKLM:\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full\' | Get-ItemPropertyValue -Name Release
$v = GetDotNetVersion $k
Write-Output "Found .NET Framework $v"

# Make this a long running process so the app "starts"
while ($true) {
  Start-Sleep -Seconds 1  
}
```

From the directory you placed this script run the following commands. This will execute the script on PCF and grab the script output.

```bash
$ cf push dotnetversion -c 'powershell.exe -file dotnetversion.ps1' --no-route -s windows -b binary_buildpack -u none
$ cf logs dotnetversion --recent
```

The logs will have the installed .NET Framework version available on the rootfs of your Windows stack, similar to this:

```
2019-06-25T10:31:00.42-0700 [APP/PROC/WEB/0] OUT Found .NET Framework 4.7.2
```