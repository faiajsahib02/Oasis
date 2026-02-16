# 🏨 OASIS - Hotel Management System: Complete Project Overview

## Executive Summary

**Oasis** is a production-grade, full-stack hotel management system demonstrating advanced software architecture, design patterns, and cloud-ready technologies. Built with **Go (Backend)** and **React + TypeScript (Frontend)**, it showcases professional-level development practices including **Domain-Driven Design (DDD)**, **Clean Architecture**, **Hexagonal Architecture**, **Dependency Injection**, **Loose Coupling**, and **Service-Port Pattern**.

---

## 📊 Project Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT APPLICATIONS                       │
│           React Frontend (TypeScript + Vite)                 │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTP/REST & WebSocket
┌──────────────────▼──────────────────────────────────────────┐
│                   API GATEWAY / SERVER                        │
│        REST Handlers + Middleware Pipeline                   │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐  │
│  │          DOMAIN LAYER (Business Logic)                │  │
│  │  - Domain Models (Entities)                          │  │
│  │  - Domain Interfaces (Ports)                         │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │  Guest | Room | Staff | Laundry | Invoice | etc.   │  │
│  └────────────────────────────────────────────────────────┘  │
│                         ▲                                      │
│                         │ Dependency Injection                │
│  ┌──────────────────────┴──────────────────────────────────┐ │
│  │         SERVICE LAYER (Application Logic)              │ │
│  │  - Service Implementations                          │ │
│  │  - Business Rule Orchestration                      │ │
│  └──────────────────────────────────────────────────────┘ │
│            │                                                  │
│   ┌────────▼────────────┐                                   │
│   │  Port Abstraction   │                                   │
│   │  (Interfaces)       │                                   │
│   └────────┬────────────┘                                   │
│            │                                                  │
│  ┌─────────▼──────────────────────────────────────────────┐ │
│  │      REPOSITORY LAYER (Data Adapters)                  │ │
│  │  - Repository Implementations                       │ │
│  │  - Database Abstraction                            │ │
│  └─────────▼──────────────────────────────────────────────┘ │
└────────────┬──────────────────────────────────────────────────┘
             │ SQL
┌────────────▼──────────────────────────────────────────────────┐
│           DATABASE LAYER (PostgreSQL)                          │
│  - Persistent Data Storage                                    │
│  - Migrations & Schema                                        │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Core Design Principles

### 1. **Hexagonal Architecture (Ports & Adapters)**
- **Benefit**: Core domain logic isolated from external frameworks
- **Implementation**: 
  - Service layer defines interfaces (`ports`)
  - Repository layer implements these interfaces (`adapters`)
  - External frameworks plugged in at boundaries

### 2. **Domain-Driven Design (DDD)**
- **Domain Layer**: Contains pure business entities
  - Models like `Guest`, `Room`, `Invoice`, `Laundry`
  - Value objects with clear boundaries
  - Business rules embedded in domain objects
- **Ubiquitous Language**: Terms match business terminology
  - `RoomStatus` (VACANT, OCCUPIED, CLEANING)
  - `CheckInDate`, `CheckOutDate`
  - `InvoicePreview` for financial summaries

### 3. **Dependency Injection (DI)**
- **Pattern Implementation**: Constructor-based DI
- **Example**:
  ```go
  // Service receives dependencies via constructor
  func NewService(repo RoomRepo) *service {
      return &service{rmRepo: repo}
  }
  ```
- **Benefits**:
  - Loose coupling between layers
  - Easy testing with mock repositories
  - Flexible service configuration
  - Clear dependency graph

### 4. **Service-Port Pattern**
- **Service**: Concrete business logic implementation
- **Port**: Interface defining service capabilities
- **Example**:
  ```go
  // Port (Interface) - in port.go
  type Service interface {
      Create(room domain.Room) (*domain.Room, error)
      Find(roomNumber string) (*domain.Room, error)
  }
  
  // Service (Implementation) - in service.go
  type service struct {
      rmRepo RoomRepo
  }
  func (svc *service) Create(room domain.Room) (*domain.Room, error) {
      // Business logic
  }
  ```

### 5. **Repository Pattern (Data Abstraction)**
- **Abstraction Layer**: Database operations hidden behind interfaces
- **Module Structure**:
  ```
  module/
  ├── port.go          (Defines what the service can do)
  ├── service.go       (Implements the service)
  └── repository/      (Implements database operations)
      └── {module}.go
  ```
- **Benefits**:
  - Easy database switching (PostgreSQL → MongoDB)
  - Unit testable with mocks
  - Clear separation of concerns

