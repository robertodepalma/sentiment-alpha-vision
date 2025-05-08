
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart,
  CartesianGrid, 
  ComposedChart,
  Legend, 
  Line,
  LineChart, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { generateSentimentData } from "@/lib/mockData";

type TimeRange = "1W" | "1M" | "3M" | "1Y";
type ChartType = "line" | "bar" | "area" | "composite";
type WeightingFactor = "none" | "influence" | "engagement" | "platform";

export const SentimentChart = ({ ticker = "AAPL" }: { ticker?: string }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [weightingFactor, setWeightingFactor] = useState<WeightingFactor>("none");
  
  const sentimentData = generateSentimentData();
  
  // Filter data based on time range - in a real app, you'd fetch the appropriate data
  const filteredData = sentimentData.slice(-getTimeRangeDays(timeRange));
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{ticker} Sentiment Trend</CardTitle>
            <CardDescription>
              Sentiment analysis over time
            </CardDescription>
          </div>
          <ToggleGroup type="single" value={timeRange} onValueChange={(val) => val && setTimeRange(val as TimeRange)}>
            <ToggleGroupItem value="1W">1W</ToggleGroupItem>
            <ToggleGroupItem value="1M">1M</ToggleGroupItem>
            <ToggleGroupItem value="3M">3M</ToggleGroupItem>
            <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between">
          <Tabs defaultValue="chart-type" className="w-[500px]">
            <TabsList>
              <TabsTrigger value="chart-type">Chart Type</TabsTrigger>
              <TabsTrigger value="weighting">Weighting</TabsTrigger>
            </TabsList>
            <TabsContent value="chart-type" className="space-y-2">
              <div className="flex gap-2 mt-2">
                <button
                  className={`px-3 py-1 text-sm rounded-md ${chartType === "line" ? "bg-secondary" : "bg-background"}`}
                  onClick={() => setChartType("line")}
                >
                  Line
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${chartType === "area" ? "bg-secondary" : "bg-background"}`}
                  onClick={() => setChartType("area")}
                >
                  Area
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${chartType === "bar" ? "bg-secondary" : "bg-background"}`}
                  onClick={() => setChartType("bar")}
                >
                  Bar
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${chartType === "composite" ? "bg-secondary" : "bg-background"}`}
                  onClick={() => setChartType("composite")}
                >
                  Composite
                </button>
              </div>
            </TabsContent>
            <TabsContent value="weighting">
              <div className="flex gap-2 mt-2">
                <button
                  className={`px-3 py-1 text-sm rounded-md ${weightingFactor === "none" ? "bg-secondary" : "bg-background"}`}
                  onClick={() => setWeightingFactor("none")}
                >
                  None
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${weightingFactor === "influence" ? "bg-secondary" : "bg-background"}`}
                  onClick={() => setWeightingFactor("influence")}
                >
                  Author Influence
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${weightingFactor === "engagement" ? "bg-secondary" : "bg-background"}`}
                  onClick={() => setWeightingFactor("engagement")}
                >
                  Post Engagement
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${weightingFactor === "platform" ? "bg-secondary" : "bg-background"}`}
                  onClick={() => setWeightingFactor("platform")}
                >
                  Platform Weight
                </button>
              </div>
            </TabsContent>
          </Tabs>
          <div className="text-sm text-muted-foreground">
            {weightingFactor !== "none" && (
              <div className="bg-muted px-3 py-1 rounded-md">
                Weighted by: <span className="font-medium">{formatWeightingFactor(weightingFactor)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart(chartType, filteredData)}
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex justify-between text-sm text-muted-foreground">
          <div>
            Source: Aggregated from Twitter, Reddit, StockTwits, and News
          </div>
          <div>
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const renderChart = (chartType: ChartType, data: any[]) => {
  switch (chartType) {
    case "line":
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="sentiment" 
            stroke="hsl(var(--chart-blue))" 
            name="Sentiment Score"
            dot={{ strokeWidth: 2, r: 2 }}
            strokeWidth={2}
          />
        </LineChart>
      );
    case "area":
      return (
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <defs>
            <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-blue))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-blue))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="sentiment" 
            stroke="hsl(var(--chart-blue))" 
            fillOpacity={1} 
            fill="url(#sentimentGradient)" 
            name="Sentiment Score"
          />
        </AreaChart>
      );
    case "bar":
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Bar dataKey="sentiment" fill="hsl(var(--chart-blue))" name="Sentiment Score" />
        </BarChart>
      );
    case "composite":
      return (
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <RechartsTooltip />
          <Legend />
          <Bar 
            dataKey="volume" 
            fill="hsl(var(--chart-purple))" 
            name="Post Volume" 
            yAxisId="right"
            opacity={0.6}
          />
          <Line 
            type="monotone" 
            dataKey="sentiment" 
            stroke="hsl(var(--chart-blue))" 
            name="Sentiment Score"
            yAxisId="left"
            strokeWidth={2}
          />
        </ComposedChart>
      );
    default:
      return null;
  }
};

const getTimeRangeDays = (timeRange: TimeRange): number => {
  switch (timeRange) {
    case "1W": return 7;
    case "1M": return 30;
    case "3M": return 90;
    case "1Y": return 365;
    default: return 30;
  }
};

const formatWeightingFactor = (factor: WeightingFactor): string => {
  switch (factor) {
    case "influence": return "Author Influence";
    case "engagement": return "Post Engagement";
    case "platform": return "Platform Weight";
    default: return "None";
  }
};
