FROM maven:3.8.7-openjdk-18 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

FROM amazoncorretto:17
WORKDIR /app
COPY --from=build /build/target/*.jar ./app.jar
COPY src/main/resources/application.yml ./config/

EXPOSE 8080

CMD ["java", "-jar", "app.jar", "--spring.config.location=classpath:/,file:./config/"]