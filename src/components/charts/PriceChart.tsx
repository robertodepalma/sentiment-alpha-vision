
import React from "react";
import { Area, ComposedChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartDataPoint, IndicatorConfig, Indicator } from "@/lib/types/chartTypes";

interface PriceChartProps {
  data: ChartDataPoint[];
  indicators: Record<Indicator, IndicatorConfig>;
}

export const PriceChart = ({ data, indicators }: PriceChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
            color: 'hsl(var(--foreground))'
          }}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="price" 
          fill="hsl(var(--chart-blue))" 
          fillOpacity={0.1} 
          stroke="hsl(var(--chart-blue))" 
          name="Price"
        />
        {indicators.sma.visible && (
          <Line 
            type="monotone" 
            dataKey="sma20" 
            stroke={indicators.sma.color} 
            dot={false} 
            name="SMA (20)"
          />
        )}
        {indicators.sma.visible && (
          <Line 
            type="monotone" 
            dataKey="sma50" 
            stroke={indicators.sma.color} 
            strokeDasharray="5 5"
            dot={false} 
            name="SMA (50)"
          />
        )}
        {indicators.ema.visible && (
          <Line 
            type="monotone" 
            dataKey="ema" 
            stroke={indicators.ema.color}
            dot={false} 
            name="EMA (21)"
          />
        )}
        {indicators.bb.visible && (
          <>
            <Line 
              type="monotone" 
              dataKey="upperBand" 
              stroke={indicators.bb.color}
              strokeDasharray="3 3"
              dot={false} 
              name="Upper Band"
            />
            <Line 
              type="monotone" 
              dataKey="lowerBand" 
              stroke={indicators.bb.color}
              strokeDasharray="3 3"
              dot={false} 
              name="Lower Band"
            />
          </>
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
