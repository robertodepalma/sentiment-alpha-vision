
// Type definitions for data structures

export type SentimentScore = {
  score: number;
  label: "positive" | "negative" | "neutral";
};

export type AggregationMethod = "B-A1" | "B-A2" | "B-D1" | "B-D2";

export type SentimentDataPoint = {
  date: string;
  sentiment: number;
  volume: number;
};

export type PlatformSentiment = {
  platform: string;
  sentiment: number;
  volume: number;
  confidence: number;
};

export type EmotionData = {
  emotion: string;
  score: number;
};

export type Post = {
  id: string;
  platform: string;
  author: string;
  authorFollowers: number;
  content: string;
  timestamp: string;
  sentiment: number;
  sentimentLabel: "positive" | "negative" | "neutral";
  likes: number;
  shares: number;
  url: string;
};

export type TickerDetail = {
  ticker: string;
  name: string;
  sector: string;
  ceo: string;
  headquarters: string;
  currentPrice: number;
  priceChange: number;
  marketCap: string;
};
