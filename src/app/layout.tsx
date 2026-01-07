import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/contexto-autenticacion';
import AppContent from '@/components/diseño/contenido-app';
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from '@/components/providers/query-provider';

export const metadata: Metadata = {
  title: 'Nomina',
  description: 'Software de prenómina',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <AuthProvider>
            <AppContent>
              {children}
            </AppContent>
            <Toaster /> {}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}