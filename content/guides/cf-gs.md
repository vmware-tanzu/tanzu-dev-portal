---
date: '2020-07-28'
description: Get your Python application into production in seconds and explore how
  Cloud Foundry simplifies a developers' job from log streaming to scaling.
lastmod: '2021-03-07'
linkTitle: Python On Cloud Foundry
metaTitle: Running a Python Application into Production
patterns:
- Deployment
tags:
- Cloud-foundry
- Python
- Buildpacks
- Containers
team:
- Ben Wilcock
title: 'Python Like A Pro: How To Deploy Python Application Into Production'
oldPath: "/content/guides/python/cf-gs.md"
aliases:
- "/guides/python/cf-gs"
level1: Deploying Modern Applications
level2: Packaging and Publishing
---

In this guide, you'll learn how to get a Python application into production in seconds. 

Production is super important. It's where your users meet your code and where you get recognition for all the hard work you've put in. Production is where your company competes, and where it gets rewarded for all the risks it's taken --- large and small.

Getting code into production quickly and regularly is life changing for developers like yourself. It opens the door to true agility --- a huge win for you, your team, and your company. But if the path to production is littered with roadblocks, getting your applications out there will be tiring and time consuming. 

That's where Cloud Foundry comes in. 

## What Is Cloud Foundry?

[Cloud Foundry][cloud-foundry] is an open-source platform that simplifies the lives of developers. Cloud Foundry's ['Application Runtime'][cfar] takes your application code --- written in Python or a number of other languages or frameworks --- and runs it on any cloud, including Azure, AWS, GCP, Kubernetes, or even vSphere VMs.

A unique feature of Cloud Foundry is its smooth developer experience. Using a single command you can have your code running in a safe, secure, and stable environment in seconds. Once running, Cloud Foundry takes care of everything else including log streaming, health monitoring, scaling, networking, load-balancing, and makes everyday chores like starting and stopping applications a breeze. 

## Before You Begin

There are a few things you need to do before getting started with Cloud Foundry:

- Install the [Cloud Foundry CLI][cf-cli] tool on your computer. This is the tool you will use to interact with Cloud Foundry. You can check that the tool is working by issuing the command `cf help`.

- Decide which Cloud Foundry you're going to use and obtain it's endpoint URL. If you don't have a Cloud Foundry to work with, consider installing Cloud Foundry locally onto Kubernetes on your computer by following the steps in [this guide][cf-on-k8s] 

{{% callout %}}
**Note**: Cloud Foundry goes by many names. There are many ['certified distributions'][certified] that offer Cloud Foundry as a commercial product. The [VMware Tanzu Application Service][tas] is one example. It is certified to meet the Cloud Foundry open-source standard and is fully compatible with the [cf CLI][cf-cli] tool.
{{% /callout %}}

## Get The Sample Python Application

Download the sample Python application from Github and make the sample application's folder your current working directory as follows:

```bash
> git clone https://github.com/benwilcock/buildpacks-python-demo.git
> cd buildpacks-python-demo
```

In the folder you will notice three text files, `web.py`, `requirements.txt`, and `Procfile`. If you already know what each of these files is for, you can skip ahead to the next section. If you want to know more about them, read on.

The file `web.py` contains a hello-world web application written in `Python3` using the `Flask` and `MarkupSafe` libraries. 

```python
from flask import Flask
from markupsafe import escape
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/hello/<username>')
def hello_user(username):
    # say hello to that user
    return 'Hello %s' % escape(username)
```

The file `requirements.txt` clarifies which libraries your application is dependent on, and their versions. Pip can generate the contents of this file for you using the command `pip freeze`.

```text
click==7.1.2
Flask==1.1.2
itsdangerous==1.1.0
Jinja2==2.11.2
MarkupSafe==1.1.1
Werkzeug==1.0.1
```

The `Procfile` specifies the command-line used to execute the application at runtime. In this case the Procfile declares that the `web.py` file contains your `FLASK_APP`, calls `flask run`, and binds the web-server to the `--host` with the IP address `0.0.0.0`. It is expected that the `--port` to bind the application to will be set as an environment variable using the name `$PORT`.

```text
web: FLASK_APP=web.py python3 -m flask run --host=0.0.0.0 --port=$PORT
```

