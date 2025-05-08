
import { RedditPost, FormattedRedditPost } from './types';

/**
 * Format Reddit API response into a consistent format
 */
export const formatRedditData = (posts: RedditPost[]): FormattedRedditPost[] => {
  // First format the posts
  const formattedPosts = posts.map((post) => {
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
  
  // Then sort by created_utc in descending order (newest first)
  // We use the created_utc timestamp for accurate sorting
  return formattedPosts.sort((a, b) => {
    // Convert relative timestamps to comparable values
    const timeA = a.timestamp.includes("ago") ? 
      parseRelativeTime(a.timestamp) : 
      new Date(a.timestamp).getTime();
    const timeB = b.timestamp.includes("ago") ? 
      parseRelativeTime(b.timestamp) : 
      new Date(b.timestamp).getTime();
    return timeB - timeA;
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
 * Helper function to parse relative time strings like "2 minutes ago" into timestamps
 */
const parseRelativeTime = (relativeTime: string): number => {
  const now = Date.now();
  if (relativeTime === "just now") return now;
  
  const match = relativeTime.match(/(\d+)\s+(minute|minutes|hour|hours|day|days)\s+ago/);
  if (!match) return now;
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch(unit) {
    case 'minute':
    case 'minutes':
      return now - (value * 60 * 1000);
    case 'hour':
    case 'hours':
      return now - (value * 60 * 60 * 1000);
    case 'day':
    case 'days':
      return now - (value * 24 * 60 * 60 * 1000);
    default:
      return now;
  }
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
