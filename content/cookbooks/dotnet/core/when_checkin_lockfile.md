+++
categories = ["recipes"]
date = "2016-12-12T13:30:47-05:00"
glyph = "fa-file-text-o"
summary = "Best Practices for Managing Project Lock Files"
tags = ["ci/cd", "dependency management", "tools"]
title = "Managing the Project Lock File"
taxonomy = ["CLIENT", "DOT_NET"]
+++

This recipe addresses the question of whether or not you should check in the `project.lock.json` file that is generated when you execute the `dotnet restore` command. The short answer is _no_, this file should not be checked into source control.

The reason for this is that the lock file is not like lock files used by vendoring tools available for other languages and environments. The `project.lock.json` file does _not_ contain a set of fixed (or "pinned") specific versions of discovered dependencies. It is literally nothing more than a cache file that allows for builds to take place without re-running a `restore`.

There are times when a build can fail because the `project.lock.json` file is out of sync with reality when someone (or a CI tool) invokes `dotnet build`. It is for this specific reason that checking the lock file into source control should be forbidden.

Moreover, in the final release of the command line tooling that utilizes `csproj` files instead of `project.json` files, the lock file mechanism has actually been moved into the `obj/` sub-directory. This directory, along with `bin/` are usually automatically ignored by projects via `.gitignore` files or other source control rules.
