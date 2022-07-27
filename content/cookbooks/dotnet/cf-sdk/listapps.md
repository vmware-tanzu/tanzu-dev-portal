+++
date = "2017-12-18T12:00:00-07:00"
title = "List All Applications"
+++

Once a authentication token has been obtained, you can request a paged response of all the applications. The application GUID is particularly important for updating an application via the API.

```c#
PagedResponseCollection<ListAllAppsResponse> apps = await client.Apps.ListAllApps();

foreach (var app in apps)
{
    Console.WriteLine("Application {0}, guid {1}, state {2}", app.Name, app.EntityMetadata.Guid, app.State);
}
```
