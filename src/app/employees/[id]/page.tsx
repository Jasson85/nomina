import { notFound } from 'next/navigation';
import {
  getEmployeeById,
} from '@/lib/data';
import { EmployeeDetailTabs } from '@/components/employees/employee-detail-tabs';

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ⬅️ ESTA LÍNEA ES OBLIGATORIA EN NEXT 15
  const { id } = await params;

  const employee = getEmployeeById(id);

  if (!employee) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <EmployeeDetailTabs employee={employee} />
    </div>
  );
}

export async function generateStaticParams() {
  const employeeIds = [
    'emp-001',
    'emp-002',
    'emp-003',
    'emp-004',
    'emp-005',
    'emp-006',
    'emp-007',
    'emp-008',
  ];

  return employeeIds.map((id) => ({
    id,
  }));
}
