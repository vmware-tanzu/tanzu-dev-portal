+++
categories = ["recipes"]
date = "2016-02-16T10:37:40-05:00"
glyph = "fa-file-text-o"
summary = "Externalizing ASP.NET Configuration"
tags = ["dotnet", "asp.net"]
title = "Externalizing ASP.NET Config"
taxonomy = ["CLIENT", "DOT_NET"]
+++

For ASP.NET applications, most configuration is embedded in a `web.config` file or some file that is ultimately loaded by or referenced from the parent `web.config`. In a cloud application, this becomes an anti-pattern because you need the _same_ deployment artifact to be deployable to multiple environments without changes to support different configurations.

Connection strings in `web.config` are typically included in the `connectionStrings` XML element when using some standard Microsoft libraries for data access like _Entity Framework_. If you're doing things a little outside the box, you might include a connection string as a simple key-value pair in the `appSettings` XML element in your configuration file.

Either way, your application needs the ability to override connection strings and application settings with cloud-supplied values.

Example configuration in `web.config`:

```xml
<connectionStrings>
  <add name="dbConnection" connectionString="metadata=res://*/;provider=System.Data.SqlClient;provider connection string=`Data Source=....`"/>
</connectionStrings>
<appSettings>
  <add key="myUrl" value="http://google.com/"/>
</appSettings>
```


If you remove this entirely, then the application will likely not be able to work remotely. So the accepted practice for _short term replatforming_ rather than _modernization_ would be to leave the `web.config` settings as the _local default_, and then detect bound services that potentially override that.

You might have centralized code that provides a connection string to the rest of your code, as shown in this example:
{{< tabs "code" >}}
  {{< tab "VB.NET" >}}
  ```vb
  Protected Friend Shared Function EFConnectionString() as String
      Return System.Web.Configuration.WebConfigurationManager.ConnectionStrings("EFSQLConnStr").ConnectionString
  End Function

  Protected Friend Shared Function MyUrl() as String
      Return System.Web.Configuration.WebConfigurationManager.AppSettings("MyUrl")
  End Function
  ```
  {{< /tab >}}
  {{< tab "C#" >}}
  ```csharp
    protected string EFConnectionString()
    {
        return System.Web.Configuration.WebConfigurationManager.ConnectionStrings["EFSQLConnStr"].ConnectionString;
    }

    protected string MyUrl()
    {
        return System.Web.Configuration.WebConfigurationManager.AppSettings["MyUrl"];
    }
  ```
  {{< /tab >}}
{{< /tabs >}}

Application settings are usually retreived from environment variables using the following format _['MY_APPLICATION__MY_SETTING']_, however conection strings can often be retreived from the Cloud Foundry `VCAP_SERVICES` environment variable
In this case, you would want to perform the following steps in a re-write of this function:

1. Detect the presence of the `VCAP_SERVICES` environment variable
2. If available, parse it (it's JSON)
3. Locate the service you're expecting, which might be called `efsql` (though you'll probably want more informative names)
4. Extract the SQL connection string from it and return that value
5. If none of 1-4 worked, then return the fallback string, which can be found in `web.config`

In some cases, applications just use the default parameterless constructor for Entity Framework entity sets, which uses a default naming convention in `web.config`. You will want to _override_ this behavior such that your application is directly responsible for providing the connection string. This will allow your application to go through the 4 logical steps outlined above prior to delivering a connection string to the code requesting it.

The following is an example of how to update your configuration provider:
{{< tabs "code" >}}
  {{< tab "VB.NET" >}}
  ```vb
      Protected Friend Shared Function EFConnectionString() As String
        Dim connectionString = Nothing
        Dim vcapServicesJson = Environment.GetEnvironmentVariable("VCAP_SERVICES")

        If (Not String.IsNullOrEmpty(vcapServicesJson)) Then
            Dim vcapServ = Newtonsoft.Json.JsonConvert.DeserializeObject(Of VcapServices)(vcapServicesJson)
            connectionString = vcapServ.esql
        End If

        If connectionString IsNot Nothing Then
            Return connectionString
        Else
            Return System.Web.Configuration.WebConfigurationManager.ConnectionStrings("EFSQLConnStr").ConnectionString
        End If
    End Function

    Protected Friend Shared Function MyUrl() As String
        Dim url = Environment.GetEnvironmentVariable("VCAP_SERVICES")
        If url IsNot Nothing Then
            Return url
        Else
            Return System.Web.Configuration.WebConfigurationManager.AppSettings("MyUrl")
        End If
    End Function
  ```
  {{< /tab >}}
  {{< tab "C#" >}}
  ```csharp
  protected string EFConnectionString()
  {
      string connectionString = null;
      var vcapServicesJson = Environment.GetEnvironmentVariable("VCAP_SERVICES");

      if (!string.IsNullOrEmpty(vcapServicesJson))
      {
          var vcapServices = Newtonsoft.Json.JsonConvert.DeserializeObject<VcapServices>(vcapServicesJson);
          connectionString = vcapServices.esql;
      }

      return connectionString ?? System.Web.Configuration.WebConfigurationManager.ConnectionStrings["EFSQLConnStr"].ConnectionString;
  }

  protected string MyUrl()
  {
      string connectionString = null;

      var vcapServicesJson = Environment.GetEnvironmentVariable("MY_APPLICATION__MY_URL");
      if (!string.IsNullOrEmpty(vcapServicesJson))
      {
          var vcapServices = Newtonsoft.Json.JsonConvert.DeserializeObject<VcapServices>(vcapServicesJson);
          connectionString = vcapServices.esql;
      }

      return connectionString ?? System.Web.Configuration.WebConfigurationManager.ConnectionStrings["MyUrl"].ConnectionString;
  }
  ```
  {{< /tab >}}
{{< /tabs >}}

While there are other ways of getting environment variables into configuration, such as the [EnvironmentConfigBuilder](https://github.com/aspnet/MicrosoftConfigurationBuilders#environmentconfigbuilder), the above is the most low level and works with most legacy frameworks


## Backing Services (Web and others)

This pattern of externalizing the connection string and app settings for a data source must also be followed for all other backing services, including (but not limited to) SOAP services, RESTful web services, SMTP/mail server information, LDAP/security server information, and any other configuration property that can vary from environment to environment without the application deployment artifact changing.

When you are done externalizing your configuration, your application should be able to pass the following litmus test:

* If you were to open-source your application tomorrow, would the codebase contain any URLs, usernames, passwords, host names, or other internal information that should not be publicly visible? All of these things should be fed into the application from an external source (e.g. bound services via Cloud Foundry), and _never_ embedded in `web.config` or source code.