### 6. **Middleware Pattern**
- **Request Pipeline Architecture**:
  ```
  Request → CORS Middleware 
         → Authentication Middleware 
         → JWT Verification 
         → Handler Logic 
         → Response
  ```
- **Manager Pattern**: Centralized middleware composition

### 7. **Loose Coupling Principles**
- ✅ Services depend on interfaces, not concrete implementations
- ✅ Handlers depend on service interfaces
- ✅ Repositories implement port interfaces
- ✅ Each module is independently deployable
- ✅ No circular imports or tight coupling

---

## ✨ Features (Complete List)

### 🛎️ **Guest Management Module**
- **Features**:
  - Guest registration and profile creation
  - Check-in/Check-out management with date tracking
  - Guest authentication via Room Number + Phone Number
  - JWT-based session management
  - Guest dashboard view
  - Booking history access
  - Stay information display

- **Design**: DDD with `Guest` aggregate, repository pattern
- **Data Model**:
  ```go
  type Guest struct {
      ID           int       // Primary identifier
      Name         string    // Guest name
      PhoneNumber  string    // Login credential
      RoomNumber   string    // Room assignment
      CheckInDate  time.Time // Stay start
      CheckOutDate time.Time // Stay end
      CreatedAt    time.Time // Record creation
  }
  ```

### 🏠 **Room Management Module**
- **Features**:
  - Room inventory tracking
  - Real-time room status updates (VACANT, OCCUPIED, CLEANING)
  - Room type categorization
  - Dynamic pricing
  - Occupancy management
  - Room availability filtering
  - Status change tracking

- **Design**: DDD with `Room` aggregate, event-based updates
- **Data Model**:
  ```go
  type Room struct {
      ID         int        // Room ID
      RoomNumber string     // Hotel room number (e.g., "101")
      Type       string     // Room type (e.g., "Deluxe")
      Status     RoomStatus // VACANT, OCCUPIED, CLEANING
      Price      float64    // Room rate
  }
  ```

### 🧹 **Housekeeping Module**
- **Features**:
  - Task creation and assignment
  - Real-time task status management
  - WebSocket-based live updates to staff
  - Issue reporting system
  - Cleaning schedule coordination
  - Task completion tracking
  - Priority management

- **Design**: DDD with `Housekeeping` aggregate, WebSocket integration
- **Real-Time**: Staff receives instant notifications via WebSocket

### 🧺 **Laundry Services Module**
- **Features**:
  - Laundry request management
  - Item-level tracking (multiple items per request)
  - Status lifecycle management
  - Service history for guests
  - Request pricing
  - Item categorization
  - Completion tracking

- **Design**: DDD with `LaundryRequest` and `LaundryItem` aggregates
- **Data Model**:
  ```go
  type LaundryRequest struct {
      ID        int
      GuestID   int
      RoomID    int
      Status    string
      CreatedAt time.Time
  }
  ```

### 🍽️ **Restaurant Operations Module**
- **Features**:
  - Digital menu management
  - Menu item creation with pricing and details
  - Soft-delete capability (archive without data loss)
  - In-room dining orders
  - Order status tracking
  - Restaurant billing integration
  - Special dietary notes

- **Design**: DDD with `MenuItem` and `Order` aggregates
- **Soft Delete Pattern**: Items marked inactive, not deleted

### 👔 **Staff Management Module**
- **Features**:
  - Staff profile creation
  - Role-based access control (Multiple roles possible)
  - Staff authentication via credentials
  - JWT token generation for staff
  - Performance tracking
  - Shift management
  - Department assignment

- **Design**: DDD with `Staff` aggregate, RBAC implementation
- **Security**: Custom JWT implementation with HMAC-SHA256

### 💰 **Invoice Management Module**
- **Features**:
  - Automated invoice generation
  - Multi-service charge aggregation (Room + Laundry + Restaurant)
  - Invoice preview before finalization
  - Payment method tracking
  - Invoice history and archival
  - Financial summarization
  - Service charge breakdown

- **Design**: DDD with `Invoice` aggregate, service composition
- **Data Model**:
  ```go
  type Invoice struct {
      ID                int       // Invoice ID
      GuestID           int       // Associated guest
      RoomNumber        string    // Room reference
      RoomCharge        float64   // Accommodation cost
      LaundryCharge     float64   // Laundry service cost
      RestaurantCharge  float64   // Dining cost
      TotalAmount       float64   // Grand total
      PaymentMethod     string    // Payment type
      CreatedAt         time.Time
  }
  ```

### 🤖 **RAG (Retrieval-Augmented Generation) Module**
- **Features**:
  - AI-powered information retrieval
  - Integration with OpenAI API
  - Document storage and querying
  - Intelligent response generation
  - Context-aware answer retrieval

