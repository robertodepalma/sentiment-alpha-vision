
import React from "react";

interface DataSourceInfoProps {
  priceSource?: string;
  lastUpdated: Date;
}

export const DataSourceInfo = ({ priceSource, lastUpdated }: DataSourceInfoProps) => {
  return (
    <div className="mt-4 text-xs text-muted-foreground flex justify-between items-center">
      <div>
        {priceSource === 'finnhub' ? "Price Source: Finnhub API (Real-time)" : 
         "Using estimated price data"}
      </div>
      <div>
        Updated: {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
};
