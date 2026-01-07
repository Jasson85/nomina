'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, DollarSign, Users, PiggyBank, Briefcase } from 'lucide-react';
import type { ElementType } from 'react';

export type IconoTarjetaMetrica = 'DollarSign' | 'Users' | 'PiggyBank' | 'Briefcase';

const iconMap: Record<IconoTarjetaMetrica, ElementType> = {
  DollarSign,
  Users,
  PiggyBank,
  Briefcase,
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: IconoTarjetaMetrica;
  change: string;
  changeType: 'increase' | 'decrease';
  description: string;
}

export function MetricCard({
  title,
  value,
  icon,
  change,
  changeType,
  description,
}: MetricCardProps) {
  const isIncrease = changeType === 'increase';
  const Icon = iconMap[icon];

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <p className="flex items-center text-xs text-muted-foreground mt-1">
          <span
            className={cn(
              'flex items-center gap-1 font-bold mr-1',
              isIncrease ? 'text-emerald-600' : 'text-rose-600'
            )}
          >
            {isIncrease ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            {change}
          </span>
          <span className="truncate">{description}</span>
        </p>
      </CardContent>
    </Card>
  );
}