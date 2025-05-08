
import React from "react";
import { 
  ComposedChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { StockDataPoint } from "../chart-utils/generateStockData";

interface IndicatorChartProps {
  data: StockDataPoint[];
  selectedIndicator: string;
  indicatorColor: string;
}

export const IndicatorChart = ({ data, selectedIndicator, indicatorColor }: IndicatorChartProps) => {
  return (
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
          dataKey={selectedIndicator} 
          stroke={indicatorColor} 
          dot={false}
          name={`${selectedIndicator.toUpperCase()} (14)`}
        />
        {/* Reference lines for RSI */}
        {selectedIndicator === "rsi" && (
          <>
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
          </>
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