Cloud Foundry's buildpack system uses these files to determine that your application is a Python application. Follow the steps below to run this application in Cloud Foundry.

## Login To Cloud Foundry

You can login to your Cloud Foundry application service using the `cf login` command as follows:

```bash
> cf login -a <your-api-url>
```

The `cf` tool will then prompt you for your credentials and ask you to select an 'org' and a 'space'. For example:

```bash
> cf login -a CF_API_ENDPOINT_URL
API endpoint: CF_API_ENDPOINT_URL

Email: <enter-your-email>

Password: <enter-your-password>

Select an org:
1. tanzu-devrel

<enter-selected-org-number>

Select a space:
1. development
2. production

<enter-selected-space-number>
```

If you're using your employers Cloud Foundry, the login process may be different. For example, you may have single sign on (SSO) rather than a username and password and you may be restricted in terms of which orgs and spaces are available to you. 

'Org and space' are simply Cloud Foundry terms for application partitioning. Depending on how your cloud foundry was set up, you may see very different names and options. Cloud Foundry doesn't attach any special meaning to these names. Production could just as easily be called 'bob' if that makes sense in your organization. Ask your platform team for advice on which space to use.

{{% callout %}}
**Note**: Don't really push apps to production unless it's definitely safe for you to do so!
{{% /callout %}}

If at any point you need to remind yourself which API url, org, or space you are currently using, you can use the `cf target` command like this:

```bash
> cf target

api endpoint:   CF_API_ENDPOINT_URL
api version:    2.151.0
user:           <your-email>
org:            tanzu-devrel
space:          production
```

If at any time you need help with a specific command such as `cf login` simply ask for context specific help using the `--help` option as shown below:

```bash
> cf login --help

NAME:
   login - Log user in

USAGE:
   cf login [-a API_URL] [-u USERNAME] [-p PASSWORD] [-o ORG] [-s SPACE] [--sso | --sso-passcode PASSCODE] [--origin ORIGIN]
```

## Run Your Python Application In The 'Production' Space

The `cf target` command above confirmed that the `production` space is the current target for your applications. Any space is fine, it doesn't have to be production, the process is the same. 

The command you use to run your application on Cloud Foundry is `cf push`. You must give the application a name when you push it. In the example below the name `python-demo` has been used:

```bash
> cf push python-demo --random-route
Pushing app python-demo to org tanzu-devrel / space production as <your-email>
```
{{% callout %}}
**Note**: You don't have to use `--random-route` either, it just prevents clashes when an app exists with the same name elsewhere on your Cloud Foundry instance.
{{% /callout %}}

The `cf push` command uses a technology called '[buildpacks][python-cnb-guide]' to put your Python application into a Docker container before running it. The process takes no more than a minute or two on average. During that time, Cloud Foundry will communicate what the buildpack is doing before finally confirming that your application is running.

When the application has started, Cloud Foundry will alert you and give you the route (URL) that has been assigned to the application.

```bash
Waiting for app to start...

name:              python-demo
requested state:   started
routes:            python-demo-lean-quokka-sc.cfapps.io
last uploaded:     Tue 28 Jul 16:32:38 BST 2020
stack:             cflinuxfs3
buildpacks:        python

type:            web
instances:       1/1
memory usage:    1024M
start command:   FLASK_APP=web.py python3 -m flask run --host=0.0.0.0 --port=$PORT
     state     since                  cpu    memory       disk           details
0   running   2020-07-28T15:32:55Z   0.0%   4.3M of 1G   214.6M of 1G
```

In this case, the route assigned to this application by Cloud Foundry is `python-demo-lean-quokka-sc.cfapps.io`. Your application's route will be different. You will use the route __you__ have been given to test that you can communicate with the application.

## Test Your Python Application Is Running

To test the application is running, issue a HTTP GET request to the route Cloud Foundry gave to you when you used the `cf push` command in the previous step.

```bash
> http python-demo-lean-quokka-sc.cfapps.io
```

The application will respond with the legend 'Hello, World!' like so:

```bash
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 13
Content-Type: text/html; charset=utf-8
Date: Tue, 28 Jul 2020 15:37:41 GMT
Server: Werkzeug/1.0.1 Python/3.8.3
X-Vcap-Request-Id: 7b49d6ff-30d3-46c1-75d8-0bb75275b75d

Hello, World!
```

