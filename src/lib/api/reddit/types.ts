
export interface RedditPost {
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
