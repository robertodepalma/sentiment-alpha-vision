
import { PlatformSentiment, EmotionData } from "../types";

export const getPlatformComparison = (): PlatformSentiment[] => {
  return [
    { platform: "Twitter", sentiment: 0.67, volume: 12450, confidence: 0.85 },
    { platform: "Reddit", sentiment: 0.42, volume: 8300, confidence: 0.78 },
    { platform: "StockTwits", sentiment: 0.73, volume: 5200, confidence: 0.82 },
    { platform: "News Media", sentiment: 0.31, volume: 1800, confidence: 0.91 }
  ];
};

export const getEmotionData = (): EmotionData[] => {
  return [
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
};