- **Design**: Service-based architecture with external API integration
- **Technology**: OpenAI integration for NLP capabilities

### 🔐 **Authentication & Authorization**
- **Guest Authentication**:
  - Room Number + Phone Number credentials
  - JWT token generation and validation
  - Custom JWT implementation (HMAC-SHA256)
  - Token storage in localStorage
  - Session management on client

- **Staff Authentication**:
  - Credentials-based login
  - JWT token with staff claims
  - Role-based access control
  - Admin-only endpoints

- **Middleware Protection**:
  - JWT signature verification
  - Claim validation
  - Request authorization checks

### 📡 **Real-Time Features (WebSocket)**
- **Technology**: Gorilla WebSocket library
- **Features**:
  - Live room status updates
  - Real-time housekeeping task notifications
  - Staff connection management
  - Broadcast messaging capability
  - Thread-safe client management (sync.Mutex)

- **Message Protocol**:
  ```json
  {
    "type": "ROOM_UPDATE",
    "payload": {
      "room_id": 1,
      "status": "OCCUPIED"
    }
  }
  ```

### 📄 **Document Management**
- **Features**:
  - Invoice document storage
  - PDF generation capability
  - Document versioning
  - Audit trail

---

## 🛠️ Technology Stack

### **Backend Stack**

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Language** | Go | 1.22 | High-performance backend |
| **Web Framework** | Gorilla Mux* | Latest | HTTP routing (custom pattern) |
| **WebSocket** | Gorilla WebSocket | Latest | Real-time bidirectional communication |
| **Database Driver** | sqlx | Latest | Type-safe database access |
| **Database** | PostgreSQL | 12+** | Relational data persistence |
| **Authentication** | Custom JWT | N/A | Token-based auth (HMAC-SHA256) |
| **Migrations** | sql-migrate* | Latest | Schema version management |
| **Environment** | godotenv | Latest | Configuration management |
| **AI Integration** | OpenAI API | GPT-4 | RAG capabilities |

### **Frontend Stack**

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 18.3 | UI component library |
| **Language** | TypeScript | 5.2 | Type-safe JavaScript |
| **Build Tool** | Vite | 5.0 | Lightning-fast bundling |
| **Routing** | React Router | 6.20 | Client-side navigation |
| **HTTP Client** | Axios | 1.6 | API communication |
| **Styling** | Tailwind CSS | 3.3 | Utility-first styling |
| **Animation** | Framer Motion | 10.16 | Smooth animations |
| **Icons** | Lucide React | 0.294 | Modern icon library |
| **State Management** | React Context | Built-in | Global state (Auth) |
| **JWT Parsing** | jwt-decode | 4.0 | Token decoding |

### **Development Tools**

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting & quality |
| **TypeScript Compiler** | Type checking |
| **PostCSS** | CSS processing |
| **Autoprefixer** | Browser compatibility |

---

## 📁 Project Structure & Layering

