"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  FileText, 
  Loader2, 
  FileSpreadsheet, 
  PieChart, 
  ShieldCheck, 
  FileCheck 
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Definición de los tipos de reportes
interface Reporte {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function ReportsPage() {
  const { toast } = useToast();
  const [loadingReport, setLoadingReport] = useState<string | null>(null);

  const reports: Reporte[] = [
    {
      id: 'pila',
      title: 'Contribuciones PILA',
      description: 'Genera el archivo plano para el pago de aportes a salud, pensión y ARL según normatividad vigente.',
      icon: <ShieldCheck className="h-6 w-6" />,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 'costos-centro',
      title: 'Nómina por Centro de Costo',
      description: 'Desglose detallado de gastos de personal agrupados por departamentos y áreas operativas.',
      icon: <PieChart className="h-6 w-6" />,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      id: 'provisiones',
      title: 'Reporte de Provisiones',
      description: 'Cálculo de pasivos laborales: Cesantías, Intereses, Primas y Vacaciones acumuladas.',
      icon: <FileSpreadsheet className="h-6 w-6" />,
      color: 'text-green-600 bg-green-50'
    },
    {
      id: 'retencion',
      title: 'Retención en la Fuente',
      description: 'Certificado mensual de retenciones practicadas bajo el procedimiento 1 y 2.',
      icon: <FileCheck className="h-6 w-6" />,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      id: 'certificados',
      title: 'Certificados de Ingresos',
      description: 'Generación masiva de certificados de ingresos y retenciones para empleados activos e inactivos.',
      icon: <FileText className="h-6 w-6" />,
      color: 'text-slate-600 bg-slate-50'
    }
  ];

  const handleGenerateReport = async (reportId: string, title: string) => {
    setLoadingReport(reportId);
    
    try {
      // Simulación de petición al Backend (FastAPI)
      // En producción usarías: await axios.get(`/api/reportes/generar/${reportId}`, { responseType: 'blob' });
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      
      toast({
        title: "¡Éxito!",
        description: `El reporte "${title}" ha sido generado y descargado.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de generación",
        description: "No se pudo conectar con el servicio de reportes. Intente más tarde.",
      });
    } finally {
      setLoadingReport(null);
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* Encabezado de la página */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Centro de Reportes</h1>
        <p className="text-slate-500 max-w-2xl">
          Gestione y descargue los informes legales, contables y administrativos basados en los datos de la nómina.
        </p>
      </div>

      <hr className="border-slate-200" />

      {/* Grid de Reportes */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="flex flex-col border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className='flex-row gap-4 items-start space-y-0'>
              <div className={`p-3 rounded-xl ${report.color}`}>
                {report.icon}
              </div>
              <div className="flex flex-col gap-1">
                <CardTitle className='text-lg font-bold text-slate-800'>{report.title}</CardTitle>
                <CardDescription className='text-xs leading-relaxed'>
                  {report.description}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="mt-auto pt-4">
              <Button 
                variant="outline"
                className='w-full border-primary/20 hover:bg-primary/5 text-primary font-semibold' 
                onClick={() => handleGenerateReport(report.id, report.title)}
                disabled={loadingReport !== null}
              >
                {loadingReport === report.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generar Reporte
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Nota al pie */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <p className="text-xs text-slate-600 font-medium">
          Los reportes se sincronizan en tiempo real con la base de datos de empleados. 
          Cualquier cambio en las <strong>Observaciones de nómina</strong> se reflejará inmediatamente.
        </p>
      </div>
    </div>
  );
}