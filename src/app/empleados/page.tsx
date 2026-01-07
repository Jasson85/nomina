'use client';

import React, { useRef, useState } from 'react';
import { useEmpleados } from '@/hooks/use-empleados';
import { TablaEmpleados } from '@/components/empleados/TablaEmpleados';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Download, DollarSign, Users, AlertCircle, TrendingUp, Upload, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { DialogNuevoEmpleado } from '@/components/dialogs/DialogNuevoEmpleado';
import { DialogExportarNomina } from '@/components/dialogs/DialogExportarNomina';
import * as XLSX from 'xlsx';
import { servicioEmpleados } from '@/lib/api';

export default function EmpleadosPage() {
  const { 
    empleados, 
    isLoading, 
    terminoBusqueda, 
    setTerminoBusqueda, 
    estadisticas,
    paginacion, 
    refrescar   
  } = useEmpleados();

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showDialogNuevo, setShowDialogNuevo] = useState(false);
  const [showDialogExportar, setShowDialogExportar] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

 const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    
    try {      
      const response = await servicioEmpleados.importarDesdeArchivo(file);
    
      toast({
        title: "Sincronización Exitosa",
        description: `Proceso completado: ${response.resultado.creados} creados y ${response.resultado.actualizados} actualizados.`,
      });
      
      refrescar(); 

    } catch (error: any) {      
      const mensajeError = error.response?.data?.detail || "No se pudo conectar con el servidor de nómina.";
      
      toast({
        variant: "destructive",
        title: "Error de Importación",
        description: mensajeError,
      });
    } finally {
      setIsImporting(false);      
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50/30 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Empleados</h1>
          <p className="text-slate-500">Gestión financiera y administrativa de personal.</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx, .xls" className="hidden" />
          
          <Button variant="outline" className="shadow-sm border-slate-200" onClick={handleImportClick} disabled={isImporting}>
            {isImporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
            {isImporting ? 'Importando...' : 'Importar Excel'}
          </Button>

          <Button variant="outline" className="shadow-sm border-slate-200" onClick={() => setShowDialogExportar(true)}>
            <Download className="h-4 w-4 mr-2" /> Exportar
          </Button>

          <Button className="bg-blue-600 hover:bg-blue-700 shadow-md" onClick={() => setShowDialogNuevo(true)}>
            <UserPlus className="h-4 w-4 mr-2" /> Nuevo Registro
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ResumenCard 
          titulo="Costo Neto Total" 
          valor={new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(estadisticas.nominaTotal)}
          icono={<DollarSign className="h-4 w-4 text-emerald-600" />}
          subtitulo="Total a dispersar"
        />
        <ResumenCard 
          titulo="Personal Activo" 
          valor={estadisticas.conteoActivos.toString()}
          icono={<Users className="h-4 w-4 text-blue-600" />}
          subtitulo="En nómina actual"
        />
        <ResumenCard 
          titulo="Novedades" 
          valor={estadisticas.conNovedades.toString()}
          icono={<AlertCircle className="h-4 w-4 text-amber-600" />}
          subtitulo="Con observaciones"
        />
        <ResumenCard 
          titulo="Promedio Neto" 
          valor={new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(estadisticas.promedioSalarial)}
          icono={<TrendingUp className="h-4 w-4 text-indigo-600" />}
          subtitulo="Por colaborador"
        />
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Filtrar por nombre, cédula o departamento..."
          className="max-w-md bg-white border-slate-200 shadow-sm h-11"
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
        />
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <TablaEmpleados 
            empleados={empleados} 
            isLoading={isLoading} 
            pagination={paginacion}      
            onActionComplete={refrescar} 
          />
        </div>
      </div>

      <DialogNuevoEmpleado 
        open={showDialogNuevo} 
        onOpenChange={setShowDialogNuevo}
        onSuccess={refrescar}
      />
      
      <DialogExportarNomina
        open={showDialogExportar}
        onOpenChange={setShowDialogExportar}
      />
    </div>
  );
}

function ResumenCard({ titulo, valor, icono, subtitulo }: { titulo: string, valor: string, icono: React.ReactNode, subtitulo: string }) {
  return (
    <Card className="border-slate-100 shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{titulo}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-lg">{icono}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{valor}</div>
        <p className="text-xs text-slate-400 mt-1 font-medium">{subtitulo}</p>
      </CardContent>
    </Card>
  );
}