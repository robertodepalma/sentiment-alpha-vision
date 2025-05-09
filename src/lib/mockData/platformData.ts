import { PlatformSentiment, EmotionData } from "../types";

export const getPlatformComparison = (ticker: string = "AAPL"): PlatformSentiment[] => {
  // Generate different mock data based on the ticker
  const baseData = [
    { platform: "Twitter", sentiment: 0.67, volume: 12450, confidence: 0.85 },
    { platform: "Reddit", sentiment: 0.42, volume: 8300, confidence: 0.78 },
    { platform: "StockTwits", sentiment: 0.73, volume: 5200, confidence: 0.82 },
    { platform: "News Media", sentiment: 0.31, volume: 1800, confidence: 0.91 }
  ];
  
  // Create ticker-specific variations
  const tickerMultipliers: Record<string, number> = {
    "AAPL": 1.0,
    "MSFT": 0.9,
    "GOOGL": 0.85,
    "TSLA": 1.2,
    "AMZN": 1.05
  };
  
  const multiplier = tickerMultipliers[ticker] || 1;
  
  return baseData.map(item => ({
    ...item,
    sentiment: normalizeValue(item.sentiment * (Math.random() * 0.4 + multiplier * 0.8), -1, 1),
    volume: Math.round(item.volume * (Math.random() * 0.3 + multiplier * 0.85)),
    confidence: normalizeValue(item.confidence * (Math.random() * 0.1 + multiplier * 0.95), 0, 1)
  }));
};

export const getEmotionData = (ticker: string = "AAPL"): EmotionData[] => {
  // Base emotion data
  const baseEmotions = [
    { emotion: "Optimism", score: 0.75 },
    { emotion: "Trust", score: 0.65 },
    { emotion: "Joy", score: 0.55 },
    { emotion: "Surprise", score: 0.45 },
    { emotion: "Neutral", score: 0.40 },
    { emotion: "Anxiety", score: 0.30 },
    { emotion: "Anger", score: 0.25 },
    { emotion: "Sadness", score: 0.20 },
    { emotion: "Fear", score: 0.15 },
    { emotion: "Disgust", score: 0.10 }
  ];
  
  // Define sentiment profiles for different tickers
  const tickerProfiles: Record<string, { positive: number, negative: number }> = {
    "AAPL": { positive: 1.1, negative: 0.9 },
    "MSFT": { positive: 1.05, negative: 0.95 },
    "GOOGL": { positive: 1.0, negative: 1.0 },
    "TSLA": { positive: 0.9, negative: 1.2 },
    "AMZN": { positive: 1.15, negative: 0.85 }
  };
  
  const profile = tickerProfiles[ticker] || { positive: 1, negative: 1 };
  
  return baseEmotions.map(emotion => {
    // Positive emotions get boosted by positive profile, negative emotions by negative profile
    const isPositive = ["Optimism", "Trust", "Joy", "Surprise"].includes(emotion.emotion);
    const isNegative = ["Anxiety", "Anger", "Sadness", "Fear", "Disgust"].includes(emotion.emotion);
    
    let multiplier = 1;
    if (isPositive) multiplier = profile.positive;
    if (isNegative) multiplier = profile.negative;
    
    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4;
    
    return {
      emotion: emotion.emotion,
      score: normalizeValue(emotion.score * multiplier * randomFactor, 0, 1)
    };
  });
};

// Helper function to keep values within range
function normalizeValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
