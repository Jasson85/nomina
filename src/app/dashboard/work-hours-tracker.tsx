'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useAuth } from '@/context/contexto-autenticacion';

export function WorkHoursTracker() {
  const { user } = useAuth();   
  
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {    
    const savedTime = localStorage.getItem(`clock-in-${user?.id}`);
    if (savedTime) {
      setStartTime(new Date(savedTime));
    } else {
      
      const now = new Date();
      setStartTime(now);
      localStorage.setItem(`clock-in-${user?.id}`, now.toISOString());
    }
  }, [user]);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsedTime(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <Card className="bg-blue-50/50 border-blue-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-blue-700">Tiempo de Jornada</CardTitle>
        <Clock className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-900 tracking-tight">{elapsedTime}</div>
        <p className="text-[10px] uppercase font-medium text-blue-600/80 mt-1">
          Ingreso registrado: {startTime?.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) || '--:--'}
        </p>
      </CardContent>
    </Card>
  );
}