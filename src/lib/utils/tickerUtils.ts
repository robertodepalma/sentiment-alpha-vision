
import { SentimentScore } from "@/lib/types";

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Determine sentiment trend based on score
 */
export const getSentimentTrend = (score?: number): "up" | "down" | "neutral" => {
  if (!score) return "neutral";
  if (score > 0.2) return "up";
  if (score < -0.2) return "down";
  return "neutral";
};

/**
 * Format large numbers into abbreviated form with B/M suffix
 */
export const formatMarketCap = (marketCap?: string | number): string => {
  if (!marketCap) return "N/A";
  
  const numericValue = typeof marketCap === 'string' ? parseInt(marketCap) : marketCap;
  
  if (numericValue >= 1000000000) {
    return `$${(numericValue / 1000000000).toFixed(2)}B`;
  } else if (numericValue >= 1000000) {
    return `$${(numericValue / 1000000).toFixed(2)}M`;
  } else {
    return `$${numericValue.toLocaleString()}`;
  }
};
