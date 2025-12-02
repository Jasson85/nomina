'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { MainNav } from './main-nav';
import { UserNav } from './user-nav';
import { useAuth } from '@/context/auth-context';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  // Mientras carga, no mostrar nada
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }
  
  // Si no hay usuario después de cargar, retornar children (que redirigirá a login)
  if (!user) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="justify-center group-data-[collapsible=icon]:justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="size-6 text-primary transition-all group-data-[collapsible=icon]:size-6" />
            <span className="text-lg font-semibold text-foreground transition-all group-data-[collapsible=icon]:hidden">
              NominaCo
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <MainNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-2" />
          </div>
          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}