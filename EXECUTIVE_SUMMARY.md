# 🏨 Oasis - One-Page Executive Summary

## Project Overview
**Oasis** is a production-grade hotel management system demonstrating professional software architecture, design patterns, and full-stack development expertise.

---

## 🎯 System Architecture
```
React + TypeScript Frontend (Vite) 
    ↓ HTTP/WebSocket
Go Backend (Hexagonal Architecture)
    ├─ 8 Service Modules (DDD Bounded Contexts)
    ├─ Port & Adapter Pattern (Interface-based)
    ├─ Dependency Injection (Loose Coupling)
    └─ Repository Layer (Data Abstraction)
    ↓ SQL
PostgreSQL Database (11 Migrations)
```

---

## ✨ Core Features

| Module | Features |
|--------|----------|
| **Guest** | Registration, auth, profile, booking history |
| **Room** | Inventory, status tracking, availability |
| **Staff** | Auth, roles, task assignment |
| **Laundry** | Requests, item tracking, status management |
| **Restaurant** | Menu management, orders, soft deletes |
| **Housekeeping** | Task assignment, real-time WebSocket updates |
| **Invoice** | Multi-service aggregation, billing |
| **RAG** | AI-powered information retrieval (OpenAI) |

**Extra**: JWT authentication, RBAC, WebSocket real-time, CORS

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Go 1.22 |
| **Frontend** | React 18.3 + TypeScript 5.2 + Vite |
| **Database** | PostgreSQL + sqlx + sqlmigrate |
| **Real-Time** | Gorilla WebSocket |
| **Auth** | Custom JWT (HMAC-SHA256) |
| **Styling** | Tailwind CSS 3.3 |
| **API** | RESTful with Gorilla patterns |

---

## 🏛️ Architecture Principles

### Domain-Driven Design (DDD)
- 8 bounded contexts (modules)
- Domain entities with clear identity
- Ubiquitous language matching business terms

### Hexagonal Architecture (Ports & Adapters)
```
         External (HTTP, DB, APIs)
                  │
            Adapter (Translator)
                  │
         ┌────────▼────────┐
         │ PORT (Interface)│
         └────────┬────────┘
                  │
      ┌───────────┴────────────┐
      │                        │
    SERVICE            REPOSITORY
  (Business Logic)    (Data Access)
```

### Dependency Injection
- Constructor-based DI throughout
- Loose coupling via interfaces
- Easy testing with mocks

### Repository Pattern
- Data access abstraction
- Database-agnostic services
- Swappable implementations

### Loose Coupling
- ✅ Services depend on interfaces, not implementations
- ✅ Handlers depend on service interfaces
- ✅ Zero circular dependencies
- ✅ Independently testable modules

---

## 📊 Code Organization

```
Backend/
├─ domain/          → Business entities (DDD)
├─ {module}/        → Service modules (port.go + service.go)
├─ repository/      → Data adapters (Interface implementations)
├─ rest/
│  ├─ handlers/    → HTTP handlers (Ports)
│  └─ middleware/  → Request pipeline (Auth, CORS)
├─ infra/db/       → Database connection & migrations
├─ ws/             → WebSocket hub (Real-time)
├─ config/         → Configuration management
└─ util/           → JWT, helpers

Frontend/
├─ context/        → Global state (Auth)
├─ pages/          → Page components
├─ components/     → Reusable UI components
├─ services/       → API layer (Axios)
├─ layouts/        → Page layouts (Guest/Staff/Public)
└─ types/          → TypeScript interfaces
```

---

## 🔐 Security Implementation

| Feature | Implementation |
|---------|---|
| **Authentication** | Custom JWT with HMAC-SHA256 |
| **Authorization** | Role-based access control (RBAC) |
| **Protected Routes** | React Router + JWT middleware |
| **Token Storage** | localStorage with client-side management |
| **CORS** | Middleware-based cross-origin protection |
| **Session** | JWT claims-based (stateless) |

---

## 📡 Real-Time Architecture

**WebSocket Hub Pattern:**
- Goroutine-based message broadcasting
- Thread-safe client management (sync.Mutex)
- Efficient channel-based messaging
- Live housekeeping task updates

**Message Format:**
```json
{
  "type": "ROOM_UPDATE",
  "payload": { "room_id": 1, "status": "OCCUPIED" }
}
```

---

## 🗄️ Database Schema Highlights

| Table | Key Design |
|-------|-----------|
| **guests** | Check-in/out dates, room assignment |
| **rooms** | Status tracking (VACANT/OCCUPIED/CLEANING) |
| **invoices** | Multi-service charge aggregation |
| **laundry_requests** | Parent-child with items |
| **menu_items** | Soft delete (deleted_at) |
| **housekeeping_tasks** | Staff assignment, status |

**Features**: Foreign keys, relationships, migrations, indexes

---

## 💡 Design Patterns Applied

| Pattern | Usage | Benefit |
|---------|-------|---------|
| **Hexagonal** | Core isolated from frameworks | Framework-agnostic |
| **DDD** | Business logic in domain layer | Clear business modeling |
| **Ports & Adapters** | Interfaces + Implementations | Interchangeable components |
| **Dependency Injection** | Constructor-based | Testable, flexible |
| **Repository** | Data abstraction | Database-agnostic |
| **Service Composition** | Invoice uses multiple services | Complex logic aggregation |
| **Middleware Pipeline** | Request processing layers | Cross-cutting concerns |
| **Observer** | WebSocket hub | Real-time notifications |
| **Factory** | NewService constructors | Object creation |

---

