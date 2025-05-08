
import React from "react";
import { Post } from "@/lib/types";

interface SocialPostCardProps {
  post: Post;
}

const SocialPostCard = ({ post }: SocialPostCardProps) => {
  const sentimentColor = getSentimentColorClass(post.sentiment);
  
  return (
    <div className="border rounded-md p-3 hover:bg-muted/30 transition-colors">
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getSentimentBgClass(post.sentiment)}`}></div>
          <div className="font-medium text-sm">{post.platform}</div>
          <div className="text-muted-foreground text-xs">@{post.author}</div>
        </div>
        <div className="text-xs text-muted-foreground">{post.timestamp}</div>
      </div>
      <div className="text-sm mb-2">{post.content}</div>
      <div className="flex justify-between items-center">
        <div className="flex gap-4 text-xs text-muted-foreground">
          <div>👍 {post.likes}</div>
          <div>🔄 {post.shares}</div>
        </div>
        <div className={`text-xs font-medium ${sentimentColor}`}>
          {post.sentimentLabel} ({post.sentiment.toFixed(2)})
        </div>
      </div>
    </div>
  );
};

export default SocialPostCard;

// Helper functions for sentiment styling
export const getSentimentColorClass = (score: number): string => {
  if (score > 0.2) return "text-green-600 dark:text-green-500";
  if (score < -0.2) return "text-red-600 dark:text-red-500";
  return "text-gray-600 dark:text-gray-400";
};

export const getSentimentBgClass = (score: number): string => {
  if (score > 0.2) return "bg-green-500";
  if (score < -0.2) return "bg-red-500";
  return "bg-gray-500";
};
