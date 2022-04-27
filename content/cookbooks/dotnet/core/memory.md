+++
categories = ["recipes"]
date = "2017-11-28T05:42:00-05:00"
glyph = "fa-file-text-o"
summary = "Memory"
title = ".NET Core Memory GC"
taxonomy = ["CLIENT", "DOT_NET"]
+++

It's possible your ASP.NET Core app running on Linux could run out of memory from time to time because the garbage collector may not consider container memory limits.

{{% callout %}}
To ensure the best experience use `dotnetcore 2.0.2+` with Pivotal Cloud Foundry ERT 1.11.15+.
{{% /callout %}}

1. `dotnetcore 1.x` has no possibility to recognize the memory limit of cgroups. Fortunately `dotnetcore 2.0.0` introduces the concept of [recognizing cgroup limits](https://github.com/dotnet/coreclr/pull/10064).

2. `dotnetcore 2.0.0` still [does not recognise cgroup memory limits in containerized environments](https://github.com/dotnet/coreclr/issues/13489). This will only be [fixed](https://github.com/dotnet/coreclr/pull/13895) in `dotnetcore 2.0.2`. 

3. ERT did not provide the cgroup endpoint in `garden-runc`, therefore `dotnetcore` didn’t recognize the memory limit of the container and only used the VM memory size. [This was fixed](https://www.pivotaltracker.com/n/projects/1158420/stories/151206339) in `ERT 1.11.15`.

4. The amount of memory allocated by .NET Core is [related to the amount of cores and CPUs](https://docs.microsoft.com/en-us/dotnet/standard/garbage-collection/fundamentals#workstation_and_server_garbage_collection) in the system. Therefore we do see [large differences between environments](https://blog.markvincze.com/troubleshooting-high-memory-usage-with-asp-net-core-on-kubernetes/) and the memory footprint for small applications due to the amount of CPUs and cores in the system. By Default in systems with only one physical CPU `dotnetcore` will use `Workstation Garbage Collection`, while on systems with more than one CPU it will use `Server Garbage Collection`. The heuristic of `Server Garbage Collection` does prefer throughput over memory use.

5. Similar to not recognizing the correct memory in a container, the correct CPU share assigned to the container is currently not shared with `dotnetcore`. This will be [fixed](https://github.com/dotnet/coreclr/pull/13895) in `dotnetcore 2.0.2`
