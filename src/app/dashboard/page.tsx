'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/contexto-autenticacion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, FileText, Database, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';

import { DepartmentCostChart } from '@/app/dashboard/department-cost-chart';
import { RecentActivity } from '@/app/dashboard/recent-activity';
import { MetricCard } from '@/app/dashboard/metric-card';
import { SalaryChart } from '@/app/dashboard/salary-chart';
import { WorkHoursTracker } from '@/app/dashboard/work-hours-tracker';
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());

  const MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const cargarEstadisticas = useCallback(async () => {
    try {
      setLoading(true);      
      const data = await apiClient.get('/empleados/estadisticas');
      setStats(data);
    } catch (error) {
      console.error('Error al sincronizar dashboard:', error);
      setStats(null); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);
  
  const tieneDatos = stats && stats.total_empleados > 0;

  // Gráfica de Pastel 
  const datosGastosDepto = tieneDatos && stats.departamentos 
    ? Object.entries(stats.departamentos).map(([nombre, conteo]) => ({
        name: nombre,
        total: (stats.costo_por_departamento?.[nombre] || 0) as number
      }))
    : [];

  // Gráfica de Área: mostrar los 12 meses
  const datosHistorico = tieneDatos && Array.isArray(stats.nomina_mensual)
    ? stats.nomina_mensual.map((item: any, idx: number) => ({
        name: MESES[idx] || `Mes ${idx+1}`,
        total: item.total || 0
      }))
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Panel de nómina</h1>
          <p className="text-slate-500">Datos reales</p>
        </div>
        <div className="flex gap-2 flex-col sm:flex-row">
          {/* Selector de Meses */}
          <select 
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
          >
            {MESES.map((mes, index) => (
              <option key={index} value={index}>
                {mes} {new Date().getFullYear()}
              </option>
            ))}
          </select>
          <Button onClick={cargarEstadisticas} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Sincronizar
          </Button>
        </div>
      </div>

      {!tieneDatos ? (
        /* ESTADO VACÍO: Cuando no hay datos en la base de datos */
        <Card className="border-dashed border-2 bg-white/50 py-20">
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <Database className="h-12 w-12 text-blue-600" />
            </div>
            <div className="max-w-md">
              <h2 className="text-2xl font-bold text-slate-900">Base de datos vacía</h2>
              <p className="text-slate-500 mt-2">
                No hemos encontrado registros de empleados. Por favor, ve a la sección de 
                <strong> Importar</strong> y sube el archivo Excel para activar la nómina.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* PANEL ACTIVO: Solo se muestra si hay datos reales */
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard 
              title="Nómina Real"
              value={new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(stats.total_nomina_mes || 0)}
              icon="DollarSign"
              change="Actualizado"
              changeType="increase"
              description="Basado en sueldos base"
            />
            <MetricCard 
              title="Colaboradores"
              value={stats.total_empleados?.toString()}
              icon="Users"
              change={`${stats.empleados_activos}`}
              changeType="increase"
              description="En la base de datos"
            />
            <MetricCard 
              title="Promedio Salarial"
              value={new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(stats.promedio_salario || 0)}
              icon="PiggyBank"
              change="Sincronizado"
              changeType="increase"
              description="Promedio actual"
            />
            <WorkHoursTracker />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4 shadow-sm border-slate-200">
              <CardHeader><CardTitle>Gasto de Nómina Actual</CardTitle></CardHeader>
              <CardContent><SalaryChart data={datosHistorico} /></CardContent>
            </Card>

            <Card className="col-span-full lg:col-span-3 shadow-sm border-slate-200">
              <CardHeader><CardTitle>Distribución Real</CardTitle></CardHeader>
              <CardContent><DepartmentCostChart data={datosGastosDepto} /></CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}