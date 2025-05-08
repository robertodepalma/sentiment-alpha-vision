
import { subDays, format } from "date-fns";
import { SentimentDataPoint, SentimentScore, AggregationMethod } from "../types";

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

export const getCurrentSentiment = (ticker: string = "AAPL"): SentimentScore => {
  const sentiments: Record<string, SentimentScore> = {
    "AAPL": { 
      score: 0.68, 
      label: "positive",
      trend: "up",
      change: 5.2
    },
    "MSFT": { 
      score: 0.52, 
      label: "positive",
      trend: "up",
      change: 3.1
    },
    "AMZN": { 
      score: 0.73, 
      label: "positive",
      trend: "up",
      change: 8.4
    },
    "TSLA": { 
      score: -0.42, 
      label: "negative",
      trend: "down",
      change: -6.7
    },
    "GOOGL": { 
      score: 0.18, 
      label: "neutral",
      trend: "down",
      change: -1.2
    }
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
