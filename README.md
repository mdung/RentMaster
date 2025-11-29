# RentMaster

**RentMaster** is an advanced, full-stack room rental management system that helps landlords and property managers manage properties, rooms, tenants, rental contracts, monthly invoices, and payments. Built with Spring Boot, PostgreSQL, Flyway, and React.

## Features

- **Property & Room Management**: Manage multiple properties and rooms with status tracking
- **Tenant Management**: Complete tenant profiles with contact information
- **Contract Management**: Create and manage rental contracts with automatic room status updates
- **Invoice Generation**: Automated monthly invoice generation with rent and utilities
- **Payment Tracking**: Record and track payments against invoices
- **Dashboard**: Real-time overview of occupancy, revenue, and outstanding amounts
- **Authentication**: JWT-based secure authentication system

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.3.0
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL
- Flyway (Database Migrations)
- Maven

### Frontend
- React 18
- TypeScript
- React Router
- Axios
- Vite

## Project Structure

```
RentMaster/
├── rentmaster-backend/     # Spring Boot backend
│   ├── src/main/java/com/rentmaster/
│   │   ├── auth/          # Authentication & JWT
│   │   ├── property/       # Properties & Rooms
│   │   ├── tenant/         # Tenant management
│   │   ├── contract/       # Contract management
│   │   ├── billing/        # Invoices & Payments
│   │   ├── report/         # Dashboard reports
│   │   └── config/         # Configuration
│   └── src/main/resources/
│       └── db/migration/   # Flyway migrations
└── rentmaster-frontend/    # React frontend
    ├── src/
    │   ├── pages/          # Page components
    │   ├── components/     # Reusable components
    │   ├── services/api/   # API clients
    │   ├── context/         # React context
    │   └── types/          # TypeScript types
```

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.6+
- PostgreSQL 12+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE rentmaster;
```

2. Update `rentmaster-backend/src/main/resources/application.yml` with your database credentials:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/rentmaster
    username: your_username
    password: your_password
```

3. Run the backend:
```bash
cd rentmaster-backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Install dependencies:
```bash
cd rentmaster-frontend
npm install
```

2. Create `.env` file (optional, defaults to localhost:8080):
```
VITE_API_BASE_URL=http://localhost:8080/api
```

3. Run the frontend:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login

### Properties
- `GET /api/properties` - List all properties
- `POST /api/properties` - Create property
- `PUT /api/properties/{id}` - Update property
- `DELETE /api/properties/{id}` - Delete property

### Rooms
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/property/{propertyId}` - Get rooms by property
- `POST /api/rooms` - Create room
- `PUT /api/rooms/{id}` - Update room
- `DELETE /api/rooms/{id}` - Delete room

### Tenants
- `GET /api/tenants` - List all tenants
- `POST /api/tenants` - Create tenant
- `PUT /api/tenants/{id}` - Update tenant
- `DELETE /api/tenants/{id}` - Delete tenant

### Contracts
- `GET /api/contracts` - List all contracts
- `POST /api/contracts` - Create contract
- `PUT /api/contracts/{id}` - Update contract
- `DELETE /api/contracts/{id}` - Delete contract

### Invoices
- `GET /api/invoices` - List all invoices
- `POST /api/invoices/generate` - Generate invoice
- `GET /api/invoices/{id}` - Get invoice details

### Payments
- `GET /api/payments` - List all payments
- `POST /api/payments` - Create payment
- `DELETE /api/payments/{id}` - Delete payment

### Reports
- `GET /api/reports/dashboard` - Get dashboard statistics

## Database Schema

The application uses Flyway for database migrations. The schema is automatically created on first run via:
- `V1__init_schema.sql` - Creates all tables
- `V2__seed_data.sql` - Seeds default admin user and services

## Development

### Backend
```bash
cd rentmaster-backend
mvn clean install
mvn spring-boot:run
```

### Frontend
```bash
cd rentmaster-frontend
npm install
npm run dev
```

## Building for Production

### Backend
```bash
cd rentmaster-backend
mvn clean package
java -jar target/rentmaster-backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd rentmaster-frontend
npm run build
# Output in dist/ directory
```

## License

This project is private and proprietary.

## Author

RentMaster Development Team

