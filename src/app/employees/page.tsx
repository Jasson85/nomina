import { employees } from '@/lib/data';
import { EmployeeTable } from '@/components/employees/employee-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function EmployeesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Empleados</CardTitle>
        <CardDescription>
          Busque, filtre y gestione la información de sus empleados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmployeeTable employees={employees} />
      </CardContent>
    </Card>
  );
}
