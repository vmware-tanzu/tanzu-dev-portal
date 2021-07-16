FROM klakegg/hugo:0.82.0-ext-ubuntu

LABEL "com.github.actions.name"="Hugo broken link check with muffet"
LABEL "com.github.actions.description"="Hugo broken link check quickly with raviqqe/muffet"
LABEL "com.github.actions.icon"="link"
LABEL "com.github.actions.color"="green"

LABEL "repository"="https://github.com/peaceiris/actions-hugo-link-check"
LABEL "homepage"="https://github.com/peaceiris/actions-hugo-link-check"
LABEL "maintainer"="peaceiris"

RUN GO111MODULE=on go get -u github.com/raviqqe/muffet/v2
RUN apt-get install curl

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