The test above uses the [HTTPie][httpie] tool, but you could also use `curl` or a regular web browser. It's up to you.


## There's More

Here's a few more commonly used `cf` commands for you. Don't forget, you can use `cf help` to get a full list of all the available commands at any time, and `cf <command> --help` will give you detailed information on each of them.

### Listing Your Applications

You can see a list of all the applications you have running in your current space at any time using the `cf apps` command. 

```bash
> cf apps
Getting apps in org tanzu-devrel / space production as <your-email>...
OK

name          requested state   instances   memory   disk   urls
python-demo   started           1/1         1G       1G     python-demo-lean-quokka-sc.cfapps.io
```

### Getting Detailed Application Status

You can get fine-grained application status using the `cf app` command.

```bash
> cf app python-demo
Showing health and status for app python-demo in org tanzu-devrel / space production as <your-email>...

name:              python-demo
requested state:   started
routes:            python-demo-lean-quokka-sc.cfapps.io
last uploaded:     Tue 28 Jul 16:32:38 BST 2020
stack:             cflinuxfs3
buildpacks:        python

type:           web
instances:      1/1
memory usage:   1024M
     state     since                  cpu    memory        disk           details
0   running   2020-07-28T15:32:55Z   0.5%   30.8M of 1G   214.6M of 1G
```

### Tailing An Applications Log

You can view the log stream for your application in realtime with the `cf logs` command.

```bash
> cf logs python-demo
Retrieving logs for app python-demo in org tanzu-devrel / space production as <your-email>...

...
```

You can get recent logs (rather than a tail of the log) using the `--recent` option.

### Deleting (Removing) An Application

You can remove and delete your application from Cloud Foundry at any time using the `cf delete` command.

```bash
> cf delete python-demo
Really delete the app python-demo?> y
Deleting app python-demo in org tanzu-devrel / space production as <your-email>...
OK
```

## Keep Learning

Most Cloud Foundry installations include a Python Buildpack. But did you know that you can use buildpacks without using Cloud Foundry? Buildpacks are a fabulous, sustainable, stress-free way to get code into Docker containers. To find out how to use them in your Python tool chain take a look at our [Python buildpack guide][python-cnb-guide].

Did you know that can push Docker images directly to Cloud Foundry? You use the same `cf push` command but add the `--docker-image` option. Take a look at the help for the push command for more information or read the docs [here](http://cli.cloudfoundry.org/en-US/cf/push.html).

Did you know that you can run Cloud Foundry directly on top of Kubernetes? That means you can get the same smooth `cf push` experience on your Kubernetes cluster. Just think, less YAML, less `kubectl`, less stress! You can get started with our [CF for K8s guide][cf-on-k8s].

If you liked this guide, you might find these others in our 'Python Like A Pro' series useful:

- [Install Python Like A Pro!][gs-pyenv]
- [Managing Python Project Dependencies Like A Pro!][gs-pyenv-venv]
- [Managing Python Global Packages Like A Pro][gs-pipx]
- [Build Python Docker Containers Like A Pro!][gs-cnb]

And if you'd prefer to see Cloud Foundry in action without actually following the steps above, check out our video guide:

{{< youtube qLg2xtQ5kTA >}}

---
[cloud-foundry]: https://cloudfoundry.org
[cfar]: https://www.cloudfoundry.org/application-runtime/
[cf-cli]: https://docs.cloudfoundry.org/cf-cli/install-go-cli.html
[cf-on-k8s]: /guides/kubernetes/cf4k8s-gs
[tas]: https://tanzu.vmware.com/application-service
[certified]: https://www.cloudfoundry.org/thefoundry/#cert-distros
[python-cnb-guide]: /guides/python/cnb-gs-python
[httpie]: https://httpie.org/

[gs-pyenv]: /guides/python/gs-python-like-a-pro
[gs-pyenv-venv]: /guides/python/gs-managing-python-packages
[gs-pipx]: /guides/python/gs-python-installing-global-packages
[gs-cnb]: /guides/python/cnb-gs-python
[gs-cf]: /guides/python/cf-gs