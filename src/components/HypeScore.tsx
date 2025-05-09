
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Scale, RefreshCw } from "lucide-react";
import { useHypeScore } from "@/hooks/useHypeScore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export const HypeScore = ({ ticker = "AAPL" }: { ticker?: string }) => {
  const { score, sentimentScore, breakdown, isLoading, error } = useHypeScore(ticker);
  
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
          <div className={`text-2xl font-bold ${getHypeColor(score)}`}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <RefreshCw size={20} className="animate-spin" />
                <span className="text-muted-foreground text-lg">Loading...</span>
              </div>
            ) : (
              Math.round(score)
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                    </div>
                    <div className="h-2 bg-muted rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="relative pt-1">
                <Progress 
                  value={score} 
                  className="h-3"
                  style={{
                    '--indicator-color': score >= 75 ? 'rgb(34, 197, 94)' : 
                                        score >= 50 ? 'rgb(234, 179, 8)' : 
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
              
              {breakdown.map((item) => (
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
              
              <div className="text-xs text-muted-foreground mt-4">
                {error ? (
                  <div className="text-red-500">
                    Error loading data. Some values may be estimates.
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span>Data source: Reddit API</span>
                    <span>Updated just now</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
