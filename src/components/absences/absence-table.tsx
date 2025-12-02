import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Absence } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AbsenceTableProps {
  absences: Absence[];
  showEmployee?: boolean;
}

export function AbsenceTable({
  absences,
  showEmployee = true,
}: AbsenceTableProps) {
  const getStatusBadge = (status: Absence['status']) => {
    switch (status) {
      case 'Aprobado':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rechazado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {showEmployee && <TableHead>Empleado</TableHead>}
            <TableHead>Tipo de Licencia</TableHead>
            <TableHead>Período</TableHead>
            <TableHead className="text-right">Días</TableHead>
            <TableHead className="text-center">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {absences.map((absence) => (
            <TableRow key={absence.id}>
              {showEmployee && (
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={absence.avatarUrl}
                        alt={absence.employeeName}
                        data-ai-hint={absence.avatarHint}
                      />
                      <AvatarFallback>
                        {absence.employeeName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{absence.employeeName}</span>
                  </div>
                </TableCell>
              )}
              <TableCell>{absence.leaveType}</TableCell>
              <TableCell>
                {format(new Date(absence.startDate), 'dd/MM/yy')} -{' '}
                {format(new Date(absence.endDate), 'dd/MM/yy')}
              </TableCell>
              <TableCell className="text-right">{absence.days}</TableCell>
              <TableCell className="text-center">
                <Badge className={getStatusBadge(absence.status)}>
                  {absence.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
       {absences.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
            No se encontraron ausencias.
        </div>
      )}
    </div>
  );
}
