+++
summary = "Locally debug an ASP.NET application using hwc.exe"
title = "Local Debugging (hwc.exe)"
date = 2018-10-02T09:08:44-05:00
+++

#### Here are few steps that can guide you, to use hwc.exe to launch an ASP.NET application, from your local machine (Windows only), helps in debugging your application very easily

- Download the latest version of hwc.exe from `https://github.com/cloudfoundry/hwc/releases`
- Install four IIS features in you windows machine, you can run PS as **Administrator** and execute the below commands

```ps
Enable-WindowsOptionalFeature -Online -All -FeatureName IIS-WebServer
Enable-WindowsOptionalFeature -Online -All -FeatureName IIS-WebSockets
Enable-WindowsOptionalFeature -Online -All -FeatureName IIS-HostableWebCore
Enable-WindowsOptionalFeature -Online -All -FeatureName IIS-ASPNET45
```

- Restart your machine, after successful execution of the above commands
- Place the downloaded `hwc.exe` file in the folder where your applications `web.config` resides OR optionally you can can pass the path of the application as argument `-appRootPath`
- In PowerShell, navigate to the folder and run the following command, with your choice of port. Make sure that you are running as **Administrator** to work properly

```ps
& { $env:PORT=5000; .\hwc.exe; }
```

OR (if application is in a different path)

```ps
& { $env:PORT=5000; .\hwc.exe -appRootPath "<Path of the application>" }
```

- Launch your application in the browser of your choice, having the url as below, make sure the port is same as the one given above.

```text
http://localhost:5000
```
- You should be able to see your application running, now that you can attach `hwc.exe` to the VS Debugger (`Alt+D+P`) and enjoy debugging

##### Hope you have fun debugging!
