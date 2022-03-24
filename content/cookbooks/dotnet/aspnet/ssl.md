+++
date = "2017-12-15T12:00:00-07:00"
title = "TLS - Client Cert"
tags = [ "SSL", "TLS", "mutual TLS" ]
weight = 150
+++

PCF apps run under a non-priviledged container account they do not have access to install or access certs in the Windows Machine cert store.

To resolve this, there are few approaches:

* The app could install certificate into Current User Store and point configuration to load cert from `StoreLocation.CurrentUser`. For the system to use client cert in TLS hadshake private key should be stored in the Windows store - use `X509KeyStorageFlags.PersistKeySet` when loading the certificate.

    ```c#
    X509Certificate2 xcert = new X509Certificate2(cert, passw, X509KeyStorageFlags.PersistKeySet);

    X509Store store = new X509Store( StoreLocation.CurrentUser);
    store.Open(OpenFlags.ReadWrite);
    store.Add(xcert);
    store.Close();
    ```

    To read the cert:

    ```c#
    X509Store store = new X509Store(StoreLocation.CurrentUser);
    store.Open(OpenFlags.ReadOnly);
    var certificates = store.Certificates;
    foreach (var certificate in certificates)
    {
        var xname = certificate.GetName(); 
        try
        {
            if (certificate.HasPrivateKey)
            {
                certs.Append(" private key size:" + certificate.PrivateKey.KeySize);
            }
        }
        catch (Exception ex)
        {
            certs.Append("Exception: "+ex.Message);
        }
    }
    store.Close();
    ```

* The app could dynamically load the cert from a location it has access too (from the local file system, env var, or secrets store) and inject certificate into client network connection. For example:

    ```c#
    client.ClientCredentials.ClientCertificate.Certificate = new X509Certificate2(certbytes, password, X509KeyStorageFlags.UserKeySet);
    ```

Sample .NET Application (WCF service) installing and reading TLS cert can be found [here](https://github.com/lenisha/DotNetSamples-Simple/blob/master/WcfService-Simple).

## References

* [Installing X509 Certificate in .NET App](https://support.microsoft.com/en-us/help/950090/installing-a-pfx-file-using-x509certificate-from-a-standard--net-appli)
* [Certificate Validation without using windows store](https://blog.kloud.com.au/2015/11/23/implementing-a-wcf-client-with-certificate-based-mutual-authentication-without-using-windows-certificate-store/)
