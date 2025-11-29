# RentMaster Backend

Spring Boot backend for RentMaster rental management system.

## Configuration

Update `src/main/resources/application.yml` with your PostgreSQL database credentials.

## Running

```bash
mvn spring-boot:run
```

## Default Admin

- Username: `admin`
- Password: `admin123`

## API Documentation

All endpoints require JWT authentication except `/api/auth/login`.

Base URL: `http://localhost:8080/api`

