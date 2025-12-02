'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  nombre: string;
  es_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nombre: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    console.log('Initial token from localStorage:', storedToken);
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser(storedToken).finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log('Fetching user from:', `${apiUrl}/auth/me`);
      
      const res = await fetch(`${apiUrl}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        console.error('Failed to fetch user:', res.status, res.statusText);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        return;
      }
      
      const data = await res.json();
      console.log('User data received:', data);
      setUser(data);
    } catch (err) {
      console.error('fetchCurrentUser error:', err);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log('Login to:', `${apiUrl}/auth/login`);
      
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Login response status:', res.status);
      
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Credenciales inválidas');
      }
      
      const data = await res.json();
      console.log('Token received:', data.access_token.slice(0, 20) + '...');
      
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      
      await fetchCurrentUser(data.access_token);
      
    setTimeout(() => {
    console.log('Redirecting to /dashboard');
    router.push('/dashboard');
  }, 500);
    } catch (err: any) {
      console.error('Login error:', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, nombre: string) => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nombre }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Error al registrar');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}