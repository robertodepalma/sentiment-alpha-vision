
import { subDays, format } from "date-fns";

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

// Generate mock sentiment data for the past 30 days
export const generateSentimentData = (): SentimentDataPoint[] => {
  const data: SentimentDataPoint[] = [];
  for (let i = 30; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const sentiment = Math.sin(i / 5) * 0.5 + Math.random() * 0.4;
    const volume = Math.random() * 5000 + 3000;
    
    data.push({
      date: format(date, "yyyy-MM-dd"),
      sentiment: sentiment,
      volume: volume
    });
  }
  return data;
};

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

export const getRecentPosts = (): Post[] => {
  return [
    {
      id: "1",
      platform: "Twitter",
      author: "MarketWatcher",
      content: "AAPL showing strong momentum after earnings beat. Expect continued upward trajectory into next quarter.",
      timestamp: "2 minutes ago",
      sentiment: 0.82,
      sentimentLabel: "positive",
      likes: 245,
      shares: 56,
      url: "#"
    },
    {
      id: "2",
      platform: "Reddit",
      author: "InvestorPro",
      content: "Just analyzed TSLA's production numbers. They're concerning. Be careful with this one.",
      timestamp: "15 minutes ago",
      sentiment: -0.65,
      sentimentLabel: "negative",
      likes: 129,
      shares: 34,
      url: "#"
    },
    {
      id: "3",
      platform: "StockTwits",
      author: "TradingMaster",
      content: "MSFT cloud division performance was in-line with expectations. Nothing too exciting.",
      timestamp: "42 minutes ago",
      sentiment: 0.12,
      sentimentLabel: "neutral",
      likes: 78,
      shares: 12,
      url: "#"
    },
    {
      id: "4",
      platform: "Twitter",
      author: "FinanceGuru",
      content: "AMZN's logistics improvements will dramatically cut costs. This is a game-changer!",
      timestamp: "1 hour ago",
      sentiment: 0.89,
      sentimentLabel: "positive",
      likes: 512,
      shares: 128,
      url: "#"
    },
    {
      id: "5",
      platform: "News Media",
      author: "Financial Times",
      content: "GOOGL facing new regulatory challenges in EU markets. Uncertain times ahead for the tech giant.",
      timestamp: "2 hours ago",
      sentiment: -0.42,
      sentimentLabel: "negative",
      likes: 89,
      shares: 45,
      url: "#"
    }
  ];
};

export const getTickerDetails = (ticker: string = "AAPL"): TickerDetail => {
  const tickers: Record<string, TickerDetail> = {
    "AAPL": {
      ticker: "AAPL",
      name: "Apple Inc.",
      sector: "Technology",
      ceo: "Tim Cook",
      headquarters: "Cupertino, CA",
      currentPrice: 175.84,
      priceChange: 2.34,
      marketCap: "$2.8T"
    },
    "MSFT": {
      ticker: "MSFT",
      name: "Microsoft Corporation",
      sector: "Technology",
      ceo: "Satya Nadella",
      headquarters: "Redmond, WA",
      currentPrice: 378.92,
      priceChange: -1.42,
      marketCap: "$2.82T"
    },
    "AMZN": {
      ticker: "AMZN",
      name: "Amazon.com Inc.",
      sector: "Consumer Cyclical",
      ceo: "Andy Jassy",
      headquarters: "Seattle, WA",
      currentPrice: 178.15,
      priceChange: 3.56,
      marketCap: "$1.85T"
    },
    "TSLA": {
      ticker: "TSLA",
      name: "Tesla, Inc.",
      sector: "Automotive",
      ceo: "Elon Musk",
      headquarters: "Austin, TX",
      currentPrice: 237.49,
      priceChange: -12.75,
      marketCap: "$753B"
    },
    "GOOGL": {
      ticker: "GOOGL",
      name: "Alphabet Inc.",
      sector: "Technology",
      ceo: "Sundar Pichai",
      headquarters: "Mountain View, CA",
      currentPrice: 156.28,
      priceChange: 0.74,
      marketCap: "$1.96T"
    }
  };
  
  return tickers[ticker] || tickers["AAPL"];
};

export const getCurrentSentiment = (ticker: string = "AAPL"): SentimentScore => {
  const sentiments: Record<string, SentimentScore> = {
    "AAPL": { score: 0.68, label: "positive" },
    "MSFT": { score: 0.52, label: "positive" },
    "AMZN": { score: 0.73, label: "positive" },
    "TSLA": { score: -0.42, label: "negative" },
    "GOOGL": { score: 0.18, label: "neutral" }
  };
  
  return sentiments[ticker] || sentiments["AAPL"];
};

export const getAggregationMethods = (): { id: AggregationMethod, name: string, description: string }[] => {
  return [
    { 
      id: "B-A1", 
      name: "Basic Averaging (B-A1)", 
      description: "Simple average of all sentiment scores"
    },
    { 
      id: "B-A2", 
      name: "Weighted Averaging (B-A2)", 
      description: "Weighted by post engagement metrics"
    },
    { 
      id: "B-D1", 
      name: "Divergence Analysis (B-D1)", 
      description: "Measures sentiment deviation from baseline"
    },
    { 
      id: "B-D2", 
      name: "Dynamic Weighting (B-D2)", 
      description: "Adjusts weights based on historical accuracy"
    }
  ];
};
