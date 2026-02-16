# 🏨 Oasis - Quick Reference Guide

## 📊 At a Glance

| Aspect | Details |
|--------|---------|
| **Project Name** | Oasis - Hotel Management System |
| **Type** | Full-Stack Web Application |
| **Backend** | Go 1.22 (Hexagonal/Clean Architecture) |
| **Frontend** | React 18.3 + TypeScript 5.2 (Vite) |
| **Database** | PostgreSQL with migrations |
| **Key Pattern** | Domain-Driven Design (DDD) + Dependency Injection |
| **Real-Time** | WebSocket (Gorilla) |
| **Auth** | Custom JWT (HMAC-SHA256) + RBAC |
| **Status** | Production-Ready |

---

## 🎯 Architecture Stack (Visual)

```
┌─────────────────────────────────────────┐
│   FRONTEND (React + TypeScript)         │
│   ├─ Components                         │
│   ├─ Pages                              │
│   ├─ Context (Auth State)               │
│   ├─ Services (API Calls)               │
│   └─ Utils (Helpers)                    │
└──────────────┬──────────────────────────┘
               │ HTTP/HTTPS/WebSocket
┌──────────────▼──────────────────────────┐
│   API SERVER (Go)                       │
│   ├─ REST Handlers                      │
│   ├─ Middleware Pipeline                │
│   └─ WebSocket Hub                      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   SERVICE LAYER (Business Logic)        │
│   ├─ Guest Service                      │
│   ├─ Room Service                       │
│   ├─ Laundry Service                    │
│   ├─ Invoice Service                    │
│   ├─ Staff Service                      │
│   ├─ Restaurant Service                 │
│   ├─ Housekeeping Service               │
│   └─ RAG Service                        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   REPOSITORY LAYER (Data Access)        │
│   ├─ Guest Repository                   │
│   ├─ Room Repository                    │
│   ├─ Laundry Repository                 │
│   ├─ Invoice Repository                 │
│   └─ ... other repositories             │
└──────────────┬──────────────────────────┘
               │ SQL
┌──────────────▼──────────────────────────┐
│   DATABASE (PostgreSQL)                 │
│   ├─ guests table                       │
│   ├─ rooms table                        │
│   ├─ staff table                        │
│   ├─ laundry_requests table             │
│   ├─ invoices table                     │
│   └─ ... other tables                   │
└─────────────────────────────────────────┘
```

---

## 🎓 Design Patterns Matrix

| Layer | Pattern | Example | Benefit |
|-------|---------|---------|---------|
| **API** | Middleware | JWT Auth, CORS | Request processing pipeline |
| **Domain** | Value Objects | RoomStatus enum | Clear domain semantics |
| **Service** | Dependency Injection | `NewService(repo)` | Loose coupling, testability |
| **Service** | Service Composition | Invoice (Guest+Room+Laundry) | Complex logic aggregation |
| **Repository** | Adapter | `RoomRepo implements RoomRepo` | Database abstraction |
| **Repository** | Repository | CRUD interface | Data access consistency |
| **General** | Port & Adapter | port.go + repository | Hexagonal architecture |

---

## 📦 Module Breakdown

### Core Modules (Service Modules)

```
GUEST MODULE
├─ port.go (Service interface)
├─ service.go (Business logic)
└─ Uses: GuestRepo (database)
Features: Registration, Auth, Profile

ROOM MODULE
├─ port.go (Service interface)
├─ service.go (Business logic)
└─ Uses: RoomRepo (database)
Features: Inventory, Status tracking

STAFF MODULE
├─ port.go (Service interface)
├─ service.go (Business logic)
└─ Uses: StaffRepo (database)
Features: Auth, Role management

LAUNDRY MODULE
├─ port.go (Service interface)
├─ service.go (Business logic)
└─ Uses: LaundryRepo (database)
Features: Requests, Status tracking, Items

RESTAURANT MODULE
├─ port.go (Service interface)
├─ service.go (Business logic)
└─ Uses: RestaurantRepo (database)
Features: Menu management, Orders

HOUSEKEEPING MODULE
├─ port.go (Service interface)
├─ service.go (Business logic)
└─ Uses: HousekeepingRepo, WebSocket Hub
Features: Tasks, Real-time updates

INVOICE MODULE
├─ port.go (Service interface)
├─ service.go (Business logic)
└─ Uses: Multiple services (Composition)
Features: Bill generation, Multi-service charges

RAG MODULE
├─ port.go (Service interface)
├─ service.go (Business logic)
└─ Uses: OpenAI API
Features: AI-powered retrieval
```

