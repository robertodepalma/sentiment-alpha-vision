import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { getDailyTimeSeries } from "@/lib/api/yahooFinance";

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y";
type Indicator = "sma" | "ema" | "rsi" | "macd" | "bb";

interface IndicatorConfig {
  name: string;
  color: string;
  visible: boolean;
}

// Generate mock stock price data
const generateStockData = (ticker: string, days: number) => {
  const data = [];
  let price = ticker === "AAPL" ? 180 : ticker === "MSFT" ? 320 : ticker === "GOOGL" ? 140 : 100;
  let volume = 1000000;
  
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Add some randomness to price movement
    const change = (Math.random() - 0.48) * 5;
    price = Math.max(price + change, 10);
    
    // Generate some random volume
    volume = Math.max(volume + (Math.random() - 0.5) * 200000, 100000);
    
    // Calculate simple moving averages
    const sma20 = price + (Math.random() - 0.5) * 3;
    const sma50 = price + (Math.random() - 0.48) * 6;
    
    // Calculate exponential moving average
    const ema = price + (Math.random() - 0.47) * 4;
    
    // Calculate RSI (Relative Strength Index)
    const rsi = Math.min(Math.max(30 + Math.random() * 50, 20), 80);
    
    // Calculate MACD (Moving Average Convergence Divergence)
    const macd = (Math.random() - 0.5) * 2;
    const macdSignal = macd + (Math.random() - 0.5);
    const macdHistogram = macd - macdSignal;
    
    // Calculate Bollinger Bands
    const upperBand = price + 10 + Math.random() * 5;
    const lowerBand = price - 10 - Math.random() * 5;
    
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: parseFloat(price.toFixed(2)),
      volume: Math.round(volume),
      sma20: parseFloat(sma20.toFixed(2)),
      sma50: parseFloat(sma50.toFixed(2)),
      ema: parseFloat(ema.toFixed(2)),
      rsi: parseFloat(rsi.toFixed(2)),
      macd: parseFloat(macd.toFixed(2)),
      macdSignal: parseFloat(macdSignal.toFixed(2)),
      macdHistogram: parseFloat(macdHistogram.toFixed(2)),
      upperBand: parseFloat(upperBand.toFixed(2)),
      lowerBand: parseFloat(lowerBand.toFixed(2))
    });
  }
  
  return data;
};

export const TechnicalAnalysisChart = ({ ticker = "AAPL" }: { ticker?: string }) => {
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
  
  // Add technical indicators to real data
  const addIndicators = (data: any[]) => {
    // Simple moving averages (20-day and 50-day)
    const windowSize20 = 20;
    const windowSize50 = 50;
    
    return data.map((item, index) => {
      const enhancedItem = { ...item };
      
      // Calculate SMA-20
      if (index >= windowSize20 - 1) {
        const slice = data.slice(index - windowSize20 + 1, index + 1);
        const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
        enhancedItem.sma20 = parseFloat((sum / windowSize20).toFixed(2));
      }
      
      // Calculate SMA-50
      if (index >= windowSize50 - 1) {
        const slice = data.slice(index - windowSize50 + 1, index + 1);
        const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
        enhancedItem.sma50 = parseFloat((sum / windowSize50).toFixed(2));
      }
      
      // Calculate EMA-21 (simplified)
      if (index === 0) {
        enhancedItem.ema = enhancedItem.close;
      } else if (index > 0) {
        const k = 2 / (21 + 1);
        enhancedItem.ema = parseFloat((enhancedItem.close * k + data[index - 1].ema * (1 - k)).toFixed(2));
      }
      
      // Simple mock-up for RSI, MACD, and Bollinger Bands
      enhancedItem.rsi = Math.min(Math.max(30 + Math.random() * 50, 20), 80);
      enhancedItem.macd = (Math.random() - 0.5) * 2;
      enhancedItem.macdSignal = enhancedItem.macd + (Math.random() - 0.5);
      enhancedItem.macdHistogram = enhancedItem.macd - enhancedItem.macdSignal;
      enhancedItem.upperBand = enhancedItem.close * 1.05;
      enhancedItem.lowerBand = enhancedItem.close * 0.95;
      
      return enhancedItem;
    });
  };
  
  // Fetch real data from Yahoo Finance
  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true);
      try {
        const data = await getDailyTimeSeries(ticker);
        if (data && data.length > 0) {
          const enhancedData = addIndicators(data);
          setRealData(enhancedData);
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
  
  // Get data based on time range
  const getDays = (): number => {
    switch (timeRange) {
      case "1D": return 1;
      case "1W": return 7;
      case "1M": return 30;
      case "3M": return 90;
      case "1Y": return 365;
      default: return 30;
    }
  };
  
  // Use real data if available, otherwise fallback to mock data
  const mockStockData = generateStockData(ticker, getDays());
  
  // Filter real data based on timeRange
  const filteredRealData = realData.slice(-getDays());
  
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
              
              <div className="flex gap-2">
                {Object.entries(indicators).map(([key, config]) => (
                  <button
                    key={key}
                    className={`px-2 py-1 text-xs rounded-md font-medium border ${config.visible ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}
                    onClick={() => toggleIndicator(key as Indicator)}
                  >
                    {config.name}
                  </button>
                ))}
              </div>
            </div>
            
            <TabsContent value="price" className="h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={stockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey={useRealData ? "close" : "price"} 
                    fill="hsl(var(--chart-blue))" 
                    fillOpacity={0.1} 
                    stroke="hsl(var(--chart-blue))" 
                    name="Price"
                  />
                  {indicators.sma.visible && (
                    <Line 
                      type="monotone" 
                      dataKey="sma20" 
                      stroke={indicators.sma.color} 
                      dot={false} 
                      name="SMA (20)"
                    />
                  )}
                  {indicators.sma.visible && (
                    <Line 
                      type="monotone" 
                      dataKey="sma50" 
                      stroke={indicators.sma.color} 
                      strokeDasharray="5 5"
                      dot={false} 
                      name="SMA (50)"
                    />
                  )}
                  {indicators.ema.visible && (
                    <Line 
                      type="monotone" 
                      dataKey="ema" 
                      stroke={indicators.ema.color}
                      dot={false} 
                      name="EMA (21)"
                    />
                  )}
                  {indicators.bb.visible && (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="upperBand" 
                        stroke={indicators.bb.color}
                        strokeDasharray="3 3"
                        dot={false} 
                        name="Upper Band"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lowerBand" 
                        stroke={indicators.bb.color}
                        strokeDasharray="3 3"
                        dot={false} 
                        name="Lower Band"
                      />
                    </>
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="volume" className="h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value) => new Intl.NumberFormat().format(value as number)}
                  />
                  <Bar 
                    dataKey="volume" 
                    fill="hsl(var(--chart-purple))" 
                    name="Volume" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="indicators" className="h-[380px]">
              <Select defaultValue="rsi" onValueChange={(val) => {}}>
                <SelectTrigger className="w-[180px] mb-2">
                  <SelectValue placeholder="Select Indicator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rsi">RSI</SelectItem>
                  <SelectItem value="macd">MACD</SelectItem>
                </SelectContent>
              </Select>
              <ResponsiveContainer width="100%" height="90%">
                <ComposedChart data={stockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rsi" 
                    stroke={indicators.rsi.color} 
                    dot={false}
                    name="RSI (14)"
                  />
                  {/* Reference lines for RSI */}
                  <Line 
                    type="monotone" 
                    dataKey={() => 70} 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeDasharray="3 3"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={() => 30} 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeDasharray="3 3"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        )}
        
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <div>
            {useRealData 
              ? "Source: Yahoo Finance API"
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
