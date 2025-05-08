
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Scale } from "lucide-react";
import { getHypeScore } from "@/lib/mockData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const HypeScore = ({ ticker = "AAPL" }: { ticker?: string }) => {
  const hypeData = getHypeScore(ticker);
  
  // Determine styling based on score
  const getHypeColor = (score: number) => {
    if (score >= 75) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };
  
  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <img 
                src="/lovable-uploads/fe021022-f2cf-4c88-88cd-44a5e08dac7e.png" 
                alt="Hype Stock Barometer Logo" 
                className="h-7 w-7"
              />
              Hype Score Barometer
            </CardTitle>
            <CardDescription>
              Follower-weighted sentiment analysis for {ticker}
            </CardDescription>
          </div>
          <div className={`text-2xl font-bold ${getHypeColor(hypeData.score)}`}>
            {Math.round(hypeData.score)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative pt-1">
            <Progress 
              value={hypeData.score} 
              className="h-3"
              // Apply conditional styling to the indicator with CSS
              style={{
                '--indicator-color': hypeData.score >= 75 ? 'rgb(34, 197, 94)' : 
                                    hypeData.score >= 50 ? 'rgb(234, 179, 8)' : 
                                    'rgb(239, 68, 68)'
              } as React.CSSProperties}
            />
            <div className="w-full flex justify-between mt-1 text-xs text-muted-foreground">
              <div>Cold</div>
              <div>Neutral</div>
              <div>Hot</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          <h4 className="text-sm font-medium flex items-center gap-1">
            <Scale size={14} />
            Sentiment Breakdown
          </h4>
          
          {hypeData.breakdown.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-2 h-2 rounded-full ${
                      item.category === "Positive" ? "bg-green-500" : 
                      item.category === "Negative" ? "bg-red-500" : 
                      "bg-yellow-500"
                    }`}
                  />
                  <span className="text-sm">{item.category}</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground cursor-help">
                        <Users size={12} />
                        {formatNumber(item.followers)} followers
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Weight factor: {item.weight.toFixed(2)} (based on follower count)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="bg-secondary h-1.5 rounded-full w-full">
                <div 
                  className={`h-full rounded-full ${
                    item.category === "Positive" ? "bg-green-500" : 
                    item.category === "Negative" ? "bg-red-500" : 
                    "bg-yellow-500"
                  }`}
                  style={{ width: `${Math.abs(item.score * 50) + 50}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
