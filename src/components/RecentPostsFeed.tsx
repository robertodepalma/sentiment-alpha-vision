
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentPosts } from "@/lib/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";

export const RecentPostsFeed = ({ ticker = "AAPL" }: { ticker?: string }) => {
  const posts = getRecentPosts();
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Recent Posts</CardTitle>
            <CardDescription>
              Latest social media posts about {ticker}
            </CardDescription>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
            Live Updates
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const PostCard = ({ post }: { post: any }) => {
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

const getSentimentColorClass = (score: number): string => {
  if (score > 0.2) return "sentiment-positive";
  if (score < -0.2) return "sentiment-negative";
  return "sentiment-neutral";
};

const getSentimentBgClass = (score: number): string => {
  if (score > 0.2) return "bg-green-500";
  if (score < -0.2) return "bg-red-500";
  return "bg-gray-500";
};
