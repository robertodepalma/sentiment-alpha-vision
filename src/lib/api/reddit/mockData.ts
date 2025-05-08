
import { FormattedRedditPost } from './types';
import { calculateSimpleSentiment, getSentimentLabel } from './utils';

// Helper function to mock Reddit data when API fails
export const getMockRedditPosts = (ticker: string): FormattedRedditPost[] => {
  const subreddits = ["wallstreetbets", "stocks", "investing", "StockMarket", ticker];
  
  return Array(10).fill(0).map((_, i) => ({
    id: `mock-${i}`,
    title: `${i % 2 === 0 ? 'DD' : 'Discussion'}: ${ticker} ${i % 2 === 0 ? 'looks undervalued' : 'earnings expectations'}`,
    content: `This is a mock Reddit post about ${ticker}. It contains some analysis and ${
      i % 3 === 0 ? 'bullish' : i % 3 === 1 ? 'bearish' : 'neutral'
    } sentiment about the stock's future performance...`,
    author: `redditor${i + 1}`,
    score: Math.floor(Math.random() * 2000),
    comments: Math.floor(Math.random() * 200),
    timestamp: `${Math.floor(Math.random() * 24) + 1} hours ago`,
    permalink: `https://www.reddit.com/r/${subreddits[i % 5]}/comments/mock/${ticker.toLowerCase()}`,
    subreddit: subreddits[i % 5],
    url: `https://www.reddit.com/r/${subreddits[i % 5]}/comments/mock/${ticker.toLowerCase()}`,
    sentiment: i % 3 === 0 ? 0.5 : i % 3 === 1 ? -0.5 : 0,
    sentimentLabel: i % 3 === 0 ? "positive" : i % 3 === 1 ? "negative" : "neutral",
  }));
};
