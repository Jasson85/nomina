'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  FileSearch,
  Save,
  Loader2
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Empleado } from '@/lib/tipos';
import { useToast } from "@/hooks/use-toast";
import { DialogEditarEmpleado } from '@/components/dialogs/DialogEditarEmpleado';
import { DialogEliminarEmpleado } from '@/components/dialogs/DialogEliminarEmpleado';

interface AccionesEmpleadoProps {
  empleado: Empleado;
  onActualizar: () => void;
}

export function AccionesEmpleado({ empleado, onActualizar }: AccionesEmpleadoProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [observaciones, setObservaciones] = useState(empleado.observaciones || '');
  const [showDialogEditar, setShowDialogEditar] = useState(false);
  const [showDialogEliminar, setShowDialogEliminar] = useState(false);
  const { toast } = useToast();

  // Función para guardar cambios directamente en PostgreSQL
  const handleGuardarCambios = async () => {
    setIsSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/empleados/${empleado.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ observaciones }),
      });

      if (!response.ok) throw new Error('Error al actualizar en la base de datos');

      toast({
        title: "Sincronización exitosa",
        description: `Se han actualizado las observaciones de ${empleado.nombre_completo}.`,
      });

      setIsSheetOpen(false);
      onActualizar(); 
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "No se pudo conectar con PostgreSQL para guardar los cambios.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Gestión de Empleado</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsSheetOpen(true)}>
            <Edit className="mr-2 h-4 w-4 text-blue-600" />
            Editar / Anotar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDialogEditar(true)}>
            <Edit className="mr-2 h-4 w-4 text-amber-600" />
            Editar Datos
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDialogEliminar(true)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Dar de Baja
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Panel Lateral de Edición */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[450px]">
          <SheetHeader>
            <SheetTitle>Modificar Empleado</SheetTitle>
            <SheetDescription>
              Ajuste las observaciones de nómina o información del contrato para {empleado.nombre_completo}.
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input id="nombre" value={empleado.nombre_completo} disabled className="bg-muted" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cargo">Cargo Actual</Label>
              <Input id="cargo" value={empleado.cargo} disabled className="bg-muted" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="observaciones" className="text-blue-600 font-bold">
                Observaciones de nómina
              </Label>
              <Textarea 
                id="observaciones"
                placeholder="Escriba aquí novedades, descuentos o bonificaciones..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="min-h-[150px] border-blue-200 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <Button 
              onClick={handleGuardarCambios} 
              disabled={isSaving}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando... </>
              ) : (
                <> <Save className="mr-2 h-4 w-4" /> Guardar en Base de Datos </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsSheetOpen(false)} className="w-full">
              Cancelar
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <DialogEditarEmpleado
        open={showDialogEditar}
        onOpenChange={setShowDialogEditar}
        empleadoId={empleado.id}
        empleadoData={empleado}
        onSuccess={() => {
          onActualizar();
          setShowDialogEditar(false);
        }}
      />

      <DialogEliminarEmpleado
        open={showDialogEliminar}
        onOpenChange={setShowDialogEliminar}
        empleadoId={empleado.id}
        empleadoNombre={empleado.nombre_completo}
        onSuccess={onActualizar}
      />
    </>
  );
}