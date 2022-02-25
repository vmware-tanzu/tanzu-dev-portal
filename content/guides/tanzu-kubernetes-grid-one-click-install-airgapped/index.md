---
title: "Tanzu Kubernetes Grid 1-click Install into an Air Gapped Environment"
description: This blog posts walks you through installing a security technical implementation guide (STIG) hardened Tanzu Kubernetes Grid for multi-cloud cluster with federal information processing standards (FIPS) enabled on Amazon Web Services (AWS). After all of the prerequisites are met it is as simple as exporting some environment variables and running 1 script to deploy.
date: 2022-02-24
lastmod: 2022-02-24
level1: Building Kubernetes Runtime
level2: Building Your Kubernetes Platform
tags:
- Tanzu
- Tanzu Kubernetes Grid
tanzu:
  label: tkg
# Author(s)
team:
- Nitin Ravindran
---

This blog posts walks you through installing a security technical implementation guide (STIG) hardened Tanzu Kubernetes Grid for multi-cloud cluster with federal information processing standards(FIPS) enabled on Amazon Web Services(AWS). After all of the prerequisites are met it is as simple as exporting some environment variables and running 1 script to deploy.

## Prerequisites
In order to install Tanzu Kubernetes Grid for multi-cloud into a 1 click deployment there are numerous prerequisites that are outlined below.

1. A preexisting `AirGapped` Virtual Private Network (VPC) in AWS. This AWS VPC should have VPC endpoints enabled to allow access within the VPC to the following AWS services
    * STS
    * SSM
    * EC2
    * `ec2messages`
    * `elasticloadbalancing`
    * `secretsmanager`
    * `ssmmessages`
    * S3

2. An AWS S3 bucket that is accessible from within the `AirGapped` VPC. This can be accomplished by applying a bucket policy to your S3 bucket. The S3 bucket should be in the same region as the region where Tanzu Kubernetes Grid for multi-cloud is installed

3. A portable media device with
    * The Tanzu Kubernetes Grid for multi-cloud 1 click dependencies
    * 1 click installer repo
 
    ![](images/debs-to-usb.png) 

## Installing Tanzu Kubernetes Grid

1. Copy the contents of the portable media to the bastion VM.

    ![](images/debs-to-bastion.png) 

