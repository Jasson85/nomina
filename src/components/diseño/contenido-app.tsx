'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/contexto-autenticacion';
import AppLayout from './app-layout';

interface Props {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/login', '/auth/register', '/auth/forgot-password'];

export default function AppContent({ children }: Props) {
  const { token, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

   const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.includes(route));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isLoading) return;   

    if (!token && !isPublicRoute) {
      router.push('/login');
      return; 
    }

   if (token && isPublicRoute) {
        router.push('/dashboard');
        return; 
    }
  }, [token, isLoading, pathname, isMounted, router, isPublicRoute]);

  if (!isMounted || isLoading || (!token && !isPublicRoute)) {    
    return <div className="flex items-center justify-center h-screen">Verificando acceso...</div>;
}
  if (isPublicRoute) {
    return <>{children}</>;
  }

  return <AppLayout>{children}</AppLayout>;
}