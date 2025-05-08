
import React from "react";

interface PriceDisplayProps {
  currentPrice: number;
  marketCap: string;
}

export const PriceDisplay = ({ currentPrice, marketCap }: PriceDisplayProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">Current Price</div>
        <div className="text-xl font-bold">${currentPrice.toFixed(2)}</div>
      </div>
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">Market Cap</div>
        <div className="text-xl font-bold">{marketCap}</div>
      </div>
    </div>
  );
};
