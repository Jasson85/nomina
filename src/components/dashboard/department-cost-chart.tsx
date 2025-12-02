'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { getDepartmentCostData } from '@/lib/data';

const chartData = getDepartmentCostData();

const chartConfig = {
  total: {
    label: 'Total',
  },
  Tecnología: {
    label: 'Tecnología',
    color: 'hsl(var(--chart-1))',
  },
  'Recursos Humanos': {
    label: 'RRHH',
    color: 'hsl(var(--chart-2))',
  },
  Ventas: {
    label: 'Ventas',
    color: 'hsl(var(--chart-3))',
  },
  Marketing: {
    label: 'Marketing',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function DepartmentCostChart() {
    const totalValue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.total, 0);
  }, []);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="total"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        >
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
                        className="fill-foreground text-3xl font-bold"
                        >
                        {totalValue.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0, notation: 'compact' })}
                        </tspan>
                        <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                        >
                        Total
                        </tspan>
                    </text>
                    )
                }
                }}
            />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-mt-4 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
