---
date: '2020-08-19'
description: Learn how to isolate your Python dependencies using pyenv-virtualenv.
  Explore this guide to manage project dependencies and become a Python Pro!
lastmod: '2021-03-07'
linkTitle: Managing Python Project Dependencies
metaTitle: Managing Python Project Dependencies
patterns:
- Deployment
tags:
- Python
- Development
team:
- Ben Wilcock
title: 'Python Like A Pro: Managing Project Dependencies'
oldPath: "/content/guides/python/gs-managing-python-packages.md"
aliases:
- "/guides/python/gs-managing-python-packages"
level1: Building Modern Applications
level2: Frameworks and Languages
---

## Why Do You Need This Guide?

Suppose you've already mastered the fine art of [installing multiple versions of Python][install] on your computer using [Pyenv][pyenv]. In that case, you're probably keen to control your Python projects and the packages they use.

For a pro-developer, this means mastering some additional tools --- tools designed to help you maintain a healthy degree of separation between your 'system' dependencies and your project dependencies. Without these tools, your system quickly becomes a tangled mess of incompatible packages that break your projects and disrupt your flow.

## Before You Begin

This guide follows on where '[Python Like A Pro: Installing Python][install]' left off. To complete it, you'll need the `pyenv` tool installed on your system and Python 3.8.5 and Python 2.7.18, both installed using the `pyenv install` command as discussed in that earlier guide.

Check you have Pyenv and the Python versions required using the following command:

```bash
pyenv versions
```

If successful, you'll see output similar to that below, confirming that `pyenv` is working and that Python 3.8.5 and 2.7.18 are available. If not successful, go back to the [earlier guide][install].

```bash
* system (set by /home/ben/.pyenv/version)
  2.7.18
  3.8.5
```

Finally, if you'd prefer to watch a video on this guide, scroll down to the bottom of the page and hit 'play.'

## Managing Python Project Dependencies

As a rule of thumb, it's best if each Python project you work on has its own set of dependencies, both on the version of Python it needs, but also on any dependencies you install via [pip][pip]. This model is especially true if your work involves tens or even hundreds of Python projects --- like a microservices project.

In the past, giving each Python project its independence was difficult. There was no built-in way to achieve isolation between _all_ your Python projects.  Fortunately, the [Pyenv 'VirtualEnv'][peve] project can fix this issue, and it works with all Python versions including version 2.

Pyenv-virtualenv lets you:

* isolate Python projects using a workspace known as a 'virtual environment.'
* link a Python project to a specific Python version.
* isolate the pip dependencies within a Python project.
* automatically switch to the correct virtual environment for the current project.

Let's get 'hands-on' and take a closer look at `pyenv virtualenv` in action.

### Step 1: Create A Python 3.8.5 Project

Make a new folder and in this folder begin a new Python 3 project by adding a ready-made Python program file like so:

```bash
mkdir python-3-project
cd python-3-project
curl https://raw.githubusercontent.com/benwilcock/buildpacks-python-demo/master/web.py -o web.py
```

{{% callout %}}
To see the sample code in the hello world program you just downloaded, use `cat web.py`.
{{% /callout %}}


Now, still within the `python-3-project` folder, create a new Python 3.8.5 virtual environment using `pyenv virtualenv <version> <project-name>` like this:

```bash
pyenv virtualenv 3.8.5 py3
```

Then, activate the new `py3` virtual environment within the `python-3-project` folder as follows:

```bash
pyenv local py3
```

At this point, your prompt may change slightly to confirm that the virtual environment is active. The folder will contain a new hidden file called `.python-version`. This file contains the name of the virtual environment currently active for this folder --- in this case, `py3`. 

```bash
# .python-version
py3
```
  
### Step 2: Add Some Package Dependencies

From this point on, any dependencies you install while in this folder will be specific to the `py3` virtual environment. Add the [Flask][flask] and [Gunicorn][gunicorn] packages as follows:

