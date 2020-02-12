FROM node:10-alpine as build
COPY codeScanner/ /tmp/codeScanner
RUN apk add --no-cache git python
WORKDIR /tmp

RUN npm install -g @angular/cli@7.3.9 @ionic/cli cordova@8.1.2
RUN npm i -g cordova-res@0.9.0 cordova-hot-code-push-cli --unsafe-perm
WORKDIR /tmp/codeScanner/
RUN npm install
