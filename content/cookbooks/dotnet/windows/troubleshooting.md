+++
date = "2018-06-04T12:00:00-07:00"
title = "Troubleshooting"
description = "Windows cell/container troubleshooting tips"
weight = 5
+++

Windows cell troubleshooting from an abstract perspective isn't much different than Linux cell troubleshooting. The main differences appear in the commands and tools you use, but the techniques and approaches are very similar.

Here's a braindump of a some Windows commands you might find useful, especially from a remote `bosh ssh` or `cf ssh` terminal. All the commands below assume you're running from a PowerShell session unless otherwise stated. You can start PowerShell by typing `powershell` from your SSH session's CMD prompt.

### Test Network Connectivity

Windows doesn't have netcat (nc) to test IP and port connectivity, but it does have the `Test-NetConnection` cmdlet built into PowerShell which does a similar job.

```powershell
PS C:\> Test-NetConnection 8.8.8.8 -Port 53

ComputerName     : 8.8.8.8
RemoteAddress    : 8.8.8.8
RemotePort       : 53
InterfaceAlias   : Ethernet
SourceAddress    : 10.0.2.15
TcpTestSucceeded : True
```

### `Wget`

PowerShell has `wget` aliased to the `Invoke-WebRequest` cmdlet. You can use `wget` to test a http endpoint or download a file.

```powershell
wget https://api.example.com -UseBasicParsing
```

It's important to provide the `-UseBasicParsing` flag otherwise you'll see a questionable error about some Internet Explorer setting that you can't get to without a GUI.

If want to download a file, I highly recommend that you turn off the progress stream via `$ProgressPreference = 'SilentlyContinue'` in PowerShell as it slows your download times by an order of magnitude. 

```powershell
PS C:\> $ProgressPreference = 'SilentlyContinue'
PS C:\> wget https://example.com/somefile.msi -OutFile somefile.msi
```

### View Windows Event Logs

Viewing event logs from Windows Server Core can be a bit challenging at first since there's no Event Viewer (`eventvwr`). If you've enabled the Syslog configuration in the PASW tile you can view your event logs through the firehose, otherwise keep reading.

```powershell
PS> Get-EventLog -LogName system -EntryType error

Index Time          EntryType   Source                 InstanceID Message
----- ----          ---------   ------                 ---------- -------
 3623 Apr 02 15:10  Error       Schannel                    36874 An SSL 3.0 connection requ...
 1852 Apr 02 11:18  Error       Service Control M...   3221232503 The route_emitter_windows...

PS C:\> Get-EventLog -logname system -index 1852 | Select -ExpandProperty Message

The route_emitter_windows service terminated unexpectedly.  It has done this 2 time(s).  The following corrective action will be taken in 5000 milliseconds: Restart the service.
```

### Working with Bosh Job Logs

The bosh job logs are in the same directory structure as on Linux cells. You can cd into the job log directory and use `select-string` to grep for specific text.

```powershell
PS C:\> cd /var/vcap/sys/log/clam_av
PS C:\> Select-String install.log -pattern error

install.log:220:Property(S): ErrorDialog = ErrorDialog
install.log:325:MSI (s) (70:9C) [11:14:17:649]: Windows Installer installed the product. Product Name: ClamAV. Product
Version: 0.100.1. Product Language: 1033. Manufacturer: Cisco Systems, Inc. Installation success or error status: 0.
```

Search through all job logs at once:

```powershell
PS C:\> cd /var/vcap/sys/log
PS C:\> Get-ChildItem -Recurse | Select-String "error" -List | Select Path

Path
----
C:\var\vcap\sys\log\clamav-windows\install.log
C:\var\vcap\sys\log\enable_ssh\pre-start.stderr.log
C:\var\vcap\sys\log\garden-windows\garden-windows\job-service-wrapper.out.log
```

Tail a job log using `cat` with the `-wait` argument:

```powershell
PS C:\> cat clamd.log -Wait -Tail 5

Tue Apr  2 11:18:49 2019 -> +++ Started at Tue Apr  2 11:18:49 2019
Tue Apr  2 11:18:49 2019 -> Received 0 file descriptor(s) from systemd.
Tue Apr  2 11:18:49 2019 -> clamd daemon 0.100.1 (OS: win32, ARCH: x86_64, CPU: x86_64)
Tue Apr  2 11:18:49 2019 -> Log file size limited to 1048576 bytes.
Tue Apr  2 11:18:49 2019 -> Reading databases from C:\var\vcap\data\clamav-windows
```

### Editing Text

There is currently no out of the box command line text editor built into Windows, however that doesn't mean you can't install a 3rd party one. A decent one that's easy to install is Nano.

```powershell
PS C:\> $ProgressPreference = 'SilentlyContinue'
PS C:\> wget `
  https://nano-editor.org/dist/win32-support/nano-git-0d9a7347243.exe `
  -OutFile nano.exe
PS C:\> .\nano C:\var\vcap\jobs\clamav-windows\clamd.conf
```

### Network Tracing

You may encounter network issues which will require you to run `tcpdump`, but unfortunatley there's no builtin TCP dump in Windows. In these cases Windows has the ability to capture network traffic with `netsh trace`. These traces are written to binary `.etl` files which can then be read by [Microsoft Message Analyzer](https://www.microsoft.com/en-us/download/details.aspx?id=44226) or by Powershell's `Get-WinEvent` cmdlet.

To start a capture run the `netsh trace start` command.

```powershell
netsh trace start capture=yes tracefile="$env:TEMP\nettrace.etl"
```

Do your network operations you want to capture, then stop the trace

```powershell
netsh trace stop
```

You can either open the trace file in Message Analyzer or using PowerShell. Here's how you do it in PowerShell. Note that the `-Oldest` flag is required otherwise you'll get an error.

```powershell
PS C:\> $l = Get-WinEvent -Path "$env:TEMP\nettrace.etl" -Oldest
PS C:\> $l | Select-Object
```

### Exec Into a Running Container as Admin

Sometimes you may need to troubleshoot a running container or a sidecar container without using `cf ssh` or _with_ local Administrator privileges. You can use `winc exec` similar to `docker exec` from a running container's host VM. This of course requires that you `bosh ssh` into the host container's VM first.

Assuming you're logged into the host VM and have a PowerShell shell, find the container `Id` by running

```powershell
PS C:\> Get-ComputeProcess

Id                : 97cfaf3b-d385-4746-7a3d-af00
Type              : Container
Isolation         : Process
IsTemplate        : False
RuntimeId         : 00000000-0000-0000-0000-000000000000
RuntimeTemplateId :
RuntimeImagePath  :
Owner             :
```

With the container Id in hand, use `winc` to start a PowerShell session on the container, for example:

```powershell
PS C:\> C:\var\vcap\packages\winc\winc.exe exec 97cfaf3b-d385-4746-7a3d-af00 powershell
```

You can instead login as the vcap container user by adding `--user vcap`.

### Get Running Process Command Line

If you need to find the command line used to start a running process you can use `Get-CimInstance`. Here's an example that gets all the running nginx processes command lines.

```powershell
PS C:\> Get-CimInstance Win32_Process -Filter "name = 'nginx.exe'" | Select CommandLine | Out-String -Width 160

CommandLine
-----------
C:\etc\cf-assets\envoy\nginx.exe -p C:\Users\ContainerAdministrator\AppData\Local\Temp\nginx007262991
```

We use `Out-String` so the command line isn't truncated automatically at 80 chars.
