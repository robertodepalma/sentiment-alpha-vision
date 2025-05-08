
import { getRecentPosts } from "./socialData";
import { Post } from "../types";

export const getHypeScore = (ticker: string = "AAPL"): {
  score: number;
  breakdown: {
    category: string;
    score: number;
    weight: number;
    weightedScore: number;
    followers: number;
  }[];
} => {
  // Get sample posts for the ticker
  const posts = getRecentPosts();
  
  // Group posts by sentiment
  const positive = posts.filter(post => post.sentiment > 0.2);
  const neutral = posts.filter(post => post.sentiment >= -0.2 && post.sentiment <= 0.2);
  const negative = posts.filter(post => post.sentiment < -0.2);
  
  // Calculate follower-weighted scores
  const calculateWeightedScore = (posts: Post[]): {
    score: number;
    weight: number;
    weightedScore: number;
    followers: number;
  } => {
    if (posts.length === 0) return { score: 0, weight: 0, weightedScore: 0, followers: 0 };
    
    const totalFollowers = posts.reduce((sum, post) => sum + post.authorFollowers, 0);
    const avgSentiment = posts.reduce((sum, post) => sum + post.sentiment, 0) / posts.length;
    
    // Weight is based on total followers (logarithmic scale to prevent domination by outliers)
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
  // Positive sentiment contributes positively, negative sentiment detracts, neutral has minimal impact
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
