
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PriceChart } from "@/components/charts/PriceChart";
import { VolumeChart } from "@/components/charts/VolumeChart";
import { IndicatorChart } from "@/components/charts/IndicatorChart";
import { ChartIndicatorButtons } from "@/components/charts/ChartIndicatorButtons";
import { useChartData } from "@/hooks/useChartData";
import { TimeRange } from "@/lib/types/chartTypes";

export const TechnicalAnalysisChart = ({ ticker = "AAPL" }: { ticker?: string }) => {
  const {
    timeRange,
    setTimeRange,
    selectedTab,
    setSelectedTab,
    indicators,
    toggleIndicator,
    isLoading,
    stockData,
    useRealData
  } = useChartData(ticker);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{ticker} Technical Analysis</CardTitle>
            <CardDescription>
              Price data and technical indicators
              {!useRealData && <span className="text-xs ml-2 text-muted-foreground">(Using simulated data)</span>}
            </CardDescription>
          </div>
          <ToggleGroup type="single" value={timeRange} onValueChange={(val) => val && setTimeRange(val as TimeRange)}>
            <ToggleGroupItem value="1D">1D</ToggleGroupItem>
            <ToggleGroupItem value="1W">1W</ToggleGroupItem>
            <ToggleGroupItem value="1M">1M</ToggleGroupItem>
            <ToggleGroupItem value="3M">3M</ToggleGroupItem>
            <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[380px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="price" value={selectedTab} onValueChange={setSelectedTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="price">Price</TabsTrigger>
                <TabsTrigger value="volume">Volume</TabsTrigger>
                <TabsTrigger value="indicators">Indicators</TabsTrigger>
              </TabsList>
              
              <ChartIndicatorButtons 
                indicators={indicators} 
                onToggle={toggleIndicator}
              />
            </div>
            
            <TabsContent value="price" className="h-[380px]">
              <PriceChart data={stockData} indicators={indicators} />
            </TabsContent>
            
            <TabsContent value="volume" className="h-[380px]">
              <VolumeChart data={stockData} />
            </TabsContent>
            
            <TabsContent value="indicators" className="h-[380px]">
              <IndicatorChart data={stockData} indicators={indicators} />
            </TabsContent>
          </Tabs>
        )}
        
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <div>
            {useRealData 
              ? "Source: Alpha Vantage API"
              : "Note: This chart shows simulated data for demonstration purposes."}
          </div>
          <div>
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
