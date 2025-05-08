
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { AggregationMethod, getCurrentSentiment, getAggregationMethods } from "@/lib/mockData";

export const SentimentOverview = ({ ticker = "AAPL" }: { ticker?: string }) => {
  const [aggregationMethod, setAggregationMethod] = useState<AggregationMethod>("B-A1");
  const sentiment = getCurrentSentiment(ticker);
  const methods = getAggregationMethods();
  
  // Convert sentiment score (-1 to 1) to a percentage (0 to 100)
  const sentimentPercentage = Math.round((sentiment.score + 1) * 50);
  
  const selectedMethod = methods.find(m => m.id === aggregationMethod);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Sentiment Overview</CardTitle>
          <CardDescription>
            Current aggregate sentiment for {ticker}
          </CardDescription>
        </div>
        <Select
          value={aggregationMethod}
          onValueChange={(value) => setAggregationMethod(value as AggregationMethod)}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select aggregation method" />
          </SelectTrigger>
          <SelectContent>
            {methods.map((method) => (
              <SelectItem key={method.id} value={method.id}>
                {method.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">Method: {selectedMethod?.name}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={14} className="text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{selectedMethod?.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${getSentimentColorClass(sentiment.score)}`}>
                {formatSentimentScore(sentiment.score)}
              </span>
              <span className={`text-sm ${getSentimentColorClass(sentiment.score)}`}>
                {sentiment.label}
              </span>
            </div>
          </div>
          
          <div className="relative pt-1">
            <Progress value={sentimentPercentage} className="h-3" />
            <div className="w-full flex justify-between mt-1 text-xs text-muted-foreground">
              <div>Bearish</div>
              <div>Neutral</div>
              <div>Bullish</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <SentimentMetric title="Analyst Rating" value="Buy" highlight />
          <SentimentMetric title="Posts Analyzed" value="23,451" />
          <SentimentMetric title="Confidence" value="85%" />
        </div>
      </CardContent>
    </Card>
  );
};

const SentimentMetric = ({ 
  title, 
  value, 
  highlight = false 
}: { 
  title: string; 
  value: string; 
  highlight?: boolean;
}) => (
  <div className="text-center p-2 border rounded-md">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className={`text-lg font-semibold ${highlight ? 'text-[hsl(var(--primary))]' : ''}`}>
      {value}
    </p>
  </div>
);

const getSentimentColorClass = (score: number): string => {
  if (score > 0.2) return "sentiment-positive";
  if (score < -0.2) return "sentiment-negative";
  return "sentiment-neutral";
};

const formatSentimentScore = (score: number): string => {
  // Format to 2 decimal places and ensure + sign for positive values
  return (score > 0 ? "+" : "") + score.toFixed(2);
};
