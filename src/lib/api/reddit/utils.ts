
import { RedditPost, FormattedRedditPost } from './types';

/**
 * Format Reddit API response into a consistent format
 */
export const formatRedditData = (posts: RedditPost[]): FormattedRedditPost[] => {
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
export const formatRedditTimestamp = (timestamp: number): string => {
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
export const calculateSimpleSentiment = (text: string): number => {
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
export const getSentimentLabel = (score: number): "positive" | "negative" | "neutral" => {
  if (score > 0.2) return "positive";
  if (score < -0.2) return "negative";
  return "neutral";
};
