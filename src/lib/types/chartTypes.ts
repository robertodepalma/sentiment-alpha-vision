
export type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y";
export type Indicator = "sma" | "ema" | "rsi" | "macd" | "bb";

export interface IndicatorConfig {
  name: string;
  color: string;
  visible: boolean;
}

export interface ChartDataPoint {
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
  [key: string]: any; // For any additional properties
}
