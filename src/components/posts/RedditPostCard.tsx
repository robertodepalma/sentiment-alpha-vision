
import React from "react";
import { FormattedRedditPost } from "@/lib/api/reddit";
import { ExternalLink } from "lucide-react";
import { getSentimentColorClass, getSentimentBgClass } from "./SocialPostCard";

interface RedditPostCardProps {
  post: FormattedRedditPost;
}

const RedditPostCard = ({ post }: RedditPostCardProps) => {
  const sentimentColor = getSentimentColorClass(post.sentiment);
  
  return (
    <div className="border rounded-md p-3 hover:bg-muted/30 transition-colors">
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getSentimentBgClass(post.sentiment)}`}></div>
          <div className="font-medium text-sm">r/{post.subreddit}</div>
          <div className="text-muted-foreground text-xs">u/{post.author}</div>
        </div>
        <div className="text-xs text-muted-foreground">{post.timestamp}</div>
      </div>
      <a 
        href={post.permalink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="font-medium text-sm mb-1 hover:underline flex items-center gap-1"
      >
        {post.title}
        <ExternalLink className="h-3 w-3" />
      </a>
      <div className="text-sm mb-2 text-muted-foreground">{post.content}</div>
      <div className="flex justify-between items-center">
        <div className="flex gap-4 text-xs text-muted-foreground">
          <div>👍 {post.score}</div>
          <div>💬 {post.comments}</div>
        </div>
        <div className={`text-xs font-medium ${sentimentColor}`}>
          {post.sentimentLabel} ({post.sentiment.toFixed(2)})
        </div>
      </div>
    </div>
  );
};

export default RedditPostCard;
