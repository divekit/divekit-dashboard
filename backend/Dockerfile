FROM gradle:7.4.0-jdk17-alpine AS BUILD

COPY --chown=gradle:gradle . /home/gradle/src

WORKDIR /home/gradle/src

RUN gradle clean build --no-daemon

FROM eclipse-temurin:17-jre-alpine

EXPOSE 8080

RUN mkdir /app

COPY --from=BUILD /home/gradle/src/build/libs/DivekitDashboard-0.0.1-SNAPSHOT.jar /app/divekit.jar

ENTRYPOINT ["java", "-jar", "/app/divekit.jar"]