'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface DialogExportarNominaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function DialogExportarNomina({ open, onOpenChange }: DialogExportarNominaProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mes, setMes] = useState<string>(MESES[new Date().getMonth()]);
  const [anio, setAnio] = useState<string>(new Date().getFullYear().toString());

  const handleExportar = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const numMes = MESES.indexOf(mes) + 1;

      const response = await fetch(`${apiUrl}/nominas/periodo/${numMes}/${anio}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al obtener datos');

      const data = await response.json();

      // Convertir a CSV y descargar
      const csv = generarCSV(data);
      descargarCSV(csv, `nomina_${numMes}_${anio}.csv`);

      toast({
        title: 'Éxito',
        description: `Nómina de ${mes} exportada correctamente`
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error al exportar:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo exportar la nómina'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar Nómina</DialogTitle>
          <DialogDescription>
            Selecciona el período que deseas exportar en formato CSV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
            <Button onClick={handleExportar} disabled={isLoading}>
              {isLoading ? 'Exportando...' : 'Descargar CSV'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generarCSV(nominas: any[]): string {
  if (nominas.length === 0) return '';

  const headers = Object.keys(nominas[0]);
  const headerRow = headers.join(',');
  const dataRows = nominas.map(row =>
    headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value}"` : value;
    }).join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}

function descargarCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
