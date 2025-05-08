
import React from "react";

interface IndicatorItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
}

import { ArrowDown, ArrowUp } from "lucide-react";

export const IndicatorItem = ({ icon, label, value, trend }: IndicatorItemProps) => {
  let trendColors = "text-gray-500";
  let trendIcon = null;
  
  if (trend === "up") {
    trendColors = "text-green-600";
    trendIcon = <ArrowUp size={14} />;
  } else if (trend === "down") {
    trendColors = "text-red-600";
    trendIcon = <ArrowDown size={14} />;
  }
  
  return (
    <div className="flex items-center justify-between border rounded-md p-2">
      <div className="flex items-center gap-2">
        <div className="bg-muted p-1 rounded">
          {icon}
        </div>
        <span className="text-sm">{label}</span>
      </div>
      <div className={`flex items-center gap-1 font-medium ${trendColors}`}>
        {value}
        {trendIcon}
      </div>
    </div>
  );
};
