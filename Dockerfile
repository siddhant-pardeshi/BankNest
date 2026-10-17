# ---- Build stage: compile the Spring Boot jar -----------------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY BankNest/ ./BankNest/
RUN chmod +x BankNest/mvnw && cd BankNest && ./mvnw -B clean package -DskipTests

# ---- Run stage: slim JRE ---------------------------------------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S banknest && adduser -S banknest -G banknest
USER banknest

COPY --from=build /app/BankNest/target/BankNest-1.0.0.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
