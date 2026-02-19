# Oasis — Distributed Hotel Operations System

A full-stack hotel management system built with **Go** and **React + TypeScript**, designed around **Hexagonal Architecture**, **Domain-Driven Design**, and **SOLID principles**. The codebase is intentionally structured to demonstrate clean software engineering practices: loose coupling, dependency injection, and clear separation of concerns across every layer.

---

## Architecture

The backend follows **Hexagonal Architecture (Ports & Adapters)**, keeping the domain core completely isolated from external concerns like HTTP, databases, or third-party APIs. Each layer depends only on abstractions — never on concrete implementations.

```
React + TypeScript (Frontend)
        |
        | HTTP / WebSocket
        v
REST Handlers  +  Middleware (JWT, CORS)
        |
        | calls via interface (Port)
        v
Service Layer — business logic, one bounded context per module
        |
        | depends on repository interface, not implementation
        v
Repository Layer — data access adapters
        |
        | sqlx
        v
PostgreSQL
```

---

## Design Principles

### Domain-Driven Design (DDD)

The backend is divided into **8 bounded contexts**, each owning its domain model, service, and repository. Domain entities live in `domain/` and are plain Go structs with no framework dependencies — they model the business, nothing else.

```
domain/
  guest.go          # Guest entity — check-in, check-out, profile
  room.go           # Room entity — status: vacant / occupied / cleaning
  invoice.go        # Invoice entity — aggregates charges across services
  housekeeping.go   # Housekeeping task entity
  laundry.go        # Laundry request + items
  restaurant.go     # Menu items and orders
  staff.go          # Staff profiles and roles
```

Naming reflects the business language directly — `CheckInDate`, `RoomStatus`, `InvoicePreview` — not database column names or HTTP fields.

### Hexagonal Architecture — Ports & Adapters

Each module exposes a **Port** (interface) and provides an **Adapter** (implementation). HTTP handlers and repositories both connect to the domain through these interfaces, making every component independently replaceable and testable.

```go
// port.go — defines what the module can do (the contract)
type Service interface {
    Create(room domain.Room) (*domain.Room, error)
    Find(roomNumber string) (*domain.Room, error)
    GetAll(status string) ([]domain.Room, error)
}

// service.go — implements the contract, depends on a repository interface
type service struct {
    rmRepo RoomRepo
}

func NewService(rmRepo RoomRepo) *service {
    return &service{rmRepo: rmRepo}
}
```

The HTTP handler depends on `room.Service` (the interface), not the concrete `service` struct. The repository is also behind an interface. Neither the handler nor the service ever imports a concrete type from the other layer.

### Dependency Injection

All dependencies are wired once at startup in `cmd/serve.go` using **constructor-based injection**. No service creates its own dependencies. No global state. The dependency graph is explicit and fully controlled.

```go
// cmd/serve.go — full DI composition root
db         := infra.NewConnection(cfg)
roomRepo   := repository.NewRoomRepo(db)
roomSvc    := room.NewService(roomRepo)
roomHandler := roomhandler.NewHandler(roomSvc)
```

This means every component can be tested in isolation by injecting a mock — the business logic is never coupled to a real database or HTTP layer.

### Loose Coupling

- Handlers depend on service **interfaces**, not implementations
- Services depend on repository **interfaces**, not concrete types
- Domain entities have zero dependencies on any external package
- No circular imports — the dependency flow is strictly one-directional

Swapping PostgreSQL for another database, or replacing the REST layer with gRPC, would require changes only at the adapter level — the domain and service logic remain untouched.

### SOLID Principles

| Principle | Application |
|-----------|-------------|
| **Single Responsibility** | Each service owns exactly one bounded context. Handlers translate HTTP, services apply business rules, repositories access data — each does one thing. |
| **Open / Closed** | New behaviour is added by implementing existing interfaces, not by modifying existing services. |
| **Liskov Substitution** | Any repository implementation can replace another without breaking the service that depends on it. |
| **Interface Segregation** | Each module defines a small, focused interface exposing only what its consumers actually need. |
| **Dependency Inversion** | High-level modules (services) depend on abstractions (interfaces). Low-level modules (repositories) implement those abstractions. |

