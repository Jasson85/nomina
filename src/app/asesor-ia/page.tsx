import { AdvisorForm } from '@/components/asesor-ia/advisor-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export default function LeaveAdvisorPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
       <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Asesor de Políticas de Licencia con IA</h1>
        <p className="text-muted-foreground mt-2">
            Obtenga recomendaciones inteligentes para la gestión de ausencias.
        </p>
      </div>

      <div className="flex items-start gap-4 rounded-lg border border-primary/20 bg-primary/5 p-4 text-primary">
          <Lightbulb className="h-6 w-6 mt-1 flex-shrink-0" />
          <div className='flex-grow'>
            <h3 className="font-semibold">¿Cómo funciona?</h3>
            <p className="text-sm">
            Ingrese los detalles de la solicitud de licencia junto con las políticas de la empresa y las leyes aplicables. Nuestra IA analizará la información para proporcionar una recomendación clara, citando las políticas y leyes relevantes para ayudarle a tomar una decisión informada y consistente.
            </p>
          </div>
      </div>
      
      <AdvisorForm />
    </div>
  );
}