## 🎓 Skills Demonstrated

### Backend (Go)
✅ Concurrency (Goroutines, channels, mutexes)  
✅ Interface-based design  
✅ Dependency injection  
✅ REST API design  
✅ Database design & SQL  
✅ Error handling  
✅ Type safety & domain modeling  
✅ Real-time systems (WebSocket)  

### Frontend (React)
✅ Component composition  
✅ React Hooks (useState, useEffect, useContext)  
✅ TypeScript type safety  
✅ State management (Context API)  
✅ Protected routing  
✅ HTTP client integration  
✅ Responsive UI (Tailwind)  

### Architecture
✅ System design  
✅ SOLID principles (all 5)  
✅ Scalable architecture  
✅ Security implementation  
✅ Testable code design  
✅ Production readiness  

---

## 🚀 Scalability Features

**Current:**
- Modular services
- Loose coupling
- Stateless handlers
- Interface-based design

**Future Ready:**
- Can split modules to microservices
- Horizontal scaling (stateless)
- Add caching layer (Redis)
- Database replication
- Load balancing

---

## 📋 Request Flow Example

**Invoice Generation (Service Composition):**
```
HTTP POST /api/invoices
    ↓
invoiceHandler.Generate(guestID)
    ↓
invoiceService.Generate(guestID)
    ├─ guestService.Get(guestID)
    ├─ roomService.GetCharge(guestID)
    ├─ laundryService.GetCharges(guestID)
    ├─ restaurantService.GetCharges(guestID)
    └─ invoiceRepository.Create(invoice)
        ↓ SQL INSERT
    ↓
Return Invoice JSON
```

---

## 🔗 Module Interaction

```
API Handler Layer
    ├─> Guest Handler    ──> Guest Service    ──> Guest Repository
    ├─> Room Handler     ──> Room Service     ──> Room Repository
    ├─> Laundry Handler  ──> Laundry Service ──> Laundry Repository
    ├─> Invoice Handler  ──> Invoice Service ──┐
    │                             (Composes)    ├─> Guest/Room/Laundry Services
    │                                            └─> Invoice Repository
    └─> Housekeeping Handler ──> Housekeeping Service ──┬──> WebSocket Hub
                                                          └──> Housekeeping Repository
```

---

## 🏆 What This Demonstrates

### Enterprise Development
- ✅ Professional architecture patterns
- ✅ Clean code principles
- ✅ SOLID design (all 5 principles)
- ✅ Scalable system design
- ✅ Production-ready code

### Full-Stack Capability
- ✅ Backend development (Go)
- ✅ Frontend development (React)
- ✅ Database design (PostgreSQL)
- ✅ API design (RESTful)
- ✅ Real-time systems (WebSocket)

### Deep Technical Knowledge
- ✅ Architecture patterns (DDD, hexagonal)
- ✅ Design patterns (10+ patterns)
- ✅ Security implementation
- ✅ Concurrency (goroutines)
- ✅ Type systems (Go + TypeScript)

### Professional Practices
- ✅ Error handling
- ✅ Configuration management
- ✅ Database migrations
- ✅ Testing considerations
- ✅ Code organization

---

## 📚 Documentation Provided

| Document | Coverage |
|----------|----------|
| PROJECT_OVERVIEW.md | Complete system overview & features |
| QUICK_REFERENCE.md | Visual guides & quick lookup |
| ARCHITECTURE_DEEP_DIVE.md | Pattern explanations & examples |
| SKILLS_SHOWCASE.md | Career positioning & interviews |
| DOCUMENTATION_INDEX.md | Navigation & cross-references |

---

## 🎯 Key Competitive Advantages

1. **Complete System** - Fully functional, not a tutorial
2. **Professional Architecture** - DDD, hexagonal, not ad-hoc
3. **Testable Design** - Interface-based enables mocking
4. **Scalable** - Modular, extensible without changes
5. **Real-Time** - Not just CRUD, includes WebSocket
6. **Security** - JWT, RBAC, CORS implemented
7. **Full-Stack** - Frontend + Backend + Database
8. **Well-Documented** - Code is clear, patterns evident

---

## 🚀 In One Sentence

*Oasis is a production-ready, full-stack hotel management system built with professional architecture patterns (DDD, hexagonal, dependency injection), demonstrating enterprise-level software engineering expertise across Go backend, React frontend, and PostgreSQL database.*

---

## ✅ Summary Checklist

- [x] **Domain-Driven Design** - Clear business modeling
- [x] **Hexagonal Architecture** - Core logic isolated
- [x] **Dependency Injection** - Loose coupling achieved
- [x] **SOLID Principles** - All 5 applied
- [x] **Repository Pattern** - Data abstraction
- [x] **Service Composition** - Complex logic aggregation
- [x] **Security** - JWT + RBAC + CORS
- [x] **Real-Time** - WebSocket integration
- [x] **Database** - Proper schema + migrations
- [x] **Full-Stack** - Go + React + PostgreSQL
- [x] **Production Ready** - Error handling, config, logging
- [x] **Testable** - Designed for unit testing
- [x] **Scalable** - Modular, extensible
- [x] **Professional** - Enterprise standards
- [x] **Documented** - Comprehensive docs

---

**This is portfolio-grade software demonstrating professional-level expertise.**

**For detailed information, see:**
- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Comprehensive guide
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Visual reference
- [ARCHITECTURE_DEEP_DIVE.md](ARCHITECTURE_DEEP_DIVE.md) - Pattern details
- [SKILLS_SHOWCASE.md](SKILLS_SHOWCASE.md) - Career positioning

