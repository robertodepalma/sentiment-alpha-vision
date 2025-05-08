
import React from "react";
import { Indicator, IndicatorConfig } from "../chart-utils/generateStockData";

interface IndicatorToggleProps {
  indicators: Record<Indicator, IndicatorConfig>;
  toggleIndicator: (indicator: Indicator) => void;
}

export const IndicatorToggle = ({ indicators, toggleIndicator }: IndicatorToggleProps) => {
  return (
    <div className="flex gap-2">
      {Object.entries(indicators).map(([key, config]) => (
        <button
          key={key}
          className={`px-2 py-1 text-xs rounded-md font-medium border ${config.visible ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}
          onClick={() => toggleIndicator(key as Indicator)}
        >
          {config.name}
        </button>
      ))}
    </div>
  );
};
