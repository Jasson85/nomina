'use client';
import { useEffect, useState, useTransition } from 'react';
import { useFormState } from 'react-dom';
import { getPolicyAdvice, getEmployeeOptions } from '@/app/asesor-ia/actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RecommendationDisplay } from './recommendation-display';
import { WandSparkles } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const formSchema = z.object({
  employeeId: z.string().min(1, "Debe seleccionar un empleado."),
  leaveType: z.string().min(1, 'El tipo de licencia es requerido.'),
  startDate: z.string().min(1, 'La fecha de inicio es requerida.'),
  endDate: z.string().min(1, 'La fecha de fin es requerida.'),
  reason: z.string().min(10, 'La razón debe tener al menos 10 caracteres.'),
  companyPolicies: z.string().min(20, 'Las políticas de la empresa deben tener al menos 20 caracteres.'),
  relevantLaws: z.string().min(20, 'Las leyes relevantes deben tener al menos 20 caracteres.'),
});

const initialState = {
  message: '',
};

type EmployeeOption = {
    value: string;
    label: string;
}

export function AdvisorForm() {
  const [state, formAction] = useFormState(getPolicyAdvice, initialState);
  const [isPending, startTransition] = useTransition();
  const [employeeOptions, setEmployeeOptions] = useState<EmployeeOption[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: '',
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
      companyPolicies: 'Todo empleado tiene derecho a 15 días hábiles de vacaciones remuneradas por cada año de servicio. Las licencias no remuneradas pueden ser otorgadas a discreción de la gerencia por un máximo de 30 días al año. Las incapacidades médicas deben ser certificadas por la EPS.',
      relevantLaws: 'Código Sustantivo del Trabajo, Artículo 186: Vacaciones. Ley 100 de 1993: Sistema de Seguridad Social Integral.',
    },
  });

  useEffect(() => {
    async function fetchEmployees() {
        const options = await getEmployeeOptions();
        setEmployeeOptions(options);
    }
    fetchEmployees();
  }, [])

  function onSubmit(data: z.infer<typeof formSchema>) {
    startTransition(() => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formAction(formData);
    });
  }

  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle>Analizar Solicitud de Licencia</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="employeeId"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Empleado</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un empleado" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {employeeOptions.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="leaveType"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Tipo de Licencia</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Vacaciones, Incapacidad Médica" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Fecha de Inicio</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Fecha de Fin</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Razón de la Solicitud</FormLabel>
                                <FormControl>
                                    <Textarea rows={3} placeholder="Describa brevemente el motivo de la licencia..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="companyPolicies"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Políticas de la Empresa</FormLabel>
                                <FormControl>
                                    <Textarea rows={4} {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="relevantLaws"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Leyes Colombianas Relevantes</FormLabel>
                                <FormControl>
                                    <Textarea rows={4} {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending} className="w-full">
                            <WandSparkles className="mr-2 h-4 w-4" />
                            {isPending ? 'Analizando...' : 'Obtener Recomendación'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

        <RecommendationDisplay state={state} isPending={isPending} />

    </div>
  );
}
