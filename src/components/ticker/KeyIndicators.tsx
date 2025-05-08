
import React from "react";
import { ChartLine, Database } from "lucide-react";
import { IndicatorItem } from "./IndicatorItem";
import { getSentimentTrend } from "@/lib/utils/tickerUtils";
import { SentimentScore } from "@/lib/types";

interface KeyIndicatorsProps {
  analystRating: string;
  sentiment?: SentimentScore;
}

export const KeyIndicators = ({ 
  analystRating, 
  sentiment 
}: KeyIndicatorsProps) => {
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-1">Key Indicators</div>
      <div className="flex flex-col gap-2">
        <IndicatorItem 
          icon={<ChartLine size={14} />}
          label="Analyst Rating" 
          value={analystRating || "Buy"} 
          trend="up" 
        />
        <IndicatorItem 
          icon={<Database size={14} />}
          label="Sentiment Score" 
          value={sentiment?.score.toFixed(2) || "0.00"} 
          trend={getSentimentTrend(sentiment?.score)} 
        />
      </div>
    </div>
  );
};
