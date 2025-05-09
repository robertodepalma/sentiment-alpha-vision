
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "./ticker-details";
import { useQuery } from "@tanstack/react-query";

// Import the new components and utility functions
import { generateStockData, getDaysByTimeRange, TimeRange, Indicator, IndicatorConfig } from "./chart-utils/generateStockData";
import { formatFinnhubCandles } from "./chart-utils/formatFinnhubData";
import { getStockCandles } from "@/lib/api/finnhub/api";
import { PriceChart } from "./chart-components/PriceChart";
import { VolumeChart } from "./chart-components/VolumeChart";
import { IndicatorChart } from "./chart-components/IndicatorChart";
import { ChartHeader } from "./chart-components/ChartHeader";
import { IndicatorToggle } from "./chart-components/IndicatorToggle";
import { ChartFooter } from "./chart-components/ChartFooter";

export const TechnicalAnalysisChart = ({ ticker = "AAPL" }: { ticker?: string }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");
  const [selectedTab, setSelectedTab] = useState<string>("price");
  const [selectedIndicator, setSelectedIndicator] = useState<string>("rsi");
  const [indicators, setIndicators] = useState<Record<Indicator, IndicatorConfig>>({
    sma: { name: "SMA", color: "hsl(var(--chart-blue))", visible: true },
    ema: { name: "EMA", color: "hsl(var(--chart-purple))", visible: false },
    rsi: { name: "RSI", color: "hsl(var(--chart-green))", visible: false },
    macd: { name: "MACD", color: "hsl(var(--chart-orange))", visible: false },
    bb: { name: "Bollinger", color: "hsl(var(--chart-red))", visible: false }
  });
  
  // Calculate time period based on selected range
  const days = getDaysByTimeRange(timeRange);
  const to = Math.floor(Date.now() / 1000); // Current time in seconds
  const from = to - (days * 24 * 60 * 60); // Start time based on selected days
  
  // Fetch real data from Finnhub
  const { data: finnhubData, isLoading } = useQuery({
    queryKey: ['stockCandles', ticker, timeRange],
    queryFn: () => getStockCandles(ticker, 'D', from, to),
  });

  // Process the data
  const stockData = finnhubData 
    ? formatFinnhubCandles(finnhubData)
    : generateStockData(ticker, days); // Fallback to mock data if API call fails
  
  // Toggle indicator visibility
  const toggleIndicator = (indicator: Indicator) => {
    setIndicators({
      ...indicators,
      [indicator]: { 
        ...indicators[indicator],
        visible: !indicators[indicator].visible 
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <ChartHeader 
          ticker={ticker} 
          timeRange={timeRange} 
          setTimeRange={setTimeRange} 
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[380px]">
            <LoadingSpinner />
          </div>
        ) : (
          <Tabs defaultValue="price" value={selectedTab} onValueChange={setSelectedTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="price">Price</TabsTrigger>
                <TabsTrigger value="volume">Volume</TabsTrigger>
                <TabsTrigger value="indicators">Indicators</TabsTrigger>
              </TabsList>
              
              <IndicatorToggle 
                indicators={indicators} 
                toggleIndicator={toggleIndicator} 
              />
            </div>
            
            <TabsContent value="price" className="h-[380px]">
              <PriceChart data={stockData} indicators={indicators} />
            </TabsContent>
            
            <TabsContent value="volume" className="h-[380px]">
              <VolumeChart data={stockData} />
            </TabsContent>
            
            <TabsContent value="indicators" className="h-[380px]">
              <Select 
                defaultValue={selectedIndicator} 
                onValueChange={(val) => setSelectedIndicator(val)}
              >
                <SelectTrigger className="w-[180px] mb-2">
                  <SelectValue placeholder="Select Indicator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rsi">RSI</SelectItem>
                  <SelectItem value="macd">MACD</SelectItem>
                </SelectContent>
              </Select>
              <IndicatorChart 
                data={stockData} 
                selectedIndicator={selectedIndicator} 
                indicatorColor={indicators[selectedIndicator as Indicator]?.color || "hsl(var(--chart-green))"}
              />
            </TabsContent>
          </Tabs>
        )}
        
        <ChartFooter />
      </CardContent>
    </Card>
  );
};
