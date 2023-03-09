GET_FILE_NAME= $(word $2,$(subst ., ,$1))
HUGO_PROD := 0.107.0
HUGO_LOCAL := $(shell hugo version | awk -F v '{print substr($$2,1,7)}')
CONTEXT ?= dev
ifeq "$(CONTEXT)" "production"
DEPLOY_URL := https://tanzu.vmware.com/developer
CONFIG_URL := $(URL)
else
ifeq "$(CONTEXT)" "deploy-preview"
DEPLOY_URL := $(DEPLOY_PRIME_URL)/developer
CONFIG_URL := $(DEPLOY_PRIME_URL)
else
DEPLOY_URL := http://localhost:1313/developer
CONFIG_URL := http://localhost:8888
endif
endif
DEV_CONTAINER_NAME := "tdc-dev"
DEV_CONTAINER_TAGS := "tdc:dev"
DEV_CONTAINER_DIR := $$(pwd)

.PHONY: help
#help: @ List available tasks on this project
help:
	@echo $$(for i in {1..100}; do printf -; done); echo Available Rules:
	@grep -E '[a-zA-Z\.\-]+:.*?@ .*$$' $(MAKEFILE_LIST) | tr -d '#' | sort | \
	awk 'BEGIN {FS = ":.*?@ "}; \
	{printf "\t\033[32m%-30s\033[0m %s\n", $$1, $$2}'
	@echo $$(for i in {1..100}; do printf -; done);

.PHONY: clean-submodule
#clean-submodule: @ Deletes submodule files for fresh initialization
clean-submodule:
	@echo "Removing modules"
	@rm -rf .git/modules
	@rm -rf themes/docsy
	@mkdir themes/docsy

.PHONY: git-submodule
#git-submodule: @ Initializes and recursively updates git submodules
git-submodule:
	@echo Initializing/Updating git submodules...
	@git submodule update -f --init --recursive

.PHONY: npm
#npm: @ Runs npm ci for clean install of dependencies from package-lock.json
npm: git-submodule
	@echo Installing git dependencies...
	@npm ci

.PHONY: hugo-version-check
#hugo-version-check: @ Checks system version of hugo 
hugo-version-check:
ifeq ($(HUGO_LOCAL),$(HUGO_PROD))
	@echo hugo $(HUGO_LOCAL) validated
else
	@echo $@ failure: Your hugo version \($(HUGO_LOCAL)\) does not match production \($(HUGO_PROD)\) 
	@echo run \'brew upgrade hugo\' or download and install the extended version from the releases page (https://github.com/gohugoio/hugo/releases/tag/v0.107.0).
	@exit 1
endif

.PHONY: preview
#preview: @ Preview a local site
preview: hugo-version-check npm
	ulimit -n 65535; hugo server -b ${DEPLOY_URL}

.PHONY: preview-ip
#preview-ip: @ Preview a local site using an IP
preview-ip: npm
	ulimit -n 65535; hugo server --panicOnWarning --bind 0.0.0.0 -b http://${MYIP}:1313/developer

.PHONY: build
#build: @ Build site into `public` directory
build: hugo-version-check npm
	hugo -b ${DEPLOY_URL}

.PHONY: test
#test: @ Runs act to simulate a github pull request test suite
test: npm
	act pull_request

.PHONY: clean
#clean: @ Clean hugo build files and docker files
clean:
	rm -rf public
	docker rmi -f act-github-actions-topic-check-dockeraction act-github-actions-link-check-dockeraction act-github-actions-spell-check-dockeraction catthehacker/ubuntu:act-latest
	
.PHONY: spell
#spell: @ Runs act to perform spellcheck
spell: npm
	act -j spell-check

.PHONY: netlify-dev
#netlify-dev: @ (Netlify Use Only) Command used for Netlify dev local builds
netlify-dev: config.js
	@echo Netlify Dev building with ${CONTEXT} context
	hugo server -w -b ${DEPLOY_URL}

