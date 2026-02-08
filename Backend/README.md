# 🔧 Ocean Paradise Backend

The backend service for Ocean Paradise Hotel Management System, built with Go using hexagonal architecture principles.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [WebSocket Events](#websocket-events)
- [Environment Variables](#environment-variables)

## 🏗️ Architecture

This backend follows **Hexagonal Architecture** (Ports and Adapters pattern) with clear separation of concerns:

```
┌─────────────────────────────────────────────────┐
│              Delivery Layer                      │
│  (REST Handlers, WebSocket, Middleware)         │
└─────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│           Application Layer                      │
│        (Service, Business Logic)                 │
└─────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│             Domain Layer                         │
│           (Entities, Ports)                      │
└─────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│         Infrastructure Layer                     │
│     (Repository, Database, External APIs)        │
└─────────────────────────────────────────────────┘
```

### Layers

- **Domain Layer**: Core business entities and interfaces (ports)
- **Application Layer**: Business logic implementation (services)
- **Infrastructure Layer**: Data persistence (repositories, database)
- **Delivery Layer**: HTTP handlers, middleware, WebSocket

## 🛠️ Tech Stack

- **Language**: Go 1.22
- **Router**: Custom REST server with gorilla patterns
- **Database**: PostgreSQL with sqlx
- **Migrations**: rubenv/sql-migrate
- **WebSocket**: gorilla/websocket
- **Authentication**: JWT tokens
- **Configuration**: godotenv

## 📁 Project Structure

```
Backend/
├── cmd/                        # Application commands
│   └── serve.go               # Server startup command
│
├── config/                     # Configuration management
│   └── config.go              # Environment configuration
│
├── domain/                     # Domain entities
│   ├── guest.go               # Guest entity
│   ├── room.go                # Room entity
│   ├── housekeeping.go        # Housekeeping entity
│   ├── laundry.go             # Laundry entity
│   ├── restaurant.go          # Restaurant entity
│   ├── staff.go               # Staff entity
│   └── invoice.go             # Invoice entity
│
├── [feature]/                  # Feature modules (hexagonal pattern)
│   ├── port.go                # Interface definitions (ports)
│   └── service.go             # Business logic implementation
│
├── repository/                 # Data access layer
│   ├── guest.go               # Guest repository
│   ├── room.go                # Room repository
│   ├── housekeeping.go        # Housekeeping repository
│   ├── laundry.go             # Laundry repository
│   ├── restaurant.go          # Restaurant repository
│   ├── staff.go               # Staff repository
│   └── invoice.go             # Invoice repository
│
├── rest/                       # HTTP delivery layer
│   ├── server.go              # HTTP server setup
│   ├── handlers/              # Request handlers
│   │   ├── guest/            # Guest endpoints
│   │   ├── room/             # Room endpoints
│   │   ├── housekeeping/     # Housekeeping endpoints
│   │   ├── laundry/          # Laundry endpoints
│   │   ├── restaurant/       # Restaurant endpoints
│   │   ├── staff/            # Staff endpoints
│   │   └── invoice/          # Invoice endpoints
│   └── middlewares/           # HTTP middlewares
│       ├── cors.go           # CORS configuration
│       ├── authenticate_jwt.go # JWT authentication
│       └── middleware.go     # Middleware manager
│
├── ws/                         # WebSocket layer
│   ├── hub.go                 # WebSocket hub/broker
│   └── client.go              # WebSocket client
│
├── infra/                      # Infrastructure layer
│   └── db/                    # Database infrastructure
│       ├── connection.go     # Database connection
│       └── migrate.go        # Migration runner
│
├── migrations/                 # SQL migrations
│   ├── 001_create_rooms.sql
│   ├── 002_create_guests.sql
│   ├── 003_add_guest_dates.sql
│   ├── 003_laundry.sql
│   ├── 004_create_laundry_request_items.sql
│   ├── 005_create_staff.sql
│   ├── 006_restaurant.sql
│   ├── 007_soft_delete_menu_items.sql
│   ├── 008_house_keeping.sql
│   ├── 009_seed_more_rooms.sql
│   └── 010_invoice.sql
│
├── util/                       # Utility functions
│   ├── create_jwt.go          # JWT creation
│   ├── jwt_parser.go          # JWT parsing
│   └── send_data.go           # Response helpers
│
├── go.mod                      # Go module definition
└── main.go                     # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Go 1.22 or higher
- PostgreSQL 14+
- Make (optional)

### Installation

1. **Install dependencies**
   ```bash
   go mod download
   ```

2. **Set up environment variables**
   
   Create a `.env` file:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=ocean_paradise
   DB_SSLMODE=disable

   # Server Configuration
   PORT=8080
   HOST=localhost

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRY_HOURS=24

   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

   # Environment
   ENV=development
   ```

3. **Create database**
   ```bash
   createdb ocean_paradise
   ```

4. **Run migrations**
   ```bash
   go run main.go migrate
   # or
   go run . migrate
   ```

5. **Start the server**
   ```bash
   go run main.go
   # or
   go run .
   ```

   Server will start on `http://localhost:8080`

### Development

```bash
# Run with auto-reload (using air or similar)
air

# Run tests
go test ./...

# Build binary
go build -o bin/ocean-paradise

# Run binary
./bin/ocean-paradise
```

## 🗄️ Database Schema

### Main Tables

- **rooms** - Hotel room information
  - id, room_number, room_type, price, status, floor, capacity
  
- **guests** - Guest information and authentication
  - id, name, email, password_hash, phone, check_in_date, check_out_date
  
- **staff** - Staff members and roles
  - id, name, email, password_hash, role, phone, hired_date
  
- **laundry_requests** - Laundry service requests
  - id, guest_id, status, request_date, completion_date
  
- **laundry_request_items** - Individual laundry items
  - id, request_id, item_type, quantity, price
  
- **menu_items** - Restaurant menu
  - id, name, description, price, category, available, deleted_at
  
- **housekeeping_tasks** - Cleaning and maintenance tasks
  - id, room_id, staff_id, task_type, status, priority, assigned_date
  
- **invoices** - Guest billing
  - id, guest_id, room_charge, laundry_charge, restaurant_charge, total, status, created_at

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/guest/login        # Guest login
POST   /api/auth/staff/login        # Staff login
POST   /api/auth/register           # Guest registration
GET    /api/auth/validate           # Validate JWT token
```

### Guest Management

```
GET    /api/guests/:id              # Get guest details
PUT    /api/guests/:id              # Update guest profile
GET    /api/guests/:id/bookings     # Get guest bookings
POST   /api/guests/checkout         # Guest checkout
```

### Room Management

```
GET    /api/rooms                   # List all rooms
GET    /api/rooms/available         # Get available rooms
GET    /api/rooms/:id               # Get room details
POST   /api/rooms/book              # Book a room
PUT    /api/rooms/:id/status        # Update room status (staff)
```

### Housekeeping

```
GET    /api/housekeeping/tasks      # Get housekeeping tasks
GET    /api/housekeeping/status     # Get real-time status
POST   /api/housekeeping/tasks      # Create task (staff)
PUT    /api/housekeeping/tasks/:id  # Update task
POST   /api/housekeeping/report     # Report issue
PUT    /api/housekeeping/clean/:id  # Mark room as clean
```

### Laundry Services

```
GET    /api/laundry/requests        # Get laundry requests
POST   /api/laundry/requests        # Create request
GET    /api/laundry/requests/:id    # Get request details
PUT    /api/laundry/requests/:id    # Update request status
```

### Restaurant

```
GET    /api/restaurant/menu         # Get menu items
POST   /api/restaurant/orders       # Place order
GET    /api/restaurant/orders/:id   # Get order details
POST   /api/restaurant/menu         # Add menu item (staff)
PUT    /api/restaurant/menu/:id     # Update menu item (staff)
DELETE /api/restaurant/menu/:id     # Soft delete menu item (staff)
```

### Staff Management

```
GET    /api/staff                   # List staff members
GET    /api/staff/:id               # Get staff details
POST   /api/staff                   # Add staff member (admin)
PUT    /api/staff/:id               # Update staff info (admin)
```

### Invoices

```
GET    /api/invoices/:guest_id      # Get guest invoices
POST   /api/invoices/generate       # Generate invoice
GET    /api/invoices/:id            # Get invoice details
PUT    /api/invoices/:id/pay        # Mark invoice as paid
```

## 🔄 WebSocket Events

Connect to WebSocket at: `ws://localhost:8080/ws`

### Client → Server Events

```json
{
  "type": "subscribe",
  "room_id": "101"
}

{
  "type": "status_update",
  "room_id": "101",
  "status": "cleaning"
}
```

### Server → Client Events

```json
{
  "type": "room_status_changed",
  "data": {
    "room_id": "101",
    "status": "clean",
    "timestamp": "2024-03-01T10:30:00Z"
  }
}

{
  "type": "new_task_assigned",
  "data": {
    "task_id": "123",
    "room_id": "101",
    "staff_id": "45"
  }
}
```

## 🔐 Authentication Flow

1. Client sends credentials to `/api/auth/login`
2. Server validates credentials
3. Server generates JWT token with user claims
4. Client stores token (localStorage/memory)
5. Client includes token in `Authorization: Bearer <token>` header
6. Middleware validates token and extracts user info
7. Handler receives authenticated user context

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `DB_NAME` | Database name | ocean_paradise |
| `DB_SSLMODE` | SSL mode | disable |
| `PORT` | Server port | 8080 |
| `JWT_SECRET` | JWT signing key | - |
| `JWT_EXPIRY_HOURS` | Token expiry | 24 |
| `ALLOWED_ORIGINS` | CORS origins | * |
| `ENV` | Environment | development |

## 📝 Code Style

- Follow Go conventions and idioms
- Use `gofmt` for formatting
- Interfaces (ports) define dependencies
- Services implement business logic
- Repositories handle data access
- Handlers are thin and delegate to services

## 🧪 Testing

```bash
# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run specific package tests
go test ./guest/...

# Run with verbose output
go test -v ./...
```

## 🚀 Deployment

### Building for Production

```bash
# Build binary
CGO_ENABLED=0 GOOS=linux go build -o ocean-paradise

# Run migrations in production
./ocean-paradise migrate

# Start server
./ocean-paradise
```

### Docker (Optional)

```dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o ocean-paradise

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/ocean-paradise .
COPY --from=builder /app/migrations ./migrations
EXPOSE 8080
CMD ["./ocean-paradise"]
```

## 📚 Additional Resources

- [Go Documentation](https://golang.org/doc/)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 🤝 Contributing

Please ensure your code:
- Follows Go conventions
- Includes appropriate tests
- Updates documentation
- Passes all existing tests

---

Built with ❤️ using Go
