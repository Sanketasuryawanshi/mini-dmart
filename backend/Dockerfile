# Stage 1: Build the Spring Boot application using Maven and OpenJDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build JAR package (skipping tests for faster build)
RUN mvn clean package -DskipTests

# Stage 2: Run the packaged application on lightweight JRE
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy built jar from build stage
COPY --from=build /app/target/mini-dmart-backend-1.0.0.jar app.jar

# Expose default port
EXPOSE 8088

# Set environment variable defaults
ENV SERVER_PORT=8088
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Launch Spring Boot
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
