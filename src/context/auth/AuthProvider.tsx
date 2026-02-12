import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './auth-context';
import type { UserData, AuthContextType } from './auth-types';

interface JwtPayload {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  iat: number;
  exp?: number;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  /** ---------------------------
   *  LOGOUT (Stable with useCallback)
   * --------------------------- */
  const logout = useCallback(() => {
    localStorage.removeItem('seman_token');
    localStorage.removeItem('seman_role');
    sessionStorage.removeItem('activeNavItem');
    sessionStorage.removeItem('filters');

    setUser(null);
    setIsAuthenticated(false);
  }, []);

  /** ---------------------------
   *  CHECK TOKEN EXPIRATION
   * --------------------------- */
  const checkTokenValidity = useCallback(() => {
    const token = localStorage.getItem('seman_token');
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // If expired, logout immediately
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        logout();
        return;
      }
    } catch (err) {
      console.error("Invalid token:", err);
      logout();
    }
  }, [logout]);


  /** ---------------------------
   *  INITIAL LOAD: Only on mount
   * --------------------------- */
  useEffect(() => {
    const token = localStorage.getItem('seman_token');
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // Do not load expired tokens
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        logout();
        return;
      }

      setUser({
        id: decoded.id || '',
        fullName: decoded.fullName,
        email: decoded.email || '',
        phoneNumber: decoded.phoneNumber || '',
        role: decoded.role || ''
      });

      setIsAuthenticated(true);
    } catch (err) {
      logout();
    }
  }, [logout]);


  /** ---------------------------
   *  AUTO LOGOUT WHEN TOKEN EXPIRES
   *  Checks every 30 seconds
   * --------------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      checkTokenValidity();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [checkTokenValidity]);


  /** ---------------------------
   *  LOGIN
   * --------------------------- */
  const login = (token: string) => {
    localStorage.setItem('seman_token', token);

    const decoded = jwtDecode<JwtPayload>(token);
    localStorage.setItem('seman_role', decoded.role || '');

    setUser({
      id: decoded.id || '',
      fullName: decoded.fullName,
      email: decoded.email || '',
      phoneNumber: decoded.phoneNumber || '',
      role: decoded.role || ''
    });

    setIsAuthenticated(true);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}