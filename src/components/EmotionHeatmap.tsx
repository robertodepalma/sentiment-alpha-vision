
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getEmotionData } from "@/lib/mockData";

export const EmotionHeatmap = ({ ticker = "AAPL" }: { ticker?: string }) => {
  const emotions = getEmotionData();
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Emotion Breakdown</CardTitle>
        <CardDescription>
          Granular emotion analysis for {ticker}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {emotions.map((emotion) => (
            <EmotionCell key={emotion.emotion} emotion={emotion} />
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Based on NLP analysis of 23,451 posts
          </div>
          <div className="flex items-center text-xs">
            <span className="mr-1 text-muted-foreground">Intensity:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
              <span className="mr-1">Low</span>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              <span>High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmotionCell = ({ emotion }: { emotion: { emotion: string; score: number } }) => {
  // Calculate background color intensity based on score
  const intensity = Math.round(emotion.score * 100);
  const bgColor = `rgba(59, 130, 246, ${emotion.score * 0.8 + 0.1})`; // Use blue with varying opacity
  
  return (
    <div 
      className="border rounded-md p-3 flex flex-col items-center justify-center text-center transition-all hover:shadow-md cursor-help"
      style={{ backgroundColor: bgColor }}
    >
      <div className="font-medium text-sm text-white">{emotion.emotion}</div>
      <div className="mt-1 text-xs text-white font-bold">{intensity}%</div>
    </div>
  );
};
