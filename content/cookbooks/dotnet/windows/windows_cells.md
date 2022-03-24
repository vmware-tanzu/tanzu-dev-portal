+++
date = "2017-04-03T12:00:00-07:00"
title = "Windows Cells"
description = "Windows cell background and best practices"
weight = 5
+++

Windows stemcells are just like Linux based stemcells with the obvious difference being they run Windows Server instead of Linux. Most of the same terminology, tools, and processes that apply to Linux stemcells also apply to Windows stemcells.

Some terminology you should be familiar with before continuing:

- **Stemcell** - a versioned Operating System image wrapped with IaaS specific packaging that serves as a base template for cells.
- **Cell** - an instance of a stemcell or VM running inside Cloud Foundry that runs various container workloads.

## What is a Windows Stemcell?

According to [bosh.io](https://bosh.io/docs/stemcell.html), a stemcell is simply a versioned Operating System image wrapped with IaaS specific packaging. While that's the most basic definition of a stemcell, there are specific requirements that must be met by a Windows stemcell.

A Windows stemcell contains a bare minimum Windows Server 2019 OS with a few Windows features pre-installed, a BOSH agent and some applied policies to securley configure the OS. All Windows stemcells are configured this way regardless of IaaS or who built them. This property of stemcells allows Cloud Foundry operators to easily and reliably deploy to multiple infrastructures without worrying about differences between images.

Windows stemcells do not contain any specific information about any software that will be installed once that stemcell becomes a specialized machine in the cluster. This clear separation between base Operating System and later-installed software is what makes stemcells a powerful concept.

## Cells as Immutable Infrastructure

Windows cells are running instances of a specific stemcell version. Think of a stemcell like a static template that all instantiated cells are based off. An important concept that differs from traditional Windows administration is that cells are not long lived "pets" that are to be cared for and tended too, rather they are short lived fulfilling a specific purpose more akin to cattle. This means that cell instances come and go as the platform is scaled out or in, updated, or reconfigured.

Another important distinction between regular Windows Server instances and Windows cells is that Windows cells follow the [immutable server pattern](https://martinfowler.com/bliki/ImmutableServer.html). In other words, once a cell instance has been spun up they are not reconfigured, updated, or otherwise changed in anyway. They're not even rebooted! They're essentially read only or immutable for their entire short lived life.

> Immutable infrastructure provides stability, efficiency, and fidelity to your applications through automation and the use of successful patterns from programming. No rigorous or standardized definition of immutable infrastructure exists yet, but the basic idea is that you create and operate your infrastructure using the programming concept of immutability: once you instantiate something, you never change it. Instead, you replace it with another instance to make changes or ensure proper behavior.

[An introduction to immutable infrastructure](https://www.oreilly.com/ideas/an-introduction-to-immutable-infrastructure)

The lifetime of a Windows cell varies from cell to cell, but typically this is measured in days instead of months or years. A cells life could be as short as a few minutes to as long as a few months, but typically cells only live for a few weeks before they are replaced because of an updated base stemcell image.

## Building a Windows Stemcell

For all public clouds, Pivotal provides publicly available Cloud Foundry stemcell images that are already preconfigured using the following best practices:

- Latest Windows updates from Microsoft.
- Hostable Web Core and supporting features installed.
- Latest .NET 4.x installed.
- Latest BOSH agent.
- Recommended security policies applied.
- Disabling non-essential Windows services and features, including RDP.
- Sysprep

For private infrastructures like vSphere you'll need to build your own stemcell carefully following the [same procedures that Pivotal uses internally](https://github.com/cloudfoundry-incubator/bosh-windows-stemcell-builder) to build your stemcell. Any deviation from the recommended practices will lead to inconsistencies and ultimately an unsupported configuration that could cause problems for you and your application developers.

The Windows stemcell builder will work with any supported IaaS, but you should only ever need to run it yourself for private cloud scenarios like vSphere. To get started it's recommended to follow the [vSphere manual instructions](https://docs.pivotal.io/pivotalcf/2-6/windows/create-vsphere-stemcell-automatically.html). These instructions walk you through the process of creating a Windows stemcell including installing and configuring all the prereqs mentioned previously. Once the manual process is understood and proved to be working in your environment, it's recommended to automate the process with a pipeline as you'll want to build stemcells at least monthly to rollout updates.

### Corporate "Golden" Images

Often times enterprises have an IT group that is reponsible for producing blessed Windows templates. In some ways what these groups provide is similar to a Cloud Foundy stemcell, however they're usually a bit more heavy weight and aren't necessarily optimized for hosting in the cloud.

While you could theoretically use one of these corporate base images as a starting point for your Cloud Foundry stemcells, tread with caution here. These images tend to be bloated and contain many features you shouldn't deploy to Cloud Foundry. Additionally, it's typically better to build stemcells as close as possible to what Pivotal provides for public clouds.

## Windows Updates

Ensuring all your Windows cells have the latest Windows updates is critically important to securing your Cloud Foundry environment. The Windows update process you're probably accustomed to involves WSUS and applying updates to servers during off hours or scheduled maintainence periods to allow for the server to reboot. The process for rolling out Windows updates for Windows cells is very different, and as you'll soon discover much better!

If you remember from our building a Windows stemcell section, we apply Windows updates when building a stemcell. We don't apply Windows updates to already running cells, instead we replace them with a new base stemcell image that _already_ includes all the patches. Following the immutable infrastructure pattern, each cell instance is then replaced without any downtime and completely managed by Cloud Foundry as it moves workloads from the old running cells to the newly patched cells. This allows patches and all the required reboots to happen _once_ on the base image without needing to do it across hundreds or even thousands of servers.

Since Microsoft typically releases new Windows updates monthly on [patch tuesday](https://en.wikipedia.org/wiki/Patch_Tuesday) it's recommended to follow that schedule to build a new stemcell and replace all of your Windows cells. While you may have the ability to replace all your production cells _on_ patch Tuesday, it's recommened that you first deploy newly built stemcells to your pre-production Cloud Foundry environments and let those bake for a few days before promoting them to your production Cloud Foundry foundations. This will give the apps running on those foundations a chance to validate the patches haven't broken anything in any of the applications which are running within the containers on it.

## Cell Customization with BOSH Addons

The best practice for installing additional software or applying custom configuration is to create a [BOSH addon](https://bosh.io/docs/runtime-config.html#addons). This includes additional Windows features, policies, and 3rd party software often baked into corporate golden images.

If you're not familiar with BOSH, it is the underlying technology that deploys Cloud Foundry and all of it's components - including Windows cells. A BOSH addon is an extensibility point to a stemcell that allows the Cloud Foundry operator to inject custom software or configuration in a consistent and repeatable manner across all cells and IaaSs. Using the BOSH runtime config a addon can even be targeted to a specific OS, like Windows, so an addon only runs on a compatible OS.

When installing additional Windows software with a BOSH addon it is extremely important that the installation can run unattended or in silent mode without user intervention. An addon runs everytime a new cell is spun up from a stemcell, so it's important to follow these addon guidelines:

- Software installation _should not_ require large binaries.
- Software installation _should_ be fast.
- Software installation _must not_ cause a reboot.
- Installations _must_ run headless without user intervention.
- Installers _must_ run locally as they run under the BOSH local SYSTEM account.

Additional Windows features, configuration, security, or local group policy should be applied using a BOSH addon for the same reasons as software installation, to decouple cell specialization from stemcell building and infrastructure.

### Windows Cell Anti-Virus

While AV software isn't supported out of the box with Cloud Foundry Windows cells, it is possible to install and configure AV software if it's required by your corporate security standards.

It's important when creating a new BOSH addon to install your AV software that the installation can be performed silently without user intervention. It's also important to configure the AV agent so that any on-access scanners exclude some of the underlying Cloud Foundry runtime directories, otherwise intermittment deployment failures may occur. The following directories should be excluded from on-demand scanning:

- `C:\bosh`
- `C:\var\vcap`
- `C:\containerizer`

Failure to exclude these directories may lead to ephemeral permission issues with files in these folders and cause cell and app deployments to fail.

## Active Directory

Active Directory is a powerful tool that many enterprises leverage in order to more easily manage their corporate servers and workstations. Additionally AD provides a centralized way to manage and authenticate users within an intranet. While AD is very good at these tasks, it wasn't designed during a time when cloud computing existed. This can be seen in many of the design and architecture choices baked into AD and how those designs struggle at times to support ephemeral immutable infrastructure like Cloud Foundry.

While it's technically possible to join a Windows cell to an AD domain, it is absolutely not supported by Cloud Foundry. In addition to not being supported it is also highly discouraged for multiple reasons. Aside from that, it's better to take a step back and ask, "what problems are you trying to solve with Active Directory?" Generally speaking most issues that Windows admins are trying to solve with AD either don't exist in Cloud Foundry or there are other ways to solve using BOSH specific cloud friendly paradigms.

Active Directory is typically meant for long lived servers that are treated well and maintained as pets. Often times administrators may need to RDP into these servers in order to perform maintenance. In Cloud Foundry this couldn't be further from the truth. Administrators cannot login to cells to perform maintenance, in fact WinRM and RDP are both disabled by the stemcell builder. Instead of "maintenance" at the cell level you would put the cell in question down, e.g. destroy it and spin up a brand new healthy cell from a new stemcell. If there's no need to login to a cell then there's no need for a domain admin group to be added to the local administrators group on the cell.

You might think that you may need access to a stemcell for troubleshooting, but in general there are other ways to troubleshoot cells without logging in. Applications which run on Cloud Foundry have their logs collected in the centralized Cloud Foundry loggregator logging system. Even Windows event logs are collected in the loggregator should you need to troubleshoot a systemic cell configuration issue.

{{% notice note %}}
.NET applications cannot use integrated authentication _even_ if you were to domain join the cell. The hostable web core provided by Cloud Foundry explicitly disallows Windows auth even if it's been "enabled" in the application's `web.config`.
{{% /notice %}}

Another difference between the way BOSH managed cells and AD managed servers is that it's considered best practice to automate, version control and test all changes in non-production environments before rolling them out to production environments. Typically Active Directory configuration is applied at the domain or OU level manually thus potentially leading to inconsistent configuration between sites. Additionally this type of configuration is difficult to version control and validate when compared to a version controlled BOSH addon. While you could do the same with PowerShell and some discipline, following the BOSH way forces you to use best practices.

Let's say you're not convinced, and you still want to domain join your cells. The first issue you'll run into is with BOSH not tolerating reboots during deployment. This means you'll need to domain join the cells outside BOSH or some other fragile technique. Assuming you solve that there are additional issues you'll likely encounter:

- BOSH doesn't tolerate reboots and will fail cell deployment.
- AD group policy could cause the Cloud Foundry services on the cell to fail in unexpected ways.
- Garbage collecting old computer accounts from AD as cells are dynamically spun up and down.

While domain joining a cell may seem like a shortcut to applying your existing security policies and configuration, it's a shortcut fallacy that will cost you more time in troubleshooting and pain then it's worth. It's far better to bite the bullet and do things the BOSH way.

> Containers can't be joined to the domain. The host can be joined, and then a machine account can be passed to the container, but that's not supported at this time. BOSH can't join a VM to the domain at this time, and it might not be possible to ever do so. Joining to the domain also encourages the use of external tooling to manage the VM, which is not a thing you should do when BOSH deploying. Microsoft for a while said that IWA in a container is an anti-pattern, but then came up with the hacky machine account solution. But IWA is definitely an anti-pattern for non-intranet apps, and even for intranet apps most corps are moving to some sort of other auth solution to support polyglot services, hence OAuth, etc.

## FAQs

### Cell Sizing

The recommended cell size depends on the underlying infrastructure and other factors, however a good starting point is:

- 4 CPUs
- 16GB RAM
- 128GB disk

### Pagefile

The stemcell builder automation doesn't currently configure the Windows pagefile, so each of yours cells will use the Windows default settings which is `Windows Managed`. This setting usually works well for Windows cells, however if you plan on changing this it's probably best to do this using Microsoft's guidance to support your cell size.

### D: drive?

Windows cells do not have multiple paritions or drives. Traditionally with bare metal Windows Servers you would reserve the C: drive for the OS and D: drive for programs etc. With completely virtualized environments along with the short lived nature of Windows cells this advice no longer provides any benefits. While you could add another drive to your stemcell buildout process, it's not recommended or supported.

### .NET Versions

It's recommended that the latest version of .NET be installed on your stemcell. Unfortunately the way the .NET 4.x framework and CLR are installed is globall at the cell level. While the mutlitude of .NET versions are generally backwards compatible, applications pushed to Cloud Foundry can only target the latest version already deployed on the cell. This is different for .NET Core where the CLR version is independently deployed along with the application and doesn't require that it be preinstalled by a Cloud Foundry operator.

### Remote Cell Access

Remote cell access via RDP or WinRM is disabled by default by the stemcell builder. This is generally the best option from a security and management standpoint. Generally all troubleshooting should be done during the stemcell buildout process or via the Cloud Foundry logs. At some future incarnation Windows cells may support operator access via `bosh ssh`. If you _really_ need console access to a cell you may look at using the vSphere console to login or create a bosh addon to enable RDP or WinRM. If you do enable this type of access it's recommended you only do so temporarily and/or in non-production environments.
