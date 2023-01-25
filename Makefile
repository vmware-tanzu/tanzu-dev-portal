.DEFAULT_GOAL := help
.PHONY: help clean-submodule git-submodule npm hugo-version-check preview preview-ip build test clean spell netlify-dev netlify-deploy
get-file-name = $(word $2,$(subst ., ,$1))
hugo_prod := 0.107.0
hugo_local := $(shell hugo version | awk -F v '{print substr($$2,1,7)}')
# Conditionally sets build variables for rules
CONTEXT ?= dev
ifeq "$(CONTEXT)" "production"
deploy_url := https://tanzu.vmware.com/developer
config_url := $(URL)
else
ifeq "$(CONTEXT)" "deploy-preview"
deploy_url := $(DEPLOY_PRIME_URL)/developer
config_url := $(DEPLOY_PRIME_URL)
else
deploy_url := http://localhost:1313/developer
config_url := http://localhost:8888
endif
endif

#help: @ List available tasks on this project
help:
	@echo $$(for i in {1..100}; do printf -; done); echo Available Rules:
	@grep -E '[a-zA-Z\.\-]+:.*?@ .*$$' $(MAKEFILE_LIST) | tr -d '#' | sort | \
	awk 'BEGIN {FS = ":.*?@ "}; \
	{printf "\t\033[32m%-30s\033[0m %s\n", $$1, $$2}'
	@echo $$(for i in {1..100}; do printf -; done);

#clean-submodule: @ Deletes submodule files for fresh initialization
clean-submodule:
	@echo "Removing modules"
	@rm -rf .git/modules
	@rm -rf themes/docsy
	@mkdir themes/docsy

#git-submodule: @ Initializes and recursively updates git submodules
git-submodule:
	git submodule update -f --init --recursive

#npm: @ Runs npm ci for clean install of dependencies from package-lock.json
npm: git-submodule
	npm ci

#hugo-version-check: @ Checks system version of hugo 
hugo-version-check:
ifeq ($(hugo_local),$(hugo_prod))
	@echo hugo $(hugo_local) validated
else
	@echo $@ failure: Your hugo version \($(hugo_local)\) does not match production \($(hugo_prod)\) 
	@echo run \'brew upgrade hugo\' or download and install the extended version from the releases page (https://github.com/gohugoio/hugo/releases/tag/v0.107.0).
	@exit 1
endif

#preview: @ Preview a local site
preview: hugo-version-check npm
	ulimit -n 65535; hugo server -b ${local_url}

#preview-ip: @ Preview a local site using an IP
preview-ip: npm
	ulimit -n 65535; hugo server --panicOnWarning --bind 0.0.0.0 -b http://${MYIP}:1313/developer

#build: @ Build site into `public` directory
build: hugo-version-check npm
	hugo -b ${deploy_url}

#test: @ Runs act to simulate a github pull request test suite
test: npm
	act pull_request

#clean: @ Clean hugo build files and docker files
clean:
	rm -rf public
	docker rmi -f act-github-actions-topic-check-dockeraction act-github-actions-link-check-dockeraction act-github-actions-spell-check-dockeraction catthehacker/ubuntu:act-latest
	
#spell: @ Runs act to perform spellcheck
spell: npm
	act -j spell-check

#netlify-dev: @ (Netlify Use Only) Command used for Netlify dev local builds
netlify-dev: config.js
	@echo Netlify Dev building with ${CONTEXT} context
	hugo server -w -b ${deploy_url}

#netlify-deploy: @ (Netlify Use Only) Command used for Netlify deployments
netlify-deploy: git-submodule npm config.js
	hugo -F -b ${deploy_url}
	cp public/developer/_redirects public/redirects

#config.js: @ Creates the config.js file for Netlify functions during build time
config.js: npm
	@awk -v a="${CONTEXT}" '{gsub(/CONTEXT_PLACEHOLDER/,a)}1' netlify/functions/util/config.js.ph | \
	awk -v a="${config_url}" '{gsub(/SITE_URL_PLACEHOLDER/,a)}1' > netlify/functions/util/config.js


#guide.wi: @ Creates a what-is guide. example: make guide.wi.spring.spring-boot-what-is
guide.wi.%:
	hugo new guides/$(call get-file-name,$*,1)/$(call get-file-name,$*,2).md -k guide-what-is

#guide.gs: @ Creates a getting started guide. example: make guide.gs.spring.spring-boot-gs
guide.gs.%:
	hugo new guides/$(call get-file-name,$*,1)/$(call get-file-name,$*,2).md -k guide-gs

#blog: @ Creates a blog post. example: make blog.writing-makefiles
blog.%:
	hugo new blog/$(call get-file-name,$*,1).md -k blog-post

#sample: @ Creates a sample. example: make sample.example-makefile
sample.%:
	hugo new samples/$(call get-file-name,$*,1).md -k sample

#video: @ Creates a video. example: make video.demo-writing-makefiles
video.%:
	hugo new videos/$(call get-file-name,$*,1).md -k video

#practice: @ Creates a new agile practice. example: make practice.makefile-workshop
practice.%:
	hugo new practices/$(call get-file-name,$*,1)/index.md -k practices

#team: @ Creates a new team page. example: make team.firstname-lastname
team.%:
	@hugo new team/$(call get-file-name,$*,1)/_index.md -k team-member
	@mkdir content/team/$(call get-file-name,$*,1)/images

#audit: @ Runs a content audit on all guides and blogs. example: make audit
audit:
	cd .github/actions/audit/src && bundle install
	mkdir audit
	ruby .github/actions/audit/src/audit.rb -s . -o audit/audit.csv -t audit/tags.csv --topics audit/topics.csv --errors audit/errors.csv
