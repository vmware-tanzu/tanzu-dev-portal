+++
title = "MSVCRT & Unmanaged C++"
date =  2017-09-01T12:46:42-07:00
tags = [ "MSVCRT", "C++","cpp","Unmanaged","pinvoke" ]
weight = 90
+++

The `MSVCRT.dll` is the C standard library and the `MSVCP*.dll` is the C++ standard library for programs compiled with the Microsoft C++ compiler. Most unmanaged Windows programs and libraries make use of these DLLs and expect the specific version they're linked against to be installed on the Windows system.

[From Wikipedia](https://en.wikipedia.org/wiki/Microsoft_Windows_library_files#MSVCRT.DLL.2C_MSVCP.2A.DLL_and_CRTDLL.DLL)

```text
Versions of MSVC before 4.0 and from 7.0 to 13.0 used differently named DLLs for each version (MSVCR20.DLL, MSVCR70.DLL, MSVCR71.DLL, MSVCP110.DLL, etc.). Applications are required to install the appropriate version, and Microsoft offers Visual C++ Redistributable packages for this purpose, though Windows typically comes with one version already installed.

With Version 14.0, most of the C/C++ runtime was moved into a new DLL, UCRTBASE.DLL. However, C/C++ programs using UCRTBASE.DLL are forced to link against another new DLL, the VCRuntime, whose name continues to change with each version of MSVC (e.g. VCRUNTIME140.DLL).
```

These DLLs create a complication when a .NET application is using a library which wraps unmanaged C/C++ code. Since it's not feasible to install every single version of these DLLs beforehand for each possible application that may be pushed to PCF, it's better to push the required DLLs next to the program's executable or web application's bin directory.

## Examples

### SQLite

After nuget installing the SQLite driver, you'll need to copy the `bin\x64\SQLite.Interop.dll` to the parent folder `bin\SQLite.Interop.dll`.

### GemFire

The .NET GemFire driver is a wrapper around the C++ driver for Windows, so you'll need ensure you put the appropriate `MSVCR*.dll` files in the ASP.NET application's bin directory. [This](http://gemfire82.docs.pivotal.io/docs-gemfire/gemfire_nativeclient/dotnet-caching-api/private-assembly.html) help topic may be relevant?
