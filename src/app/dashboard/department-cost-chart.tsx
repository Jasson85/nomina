'use client';

import * as React from 'react';
import { Label, Pie, PieChart, Cell } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

interface DepartmentData {
  name: string;
  total: number;
  fill?: string;
}

// Colores vibrantes para las secciones
const COLORES = [
  '#3B82F6', // Azul
  '#EF4444', // Rojo
  '#10B981', // Verde
  '#F59E0B', // Ámbar
  '#8B5CF6', // Púrpura
  '#EC4899', // Rosa
  '#06B6D4', // Cyan
  '#84CC16', // Lima
  '#F97316', // Naranja
  '#6366F1', // Indigo
];

const chartConfig = {
  total: { label: 'Total' },
} satisfies ChartConfig;

// Recibimos los datos 
export function DepartmentCostChart({ data }: { data: DepartmentData[] }) {
  const totalValue = React.useMemo(() => {    
    return data.reduce((acc: number, curr: DepartmentData) => acc + curr.total, 0);
  }, [data]);

  // Asignar colores a los datos
  const dataConColores = data.map((item, index) => ({
    ...item,
    fill: item.fill || COLORES[index % COLORES.length]
  }));

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[300px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={dataConColores}
          dataKey="total"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        >
          {dataConColores.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {totalValue.toLocaleString("es-CO", { 
                        style: "currency", 
                        currency: "COP", 
                        maximumFractionDigits: 0, 
                        notation: 'compact' 
                      })}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground text-xs"
                    >
                      Nómina Total
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-mt-2 flex-wrap gap-2"
        />
      </PieChart>
    </ChartContainer>
  );
}