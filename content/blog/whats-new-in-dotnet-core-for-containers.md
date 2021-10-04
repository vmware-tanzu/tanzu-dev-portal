---
date: 2020-07-22
description: 'Looking at recent changes in .NET 3.0 and 3.1 for containerized workloads '
lastmod: '2021-02-22'
patterns:
- Deployment
tags:
- Containers
- Microservices
- ".NET"
team:
- Santiago Vasquez
title: What’s New in .NET Core for Containers and Microservices
---

Throughout most of my career as a developer, I have written code using .NET (mostly C#). But lately, I have been spending more time with Spring, and I keep hearing comments about exciting changes in .NET around containers. I decided it was time to go back and check out what I had missed. This article highlights some of these changes, emphasizing the ones most relevant to containers and microservices; after all, I am part of the [VMware Tanzu Portfolio](https://tanzu.vmware.com/tanzu). 

Microsoft released .NET Core 3.0 on Sept. 23, 2019, and a couple of months later, on Dec. 3, 2019, version 3.1 followed. Version 3.0 had already reached its end of life, while version 3.1, with its LTS designation, will have support until Dec. 3, 2022 (more details [here](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)).

.NET Core 3.1 contains a tiny number of changes compared to version 3.0. These are mainly related to Blazor and Windows Desktop, in addition to the LTS designation. The bulk of significant changes were in version 3.0. I have selected a subset of items that I believe have a more significant impact on my day-to-day role at VMware Tanzu Labs. For the complete list of changes, go [here](https://devblogs.microsoft.com/dotnet/announcing-net-core-3-0/) and [here](https://devblogs.microsoft.com/dotnet/announcing-net-core-3-1/).


## From Container-Friendly to Container-Aware

Before version 3, running .NET Core in a container was not for the faint of heart. CoreCLR was inefficient when allocating GC heaps and quickly ran into Out-of-Memory situations. The new version of .NET Core has made significant progress to make it a correct container runtime by adding support for memory and CPU limits.

Microsoft is actively producing images for multiple platforms (x64, ARM32, ARM64) and operating systems (macOS, Alpine, CentOS, Debian, Fedora, Ubuntu, Windows).

The example below creates an Alpine-based Docker image for an ASP.NET Core 3.1 application that runs in a container limited to 10MB of memory.

#### Dockerfile.alpine-x64-slim

```
# https://hub.docker.com/_/microsoft-dotnet-core
FROM mcr.microsoft.com/dotnet/core/sdk:3.1-alpine AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY *.sln .
COPY aspnetapp/*.csproj ./aspnetapp/
RUN dotnet restore -r linux-musl-x64

# copy everything else and build app
COPY aspnetapp/. ./aspnetapp/
WORKDIR /source/aspnetapp
RUN dotnet publish -c release -o /app -r linux-musl-x64 --self-contained true --no-restore /p:PublishTrimmed=true /p:PublishReadyToRun=true

# final stage/image
FROM mcr.microsoft.com/dotnet/core/runtime-deps:3.1-alpine
WORKDIR /app
COPY --from=build /app ./

ENTRYPOINT ["./aspnetapp"]
```

#### Build the ASP.NET Core App Docker image
`docker build --pull -t aspnetapp:alpine-slim -f Dockerfile.alpine-x64-slim .`

#### Run the ASP.NET Core App Docker container limiting memory

`docker run --rm -d -p 8080:80 -m=10mb --name my-aspnet-app aspnetapp:alpine-slim`


## Docker Images Size Improvements

.NET Core 3.0 brings smaller runtime Docker images. For example, the ASP.NET Core runtime Docker image for the Alpine distribution is a little over 100MB. There are also additional size improvement examples from the Linux amd64 images on [Docker Hub](https://hub.docker.com/_/microsoft-dotnet-core-aspnet/):

```
Alpine
3.1.6-alpine3.12 = 105MB (34% smaller)
2.1.20-alpine3.12 = 160MB

Debian
3.1.6-buster-slim = 207MB (18% smaller)
2.1.20-stretch-slim = 253MB

Ubuntu
3.1.6-focal = 221MB (20% smaller)
2.1.20-focal = 276MB
```

In addition to smaller runtime images, the SDK includes a tool that analyzes an application and creates self-contained distributions that include only the required runtime libraries, reducing the image size even further (more details [here](https://docs.microsoft.com/en-us/dotnet/core/deploying/trim-self-contained)).

## Faster Start-up Time by Default

.NET Core 2.x had tiered compilation disabled by default. Version 3.0 enables it by default. With tiered compilation, one can opt to have the first tier compilation load precompiled code from assemblies created using the `ReadytoRun` format (more details [here](https://docs.microsoft.com/en-us/dotnet/core/whats-new/dotnet-core-3-0#readytorun-images)) ahead of time instead of just-in-time.

To compile a project using the `ReadyToRun` format, add the `<PublishReadyToRun>` setting:

```
<PropertyGroup>
  <PublishReadyToRun>true</PublishReadyToRun>
</PropertyGroup>
```

Then publish as a self-contained app. The example below targets the Linux ARM64 runtime.

```
dotnet publish -c Release -r linux-arm64 --self-contained
```

## gRPC Support

ASP.NET Core 3.0 adds support for building gRPC services that are well suited for microservices scenarios requiring low latency and high throughput. In addition, the Protobuf lightweight message payloads are ideal for limited bandwidth channels like 2G and 3G mobile networks.

Proto files included in .NET applications automatically generate .NET types for gRPC services, client, and messages.

#### Proto file (Greeter.proto)
```
syntax = "proto3";

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply);
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}
```

.NET types generated from proto files can be used as base classes and can be connected to other .NET Core features like Dependency Injection, Logging, Authentication, etc.

#### GreeterService.cs
```
public class GreeterService : Greeter.GreeterBase
{
	private readonly ILogger<GreeterService> _logger;

	public GreeterService(ILogger<GreeterService> logger)
	{
    	_logger = logger;
	}

	public override Task<HelloReply> SayHello(HelloRequest request,
    	ServerCallContext context)
	{
    	_logger.LogInformation("Saying hello to {Name}", request.Name);
    	return Task.FromResult(new HelloReply
    	{
        	Message = "Hello " + request.Name
    	});
	}
}
```

gRPC services can be hosted on ASP.NET Core applications.

#### Startup.cs
```
app.UseEndpoints(endpoints =>
{
	endpoints.MapGrpcService<GreeterService>();
});
```

Mode details can be found [here](https://docs.microsoft.com/en-us/aspnet/core/grpc/?view=aspnetcore-3.1).

## Browser SameSite

Changes in the SameSite implementation (an HTTP cookies standard extension) by Chrome and Firefox are breaking authentication mechanisms in sites that use OpenID and other protocols that must opt out by sending the HTTP header `SameSite=none`. ASP.NET Core 3.1 updated the default cookie-emitting behaviors to match the changes in the latest versions of popular browsers (more details [here](https://devblogs.microsoft.com/aspnet/upcoming-samesite-cookie-changes-in-asp-net-and-asp-net-core/) and [here](https://docs.microsoft.com/en-us/dotnet/core/compatibility/3.0-3.1#http-browser-samesite-changes-impact-authentication)).


## Other Changes Worth Calling Out

- C# 8 includes new features, like async streams, nullable reference types, static local functions, using declarations, additional pattern matchings, interfaces default implementations
- Diagnostic improvements (details [here](https://devblogs.microsoft.com/dotnet/introducing-diagnostics-improvements-in-net-core-3-0/))
- Distributed tracing (details [here](https://devblogs.microsoft.com/aspnet/improvements-in-net-core-3-0-for-troubleshooting-and-monitoring-distributed-apps/))
- Faster JSON serialization based on `Span<T>` (details [here](https://devblogs.microsoft.com/dotnet/try-the-new-system-text-json-apis/))


## Reference

1. https://devblogs.microsoft.com/dotnet/using-net-and-docker-together-dockercon-2019-update/
2. https://devblogs.microsoft.com/dotnet/running-with-server-gc-in-a-small-container-scenario-part-0/
3. https://devblogs.microsoft.com/dotnet/running-with-server-gc-in-a-small-container-scenario-part-1-hard-limit-for-the-gc-heap/
4. https://devblogs.microsoft.com/aspnet/grpc-vs-http-apis/
5. https://docs.microsoft.com/en-us/aspnet/core/grpc/?view=aspnetcore-3.1
6. https://docs.microsoft.com/en-us/aspnet/core/grpc/aspnetcore?view=aspnetcore-3.1&tabs=visual-studio
7. https://docs.microsoft.com/en-us/dotnet/core/compatibility/3.0-3.1#http-browser-samesite-changes-impact-authentication
8. https://devblogs.microsoft.com/dotnet/try-out-nullable-reference-types/
9. https://github.com/dotnet/dotnet-docker/blob/master/samples/aspnetapp/README.md
10. https://github.com/richlander/dotnet-docker-limits