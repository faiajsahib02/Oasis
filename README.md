# 🏨 Ocean Paradise - Hotel Management System

A comprehensive, full-stack hotel management system built with Go and React, featuring real-time updates, role-based access control, and complete hotel operations management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Go Version](https://img.shields.io/badge/Go-1.22-00ADD8?logo=go)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript)
![Backend CI/CD](https://github.com/yourusername/ocean-paradise/actions/workflows/backend.yml/badge.svg)
![Frontend CI/CD](https://github.com/yourusername/ocean-paradise/actions/workflows/frontend.yml/badge.svg)
![Code Quality](https://img.shields.io/badge/code%20quality-A-brightgreen)
![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)
![GitHub Stars](https://img.shields.io/github/stars/yourusername/ocean-paradise?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/ocean-paradise?style=social)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Key Features Demonstrated](#key-features-demonstrated)
- [Quality & Security](#quality--security)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

Ocean Paradise is a modern hotel management system designed to streamline hotel operations, from guest management and room bookings to housekeeping, laundry services, and restaurant operations. The system implements a clean architecture pattern with hexagonal design principles, ensuring maintainability and scalability.

**Key Highlights:**
- Real-time updates using WebSocket connections
- JWT-based authentication and authorization
- Role-based access control (Guest, Staff, Admin)
- RESTful API architecture
- Responsive UI with modern design patterns

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

### Backend
- **Language:** Go 1.22
- **Framework:** Custom REST framework with Gorilla Mux patterns
- **Database:** PostgreSQL with sqlx
- **Migrations:** sql-migrate
- **Authentication:** JWT (JSON Web Tokens)
- **Real-time:** WebSocket (Gorilla WebSocket)
- **Environment:** godotenv

### Frontend
- **Framework:** React 18.3
- **Language:** TypeScript 5.2
- **Build Tool:** Vite 5.0
- **Styling:** Tailwind CSS 3.3
- **Routing:** React Router DOM 6.20
- **HTTP Client:** Axios
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Architecture
- **Pattern:** Hexagonal Architecture (Ports & Adapters)
- **Structure:** Domain-Driven Design principles
- **API:** RESTful with WebSocket support

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
   git clone https://github.com/yourusername/ocean-paradise.git
   cd ocean-paradise/Backend
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
   DB_NAME=ocean_paradise
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
ocean-paradise/
├── Backend/
│   ├── cmd/                    # CLI commands
│   ├── config/                 # Configuration management
│   ├── domain/                 # Domain models
│   ├── infra/                  # Infrastructure layer
│   │   └── db/                # Database connection & migrations
│   ├── migrations/             # SQL migration files
│   ├── repository/             # Data access layer
│   ├── rest/                   # HTTP server & handlers
│   │   ├── handlers/          # Request handlers by feature
│   │   └── middlewares/       # HTTP middlewares
│   ├── ws/                     # WebSocket hub & client
│   ├── util/                   # Utility functions
│   └── [feature]/              # Feature modules (guest, room, etc.)
│       ├── port.go            # Interface definitions
│       └── service.go         # Business logic
│
└── Frontend/
    ├── src/
    │   ├── assets/            # Static assets
    │   ├── components/        # Reusable React components
    │   ├── context/           # React Context (Auth, etc.)
    │   ├── layouts/           # Layout components
    │   ├── pages/             # Page components
    │   │   ├── guest/        # Guest-specific pages
    │   │   ├── staff/        # Staff-specific pages
    │   │   └── admin/        # Admin-specific pages
    │   ├── services/          # API service layer
    │   ├── types/             # TypeScript type definitions
    │   └── utils/             # Utility functions
    └── public/                # Public assets
```

## 📚 API Documentation

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Room Management

#### Get Available Rooms
```http
GET /api/rooms/available
Authorization: Bearer <token>
```

#### Book Room
```http
POST /api/rooms/book
Authorization: Bearer <token>
Content-Type: application/json

{
  "room_id": 101,
  "check_in": "2024-03-01",
  "check_out": "2024-03-05"
}
```

### Housekeeping

#### Get Tasks
```http
GET /api/housekeeping/tasks
Authorization: Bearer <token>
```

#### Update Room Status
```http
PUT /api/housekeeping/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "room_id": 101,
  "status": "clean"
}
```

*For complete API documentation, please refer to [Backend/README.md](Backend/README.md)*

## ✅ Quality & Security

### Automated Quality Assurance

- ✅ **CI/CD Pipelines** - GitHub Actions for automated testing and building
- ✅ **Code Linting** - ESLint for frontend, golangci-lint for backend
- ✅ **Test Coverage** - Backend unit tests with race condition detection
- ✅ **Security Scanning** - Dependency vulnerability scanning
- ✅ **Build Verification** - Multi-platform binary building (Linux, macOS, Windows)

### Documentation

- 📖 [Main README](README.md) - Project overview and getting started
- 🔧 [Backend Documentation](Backend/README.md) - API, architecture, and deployment
- 🎨 [Frontend Documentation](Frontend/README.md) - Components, state management, styling
- 📋 [Contributing Guide](CONTRIBUTING.md) - How to contribute to the project
- 🔒 [Security Policy](SECURITY.md) - Vulnerability reporting and best practices
- 📜 [Code of Conduct](CODE_OF_CONDUCT.md) - Community guidelines
- 🗺️ [Project Roadmap](ROADMAP.md) - Future features and improvements
- 📝 [Changelog](CHANGELOG.md) - Version history and release notes

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
git clone https://github.com/yourusername/ocean-paradise.git
cd ocean-paradise

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

