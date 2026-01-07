'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { servicioEmpleados } from '@/lib/api';

interface DialogNuevoEmpleadoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DialogNuevoEmpleado({ open, onOpenChange, onSuccess }: DialogNuevoEmpleadoProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    primer_nombre: '',
    primer_apellido: '',
    numero_documento: '',
    email: '',
    salario_base: '',
    cargo: '',
    departamento_empresa: '',
    fecha_ingreso: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validaciones
      if (!formData.primer_nombre || !formData.primer_apellido || !formData.numero_documento) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Nombre, apellido y documento son obligatorios'
        });
        setIsLoading(false);
        return;
      }

      if (Number(formData.salario_base) <= 0) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'El salario debe ser mayor a 0'
        });
        setIsLoading(false);
        return;
      }

      await servicioEmpleados.crear({
        ...formData,
        salario_base: Number(formData.salario_base),
        fecha_ingreso: formData.fecha_ingreso,
        activo: true,
      });

      toast({
        title: 'Éxito',
        description: 'Empleado creado correctamente'
      });

      onOpenChange(false);
      setFormData({
        primer_nombre: '',
        primer_apellido: '',
        numero_documento: '',
        email: '',
        salario_base: '',
        cargo: '',
        departamento_empresa: '',
        fecha_ingreso: new Date().toISOString().split('T')[0],
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Error al crear empleado:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.response?.data?.detail || 'No se pudo crear el empleado'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Empleado</DialogTitle>
          <DialogDescription>
            Completa los datos básicos del nuevo empleado. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primer_nombre">Nombre *</Label>
              <Input
                id="primer_nombre"
                name="primer_nombre"
                placeholder="Juan"
                value={formData.primer_nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primer_apellido">Apellido *</Label>
              <Input
                id="primer_apellido"
                name="primer_apellido"
                placeholder="Pérez"
                value={formData.primer_apellido}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numero_documento">Documento *</Label>
            <Input
              id="numero_documento"
              name="numero_documento"
              placeholder="123456789"
              value={formData.numero_documento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="juan@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salario_base">Salario Base *</Label>
            <Input
              id="salario_base"
              name="salario_base"
              type="number"
              placeholder="2600000"
              value={formData.salario_base}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo</Label>
            <Input
              id="cargo"
              name="cargo"
              placeholder="Desarrollador"
              value={formData.cargo}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="departamento_empresa">Departamento</Label>
            <Input
              id="departamento_empresa"
              name="departamento_empresa"
              placeholder="Tecnología"
              value={formData.departamento_empresa}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha_ingreso">Fecha de Ingreso</Label>
            <Input
              id="fecha_ingreso"
              name="fecha_ingreso"
              type="date"
              value={formData.fecha_ingreso}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Empleado'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
