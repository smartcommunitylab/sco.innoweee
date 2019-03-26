FROM node:lts-alpine
RUN npm install -g cordova ionic
USER node
COPY --chown=node:node ./webApp /tmp
WORKDIR /tmp
RUN npm install && ionic cordova platform add browser
