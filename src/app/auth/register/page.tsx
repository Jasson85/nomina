'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Mail, Lock, ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useAuth } from '@/context/contexto-autenticacion';
import { apiClient } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setIsLoading(true);      
      
      await apiClient.post('/auth/register', {
        email,
        password,
        nombre,
      });

      toast({ 
        title: '¡Cuenta creada con éxito!', 
        description: 'Ya puedes iniciar sesión con tus credenciales.' 
      });
      
      router.push('/login');
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || 'Error al conectar con el servidor';
      setError(errorMsg);
      toast({ variant: 'destructive', title: 'Error de registro', description: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">NominaColombia</CardTitle>
            <CardDescription>Crea tu cuenta administrativa</CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-xs font-medium rounded-lg border border-destructive/20 text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input 
                id="nombre" 
                placeholder="Ej. Admin Principal" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                required 
                disabled={isLoading} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Corporativo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@empresa.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="pl-10" 
                  required 
                  disabled={isLoading} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  disabled={isLoading} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  disabled={isLoading} 
                />
              </div>
            </div>
          </CardContent>

          <div className="px-6 pb-8 flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Procesando...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> 
                  Crear Cuenta de Acceso
                </>
              )}
            </Button>

            <Link href="/login" className="text-center">
              <span className="text-sm text-muted-foreground hover:text-primary transition-colors">
                ¿Ya tienes cuenta? Inicia sesión aquí
              </span>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}