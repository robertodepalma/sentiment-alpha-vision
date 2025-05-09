
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
    
    // Extract price and volume data
    const price = data.c[index];
    const volume = data.v[index];
    
    // Calculate SMA 20 - Use actual calculation with available data points
    const sma20Points = Math.min(20, index + 1);
    let sma20Sum = 0;
    for (let i = 0; i < sma20Points; i++) {
      sma20Sum += data.c[index - i] || data.c[0];
    }
    const sma20 = parseFloat((sma20Sum / sma20Points).toFixed(2));
    
    // Calculate SMA 50 - Use actual calculation with available data points
    const sma50Points = Math.min(50, index + 1);
    let sma50Sum = 0;
    for (let i = 0; i < sma50Points; i++) {
      sma50Sum += data.c[index - i] || data.c[0];
    }
    const sma50 = parseFloat((sma50Sum / sma50Points).toFixed(2));
    
    // Calculate EMA with proper smoothing factor
    // EMA = Price(t) * k + EMA(y) * (1 – k)
    // where k = 2/(N+1)
    const emaPeriod = 10;
    const k = 2 / (emaPeriod + 1);
    let ema;
    if (index === 0) {
      ema = price; // First value is same as price
    } else {
      // Get previous EMA, or use SMA as the initial value if not available
      const prevEma = index > emaPeriod ? data.c[index - 1] : sma20;
      ema = price * k + prevEma * (1 - k);
    }
    ema = parseFloat(ema.toFixed(2));
    
    // Calculate RSI
    // For a proper RSI we need separate up and down movement calculations
    // This is a simplified version using available data points
    let gains = 0;
    let losses = 0;
    const rsiPeriod = 14;
    const availablePeriod = Math.min(rsiPeriod, index);
    let rsi = 50; // Default neutral value
    
    if (availablePeriod > 0) {
      for (let i = 1; i <= availablePeriod; i++) {
        const currentPrice = data.c[index - i + 1];
        const previousPrice = data.c[index - i];
        const change = currentPrice - previousPrice;
        if (change > 0) gains += change;
        else losses -= change; // Make positive
      }
      
      const avgGain = gains / availablePeriod;
      const avgLoss = losses / availablePeriod;
      
      if (avgLoss === 0) {
        // No losses, RSI is 100
        rsi = 100;
      } else {
        const rs = avgGain / avgLoss;
        rsi = parseFloat((100 - (100 / (1 + rs))).toFixed(2));
      }
    }
    
    // Calculate MACD (Moving Average Convergence Divergence)
    // MACD Line = 12-Period EMA - 26-Period EMA
    // Signal Line = 9-Period EMA of MACD Line
    // This is a simplified calculation
    const fastEMA = price * 0.15 + (index > 0 ? data.c[index - 1] * 0.85 : price * 0.85);
    const slowEMA = price * 0.075 + (index > 0 ? data.c[index - 1] * 0.925 : price * 0.925);
    const macd = parseFloat((fastEMA - slowEMA).toFixed(2));
    const macdSignal = parseFloat((macd * 0.2 + (index > 0 ? macd * 0.8 : macd * 0.8)).toFixed(2));
    const macdHistogram = parseFloat((macd - macdSignal).toFixed(2));
    
    // Calculate Bollinger Bands (20-day SMA ± 2 × standard deviation)
    let sumSqDiff = 0;
    const bbPeriod = Math.min(20, index + 1);
    for (let i = 0; i < bbPeriod; i++) {
      sumSqDiff += Math.pow(data.c[index - i] - sma20, 2);
    }
    const stdDev = Math.sqrt(sumSqDiff / bbPeriod);
    
    const upperBand = parseFloat((sma20 + 2 * stdDev).toFixed(2));
    const lowerBand = parseFloat((sma20 - 2 * stdDev).toFixed(2));
    
    return {
      date: formattedDate,
      price: parseFloat(price.toFixed(2)),
      volume: Math.round(volume),
      sma20,
      sma50,
      ema,
      rsi,
      macd,
      macdSignal,
      macdHistogram,
      upperBand,
      lowerBand
    };
  });
}
