'use client';

import React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
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
import { useAuth } from '@/context/contexto-autenticacion';
import { AppFooter } from './app-footer';

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
          <Link href="/" className="flex items-center gap-3 px-2">
            <NextImage 
            src="/images/vozip-icon.png" 
            alt="/images/vozip-full.png" 
            width={40} 
            height={40}
            className="transition-all group-data-[collapsible=icon]:w-10"
            priority
            />
            <span className="text-lg font-bold text-foreground transition-all group-data-[collapsible=icon]:hidden">
              Tu Empresa
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
        
        {/* AGREGAR FOOTER AQUÍ */}
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}