```
Oasis/
├── Backend/                          # Go Backend Application
│   ├── main.go                       # Entry point
│   ├── go.mod                        # Dependency management
│   │
│   ├── cmd/                          # Command/Startup
│   │   └── serve.go                  # Application initialization
│   │                                 # Dependency Injection setup
│   │
│   ├── config/                       # Configuration Layer
│   │   └── config.go                 # Environment variables
│   │                                 # Database config
│   │
│   ├── domain/                       # Domain Layer (DDD)
│   │   ├── guest.go                  # Guest entity
│   │   ├── room.go                   # Room entity
│   │   ├── staff.go                  # Staff entity
│   │   ├── laundry.go                # Laundry aggregate
│   │   ├── restaurant.go             # MenuItem & Order model
│   │   ├── housekeeping.go           # Housekeeping task model
│   │   └── invoice.go                # Invoice aggregate
│   │                                 # Pure business logic
│   │
│   ├── {module}/                     # Service Modules (DDD)
│   │   ├── port.go                   # Interfaces (Port)
│   │   └── service.go                # Service logic (Service)
│   │   
│   │   Modules:
│   │   ├── guest/
│   │   ├── room/
│   │   ├── staff/
│   │   ├── laundry/
│   │   ├── restaurant/
│   │   ├── housekeeping/
│   │   ├── invoice/
│   │   └── rag/
│   │
│   ├── repository/                   # Data Access Layer
│   │   ├── guest.go                  # Guest repository
│   │   ├── room.go                   # Room repository
│   │   ├── staff.go                  # Staff repository
│   │   ├── laundry.go                # Laundry repository
│   │   ├── restaurant.go             # Restaurant repository
│   │   ├── housekeeping.go           # Housekeeping repository
│   │   └── invoice.go                # Invoice repository
│   │                                 # Database adapters
│   │
│   ├── rest/                         # REST API Layer
│   │   ├── server.go                 # HTTP server setup
│   │   │                             # Handler registration
│   │   │
│   │   ├── middlewares/              # HTTP Middleware
│   │   │   ├── manager.go            # Middleware manager
│   │   │   ├── middleware.go         # Base middleware
│   │   │   ├── authenticate_jwt.go   # JWT validation
│   │   │   ├── cors.go               # CORS handling
│   │   │   └── manager.go            # Request pipeline
│   │   │
│   │   └── handlers/                 # HTTP Request Handlers
│   │       ├── guest/
│   │       ├── room/
│   │       ├── staff/
│   │       ├── laundry/
│   │       ├── restaurant/
│   │       ├── housekeeping/
│   │       ├── invoice/
│   │       └── rag/
│   │
│   ├── infra/                        # Infrastructure Layer
│   │   └── db/
│   │       ├── connection.go         # Database connection
│   │       └── migrate.go            # Migration runner
│   │
│   ├── migrations/                   # Database Migrations
│   │   ├── 001_create_rooms.sql
│   │   ├── 002_create_guests.sql
│   │   ├── 003_add_guest_dates.sql
│   │   ├── 004_create_laundry_request_items.sql
│   │   ├── 005_create_staff.sql
│   │   ├── 006_restaurant.sql
│   │   ├── 007_soft_delete_menu_items.sql
│   │   ├── 008_house_keeping.sql
│   │   ├── 009_seed_more_rooms.sql
│   │   ├── 010_invoice.sql
│   │   └── 011_create_documents.sql
│   │
│   ├── ws/                           # WebSocket Module
│   │   ├── client.go                 # WebSocket client
│   │   └── hub.go                    # Message broker
│   │
│   ├── util/                         # Utility Functions
│   │   ├── create_jwt.go             # JWT generation
│   │   ├── jwt_parser.go             # JWT parsing
│   │   └── send_data.go              # Response formatting
│   │
│   └── uploads/                      # File storage
│
├── Frontend/                         # React + TypeScript Frontend
│   ├── package.json                  # Dependencies
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── vite.config.ts                # Build configuration
│   ├── tailwind.config.js            # Tailwind CSS config
│   ├── postcss.config.js             # CSS post-processing
│   │
│   └── src/
│       ├── main.tsx                  # Application entry
│       ├── App.tsx                   # Root component
│       ├── index.css                 # Global styles
│       │
│       ├── context/                  # Global State Context
│       │   └── AuthContext.tsx       # Authentication state
│       │                             # User info
│       │                             # Login/Logout
│       │
│       ├── layout/                   # Layout Components
│       │   └── MainLayout.tsx        # Main layout wrapper
│       │
│       ├── layouts/                  # Page Layouts
│       │   ├── GuestLayout.tsx       # Guest-specific layout
│       │   ├── StaffLayout.tsx       # Staff-specific layout
│       │   └── PublicLayout.tsx      # Public layout
│       │
│       ├── pages/                    # Page Components
│       │   ├── HomePage.tsx          # Landing page
│       │   ├── LoginPage.tsx         # Authentication page
│       │   ├── RoomsPage.tsx         # Room browsing
│       │   ├── GuestDashboardPage.tsx # Guest dashboard
│       │   ├── AboutPage.tsx         # About page
│       │   ├── ContactPage.tsx       # Contact page
│       │   ├── guest/                # Guest-specific pages
│       │   ├── staff/                # Staff-specific pages
│       │   └── admin/                # Admin-specific pages
│       │
│       ├── components/               # Reusable Components
│       │   ├── Button.tsx            # Button component
│       │   ├── Card.tsx              # Card container
│       │   ├── GuestNavbar.tsx       # Guest navigation
│       │   ├── StaffNavbar.tsx       # Staff navigation
│       │   ├── ProtectedRoute.tsx    # Route protection
│       │   ├── RequireAuth.tsx       # Auth requirement
│       │   ├── admin/                # Admin components
│       │   └── guest/                # Guest components
│       │
│       ├── services/                 # API Services
│       │   └── api.ts                # Axios instance
│       │                             # API call centralization
│       │
│       ├── types/                    # TypeScript Interfaces
│       │   └── index.ts              # Type definitions
│       │
│       └── utils/                    # Utility Functions
│           └── (auth, helpers)
│
└── Documentation/                    # Project Docs
    ├── README.md                     # Overview
    ├── ROADMAP.md                    # Future features
    ├── CONTRIBUTING.md               # Contribution guidelines
    ├── CODE_OF_CONDUCT.md            # Community guidelines
    ├── SECURITY.md                   # Security policy
    └── LICENSE                       # MIT License
```

