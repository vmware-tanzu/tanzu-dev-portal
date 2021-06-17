# Tanzu Developer Center Contribution Guide


## Setting Up You Environment to Create Content

This process will walk you through setting up your local environment to start writing content for the Tanzu Developer Center. This will also walk you through creating a starter template for each content type. **NOTE**: This process assumes that you are comfortable with GitHub, pull requests, forking, and writing content in markdown. If you want a less technical process, go here.


### I need to set up my local environment with the necessary tools to create and test content

1. **Install hugo**. The VMware Tanzu Developer Center uses [Hugo](https://gohugo.io/) to build the site from Markdown files. You'll need to [get Hugo](https://gohugo.io/getting-started/installing/) if you want to build and run the site locally. Make sure you install the extended version with SCSS/SASS support built in. This site pins hugo to a specific version (currently 0.82.0) to build so if you're using a different version, your experience may vary.

2. **Install NPM**. Hugo uses NPM to manage its local packages. If you don’t already have it installed, you will need it to move further.

```bash
brew install npm
```

3. **Install act**. [act](https://github.com/nektos/act/releases/tag/v0.2.20) is used to run GitHub Actions tests locally. The Tanzu Developer Center uses GitHub Actions to perform automated testing periodically, and on each pull request. **NOTE**: Currently, the tests break on `act` > v0.2.20, be sure to install [v0.2.20](https://github.com/nektos/act/releases/tag/v0.2.20).)

4. Install Docker. Running automated test locally will require Docker to be running (On Mac OS X requires Docker Desktop 2.4 or newer)

```bash
brew install docker --cask
```

### I **AM NOT** on the Tanzu Developer Center team with admin rights to the GitHub repository, and I need to clone the repository locally

1. **Clone the repository directly from the VMware Tanzu account**. This is the primary difference if you have admin rights. Instead of forking the repository, you can simply clone the 

```bash
git clone --recurse-submodules https://github.com/$GH_USERNAME/tanzu-dev-portal.git
```

3. Create a working feature branch. This is the branch for which you will eventually submit your pull request.

```bash
git checkout -b $BRANCH_NAME
```

### I **AM** on the Tanzu Developer Center team with admin rights to the GitHub repository, and I need to clone the repository locally
1. **Fork the [Tanzu Developer Center](https://github.com/vmware-tanzu/tanzu-dev-portal)**. To submit new content to the Tanzu Developer Center, you first need to fork the repo so that later, you can submit a pull request. For more information about how to fork a GitHub repository, check [here](https://docs.github.com/en/github/getting-started-with-github/quickstart/fork-a-repo).

2. **Clone your fork of the repository**. This will pull down your fork of the Tanzu Developer Center locally. NOTE: Make sure you are in a good working directory. 

```bash
git clone --recurse-submodules https://github.com/$GH_USERNAME/tanzu-dev-portal.git
```

3. Create a working feature branch. This is the branch for which you will eventually submit your pull request.

```bash
git checkout -b $BRANCH_NAME
```


### I need to create a content starter template, and I'm not sure which one

1. **Decide on the type of content you want to create**. The following is a list of Hugo taxonomies currently used by the Tanzu Developer Center. In the description of each type are some high-level points about each one, and what type of content fits into each type. If you have questions about this, open a GitHub issue or ask the team on [Slack](https://vmware.slack.com/archives/C011DRHHDTL) (**VMware Employees only**)

    * **Create a new Guide**. Guides are typically prescriptive learning paths. They often include a series of steps to write a program or deploy a tool. There are a couple taxonomies for guides. Use one of the following commands to create either a "What Is...?" or a "Getting Started" guide. Templates will be placed in the `/content/guides/` directory. The following will create a What Is Guide, for example:

    ```bash
    make guide.wi.spring.spring-boot-what-is
    ```
    to create a Getting Started Guide:
    ```bash
    make guide.gs.spring.spring-boot-gs
    ```

   * **Create a new blog post**. Blog posts are typically informative, and timely. Product announcements, or “thought leadership” posts often fall into this category. Templates will be placed in the `/content/blogs` directory. The following command will create a blog post, for example. 

   ```bash
   make blog.my-post
   ```

   * **Create a new Code Sample**. Code samples are often used in conjunction with guides or blog posts, and are used to provide a static representation of code at the time it was written. Templates will be placed in the `/content/samples` directory. The following command will create a code sample, for example. 

   ```bash
   make sample.my-sample
   ```

   * **Create a new Video**. These are markdown formatted video templates to provide some context around your video hosted on the Tanzu Developer Center. Your video should be uploaded to the VMwareTanzu YouTube channel first. For help with this reach out in the [#tanzu-developer-center](https://vmware.slack.com/archives/C011DRHHDTL) channel (VMware employees only). Templates will be placed in the `/content/videos directory`. The following command will create a video template, for example.

   ```bash
   make video.my-video
   ```

   * **Create a new Agile Practice**. Practices are typically written by the Labs team, and are typically around the practices that Tanzu Labs facilitates. if you are interested in creating a Practices post, you should look at their contribution process [here](https://confluence.eng.vmware.com/display/VPL/Contributing+to+the+Tanzu+Practices), and engage with that team at [#tanzu-practices-site](https://vmware.slack.com/archives/CA5D97T6H). Once your draft is ready, you can come back to the review process in this guide, here. Templates will be placed in the `/content/practices` directory. The following command will create an Agile Practice, for example.

    ```bash
    make practice.a-new-practice
    ```

2. Open the template in your favorite markdown editor. I use Visual Studio Code, but any editor works. For example:
```bash
code content/guides/topic-name/guide-name.md
```

---

| Previous Step | Next Step |
| ------------- | --------- |
| **[Prewriting / Ideation](contributing/gh1-prewriting-ideation.md)** | **[Drafting Content](contributing/gh3-drafting-content.md)** |