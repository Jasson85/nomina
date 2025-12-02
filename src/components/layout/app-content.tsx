'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.includes(route));

    if (isPublicRoute) {
      return;
    }

    if (!token) {
      router.push('/login');
    }
  }, [token, isLoading, pathname, isMounted, router]);

  if (!isMounted) return null;

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.includes(route));

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return <AppLayout>{children}</AppLayout>;
}