+++
categories = ["recipes"]
date = "2016-12-08T08:51:43-05:00"
glyph = "fa-file-text-o"
summary = "Migrating Legacy ADO.NET Code to .NET Core"
tags = ["ado.net", "dotnetcore"]
title = "Migrate ADO.NET to .NET Core"
taxonomy = ["CLIENT", "DOT_NET"]
weight = 45
+++

Most of the ADO.NET APIs in .NET Core are relatively intact from the full .NET Framework with only minor changes. This is especially true of low-level ADO.NET APIs from `System.Data` like `IDbConnection`, `IDataReader`, as well as the "provider model". These APIs and patterns are all fully intact in .NET Core.

When Microsoft dropped `DataSet`, `DataTable`, or `DataAdapter` from initial versions of .Net core, most of the developers in the .NET community seem to think this is a good idea from a purity and cleanliness approach. Microsoft views the DataSet/DataTable/DataAdapter pattern as legacy. But Microsoft brought these back from .Net core 2.0, to make porting from .Net Framework to .Net core easy.

## DataSet Migration Strategies

The recommended approach for replacing DataSet/DataTable/DataAdapter usages is to rewrite the data access classes in these areas using another library or framework. The decision on which library to utilize  will have to be made on a per-project or per-library basis.

Some recommended approaches:

- **Dapper** - This library originally written for use by Stackoverflow.com provides a clean way shape and map SQL results to POCOs. This is one of the lightest weight and most flexible approaches unless you need an ORMs ability to work with multiple RDMSs.
- **Entity Framework Core** - EF Core is lightweight, open source and cross-platform version of Entity Framework data access technology. EF core got matured over past few releases and it now supports many differnet databases.
- **ADO.NET Core** - Utilize the data reader and command APIs to read and write data. This requires more code to be written, but will get job done no matter the shape of the data.