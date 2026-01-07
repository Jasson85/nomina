'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

import type { Departamento, TipoContrato } from '@/lib/tipos';
import React, { useEffect } from 'react';
import { FileUp, Loader2, Info } from 'lucide-react';

const employeeSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  email: z.string().email('Email inválido.'),
  phone: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos.'),
  position: z.string().min(3, 'El cargo debe tener al menos 3 caracteres.'),
  
  department: z.string().min(1, 'Seleccione un departamento'),
  salary: z.coerce.number().min(1, 'El salario debe ser mayor a 0.'),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Fecha de inicio inválida.'),
  contractType: z.string().min(1, 'Seleccione tipo de contrato'),
  status: z.enum(['Activo', 'Inactivo']),
  observations: z.string().optional(),
  resume: z.any().optional(),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

const DEPARTAMENTOS: Departamento[] = ['TECNOLOGIA', 'RECURSOS_HUMANOS', 'VENTAS', 'MARKETING'];
const TIPOS_CONTRATO: TipoContrato[] = ['INDEFINIDO', 'TERMINO_FIJO', 'OBRA_LABOR'];

interface PropiedadesFormularioEmpleado {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (data: EmployeeFormData) => void;
  estaCargando?: boolean; 
}

export function FormularioEmpleado({ isOpen, onOpenChange, onSave, estaCargando = false }: PropiedadesFormularioEmpleado) {
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      position: '',
      department: 'Tecnología',
      salary: 0,
      startDate: new Date().toISOString().split('T')[0],
      contractType: 'Indefinido',
      status: 'Activo',
      observations: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = (data: EmployeeFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[95vh] overflow-y-auto shadow-2xl border-t-4 border-t-primary">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Registro de Personal</DialogTitle>
          <DialogDescription>
            Ingrese los datos contractuales. Esta información alimenta directamente la base de nómina.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              
              {/* NOMBRE COMPLETO */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-semibold text-gray-700">Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Juan Pérez" {...field} className="focus-visible:ring-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ... OTROS CAMPOS IGUAL ... */}

              {/* DEPARTAMENTO */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-700">Departamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione área" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DEPARTAMENTOS.map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SALARIO */}
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    {}
                    <FormLabel className="font-semibold text-blue-600">Salario Base (COP)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ej: 3500000" {...field} className="border-blue-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TIPO CONTRATO */}
              <FormField
                control={form.control}
                name="contractType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-700">Tipo de Contrato</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIPOS_CONTRATO.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* RESTO DEL FORMULARIO */}
              
            </div>

            <DialogFooter className="gap-2 sm:gap-0 border-t pt-6">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={estaCargando}>
                Cancelar
              </Button>
              <Button type="submit" disabled={estaCargando} className="px-8 font-bold">
                {estaCargando ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
                ) : (
                    'Finalizar Registro'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}