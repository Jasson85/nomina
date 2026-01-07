"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { servicioEmpleados } from "@/lib/api"; 
import { DetallesEmpleadoTabs } from "../detalles-empleado-tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, AlertCircle, Printer } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PaginaDetalleEmpleado() {
  const params = useParams();
  const router = useRouter();  
  
  const id = params.id ? parseInt(params.id as string) : null;
  
  const { data: empleado, isLoading, isError } = useQuery({
    queryKey: ["empleado", id],
    queryFn: () => (id ? servicioEmpleados.obtenerPorId(id) : null),
    enabled: !!id, 
  });

  //Estado de Carga
  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">
          Sincronizando ficha de nómina...
        </p>
      </div>
    );
  }

  // Estado de Error o Registro no encontrado
  if (isError || !empleado) {
    return (
      <div className="p-8 max-w-2xl mx-auto mt-10">
        <Alert variant="destructive" className="border-2">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-bold text-lg">Empleado no localizado</AlertTitle>
          <AlertDescription className="mt-2">
            No se pudo recuperar la información del empleado ID: {id}. 
            Verifique si el registro existe.
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/empleados')} className="mt-6" variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Volver al listado de personal
        </Button>
      </div>
    );
  } 

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Encabezado Dinámico */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.push('/empleados')}
            className="rounded-full hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 capitalize">
              {`${empleado.nombre} ${empleado.apellido || ''}`}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                {empleado.cargo}
              </span>
              <span className="text-muted-foreground text-sm">•</span>
              <span className="text-muted-foreground text-sm">Cédula: {empleado.cedula}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-2">
                <Printer className="h-4 w-4" /> Imprimir Ficha
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                Generar Volante Proyectado
            </Button>
        </div>
      </div>

      <div className="h-px bg-gray-200 w-full my-2" />

      {/* Pestañas de Detalles (Información, Pre-nómina, Documentos) */}
      <div className="bg-white rounded-xl shadow-sm border p-2">
        <DetallesEmpleadoTabs empleado={empleado} />
      </div>
    </div>
  );
}