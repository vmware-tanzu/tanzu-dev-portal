+++
date = "2018-05-04T12:00:00-07:00"
title = "AD Domain Setup and Integration"
description = "Deploying an Active Directory domain controller and integrating it with PAS"
tags = [ "AD", "LDAP", "PAS", "Active Directory", "GCP" ]
weight = 10
+++

These instructions show you how to setup a standalone (non-production grade) Active Directory domain controller and how to integrate that domain controller via LDAP with Pivotal Application Service.

## Create VPC and Windows Instance (GCP)

These steps are specific to GCP so you can skip this section if you have another IaaS or already have a domain controller. These instructions assume you will be creating a new `10.1.0.0/24` VPC just for the domain controller and peer it with your PCF VPC. You can skip most of the networking steps if you want to re-use your PCF VPC for your domain controller instead of creating a new one.

Create a VPC for the single Windows domain controller

```sh
$ gcloud compute networks create adnet  \
  --description "VPC network to deploy Active Directory" \
  --subnet-mode custom
```

Create a single subnet inside the new VPC.

```sh
$ gcloud compute networks subnets create private-ad-zone-1 \
  --network adnet \
  --range 10.1.0.0/24
```

Allow traffic from AD VPC and PCF VPC (all subnets). You may need to adjust the source ranges to match your actual deployment of PCF.

```sh
$ gcloud compute firewall-rules create allow-internal-ports-private-ad \
  --network adnet \
  --allow tcp:1-65535,udp:1-65535,icmp \
  --source-ranges  10.1.0.0/24,10.0.0.0/24,10.0.4.0/24,10.0.8.0/24
```

Allow traffic from your workstation to the Windows Server (replace `${mypublicip}` with _your_ public IP address)

```sh
$ gcloud compute firewall-rules create allow-rdp \
  --network adnet \
  --allow tcp:3389 \
  --source-ranges ${mypublicip}/32
```

Create the Windows Server 2016 VM in the us-west1-b zone with an IP of `10.1.0.100`.

```sh
$ gcloud compute instances create ad-dc1 --machine-type n1-standard-2 \
  --boot-disk-type pd-ssd \
  --boot-disk-size 50GB \
  --image-family windows-2016 --image-project windows-cloud \
  --network adnet \
  --zone us-west1-b --subnet private-ad-zone1 \
  --private-network-ip=10.1.0.100
```

Set the your Windows user's VM password you'll use to initially RDP into with.

```sh
$ gcloud compute reset-windows-password ad-dc1 --zone us-west1-b --quiet
```

## Create the AD Domain Controller

This section is IaaS agnostic and assumes you're running the commands on the Windows VM from an Administrator PowerShell session.

1. RDP into the Windows VM as yourself.
2. Open a PowerShell terminal as Administrator. (Click Start, type PowerShell, and then press `Shift+Ctrl+Enter`.)

Reset the Administrator account password and make the account active

```ps
PS C:\> net user Administrator *
PS C:\> net user Administrator /active:yes
```

Install Active Directory on your Windows Server

```ps
PS C:\> Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools
```

Install the new Active Directory forest configuration in Windows Server 2016 mode. Edit the domain name to match your PCF domain, but add an `ad` subdomain. For example my PCF domain is `pcf.example.com` so I'm going to create an AD domain called `ad.pcf.example.com`.

```ps
PS C:\> Install-ADDSForest -CreateDnsDelegation:$false `
  -DatabasePath "C:\Windows\NTDS" `
  -LogPath "C:\Logs" `
  -SysvolPath "C:\Windows\SYSVOL" `
  -DomainName "ad.pcf.example.com" `
  -DomainMode "7" `
  -ForestMode "7" `
  -InstallDNS:$true `
  -NoRebootOnCompletion:$true `
  -Force:$true
