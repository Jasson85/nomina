'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Mail, Lock, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      toast({ title: 'Bienvenido', description: 'Sesión iniciada correctamente' });
      // La redirección se hace en auth-context después de fetchCurrentUser
    } catch (err: any) {
      const msg = err?.message || 'No se pudo iniciar sesión';
      setError(msg);
      toast({ variant: 'destructive', title: 'Error', description: msg });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Briefcase className="h-10 w-10" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">NominaColombia</CardTitle>
            <CardDescription className="text-base mt-2">Inicia sesión en tu cuenta</CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="test@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>

          <div className="px-6 pb-6 space-y-3">
            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? 'Ingresando...' : (<><LogIn className="mr-2 h-5 w-5" />Iniciar Sesión</>)}
            </Button>

            <Link href="/auth/register" className="w-full">
              <Button variant="outline" className="w-full">Crear una cuenta</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}