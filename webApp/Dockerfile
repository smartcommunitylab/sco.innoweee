FROM node:10-alpine as build
COPY . /tmp
RUN apk add --no-cache git python build-base
WORKDIR /tmp

ARG apiEndpoint=https://innoweee.platform.smartcommunitylab.it/innoweee-engine/
ARG aacClientId=2be89b9c-4050-4e7e-9042-c02b0d9121c6
ARG redirectUrl=https://innoweee.platform.smartcommunitylab.it/callback
ARG aacUrl=https://am-dev.smartcommunitylab.it/aac/

RUN npm install -g cordova ionic
RUN npm install && ionic cordova platform add browser
RUN npm run config -- --environment=prod && ionic cordova build browser --prod

FROM nginx:alpine
ARG USER=innoweee
ARG USER_ID=3011
ARG USER_GROUP=innoweee
ARG USER_GROUP_ID=3011
ARG USER_HOME=/home/${USER}
# create a user group and a user
RUN  addgroup -g ${USER_GROUP_ID} ${USER_GROUP}; \
     adduser -u ${USER_ID} -D -g '' -h ${USER_HOME} -G ${USER_GROUP} ${USER} ;

COPY --chown=innoweee:innoweee --from=build /tmp/www /usr/share/nginx/html
WORKDIR ${USER_HOME}
