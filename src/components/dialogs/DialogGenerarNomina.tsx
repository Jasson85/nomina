'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface DialogGenerarNominaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function DialogGenerarNomina({ open, onOpenChange, onSuccess }: DialogGenerarNominaProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mes, setMes] = useState<string>(MESES[new Date().getMonth()]);
  const [anio, setAnio] = useState<string>(new Date().getFullYear().toString());
  const [resultado, setResultado] = useState<any>(null);

  const handleGenerar = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const numMes = MESES.indexOf(mes) + 1;

      const response = await fetch(`${apiUrl}/nominas/generar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mes: numMes,
          anio: parseInt(anio)
        })
      });

      if (!response.ok) throw new Error('Error al generar nómina');

      const data = await response.json();
      setResultado(data);

      toast({
        title: 'Éxito',
        description: `Nómina generada: ${data.cantidad_registros || 0} empleados procesados`
      });

      setTimeout(() => {
        onOpenChange(false);
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error('Error al generar nómina:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo generar la nómina'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generar Nómina</DialogTitle>
          <DialogDescription>
            {resultado
              ? 'Proceso completado exitosamente'
              : 'Selecciona el período para generar la nómina'}
          </DialogDescription>
        </DialogHeader>

        {!resultado ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                Este proceso calculará la nómina de todos los empleados activos para el período seleccionado.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mes">Mes</Label>
              <Select value={mes} onValueChange={setMes}>
                <SelectTrigger id="mes">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESES.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="anio">Año</Label>
              <Select value={anio} onValueChange={setAnio}>
                <SelectTrigger id="anio">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2023, 2024, 2025, 2026].map(a => (
                    <SelectItem key={a} value={a.toString()}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGenerar} disabled={isLoading}>
                {isLoading ? 'Generando...' : 'Generar Nómina'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-emerald-900">¡Nómina generada correctamente!</p>
                <p className="text-sm text-emerald-700 mt-1">
                  {resultado.cantidad_registros || 0} empleados procesados para {mes} de {anio}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