```

## Configure PAS to use LDAP

Login to your OpsManager VM go to the Authentication and Enterprise SSO tab of the Pivotal Application Service tile. These instructions assume you've already installed the PAS tile on your OpsManager installation. Select the LDAP Server radio button. Enter the following information into the tile:

- Server URL: `ldap://10.1.0.100`
- LDAP Credentials: The Windows user name and password you used to intially login with. For non-toy installs use a service account. In some scenarios you may need to specify the full distinguished name of the service account, for example `cn=ldapsvc,ou=service,dc=ad,dc=pcf,dc=example,dc=com`.
- User Search Base: `dc=ad,dc=pcf,dc=example,dc=com` adjust as needed to match your domain name
- User Search Filter: `sAMAccountName={0}` this allows users to login with their short user name, no email
- Group Search Base: `dc=ad,dc=pcf,dc=example,dc=com`
- Group Search Filter: `member={0}`
- First Name Attribute: `givenName`
- Last Name Attribute: `sn`
- Email Attribute: `mail`

{{% notice tip %}}
This configuration assumes you're _not_ using secure ldaps. If you were then you'd use `ldaps://10.1.0.100`. You might also need to provide the Server SSL Cert and Server SSL Cert AltName.
{{% /notice %}}

Click `Save`. Go back to the OpsManager installation dashboard and click `Apply Changes`. Once the deployment completes you should be able to login to Apps Manager using the same AD account you used to login to the Windows AD Server.

### Advanced Search Filters

AD supports compound LDAP query expressions.

If you want to limit who can login to PCF by group membership you can specify a User Search Filter which ensures the user is a member of a specified group. For example this filter will require the user is a member of the `PCF_Users_Group`:

```
(&(objectClass=user)(sAMAccountName={0})(memberof=cn=PCF_Users_Group,ou=users,dc=ad,dc=pcf,dc=example,dc=com))
```

## Troubleshooting

More often than not you've botched something up the first time you turn on LDAP integration in PAS and you need to troubleshoot why you can't login. All of the commands in this section assume you're SSH'd into the OpsManager VM and run from there.

First of all let's make sure you have connectivity to the AD server from OpsManager. 

```sh
$ nc -z -v -w5 10.1.0.100 389
```

The above command assumes you're _not_ using secure ldaps. If you were using ldaps you'd need to change the port to `636`. Next let's make sure you can successfully query LDAP with the provided service account and filter. To do that install the `ldapsearch` tool.

```sh
$ sudo apt-get update
$ sudo apt-get install ldap-utils
```

Once installed run the following query to ensure it can successfully bind to ldap and retrieve a user account. Replace both usages of `myadaccount` with the actual account you used to login to the Windows VM/Apps Manager.

```sh
$ ldapsearch -H "ldap://10.1.0.100:389" -D "myadaccount" -W -b "ou=users,dc=ad,dc=pcf,dc=example,dc=com" 'sAMAccountName=myadaccount'
```

Most of the time you'll find what went wrong, usually a bad config setting. Sometimes you need more information. In that case you'll want to tail the UAA logs in PAS. Assuming you've already aliased your OpsMan BOSH director as `pcf`, then run (replacing `cf-someguid` with your actual CF deployment):

```sh
$ bosh -e pcf -d cf-someguid logs uaa -f
```

Now while following the UAA logs (across all instances), login to App Manager, observe the error logged by UAA. You should get the full error LDAP error code to help narrow down the underlying cause.

#### Troubleshooting from Windows

Sometimes it's convenient to validate your ldap search expressions on Windows. You can easily do this using PowerShell.

```ps
Get-ADUser -SearchBase 'dc=ad,dc=pcf,dc=example,dc=com' -LdapFilter 'sAMAccountName=yourUserName'
```

## Resources
* https://cloud.google.com/solutions/deploy-fault-tolerant-active-directory-environment
* https://cloud.google.com/vpc/docs/using-vpc-peering
* https://docs.pivotal.io/pivotalcf/2-0/opsguide/auth-sso.html#configure-ldap
* https://docs.pivotal.io/pivotalcf/2-0/opsguide/external-user-management.html#user-role
* https://discuss.pivotal.io/hc/en-us/articles/204140418-Configuring-LDAP-Integration-with-Pivotal-Cloud-Foundry-
