"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; 
import { 
  User, 
  Briefcase, 
  FileText, 
  CreditCard, 
  MessageSquare,
  Clock,
  ExternalLink
} from "lucide-react";
import { Empleado } from "@/lib/tipos";
import { TablaAusencias } from "@/components/ausencias/tabla-ausencias";

interface PropiedadesDetalles {
  empleado: Empleado;
}

export function DetallesEmpleadoTabs({ empleado }: PropiedadesDetalles) {
  
  const esActivo = empleado.activo === true;

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">Información General</TabsTrigger>
        <TabsTrigger value="ausencias">Historial de Ausencias</TabsTrigger>
        <TabsTrigger value="documentos">Documentos / HV</TabsTrigger>
        <TabsTrigger value="nomina">Nómina</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <User className="h-5 w-5" /> Datos Personales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Identificación:</span>
                <span className="font-medium">{empleado.numero_documento}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Teléfono:</span>
                <span className="font-medium">{empleado.telefono_celular || 'No registrado'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{empleado.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado:</span>
                <Badge variant={esActivo ? 'default' : 'secondary'} className={esActivo ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                  {esActivo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Briefcase className="h-5 w-5" /> Información Contractual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Cargo:</span>
                <span className="font-medium">{empleado.cargo}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Departamento:</span>
                <span className="font-medium">{empleado.departamento_empresa}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Seguridad Social:</span>
                <div className="text-right">
                    <p className="text-xs font-bold text-blue-600">EPS: {empleado.eps_nombre || 'No asignada'}</p>
                    <p className="text-xs font-bold text-blue-600">AFP: {empleado.afp_nombre || 'No asignada'}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha Ingreso:</span>
                <span className="font-medium">{empleado.fecha_ingreso}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 text-lg">
                <MessageSquare className="h-5 w-5" /> Observaciones y Novedades de Pre-Nómina
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-white border border-amber-200 rounded-md min-h-[100px] text-sm whitespace-pre-wrap italic text-amber-900 shadow-sm">
                {empleado.observaciones || "Sin observaciones registradas para este periodo."}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="ausencias">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Registro de Incidencias</CardTitle>
          </CardHeader>
          <CardContent>
            {/* ausencias se cargarán vía API o vendrán en el objeto empleado si se hace Join */}
            <TablaAusencias ausencias={[]} mostrarEmpleado={false} />
            <p className="text-xs text-muted-foreground mt-4 italic text-center">
              Historial vinculado a la hoja de vida digital y reportes de nómina.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="documentos">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Expediente Digital</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded text-red-600 font-bold text-xs">PDF</div>
                <div>
                  <p className="font-medium">Hoja de Vida Oficial</p>
                  <p className="text-xs text-muted-foreground">Documento cargado en el expediente de PostgreSQL</p>
                </div>
              </div>
              {empleado.hoja_vida_url ? (
                <Button variant="outline" size="sm" asChild>
                  <a href={empleado.hoja_vida_url} target="_blank" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" /> Abrir Documento
                  </a>
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground italic">No se ha cargado documento</span>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="nomina">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Pre-Nómina Proyectada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 border rounded-xl bg-green-50/50 flex justify-between items-center">
              <div>
                <p className="text-xs text-green-600 uppercase font-bold tracking-wider">Salario Mensual Base</p>
                <p className="text-3xl font-bold text-green-700 mt-1">
                  {new Intl.NumberFormat('es-CO', { 
                    style: 'currency', 
                    currency: 'COP', 
                    minimumFractionDigits: 0 
                  }).format(empleado.salario_base)}
                </p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="bg-white border-green-200 text-green-700 mb-2">
                  Pago Activo
                </Badge>
                <p className="text-[10px] text-muted-foreground">Sujeto a deducciones legales de EPS/AFP</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}