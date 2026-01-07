'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface DialogEditarEmpleadoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empleadoId: string | null;
  empleadoData?: any;
  onSuccess?: () => void;
}

export function DialogEditarEmpleado({
  open,
  onOpenChange,
  empleadoId,
  empleadoData,
  onSuccess
}: DialogEditarEmpleadoProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      nombre: empleadoData?.nombre || '',
      apellido: empleadoData?.apellido || '',
      email: empleadoData?.email || '',
      salario_base: empleadoData?.salario_base || '',
      telefono: empleadoData?.telefono || '',
      departamento: empleadoData?.departamento || ''
    }
  });

  useEffect(() => {
    if (empleadoData && open) {
      form.reset({
        nombre: empleadoData.nombre || '',
        apellido: empleadoData.apellido || '',
        email: empleadoData.email || '',
        salario_base: empleadoData.salario_base || '',
        telefono: empleadoData.telefono || '',
        departamento: empleadoData.departamento || ''
      });
    }
  }, [empleadoData, open, form]);

  const handleSubmit = async (data: any) => {
    if (!empleadoId) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/empleados/${empleadoId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          salario_base: parseFloat(data.salario_base),
          telefono: data.telefono,
          departamento: data.departamento
        })
      });

      if (!response.ok) throw new Error('Error al actualizar empleado');

      toast({
        title: 'Éxito',
        description: `${data.nombre} ha sido actualizado correctamente`
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error al actualizar:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar el empleado'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Empleado</DialogTitle>
          <DialogDescription>
            Actualiza los datos del empleado
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                {...form.register('nombre')}
                placeholder="Nombre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                {...form.register('apellido')}
                placeholder="Apellido"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salario_base">Salario Base</Label>
              <Input
                id="salario_base"
                type="number"
                {...form.register('salario_base')}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                {...form.register('telefono')}
                placeholder="3001234567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="departamento">Departamento</Label>
            <Input
              id="departamento"
              {...form.register('departamento')}
              placeholder="Departamento"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
