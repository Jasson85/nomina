import { absences } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AbsenceTable } from '@/components/absences/absence-table';

export default async function AbsencesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Ausencias</CardTitle>
        <CardDescription>
          Vea, filtre y gestione todas las solicitudes de ausencia de los empleados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AbsenceTable absences={absences} showEmployee={true} />
      </CardContent>
    </Card>
  );
}
