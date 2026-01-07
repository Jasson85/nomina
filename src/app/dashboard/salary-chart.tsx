'use client';

import * as React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';


export interface SalaryHistoryData {
  name: string; 
  total: number; 
}

const chartConfig = {
  total: {
    label: 'Nómina Total',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;


export function SalaryChart({ data }: { data: SalaryHistoryData[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
          top: 10
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)} // Ene, Feb, Mar...
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}          
          tickFormatter={(value) => `$${(Number(value) / 1000000).toFixed(1)}M`}
        />
        <ChartTooltip
          cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }}
          content={
            <ChartTooltipContent
              indicator="dot"
              formatter={(value) =>
                new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  maximumFractionDigits: 0,
                }).format(Number(value))
              }
            />
          }
        />
        <defs>
          <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-total)"
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor="var(--color-total)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="total"
          type="monotone" 
          fill="url(#fillTotal)"
          stroke="var(--color-total)"
          strokeWidth={2}
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}