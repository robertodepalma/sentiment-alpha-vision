
import React from "react";
import { ChartLine, Database } from "lucide-react";
import { IndicatorItem } from "./IndicatorItem";
import { SentimentScore } from "@/lib/types";

interface KeyIndicatorsProps {
  peRatio: string | number;
  dividendYield: string | number;
  sentiment?: SentimentScore;
}

const getSentimentTrend = (score?: number): "up" | "down" | "neutral" => {
  if (!score) return "neutral";
  if (score > 0.2) return "up";
  if (score < -0.2) return "down";
  return "neutral";
};

export const KeyIndicators = ({ peRatio, dividendYield, sentiment }: KeyIndicatorsProps) => {
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-1">Key Indicators</div>
      <div className="flex flex-col gap-2">
        <IndicatorItem 
          icon={<ChartLine size={14} />}
          label="P/E Ratio" 
          value={peRatio} 
        />
        <IndicatorItem 
          icon={<Database size={14} />}
          label="Dividend Yield" 
          value={dividendYield} 
        />
        <IndicatorItem 
          icon={<ChartLine size={14} />}
          label="Sentiment" 
          value={sentiment?.score.toFixed(2) || "0.00"} 
          trend={getSentimentTrend(sentiment?.score)} 
        />
      </div>
    </div>
  );
};
