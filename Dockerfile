FROM node:16-alpine3.17

ENV HUGO_VERSION=0.107.0
ENV ACT_VERSION=0.2.20
ENV DEPLOY_URL=http://localhost:1313/developer

WORKDIR "/tdc"

# Dependencies and tools
RUN apk update \
    && apk add bash make git docker docker-compose libc6-compat dpkg
# Hugo install
RUN wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
    && dpkg -i --force-architecture hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
    && rm -f hugo_extended_${HUGO_VERSION}_linux-amd64.deb
# Act install
RUN wget https://github.com/nektos/act/releases/download/v${ACT_VERSION}/act_Linux_x86_64.tar.gz \
    && gzip -d act_Linux_x86_64.tar.gz \
    && tar --exclude="LICENSE" --exclude="README.md" -xf act_Linux_x86_64.tar \
    && rm -rf act_Linux_x86_64.tar \
    && mv act /usr/local/bin


EXPOSE 1313 8888


CMD hugo server -b ${DEPLOY_URL} --bind 0.0.0.0