.PHONY: netlify-deploy
#netlify-deploy: @ (Netlify Use Only) Command used for Netlify deployments
netlify-deploy: git-submodule npm config.js
	hugo -F -b ${DEPLOY_URL}
	cp public/developer/_redirects public/redirects

.PHONY: dev-container
#dev-container: @ Builds the docker image and container 
dev-container:
	@echo Building Docker $(DEV_CONTAINER_TAGS) image...
	@docker build -t ${DEV_CONTAINER_TAGS} .
	@echo Creating Docker $(DEV_CONTAINER_NAME) container...
	@docker create --name $(DEV_CONTAINER_NAME) -v "$(DEV_CONTAINER_DIR)":/tdc -v /var/run/docker.sock:/var/run/docker.sock -p 1313:1313 -p 8888:8888 $(DEV_CONTAINER_TAGS)
	@docker run -v "$(DEV_CONTAINER_DIR)":/tdc --rm $(DEV_CONTAINER_TAGS) make npm

.PHONY: dev-container.start
#dev-container.start: @ Starts the dev container
dev-container.start:
	@docker start $(DEV_CONTAINER_NAME) > /dev/null
	@echo "$(DEV_CONTAINER_NAME) container started in docker. The site preview will be available at $(DEPLOY_URL) after hugo finishes the build."

.PHONY: dev-container.stop
#dev-container.stop: @ Stops the dev container
dev-container.stop:
	@docker stop $(DEV_CONTAINER_NAME) > /dev/null
	@echo "$(DEV_CONTAINER_NAME) container stopped."

.PHONY: dev-container.shell
#dev-container.shell: @ Connect to the dev container to run commands
dev-container.shell: dev-container.start
	@docker exec -it $(DEV_CONTAINER_NAME) /bin/bash

.PHONY: dev-container.clean
#dev-container.clean: @ Removes dev container and image
dev-container.clean:
	@docker rm $(DEV_CONTAINER_NAME)
	@docker rmi $(DEV_CONTAINER_TAGS)

#config.js: @ Creates the config.js file for Netlify functions during build time
config.js: npm
	@awk -v a="${CONTEXT}" '{gsub(/CONTEXT_PLACEHOLDER/,a)}1' netlify/functions/util/config.js.ph | \
	awk -v a="${CONFIG_URL}" '{gsub(/SITE_URL_PLACEHOLDER/,a)}1' > netlify/functions/util/config.js

#guide.wi: @ Creates a what-is guide. example: make guide.wi.spring.spring-boot-what-is
guide.wi.%:
	hugo new guides/$(call GET_FILE_NAME,$*,1)/$(call GET_FILE_NAME,$*,2).md -k guide-what-is

#guide.gs: @ Creates a getting started guide. example: make guide.gs.spring.spring-boot-gs
guide.gs.%:
	hugo new guides/$(call GET_FILE_NAME,$*,1)/$(call GET_FILE_NAME,$*,2).md -k guide-gs

#blog: @ Creates a blog post. example: make blog.writing-makefiles
blog.%:
	hugo new blog/$(call GET_FILE_NAME,$*,1).md -k blog-post

#sample: @ Creates a sample. example: make sample.example-makefile
sample.%:
	hugo new samples/$(call GET_FILE_NAME,$*,1).md -k sample

#video: @ Creates a video. example: make video.demo-writing-makefiles
video.%:
	hugo new videos/$(call GET_FILE_NAME,$*,1).md -k video

#practice: @ Creates a new agile practice. example: make practice.makefile-workshop
practice.%:
	hugo new practices/$(call GET_FILE_NAME,$*,1)/index.md -k practices

#team: @ Creates a new team page. example: make team.firstname-lastname
team.%:
	@hugo new team/$(call GET_FILE_NAME,$*,1)/_index.md -k team-member
	@mkdir content/team/$(call GET_FILE_NAME,$*,1)/images

#audit: @ Runs a content audit on all guides and blogs. example: make audit
audit:
	cd .github/actions/audit/src && bundle install
	mkdir audit
	ruby .github/actions/audit/src/audit.rb -s . -o audit/audit.csv -t audit/tags.csv --topics audit/topics.csv --errors audit/errors.csv
