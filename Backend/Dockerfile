# Stage 1: Build the Spring Boot application using Maven and Java 21
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy POM and resolve dependencies for efficient layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy application source code and package executable JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create lightweight production runtime container
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Render assigns port dynamically via $PORT environment variable (default: 8080)
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
