'use server';

import { leavePolicyAdvisor } from '@/ai/flows/leave-policy-advisor';
import type {
  LeavePolicyAdvisorInput,
  LeavePolicyAdvisorOutput,
} from '@/ai/flows/leave-policy-advisor';
import { z } from 'zod';
import { employees } from '@/lib/data';

const formSchema = z.object({
  employeeId: z.string().min(1, "Debe seleccionar un empleado."),
  leaveType: z.string().min(1, 'El tipo de licencia es requerido.'),
  startDate: z.string().min(1, 'La fecha de inicio es requerida.'),
  endDate: z.string().min(1, 'La fecha de fin es requerida.'),
  reason: z.string().min(10, 'La razón debe tener al menos 10 caracteres.'),
  companyPolicies: z.string().min(20, 'Las políticas de la empresa deben tener al menos 20 caracteres.'),
  relevantLaws: z.string().min(20, 'Las leyes relevantes deben tener al menos 20 caracteres.'),
});

export type FormState = {
  message: string;
  data?: LeavePolicyAdvisorOutput;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export async function getPolicyAdvice(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    employeeId: formData.get('employeeId'),
    leaveType: formData.get('leaveType'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    reason: formData.get('reason'),
    companyPolicies: formData.get('companyPolicies'),
    relevantLaws: formData.get('relevantLaws'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Por favor, corrija los errores en el formulario.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const input: LeavePolicyAdvisorInput = validatedFields.data;

  try {
    const result = await leavePolicyAdvisor(input);
    return {
      message: 'Recomendación generada exitosamente.',
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message:
        'Ocurrió un error al contactar al asesor de IA. Por favor, intente de nuevo.',
    };
  }
}

// Action to get employee list for the form selector
export async function getEmployeeOptions() {
    return employees.map(emp => ({
        value: emp.id,
        label: `${emp.name} (${emp.id})`
    }));
}
