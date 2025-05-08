
import { toast } from "sonner";
import { RedditPost, FormattedRedditPost } from './types';
import { formatRedditData } from './utils';

// Reddit API credentials
const REDDIT_CLIENT_ID = "g6ATk7xTepd4jLXQCAGxtA";
const REDDIT_CLIENT_SECRET = "LIKltM12DUacp7pyTuYV5rObcVOOBQ";

// Get an access token for Reddit API
export const getRedditAccessToken = async () => {
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
