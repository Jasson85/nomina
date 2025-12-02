'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export function WorkHoursTracker() {
  const { clockInTime } = useAuth();
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    if (!clockInTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - clockInTime.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const formattedTime = `${String(hours).padStart(2, '0')}:${String(
        minutes
      ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      setElapsedTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [clockInTime]);

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-primary">Horas Laboradas Hoy</CardTitle>
        <Clock className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{elapsedTime}</div>
        <p className="text-xs text-primary/80">
          Jornada iniciada a las {clockInTime?.toLocaleTimeString('es-CO') || '...'}
        </p>
      </CardContent>
    </Card>
  );
}
