
// Generate mock stock price data
export const generateStockData = (ticker: string, days: number) => {
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

// Helper to get days based on time range
export const getDaysByTimeRange = (timeRange: TimeRange): number => {
  switch (timeRange) {
    case "1D": return 1;
    case "1W": return 7;
    case "1M": return 30;
    case "3M": return 90;
    case "1Y": return 365;
    default: return 30;
  }
};

export type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y";
export type Indicator = "sma" | "ema" | "rsi" | "macd" | "bb";

export interface IndicatorConfig {
  name: string;
  color: string;
  visible: boolean;
}

export interface StockDataPoint {
  date: string;
  price: number;
  volume: number;
  sma20: number;
  sma50: number;
  ema: number;
  rsi: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  upperBand: number;
  lowerBand: number;
}
