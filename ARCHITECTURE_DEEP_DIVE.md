# 🏛️ Architectural Deep Dive - Design Patterns & Principles

## 📚 Table of Contents
1. [Hexagonal Architecture](#hexagonal-architecture)
2. [Dependency Injection](#dependency-injection)
3. [Domain-Driven Design](#domain-driven-design)
4. [Service-Port Pattern](#service-port-pattern)
5. [Repository Pattern](#repository-pattern)
6. [Loose Coupling Implementation](#loose-coupling-implementation)
7. [Real-World Examples](#real-world-examples)
8. [Anti-Patterns Avoided](#anti-patterns-avoided)

---

## Hexagonal Architecture

### What It Is
Hexagonal Architecture (also called Ports & Adapters) creates a boundary between your core business logic and external systems. The "hexagon" represents your isolated domain logic, with "ports" as interfaces and "adapters" as implementations.

### Visual Structure
```
┌─────────────────────────────────────────────────┐
│                  EXTERNAL WORLD                  │
│  (HTTP, Database, External APIs, UI Events)     │
└────────────────────────────────────────────────┬┘
                                                  │
                    ADAPTER
                 (Translator)
                      │
                      ▼
       ┌──────────────────────────────┐
       │      PORT (Interface)        │
       │  "What can I do?"            │
       │  Service interface contract  │
       └──────────────────────────────┘
                      │
         ┌────────────┴─────────────┐
         │                          │
         ▼                          ▼
    ┌─────────────────┐     ┌──────────────────┐
    │   SERVICE       │     │  REPOSITORY      │
    │   (Business     │     │  (Data Access)   │
    │    Logic)       │     │                  │
    └─────────────────┘     └──────────────────┘
```

### In Oasis
```go
// PORT: Repository Interface (External Contract)
// repository/room.go - Defines what we expect
type RoomRepo interface {
    Create(room domain.Room) (*domain.Room, error)
    Find(roomNumber string) (*domain.Room, error)
    FindByID(id string) (*domain.Room, error)
    GetAll(status string) ([]domain.Room, error)
}

// ADAPTER: HTTP Handler (Inbound Adapter)
// rest/handlers/room/handler.go
type Handler struct {
    svc room.Service
}

func (h *Handler) GetRoom(w http.ResponseWriter, r *http.Request) {
    // Translate HTTP request to service call
    roomNumber := r.URL.Query().Get("number")
    room, err := h.svc.Find(roomNumber)
    // Translate response back to HTTP
    json.NewEncoder(w).Encode(room)
}

// ADAPTER: Repository Implementation (Outbound Adapter)
// repository/room.go
type roomRepo struct {
    db *sqlx.DB
}

func (r *roomRepo) Find(roomNumber string) (*domain.Room, error) {
    // Translate service request to SQL
    query := `SELECT * FROM rooms WHERE room_number = $1`
    // Execute and translate result
}
```

### Benefits
✅ Core logic isolated from frameworks  
✅ Easy to test (mock adapters)  
✅ Can swap database (PostgreSQL → MongoDB)  
✅ Can change UI (REST → GraphQL)  
✅ Framework-agnostic domain logic  

---

## Dependency Injection

### Core Concept
Instead of a module creating its own dependencies, they are passed in from outside (injected).

### Without Dependency Injection (🔴 Bad)
```go
// Tightly coupled - hard to test or modify
type RoomService struct{}

func (s *RoomService) Find(roomNumber string) (*room.Room, error) {
    // Creating its own dependency
    db, err := sql.Open("postgres", conString)
    
    query := `SELECT * FROM rooms WHERE room_number = $1`
    var room Room
    err = db.QueryRow(query, roomNumber).Scan(&room)
    return &room, err
}

// Problems:
// 1. Can't test without actual database
// 2. Hard-coded database connection
// 3. Can't swap to different database
// 4. Service creates global state
```

### With Constructor-based Dependency Injection (✅ Good)
```go
// Loosely coupled - easy to test and modify
type RoomService struct {
    repo RoomRepository  // Injected, not created
}

// Constructor accepts dependencies
func NewRoomService(repo RoomRepository) *RoomService {
    return &RoomService{
        repo: repo,
    }
}

func (s *RoomService) Find(roomNumber string) (*Room, error) {
    // Uses injected dependency
    return s.repo.Find(roomNumber)
}

// Usage:
// Production
realDB := connectToDatabase()
realRepo := NewRoomRepository(realDB)
service := NewRoomService(realRepo)

// Testing
mockRepo := &MockRoomRepository{}
service := NewRoomService(mockRepo)
service.Find("101") // Works with mock!
```

### Oasis Example: Invoice Service Composition
```go
// Injecting multiple services for composition
type invoiceService struct {
    invoiceRepo      InvoiceRepository    // Data access
    guestSvc         guest.Service        // Guest logic
    roomSvc          room.Service         // Room logic
    laundrySvc       laundry.Service      // Laundry logic
    restaurantSvc    restaurant.Service   // Restaurant logic
}

func NewService(
    invoiceRepo InvoiceRepository,
    guestSvc guest.Service,
    roomSvc room.Service,
    laundrySvc laundry.Service,
    restaurantSvc restaurant.Service,
) *invoiceService {
    return &invoiceService{
        invoiceRepo:      invoiceRepo,
        guestSvc:         guestSvc,
        roomSvc:          roomSvc,
        laundrySvc:       laundrySvc,
        restaurantSvc:    restaurantSvc,
    }
}

// Complex operation using injected services
func (s *invoiceService) Generate(guestID int) (*Invoice, error) {
    // Each service called through interface
    guest := s.guestSvc.Get(guestID)
    roomCharge := s.roomSvc.GetCharge(guest.RoomID)
    laundryCharge := s.laundrySvc.GetCharges(guestID)
    restaurantCharge := s.restaurantSvc.GetCharges(guestID)
    
    invoice := &Invoice{
        GuestID:          guestID,
        RoomCharge:       roomCharge,
        LaundryCharge:    laundryCharge,
        RestaurantCharge: restaurantCharge,
        TotalAmount:      roomCharge + laundryCharge + restaurantCharge,
    }
    
    return s.invoiceRepo.Create(invoice)
}
```

### Where Injection Happens (serve.go)
```go
// Step 1: Create repositories (data layer)
guestRepo := repository.NewGuestRepo(dbConnection)
roomRepo := repository.NewRoomRepo(dbConnection)
laundryRepo := repository.NewLaundryRepo(dbConnection)
invoiceRepo := repository.NewInvoiceRepo(dbConnection)

// Step 2: Create services with injected repositories
guestSvc := guest.NewService(guestRepo)
roomSvc := room.NewService(roomRepo)
laundrySvc := laundry.NewService(laundryRepo)

// Step 3: Create complex service with service composition
invoiceSvc := invoice.NewService(
    invoiceRepo,
    guestSvc,       // Injected service
    roomSvc,        // Injected service
    laundrySvc,     // Injected service
    restaurantSvc,
)

// Step 4: Create handler with service
invoiceHandler := invoicehandler.NewHandler(invoiceSvc)

// Step 5: Register handler with server
server.RegisterInvoiceHandler(invoiceHandler)
```

### Benefits
✅ Testable with mocks  
✅ Flexible configuration  
✅ Clear dependencies  
✅ Easy to swap implementations  
✅ No global state  
✅ Follows Dependency Inversion Principle (SOLID-D)  

---

## Domain-Driven Design

### Core Concepts

#### 1. **Domain Entities**
Real-world objects with identity and state changes over time.

```go
// domain/guest.go - Entity with clear identity
type Guest struct {
    ID           int       // Identity
    Name         string
    PhoneNumber  string
    RoomNumber   string
    CheckInDate  time.Time
    CheckOutDate time.Time
    CreatedAt    time.Time
}

// In DDD, this Guest is the AGGREGATE ROOT
// Business rules about guests belong here
```

#### 2. **Value Objects**
Immutable objects that represent a value or characteristic.

```go
// domain/room.go - Value Object for status
type RoomStatus string

const (
    RoomStatusVacant   RoomStatus = "VACANT"
    RoomStatusOccupied RoomStatus = "OCCUPIED"
    RoomStatusCleaning RoomStatus = "CLEANING"
)

// Benefits:
// 1. Type safety (can't pass wrong status)
// 2. Clear meaning
// 3. Encapsulation
```

#### 3. **Bounded Contexts**
Each service module is a bounded context with clear boundaries.

```
GUEST BOUNDED CONTEXT
├─ Domain: Guest, Authentication
├─ Language: "Guest", "Check-in", "Check-out"
├─ Service: Guest module
└─ Repository: GuestRepo

ROOM BOUNDED CONTEXT
├─ Domain: Room, Status
├─ Language: "Room", "Occupancy", "Cleaning"
├─ Service: Room module
└─ Repository: RoomRepo

INVOICE BOUNDED CONTEXT
├─ Domain: Invoice, Charges
├─ Language: "Invoice", "Billing", "Payment"
├─ Service: Invoice module
└─ Repository: InvoiceRepo
```

#### 4. **Ubiquitous Language**
Terms match business language exactly.

```go
// ✅ Good: Uses business language
const (
    RoomStatusVacant   = "VACANT"    // Hotel language
    RoomStatusOccupied = "OCCUPIED"
    RoomStatusCleaning = "CLEANING"
)

// ❌ Bad: Technical language
const (
    RoomStatusAvailable = "AVAILABLE"  // Not how hotel talks
    RoomStatusInUse     = "IN_USE"
)

// The key: Match business terminology
```

#### 5. **Aggregates**
Clusters of objects treated as a single unit.

```go
// Single aggregate: Guest with Check-in/out dates
type Guest struct {
    ID           int       // Root
    Name         string
    CheckInDate  time.Time // Part of aggregate
    CheckOutDate time.Time // Part of aggregate
    RoomNumber   string
}

// Accessed through GuestRepository as single unit
guest, err := guestService.Get(guestID)
// All guest data loaded together

// Complex aggregate: Laundry request with items
type LaundryRequest struct {
    ID        int
    GuestID   int
    Items     []LaundryItem  // Part of aggregate
    Status    string
    CreatedAt time.Time
}

// Boundary: Changes to Request affect Items as unit
```

### DDD in Action at Oasis
```
SERVICE MODULES = BOUNDED CONTEXTS
├─ guest/          (Guest Context)
├─ room/           (Room Context)
├─ staff/          (Staff Context)
├─ laundry/        (Laundry Context)
├─ restaurant/     (Restaurant Context)
├─ housekeeping/   (Housekeeping Context)
├─ invoice/        (Billing Context)
└─ rag/            (AI Context)

Each module:
1. Has its own domain entities
2. Uses its own service logic
3. Implements its own repository
4. Speaks its own language
5. Has clear boundaries
```

---

## Service-Port Pattern

### The Pattern
```
┌─────────────────────────────────────┐
│  port.go (What can I do?)           │
│  Defines Service Interface          │
└──────────────┬──────────────────────┘
               │ Implementation
               ▼
┌─────────────────────────────────────┐
│  service.go (How do I do it?)       │
│  Implements Service Logic           │
└──────────────┬──────────────────────┘
               │ Uses
               ▼
┌─────────────────────────────────────┐
│  port.go (Data Contract)            │
│  Repository Interface               │
└──────────────┬──────────────────────┘
               │ Implemented by
               ▼
┌─────────────────────────────────────┐
│  repository/module.go               │
│  Repository Implementation          │
└─────────────────────────────────────┘
```

### Detailed Example: Room Module

#### 1. Port Definition (port.go)
```go
package room

import (
    "oasis/backend/domain"
    roomHandler "oasis/backend/rest/handlers/room"
)

// Service Port: Defines what room service can do
type Service interface {
    roomHandler.Service  // Pulls in handler requirements
}

// Repository Port: Defines data operations needed
type RoomRepo interface {
    Create(room domain.Room) (*domain.Room, error)
    Find(roomNumber string) (*domain.Room, error)
    FindByID(id string) (*domain.Room, error)
    GetAll(status string) ([]domain.Room, error)
}
```

#### 2. Service Implementation (service.go)
```go
package room

import (
    "oasis/backend/domain"
)

// Implementation of Service interface
type service struct {
    rmRepo RoomRepo  // Depends on port, not implementation
}

// Factory function: Dependency injection point
func NewService(rmRepo RoomRepo) *service {
    return &service{
        rmRepo: rmRepo,
    }
}

// Service methods: Implement business logic
func (svc *service) Find(roomNumber string) (*domain.Room, error) {
    // Business logic via injected repository
    rm, err := svc.rmRepo.Find(roomNumber)
    if err != nil {
        return nil, err
    }
    if rm == nil {
        return nil, nil
    }
    return rm, nil
}

func (svc *service) GetAll(status string) ([]domain.Room, error) {
    // Filter by status (business rule)
    return svc.rmRepo.GetAll(status)
}

func (svc *service) Create(room domain.Room) (*domain.Room, error) {
    // Could add validation here (business rule)
    return svc.rmRepo.Create(room)
}
```

#### 3. Repository Implementation
```go
// repository/room.go
package repository

import (
    "oasis/backend/domain"
    "oasis/backend/room"
    "github.com/jmoiron/sqlx"
)

// Implementation of room.RoomRepo port
type roomRepo struct {
    db *sqlx.DB
}

func NewRoomRepo(db *sqlx.DB) room.RoomRepo {
    return &roomRepo{db: db}
}

func (r *roomRepo) Find(roomNumber string) (*domain.Room, error) {
    var rm domain.Room
    query := `SELECT id, room_number, type, status, price FROM rooms WHERE room_number = $1`
    err := r.db.Get(&rm, query, roomNumber)
    if err != nil {
        return nil, err
    }
    return &rm, nil
}

func (r *roomRepo) Create(room domain.Room) (*domain.Room, error) {
    // Insert into database
    query := `INSERT INTO rooms (room_number, type, status, price) VALUES ($1, $2, $3, $4) RETURNING id`
    err := r.db.QueryRow(query, room.RoomNumber, room.Type, room.Status, room.Price).
        Scan(&room.ID)
    if err != nil {
        return nil, err
    }
    return &room, nil
}
```

### Why This Pattern?

| Benefit | How |
|---------|-----|
| **Testability** | Can mock RoomRepo for testing service logic |
| **Flexibility** | Can swap PostgreSQL for MongoDB without changing service |
| **Reusability** | Service used by REST handlers, GraphQL resolvers, gRPC services |
| **Clarity** | Port clearly states what data operations are needed |
| **Decoupling** | Service doesn't know about database implementation |

---

## Repository Pattern

### What It Is
Encapsulates data access logic behind a consistent interface, abstracting away database details.

### Without Repository Pattern (🔴 Tightly Coupled)
```go
// Service directly accesses database (bad)
type RoomService struct {
    db *sqlx.DB
}

func (s *RoomService) Find(roomNumber string) (*Room, error) {
    // Direct database access scattered throughout code
    query := `SELECT * FROM rooms WHERE room_number = $1`
    var room Room
    err := s.db.Get(&room, query, roomNumber)
    return &room, err
}

func (s *RoomService) Create(room Room) (*Room, error) {
    // Another database query in the same file
    query := `INSERT INTO rooms (room_number) VALUES ($1) RETURNING id`
    // ... more database code
}

// Problems:
// 1. Database knowledge scattered through service
// 2. Can't test without database
// 3. Hard to change database (would touch many places)
// 4. Mixing business logic with data access
```

### With Repository Pattern (✅ Clean)
```go
// Repository Port
type RoomRepository interface {
    Find(roomNumber string) (*Room, error)
    Create(room Room) (*Room, error)
    GetAll(status string) ([]Room, error)
}

// Service uses repository
type RoomService struct {
    repo RoomRepository  // Abstracted away
}

func (s *RoomService) Find(roomNumber string) (*Room, error) {
    // Service focuses on business logic
    // Data access delegated to repository
    room, err := s.repo.Find(roomNumber)
    if err != nil {
        return nil, err
    }
    return room, nil  // No database knowledge here
}

// Repository Implementation
type roomRepository struct {
    db *sqlx.DB
}

func (r *roomRepository) Find(roomNumber string) (*Room, error) {
    // All database code in one place
    query := `SELECT * FROM rooms WHERE room_number = $1`
    var room Room
    err := r.db.Get(&room, query, roomNumber)
    return &room, err
}

// Benefits:
// 1. Service is database-agnostic
// 2. Easy to test with mock repository
// 3. Clear separation of concerns
// 4. Changing database means changing only repository
```

### Real-World Test Example
```go
// Testing with a mock repository
type MockRoomRepository struct {
    rooms map[string]*Room
}

func (m *MockRoomRepository) Find(roomNumber string) (*Room, error) {
    return m.rooms[roomNumber], nil
}

// Test the service without database
func TestRoomService_Find(t *testing.T) {
    // Setup: Create mock repository with test data
    mockRepo := &MockRoomRepository{
        rooms: map[string]*Room{
            "101": {RoomNumber: "101", Status: "VACANT", Price: 100.00},
        },
    }
    
    // Create service with mock
    service := room.NewService(mockRepo)
    
    // Test: Call service method
    room, err := service.Find("101")
    
    // Assert: Check results
    if err != nil {
        t.Fatalf("Expected no error, got %v", err)
    }
    if room.RoomNumber != "101" {
        t.Fatalf("Expected room 101, got %v", room.RoomNumber)
    }
}
```

---

## Loose Coupling Implementation

### Coupling Metrics

#### What is Coupling?
The degree to which one component depends on another. High coupling = hard to change, test, reuse.

#### Loose vs Tight Coupling Comparison

```
TIGHT COUPLING (❌ Bad)
Service A ──directly imports──> Service B ──directly imports──> Database
          ──directly imports──> Config    ──directly imports──> Logger

Change Database? Must change Service B and Service A.
Want to test? Must involve real database and logger.


LOOSE COUPLING (✅ Good)
Service A ──depends on──> Interface B ──implemented by──> Service B
          ──depends on──> Interface Config            Config Impl
          ──depends on──> Interface Logger            Logger Impl

Change Database? Only change implementation of Interface.
Want to test? Inject mock implementations.
```

### Oasis's Loose Coupling Strategies

#### 1. Interface-Based Dependencies
```go
// Instead of
type GuestService struct {
    db *postgres.DB  // Tight coupling to specific database
}

// Use
type GuestService struct {
    repo GuestRepository  // Loose coupling via interface
}

// Now can inject:
// - PostgreSQL repository
// - MongoDB repository
// - Mock repository (for testing)
// - File-based repository
```

#### 2. Dependency Injection
```go
// Instead of
func NewGuestService() *GuestService {
    db := connectToPostgres()  // Hard-coded dependency
    return &GuestService{db: db}
}

// Use
func NewGuestService(repo GuestRepository) *GuestService {
    return &GuestService{repo: repo}  // Injected dependency
}

// Caller decides what repository to use
```

#### 3. Composition Over Inheritance
```go
// Instead of (inheritance - tight coupling)
type LuxuryRoom extends Room {
    // Inherits all Room traits
}

// Use (composition - loose coupling)
type Room struct {
    ID        int
    Type      string  // Can be "Luxury", "Standard", etc.
    Features  []string
}

// More flexible and decoupled
```

#### 4. Service Composition
```go
// Invoice service doesn't inherit from other services
// It composes them
type invoiceService struct {
    guestSvc      guest.Service      // Composed
    roomSvc       room.Service       // Composed
    laundrySvc    laundry.Service    // Composed
}

func (s *invoiceService) Generate(guestID int) {
    // Call composed services
    guest := s.guestSvc.Get(guestID)
    room := s.roomSvc.Find(guest.RoomID)
    laundry := s.laundrySvc.GetCharges(guestID)
}
```

#### 5. No Global State
```go
// ❌ Tight coupling via globals
var GlobalDB *sqlx.DB

func ConnectDB() {
    GlobalDB = ...
}

// ✅ Loose coupling: Pass as parameter
func NewService(db *sqlx.DB) *Service {
    return &Service{db: db}
}
```

---

## Real-World Examples

### Example 1: Guest Authentication Flow

**Component Interaction:**
```
HTTP Request
    ↓
GuestHandler.Login(roomNumber, phone)
    ↓
GuestService.Find(roomNumber, phoneNumber)  [Service interface call]
    ↓
GuestRepository.Find(roomNumber, phoneNumber)  [Repository interface call]
    ↓
SQL Query Execution
    ↓
Return Guest Domain Object
    ↓
Generate JWT Token (util/create_jwt.go)
    ↓
Return JWT to Client
```

**Code:**
```go
// Handler receives service (injected)
func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
    var req LoginRequest
    json.NewDecoder(r.Body).Decode(&req)
    
    // Call service through interface
    guest, err := h.svc.Find(req.RoomNumber, req.PhoneNumber)
    if err != nil {
        http.Error(w, "Invalid credentials", 401)
        return
    }
    
    // Generate JWT
    token, _ := util.CreateJwt(h.jwtSecret, util.Payload{
        Sub:         guest.ID,
        Name:        guest.Name,
        RoomNumber:  guest.RoomNumber,
    })
    
    // Return response
    json.NewEncoder(w).Encode(map[string]string{"token": token})
}

// Service depends on repository interface
func (s *service) Find(roomNumber, phoneNumber string) (*domain.Guest, error) {
    return s.gstRepo.Find(roomNumber, phoneNumber)  // Interface call
}

// Repository implements interface
func (r *guestRepo) Find(roomNumber, phoneNumber string) (*domain.Guest, error) {
    var g domain.Guest
    query := `SELECT * FROM guests WHERE room_number = $1 AND phone_number = $2`
    err := r.db.Get(&g, query, roomNumber, phoneNumber)
    return &g, err
}
```

### Example 2: Invoice Generation (Service Composition)

**Architecture:**
```
Invoice Handler
    ↓
Invoice Service
    ├─ Guest Service Interface (injected)
    ├─ Room Service Interface (injected)
    ├─ Laundry Service Interface (injected)
    ├─ Restaurant Service Interface (injected)
    └─ Invoice Repository Interface (injected)
```

**Code Flow:**
```go
// Handler calls service
func (h *Handler) GenerateInvoice(w http.ResponseWriter, r *http.Request) {
    guestID := getGuestID(r)
    
    invoice, err := h.svc.Generate(guestID)
    if err != nil {
        http.Error(w, "Failed to generate invoice", 500)
        return
    }
    
    json.NewEncoder(w).Encode(invoice)
}

// Service composes multiple services
func (s *invoiceService) Generate(guestID int) (*Invoice, error) {
    // 1. Get guest info from Guest Service
    guest, err := s.guestSvc.Get(guestID)
    if err != nil {
        return nil, err
    }
    
    // 2. Get room charge from Room Service
    roomCharge, err := s.roomSvc.CalculateCharge(guest.RoomNumber)
    if err != nil {
        return nil, err
    }
    
    // 3. Get laundry charges from Laundry Service
    laundryCharge, err := s.laundrySvc.GetTotalCharges(guestID)
    if err != nil {
        return nil, err
    }
    
    // 4. Get restaurant charges from Restaurant Service
    restaurantCharge, err := s.restaurantSvc.GetTotalCharges(guestID)
    if err != nil {
        return nil, err
    }
    
    // 5. Create invoice with aggregated data
    invoice := &Invoice{
        GuestID:          guestID,
        RoomNumber:       guest.RoomNumber,
        RoomCharge:       roomCharge,
        LaundryCharge:    laundryCharge,
        RestaurantCharge: restaurantCharge,
        TotalAmount:      roomCharge + laundryCharge + restaurantCharge,
    }
    
    // 6. Persist through repository
    return s.invoiceRepo.Create(invoice)
}
```

---

## Anti-Patterns Avoided

### ❌ Not Used in Oasis

#### 1. God Object
```go
// ❌ AVOIDED
type HotelManager struct {
    // Handles everything!
    guests     []Guest
    rooms      []Room
    staff      []Staff
    invoices   []Invoice
    laundry    []LaundryRequest
    db         *sqlx.DB
    logger     Logger
    config     Config
}

func (h *HotelManager) CreateGuest()    { }
func (h *HotelManager) BookRoom()       { }
func (h *HotelManager) ProcessLaundry() { }
func (h *HotelManager) GenerateInvoice(){ }
// ... 50 more methods

// ✅ INSTEAD: Separate services
type GuestService { /* handles guests */ }
type RoomService { /* handles rooms */ }
type LaundryService { /* handles laundry */ }
type InvoiceService { /* handles invoices */ }
```

#### 2. Service Locator Pattern
```go
// ❌ AVOIDED
var ServiceRegistry = make(map[string]interface{})

func Register(name string, service interface{}) {
    ServiceRegistry[name] = service
}

func GetService(name string) interface{} {
    return ServiceRegistry[name]
}

type Handler struct{}
func (h *Handler) Handle() {
    // Magic service lookup
    svc := GetService("GuestService").(GuestService)
}

// ✅ INSTEAD: Dependency injection
type Handler struct {
    svc GuestService  // Clear dependency
}
```

#### 3. Global State
```go
// ❌ AVOIDED
var GlobalDB *sqlx.DB
var GlobalConfig Config
var GlobalLogger Logger

func init() {
    GlobalDB = connectDB()
    GlobalConfig = loadConfig()
    GlobalLogger = createLogger()
}

// ✅ INSTEAD: Injected throughout
func NewService(db *sqlx.DB, config Config, logger Logger) *Service {
    return &Service{db: db, config: config, logger: logger}
}
```

#### 4. Mixing Concerns
```go
// ❌ AVOIDED
func ProcessLaundryRequest(guestID int) error {
    // Business logic
    request := findRequest(guestID)
    request.Status = "processing"
    
    // Data persistence (mixed in)
    query := `UPDATE laundry_requests SET status = 'processing' WHERE id = ?`
    db.Exec(query, request.ID)
    
    // Logging (mixed in)
    log.Printf("Processing request %d", request.ID)
    
    // Email sending (mixed in)
    sendEmail(request.GuestEmail, "Your laundry is being processed")
    
    return nil
}

// ✅ INSTEAD: Separate concerns
type LaundryService struct {
    repo   LaundryRepository  // Data access
    email  EmailService       // Email sending
}

func (s *LaundryService) Process(guestID int) error {
    // Business logic only
    request, _ := s.repo.FindByGuest(guestID)
    request.Status = "processing"
    
    // Delegate to other layer
    s.repo.Update(request)  // Data persistence in repository
    s.email.Send(...)       // Email in dedicated service
    
    return nil
}
```

#### 5. Circular Dependencies
```go
// ❌ AVOIDED (Circular dependency)
// guest/service.go
type Service struct {
    laundryService LayundryService  // Guest depends on Laundry
}

// laundry/service.go
type Service struct {
    guestService GuestService  // Laundry depends on Guest
}

// 🔴 This creates a circular dependency!

// ✅ INSTEAD: Use aggregation at higher level
type InvoiceService struct {
    guestSvc   GuestService    // Invoice depends on Guest
    laundrySvc LaundryService  // Invoice depends on Laundry
}
// Guest and Laundry don't know about each other
```

---

## Summary: Design Principles in Oasis

| Principle | How Used | Benefit |
|-----------|----------|---------|
| **DDD** | Domain entities, services per context | Clear business modeling |
| **Hexagonal** | Ports & adapters pattern | Isolated core logic |
| **DI** | Constructor injection | Testable, flexible |
| **Repository** | Data abstraction via interfaces | Database independence |
| **SOLID-S** | Single responsibility per service | High cohesion |
| **SOLID-O** | Open for extension via interfaces | Extensibility |
| **SOLID-L** | Interface contracts | Interchangeable implementations |
| **SOLID-I** | Focused interfaces | No forced dependencies |
| **SOLID-D** | Depend on abstractions | Loose coupling |

**Result: Professional-grade, maintainable, scalable architecture.**

