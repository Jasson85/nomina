'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, DollarSign, Users, PiggyBank, Briefcase } from 'lucide-react';
import type { ElementType } from 'react';
import type { MetricCardIcon } from '@/lib/types';

const iconMap: Record<MetricCardIcon, ElementType> = {
  DollarSign,
  Users,
  PiggyBank,
  Briefcase,
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: MetricCardIcon;
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="flex items-center text-xs text-muted-foreground">
          <span
            className={cn(
              'flex items-center gap-1 font-semibold',
              isIncrease ? 'text-green-600' : 'text-red-600'
            )}
          >
            {isIncrease ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            {change}
          </span>
          <span className="ml-1">{description}</span>
        </p>
      </CardContent>
    </Card>
  );
}
