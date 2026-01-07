"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Ausencia } from '@/lib/tipos';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PropiedadesTablaAusencias {
  ausencias: Ausencia[];
  mostrarEmpleado?: boolean;
}

export function TablaAusencias({
  ausencias,
  mostrarEmpleado = true,
}: PropiedadesTablaAusencias) {  
  const obtenerBadgeEstado = (estado: Ausencia['estado']) => {
    switch (estado) {
      case 'aprobada':
        return 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200';
      case 'rechazada':
        return 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            {mostrarEmpleado && <TableHead>Empleado</TableHead>}
            <TableHead>Tipo de Ausencia</TableHead>
            <TableHead>Período</TableHead>
            <TableHead className="text-right">Días</TableHead>
            <TableHead className="text-center">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ausencias.map((ausencia) => (
            <TableRow key={ausencia.id}>
              {mostrarEmpleado && (
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {}
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {ausencia.nombre_empleado?.charAt(0) || 'E'}
                      </AvatarFallback>
                    </Avatar>
                    {}
                    <span className="font-medium text-sm">{ausencia.nombre_empleado}</span>
                  </div>
                </TableCell>
              )}
              {}
              <TableCell className="capitalize">{ausencia.tipo.replace('_', ' ')}</TableCell>
              <TableCell className="text-sm">
                {}
                {format(new Date(ausencia.fecha_inicio), 'dd MMM yyyy', { locale: es })} -{' '}
                {format(new Date(ausencia.fecha_fin), 'dd MMM yyyy', { locale: es })}
              </TableCell>
              <TableCell className="text-right font-semibold">{ausencia.dias}</TableCell>
              <TableCell className="text-center">
                <Badge 
                  className={obtenerBadgeEstado(ausencia.estado)} 
                  variant="outline"
                >
                  {}
                  {ausencia.estado.charAt(0).toUpperCase() + ausencia.estado.slice(1)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {ausencias.length === 0 && (
        <div className="text-center p-12 text-muted-foreground bg-slate-50/50">
          No hay novedades o ausencias registradas este mes.
        </div>
      )}
    </div>
  );
}