---

## 🔗 Dependency Flow & Injection

### Initialization Flow (serve.go)

```go
// 1. Configuration Loading
cnf := config.GetConfig()

// 2. Database Setup
dbCon := db.NewConnection(cnf.DB)
db.MigrateDB(dbCon, "./migrations")

// 3. Infrastructure
hub := ws.NewHub()

// 4. Repository Layer (Data Adapters)
guestRepo := repository.NewGuestRepo(dbCon)
roomRepo := repository.NewRoomRepo(dbCon)
// ... other repositories

// 5. Service Layer (Business Logic)
guestSvc := guest.NewService(guestRepo)        // Inject repository
roomSvc := room.NewService(roomRepo)           // Inject repository
invoiceSvc := invoice.NewService(
    invoiceRepo,
    guestSvc,      // Service composition
    roomSvc,
    laundrySvc,
    restaurantSvc
)

// 6. Handler Layer (HTTP Ports)
guestHandler := guest.NewHandler(guestSvc, cnf)
roomHandler := room.NewHandler(roomSvc)
// ... other handlers

// 7. Server Setup
server := rest.NewServer(
    cnf,
    guestHandler,
    roomHandler,
    // ... all handlers
)
server.Start()
```

---

## 🏛️ Architectural Patterns Demonstrated

### 1. **Ports & Adapters (Hexagonal Architecture)**
```
Domain (Core Business Logic)
    ↑
    │ Ports (Interfaces)
    │
    ├→ Adapters (Repositories)
    │  └→ PostgreSQL Database
    │
    └→ Adapters (REST Handlers)
       └→ HTTP Client Requests
```

### 2. **Repository Pattern**
```go
// Port: Interface contract
type RoomRepo interface {
    Create(room domain.Room) (*domain.Room, error)
    Find(roomNumber string) (*domain.Room, error)
    GetAll(status string) ([]domain.Room, error)
}

// Adapter: Concrete implementation
type roomRepo struct {
    db *sqlx.DB
}

func (r *roomRepo) Create(room domain.Room) (*domain.Room, error) {
    // SQL execution
}
```

### 3. **Dependency Injection**
```go
// Constructor-based DI
type Service struct {
    repo RoomRepo  // Injected dependency
}

func NewService(repo RoomRepo) *Service {
    return &Service{repo: repo}
}
```

### 4. **Middleware Pipeline**
```
Request
  ↓
┌─────────────────────────┐
│  CORS Middleware        │
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│  JWT Auth Middleware    │
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│  Handler Logic          │
└──────────┬──────────────┘
           ↓
Response
```

### 5. **Service Pattern with Composition**
```go
// Invoice service composes multiple services
type invoiceService struct {
    invoiceRepo      repository.InvoiceRepo
    guestService     guest.Service          // Composition
    roomService      room.Service           // Composition
    laundryService   laundry.Service        // Composition
    restaurantService restaurant.Service    // Composition
}

// Services collaborate to produce complex business logic
```

---

## 🔐 Security Implementation

### **JWT Authentication**
- **Type**: Custom HMAC-SHA256 implementation
- **Flow**:
  1. User provides credentials
  2. Server generates JWT with claims (Guest ID, Name, Room Number)
  3. Client stores JWT in localStorage
  4. JWT sent in Authorization header for protected routes
  5. Server verifies signature before processing

- **Token Structure**:
  ```
  Header (Base64URL)     → {"alg": "HS256", "typ": "JWT"}
  Payload (Base64URL)    → {"sub": 1, "name": "John", "room_number": "101"}
  Signature (HMAC-SHA256) → Hash of (Header.Payload with Secret)
  ```

### **Authorization Middleware**
- JWT signature verification
- Token claim validation
- Request authorization checks
- Protected route enforcement

### **CORS Protection**
- Configurable allowed origins
- Request validations
- Cross-site attack prevention

### **Password Verification**
- Credentials validation in authentication flow
- Secure session establishment

---

## 📡 Real-Time Architecture (WebSocket)

### **WebSocket Hub Implementation**
```go
type Hub struct {
    clients      map[*Client]bool    // Connected clients
    broadcast    chan Message        // Inbound messages
    register     chan *Client        // New connections
    unregister   chan *Client        // Disconnections
    mu           sync.Mutex          // Thread safety
}

// Thread-safe message broadcasting
func (h *Hub) Run() {
    for {
        select {
        case client := <-h.register:
            h.mu.Lock()
            h.clients[client] = true
            h.mu.Unlock()
        
        case message := <-h.broadcast:
            h.mu.Lock()
            for client := range h.clients {
                client.send <- message
            }
            h.mu.Unlock()
        }
    }
}
```

