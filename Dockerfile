#FROM node:20.9.0-alpine AS frontend
#WORKDIR /app
#ENV PATH /app/node_modules/.bin:$PATH
#
#COPY frontend/package.json frontend/package-lock.json ./
#RUN npm ci --silent
#RUN npm install react-scripts@3.4.1 -g --silent
#COPY frontend ./
#RUN npm run build

FROM gradle:8.8.0-jdk21-alpine AS backend

COPY --chown=gradle:gradle /backend/ /backend/home/gradle/src
#COPY --from=frontend /app/build/* /backend/home/gradle/src/main/resources/static/

WORKDIR /backend/home/gradle/src

RUN gradle clean build --no-daemon -x test

FROM eclipse-temurin:21-jre-alpine

EXPOSE 8080

RUN mkdir /app

COPY --from=backend backend/home/gradle/src/build/libs/DivekitDashboard-0.0.1-SNAPSHOT.jar /app/divekit.jar

ENTRYPOINT ["java", "-jar", "/app/divekit.jar"]

