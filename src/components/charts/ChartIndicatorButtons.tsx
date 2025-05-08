
import React from "react";
import { Indicator, IndicatorConfig } from "@/lib/types/chartTypes";

interface ChartIndicatorButtonsProps {
  indicators: Record<Indicator, IndicatorConfig>;
  onToggle: (indicator: Indicator) => void;
}

export const ChartIndicatorButtons = ({ indicators, onToggle }: ChartIndicatorButtonsProps) => {
  return (
    <div className="flex gap-2">
      {Object.entries(indicators).map(([key, config]) => (
        <button
          key={key}
          className={`px-2 py-1 text-xs rounded-md font-medium border ${config.visible ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}
          onClick={() => onToggle(key as Indicator)}
        >
          {config.name}
        </button>
      ))}
    </div>
  );
};
