# VMware Tanzu Developer Portal

## Building the Site

The VMware Tanzu Developer Portal uses [Hugo](https://gohugo.io/) to build the site from Markdown files. You'll need to [get Hugo](https://gohugo.io/getting-started/installing/) if you want to build and run the site locally.

### Run locally

```
brew install hugo
git clone https://github.com/vmware-tanzu-private/tanzu-dev-portal
cd tanzu-dev-portal
git submodule update --init --recursive
hugo server
```
_Note: You may have to `brew upgrade` if you get this error: "parse failed: template: partials/head.html:3: function "hugo" not defined"_

### Publish to PWS
Once you have the site successfully running locally, you may publish it to the staging site running on PWS as follows.

```
npm install
hugo
cf push
```
_Note: You may need to upgrade to latest version of npm._

Alternatively to PWS, PRs and commits are also automatically staged by Netlify.

## Contributing Content

If you are interested in contributing content and you're reading this, you probably already have access to do so. If you don't have access for some reason, please reach out in the #tanzu-dev-portal channel on Slack.

You may contribute content by creating a branch (or fork) and submitting a pull request. There a few options to help get you started:

### Hugo Archetypes
You can use the [Archetypes](https://gohugo.io/content-management/archetypes/) feature of Hugo to create new content as follows:

#### Create a new What Is guide 
`hugo new guides/spring/spring-boot-what-is -k guide-what-is.md`

#### Create a new Getting Started guide
`hugo new guides/spring/spring-boot-gs -k guide-gs.md`

#### Create a new blog post
`hugo new blog/my-post -k blog-post.md`

### Netlify CMS
If you're not familiar with writing Markdown or submitting pull requests, you may request access to Netlify CMS which provides a web-based interface for writing content. Please reach out in the #tanzu-dev-portal channel on Slack.
