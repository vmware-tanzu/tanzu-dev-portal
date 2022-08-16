+++
date = "2017-12-15T12:00:00-07:00"
title = "Machine Key"
tags = [ "Machinekey", "machine.config","Encryption","Security" ]
weight = 80
+++

Machine keys help protect Forms authentication cookie data and page-level view state data. They also verify out-of-process session state identification. ASP.NET uses the following types of machine keys:

1. A validation key computes a Message Authentication Code (MAC) to confirm the integrity of the data. This key is appended to either the Forms authentication cookie or the view state for a specific page.

2. A decryption key is used to encrypt and decrypt Forms authentication tickets and view state.

Managed via the IIS Manager the generated key is stored in the `<machineKey>`  element in the `machine.config` and must be kept in sync across all nodes of a Web Server Farm.

On PCF the `<machineKey>` element must be added to the `web.config` of the ASP.NET Application to ensure consistency for all Application instances.

```xml
<machineKey  
    validationKey="21F0EXAMPLE9C2C797F69BBAAD8402ABD2EE0B667A8B44EA7DD4374267A75D7
                   AD972A119482D15A4127461DB1DC347C1A63AE5F1CCFAACFF1B72A7F0A281B"           
    decryptionKey="ABAAEXAMPLE56D75D217CECFFB9628809BDB8BF91CFCD64568A145BE59719F"
    validation="SHA1"
    decryption="AES"
/>
```

## Resources:
* https://stackoverflow.com/questions/3855666/adding-machinekey-to-web-config-on-web-farm-sites
* https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh831711(v=ws.11)
