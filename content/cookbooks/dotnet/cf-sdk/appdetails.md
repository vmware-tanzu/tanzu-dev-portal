+++
date = "2017-12-18T12:00:00-07:00"
title = "Application Details"
+++

Once a authentication token has been obtained, you can request the details of an application. The application GUID would normally be retrieved from the API.

```c#
// Guid would normally be retrieved from API
var appGuid = new Guid("05fe219f-1c82-4f67-9e13-b1a304f7695a");
var app = await client.Apps.RetrieveApp(appGuid);

Console.WriteLine("App {0} state is {1}", app.Name, app.State);
```
