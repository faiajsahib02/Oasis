# Oasis - Hotel Management System

A production-grade, full-stack hotel management system demonstrating professional software architecture, design patterns, and enterprise-level development practices. Built with **Go** (Hexagonal/Clean Architecture) and **React** with **TypeScript**, featuring real-time WebSocket updates, role-based access control, and complete hotel operations management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Go Version](https://img.shields.io/badge/Go-1.22-00ADD8?logo=go)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript)
![Architecture](https://img.shields.io/badge/Architecture-Hexagonal-purple)
![Design Pattern](https://img.shields.io/badge/Pattern-DDD-blue)
![Code Quality](https://img.shields.io/badge/code%20quality-A-brightgreen)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture & Design Patterns](#architecture--design-patterns)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Architectural Principles](#key-architectural-principles)
- [Getting Started](#getting-started)
- [Module Breakdown](#module-breakdown)
- [API Documentation](#api-documentation)
- [Design Patterns Used](#design-patterns-used)
- [Security & Authentication](#security--authentication)
- [Skills & Expertise Demonstrated](#skills--expertise-demonstrated)
- [Quality & Standards](#quality--standards)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

Oasis is a **production-grade hotel management system** showcasing professional software architecture and enterprise-level development practices. It demonstrates expertise in **Domain-Driven Design (DDD)**, **Hexagonal Architecture**, **Dependency Injection**, and **SOLID principles** with a complete full-stack implementation.

**Key Highlights:**
- ✅ **Hexagonal Architecture** with clear separation of concerns
- ✅ **Domain-Driven Design** (DDD) with 8 bounded contexts
- ✅ **Dependency Injection** for loose coupling and testability
- ✅ **Real-time WebSocket** communication for live updates
- ✅ **JWT-based authentication** with role-based access control (RBAC)
- ✅ **Repository Pattern** for database abstraction
- ✅ **RESTful API** with comprehensive error handling
- ✅ **Professional code organization** following best practices
- ✅ **Full-stack implementation** (Go + React + PostgreSQL)

## 🏗️ Architecture & Design Patterns

### System Architecture

```
┌─────────────────────────────────────────┐
│   FRONTEND (React + TypeScript)         │
│   ├─ Components & Pages                 │
│   ├─ Context API (Auth State)           │
│   ├─ Protected Routes (RBAC)            │
│   └─ Axios HTTP Client                  │
└──────────────┬──────────────────────────┘
               │ HTTP/WebSocket
┌──────────────▼──────────────────────────┐
│   API SERVER (Go)                       │
│   ├─ REST Handlers                      │
│   ├─ Middleware Pipeline (Auth/CORS)    │
│   └─ WebSocket Hub (Real-time)          │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   SERVICE LAYER (Business Logic - DDD)  │
│   ├─ Guest Service                      │
│   ├─ Room Service                       │
│   ├─ Staff Service                      │
│   ├─ Laundry Service                    │
│   ├─ Restaurant Service                 │
│   ├─ Housekeeping Service               │
│   ├─ Invoice Service (Composition)      │
│   └─ RAG Service (AI)                   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   REPOSITORY LAYER (Data Abstraction)   │
│   ├─ Repository Interfaces              │
│   └─ Database Implementations           │
└──────────────┬──────────────────────────┘
               │ SQL (sqlx)
┌──────────────▼──────────────────────────┐
│   DATABASE (PostgreSQL)                 │
│   ├─ 10+ Tables with Relationships      │
│   ├─ 11 Migrations (Version Controlled) │
│   └─ Soft Deletes & Audit Trail         │
└─────────────────────────────────────────┘
```

### Design Patterns Applied

| Pattern | Usage | Benefit |
|---------|-------|---------|
| **Hexagonal Architecture** | Core isolated from frameworks | Framework-agnostic business logic |
| **Domain-Driven Design** | 8 bounded contexts (modules) | Clear business domain modeling |
| **Ports & Adapters** | Interfaces + Implementations | Interchangeable components |
| **Dependency Injection** | Constructor-based throughout | Loose coupling, testable code |
| **Repository Pattern** | Data abstraction layer | Database-agnostic services |
| **Service Composition** | Invoice using multiple services | Complex business logic aggregation |
| **Middleware Pipeline** | Request processing layers | Cross-cutting concerns (Auth/CORS) |
| **Observer Pattern** | WebSocket hub broadcasting | Real-time notifications |
| **Factory Pattern** | `NewService()` constructors | Standard object creation |

### SOLID Principles Demonstrated

- ✅ **Single Responsibility** - Each service handles one domain
- ✅ **Open/Closed** - Services extensible via interfaces
- ✅ **Liskov Substitution** - Repositories interchangeable
- ✅ **Interface Segregation** - Small, focused interfaces
- ✅ **Dependency Inversion** - Depend on abstractions (interfaces)

## ✨ Features

### 🛎️ Guest Management
- Guest registration and check-in/check-out
- Profile management
- Booking history and current stay information
- Secure authentication system

### 🏠 Room Management
- Room availability tracking
- Room type categorization
- Real-time room status updates
- Occupancy management

### 🧹 Housekeeping
- Task assignment and tracking
- Real-time status updates
- Issue reporting system
- Cleaning schedule management

### 🧺 Laundry Services
- Laundry request creation
- Item tracking
- Status management
- Service request history

### 🍽️ Restaurant Operations
- Menu management
- Order processing
- Soft-delete functionality for menu items
- Guest ordering system

### 👔 Staff Management
- Staff profiles and roles
- Task assignment
- Performance tracking

### 💰 Invoice Management
- Automated invoice generation
- Service charge tracking
- Payment processing
- Invoice history

## 🛠️ Tech Stack

### Backend (Go 1.22)
| Technology | Purpose | Key Features |
|-----------|---------|---|
| **Go 1.22** | Language | Type-safe, concurrent, high-performance |
| **Gorilla Mux** | HTTP Routing | Clean URL patterns, RESTful design |
| **Gorilla WebSocket** | Real-time Communication | Bidirectional WebSocket connections |
| **sqlx** | Database Driver | Type-safe SQL with structured scanning |
| **sql-migrate** | Schema Versioning | Version-controlled database migrations |
| **godotenv** | Configuration | Environment variable management |
| **Custom JWT** | Authentication | HMAC-SHA256 token generation & verification |

### Frontend (React 18.3)
| Technology | Purpose | Key Features |
|-----------|---------|---|
| **React 18.3** | UI Framework | Component-based, hooks, virtual DOM |
| **TypeScript 5.2** | Language | Type safety, better IDE support |
| **Vite 5.0** | Build Tool | Lightning-fast bundling & HMR |
| **Tailwind CSS 3.3** | Styling | Utility-first, responsive design |
| **React Router 6.20** | Navigation | Client-side routing, protected routes |
| **Axios** | HTTP Client | Promise-based API communication |
| **Framer Motion** | Animations | Smooth, performant animations |
| **Lucide React** | Icon Library | Modern SVG icons |
| **Context API** | State Management | Global state (authentication) |

### Database
| Technology | Purpose | Features |
|-----------|---------|---|
| **PostgreSQL 14+** | Database | ACID compliance, relational integrity |
| **sqlx** | Access Layer | Type-safe SQL queries |
| **sql-migrate** | Migrations | 11 migrations for schema versioning |

### Architecture & Principles
- **Pattern:** Hexagonal Architecture (Ports & Adapters)
- **Design:** Domain-Driven Design (DDD)
- **Coupling:** Loose coupling via interfaces
- **Testing:** Designed for unit testing with mocks
- **Code Quality:** SOLID principles applied throughout

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Guest UI   │  │  Staff UI    │  │  Admin UI    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                     REST API (Go)                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Middleware Layer                           │  │
│  │  • CORS  • JWT Authentication  • Authorization       │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Handler Layer (Routes)                     │  │
│  │  Guest | Room | Housekeeping | Laundry | Restaurant  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Service Layer (Business Logic)                │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Repository Layer (Data Access)                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                        │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Go 1.22 or higher
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/oasis.git
   cd oasis/Backend
   ```

2. **Install dependencies**
   ```bash
   go mod download
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the Backend directory:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=oasis
   JWT_SECRET=your_jwt_secret_key
   PORT=8080
   ```

4. **Run database migrations**
   ```bash
   go run main.go migrate
   ```

5. **Start the server**
   ```bash
   go run main.go
   ```

   The API will be available at `http://localhost:8080`

### Frontend Setup

1. **Navigate to Frontend directory**
   ```bash
   cd ../Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the Frontend directory:
   ```env
   VITE_API_URL=http://localhost:8080
   VITE_WS_URL=ws://localhost:8080/ws
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
Oasis/
├── Backend/                          # Go Backend
│   ├── main.go                       # Entry point
│   ├── go.mod                        # Dependency management
│   │
│   ├── cmd/serve.go                  # Application initialization & DI
│   ├── config/config.go              # Configuration management
│   │
│   ├── domain/                       # Domain Layer (DDD)
│   │   ├── guest.go, room.go, staff.go, laundry.go
│   │   ├── restaurant.go, housekeeping.go, invoice.go
│   │   └── [Pure business entities]
│   │
│   ├── {module}/                     # Service Modules (8 modules)
│   │   ├── port.go                   # Service interface (What it does)
│   │   └── service.go                # Service implementation
│   │   
│   │   Modules: guest/, room/, staff/, laundry/, restaurant/,
│   │            housekeeping/, invoice/, rag/
│   │
│   ├── repository/                   # Data Access Layer
│   │   └── [module].go               # Repository implementations
│   │
│   ├── rest/                         # REST API Layer
│   │   ├── server.go                 # Server setup
│   │   ├── handlers/                 # HTTP handlers (by module)
│   │   └── middlewares/              # Middleware (Auth, CORS, etc.)
│   │
│   ├── infra/db/                     # Infrastructure
│   │   ├── connection.go             # Database connection
│   │   └── migrate.go                # Migration runner
│   │
│   ├── migrations/                   # SQL Migrations (11 files)
│   ├── ws/                           # WebSocket Module
│   │   ├── hub.go                    # Message hub (real-time)
│   │   └── client.go                 # WebSocket client
│   │
│   └── util/                         # Utilities
│       ├── create_jwt.go             # JWT generation
│       ├── jwt_parser.go             # JWT parsing
│       └── send_data.go              # Response formatting
│
├── Frontend/                         # React + TypeScript Frontend
│   ├── package.json                  # Dependencies
│   ├── tsconfig.json                 # TypeScript config
│   ├── vite.config.ts                # Vite config
│   ├── tailwind.config.js            # Tailwind CSS config
│   │
│   └── src/
│       ├── main.tsx                  # Application entry
│       ├── App.tsx                   # Root component
│       │
│       ├── context/
│       │   └── AuthContext.tsx       # Global auth state
│       │
│       ├── pages/                    # Page components
│       │   ├── HomePage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── RoomsPage.tsx
│       │   ├── GuestDashboardPage.tsx
│       │   ├── guest/, staff/, admin/ # Role-specific pages
│       │   └── ...
│       │
│       ├── components/               # Reusable components
│       │   ├── Button.tsx
│       │   ├── Card.tsx
│       │   ├── GuestNavbar.tsx
│       │   ├── StaffNavbar.tsx
│       │   ├── ProtectedRoute.tsx
│       │   └── ...
│       │
│       ├── layouts/                  # Layout components
│       │   ├── GuestLayout.tsx
│       │   ├── StaffLayout.tsx
│       │   └── PublicLayout.tsx
│       │
│       ├── services/
│       │   └── api.ts                # Axios instance & API calls
│       │
│       ├── types/
│       │   └── index.ts              # TypeScript interfaces
│       │
│       └── utils/                    # Helper functions
│
└── Documentation/
    ├── README.md (this file)
    ├── QUICK_REFERENCE.md            # Architecture quick reference
    ├── PROJECT_OVERVIEW.md           # Comprehensive project guide
    ├── ARCHITECTURE_DEEP_DIVE.md     # Pattern explanations
    ├── SKILLS_SHOWCASE.md            # Career & interview guide
    ├── EXECUTIVE_SUMMARY.md          # One-page summary
    └── DOCUMENTATION_INDEX.md        # Navigation guide
```

## � Module Breakdown

### Core Service Modules (DDD Bounded Contexts)

Each module follows the same pattern: `port.go` (interface) + `service.go` (implementation)

| Module | Features | Pattern | Real-Time |
|--------|----------|---------|-----------|
| **Guest** | Account creation, authentication, profiles | DDD + DI | No |
| **Room** | Inventory, status tracking (VACANT/OCCUPIED/CLEANING) | DDD + Repository | No |
| **Staff** | User profiles, role management, RBAC | DDD + JWT | No |
| **Laundry** | Request management, item tracking, status | DDD + Aggregates | Yes |
| **Restaurant** | Menu management, orders, soft deletes | DDD + Repository | No |
| **Housekeeping** | Task assignment, tracking, scheduling | DDD + WebSocket | Yes |
| **Invoice** | Bill generation, multi-service aggregation | Service Composition | No |
| **RAG** | AI-powered retrieval, OpenAI integration | External API | Yes |

### Module Pattern Example

```go
// port.go - Interface definition (What the module can do)
package guest
type Service interface {
    Find(roomNumber, phoneNumber string) (*domain.Guest, error)
    Create(guest domain.Guest) (*domain.Guest, error)
    Get(id int) (*domain.Guest, error)
}

// service.go - Implementation (How it does it)
type service struct {
    gstRepo GuestRepo  // Injected dependency
}
func NewService(gstRepo GuestRepo) *service {
    return &service{gstRepo: gstRepo}
}
func (svc *service) Find(roomNumber, phoneNumber string) (*domain.Guest, error) {
    return svc.gstRepo.Find(roomNumber, phoneNumber)
}

// Injected in cmd/serve.go
guestRepo := repository.NewGuestRepo(dbCon)
guestSvc := guest.NewService(guestRepo)
guestHandler := guesthandler.NewHandler(guestSvc)
```

## 🎯 Design Patterns Used

### Architectural Patterns

| Pattern | Implementation | Benefits |
|---------|---|---|
| **Hexagonal (Ports & Adapters)** | Interface-based service abstraction | Core logic isolated from frameworks |
| **Repository Pattern** | Data access abstraction | Database-agnostic services, testable |
| **Dependency Injection** | Constructor-based DI | Loose coupling, easy testing |
| **Service Composition** | Invoice service uses multiple services | Complex business logic aggregation |
| **Middleware Pipeline** | Request processing layers | Clean separation of cross-cutting concerns |

### Behavioral Patterns

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Factory** | `NewService`, `NewHandler` | Standard object creation |
| **Adapter** | Repository implementations | Bridge between domain and database |
| **Observer** | WebSocket hub | Real-time event broadcasting |
| **Strategy** | Port interfaces | Interchangeable implementations |

### Key Architectural Principles

**Loose Coupling:**
- Services depend on repository interfaces, not concrete implementations
- Handlers depend on service interfaces
- Zero circular dependencies
- Independently testable modules

**High Cohesion:**
- Each service focuses on one bounded context
- Related logic grouped together
- Clear module boundaries

## 🔐 Security & Authentication

### JWT Implementation

```
1. User Login
   ├─ Provide credentials (Room + Phone OR Staff credentials)
   └─ Server generates JWT token
   
2. Token Structure
   ├─ Header: {alg: "HS256", typ: "JWT"}
   ├─ Payload: {sub: guestID, name, room_number, role}
   └─ Signature: HMAC-SHA256(header.payload, secret)
   
3. Protected Routes
   ├─ Extract token from Authorization header
   ├─ Verify signature with secret key
   ├─ Validate claims (expiration, role)
   └─ Allow request if valid
```

### Role-Based Access Control (RBAC)

```
Guest User
├─ View rooms (GET /api/rooms)
├─ View own profile (GET /api/guests/{id})
├─ Create laundry requests (POST /api/laundry)
└─ View own invoices (GET /api/invoices/guest/{id})

Staff User
├─ View & manage housekeeping tasks
├─ Access staff dashboard
├─ Real-time WebSocket updates
└─ Cannot access guest personal data

Admin User
├─ Full system access
├─ User management
├─ System configuration
└─ Report generation
```

### Security Features

- ✅ **Custom JWT** with HMAC-SHA256 signing
- ✅ **CORS Middleware** for cross-origin protection
- ✅ **Authorization Middleware** for role-based access
- ✅ **Protected Routes** at frontend and backend
- ✅ **Session Management** via JWT claims
- ✅ **Password Verification** on authentication

## 🏆 Skills & Expertise Demonstrated

### Backend Architecture (Go)
✅ Concurrency (Goroutines, channels, syncs.Mutex)  
✅ Interface-based design (loose coupling)  
✅ Dependency injection (constructor-based)  
✅ REST API design (proper HTTP methods, status codes)  
✅ Database design (schema, relationships, migrations)  
✅ Error handling & validation  
✅ Type safety & strong typing  
✅ Real-time systems (WebSocket)  
✅ Custom JWT implementation  
✅ Repository pattern (data abstraction)

### Frontend Development (React + TypeScript)
✅ React Hooks (useState, useEffect, useContext)  
✅ TypeScript (interfaces, types, generics)  
✅ Component composition & reusability  
✅ State management (Context API)  
✅ Protected routes & authentication  
✅ HTTP client integration (Axios)  
✅ Responsive design (Tailwind CSS)  
✅ Modern CSS (utility-first)  
✅ Form handling & validation  

### System Design
✅ Hexagonal Architecture  
✅ Domain-Driven Design (DDD)  
✅ SOLID principles (all 5)  
✅ Design patterns (10+ patterns)  
✅ Scalable architecture  
✅ Testable code design  
✅ Security implementation  
✅ Database architecture  
✅ API design principles  
✅ Production readiness  

## ✅ Quality & Standards

### Professional Standards Met
- ✅ **SOLID Principles** - All 5 principles applied
- ✅ **Clean Code** - Readable, maintainable code
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Configuration Management** - Environment-based config
- ✅ **Database Migrations** - Version-controlled schema
- ✅ **Code Organization** - Logical module structure
- ✅ **Testing Strategy** - Designed for unit testing
- ✅ **Security** - JWT, RBAC, CORS implemented
- ✅ **Documentation** - Comprehensive docs included
- ✅ **Production Readiness** - Deployment ready

## 📚 Documentation

Comprehensive documentation is available for different use cases:

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md) | One-page project overview | 5 min |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Architecture diagrams & quick lookup | 15-20 min |
| [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) | Complete project breakdown | 30-45 min |
| [ARCHITECTURE_DEEP_DIVE.md](ARCHITECTURE_DEEP_DIVE.md) | Pattern explanations with examples | 40-50 min |
| [SKILLS_SHOWCASE.md](SKILLS_SHOWCASE.md) | Interview guide & career positioning | 20-30 min |
| [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) | Documentation navigation & cross-references | 5 min |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute to the project | 10 min |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Community guidelines | 5 min |
| [SECURITY.md](SECURITY.md) | Security policy & vulnerability reporting | 5 min |
| [ROADMAP.md](ROADMAP.md) | Future features & improvements | 10 min |
| [CHANGELOG.md](CHANGELOG.md) | Version history & release notes | 10 min |

### For Different Audiences

**Learning the Codebase:**
- Start: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- Deep: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)
- Advanced: [ARCHITECTURE_DEEP_DIVE.md](ARCHITECTURE_DEEP_DIVE.md)

**Interview Preparation:**
- Start: [SKILLS_SHOWCASE.md](SKILLS_SHOWCASE.md)
- Reference: [ARCHITECTURE_DEEP_DIVE.md](ARCHITECTURE_DEEP_DIVE.md)
- Backup: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)

**Understanding Architecture:**
- Overview: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- Deep: [ARCHITECTURE_DEEP_DIVE.md](ARCHITECTURE_DEEP_DIVE.md)

**Quick Lookup:**
- Use: [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

## 🎯 Key Features Demonstrated

This project showcases:

✅ **Full-Stack Development** - Complete end-to-end application development  
✅ **Clean Architecture** - Hexagonal architecture with clear separation of concerns  
✅ **RESTful API Design** - Well-structured API endpoints with proper HTTP methods  
✅ **Real-time Communication** - WebSocket implementation for live updates  
✅ **Authentication & Authorization** - JWT-based secure access control  
✅ **Database Design** - Relational database with migrations and transactions  
✅ **Modern Frontend** - React with TypeScript, Tailwind CSS, and modern patterns  
✅ **State Management** - Context API for global state  
✅ **Responsive Design** - Mobile-friendly UI  
✅ **Error Handling** - Comprehensive error handling on both frontend and backend  
✅ **Code Organization** - Modular, maintainable codebase  
✅ **CI/CD Automation** - GitHub Actions for testing and building  
✅ **Professional Documentation** - Comprehensive guides and references  

## 🚀 Quick Start

Get up and running in minutes:

```bash
# Clone the repository
git clone https://github.com/yourusername/oasis.git
cd oasis

# Backend setup
cd Backend
go mod download
# Set up .env file with database credentials
go run main.go migrate
go run main.go

# Frontend setup (new terminal)
cd Frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to access the application.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Read the [Contributing Guide](CONTRIBUTING.md)
2. Review the [Code of Conduct](CODE_OF_CONDUCT.md)
3. Fork the project
4. Create your feature branch (`git checkout -b feature/AmazingFeature`)
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

See our [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md) for details.

## 🐛 Reporting Issues

Found a bug? Please use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md).

Have a feature request? Use our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**

- LinkedIn: https://www.linkedin.com/in/faiaj-sahib-42a0262b0
- GitHub: https://github.com/faiajsahib02
- Email: faiajsahib02@gmail.com

## 🔗 Additional Resources

### Project Links
- [Main README](README.md)
- [Roadmap](ROADMAP.md)
- [Changelog](CHANGELOG.md)
- [Security Policy](SECURITY.md)

### External Resources
- [Go Documentation](https://golang.org/doc/)
- [React Documentation](https://react.dev/)
- [Hexagonal Architecture Guide](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Code Best Practices](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)

## 🙏 Acknowledgments

- Built as a demonstration of full-stack development capabilities
- Inspired by real-world hotel management requirements
- Uses modern best practices and design patterns
- Thanks to the Go and React communities
- Special thanks to all contributors and supporters

## ⭐ Support

If you find this project useful, please consider:

- Giving it a star ⭐
- Sharing it with others
- Contributing to the project
- Reporting issues and suggesting improvements

---

**Made with ❤️ using Go + React**

⭐ If you find this project useful, please consider giving it a star!

