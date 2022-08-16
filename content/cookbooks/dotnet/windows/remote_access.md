+++
date = "2018-07-02T12:00:00-07:00"
title = "Remote Windows Cell Access"
description = "Windows cell remote access"
weight = 5
+++

Generally you can access and troubleshoot your PASW deployment using standard bosh commands like `bosh ssh` or `bosh logs`, however there are times when these aren't available to you like when your bosh deployment fails during compilation.

### vSphere Remote Access

In vSphere you can generally access the failing compilation VM using the standard VMware console available in vCenter. The issue you might encounter is not knowing the what the administrator password is even if you set it to a known password in PASW because that job may not have run yet.

### GCP Remote Access

To access a failed GCP deployed PASW cell that doesn't yet have SSH enabled, you can get a PowerShell console on the VM using GCP serial port access. Use the below steps replacing the project, zone, and instance_name placeholders in each command.

Reset the administrator password (might be easier to use web portal) unless you already know what it is.
```
gcloud beta compute reset-windows-password projects/<project>/zones/<zone>/instances/<instance_name> --user=administrator
```

Enable read/write serial port access to the instances
```
gcloud compute instances add-metadata projects/<project>/zones/<zone>/instances/<instance_name> --metadata=serial-port-enable=1
```

Connect to the serial port, this opens a new browser window with a terminal
```
gcloud compute connect-to-serial-port projects/<project>/zones/<zone>/instances/<instance_name> --port 2
```

In the serial port window run the following commands to start a command prompt process and attach to it.
```
cmd
ch -sn Cmd0001
```

login as administrator using password you reset too and start PowerShell by typing `powershell.exe`
