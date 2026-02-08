# 🎨 Oasis Frontend

Modern, responsive React frontend for the Oasis Hotel Management System with TypeScript and Tailwind CSS.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Features](#features)
- [Architecture](#architecture)
- [Styling](#styling)
- [State Management](#state-management)
- [Routing](#routing)
- [API Integration](#api-integration)

## 🌟 Overview

The frontend provides an intuitive, role-based interface for hotel management operations. Built with React 18 and TypeScript for type safety, styled with Tailwind CSS for modern aesthetics, and optimized for performance with Vite.

**Key Features:**
- 🎯 Role-based dashboards (Guest, Staff, Admin)
- 🔐 JWT authentication with protected routes
- 📱 Fully responsive design
- ⚡ Real-time updates via WebSocket
- 🎭 Smooth animations with Framer Motion
- 🎨 Modern UI with Tailwind CSS
- 📊 Type-safe development with TypeScript

## 🛠️ Tech Stack

### Core
- **React** 18.3 - UI library
- **TypeScript** 5.2 - Type safety
- **Vite** 5.0 - Build tool and dev server

### Styling
- **Tailwind CSS** 3.3 - Utility-first CSS framework
- **PostCSS** 8.4 - CSS processing
- **Autoprefixer** 10.4 - CSS vendor prefixing
- **clsx** & **tailwind-merge** - Class name utilities

### Routing & State
- **React Router DOM** 6.20 - Client-side routing
- **React Context API** - Global state management

### HTTP & Real-time
- **Axios** 1.6 - HTTP client
- **WebSocket API** - Real-time communication

### UI & UX
- **Framer Motion** 10.16 - Animation library
- **Lucide React** 0.294 - Icon library
- **JWT Decode** 4.0 - JWT token parsing

### Development
- **ESLint** 8.53 - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **Vite Plugin React** - Fast refresh and JSX support

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── main.tsx                    # Application entry point
│   ├── App.tsx                     # Root component with routing
│   ├── index.css                   # Global styles & Tailwind imports
│   ├── vite-env.d.ts              # Vite type definitions
│   │
│   ├── assets/                     # Static assets
│   │   └── images/
│   │
│   ├── components/                 # Reusable components
│   │   ├── Button.tsx             # Custom button component
│   │   ├── Card.tsx               # Card component
│   │   ├── GuestNavbar.tsx        # Guest navigation
│   │   ├── StaffNavbar.tsx        # Staff navigation
│   │   ├── ProtectedRoute.tsx     # Route protection HOC
│   │   └── RequireAuth.tsx        # Auth requirement wrapper
│   │
│   ├── context/                    # React Context providers
│   │   └── AuthContext.tsx        # Authentication context
│   │
│   ├── layouts/                    # Layout components
│   │   ├── GuestLayout.tsx        # Guest pages layout
│   │   ├── StaffLayout.tsx        # Staff pages layout
│   │   ├── PublicLayout.tsx       # Public pages layout
│   │   └── MainLayout.tsx         # Main wrapper layout
│   │
│   ├── pages/                      # Page components
│   │   ├── HomePage.tsx           # Landing page
│   │   ├── LoginPage.tsx          # Login page
│   │   ├── AboutPage.tsx          # About page
│   │   ├── ContactPage.tsx        # Contact page
│   │   ├── RoomsPage.tsx          # Rooms listing
│   │   ├── GuestDashboardPage.tsx # Guest dashboard
│   │   │
│   │   ├── guest/                 # Guest-specific pages
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── BookingsPage.tsx
│   │   │   ├── LaundryPage.tsx
│   │   │   ├── RestaurantPage.tsx
│   │   │   └── InvoicePage.tsx
│   │   │
│   │   ├── staff/                 # Staff-specific pages
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── TasksPage.tsx
│   │   │   ├── HousekeepingPage.tsx
│   │   │   └── ReportsPage.tsx
│   │   │
│   │   └── admin/                 # Admin-specific pages
│   │       ├── DashboardPage.tsx
│   │       ├── ManageRoomsPage.tsx
│   │       ├── ManageStaffPage.tsx
│   │       └── AnalyticsPage.tsx
│   │
│   ├── services/                   # API service layer
│   │   └── api.ts                 # Axios instance & API calls
│   │
│   ├── types/                      # TypeScript type definitions
│   │   └── index.ts               # Shared types & interfaces
│   │
│   └── utils/                      # Utility functions
│       └── auth.ts                # Auth helper functions
│
├── public/                         # Public static assets
│   └── favicon.ico
│
├── index.html                      # HTML entry point
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.node.json             # TypeScript config for Node
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
└── .eslintrc.cjs                  # ESLint configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see [Backend README](../Backend/README.md))

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   
   Create a `.env` file in the root:
   ```env
   VITE_API_URL=http://localhost:8080
   VITE_WS_URL=ws://localhost:8080/ws
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   Application will be available at `http://localhost:5173`

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run linter with auto-fix
npm run lint -- --fix
```

## ✨ Features

### 🔐 Authentication System

- **JWT-based Authentication** - Secure token-based auth
- **Role-based Access Control** - Different interfaces for guests, staff, and admins
- **Protected Routes** - Automatic redirection for unauthorized access
- **Persistent Sessions** - Token stored in localStorage

```typescript
// Example: Using auth context
const { user, login, logout } = useAuth();

// Login
await login(email, password, 'guest');

// Access user info
console.log(user?.name, user?.role);

// Logout
logout();
```

### 🎨 Component Library

#### Button Component
```tsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

#### Card Component
```tsx
<Card>
  <h2 className="text-xl font-bold">Title</h2>
  <p>Content goes here</p>
</Card>
```

### 📱 Responsive Layouts

All pages are fully responsive with mobile-first design:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### 🔄 Real-time Updates

WebSocket connection for live updates:

```typescript
// services/api.ts
const ws = new WebSocket(import.meta.env.VITE_WS_URL);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle real-time updates
};
```

## 🏗️ Architecture

### Component Hierarchy

```
App
├── AuthProvider
│   ├── PublicLayout
│   │   ├── HomePage
│   │   ├── LoginPage
│   │   ├── AboutPage
│   │   └── RoomsPage
│   │
│   ├── GuestLayout (Protected)
│   │   ├── GuestNavbar
│   │   └── Guest Pages
│   │
│   ├── StaffLayout (Protected)
│   │   ├── StaffNavbar
│   │   └── Staff Pages
│   │
│   └── AdminLayout (Protected)
│       ├── AdminNavbar
│       └── Admin Pages
```

### Design Patterns

- **Container/Presentational Pattern** - Separating logic from UI
- **Higher-Order Components** - Route protection and auth
- **Custom Hooks** - Reusable logic (useAuth, useApi)
- **Context API** - Global state management
- **Composition** - Building complex UIs from simple components

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS for styling with custom configuration:

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: '#your-brand-color',
        secondary: '#your-secondary-color',
      },
    },
  },
};
```

### Common Patterns

```tsx
// Responsive design
<div className="flex flex-col md:flex-row lg:gap-8">

// Conditional styling
<button className={clsx(
  'px-4 py-2 rounded',
  isActive && 'bg-blue-500',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>

// Tailwind Merge for variant handling
import { twMerge } from 'tailwind-merge';

const buttonClasses = twMerge(
  'base-classes',
  variant === 'primary' && 'primary-classes',
  className
);
```

## 🔄 State Management

### Auth Context

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Usage in components
const { user, isAuthenticated, logout } = useAuth();
```

### Local State

- **useState** for component-local state
- **useReducer** for complex state logic
- **useEffect** for side effects and data fetching

## 🛣️ Routing

### Route Structure

```typescript
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/about" element={<AboutPage />} />
  
  {/* Protected Guest Routes */}
  <Route element={<RequireAuth role="guest" />}>
    <Route path="/guest/dashboard" element={<GuestDashboard />} />
    <Route path="/guest/bookings" element={<BookingsPage />} />
  </Route>
  
  {/* Protected Staff Routes */}
  <Route element={<RequireAuth role="staff" />}>
    <Route path="/staff/dashboard" element={<StaffDashboard />} />
    <Route path="/staff/tasks" element={<TasksPage />} />
  </Route>
</Routes>
```

### Protected Routes

```typescript
// components/RequireAuth.tsx
export function RequireAuth({ role }: { role: string }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== role) {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
}
```

## 🌐 API Integration

### API Service

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### API Calls

```typescript
// Get data
export const getRooms = () => api.get('/api/rooms');

// Post data
export const bookRoom = (data: BookingData) => 
  api.post('/api/rooms/book', data);

// Update data
export const updateProfile = (id: string, data: ProfileData) => 
  api.put(`/api/guests/${id}`, data);
```

### Usage in Components

```typescript
function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRooms();
        setRooms(response.data);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {rooms.map(room => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
```

## 🎭 Animations

Using Framer Motion for smooth animations:

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## 🔍 TypeScript Types

```typescript
// types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'guest' | 'staff' | 'admin';
}

export interface Room {
  id: string;
  room_number: string;
  room_type: string;
  price: number;
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
  floor: number;
  capacity: number;
}

export interface Booking {
  id: string;
  guest_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  status: string;
}

// ... more types
```

## 🚀 Building for Production

```bash
# Build optimized production bundle
npm run build

# Output will be in /dist directory
# Preview production build locally
npm run preview
```

### Environment Variables for Production

```env
VITE_API_URL=https://api.your-domain.com
VITE_WS_URL=wss://api.your-domain.com/ws
```

### Deployment

The built files in `/dist` can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Firebase Hosting
- Any static hosting service

## 📊 Performance Optimization

- **Code Splitting** - Automatic with Vite
- **Lazy Loading** - React.lazy() for route-based splitting
- **Image Optimization** - WebP format, lazy loading
- **Bundle Size** - Tree shaking unused code
- **Caching** - Service worker for PWA (optional)

## 🧪 Testing (Future Enhancement)

```bash
# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test

# Run with coverage
npm run test:coverage
```

## 🤝 Contributing

When contributing to the frontend:
1. Follow the existing component structure
2. Use TypeScript for all new components
3. Follow Tailwind CSS conventions
4. Ensure responsive design
5. Add proper types and interfaces
6. Test on multiple browsers

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)

---

Built with ⚡ using React + TypeScript + Vite
