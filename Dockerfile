FROM alpine:3.17.2

ENV HUGO_VERSION=0.107.0

COPY . /tdc/

RUN apk update \
    && apk add docker docker-cli-compose
    # && apk add nodejs npm docker docker-compose-cli \
    # && rc-update add docker boot \
    # && wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb

EXPOSE 1313 8888
