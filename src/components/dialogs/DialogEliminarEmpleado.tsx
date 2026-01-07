'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DialogEliminarEmpleadoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empleadoId: string | null;
  empleadoNombre: string;
  onSuccess?: () => void;
}

export function DialogEliminarEmpleado({
  open,
  onOpenChange,
  empleadoId,
  empleadoNombre,
  onSuccess
}: DialogEliminarEmpleadoProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEliminar = async () => {
    if (!empleadoId) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/empleados/${empleadoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al eliminar empleado');

      toast({
        title: 'Éxito',
        description: `${empleadoNombre} ha sido eliminado correctamente`
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el empleado'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-red-600">Eliminar Empleado</DialogTitle>
              <DialogDescription className="mt-1">
                Esta acción no se puede deshacer
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 bg-red-50 rounded-lg border border-red-200 px-4">
          <p className="text-sm text-slate-600">
            ¿Está seguro de que desea eliminar a <strong>{empleadoNombre}</strong>? Se perderán todos los datos asociados.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleEliminar}
            disabled={isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
