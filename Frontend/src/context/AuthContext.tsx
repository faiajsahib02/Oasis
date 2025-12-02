import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getToken, setToken as setLocalStorageToken, removeToken as removeLocalStorageToken } from '../utils/auth';
import { DecodedToken } from '../types';

export type UserRole = 'guest' | 'staff';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  staffRole?: string; // For staff only
  room_number?: string; // For guests
}

interface AuthContextType {
  user: User | null;
  login: (token: string, staffData?: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isStaff: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize from local storage
    const token = getToken();
    if (token) {
      try {
        // Check if we have staff data stored (we'll need to store it if we want persistence)
        // For now, let's try to decode the token.
        // If it's a guest token, it has 'sub' (id) and 'name'.
        // If it's a staff token, it might have different claims, or we rely on stored user data.
        
        // Strategy: Store user object in localStorage alongside token for simplicity
        const storedUser = localStorage.getItem('ocean_paradise_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Fallback for existing guest tokens (if any)
          const decoded = jwtDecode<DecodedToken>(token);
          setUser({
            id: decoded.sub,
            name: decoded.name || 'Guest',
            role: 'guest',
            room_number: decoded.room_number
          });
        }
      } catch (error) {
        console.error("Failed to restore session", error);
        removeLocalStorageToken();
        localStorage.removeItem('ocean_paradise_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, staffData?: any) => {
    setLocalStorageToken(token);
    
    let newUser: User;

    if (staffData) {
      // Staff Login
      newUser = {
        id: staffData.id,
        name: staffData.name,
        role: 'staff',
        staffRole: staffData.role
      };
    } else {
      // Guest Login
      const decoded = jwtDecode<DecodedToken>(token);
      newUser = {
        id: decoded.sub,
        name: decoded.name || 'Guest',
        role: 'guest',
        room_number: decoded.room_number
      };
    }

    setUser(newUser);
    localStorage.setItem('ocean_paradise_user', JSON.stringify(newUser));
  };

  const logout = () => {
    removeLocalStorageToken();
    localStorage.removeItem('ocean_paradise_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      isStaff: user?.role === 'staff',
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
