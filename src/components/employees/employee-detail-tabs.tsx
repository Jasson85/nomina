"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  FileText,
  DollarSign,
  File,
  HardDrive,
  Upload,
} from 'lucide-react';
import type { Employee } from '@/lib/types';
import { getAbsencesByEmployeeId } from '@/lib/data';
import { AbsenceTable } from '../absences/absence-table';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import React from 'react';

interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}

function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-muted-foreground mt-1" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

export function EmployeeDetailTabs({ employee }: { employee: Employee }) {
  const employeeAbsences = getAbsencesByEmployeeId(employee.id);

  const [documents, setDocuments] = React.useState([
    { name: 'Contrato_Laboral.pdf', size: '2.3 MB', date: '2021-03-15' },
    { name: 'Hoja_de_Vida.pdf', size: '890 KB', date: '2021-03-01' },
    { name: 'Examen_Ingreso.pdf', size: '1.1 MB', date: '2021-03-10' },
  ]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newDocument = {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        date: new Date().toISOString().split('T')[0],
      };
      setDocuments(prev => [newDocument, ...prev]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-4 border-primary/50">
              <AvatarImage
                src={employee.avatarUrl}
                alt={employee.name}
                data-ai-hint={employee.avatarHint}
              />
              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{employee.name}</CardTitle>
            <CardDescription>{employee.position}</CardDescription>
            <Badge
              variant={employee.status === 'Activo' ? 'default' : 'secondary'}
              className={
                employee.status === 'Activo'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }
            >
              {employee.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem icon={User} label="ID Empleado" value={employee.id} />
            <DetailItem icon={Mail} label="Email" value={employee.email} />
            <DetailItem icon={Phone} label="Teléfono" value={employee.phone} />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Tabs defaultValue="contract" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contract">Contrato</TabsTrigger>
            <TabsTrigger value="absences">Ausencias</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="payroll">Nómina</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contract">
            <Card>
              <CardHeader>
                <CardTitle>Información del Contrato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <DetailItem
                  icon={Briefcase}
                  label="Departamento"
                  value={employee.department}
                />
                <DetailItem
                  icon={FileText}
                  label="Tipo de Contrato"
                  value={employee.contractType}
                />
                <DetailItem
                  icon={Calendar}
                  label="Fecha de Ingreso"
                  value={format(new Date(employee.startDate), "dd 'de' MMMM, yyyy", { locale: es })}
                />
                <DetailItem
                  icon={DollarSign}
                  label="Salario Mensual"
                  value={new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    maximumFractionDigits: 0,
                  }).format(employee.salary)}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="absences">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Ausencias</CardTitle>
              </CardHeader>
              <CardContent>
                <AbsenceTable absences={employeeAbsences} showEmployee={false} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="documents">
            <Card>
              <CardHeader className='flex-row items-center justify-between'>
                <CardTitle>Almacén de Documentos</CardTitle>
                <Button onClick={triggerFileUpload}>
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Documento
                </Button>
                <Input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileUpload} 
                />
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {documents.map((doc) => (
                    <li key={doc.name} className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <File className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">{doc.size} - {format(new Date(doc.date), 'dd/MM/yyyy')}</p>
                        </div>
                      </div>
                      <button className="text-sm text-primary hover:underline">Descargar</button>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 rounded-lg bg-muted/50 text-center">
                    <HardDrive className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Espacio utilizado: 4.3 MB / 1 GB</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="payroll">
             <Card>
                <CardHeader>
                    <CardTitle>Historial de Nómina</CardTitle>
                    <CardDescription>Próximamente...</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground py-12">
                    <p>Aquí se mostrará el historial de pagos de nómina del empleado.</p>
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
