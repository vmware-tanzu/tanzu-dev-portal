FROM ruby:3.1.2-alpine3.16

# RUN apk add --update \
#   build-base \
#   libxml2-dev \
#   libxslt-dev \
#   ruby-dev \
#   gcc \
#   make \
#   libc-dev

LABEL "name"="Process bio page template files"
LABEL "maintainer"="Brian McClain"
LABEL "version"="0.0.1"

LABEL "com.github.actions.name"="Process bio page template files"
LABEL "com.github.actions.description"="Process bio page template files"
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="green"

COPY entrypoint.sh /entrypoint.sh

CMD ["/entrypoint.sh"]