---

## 🔐 Security Layers

```
REQUEST SECURITY FLOW
├─ CORS Middleware
│  └─ Validate origin
├─ JWT Verification Middleware
│  ├─ Extract token
│  ├─ Verify signature (HMAC-SHA256)
│  └─ Validate claims
├─ Authorization Check
│  └─ Verify user role/permission
└─ Handler Processing
   └─ Execute with authenticated user
```

---

## 🗄️ Database Schema Essentials

### Key Tables

| Table | Key Fields | Purpose | Notes |
|-------|-----------|---------|-------|
| `guests` | id, name, phone_number, room_number | Guest information | Check-in/out dates |
| `rooms` | id, room_number, type, status, price | Room inventory | Status: VACANT/OCCUPIED/CLEANING |
| `staff` | id, name, role, credentials | Staff profiles | RBAC enabled |
| `laundry_requests` | id, guest_id, status | Service requests | Track multiple items |
| `laundry_request_items` | id, request_id, item_detail | Per-item tracking | Details for each item |
| `menu_items` | id, name, price, deleted_at | Restaurant menu | Soft delete support |
| `housekeeping_tasks` | id, room_id, status, assigned_to | Cleaning tasks | Real-time updates via WS |
| `invoices` | id, guest_id, room_charge, laundry_charge, restaurant_charge | Billing records | Aggregated charges |
| `documents` | id, invoice_id, document_path | Document storage | Invoice PDFs |

---

## 🔄 Request Flow for Each Module Type

### Example 1: Room Module (Simple)
```
Client Request
  ↓
roomHandler.GetAll()
  ↓
roomService.GetAll(status)
  ↓
roomRepository.GetAll(status)
  ↓
SQL: SELECT * FROM rooms WHERE status = ?
  ↓
Return []Room
  ↓
JSON Response
```

### Example 2: Invoice Module (Complex with Composition)
```
Client Request: Generate Invoice
  ↓
invoiceHandler.Generate(guestID)
  ↓
invoiceService.Generate(guestID)
  ├─ guestService.Get(guestID)           [Dependency 1]
  ├─ roomService.Find(guest.room)        [Dependency 2]
  ├─ laundryService.GetCharges(guestID) [Dependency 3]
  ├─ restaurantService.GetCharges(guestID) [Dependency 4]
  └─ invoiceRepository.Create(invoice)
      ↓
      SQL: INSERT INTO invoices ...
      ↓
      Return Invoice
  ↓
JSON Response with bill breakdown
```

---

## 🛠️ Technology Choices & Why

| Technology | Why Chosen | Benefit |
|-----------|-----------|---------|
| **Go** | Type-safe, fast, goroutines | High performance + Concurrency |
| **PostgreSQL** | Relational, ACID compliance | Data integrity + Complex queries |
| **React** | Component-based, large ecosystem | Reusable UI, developer experience |
| **TypeScript** | Type safety for JavaScript | Fewer runtime errors |
| **Vite** | Fast bundler, modern tooling | Quick dev experience |
| **Tailwind CSS** | Utility-first, customizable | Rapid UI development |
| **Gorilla Mux** | Powerful routing | Clean URL patterns |
| **sqlx** | Type-safe SQL | Reduced errors + Performance |
| **Custom JWT** | No external dependency | Control + Learning |
| **WebSocket** | Real-time bidirectional | Live notifications |

---

## 🎓 Key Learnings Demonstrated

### Backend Skills
- ✅ Go fundamentals (structs, interfaces, errors)
- ✅ Concurrency patterns (goroutines, channels, mutexes)
- ✅ API design (REST principles)
- ✅ Database design (normalization, relationships)
- ✅ Authentication (JWT creation & verification)
- ✅ Authorization (RBAC implementation)
- ✅ Middleware patterns
- ✅ Error handling strategies

### Frontend Skills
- ✅ React hooks (useState, useEffect, useContext)
- ✅ TypeScript (types, interfaces, generics)
- ✅ Component composition
- ✅ State management (Context API)
- ✅ HTTP clients (Axios)
- ✅ Routing (React Router)
- ✅ CSS frameworks (Tailwind)
- ✅ Form handling & validation

### Architecture Skills
- ✅ Clean Architecture principles
- ✅ Domain-Driven Design
- ✅ Hexagonal Architecture
- ✅ SOLID principles
- ✅ Design patterns (Factory, Adapter, Strategy)
- ✅ Scalability & extensibility
- ✅ Testability considerations
- ✅ Separation of concerns

