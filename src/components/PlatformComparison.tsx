
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { getPlatformComparison } from "@/lib/mockData";
import { PlatformSentiment } from "@/lib/types";

export const PlatformComparison = ({ ticker = "AAPL" }: { ticker?: string }) => {
  const [platformData, setPlatformData] = useState<PlatformSentiment[]>([]);
  
  // Update data when ticker changes
  useEffect(() => {
    setPlatformData(getPlatformComparison(ticker));
  }, [ticker]);
  
  // Colors for the different platforms
  const platformColors = {
    Twitter: "hsl(var(--chart-blue))",
    Reddit: "hsl(var(--chart-orange))",
    StockTwits: "hsl(var(--chart-green))",
    "News Media": "hsl(var(--chart-purple))"
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Platform Comparison</CardTitle>
        <CardDescription>
          Sentiment analysis across different platforms for {ticker}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={platformData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                domain={[-1, 1]}
                ticks={[-1, -0.5, 0, 0.5, 1]} 
              />
              <YAxis 
                dataKey="platform" 
                type="category" 
                width={100}
                tickLine={false}
                axisLine={false}
              />
              <Legend />
              <Bar 
                dataKey="sentiment" 
                name="Sentiment Score"
                radius={[4, 4, 4, 4]}
              >
                {platformData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={platformColors[entry.platform as keyof typeof platformColors] || "#8884d8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {platformData.map((platform) => (
            <PlatformCard key={platform.platform} platform={platform} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const PlatformCard = ({ platform }: { platform: { platform: string; sentiment: number; volume: number; confidence: number } }) => {
  const sentimentLabel = getSentimentLabel(platform.sentiment);
  const sentimentColor = getSentimentColorClass(platform.sentiment);
  
  return (
    <div className="border rounded-md p-3 sentiment-card">
      <div className="font-medium">{platform.platform}</div>
      <div className={`text-lg font-bold ${sentimentColor}`}>
        {platform.sentiment.toFixed(2)}
      </div>
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>Posts: {platform.volume.toLocaleString()}</span>
        <span>Confidence: {(platform.confidence * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
};

const getSentimentLabel = (score: number): string => {
  if (score > 0.2) return "Bullish";
  if (score < -0.2) return "Bearish";
  return "Neutral";
};

const getSentimentColorClass = (score: number): string => {
  if (score > 0.2) return "sentiment-positive";
  if (score < -0.2) return "sentiment-negative";
  return "sentiment-neutral";
};
