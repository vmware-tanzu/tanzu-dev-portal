+++
date = "2018-06-12T12:00:00-07:00"
title = "SMB Shares"
weight = 60
+++

ASP.NET applications deployed to PCF are running on Diego Windows Cells which are not joined to any domain. Typically in a Cloud Foundry environment connecting to an enterprise SMB share requires domain authentication and as a result consuming a SMB share from a Windows cell requires some additional configuration that is usually handled by a Windows server admin. 

### !UPDATE

Please refer to the updated SMB shares recipe [here](https://dotnet-cookbook.cfapps.io/windows/smb).

## PAS

Pivotal Application Service using an Ubuntu stemcell doesn't have a native SMB driver by default. Fortunately there's a cloud native solution to connect an application (.NET Core) to a SMB share using the [SMB Volume Service][volsvc]. The SMB Volume Service broker needs to be installed into your Pivotal Cloud Foundry deployment and made available in the marketplace by a PCF platform operator.

## PASW

SMB shares requires authentication which can be enabled by using .NET wrapper around the native [Windows Networking API][winapi] via the [Steeltoe Common .NET Network library](nuget). Note this is an experimental feature and is currently limited to IP address UNC paths

```ps
Install-Package Steeltoe.Common.Net
```

Use Disposable `WindowsNetworkFileShare` class to enable `FileOperations` on Shared Drives

```c#
using Steeltoe.Common.Net;
...

NetworkCredential credential = new NetworkCredential(user, password, domain);
using (WindowsNetworkFileShare networkPath = new WindowsNetworkFileShare(uncPath, credential))
{
  //File Operations on the files/directories in uncPath inside using block
  File ff = new File();
  ...
}
 ```

Open Source for the library - [Source Code on GitHub][source]

[volsvc]: https://docs.pivotal.io/partners/smb-volume-service/index.html "SMB Volume Service"
[winapi]: https://msdn.microsoft.com/en-us/library/windows/desktop/aa385413(v=vs.85).aspx "Windows Networking API"
[nuget]: https://myget.org/feed/steeltoedev/package/nuget/Steeltoe.Common.Net "Nuget Dev Feed"
[source]: https://github.com/SteeltoeOSS/Common/tree/dev "Source Code in GitHub"
[sharpcifs]: http://sharpcifsstd.dobes.jp/ "Cross-Platform SMB Client implements on C#"


