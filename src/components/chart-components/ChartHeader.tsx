
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TimeRange } from "../chart-utils/generateStockData";

interface ChartHeaderProps {
  ticker: string;
  timeRange: TimeRange;
  setTimeRange: (value: TimeRange) => void;
}

export const ChartHeader = ({ ticker, timeRange, setTimeRange }: ChartHeaderProps) => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-xl font-bold">{ticker} Technical Analysis</h2>
        <p className="text-sm text-muted-foreground">
          Price data and technical indicators
          <span className="text-xs ml-2 text-muted-foreground">(Using simulated data)</span>
        </p>
      </div>
      <ToggleGroup 
        type="single" 
        value={timeRange} 
        onValueChange={(val) => val && setTimeRange(val as TimeRange)}
      >
        <ToggleGroupItem value="1D">1D</ToggleGroupItem>
        <ToggleGroupItem value="1W">1W</ToggleGroupItem>
        <ToggleGroupItem value="1M">1M</ToggleGroupItem>
        <ToggleGroupItem value="3M">3M</ToggleGroupItem>
        <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
