
import React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

interface TickerHeaderProps {
  ticker: string;
  name: string;
  priceChange: number;
}

export const TickerHeader = ({ ticker, name, priceChange }: TickerHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-baseline gap-2">
        <h3 className="text-lg font-bold">{ticker}</h3>
        <span className="text-muted-foreground">{name}</span>
      </div>
      <div className={`flex items-center rounded-full px-2 py-1 text-xs font-medium ${
        priceChange > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}>
        {priceChange > 0 ? <TrendingUp className="mr-1" size={12} /> : <TrendingDown className="mr-1" size={12} />}
        {priceChange > 0 ? "+" : ""}{priceChange.toFixed(2)}%
      </div>
    </div>
  );
};
