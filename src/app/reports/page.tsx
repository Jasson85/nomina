import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    {
      title: 'Contribuciones a Seguridad Social (PILA)',
      description: 'Genera el archivo plano para el pago de aportes a salud, pensión y ARL.',
    },
    {
      title: 'Declaraciones de Retención en la Fuente',
      description: 'Informe mensual de retenciones practicadas a los empleados.',
    },
    {
      title: 'Informe de Nómina por Centro de Costo',
      description: 'Desglose de costos de nómina por cada departamento o centro de costo.',
    },
    {
      title: 'Certificado de Ingresos y Retenciones',
      description: 'Genera los certificados anuales para los empleados.',
    },
    {
        title: 'Reporte de Provisiones (Cesantías, Intereses, Primas)',
        description: 'Informe detallado de las provisiones acumuladas para prestaciones sociales.'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generación de Reportes</CardTitle>
        <CardDescription>
          Seleccione y genere los reportes legales e internos que necesite.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.title}>
            <CardHeader className='flex-row gap-4 items-start'>
              <FileText className="h-8 w-8 text-primary mt-1" />
              <div>
                <CardTitle className='text-lg'>{report.title}</CardTitle>
                <CardDescription className='mt-1'>{report.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button className='w-full'>
                <Download className="mr-2 h-4 w-4" />
                Generar Reporte
              </Button>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
