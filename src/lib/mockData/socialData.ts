
import { Post } from "../types";

export const getRecentPosts = (): Post[] => {
  return [
    {
      id: "1",
      platform: "Twitter",
      author: "MarketWatcher",
      authorFollowers: 145000,
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
      authorFollowers: 23500,
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
      authorFollowers: 8900,
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
      authorFollowers: 375000,
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
      authorFollowers: 2500000,
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
