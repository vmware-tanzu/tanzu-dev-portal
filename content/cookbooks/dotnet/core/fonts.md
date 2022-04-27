+++
categories = ["recipes"]
date = "2016-12-08T08:42:25-05:00"
glyph = "fa-file-text-o"
summary = "Uploading fonts for .NET Core applications"
tags = ["fonts", ".netcore"]
title = "Custom Fonts for .NET Core applications"
taxonomy = ["CLIENT", "DOT_NET"]
+++

This recipe describes a method on how to get fonts bundled and working a .NET core application. While untested, it should work in a similar manner for Windows .NET Full Framework applications, with the exception that the main fonts folder will be used. This assumes that the appropriate font licenses are adhered to.

## Bundling fonts for .NET Core apps running on Linux

There remains a number of applications that require the use of default fonts. For example, an application may use an RDLC (Report Definition Language Client-side), which is an XML file that defines a user-created template report layout that can be used with Microsoft Report Viewer or other 3rd party compatible controls to generate an output report. One downside of this is that the RDLC contains a hardcoded font family name, which defaults to `Arial`. Thus, running the application on a Windows machine would give a proper report output, whilst running on Linux would result in a different output.

Once the application runs, the report generator will attempt to look in an operating system's registered font directory. e.g. Windows Font folder or Linux's `/usr/shared/fonts`. In PCF, our Linux container user will not have the write permissions to access `/usr/shared/fonts`.  However, it is possible to let the container to know about alternative locations for fonts via the Linux `fc-cache`. `fc-cache` builds a cache of the location of fonts for applications which use the font config library, which happens by default. The location it looks in are `/usr/shared/fonts` and also the user's `/.fonts` folder located in container user's home directory or the application directory. Therefore, we would need only to bundle a `/.fonts` folder alongside with our published .NET Core application and push this to PCF together.

However, in order to run `fc-cache`, we would need to modify our manifest file with a custom start command. By default, the start command issues by the dotnet core buildpack is:

```sh
cd ${HOME} && ./Some-Web-App-Pushed-To-PCF --server.urls http://0.0.0.0:${PORT}
```

We can override this in our manifest with the start command:

```sh
cd ${HOME} && fc-cache -fv && ./Some-Web-App-Pushed-To-PCF --server.urls http://0.0.0.0:${PORT}
```

## Adding the `.fonts` directory in Windows

In Windows UI explorer, it is not possible to create folders with `.` in the front. The trick to do so is to simply create a folder with a name with another dot at the end, i.e., `.foldername.`. This tricks Windows explorer into thinking that it is creating a file with an empty extension, however, it still results in a folder. The final dot at the end is removed because Windows does not require the final `.`.

## Windows fonts on Linux

One can download the Windows fonts [here](https://sourceforge.net/projects/corefonts/files/the%20fonts/final/).
