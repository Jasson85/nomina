'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../api/axiosInstance'; 
import { User } from '@/schemas/appSchemas'; 

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;    
  hasRole: (roles: Array<User['rol']>) => boolean;
  clockInTime?: Date | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  
  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
    if (!authToken) return;
    try {
      const res = await axiosInstance.get('/auth/me');      
      const data: User = res.data;
      setUser(data);
    } catch (err) {
      console.error('fetchCurrentUser error:', err);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  // Función de Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {      
      const formData = new URLSearchParams();
      formData.append('username', email); 
      formData.append('password', password);
      
      const res = await axiosInstance.post('/auth/login', formData.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      
      const data = res.data; 
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      
      // Obtenemos la info completa del usuario para el estado
      await fetchCurrentUser(data.access_token);
      
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err.response?.data?.detail || err.message);
      throw new Error(err.response?.data?.detail || 'Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Función de Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Función de Verificación de Rol
  const hasRole = (roles: Array<User['rol']>): boolean => {
      if (!user) return false;
      return roles.includes(user.rol);
  };
  
  return (
  <AuthContext.Provider value={{ user, token, isLoading, login, logout, hasRole }}>
    {children}
    </AuthContext.Provider>
    );
  }

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}