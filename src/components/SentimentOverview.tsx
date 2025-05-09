
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { getNewsSentiment } from "@/lib/api/finnhub";
import { getCurrentSentiment } from "@/lib/mockData";
import { SentimentScore } from "@/lib/types";
import { useHypeScore } from "@/hooks/useHypeScore";

export const SentimentOverview = ({ ticker = "AAPL" }: { ticker?: string }) => {
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { sentimentScore } = useHypeScore(ticker); // Use the hype score as the source of truth
  
  useEffect(() => {
    const fetchSentiment = async () => {
      setIsLoading(true);
      try {
        const data = await getNewsSentiment(ticker);
        if (data) {
          console.log("Received Finnhub sentiment data:", data);
          setSentimentData(data);
        } else {
          console.log("Finnhub sentiment data unavailable, using local data");
          setSentimentData(null);
        }
      } catch (error) {
        console.error("Error fetching sentiment data:", error);
        setSentimentData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSentiment();
  }, [ticker]);

  // Type guard to check if the sentiment data has trend and change properties
  const hasTrendData = (data: any): data is { score: number; trend: string; change: number } => {
    return 'trend' in data && 'change' in data;
  };

  // If we have Finnhub data, add trend info to our sentiment
  const sentiment = sentimentData ? {
    score: sentimentScore.score,
    label: sentimentScore.label,
    trend: sentimentData.sentimentChange > 0 ? "up" : "down",
    change: Math.abs(sentimentData.sentimentChange) * 100,
  } : {
    ...sentimentScore,
    trend: "neutral",
    change: 0
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Market Sentiment</CardTitle>
        <CardDescription>
          Overall {ticker} sentiment across platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary mb-2">{sentiment.score.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Sentiment Score</div>
              <div className="mt-1 text-xs">
                {sentiment.score > 0.6 ? "Very Bullish" : 
                 sentiment.score > 0.2 ? "Bullish" :
                 sentiment.score > -0.2 ? "Neutral" :
                 sentiment.score > -0.6 ? "Bearish" : "Very Bearish"}
              </div>
            </div>
            
            {hasTrendData(sentiment) && (
              <div className="flex flex-col items-center">
                <div className={`text-2xl font-bold mb-2 flex items-center ${
                  sentiment.trend === "up" ? "text-green-500" : "text-red-500"
                }`}>
                  {sentiment.trend === "up" ? <TrendingUp className="mr-1" size={24} /> : <TrendingDown className="mr-1" size={24} />}
                  {sentiment.change.toFixed(2)}%
                </div>
                <div className="text-sm text-muted-foreground">Weekly Change</div>
                <div className="mt-1 text-xs">
                  {sentiment.trend === "up" ? "Improving" : "Declining"}
                </div>
              </div>
            )}
            
            {sentimentData && (
              <div className="col-span-2 mt-4">
                <div className="text-sm font-medium mb-2">Additional Insights</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-muted rounded-md p-3">
                    <div className="text-muted-foreground mb-1">News Coverage</div>
                    <div className="font-medium">{sentimentData.buzz?.articlesInLastWeek || 0} articles this week</div>
                  </div>
                  <div className="bg-muted rounded-md p-3">
                    <div className="text-muted-foreground mb-1">Sector Average</div>
                    <div className="font-medium">{sentimentData.sectorAverageNewsScore?.toFixed(2) || "N/A"}</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="col-span-2 mt-2 text-xs text-muted-foreground text-center">
              {sentimentData ? "Source: Finnhub.io API" : "Using calculated sentiment data"}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SentimentOverview;
