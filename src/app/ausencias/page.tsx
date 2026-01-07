'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TablaAusencias } from '@/components/ausencias/tabla-ausencias';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PaginaAusencias() {
  const [ausencias, setAusencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Función para obtener las ausencias desde el Backend (FastAPI)
  const cargarAusencias = async () => {
    try {
      setLoading(true);
      setError(false);
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8000/ausencias', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }
      
      const data = await response.json();
      setAusencias(data);
    } catch (err) {
      console.error("Error cargando ausencias:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAusencias();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Sincronizando novedades de nómina...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Alert variant="destructive" className="border-2">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-bold">Error de Autenticación o Conexión</AlertTitle>
          <AlertDescription className="mt-2">
            No se pudo recuperar el historial de ausencias. Verifique que:
            <ul className="list-disc ml-5 mt-2">
              <li>Su sesión siga activa (Token válido).</li>
              <li>El backend en <code className="bg-white/20 px-1 rounded">localhost:8000</code> esté encendido.</li>
              <li>Tenga los permisos de <b>Gestor de Nómina</b> o <b>Admin</b>.</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ausencias y Novedades</h1>
          <p className="text-muted-foreground">Control de incidencias para el cierre de nómina.</p>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="text-lg">Registro de Ausencias</CardTitle>
          <CardDescription>
            Listado completo.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <TablaAusencias ausencias={ausencias} mostrarEmpleado={true} />
        </CardContent>
      </Card>
    </div>
  );
}