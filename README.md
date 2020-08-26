# VMware Tanzu Developer Portal

## Building the Site

The VMware Tanzu Developer Portal uses [Hugo](https://gohugo.io/) to build the site from Markdown files. You'll need to [get Hugo](https://gohugo.io/getting-started/installing/) if you want to build and run the site locally.

### Run locally

To install the latest version of `hugo` you can use `brew install hugo` if you are on a Mac. However, this site currently requires a specific version (0.69.2) to build successfully. To install this version of `hugo`, use the following commands:

```
wget "https://github.com/gohugoio/hugo/releases/download/v0.69.2/hugo_extended_0.69.2_Linux-64bit.tar.gz"
tar -zxvf "hugo_extended_0.69.2_Linux-64bit.tar.gz" 
mv ./hugo /usr/local/bin/
```

Now you're ready to build locally:

```
git clone https://github.com/vmware-tanzu-private/tanzu-dev-portal
cd tanzu-dev-portal
git submodule update --init --recursive
hugo server
```

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

You may contribute content by creating a branch (or fork) and submitting a pull request. Content should be written in Markdown with metadata included in the front matter. Here are some guidelines to get you started:

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

### Images
All images are stored under `static/images`. Images should be placed in the directory that matches the content that they'll be displayed in (ie. a Spring guide would have images in `static/images/guides/spring`). Finally, an image placed in `diagrams` will have a border added around it for visibility. If the image is not a diagram, they should be placed in `screenshots`.

### Taxonomies
Hugo defines [Taxonomies](https://gohugo.io/content-management/taxonomies/) that may be used in the front matter of Markdown documents. This site uses the following taxonomies

#### Team
Use the `team` taxonomy to attribute one or more authors to a piece of content.

#### Topics
Topics should always be included in the `topics` section of the front matter, must be one of the following options and must appear exactly as follows:

- CI-CD
- Containers
- Event Streaming
- Kubernetes
- Messaging and Integration
- Microservices
- Python
- Reactive
- Serverless
- Spring

#### Patterns
Patterns may be added in a `patterns` section of the front matter and must refer to the title of an existing section within the `patterns` directory under `content`.

#### Tags
Tags may appear in a `tags` section of the front matter. Usually tags refer to a specific technology within a topic such as `Spring Boot` within `Spring`.

#### Featured Content
Content may be tagged as `featured: true` along with a `weight` in the front matter to appear in the Featured section on the home page. Only three will appear at once.

### Shortcodes

Hugo allows the use of [shortcodes](https://gohugo.io/content-management/shortcodes/) in Markdown files to render specific templates for content like YouTube videos and Tweets. Use them as follows to add to your content.

#### YouTube

```{{< youtube id="YOUR_VIDEO_ID" class="youtube-video-shortcode" >}}```

`YOUR_VIDEO_ID` should be replaced with the 11-character GUID from your video which appears after the `?v=` parameter in the URL. Please be sure to include the class as shown.

#### Twitter

```{{< tweet YOUR_TWEET_ID >}}```

`YOUR_TWEET_ID` should be replaced with the ID that appears after `/status/` in the tweet's URL.

### Markdown Tricks

- For an &ndash; (--) use two hyphens in a row 
- For an &mdash; (---) use three hyphens in a row 
