'use client';

import * as React from 'react';
import { 
  MoreHorizontal, 
  PlusCircle, 
  FileText, 
  ShieldCheck, 
  Landmark,
  User,
  Search
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';
import { servicioEmpleados } from '@/lib/api';
import { FormularioEmpleado } from './formulario-empleado';
import type { Empleado } from '@/lib/tipos';

interface PropiedadesTabla {
  empleados: Empleado[];
  onActionComplete: () => void; 
}

export function TablaEmpleados({ empleados, onActionComplete }: PropiedadesTabla) {
  const [filtro, setFiltro] = React.useState('');
  const [formularioAbierto, setFormularioAbierto] = React.useState(false);
  const [cargando, setCargando] = React.useState(false);
  const { toast } = useToast();

 
  const listaFiltrada = empleados.filter(emp => 
    emp.nombre_completo?.toLowerCase().includes(filtro.toLowerCase()) ||
    emp.numero_documento?.includes(filtro) ||
    emp.eps_nombre?.toLowerCase().includes(filtro.toLowerCase())
  );

  const manejarEliminar = async (id: number) => {
    if (!confirm('¿Está seguro de desactivar este empleado?')) return;
    try {
      await servicioEmpleados.eliminar(id);
      toast({ title: "Empleado desactivado" });
      onActionComplete();
    } catch (error) {
      toast({ variant: "destructive", title: "Error al eliminar" });
    }
  };

  return (
    <div className="w-full">
      {/* Barra de herramientas de la tabla */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white border-b">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre, cédula o EPS..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setFormularioAbierto(true)} className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Empleado
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-bold">Colaborador</TableHead>
              <TableHead className="font-bold">Identificación</TableHead>
              <TableHead className="font-bold">Seguridad Social</TableHead>
              <TableHead className="font-bold">Sueldo Base</TableHead>
              <TableHead className="font-bold">Observaciones / Novedad</TableHead>
              <TableHead className="text-right font-bold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listaFiltrada.length > 0 ? (
              listaFiltrada.map((emp) => (
                <TableRow key={emp.id} className="hover:bg-slate-50/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border">
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{emp.nombre_completo || `${emp.primer_nombre} ${emp.primer_apellido}`}</span>
                        <span className="text-[11px] text-slate-500 uppercase font-semibold">{emp.cargo || 'Sin cargo'}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-sm text-slate-600">
                    {emp.numero_documento}
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" />
                        <span className="text-slate-500 font-medium">EPS:</span>
                        <span className="text-slate-700">{emp.eps_nombre || '---'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Landmark className="h-3 w-3 text-blue-500" />
                        <span className="text-slate-500 font-medium">AFP:</span>
                        <span className="text-slate-700">{emp.afp_nombre || '---'}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-semibold text-slate-700">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(emp.salario_base || 0)}
                  </TableCell>

                  <TableCell>
                    {emp.observaciones ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help group">
                              <div className="p-1.5 bg-amber-50 rounded-md group-hover:bg-amber-100 transition-colors">
                                <FileText className="h-4 w-4 text-amber-600" />
                              </div>
                              <span className="text-xs text-slate-500 italic truncate max-w-[120px]">
                                {emp.observaciones}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="bg-slate-900 text-white max-w-xs p-3">
                            <p className="text-xs leading-relaxed">{emp.observaciones}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-slate-300 text-[10px] italic">Sin novedades</span>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => alert('Ver ficha completa')}>Ver Detalles</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => manejarEliminar(emp.id)} className="text-red-600">
                          Desactivar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400 italic">
                  No se encontraron colaboradores con esos criterios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <FormularioEmpleado
        isOpen={formularioAbierto}
        onOpenChange={setFormularioAbierto}
        onSave={async (datos) => {
          setCargando(true);
          try {
            await servicioEmpleados.crear(datos);
            toast({ title: "Guardado correctamente" });
            onActionComplete();
            setFormularioAbierto(false);
          } catch (e) {
            toast({ variant: "destructive", title: "Error al guardar" });
          } finally {
            setCargando(false);
          }
        }}
        estaCargando={cargando}
      />
    </div>
  );
}