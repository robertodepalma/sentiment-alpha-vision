
import { FinnhubCandle } from "@/lib/api/finnhub/types";
import { StockDataPoint } from "./generateStockData";

/**
 * Format Finnhub candle data for technical analysis chart
 */
export function formatFinnhubCandles(data: FinnhubCandle | null): StockDataPoint[] {
  if (!data || data.s !== 'ok' || data.t.length === 0) {
    return [];
  }
  
  return data.t.map((timestamp, index) => {
    const date = new Date(timestamp * 1000);
    const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    const price = data.c[index];
    const volume = data.v[index];
    
    // Calculate SMA 20 (simplified - would need proper calculation in production)
    // In a real app, we would calculate actual SMAs using the past n days
    const sma20Range = Math.min(20, index);
    const sma20Sum = data.c.slice(Math.max(0, index - sma20Range), index + 1).reduce((sum, price) => sum + price, 0);
    const sma20 = parseFloat((sma20Sum / (sma20Range + 1)).toFixed(2));
    
    // Calculate SMA 50 (simplified)
    const sma50Range = Math.min(50, index);
    const sma50Sum = data.c.slice(Math.max(0, index - sma50Range), index + 1).reduce((sum, price) => sum + price, 0);
    const sma50 = parseFloat((sma50Sum / (sma50Range + 1)).toFixed(2));
    
    // EMA calculation (simplified - in production would use proper EMA formula)
    const alpha = 2 / (10 + 1);  // For EMA 10
    const prevEma = index > 0 ? data.c[index - 1] : data.c[0];
    const ema = parseFloat((alpha * price + (1 - alpha) * prevEma).toFixed(2));
    
    // Mock RSI (would need proper calculation in production)
    const rsi = Math.min(Math.max(30 + Math.random() * 40, 20), 80);
    
    // Mock MACD (would need proper calculation in production)
    const macd = (Math.random() - 0.5) * 2;
    const macdSignal = macd + (Math.random() - 0.5);
    const macdHistogram = macd - macdSignal;
    
    // Simple Bollinger Bands (20-day SMA ± 2 × standard deviation)
    const stdDevRange = Math.min(20, index);
    const priceSlice = data.c.slice(Math.max(0, index - stdDevRange), index + 1);
    const mean = priceSlice.reduce((sum, val) => sum + val, 0) / priceSlice.length;
    const variance = priceSlice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / priceSlice.length;
    const stdDev = Math.sqrt(variance);
    
    const upperBand = parseFloat((sma20 + 2 * stdDev).toFixed(2));
    const lowerBand = parseFloat((sma20 - 2 * stdDev).toFixed(2));
    
    return {
      date: formattedDate,
      price: parseFloat(price.toFixed(2)),
      volume: Math.round(volume),
      sma20,
      sma50,
      ema,
      rsi: parseFloat(rsi.toFixed(2)),
      macd: parseFloat(macd.toFixed(2)),
      macdSignal: parseFloat(macdSignal.toFixed(2)),
      macdHistogram: parseFloat(macdHistogram.toFixed(2)),
      upperBand,
      lowerBand
    };
  });
}
