
import { toast } from "sonner";

// Reddit API credentials
const REDDIT_CLIENT_ID = "g6ATk7xTepd4jLXQCAGxtA";
const REDDIT_CLIENT_SECRET = "LIKltM12DUacp7pyTuYV5rObcVOOBQ";

interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
  subreddit: string;
  url: string;
}

export interface FormattedRedditPost {
  id: string;
  title: string;
  content: string;
  author: string;
  score: number;
  comments: number;
  timestamp: string;
  permalink: string;
  subreddit: string;
  url: string;
  sentiment: number;
  sentimentLabel: "positive" | "negative" | "neutral";
}

// Get an access token for Reddit API
const getRedditAccessToken = async () => {
  try {
    const response = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`)}`,
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    if (data.access_token) {
      return data.access_token;
    } else {
      throw new Error("Failed to get access token");
    }
  } catch (error) {
    console.error("Error getting Reddit access token:", error);
    return null;
  }
};

// Fetch posts from Reddit related to a ticker
export const getRedditPosts = async (ticker: string, limit: number = 10): Promise<FormattedRedditPost[]> => {
  try {
    // First try the public JSON API (doesn't require authentication)
    try {
      const response = await fetch(
        `https://www.reddit.com/search.json?q=${ticker}%20stock&sort=relevance&limit=${limit}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.children) {
          return formatRedditData(data.data.children.map((child: any) => child.data));
        }
      }
    } catch (error) {
      console.log("Public API failed, trying OAuth");
    }
    
    // If public API fails, try OAuth
    const accessToken = await getRedditAccessToken();
    if (!accessToken) {
      throw new Error("Failed to authenticate with Reddit API");
    }

    const response = await fetch(
      `https://oauth.reddit.com/search?q=${ticker}%20stock&sort=relevance&limit=${limit}`, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "web:SentimentDashboard:v1.0 (by /u/SentimentDashboardApp)",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching Reddit data: ${response.status}`);
    }

    const data = await response.json();
    if (!data.data || !data.data.children) {
      return [];
    }

    return formatRedditData(data.data.children.map((child: any) => child.data));
  } catch (error) {
    console.error("Error fetching Reddit posts:", error);
    toast.error("Failed to load Reddit posts");
    return [];
  }
};

/**
 * Format Reddit API response into a consistent format
 */
const formatRedditData = (posts: RedditPost[]): FormattedRedditPost[] => {
  return posts.map((post) => {
    // Simple sentiment scoring based on title keywords
    const sentiment = calculateSimpleSentiment(post.title + " " + post.selftext);
    
    return {
      id: post.id,
      title: post.title,
      content: post.selftext ? post.selftext.slice(0, 200) + (post.selftext.length > 200 ? '...' : '') : post.title,
      author: post.author,
      score: post.score,
      comments: post.num_comments,
      timestamp: formatRedditTimestamp(post.created_utc),
      permalink: `https://www.reddit.com${post.permalink}`,
      subreddit: post.subreddit,
      url: post.url.startsWith('http') ? post.url : `https://www.reddit.com${post.permalink}`,
      sentiment,
      sentimentLabel: getSentimentLabel(sentiment),
    };
  });
};

/**
 * Format Unix timestamp to relative time
 */
const formatRedditTimestamp = (timestamp: number): string => {
  const now = Date.now() / 1000; // Convert to seconds
  const diff = now - timestamp;
  
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString();
};

/**
 * Simple sentiment analysis based on keywords
 */
const calculateSimpleSentiment = (text: string): number => {
  const lowercaseText = text.toLowerCase();
  
  const positiveTerms = [
    'bullish', 'buy', 'up', 'gain', 'profit', 'positive', 'good', 
    'great', 'excellent', 'grow', 'growth', 'increase', 'beat',
    'strong', 'outperform', 'opportunity', 'potential', 'upside'
  ];
  
  const negativeTerms = [
    'bearish', 'sell', 'down', 'loss', 'negative', 'bad',
    'poor', 'decline', 'decrease', 'drop', 'fall', 'miss',
    'weak', 'underperform', 'risk', 'overvalued', 'downside'
  ];
  
  let score = 0;
  
  positiveTerms.forEach(term => {
    if (lowercaseText.includes(term)) score += 0.1;
  });
  
  negativeTerms.forEach(term => {
    if (lowercaseText.includes(term)) score -= 0.1;
  });
  
  // Clamp between -1 and 1
  return Math.max(-1, Math.min(1, score));
};

/**
 * Get sentiment label based on score
 */
const getSentimentLabel = (score: number): "positive" | "negative" | "neutral" => {
  if (score > 0.2) return "positive";
  if (score < -0.2) return "negative";
  return "neutral";
};

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
