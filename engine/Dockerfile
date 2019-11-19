# syntax=docker/dockerfile:experimental
FROM maven:3-jdk-11 AS mvn
WORKDIR /tmp
COPY . /tmp
RUN --mount=type=cache,target=/root/.m2  mvn clean install -Dmaven.test.skip=true


FROM adoptopenjdk/openjdk11:alpine
ENV FOLDER=/tmp/target
ARG VER=0.2
ENV APP=engine-${VER}.jar
ARG USER=innoweee
ARG USER_ID=3006
ARG USER_GROUP=innoweee
ARG USER_GROUP_ID=3006
ARG USER_HOME=/home/${USER}

RUN  addgroup -g ${USER_GROUP_ID} ${USER_GROUP}; \
     adduser -u ${USER_ID} -D -g '' -h ${USER_HOME} -G ${USER_GROUP} ${USER} ;

WORKDIR  /home/${USER}/app
RUN chown ${USER}:${USER_GROUP} /home/${USER}/app
RUN mkdir indexes && chown ${USER}:${USER_GROUP} indexes
RUN apk add --no-cache tzdata
COPY --from=mvn --chown=innoweee:innoweee ${FOLDER}/${APP} /home/${USER}/app/${APP}

USER innoweee
# CMD ["java", "-XX:MaxRAMFraction=2", "-jar", "${APP}"]
ENTRYPOINT java -XX:MaxRAMPercentage=50 -jar ${APP}
