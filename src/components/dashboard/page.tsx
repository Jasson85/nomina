'use client';

import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { WorkHoursTracker } from '@/components/dashboard/work-hours-tracker';
import { SalaryChart } from '@/components/dashboard/salary-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { DepartmentCostChart } from '@/components/dashboard/department-cost-chart';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bienvenido, {user?.nombre || 'Usuario'}</h1>
          <p className="text-muted-foreground mt-2">Panel de control de NominaColombia</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nóminas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ausencias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reportes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Generados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestión de Empleados
            </CardTitle>
            <CardDescription>Administra empleados y sus datos</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/employees">
              <Button className="w-full">Ver Empleados</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Nómina
            </CardTitle>
            <CardDescription>Genera y gestiona nóminas</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/payroll">
              <Button className="w-full">Ir a Nómina</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Ausencias
            </CardTitle>
            <CardDescription>Gestiona ausencias y permisos</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/absences">
              <Button className="w-full">Ver Ausencias</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Reportes
            </CardTitle>
            <CardDescription>Analiza datos y reportes</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/reports">
              <Button className="w-full">Ver Reportes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos adicionales */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Salarios por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <SalaryChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Costos por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentCostChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horas de Trabajo</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkHoursTracker />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}