---

## 📈 Scalability Features

### Current Scalability
- ✅ Modular services (can deploy separately)
- ✅ Loose coupling (swap implementations)
- ✅ Horizontal scaling ready (stateless handlers)
- ✅ WebSocket hub (scalable with connection pool)
- ✅ Repository pattern (easy database optimization)

### Future Scaling Opportunities
- 🔮 Microservices (split each module)
- 🔮 Service mesh (Kubernetes)
- 🔮 Message queues (async processing)
- 🔮 Caching layer (Redis)
- 🔮 Load balancing
- 🔮 Database replication
- 🔮 API rate limiting

---

## 🔗 Cross-Module Dependencies

```
INVOICE MODULE depends on:
├─ Guest Service
├─ Room Service
├─ Laundry Service
└─ Restaurant Service

HOUSEKEEPING MODULE depends on:
├─ WebSocket Hub
└─ Room Service

MOST MODULES depend on:
├─ Their own Repository
└─ Configuration

FRONTEND depends on:
├─ Backend API
├─ Auth Context
└─ External services (Axios)
```

---

## 📋 Setup Checklist

To understand/extend this project:

- [ ] Read main.go → project entry point
- [ ] Review cmd/serve.go → dependency injection flow
- [ ] Check config/ → configuration management
- [ ] Study domain/ → business entities
- [ ] Explore modules (guest/, room/, etc.) → patterns
- [ ] Review rest/handlers → API endpoints
- [ ] Check repository/ → database abstraction
- [ ] Study infra/db → database setup
- [ ] Review Frontend structure → React organization
- [ ] Check .env requirements → configuration

---

## 🚀 Quick Commands

### Backend
```bash
# Run application
go run main.go

# Build
go build -o main

# Run tests
go test ./...
```

### Frontend
```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

---

## 📞 Module Communication Map

```
REST API (External)
  ├→ Guest Handler    → Guest Service → Guest Repository    → DB
  ├→ Room Handler     → Room Service  → Room Repository     → DB
  ├→ Staff Handler    → Staff Service → Staff Repository    → DB
  ├→ Laundry Handler  → Laundry Service → Laundry Repository → DB
  ├→ Restaurant Handler → Restaurant Service → Restaurant Repo → DB
  ├→ Housekeeping Handler → Housekeeping Service ──→ [WebSocket Hub]
  │                                    ↓
  │                            Housekeeping Repository → DB
  ├→ Invoice Handler → Invoice Service → [Cross-Service Calls]
  │                       ├─ Guest Service
  │                       ├─ Room Service
  │                       ├─ Laundry Service
  │                       ├─ Restaurant Service
  │                       └─ Invoice Repository → DB
  └→ RAG Handler → RAG Service → OpenAI API
```

---

## 🎯 Feature Matrix

| Feature | Guest | Staff | Admin | Real-Time |
|---------|-------|-------|-------|-----------|
| Register | ✅ | ❌ | ✅ | ❌ |
| View Rooms | ✅ | ✅ | ✅ | ❌ |
| Laundry Service | ✅ | ✅ | ✅ | ✅ |
| Housekeeping Tasks | ❌ | ✅ | ✅ | ✅ |
| Restaurant Menu | ✅ | ✅ | ✅ | ❌ |
| View Invoice | ✅ | ❌ | ✅ | ❌ |
| AI Chat (RAG) | ✅ | ✅ | ✅ | ✅ |

---

## 💡 Design Intelligence Indicators

### Evidence of Expert Design
1. **Separation of Concerns** - Each layer has single responsibility
2. **Testability** - Interface-based design enables mocking
3. **Extensibility** - New modules follow established patterns
4. **Maintainability** - Clear code organization
5. **Security** - JWT + RBAC + CORS implemented
6. **Performance** - Goroutines, connection pooling ready
7. **Reliability** - Error handling throughout
8. **Documentation** - README files, clear structure

---

## 🏆 Professional Standards Met

- ✅ Production-ready code
- ✅ Enterprise architecture patterns
- ✅ Security best practices
- ✅ Database design principles
- ✅ API design standards
- ✅ Code organization & structure
- ✅ Dependency management
- ✅ Error handling strategy
- ✅ Scalability & extensibility
- ✅ Documentation & comments

---

**This is a demonstration of professional-grade software engineering expertise.**

