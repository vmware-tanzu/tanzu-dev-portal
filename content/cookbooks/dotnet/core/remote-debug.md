+++
title = "Remote Debug"
summary = "Remote debuging .NET Core application running in PCF Linux containers"
date =  2018-11-08T13:30:18-05:00
weight = 5
+++

#### Remote debuging .NET Core application running in PCF Linux containers

{{% callout %}}
This process works best when application is scaled down to one instance
{{% /callout %}}

* Publish project using Debug profile to include PDB and push to PCF
* Install remote debugging tools into container

```sh
cf ssh APP_NAME -c "curl -sSL https://aka.ms/getvsdbgsh | bash /dev/stdin -v latest -l ~/vsdbg/vsdbg"
```

## For Visual Studio

* Create a file called `launch.json` as following (replace `APP_NAME`)

```json
{
  "version": "0.2.0",
  "adapter": "cf",
  "adapterArgs": "ssh APP_NAME -c \"/tmp/lifecycle/shell /home/vcap/app 'bash -c \\\"~/vsdbg/vsdbg --interpreter=vscode\\\"'\"",
  "languageMappings": {
    "C#": {
      "languageId": "3F5162F8-07C6-11D3-9053-00C04FA302A1",
      "extensions": [ "*" ]
    }
  },
  "exceptionCategoryMappings": {
    "CLR": "449EC4CC-30D2-4032-9256-EE18EB41B62B",
    "MDA": "6ECE07A9-0EDE-45C4-8296-818D8FC401D4"
  },
  "configurations": [
    {
      "name": ".NET Core Launch",
      "type": "coreclr",
      "processName": "dotnet",
      "request": "attach",
      "justMyCode": false,
      "cwd": "~/app",
      "logging": {
        "engineLogging": true
      }
    }
  ]
}
```

* From Visual Studio Command Window (View > Other Windows > Command Window), start debugging with the following command

```ps
DebugAdapterHost.Launch /LaunchJson:FULL_PATH_TO\launch.json
```

### Troubleshooting

To have the debug adapter host logs appear in the Visual Studio Output Window enable logging from `View -> Other Windows -> Command Window` and type:

```
DebugAdapterHost.Logging /On /OutputWindow
```


## For Visual Studio Code

* Edit `.vscode\launch.json` (Debug > Open Configurations). Replace `APP_NAME` below

```json
{
    "name": ".NET Core Remote Attach",
    "configurations": [
      {
        "name": ".NET Core Attach",
        "type": "coreclr",
        "request": "attach",
        "processName": "dotnet",
        "pipeTransport": {
          "pipeCwd": "${workspaceFolder}",
          "pipeProgram": "cf",
          "pipeArgs": [
            "ssh", "APP_NAME", "-c", "\"/tmp/lifecycle/shell /home/vcap/app 'bash -c \\\"${debuggerCommand}\\\"'\"" ],
          "logging": {
              "engineLogging": true
          },
          "debuggerPath": "~/vsdbg/vsdbg"
        }
      }
    ],
}
```

* Start debugging 