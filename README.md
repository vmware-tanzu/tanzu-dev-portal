## Tanzu Dev Portal

### Hugo
[Get Hugo](https://gohugo.io/getting-started/installing/)

#### Run locally

```
brew install hugo
cd themes
git clone https://github.com/google/docsy
git submodule update --init --recursive
cd ..
hugo server
```

You may have to `brew upgrade` if you get this error: "parse failed: template: partials/head.html:3: function "hugo" not defined"

### Publish to PWS

```
npm install
sudo npm install -D --save autoprefixer
sudo npm install -D --save postcss-cli
hugo
cf push
```

You may need to upgrade to latest version of npm.

### Create a new guide section
hugo new guides/spring/spring-boot -k guide

You can rename the markdown files by adding a prefix to the filenames.

### Create a new blog post
hugo new blog/my-post -k blog-post.md