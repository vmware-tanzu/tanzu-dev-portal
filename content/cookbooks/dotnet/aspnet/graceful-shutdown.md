+++
date = "2019-05-06T12:00:00-07:00"
title = "Graceful Shutdown"
tags = []
weight = 150
+++


When a PCF app is stopped (i.e. `cf stop`), it receives a `CTRL_SHUTDOWN_EVENT`
and is allowed 10 seconds to gracefully shutdown. In order to use this feature, the app must provide a control handler as seen in the example below. See [2] for more information on how control handlers work.

Graceful shutdown is not supported on deployments running versions prior to Windows Server 2019.

Add the following class to your application


```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;

namespace MyApplication
{
    public static class ApplicationLifecycle
    {
        private static readonly CancellationTokenSource _appShutdownCts = new CancellationTokenSource();
        private static readonly ManualResetEvent _shutdownCompleteHandle = new ManualResetEvent(false);

        private static readonly List<Func<Task>> _shutdownDelegates = new List<Func<Task>>();

        static ApplicationLifecycle()
        {
            SetConsoleEventHandler(OnTerminateCommand);
        }

        public static WaitHandle ShutdownCompleteHandle => _shutdownCompleteHandle;

        private static bool OnTerminateCommand(CtrlEvent eventtype)
        {
            Shutdown();
            return true;
        }

        public static void Shutdown()
        {
            _appShutdownCts.Cancel();
            Task.WhenAll(_shutdownDelegates.Select(x => x())).Wait(TimeSpan.FromSeconds(10));
            _shutdownCompleteHandle.Set();
        }

        public static CancellationToken RegisterForGracefulShutdown(Func<Task> serviceCleanup)
        {
            _shutdownDelegates.Add(serviceCleanup);
            return _appShutdownCts.Token;
        }
        
        
        public delegate bool ConsoleEventDelegate(CtrlEvent eventType);

        private static ConsoleEventDelegate _handler; // Keeps it from getting garbage collected

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool SetConsoleCtrlHandler(ConsoleEventDelegate callback, bool add);

        public static void SetConsoleEventHandler(ConsoleEventDelegate handler)
        {
            _handler = handler;
            SetConsoleCtrlHandler(_handler, true);
        }

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool GenerateConsoleCtrlEvent(CtrlEvent sigevent, int dwProcessGroupId);
        public enum CtrlEvent
        {
            CTRL_C_EVENT = 0,
            CTRL_BREAK_EVENT = 1,
            CTRL_CLOSE_EVENT = 5,
            CTRL_LOGOFF_EVENT = 5,
            CTRL_SHUTDOWN_EVENT = 6
        }
    }
}
```

In Global.asmx `Application_Start` method, register each component that wants to participate in graceful shutdown using `RegisterForGracefulShutdown` method.  

Example:

```c#
ApplicationLifecycle.RegisterForGracefulShutdown(async () =>
{
	Console.WriteLine("Doing some gracefulshutdown tasks");
	await Task.Delay(1000);
    Console.WriteLine("Shutdown tasks complete");
});
```

You must also add the following hook to `Application_Stop` to ensure the application doesn't exit before all the components had a chance to shutdown:

```c#
protected void Application_Stop()
{
    ApplicationLifecycle.ShutdownCompleteHandle.WaitOne();
}
```



Example steps to see logs written after `CTRL_SHUTDOWN_EVENT` is received:

```sh
cf push YourApp -s windows -b hwc_buildpack
curl YourApp.<domain>.com
cf stop YourApp
cf logs YourApp --recent | grep Graceful
[APP/PROC/WEB/0] OUT Doing some gracefulshutdown tasks
[APP/PROC/WEB/0] OUT Shutdown tasks complete
```


## References
[1] [Microsoft Docs: SetConsoleCtrlHandler](https://github.com/MicrosoftDocs/Console-Docs/blob/master/docs/setconsolectrlhandler.md)

[2] [Microsoft Docs: `HandlerRoutine` callback function](https://github.com/MicrosoftDocs/Console-Docs/blob/master/docs/handlerroutine.md#remarks)
