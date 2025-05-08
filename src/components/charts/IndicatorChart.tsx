
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComposedChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";
import { ChartDataPoint, IndicatorConfig, Indicator } from "@/lib/types/chartTypes";

interface IndicatorChartProps {
  data: ChartDataPoint[];
  indicators: Record<Indicator, IndicatorConfig>;
}

export const IndicatorChart = ({ data, indicators }: IndicatorChartProps) => {
  return (
    <>
      <Select defaultValue="rsi" onValueChange={(val) => {}}>
        <SelectTrigger className="w-[180px] mb-2">
          <SelectValue placeholder="Select Indicator" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rsi">RSI</SelectItem>
          <SelectItem value="macd">MACD</SelectItem>
        </SelectContent>
      </Select>
      <ResponsiveContainer width="100%" height="90%">
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
          <Line 
            type="monotone" 
            dataKey="rsi" 
            stroke={indicators.rsi.color} 
            dot={false}
            name="RSI (14)"
          />
          {/* Reference lines for RSI */}
          <Line 
            type="monotone" 
            dataKey={() => 70} 
            stroke="hsl(var(--muted-foreground))" 
            strokeDasharray="3 3"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey={() => 30} 
            stroke="hsl(var(--muted-foreground))" 
            strokeDasharray="3 3"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
};
