'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Download } from 'lucide-react';

export default function PayrollPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nómina</h1>
          <p className="text-muted-foreground mt-2">Gestiona y genera nóminas mensuales</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Nómina
        </Button>
      </div>

      {/* Filtros */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm font-medium">Mes</label>
          <select className="w-full mt-2 px-3 py-2 border rounded-md">
            <option>Enero</option>
            <option>Febrero</option>
            <option>Marzo</option>
            <option>Abril</option>
            <option>Mayo</option>
            <option>Junio</option>
            <option>Julio</option>
            <option>Agosto</option>
            <option>Septiembre</option>
            <option>Octubre</option>
            <option>Noviembre</option>
            <option>Diciembre</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Año</label>
          <select className="w-full mt-2 px-3 py-2 border rounded-md">
            <option>2024</option>
            <option>2025</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Estado</label>
          <select className="w-full mt-2 px-3 py-2 border rounded-md">
            <option>Todos</option>
            <option>Pendiente</option>
            <option>Generada</option>
            <option>Pagada</option>
          </select>
        </div>
      </div>

      {/* Tabla de nóminas */}
      <Card>
        <CardHeader>
          <CardTitle>Nóminas Registradas</CardTitle>
          <CardDescription>Listado de todas las nóminas generadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Período</th>
                  <th className="text-left py-3 px-4">Empleados</th>
                  <th className="text-left py-3 px-4">Total Salarios</th>
                  <th className="text-left py-3 px-4">Estado</th>
                  <th className="text-left py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td colSpan={5} className="py-8 px-4 text-center text-muted-foreground">
                    No hay nóminas registradas
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Resumen */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Nóminas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Este año</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pagado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">Nóminas pagadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Por procesar</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}