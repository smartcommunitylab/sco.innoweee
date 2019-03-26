FROM node:lts-alpine
COPY ./webApp /tmp
WORKDIR /tmp
RUN npm install -g cordova ionic && npm install && ionic cordova platform add browser
