'use client';
import * as React from 'react';
import Link from 'next/link';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Employee } from '@/lib/types';
import { cn } from '@/lib/utils';
import { EmployeeForm } from './employee-form';

export function EmployeeTable({ employees: initialEmployees }: { employees: Employee[] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [employees, setEmployees] = React.useState(initialEmployees);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const handleAddEmployee = (newEmployee: Omit<Employee, 'id' | 'avatarUrl' | 'avatarHint'>) => {
    const employeeWithDefaults: Employee = {
      id: `emp-${(employees.length + 1).toString().padStart(3, '0')}`,
      avatarUrl: `https://picsum.photos/seed/${Math.random()}/100/100`,
      avatarHint: 'person face',
      ...newEmployee,
    };
    setEmployees([employeeWithDefaults, ...employees]);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <Input
          placeholder="Buscar por nombre, email, posición..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Empleado
        </Button>
      </div>
      <EmployeeForm 
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleAddEmployee}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden md:table-cell">Posición</TableHead>
              <TableHead className="hidden lg:table-cell">Salario</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={employee.avatarUrl}
                        alt={employee.name}
                        data-ai-hint={employee.avatarHint}
                      />
                      <AvatarFallback>
                        {employee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">
                      <p>{employee.name}</p>
                      <p className="text-sm text-muted-foreground md:hidden">
                        {employee.position}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      employee.status === 'Activo' ? 'default' : 'secondary'
                    }
                    className={cn(
                        employee.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div>
                    <p className="font-medium">{employee.position}</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.department}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    maximumFractionDigits: 0,
                  }).format(employee.salary)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <Link href={`/employees/${employee.id}`} passHref>
                        <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredEmployees.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
            No se encontraron empleados.
        </div>
      )}
    </div>
  );
}
