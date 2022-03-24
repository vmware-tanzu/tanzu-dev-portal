+++
title = ".NET and Microsoft Enterprise Logging"
date =  2020-11-30T15:59:56Z
weight = 5
+++

#### Create a custom listner and configure .NET applications using Microsoft Enterprise Logging

##### Create a custom listner

```csharp
    [ConfigurationElementType(typeof(CustomTraceListenerData))] 
    public class ConsoleWriterTraceListener : CustomTraceListener 
    {
        public override void TraceData(TraceEventCache eventCache, string source, TraceEventType eventType, int id, object data) 
        { 
            if (data is LogEntry && this.Formatter != null) 
            { 
                this.WriteLine(this.Formatter.Format(data as LogEntry).ToString()); 
            } 
            else 
            { 
                this.WriteLine(data.ToString()); 
            } 
        }

        public override void Write(string message) 
        { 
            Console.Write(message); 
        } 
        
        public override void WriteLine(string message) 
        { 
            Console.WriteLine(message); 
        } 
    }
```

##### Steps to configure an application (app.config or web.config)

1. Check enterprise logging config section exists
```xml
  <configSections>
    <section name="loggingConfiguration" type="Microsoft.Practices.EnterpriseLibrary.Logging.Configuration.LoggingSettings, Microsoft.Practices.EnterpriseLibrary.Logging, Version=6.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" requirePermission="true" />
  </configSections>
  <...>
```
2. Add the custom listner and a formatter
```xml
  <...>
  <loggingConfiguration name="" tracingEnabled="false" defaultCategory="General" logWarningsWhenNoCategoriesMatch="false">
    <listeners>
      <add name="Console Trace Listener" type="MyApplication.Logging.TraceListeners.ConsoleWriterTraceListener, MyApplication" formatter="Text Formatter" />
    </listeners>
    <formatters>
      <add type="Microsoft.Practices.EnterpriseLibrary.Logging.Formatters.TextFormatter, Microsoft.Practices.EnterpriseLibrary.Logging, Version=6.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" 
        template="Timestamp: {timestamp(local)}, Message: {message}, Category: {category}, Priority: {priority}, Severity: {severity}" 
        name="Text Formatter" />
    </formatters>
    <...>
  </loggingConfiguration>
```
3. Add the listner to all sources
```xml
  <loggingConfiguration name="" tracingEnabled="false" defaultCategory="General" logWarningsWhenNoCategoriesMatch="false">
    <...>
    <categorySources>
      <add switchValue="All" autoFlush="true" name="General">
        <listeners>
          <...>
          <add name="Console Trace Listener" />
        </listeners>
      </add>
    </categorySources>
    <specialSources>
      <allEvents switchValue="All" name="All Events">
        <listeners>
          <...>
          <add name="Console Trace Listener" />
        </listeners>
      </allEvents>
      <notProcessed switchValue="All" name="Unprocessed Category">
        <listeners>
          <...>
          <add name="Console Trace Listener" />
        </listeners>
      </notProcessed>
      <errors switchValue="All" name="Logging Errors and Warnings">
        <listeners>
          <...>
          <add name="Console Trace Listener" />
        </listeners>
      </errors>
    </specialSources>
  </loggingConfiguration>
```
