
import React from "react";

interface IndicatorItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
}

export const IndicatorItem = ({ 
  icon, 
  label, 
  value, 
  trend 
}: IndicatorItemProps) => {
  let trendColors = "text-gray-500";
  let trendIcon = null;
  
  if (trend === "up") {
    trendColors = "text-green-600";
    trendIcon = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>;
  } else if (trend === "down") {
    trendColors = "text-red-600";
    trendIcon = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>;
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
