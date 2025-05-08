
import React from "react";
import { BarChart, ResponsiveContainer, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { ChartDataPoint } from "@/lib/types/chartTypes";

interface VolumeChartProps {
  data: ChartDataPoint[];
}

export const VolumeChart = ({ data }: VolumeChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
            color: 'hsl(var(--foreground))'
          }}
          formatter={(value) => new Intl.NumberFormat().format(value as number)}
        />
        <Bar 
          dataKey="volume" 
          fill="hsl(var(--chart-purple))" 
          name="Volume" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
