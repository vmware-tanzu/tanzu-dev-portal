FROM node:16-alpine3.17

ENV HUGO_VERSION=0.107.0
ENV ACT_VERSION=0.2.20

WORKDIR "/tdc"

VOLUME [ "$PWD:/tdc" ]

# Dependencies and tools
RUN apk update \
    && apk add make git docker docker-compose libc6-compat dpkg
# Hugo install
RUN wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
    && dpkg -i --force-architecture hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
    && rm -f hugo_extended_${HUGO_VERSION}act_Linux_x86_64.deb
# Act install
RUN wget https://github.com/nektos/act/releases/download/v${ACT_VERSION}/act_Linux_x86_64.tar.gz \
    && gzip -d act_Linux_x86_64.tar.gz \
    && tar x -f act_Linux_x86_64.tar \
    && rm -rf act_Linux_x86_64.tar \
    && mv act /usr/local/bin

EXPOSE 1313 8888


CMD [ "/bin/sh" ]