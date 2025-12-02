import { subDays, subMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';
import type {
  Employee,
  Absence,
  RecentActivityItem,
  DashboardMetrics,
} from './types';
import { PlaceHolderImages } from './placeholder-images';

const avatarMap = new Map(
  PlaceHolderImages.map((img) => [img.id, { url: img.imageUrl, hint: img.imageHint }])
);

export const employees: Employee[] = [
  {
    id: 'emp-001',
    name: 'Ana García',
    avatarUrl: avatarMap.get('avatar-1')?.url || '',
    avatarHint: avatarMap.get('avatar-1')?.hint || '',
    position: 'Desarrolladora Frontend Senior',
    department: 'Tecnología',
    email: 'ana.garcia@example.com',
    phone: '310-123-4567',
    startDate: '2021-03-15',
    salary: 8500000,
    contractType: 'Indefinido',
    status: 'Activo',
  },
  {
    id: 'emp-002',
    name: 'Carlos Rodriguez',
    avatarUrl: avatarMap.get('avatar-2')?.url || '',
    avatarHint: avatarMap.get('avatar-2')?.hint || '',
    position: 'Gerente de Proyectos',
    department: 'Tecnología',
    email: 'carlos.rodriguez@example.com',
    phone: '311-234-5678',
    startDate: '2020-07-01',
    salary: 12000000,
    contractType: 'Indefinido',
    status: 'Activo',
  },
  {
    id: 'emp-003',
    name: 'Sofia Martinez',
    avatarUrl: avatarMap.get('avatar-3')?.url || '',
    avatarHint: avatarMap.get('avatar-3')?.hint || '',
    position: 'Analista de RRHH',
    department: 'Recursos Humanos',
    email: 'sofia.martinez@example.com',
    phone: '312-345-6789',
    startDate: '2022-01-10',
    salary: 4500000,
    contractType: 'Término Fijo',
    status: 'Activo',
  },
  {
    id: 'emp-004',
    name: 'Javier Lopez',
    avatarUrl: avatarMap.get('avatar-4')?.url || '',
    avatarHint: avatarMap.get('avatar-4')?.hint || '',
    position: 'Ejecutivo de Cuentas',
    department: 'Ventas',
    email: 'javier.lopez@example.com',
    phone: '313-456-7890',
    startDate: '2021-11-20',
    salary: 5500000,
    contractType: 'Indefinido',
    status: 'Activo',
  },
  {
    id: 'emp-005',
    name: 'Valentina Perez',
    avatarUrl: avatarMap.get('avatar-5')?.url || '',
    avatarHint: avatarMap.get('avatar-5')?.hint || '',
    position: 'Especialista en Marketing Digital',
    department: 'Marketing',
    email: 'valentina.perez@example.com',
    phone: '314-567-8901',
    startDate: '2023-05-02',
    salary: 6000000,
    contractType: 'Obra o Labor',
    status: 'Activo',
  },
  {
    id: 'emp-006',
    name: 'David Gómez',
    avatarUrl: avatarMap.get('avatar-6')?.url || '',
    avatarHint: avatarMap.get('avatar-6')?.hint || '',
    position: 'Desarrollador Backend',
    department: 'Tecnología',
    email: 'david.gomez@example.com',
    phone: '315-678-9012',
    startDate: '2022-08-18',
    salary: 7800000,
    contractType: 'Indefinido',
    status: 'Inactivo',
  },
  {
    id: 'emp-007',
    name: 'Laura Ramirez',
    avatarUrl: avatarMap.get('avatar-7')?.url || '',
    avatarHint: avatarMap.get('avatar-7')?.hint || '',
    position: 'Diseñadora UX/UI',
    department: 'Tecnología',
    email: 'laura.ramirez@example.com',
    phone: '316-789-0123',
    startDate: '2023-02-25',
    salary: 7200000,
    contractType: 'Término Fijo',
    status: 'Activo',
  },
  {
    id: 'emp-008',
    name: 'Daniel Torres',
    avatarUrl: avatarMap.get('avatar-8')?.url || '',
    avatarHint: avatarMap.get('avatar-8')?.hint || '',
    position: 'Director de Ventas',
    department: 'Ventas',
    email: 'daniel.torres@example.com',
    phone: '317-890-1234',
    startDate: '2019-09-01',
    salary: 15000000,
    contractType: 'Indefinido',
    status: 'Activo',
  },
];

export const absences: Absence[] = [
  {
    id: 'abs-001',
    employeeId: 'emp-003',
    employeeName: 'Sofia Martinez',
    avatarUrl: avatarMap.get('avatar-3')?.url || '',
    avatarHint: avatarMap.get('avatar-3')?.hint || '',
    leaveType: 'Incapacidad Médica',
    startDate: '2024-05-20',
    endDate: '2024-05-22',
    days: 3,
    status: 'Aprobado',
    reason: 'Gripe fuerte, recomendación médica de reposo.',
  },
  {
    id: 'abs-002',
    employeeId: 'emp-005',
    employeeName: 'Valentina Perez',
    avatarUrl: avatarMap.get('avatar-5')?.url || '',
    avatarHint: avatarMap.get('avatar-5')?.hint || '',
    leaveType: 'Vacaciones',
    startDate: '2024-06-10',
    endDate: '2024-06-14',
    days: 5,
    status: 'Aprobado',
    reason: 'Viaje familiar programado.',
  },
  {
    id: 'abs-003',
    employeeId: 'emp-001',
    employeeName: 'Ana García',
    avatarUrl: avatarMap.get('avatar-1')?.url || '',
    avatarHint: avatarMap.get('avatar-1')?.hint || '',
    leaveType: 'Licencia no Remunerada',
    startDate: '2024-07-01',
    endDate: '2024-07-05',
    days: 5,
    status: 'Pendiente',
    reason: 'Asuntos personales urgentes.',
  },
  {
    id: 'abs-004',
    employeeId: 'emp-008',
    employeeName: 'Daniel Torres',
    avatarUrl: avatarMap.get('avatar-8')?.url || '',
    avatarHint: avatarMap.get('avatar-8')?.hint || '',
    leaveType: 'Licencia Remunerada',
    startDate: '2024-05-30',
    endDate: '2024-05-30',
    days: 1,
    status: 'Aprobado',
    reason: 'Cita para trámite de visa.',
  },
  {
    id: 'abs-005',
    employeeId: 'emp-002',
    employeeName: 'Carlos Rodriguez',
    avatarUrl: avatarMap.get('avatar-2')?.url || '',
    avatarHint: avatarMap.get('avatar-2')?.hint || '',
    leaveType: 'Vacaciones',
    startDate: '2024-08-19',
    endDate: '2024-08-30',
    days: 10,
    status: 'Pendiente',
    reason: 'Vacaciones de mitad de año.',
  },
];

export const recentActivity: RecentActivityItem[] = [
  {
    id: 'act-1',
    avatarUrl: avatarMap.get('avatar-3')?.url || '',
    avatarHint: avatarMap.get('avatar-3')?.hint || '',
    title: 'Nueva solicitud de ausencia',
    description: 'Sofia Martinez ha solicitado una licencia médica.',
    time: 'hace 15 minutos',
  },
  {
    id: 'act-2',
    avatarUrl: avatarMap.get('avatar-7')?.url || '',
    avatarHint: avatarMap.get('avatar-7')?.hint || '',
    title: 'Empleado añadido',
    description: 'Laura Ramirez ha sido añadida al departamento de Tecnología.',
    time: 'hace 2 horas',
  },
  {
    id: 'act-3',
    avatarUrl: avatarMap.get('avatar-5')?.url || '',
    avatarHint: avatarMap.get('avatar-5')?.hint || '',
    title: 'Ausencia aprobada',
    description: 'Las vacaciones de Valentina Perez han sido aprobadas.',
    time: 'hace 1 día',
  },
  {
    id: 'act-4',
    avatarUrl: avatarMap.get('avatar-6')?.url || '',
    avatarHint: avatarMap.get('avatar-6')?.hint || '',
    title: 'Estado de empleado actualizado',
    description: 'David Gómez ha sido marcado como Inactivo.',
    time: 'hace 2 días',
  },
];

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export const getDashboardMetrics = (): DashboardMetrics => {
  const activeEmployees = employees.filter((e) => e.status === 'Activo');
  const totalPayroll = activeEmployees.reduce((sum, e) => sum + e.salary, 0);
  const averageSalary = totalPayroll / activeEmployees.length;

  return {
    totalPayroll: currencyFormatter.format(totalPayroll),
    payrollChange: '+2.5%',
    payrollChangeType: 'increase',
    activeEmployees: activeEmployees.length,
    employeeChange: '+2',
    employeeChangeType: 'increase',
    averageSalary: currencyFormatter.format(averageSalary),
    avgSalaryChange: '+1.2%',
    avgSalaryChangeType: 'increase',
    onLeave: absences.filter(
      (a) =>
        a.status === 'Aprobado' &&
        new Date() >= new Date(a.startDate) &&
        new Date() <= new Date(a.endDate)
    ).length,
    onLeaveChange: '+1',
    onLeaveChangeType: 'increase',
  };
};

export const getSalaryChartData = () => {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => i)
    .reverse()
    .map((i) => {
      const month = subMonths(now, i);
      const randomFactor = 1 - (i * 0.02) + (Math.random() - 0.5) * 0.05;
      return {
        name: format(month, 'MMM', { locale: es }),
        total: Math.floor(68000000 * randomFactor),
      };
    });
};

export const getDepartmentCostData = () => {
  const departmentCosts = employees
    .filter((e) => e.status === 'Activo')
    .reduce((acc, employee) => {
      if (!acc[employee.department]) {
        acc[employee.department] = {
          name: employee.department,
          total: 0,
        };
      }
      acc[employee.department].total += employee.salary;
      return acc;
    }, {} as { [key: string]: { name: string; total: number } });

  return Object.values(departmentCosts);
};

export const getEmployeeById = (id: string) => {
  return employees.find((e) => e.id === id);
};

export const getAbsencesByEmployeeId = (id: string) => {
  return absences.filter((a) => a.employeeId === id);
};
