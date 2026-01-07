'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// 1. Definimos la interfaz para eliminar el error de tipado (any)
export interface ActividadReciente {
  id: string | number;
  titulo: string;
  descripcion: string;
  tiempo: string;
  urlAvatar?: string;
  sugerenciaAvatar?: string;
}

// 2. Definimos las props del componente
interface RecentActivityProps {
  actividades: ActividadReciente[];
}

export function RecentActivity({ actividades }: RecentActivityProps) {
  // Si no hay actividades, mostramos un mensaje amigable
  if (!actividades || actividades.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground italic">
        No hay actividad reciente registrada en la pre-nómina.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {actividades.map((item: ActividadReciente) => (
        <div key={item.id} className="flex items-center">
          <Avatar className="h-9 w-9 border">
            <AvatarImage 
              src={item.urlAvatar} 
              alt={item.titulo} 
            />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {item.titulo.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-semibold leading-none text-slate-900">
              {item.titulo}
            </p>
            <p className="text-sm text-muted-foreground">
              {item.descripcion}
            </p>
          </div>
          <div className="ml-auto font-medium text-[10px] uppercase text-slate-400">
            {item.tiempo}
          </div>
        </div>
      ))}
    </div>
  );
}