### **Message Protocol**
```json
{
  "type": "ROOM_UPDATE",
  "payload": {
    "room_id": 1,
    "status": "OCCUPIED",
    "timestamp": "2025-02-16T10:30:00Z"
  }
}
```

---

## 🗄️ Database Architecture

### **Schema Design (PostgreSQL)**

**Key Tables:**
- `guests` - Guest information with check-in/out dates
- `rooms` - Room inventory with status tracking
- `staff` - Staff profiles with roles
- `laundry_requests` - Laundry service requests
- `laundry_request_items` - Item-level tracking
- `menu_items` - Restaurant menu (soft delete)
- `housekeeping_tasks` - Cleaning assignments
- `invoices` - Financial billing records
- `documents` - Invoice documents

**Key Features:**
- **Soft Deletes**: `deleted_at` timestamp for archival
- **Timestamps**: `created_at`, `updated_at` for audit trails
- **Foreign Keys**: Relational integrity
- **Indexes**: Performance optimization
- **Migrations**: Version-controlled schema evolution

---

## 💡 Design Patterns & Principles Used

### **Structural Patterns**
| Pattern | Location | Purpose |
|---------|----------|---------|
| **Adapter** | `repository/` | Database operations abstraction |
| **Decorator** | `middleware/` | Request processing enhancement |
| **Composition** | `invoice/service.go` | Service collaboration |
| **Facade** | `rest/handlers/` | Simplified service interface |

### **Behavioral Patterns**
| Pattern | Location | Purpose |
|---------|----------|---------|
| **Strategy** | `port.go` files | Interface-based behavior |
| **Observer** | `ws/hub.go` | Real-time notifications |
| **Command** | REST endpoints | Encapsulated requests |
| **Factory** | `NewService` constructors | Object creation |

