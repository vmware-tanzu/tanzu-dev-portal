FROM node:16-alpine3.17

ENV HUGO_VERSION=0.107.0
ENV ACT_VERSION=0.2.43
ENV DEPLOY_URL=http://localhost:1313/developer

# Dependencies and tools
RUN apk update \
    && apk add bash bash-completion make git docker docker-compose libc6-compat dpkg
# Hugo install
RUN wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
    && dpkg -i --force-architecture hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
    && rm -f hugo_extended_${HUGO_VERSION}_linux-amd64.deb
# Act install
RUN wget https://github.com/nektos/act/releases/download/v${ACT_VERSION}/act_Linux_x86_64.tar.gz \
    && gzip -d act_Linux_x86_64.tar.gz \
    && tar --exclude="LICENSE" --exclude="README.md" -xf act_Linux_x86_64.tar \
    && rm -rf act_Linux_x86_64.tar \
    && mv act /usr/local/bin \
    && touch ~/.actrc \
    && echo "-P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest" >> ~/.actrc \
    && echo "-P ubuntu-20.04=ghcr.io/catthehacker/ubuntu:act-20.04" >> ~/.actrc \
    && echo "-P ubuntu-18.04=ghcr.io/catthehacker/ubuntu:act-18.04" >> ~/.actrc
# Bash autocompletion setup
WORKDIR "/etc/profile.d"
RUN touch bash_completion.sh \
    && echo "if [ /usr/share/bash-completion/bash-completion ]; then . /usr/share/bash-completion/bash_completion; fi" > bash_completion.sh

# Set primary working dir to mounted folder
WORKDIR "/tdc"

EXPOSE 1313 8888


CMD [ "/bin/bash" ]