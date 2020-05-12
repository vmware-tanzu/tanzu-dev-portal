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

You may wish to explicitly set `baseURL` to http://localhost:1313/developer in order to mimic what happens in production at https://tanzu.vmware.com/developer. Use the following command to do this:

`hugo server -b http://localhost:1313/developer`

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

### Taxonomies

#### Topics

#### Patterns

#### Tags

#### Authors

#### Featured Content
Content may be tagged as `featured: true` along with a `weight` in the front matter to appear in the Featured section on the home page.

### Hugo Archetypes
You can use the [Archetypes](https://gohugo.io/content-management/archetypes/) feature of Hugo to create new content as follows:

#### Create a new Guide
Use one of the following commands to create either a "What Is...?" or "Getting Started" guide. Guides should be written in second person (the "you" voice).

`hugo new guides/spring/spring-boot-what-is.md -k guide-what-is`
`hugo new guides/spring/spring-boot-gs.md -k guide-gs`

#### Create a new blog post
The following command will create a blog post. Blog posts require a title, date, and author (see more about authors in the Taxonomy section above). If you use a future date for publishing, you will need to use the `-F` flag to see the post when running `hugo` or `hugo server` to build the site on your local machine.

`hugo new blog/my-post.md -k blog-post`

#### Create a new Code Sample
The following command will create a code sample. Along with a title, description, and other taxonomy metadata in the front matter, code sample pages require the full URL to a public GitHub repository in the `repo` parameter and a boolean value for `readme` that will determine whether to fetch (at build-time) and render the README content from that repo (`true`) or to render the content of the page itself instead (`false`).

`hugo new samples/my-sample.md -k sample`

#### Create a new Video
Your video should be uploaded to the VMwareTanzu YouTubechannel first. For help with this reach out in the #tanzu-dev-portal channel. Once on YouTube, run the following command and make sure to set `youtube_id` in the front matter to the string that appears after `/watch?v=` in the video's URL, along with a title, description, and other taxonomy metadata.

`hugo new videos/my-video.md -k video`

### Netlify CMS
If you're not familiar with writing Markdown or submitting pull requests, you may request access to Netlify CMS which provides a web-based interface for writing content. Please reach out in the #tanzu-dev-portal channel on Slack.