### **Principles**
| Principle | Implementation |
|-----------|---|
| **SOLID - S** (Single Responsibility) | Each service handles one domain |
| **SOLID - O** (Open/Closed) | Services open for extension via interfaces |
| **SOLID - L** (Liskov Substitution) | Repositories interchangeable |
| **SOLID - I** (Interface Segregation) | Small, focused interfaces |
| **SOLID - D** (Dependency Inversion) | Depend on abstractions (interfaces) |
| **DRY** (Don't Repeat Yourself) | Shared utilities, reusable components |
| **KISS** (Keep It Simple) | Clear, readable code structure |

---

## 🎓 Software Engineering Skills Demonstrated

### **Backend (Go)**
- ✅ Clean Architecture & Hexagonal Design
- ✅ Domain-Driven Design (DDD)
- ✅ Dependency Injection (Constructor-based)
- ✅ Interface-based design (Loose coupling)
- ✅ Repository Pattern (Data abstraction)
- ✅ Service Layer Pattern
- ✅ Middleware Pattern & Pipeline
- ✅ Goroutines & Concurrency (WebSocket hub)
- ✅ Thread-safe operations (sync.Mutex)
- ✅ Custom JWT implementation
- ✅ Database migration management
- ✅ Error handling & validation
- ✅ RESTful API design
- ✅ Real-time bidirectional communication (WebSocket)
- ✅ Integration with external APIs (OpenAI)

### **Frontend (React + TypeScript)**
- ✅ Component-based architecture
- ✅ React Hooks (useState, useEffect, useContext)
- ✅ Context API for global state management
- ✅ TypeScript type safety
- ✅ Responsive design (Tailwind CSS)
- ✅ React Router for navigation
- ✅ Axios for HTTP communication
- ✅ Protected routes & authorization
- ✅ JWT token management
- ✅ Role-based UI rendering
- ✅ Form handling & validation
- ✅ Error boundaries & error handling
- ✅ Flexible animation (Framer Motion)
- ✅ Modern CSS (Tailwind utilities)

### **Architecture & DevOps**
- ✅ System design (full-stack application)
- ✅ Microservices principles (module-based)
- ✅ Configuration management
- ✅ Environment separation (.env)
- ✅ Database schema & migrations
- ✅ Authentication & authorization flow
- ✅ Role-based access control (RBAC)
- ✅ Security best practices

### **DevOps & CI/CD**
- ✅ Version control (Git)
- ✅ CI/CD pipelines
- ✅ Build automation
- ✅ Testing frameworks
- ✅ Code quality standards
- ✅ Documentation

---

## 🚀 Key Technical Achievements

### **1. Modular Architecture**
- 8 independent service modules
- Each module: `port.go` (interface) + `service.go` (logic)
- Clear separation of concerns
- High cohesion, low coupling

### **2. Complete CRUD Operations**
- All modules support Create, Read, Update, Delete
- Consistent error handling
- Data validation at service layer

### **3. Complex Business Logic**
- **Invoice Service**: Aggregates charges from multiple services
- **Housekeeping Service**: Real-time WebSocket integration
- **Authentication**: Custom JWT with claims
- **Authorization**: Role-based access control

### **4. Real-Time Features**
- WebSocket hub for staff notifications
- Thread-safe message broadcasting
- Live room status updates
- Scalable client connection management

### **5. Data Persistence**
- 11 database migrations
- Schema versioning
- Soft delete implementation
- Relational integrity with foreign keys

### **6. API Integration**
- OpenAI API for RAG capabilities
- External service consumption
- Error handling for external failures

---

## 📊 API Endpoints Overview

### **Guest Module**
```
POST   /api/guests/register     → Create guest account
POST   /api/guests/login        → Authenticate guest
GET    /api/guests/:id          → Get guest info
GET    /api/guests/dashboard    → Guest dashboard data
```

### **Room Module**
```
GET    /api/rooms              → List all rooms
GET    /api/rooms/:id          → Get room details
GET    /api/rooms?status=...   → Filter by status
POST   /api/rooms              → Create room
PUT    /api/rooms/:id          → Update room
DELETE /api/rooms/:id          → Delete room
```

### **Staff Module**
```
POST   /api/staff/login        → Staff authentication
GET    /api/staff/:id          → Get staff profile
POST   /api/staff              → Create staff
PUT    /api/staff/:id          → Update staff
```

### **Laundry Module**
```
POST   /api/laundry            → Create request
GET    /api/laundry/:id        → Get request details
PUT    /api/laundry/:id        → Update status
GET    /api/laundry/guest/:gid → Get guest requests
```

### **Invoice Module**
```
POST   /api/invoices           → Generate invoice
GET    /api/invoices/:id       → Get invoice
GET    /api/invoices/guest/:gid→ Get guest invoices
POST   /api/invoices/preview   → Preview before creation
```

### **Housekeeping Module**
```
POST   /api/housekeeping       → Create task
GET    /api/housekeeping/:id   → Get task
PUT    /api/housekeeping/:id   → Update task
GET    /api/housekeeping/staff/:sid → Get staff tasks
WS     /ws/housekeeping       → WebSocket connection
```

### **Restaurant Module**
```
GET    /api/restaurant/menu    → Get menu items
POST   /api/restaurant/menu    → Add menu item
PUT    /api/restaurant/menu/:id → Update item
DELETE /api/restaurant/menu/:id → Delete item (soft)
POST   /api/restaurant/orders  → Place order
```

---

## 🔄 Request-Response Lifecycle

### **Typical Request Flow**

```
1. CLIENT REQUEST
   │
   ├→ GET /api/rooms/101
   └→ Header: Authorization: Bearer {JWT}

2. SERVER - MIDDLEWARE CHAIN
   ├→ CORS Middleware
   │  └→ Validate origin
   │
   ├→ JWT Auth Middleware
   │  ├→ Extract token
   │  ├→ Verify signature
   │  └→ Validate claims
   │
   └→ Request forwarded

3. SERVER - HANDLER LAYER
   ├→ roomHandler.GetRoom(roomNumber)
   │  └→ Delegates to service

4. SERVICE LAYER
   ├→ roomService.Find(roomNumber)
   │  └→ Validates business logic
   │  └→ Delegates to repository

5. REPOSITORY LAYER
   ├→ roomRepo.Find(roomNumber)
   │  ├→ Executes SQL query
   │  ├→ Parse database result
   │  └→ Return domain object

6. SERVICE (continued)
   ├→ Receive room from repository
   ├→ Apply business rules
   └→ Return result

7. HANDLER (continued)
   ├→ Format response
   ├→ Set HTTP status
   └→ Serialize to JSON

8. CLIENT RESPONSE
   └→ HTTP 200 + Room JSON
```

---

## 🎯 Loose Coupling Implementation

### **Example: Invoice Service**

**Without DI (Tightly Coupled):**
```go
type InvoiceService struct{}

func (s *InvoiceService) Generate() {
    db := connection.GetDB()  // Global dependency
    room := db.FindRoom()     // Direct DB access
    guest := db.FindGuest()   // Direct DB access
}
// Problems: Hard to test, can't swap database, global state
```

**With DI (Loosely Coupled):**
```go
type InvoiceService struct {
    invoiceRepo repository.InvoiceRepo   // Interface
    guestSvc    guest.Service            // Interface
    roomSvc     room.Service             // Interface
    laundrySvc  laundry.Service          // Interface
}

func NewService(
    invoiceRepo repository.InvoiceRepo,
    guestSvc guest.Service,
    roomSvc room.Service,
    laundrySvc laundry.Service,
) *InvoiceService {
    return &InvoiceService{
        invoiceRepo: invoiceRepo,
        guestSvc:    guestSvc,
        roomSvc:     roomSvc,
        laundrySvc:  laundrySvc,
    }
}

func (s *InvoiceService) Generate(guestID int) {
    guest := s.guestSvc.Get(guestID)      // Service call
    room := s.roomSvc.Find(guest.Room)    // Service call
    laundry := s.laundrySvc.GetCharges()  // Service call
}
// Benefits: Testable with mocks, can swap implementations, no global state
```

---

## 📈 Scalability & Extensibility

### **Adding a New Module (e.g., Payment Service)**

**Step 1: Create Domain Model**
```go
// domain/payment.go
type Payment struct {
    ID     int
    Amount float64
    Status string
}
```

**Step 2: Create Port & Service**
```go
// payment/port.go
type Service interface {
    ProcessPayment(amount float64, method string) error
}

// payment/service.go
type service struct {
    paymentRepo PaymentRepo
}
```

**Step 3: Create Repository**
```go
// repository/payment.go
type PaymentRepo interface {
    Save(payment domain.Payment) error
}
```

**Step 4: Create Handler**
```go
// rest/handlers/payment/handler.go
type Handler struct {
    svc payment.Service
}
```

**Step 5: Inject & Register**
```go
// In serve.go
paymentSvc := payment.NewService(paymentRepo)
paymentHandler := paymenthandler.NewHandler(paymentSvc)
server.RegisterPaymentRoutes(paymentHandler)
```

**Benefits:**
- ✅ Existing modules unchanged
- ✅ New module follows same pattern
- ✅ Easy to test independently
- ✅ Can be deployed separately

---

## 🧪 Testability

### **Testing Example (Mock Repository)**

```go
// In test file
type MockRoomRepo struct{}

func (m *MockRoomRepo) Find(roomNumber string) (*domain.Room, error) {
    return &domain.Room{
        ID:     1,
        RoomNumber: roomNumber,
        Status: domain.RoomStatusVacant,
    }, nil
}

// Test the service without database
func TestRoomService_Find(t *testing.T) {
    mockRepo := &MockRoomRepo{}
    service := room.NewService(mockRepo)
    
    room, err := service.Find("101")
    
    if err != nil {
        t.Fatalf("Expected no error, got %v", err)
    }
    if room == nil {
        t.Fatal("Expected room, got nil")
    }
}
```

---

## 📚 Documentation & Code Quality

- ✅ Clear module organization
- ✅ Consistent naming conventions
- ✅ Interface-based contracts
- ✅ Type safety (Go types + TypeScript)
- ✅ Error handling throughout
- ✅ Configuration management
- ✅ Migration version control
- ✅ README files in each module
- ✅ Contributing guidelines
- ✅ Security policy

---

## 🎓 Learning Value

This project demonstrates:

1. **Enterprise Architecture Patterns**
   - Real application of DDD
   - Hexagonal/Clean Architecture
   - Microservices principles
   - API gateway pattern

2. **Go Proficiency**
   - Goroutines and concurrency
   - Interface-based design
   - Package organization
   - Database connectivity

3. **React Mastery**
   - Hook patterns
   - Context API
   - Component composition
   - State management

4. **Database Design**
   - Relational modeling
   - Schema versioning
   - Performance considerations
   - Data integrity

5. **API Design**
   - RESTful principles
   - Status codes
   - Error handling
   - Versioning strategies

6. **Security Practices**
   - Authentication implementation
   - Authorization enforcement
   - Token management
   - CORS handling

7. **DevOps Awareness**
   - Environment management
   - Configuration handling
   - Database migrations
   - Deployment readiness

---

## 🎉 Summary

**Oasis Hotel Management System** is a sophisticated, production-ready application that demonstrates:

✅ **Professional Architecture** - Hexagonal design, DDD, clean code  
✅ **Scalable Design** - Modular, loosely coupled, extensible  
✅ **Security First** - JWT auth, RBAC, protected routes  
✅ **Real-Time Capabilities** - WebSocket integration  
✅ **Database Excellence** - Migrations, relationships, soft deletes  
✅ **API Excellence** - RESTful design, error handling  
✅ **Code Quality** - SOLID principles, testability, type safety  
✅ **User Experience** - Responsive design, multiple roles  
✅ **Documentation** - Clear structure, readable code  

**This project clearly demonstrates advanced software engineering skills and architectural expertise.**

---

**Last Updated:** February 16, 2026
**Project Version:** 1.0.0
**License:** MIT
