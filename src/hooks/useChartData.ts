
import { useState, useEffect } from "react";
import { getDailyTimeSeries, formatTimeSeriesForChart } from "@/lib/api/alphaVantage";
import { generateStockData, getDaysFromTimeRange } from "@/lib/utils/chartUtils";
import { TimeRange, Indicator, IndicatorConfig } from "@/lib/types/chartTypes";

export const useChartData = (ticker: string) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");
  const [selectedTab, setSelectedTab] = useState<string>("price");
  const [indicators, setIndicators] = useState<Record<Indicator, IndicatorConfig>>({
    sma: { name: "SMA", color: "hsl(var(--chart-blue))", visible: true },
    ema: { name: "EMA", color: "hsl(var(--chart-purple))", visible: false },
    rsi: { name: "RSI", color: "hsl(var(--chart-green))", visible: false },
    macd: { name: "MACD", color: "hsl(var(--chart-orange))", visible: false },
    bb: { name: "Bollinger", color: "hsl(var(--chart-red))", visible: false }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [realData, setRealData] = useState<any[]>([]);
  const [useRealData, setUseRealData] = useState(false);
  
  // Fetch real data from Alpha Vantage
  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true);
      try {
        const data = await getDailyTimeSeries(ticker);
        if (data && data["Time Series (Daily)"]) {
          const formattedData = formatTimeSeriesForChart(data);
          setRealData(formattedData);
          setUseRealData(true);
        } else {
          setUseRealData(false);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setUseRealData(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStockData();
  }, [ticker]);
  
  // Get days based on time range
  const days = getDaysFromTimeRange(timeRange);
  
  // Use real data if available, otherwise fallback to mock data
  const mockStockData = generateStockData(ticker, days);
  
  // Filter real data based on timeRange
  const filteredRealData = realData.slice(-days);
  
  // Final data to use for charts
  const stockData = useRealData ? filteredRealData : mockStockData;
  
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
  
  return {
    timeRange,
    setTimeRange,
    selectedTab,
    setSelectedTab,
    indicators,
    toggleIndicator,
    isLoading,
    stockData,
    useRealData
  };
};
