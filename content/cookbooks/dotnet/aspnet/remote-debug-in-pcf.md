+++
summary = "Remote debug an ASP.NET application running in Windows 2016 PCF containers"
title = "Remote Debugging"
date = 2018-09-21T09:08:44-05:00
+++

## Remote debug an ASP.NET application running in Windows 2016 PCF containers

### Pre-requisites

- Visual Studio 2012 (any edition) or higher (I used VS 2017 / 15.4)
- Remote Tools should be installed (Ref: https://docs.microsoft.com/en-us/visualstudio/debugger/remote-debugging?view=vs-2017#download-and-install-the-remote-tools)
- Application should run in a remote machine or container where SSH is enabled. In PCF, please use `cf ssh-enabled <app_name>` to ensure.
- Windows2016 stacks are necessary in PCF, ensure using `cf stacks` command

### Steps

- Create a simple ASP.NET web forms application. (Use an existing one, if you have already)
    - Open Visual studio and navigate to `File`->`New Project`
    - Select ASP.NET Web Forms and follow the instructions to create the application
    - Make sure to do run the application (`F5` or `Ctl+F5`) and ensure that the application is working fine
- Publish the application in Debug mode
    - Right click on the Project in Solution explorer
    - Select `Publish Web App`, in the opened window, under `Connection` tab, select `File System` as `Publish Method` 
    - Choose a target location for the published artifacts, in my sample I chose `c:\AppArtifacts\RemoteDebugging`
    - Under `Settings` tab, select `Debug` as `Configuration`
    - Expand `File Publish Options` and select all the check boxes
    - Click on `Configure` link near to `Precompile during publish option`, a new window will be opened
    - Make sure to check `Emit debug information`. It is very important to select debug info emmit option, elso no sumbols will be loaded for debugging.
    - Other options are optional and make it as appropriate. In my case, I checked `Allow precompiled site to be updatable` and selected `Do not merge` options
    - Press `Ok` button takes you to the parent form where you can click `Publish`
    - Once publish is successfully completed, you can navigate to the targetted location, in my case `c:\AppArtifacts\RemoteDebugging`, where I should see all the buplished artifacts. 
- Now, we need to find the appropriate remote debugging tools, for the version of Visusl studio you are using. In my case I used VS2017.
    - You can use some simple tips to find it out. In windows explorer, navigate to `c:\` and search for `msvsmon.exe`. This will show you number of locations based on the number of Visual Studio version you have.
    - In my case, since I have Visual studio 2017, I chose `C:\Program Files (x86)\Microsoft Visual Studio\2017\Enterprise\Common7\IDE\Remote Debugger\x64`
    - Create a new folder called `vs_dubugger` under our artifacts directory, e.g. `c:\AppArtifacts\RemoteDebugging\vs_dubugger`
    - Copy all the files and folders recursively from the identified remote tools folder `C:\Program Files (x86)\Microsoft Visual Studio\2017\Enterprise\Common7\IDE\Remote Debugger\x64\*` to `c:\AppArtifacts\RemoteDebugging\vs_dubugger`
    - You can follow the above commands from power shell as below. Open PowerShell in `Administrator` mode and execute the below commands. Modify the path and variables accordingly.
        
        ```ps
        PS C:\> md c:\AppArtifacts\RemoteDebugging\vs_dubugger
        PS C:\> cp -Recurse -Force C:\Program Files (x86)\Microsoft Visual Studio\2017\Enterprise\Common7\IDE\Remote Debugger\x64\* c:\AppArtifacts\RemoteDebugging\vs_dubugger
        ```

- Make sure you have the remote tools are copied by executing the below commands. It should open a window showing the help document of the tool msvsmon.exe       
        
    ```ps
    PS C:\> cd c:\AppArtifacts\RemoteDebugging\vs_dubugger
    PS C:\AppArtifacts\RemoteDebugging\vs_dubugger> .\msvsmon.exe
    ```

- Push the application to PCF
    - Make sure you have installed and logged in into CF CLI, ensure by executing the command `cf target`. This should show the endpoint, org, space details, etc.
    - Navigate to the artifacts directory and do a cf push, make sure the app is being pushed to `Windows2016` stack
        
        ```ps
        PS C:\> cd c:\AppArtifacts\RemoteDebugging 
        PS C:\AppArtifacts\RemoteDebugging> cf push <app_name> -s Windows2016 -b hwc_buildpack
        ```

    - You can use `cf app <app_name>` and find the status of the running app. You can also, either `curl` or launch the app in any browser of your choice. Make sure the app is running properly.
- SSH and setting up remote debugger in the container
    - You can ssh into the container using the below PS command. Type to `cf ssh --help` for more details on ssh command. Also you can use any port, not necessarily `4020`
        
        ```ps
        PS C:\> cf ssh <app_name> -L 4020:localhost:4020
        ```

    - If connected successfully, you should see some thing like below
        
        ```ps
        Microsoft Windows [Version 10.0.16299.492]
        (c) 2017 Microsoft Corporation. All rights reserved.
        
        C:\Users\vcap>
        ```

    - Now you can continue following the below PS commands, here we navigate to the `vs_debugger` folder where we copied the remote tools into
        
        ```ps
        C:\Users\vcap> powershell
        PS C:\Users\vcap>cd app
        PS C:\Users\vcap\app>cd vs_debugger
        PS C:\Users\vcap\app\vs_debugger> ls
        ```

    - Launching the debugger, in my case i used port `4020`
        
        ```ps
        PS C:\Users\vcap\app\vs_debugger> .\msvsmon.exe /noauth /silent /nosecuritywarn /anyuser /port 4020
        PS C:\Users\vcap\app\vs_debugger> ps
        ```

    - This should list all the running processes, you can filter using ` ps | findstr msvsmon`, where you should be able to see `msvsmon.exe` up and running. You should see something similar to below
        
        ```ps
        196      12     2196       8656       0.05    392   4 msvsmon
        140       9     1584       7136       0.03   4092   4 msvsmon
        ```

    - To check the ports, use the below PS commands
        
        ```ps
        PS C:\Users\vcap\app\vs_debugger> ps
        ```

    - You can use filters like `netstat -aon | findstr 4020` where you should see some results as below
        
        ```ps
        TCP    0.0.0.0:4020           0.0.0.0:0              LISTENING       4092
        TCP    [::]:4020              [::]:0                 LISTENING       4092
        ```

    - Now that your container and the app instance is all set for debugging
    
- Connecting Visual Studio debugger to the remote container
    - Open the application you are trying to debug, in Visual Studio **(make sure it should be of the same version of remote tools you pushed into the container)**
    - Navigate to `Debug` menu and click on `Attach to Process`, Or use shortcut `Alt+D+P`. A new window will open.
    - For `Attached To`, Click the Select button so that a window will be opened with various attach options, Here you check `Managed (v4.6, v4.5, v4.0) code` only and uncheck rest . By default it will be set to `Automatically determined`
    - Go to `Connection Type` and select `Remote (no authentication)` from the dropdown. By default it will be selected as `Default`
    - Go to `Connection Target` and type `localhost:4020` and press Enter. Here 4020 is the port I opened for tunneling into the container, refer to above steps if not sure.
    - Now you should see all the process running in the container, under `Available Processes` list. 
    - Select `hwc.exe` and click `Attach` button. You should see the symbols being loaded and ready to debug.
    - You can set your break points as such and invoke via browser, should see debugger hitting the breakpoint.

- Recording available @ https://pivotal.zoom.us/recording/share/1geXhHFIgIPb8tvg7tmLJIBCa2jV40Gc87GQKC0aSoCwIumekTziMw

##### Hope you have fun debugging!
