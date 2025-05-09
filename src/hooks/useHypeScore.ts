import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getRedditPosts } from "@/lib/api/reddit";
import { Post, SentimentScore } from "@/lib/types";
import { FormattedRedditPost } from "@/lib/api/reddit/types";
import { getHypeScore } from "@/lib/mockData";

export function useHypeScore(ticker: string) {
  const [score, setScore] = useState<number>(50);
  const [sentimentScore, setSentimentScore] = useState<SentimentScore>({
    score: 0,
    label: "neutral"
  });
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch Reddit posts for the ticker
        const redditPosts = await getRedditPosts(ticker, 20);
        
        if (redditPosts && redditPosts.length > 0) {
          // Convert to compatible Post format
          const formattedPosts = formatRedditPosts(redditPosts);
          setPosts(formattedPosts);
          
          // Calculate hype score based on real data
          const hypeData = calculateHypeScore(formattedPosts);
          setScore(hypeData.score);
          setBreakdown(hypeData.breakdown);
          
          // Set a normalized sentiment score (-1 to 1) for consistency
          // Convert hype score (0-100) to sentiment score (-1 to 1)
          const normalizedSentiment = ((hypeData.score - 50) / 50);
          setSentimentScore({
            score: normalizedSentiment,
            label: getSentimentLabel(normalizedSentiment)
          });
          
          console.log("Calculated hype score from Reddit data:", hypeData);
        } else {
          // Fall back to mock data if no Reddit posts
          console.log("No Reddit posts found, falling back to mock data");
          const mockData = getHypeScore(ticker);
          setScore(mockData.score);
          setBreakdown(mockData.breakdown);
          
          // Set a normalized sentiment score for the mock data
          const normalizedSentiment = ((mockData.score - 50) / 50);
          setSentimentScore({
            score: normalizedSentiment,
            label: getSentimentLabel(normalizedSentiment)
          });
        }
      } catch (err) {
        console.error("Error fetching hype data:", err);
        setError("Failed to fetch sentiment data");
        toast({
          title: "Error",
          description: "Failed to fetch sentiment data. Using mock data instead.",
          variant: "destructive"
        });
        
        // Fall back to mock data on error
        const mockData = getHypeScore(ticker);
        setScore(mockData.score);
        setBreakdown(mockData.breakdown);
        
        // Set a normalized sentiment score for the mock data
        const normalizedSentiment = ((mockData.score - 50) / 50);
        setSentimentScore({
          score: normalizedSentiment,
          label: getSentimentLabel(normalizedSentiment)
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [ticker, toast]);
  
  // Convert Reddit posts to our Post format
  const formatRedditPosts = (redditPosts: FormattedRedditPost[]): Post[] => {
    return redditPosts.map(post => ({
      id: post.id,
      platform: "Reddit",
      author: post.author,
      authorFollowers: calculateEstimatedFollowers(post.score),
      content: post.title + (post.content ? ": " + post.content : ""),
      timestamp: post.timestamp,
      sentiment: post.sentiment,
      sentimentLabel: post.sentimentLabel,
      likes: post.score,
      shares: post.comments,
      url: post.url
    }));
  };
  
  // Get sentiment label based on score
  const getSentimentLabel = (score: number): "positive" | "negative" | "neutral" => {
    if (score > 0.2) return "positive";
    if (score < -0.2) return "negative";
    return "neutral";
  };
  
  // Estimate followers based on post score
  const calculateEstimatedFollowers = (score: number): number => {
    // Simple algorithm to estimate followers based on post score
    // Higher score generally indicates more visibility/popularity
    return Math.max(100, score * 10 + Math.floor(Math.random() * 5000));
  };
  
  // Calculate hype score from posts data
  const calculateHypeScore = (posts: Post[]): {
    score: number;
    breakdown: {
      category: string;
      score: number;
      weight: number;
      weightedScore: number;
      followers: number;
    }[];
  } => {
    if (!posts || posts.length === 0) {
      return getHypeScore(ticker); // Fall back to mock data if no posts
    }
    
    // Group posts by sentiment
    const positive = posts.filter(post => post.sentiment > 0.2);
    const neutral = posts.filter(post => post.sentiment >= -0.2 && post.sentiment <= 0.2);
    const negative = posts.filter(post => post.sentiment < -0.2);
    
    // Calculate follower-weighted scores
    const calculateWeightedScore = (filteredPosts: Post[]): {
      score: number;
      weight: number;
      weightedScore: number;
      followers: number;
    } => {
      if (filteredPosts.length === 0) {
        return { score: 0, weight: 0, weightedScore: 0, followers: 0 };
      }
      
      const totalFollowers = filteredPosts.reduce(
        (sum, post) => sum + post.authorFollowers, 0
      );
      const avgSentiment = filteredPosts.reduce(
        (sum, post) => sum + post.sentiment, 0
      ) / filteredPosts.length;
      
      // Weight is based on total followers (logarithmic scale)
      const weight = Math.log10(totalFollowers + 1) / 5;
      
      return {
        score: avgSentiment,
        weight: weight,
        weightedScore: avgSentiment * weight,
        followers: totalFollowers
      };
    };
    
    const positiveStats = calculateWeightedScore(positive);
    const neutralStats = calculateWeightedScore(neutral);
    const negativeStats = calculateWeightedScore(negative);
    
    // Calculate overall hype score (range 0-100)
    // Positive sentiment contributes positively, negative sentiment detracts
    const rawHypeScore =
      positiveStats.weightedScore * 100 +
      neutralStats.weightedScore * 20 -
      Math.abs(negativeStats.weightedScore) * 70;
    
    // Normalize to 0-100 scale
    const normalizedScore = Math.min(100, Math.max(0, 50 + rawHypeScore));
    
    return {
      score: normalizedScore,
      breakdown: [
        {
          category: "Positive",
          score: positiveStats.score,
          weight: positiveStats.weight,
          weightedScore: positiveStats.weightedScore,
          followers: positiveStats.followers
        },
        {
          category: "Neutral",
          score: neutralStats.score,
          weight: neutralStats.weight,
          weightedScore: neutralStats.weightedScore,
          followers: neutralStats.followers
        },
        {
          category: "Negative",
          score: negativeStats.score,
          weight: negativeStats.weight,
          weightedScore: negativeStats.weightedScore,
          followers: negativeStats.followers
        }
      ]
    };
  };
  
  return { score, sentimentScore, breakdown, isLoading, error, posts };
}
