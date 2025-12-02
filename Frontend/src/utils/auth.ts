import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../types';

const TOKEN_KEY = 'ocean_paradise_token';

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUserFromToken = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  const user = getUserFromToken();
  if (!user) return false;
  
  // Check expiration
  const currentTime = Date.now() / 1000;
  if (user.exp < currentTime) {
    removeToken();
    return false;
  }
  
  return true;
};