---

## AI Concierge — Retrieval-Augmented Generation (RAG)

One of the more technically interesting features of this system is the AI-powered guest concierge, built using a **RAG (Retrieval-Augmented Generation)** pipeline.

Rather than relying on a general-purpose LLM that hallucinates hotel-specific information, the system embeds hotel documents (policies, menus, room details) into a **pgvector** store in PostgreSQL. When a guest asks a question, the relevant context is retrieved via **vector similarity search** and injected into the prompt before being sent to **OpenAI GPT** — so responses are grounded in actual hotel data.

```
Guest query
    |
    v
Embed query → vector search against pgvector (PostgreSQL)
    |
    | top-k matching document chunks
    v
Construct prompt: [retrieved context] + [user question]
    |
    v
OpenAI GPT → contextually accurate, hotel-specific response
```

This is implemented as its own bounded context (`rag/`) following the same Hexagonal Architecture pattern as every other module — the OpenAI and pgvector dependencies are adapters behind an interface, keeping the core retrieval logic testable and decoupled.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Go 1.22, Gorilla Mux, Gorilla WebSocket, sqlx, sql-migrate, godotenv |
| Auth | Custom JWT — HMAC-SHA256 signing, role claims, middleware enforcement |
| AI | OpenAI API — RAG-based concierge with vector search (pgvector) |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios, Framer Motion |
| Database | PostgreSQL 14+, 11 versioned migrations |
| Real-time | WebSocket hub with goroutine-per-client and broadcast channel |

---

## Modules

| Module | Responsibility |
|--------|---------------|
| `guest` | Registration, authentication, check-in/out, profiles |
| `room` | Inventory, availability, status lifecycle |
| `staff` | Staff accounts, roles, RBAC |
| `housekeeping` | Task assignment, real-time status via WebSocket |
| `laundry` | Requests, item-level tracking, status management |
| `restaurant` | Menu management (with soft delete), orders |
| `invoice` | Aggregates charges from multiple services into a single bill |
| `rag` | AI concierge — RAG pipeline: pgvector similarity search + OpenAI GPT for context-aware, hotel-grounded responses |

---

## Project Structure

```
Backend/
├── cmd/serve.go          # Composition root — wires all dependencies
├── config/               # Environment-based configuration
├── domain/               # Business entities — no framework imports
├── {module}/
│   ├── port.go           # Service interface (the contract)
│   └── service.go        # Business logic implementation
├── repository/           # Database adapters (implement service interfaces)
├── rest/
│   ├── handlers/         # HTTP adapters — translate requests to service calls
│   └── middlewares/      # JWT auth, CORS, role enforcement
├── infra/db/             # Database connection and migration runner
├── migrations/           # SQL migration files (versioned)
├── ws/                   # WebSocket hub and client management
└── util/                 # JWT generation/parsing, response helpers

Frontend/src/
├── context/AuthContext   # Global auth state via Context API
├── pages/                # Role-scoped pages: guest, staff, admin
├── components/           # Reusable UI components
├── layouts/              # Guest, Staff, Public layout wrappers
├── services/api.ts       # Axios instance and API layer
└── types/index.ts        # Shared TypeScript interfaces
```

---

## Getting Started

**Prerequisites:** Go 1.22+, Node.js 18+, PostgreSQL 14+

```bash
# Backend
cd Backend
go mod download

# Backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=oasis
JWT_SECRET=your_secret
PORT=8080
OPENAI_API_KEY=your_key

go run main.go migrate
go run main.go
# API available at http://localhost:8080

# Frontend (new terminal)
cd Frontend
npm install

# Frontend/.env
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws

npm run dev
# App available at http://localhost:5173
```

---

## License

MIT