```bash
pip install Flask gunicorn
```

Now, when you list the currently installed pip packages with `pip list`, the list displayed includes Flask and Gunicorn. The version of Gunicorn should be `20.x.x` or higher because this was the first version designed exclusively for Python 3. Freeze the pip installed packages and their versions into a file with the following command:

```bash
pip freeze > requirements.txt
```

The contents of the `requirements.txt` file should be similar to those shown below:

```bash
# requirements.txt
click==7.1.2
Flask==1.1.2
gunicorn==20.0.4
itsdangerous==1.1.0
Jinja2==2.11.2
MarkupSafe==1.1.1
Werkzeug==1.0.1
```

### Step 3: Test The Application

Use Gunicorn and Flask to run the `web.py` application as follows:

```bash
gunicorn --bind=0.0.0.0:8080 web:app
```

When Gunicorn starts, it reports its version as `20.x.x` like so:

```bash
[2020-08-19 10:37:08 +0100] [11875] [INFO] Starting gunicorn 20.0.4
```

Now, point your browser to `http://localhost:8080` and you'll be greeted with the legend __"Hello, World!"__

### Step 4: Leave The Project Folder

Finally, leave the `python-3-project` folder.

```bash
cd ..
```

The `py3` virtual environment will deactivate itself, and your regular command prompt will reappear. The command `pyenv version` will confirm which version of Python is currently active now you've left the `python-3-project` folder. 

```bash
# result of 'pyenv version' (in my case)
system (set by /home/ben/.pyenv/version)
```

{{% callout %}}
**Note**: Should you ever move back into the `python-3-project` folder, pyenv will automatically activate the `py3` virtual environment.
{{% /callout %}}


### Step 5: Rinse And Repeat With Python 2.8.17

Repeat steps 1-4 above, but this time, create a folder called `python-2-project` and use Python version 2.7.18 as the basis of your virtual environment. The updated commands for step 1 are as follows:

```bash
mkdir python-2-project
cd python-2-project
pyenv virtualenv 2.8.17 py2
pyenv local py2
```

In step 2, install the same packages via `pip`, but this time notice how the version of Gunicorn that pip installs changes to `19.x.x`. Version 19 of Gunicorn was the last version to support Python 2.

In step 3, run your app in Gunicorn as before, but this time, you'll notice that it's Gunicorn version `19.x.x` that has started:

```bash
[2020-08-19 11:14:52 +0000] [15150] [INFO] Starting gunicorn 19.10.0
```

## Keep Learning

To discover more of what `pyenv` can do for you, check out the [pyenv website][pyenv] or try `pyenv --help`. To get help on a specific command in pyenv type `pyenv <command> --help`.

If you liked this guide, you might find these others in our 'Python Like A Pro' series useful:

- [Install Python Like A Pro!][gs-pyenv]
- [Managing Python Global Packages Like A Pro][gs-pipx]
- [Build Python Docker Containers Like A Pro!][gs-cnb]
- [Run Python In Production Like A Pro!][gs-cf]

Here’s the video to accompany this guide:

{{< youtube 7Id2EU0zjw8>}}

--- 
[install]: /guides/python/gs-python-like-a-pro
[pyenv]: https://github.com/pyenv/pyenv
[pbpg]: /guides/python/cnb-gs-python
[docs]: https://packaging.python.org/tutorials/installing-packages/
[peve]: https://github.com/pyenv/pyenv-virtualenv
[pip]: https://pip.pypa.io/en/stable/
[gunicorn]: https://gunicorn.org/
[flask]: https://palletsprojects.com/p/flask/

[gs-pyenv]: /guides/python/gs-python-like-a-pro
[gs-pyenv-venv]: /guides/python/gs-managing-python-packages
[gs-pipx]: /guides/python/gs-python-installing-global-packages
[gs-cnb]: /guides/python/cnb-gs-python
[gs-cf]: /guides/python/cf-gs