+++
date = "2017-12-18T12:00:00-07:00"
title = "Update Application"
+++

Once a authentication token has been obtained, update the application's state, command, instances and more.

## Update State

```c#
// Guid would normally be retrieved from API
var appGuid = new Guid("05fe219f-1c82-4f67-9e13-b1a304f7695a");
UpdateAppRequest updateApp = new UpdateAppRequest();
updateApp.State = state;
UpdateAppResponse response = await client.Apps.UpdateApp(appGuid, updateApp);
Console.WriteLine("App {0} state is {1}", response.Name, response.State);
```

## Update Instances and Command

```c#
// Guid would normally be retrieved from API
var appGuid = new Guid("05fe219f-1c82-4f67-9e13-b1a304f7695a");
UpdateAppRequest updateApp = new UpdateAppRequest();
updateApp.Instances = 10;
updateApp.Command = command;
UpdateAppResponse response = await client.Apps.UpdateApp(appGuid, updateApp);
Console.WriteLine("App {0} has {1} instances running", response.Name, response.Instances.ToString());
```