1. Copy 1 click dependencies to the AWS S3 bucket by executing the below inside the 1 click dependencies directory.

    ```sh
    aws s3 cp . s3://<BUCKET_NAME> --recursive
    ````

    ![](images/copy-deps.png) 

3. Export the following environment variables:

    ```sh
    export TF_VAR_bucket_name=<AWS S3 bucket name containing 1 click dependencies>
    export TF_VAR_region=<AWS Region where Tanzu Kubernetes Grid for multi-cloud will be installed>
    export TF_VAR_vpc_id=<AirGapped VPC ID>
    export TF_VAR_subnet_id=<Private Subnet ID where Tanzu Kubernetes Grid for multi-cloud will be installed>
    export TF_VAR_ssh_key_name=<AWS RSA SSH key>
    export TF_VAR_az_zone=<AWS AZ_ZONE>
    export AWS_ACCESS_KEY_ID=<AWS Access Key ID>
    export AWS_SECRET_ACCESS_KEY=<AWS Secret Access Key>
    export AWS_DEFAULT_REGION=<AWS Region where Tanzu Kubernetes Grid for multi-cloud will be installed>
    ```

4. Execute the below inside the 1 click installer repo

    ```sh
    ./1click.sh
    ```

## What Is Installed?

The 1 click script has the following flow by default.

1. Creates an Amazon Linux 2 AMI which starts harbor, an open source image registry, and populates Tanzu Kubernetes Grid images into it

    ```sh
    ./1click.sh
    pushd terraform-harbor; pwd; terraform init --backend   --backend-config="bucket=tkg-debs"    --backend-config="key=terraform/harbor-state"  --backend-config="region=us-east-1"; terraform apply     -auto-approve; popd
    bash: gcloud: command not found
    /home/ubuntu/tkg-1click/terraform-harbor /home/ubuntu/  tkg-1click
    /home/ubuntu/tkg-1click/terraform-harbor

    Initializing the backend...

    Successfully configured the backend "s3"! Terraform will    automatically
    use this backend unless the backend configuration changes.

    Initializing provider plugins...
    - Finding latest version of hashicorp/template...
    - Finding latest version of hashicorp/aws...
    - Installing hashicorp/aws v3.74.0...
    - Installed hashicorp/aws v3.74.0 (signed by HashiCorp)
    - Installing hashicorp/template v2.2.0...
    - Installed hashicorp/template v2.2.0 (signed by HashiCorp)

    Terraform has created a lock file .terraform.lock.hcl to    record the provider
    selections it made above. Include this file in your version     control repository
    so that Terraform can guarantee to make the same selections     by default when
    you run "terraform init" in the future.

    Terraform has been successfully initialized!

    You may now begin working with Terraform. Try running   "terraform plan" to see
    any changes that are required for your infrastructure. All  Terraform commands
    should now work.

    If you ever set or change modules or backend configuration  for Terraform,
    rerun this command to reinitialize your working directory.  If you forget, other
    commands will detect it and remind you to do so if necessary.

    Terraform used the selected providers to generate the   following execution plan. Resource actions are indicated  with the following symbols:
      + create
    ```

    After Terraform finishes you will see.

    ```sh
    instance_profile = "tkg-1click-s3_instance_profile"
    private_dns = "ip-10-0-10-203.ec2.internal"
    /home/ubuntu/tkg-1click
    Harbor still starting waiting 60 seconds
    ```
    
    If you would like to follow the harbor logs you can ssh into the private DNS returned by Terraform as `ec2-user` and run the below.
    
    ```sh
    sudo tail -f /var/log/cloud-init-output.log
    ```
    
    You will see Harbor still starting waiting 60 seconds every minute until harbor starts.

    ![](images/install-harbor.png) 


2. Creates a Tanzu Kubernetes Grid Bootstrap Amazon Machine Image(AMI) using the contents of AWS S3 bucket containing 1 click dependencies.

    ```sh
    make[1]: Entering directory '/home/ubuntu/tkg-1click/ami/   tkg-bootstrap'
    envsubst < local.list.txt > local.list
    docker run --net host -it --rm --name bootstrap-ami-builder \
    	-e VPC_ID \
    	-e SUBNET_ID \
    	-e AWS_DEFAULT_REGION \
    	-e AWS_SECRET_ACCESS_KEY \
    	-e AWS_ACCESS_KEY_ID \
    	-e BUCKET_NAME \
    	-e PACKER_VAR_FILES='/home/imagebuilder/user.json' \
    	-v /home/ubuntu/tkg-1click/ami/tkg-bootstrap/local.list:/   home/imagebuilder/local.list \
    	-v /home/ubuntu/tkg-1click/ami/tkg-bootstrap/roles/ bootstrap/files/ca:/home/imagebuilder/roles/bootstrap/   files/ca \
    	-v /home/ubuntu/tkg-1click/ami/tkg-bootstrap/   user_offline.json:/home/imagebuilder/user.json \
    	ip-10-0-10-203.ec2.internal/tkg/bootstrap-ami-builder:v0.   1.9_vmware.1 \
    	build-ubuntu-2004
    Unable to find image 'ip-10-0-10-203.ec2.internal/tkg/  bootstrap-ami-builder:v0.1.9_vmware.1' locally
    v0.1.9_vmware.1: Pulling from tkg/bootstrap-ami-builder
    ea362f368469: Pull complete
    73b6edcf7fb2: Pull complete
    fac1d0619e88: Pull complete
    1a60e231cdbc: Pull complete
    d83709276bd6: Pull complete
    39e128b345e9: Pull complete
    089acc6f7b28: Pull complete
    754f0cb4ac1a: Pull complete
    9c4ce866b29b: Pull complete
    608299974197: Pull complete
    b6da548f2bab: Pull complete
    Digest:     sha256:5f8f0b8166d447ec6164e16b61cf8a9743bc6e7d7c2577305372a5   fea26c2311
    Status: Downloaded newer image for ip-10-0-10-203.ec2.  internal/tkg/bootstrap-ami-builder:v0.1.9_vmware.1
    packer build -var-file="/home/imagebuilder/user.json"   -var-file=packer/ubuntu-2004.json -var-file=packer/ansible.  json packer/packer.json
    aws-tkg-bootstrap-builder: output will be in this color.

    ==> aws-tkg-bootstrap-builder: Prevalidating any provided   VPC information
    ==> aws-tkg-bootstrap-builder: Prevalidating AMI Name:  tkg-v1.4.0-fips.1-bootstrap-ubuntu-20.04-1643836223
        aws-tkg-bootstrap-builder: Found Image ID:  ami-01b996646377b6619
    ==> aws-tkg-bootstrap-builder: Creating temporary keypair:  packer_61faf33f-04da-e2e4-371d-c65a4e7ee0ca
    ==> aws-tkg-bootstrap-builder: Creating temporary security  group for this instance:     packer_61faf342-2e46-777d-0b1d-35906e56d272
    ==> aws-tkg-bootstrap-builder: Authorizing access to port 22    from [0.0.0.0/0] in the temporary security groups...
    ==> aws-tkg-bootstrap-builder: Launching a source AWS   instance...
    ==> aws-tkg-bootstrap-builder: Adding tags to source instance
        aws-tkg-bootstrap-builder: Adding tag: "Name": "Packer  Builder"
        aws-tkg-bootstrap-builder: Instance ID:     i-0c1d885644cded3b4
    ==> aws-tkg-bootstrap-builder: Waiting for instance     (i-0c1d885644cded3b4) to become ready...
    ```         

    You will see the following upon completion.

    ```sh
    ==> aws-tkg-bootstrap-builder: Waiting for the instance to  stop...
    ==> aws-tkg-bootstrap-builder: Creating AMI tkg-v1.4.0-fips.    1-bootstrap-ubuntu-20.04-1643836223 from instance   i-0c1d885644cded3b4
        aws-tkg-bootstrap-builder: AMI: ami-05cf054a1ecf64784
    ==> aws-tkg-bootstrap-builder: Waiting for AMI to become    ready...
    ==> aws-tkg-bootstrap-builder: Skipping Enable AMI  deprecation...
    ==> aws-tkg-bootstrap-builder: Modifying attributes on AMI  (ami-05cf054a1ecf64784)...
        aws-tkg-bootstrap-builder: Modifying: description
    ==> aws-tkg-bootstrap-builder: Modifying attributes on  snapshot (snap-0c079872825f5c8a7)...
    ==> aws-tkg-bootstrap-builder: Terminating the source AWS   instance...
    ==> aws-tkg-bootstrap-builder: Cleaning up any extra volumes.   ..
    ==> aws-tkg-bootstrap-builder: No volumes to clean up,  skipping
    ==> aws-tkg-bootstrap-builder: Deleting temporary security  group...
    ==> aws-tkg-bootstrap-builder: Deleting temporary keypair...
    ==> aws-tkg-bootstrap-builder: Running post-processor:  manifest
    Build 'aws-tkg-bootstrap-builder' finished after 15 minutes     43 seconds.

    ==> Wait completed after 15 minutes 43 seconds

    ==> Builds finished. The artifacts of successful builds are:
    --> aws-tkg-bootstrap-builder: AMIs were created:
    us-east-1: ami-05cf054a1ecf64784

    --> aws-tkg-bootstrap-builder: AMIs were created:
    us-east-1: ami-05cf054a1ecf64784
    ```

    ![](images/create-bootstrap-ami.png) 

 3. Creates a STIG AMI with FIPS enabled using the contents of AWS S3 bucket containing 1 click dependencies

    ```sh
    make[1]: Entering directory '/home/ubuntu/tkg-1click/ami/   stig'
    envsubst < local.list.txt > local.list
    docker run --net host -it --rm --name stig-ami-builder \
    	-e AWS_DEFAULT_REGION \
    	-e AWS_SECRET_ACCESS_KEY \
    	-e AWS_ACCESS_KEY_ID \
    	-e OFFLINE_INSTALL=yes \
    	-e VPC_ID \
    	-e SUBNET_ID \
    	-e BUCKET_NAME \
    	-e OFFLINE_REGISTRY \
    	-e UBUNTU_ADVANTAGE_PASSWORD \
    	-e UBUNTU_ADVANTAGE_PASSWORD_UPDATES \
    	-e PACKER_VAR_FILES='/home/imagebuilder/aws_settings.   json /home/imagebuilder/tkg.json /home/imagebuilder/   tkg_offline.json' \
    	-v /home/ubuntu/tkg-1click/ami/stig/local.list:/home/   imagebuilder/local.list:Z \
    	-v /home/ubuntu/tkg-1click/ami/stig/tkg_offline.json:/  home/imagebuilder/tkg_offline.json:Z \
    	-v /home/ubuntu/tkg-1click/ami/stig/aws_settings_offline.   json:/home/imagebuilder/aws_settings.json:Z \
    	-v /home/ubuntu/tkg-1click/ami/stig/roles/  canonical-ubuntu-18.04-lts-stig-hardening/files/ca:/home/ imagebuilder/canonical-ubuntu-18.04-lts-stig-hardening/  files/ca/:Z \
    	ip-10-0-10-203.ec2.internal/tkg/stig-ami-builder:v0.1.  9_vmware.1\
    	build-ami-ubuntu-1804
    Unable to find image 'ip-10-0-10-203.ec2.internal/tkg/  stig-ami-builder:v0.1.9_vmware.1' locally
    v0.1.9_vmware.1: Pulling from tkg/stig-ami-builder
    a31c7b29f4ad: Pull complete
    f97edb9e7518: Pull complete
    024c04330661: Pull complete
    c7ae3c729f16: Pull complete
    1bef4138bdba: Pull complete
    96d427dce0f2: Pull complete
    5013d108ce03: Pull complete
    4335f59b89db: Pull complete
    7f25083f1dd6: Pull complete
    6a70acddfa1a: Pull complete
    b3b0de310b39: Pull complete
    1a1f1be7efd0: Pull complete
    516edbb07f0e: Pull complete
    5bf59d52a0b1: Pull complete
    fb402c832404: Pull complete
    2625dbf68a17: Pull complete
    41eddd634ad1: Pull complete
    Digest:     sha256:b7c966da9ec6e439b66b3b362e749ddb6188e2ff33208649900061   0b5b92152d
    Status: Downloaded newer image for ip-10-0-10-203.ec2.  internal/tkg/stig-ami-builder:v0.1.9_vmware.1
    hack/ensure-ansible.sh
    hack/ensure-ansible-windows.sh
    hack/ensure-packer.sh
    hack/ensure-goss.sh
    Right version of binary present
    packer build -var-file="/home/imagebuilder/packer/config/   kubernetes.json"  -var-file="/home/imagebuilder/packer/    config/cni.json"  -var-file="/home/imagebuilder/packer/ config/containerd.json"  -var-file="/home/imagebuilder/  packer/config/ansible-args.json"  -var-file="/home/   imagebuilder/packer/config/goss-args.json"  -var-file="/home/  imagebuilder/packer/config/common.json"  -color=true  -var-file="/home/imagebuilder/packer/ami/ubuntu-1804.json"   -var-file="/home/imagebuilder/aws_settings.json"      -var-file="/home/imagebuilder/tkg.json"  -var-file="/home/  imagebuilder/tkg_offline.json"  packer/ami/packer.json
    ubuntu-18.04: output will be in this color.
    
    ==> ubuntu-18.04: Prevalidating any provided VPC information
    ==> ubuntu-18.04: Prevalidating AMI Name: capa-ami-ubuntu-18.   04-1.18.15-00-1643837233
        ubuntu-18.04: Found Image ID: ami-0a14be708fcb20c8e
    ==> ubuntu-18.04: Creating temporary keypair:   packer_61faf732-96a7-c927-6d3e-b87c1f00dce6
    ==> ubuntu-18.04: Creating temporary security group for this    instance: packer_61faf734-a060-0cdb-73cc-ab4654df5b93
    ==> ubuntu-18.04: Authorizing access to port 22 from [0.0.0.    0/0] in the temporary security groups...
    ==> ubuntu-18.04: Launching a source AWS instance...
    ==> ubuntu-18.04: Adding tags to source instance
        ubuntu-18.04: Adding tag: "Name": "Packer Builder"
        ubuntu-18.04: Instance ID: i-0d901e824a6402f87
    ==> ubuntu-18.04: Waiting for instance (i-0d901e824a6402f87)    to become ready...
    ```

    You will see the following upon completion.
    
    ```sh
    ==> ubuntu-18.04: Waiting for AMI to become ready...
    ==> ubuntu-18.04: Modifying attributes on AMI   (ami-00b79c841eeef51c2)...
        ubuntu-18.04: Modifying: description
    ==> ubuntu-18.04: Modifying attributes on snapshot  (snap-0673c7391383cd1e7)...
    ==> ubuntu-18.04: Adding tags to AMI (ami-00b79c841eeef51c2).   ..
    ==> ubuntu-18.04: Tagging snapshot: snap-0673c7391383cd1e7
    ==> ubuntu-18.04: Creating AMI tags
        ubuntu-18.04: Adding tag: "image_builder_version": "v0.1.   9_vmware.1"
        ubuntu-18.04: Adding tag: "containerd_version": "v1.4.6 +vmware.1"
        ubuntu-18.04: Adding tag: "distribution": "Ubuntu"
        ubuntu-18.04: Adding tag: "distribution_version": "18.04"
        ubuntu-18.04: Adding tag: "build_timestamp": "1643838638"
        ubuntu-18.04: Adding tag: "kubernetes_version": "v1.21. 2%2Bvmware.1"
        ubuntu-18.04: Adding tag: "source_ami": ""
        ubuntu-18.04: Adding tag: "build_date":     "2022-02-02T21:50:38Z"
        ubuntu-18.04: Adding tag: "distribution_release":   "bionic"
        ubuntu-18.04: Adding tag: "kubernetes_cni_version": "v0.    8.7%2Bvmware.14"
    ==> ubuntu-18.04: Creating snapshot tags
    ==> ubuntu-18.04: Terminating the source AWS instance...
    ==> ubuntu-18.04: Cleaning up any extra volumes...
    ==> ubuntu-18.04: No volumes to clean up, skipping
    ==> ubuntu-18.04: Deleting temporary security group...
    ==> ubuntu-18.04: Deleting temporary keypair...
    ==> ubuntu-18.04: Running post-processor: manifest
    Build 'ubuntu-18.04' finished after 20 minutes 26 seconds.
    
    ==> Wait completed after 20 minutes 26 seconds
    
    ==> Builds finished. The artifacts of successful builds are:
    --> ubuntu-18.04: AMIs were created:
    us-east-1: ami-00b79c841eeef51c2
    
    --> ubuntu-18.04: AMIs were created:
    us-east-1: ami-00b79c841eeef51c2
    ```

    ![](images/create-STIG-ami.png) 

4. Create Tanzu Kubernetes Grid Bootstrap instance using the Tanzu Kubernetes Grid Bootstrap AMI which deploys a Tanzu Kubernetes Grid Management Cluster into the `AirGapped` VPC.

    ```sh
    pushd terraform; pwd; terraform init --backend  --backend-config="bucket=tkg-debs" --backend-config="key=terraform/  tkg-bootstrap" --backend-config="region=us-east-1"; terraform apply   -auto-approve; popd
    /home/ubuntu/tkg-1click/terraform /home/ubuntu/tkg-1click
    /home/ubuntu/tkg-1click/terraform

    Initializing the backend...

    Initializing provider plugins...
    - Reusing previous version of hashicorp/template from the dependency lock file
    - Reusing previous version of hashicorp/aws from the dependency lock file
    - Using previously-installed hashicorp/aws v3.74.0
    - Using previously-installed hashicorp/template v2.2.0

    Terraform has been successfully initialized!
    ```

    After Terraform finishes you will see the below.

    ```sh
    Apply complete! Resources: 11 added, 0 changed, 0 destroyed.

    Outputs:

    private_dns = "ip-10-0-10-207.ec2.internal"
    ```

    ![](images/create-bootstrap-vm.png) 

    Once this has finished you should be able to ssh to the Tanzu Kubernetes Grid bootstrap server, private DNS returned by Terraform, using the provided ssh key name with the user `ubuntu`. Once there you can run 
    
    ```sh 
    sudo tail -f /var/log/cloud-init-output.log
    ````
    
    to see the status of your management cluster deploy.

    ![](images/create-stig-tkg.png)


## Using an Existing Registry

### Prerequisites
Using an existing registry is possible as long as you follow the steps documented below.

1. Create a project within your registry called `tkg` so that images can be pushed to `<REGISRTRY NAME>/tkg`

2. Make the `tkg` project publicly readable within the `AirGapped` environment. I.E. no authorization needed

3. Download the scripts and images from the `tkg` dependencies bucket and run the publish scripts to push the images to the `tkg` project in your registry 

4. Your registries certificate authority needs to be placed into ca folders that are mounted as part of the AMI creation process

### Additional Environment Variables

In addition to the variables outlined in [Installing Tanzu Kubernetes Grid](#installing-tanzu-kubernetes-grid) when using an existing registry the following needs to be exported.

```sh
export TF_VAR_registry_name=<DNS Name of your image registry>
export USE_EXISTING_REGISTRY=true
export TF_VAR_registry_ca_filename=<Name of your ca file>
```

Note: The name of your ca file is the filename only and not the file path

![](images/existing-registry.png)
