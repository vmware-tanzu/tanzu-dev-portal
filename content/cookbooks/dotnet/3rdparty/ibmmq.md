+++
date = "2017-04-13T12:00:00-07:00"
title = "IBM MQ"
tags = [ "IBM", "MQ","Websphere","AMQP","MQTT" ]
weight = 70
+++

IBM MQ requires a library to be installed on the client server which isn't a recommended approach.

There are three alternatives:

1. **IBM Stand-alone .NET Client**

    As documented [here](https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_8.0.0/com.ibm.mq.dev.doc/q123550_.htm) IBM support taking the `amqmdnet.dll` from at least the `8.0.0.2` client and using it directly in the application. This was possible (along with another DLL) with older versions of the client but was not supported. With the `8.0.0.2` client only the `amqmdnet.dll` assembly is needed and it is now supported. SSL is supported as well.

    See sample code below although there's nothing PCF specific about the .NET Client apart from the MQ assembly reference.

2. **AMQP 1.0**

    IBM MQ 8 introduced support for AMQP 1.0 with an additional service pack and AMQP is standard on v9 and above.

    There are many AMQP 1.0 libraries available to .NET and dotnet core. These libraries are more recent and better maintained than any of the MQTT libraries. If the customer is running IBM MQ 8 or above AMQP might be the better solution.

3. **MQTT (MQ Telemetry Transport)**

    MQTT was developed by IBM as a lightweight network protocol for pub/sub messaging between devices and IBM MQ. Originally intended for lightweight clients like sensors. MQTT is available as an additional service on MQ since version 7. Once the service is running MQTT clients connect and register a `client_id` and can either publish messages and/or subscribe to a TOPIC. Messages can be sent to the MQTT client via the normal (non MQTT) TOPIC publish channels using the TOPIC string registered by the MQTT client or the `client_id`.

    A REMOTE QUEUE can also be defined within MQ that forwards messages to the MQTT client. This should mean most existing MQ message flows can be modified to support an MQTT client.

    MQTT supports durable messaging along with three QoS such as *deliver at least once*, *deliver only once*, *deliver exactly once*.
    Higher levels of QoS are more reliable, but involve higher latency and have higher bandwidth requirements.

    **0**: The broker/client will deliver the message once, with no confirmation.

    **1**: The broker/client will deliver the message at least once, with confirmation required.

    **2**: The broker/client will deliver the message exactly once by using a four step handshake.

    For .NET there are several packages available with [M2MQTT](http://www.eclipse.org/paho/clients/dotnet/) seemingly being the best supported and maintained although it has a few quirks. M2MQTT is a nuget package and requires no client to be installed. There is a dotnet core version but I have not tested it.

    Topic string length is limited to 65536 bytes (utf-8) and message payload is limited to 268,435,456 bytes as per MQTT spec.

### Sample using Stand-alone .NET Client

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Configuration;
using System.Collections;
using IBM.WMQ;
 
namespace MQBinDeployTest
{
    class Program
    {
        static MQQueueManager queueManager;
        const string MQ_CIPHER = "TLS_RSA_WITH_AES_128_CBC_SHA";

        static void Main(string[] args)
        {
            Console.WriteLine("MQBinDeployTest running...");

            try
            {
                while (true)
                {
                    DoMqStuff();
                    Thread.Sleep(1000);
                }
            }
            catch(Exception ex)
            {
                Console.Error.WriteLine("Error {0}", ex);
            }
            finally
            {
                if (queueManager != null &&  queueManager.IsConnected)
                    queueManager.Disconnect();
                Console.WriteLine("/end");
                Console.ReadKey();
            }
 
        }
 
        static void Connect()
        {
            string queueManagerName = ConfigurationManager.AppSettings["MQQueueManager"];
            string channel = ConfigurationManager.AppSettings["MQChannel"];
            string host = ConfigurationManager.AppSettings["MQHost"];
            string port = ConfigurationManager.AppSettings["MQPort"];

            // cert store could be the kdb file minus extension, user or server cert store
            string mqSSL = @"C:\Sandbox\MQBinDeployTest\key";

            Hashtable connectionParams = new Hashtable();
            connectionParams.Add(MQC.CHANNEL_PROPERTY, channel);
            connectionParams.Add(MQC.HOST_NAME_PROPERTY, host);
            connectionParams.Add(MQC.PORT_PROPERTY, port);
            connectionParams.Add(MQC.SSL_CIPHER_SPEC_PROPERTY, MQ_CIPHER);
            connectionParams.Add(MQC.SSL_CERT_STORE_PROPERTY, mqSSL);
 
            queueManager = new MQQueueManager(queueManagerName, connectionParams);
            queueManager.Connect(queueManagerName);
            Console.WriteLine("Connected to MQ Queue Manager");
        }
 
        static void DoMqStuff()
        {
            if (queueManager == null || !queueManager.IsConnected)
                Connect();
 
            var queueName = ConfigurationManager.AppSettings["MQQueueName"]; ;
            var openOptions = MQC.MQOO_OUTPUT + MQC.MQOO_FAIL_IF_QUIESCING;
            var queue = queueManager.AccessQueue(queueName, openOptions);
 
            var message = new MQMessage();
            message.CharacterSet = 1208; // UTF-8
            message.WriteString("Look mom no MQ Client!");
            message.Format = MQC.MQFMT_STRING;
            var putOptions = new MQPutMessageOptions();
            queue.Put(message, putOptions);
            queue.Close();
        }
    }
}
```

### Resources:

* [Good video on setting up a MQ lab on Red Hat Enterprise using IBM MQ for Developers (all free).](https://www.imwuc.org/blog/trob)
* [What is MQTT and how does it work with WebSphere MQ](https://www.ibm.com/developerworks/community/blogs/aimsupport/entry/what_is_mqtt_and_how_does_it_work_with_websphere_mq?lang=en)
* [IBM MQ Developer Downloads](https://www.ibm.com/developerworks/community/blogs/messaging/entry/downloads?lang=en)
* [Sending a test message to a MQTT Client via WebSphere Explorer](https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_7.5.0/com.ibm.mq.pro.doc/q002910_.htm)
