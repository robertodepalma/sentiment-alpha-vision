import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentPosts } from "@/lib/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRedditPosts, FormattedRedditPost, getMockRedditPosts } from "@/lib/api/redditApi";
import { ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { Post } from "@/lib/types";

export const RecentPostsFeed = ({ ticker = "AAPL" }: { ticker?: string }) => {
  const [socialPosts, setSocialPosts] = useState<Post[]>(getRecentPosts());
  const [redditPosts, setRedditPosts] = useState<FormattedRedditPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("social");
  
  const fetchRedditPosts = async () => {
    setIsLoading(true);
    try {
      const posts = await getRedditPosts(ticker);
      setRedditPosts(posts);
      
      if (posts.length === 0) {
        // If API fails or returns no results, use mock data
        setRedditPosts(getMockRedditPosts(ticker));
        toast({
          description: "We're showing sample data because the Reddit API returned no results.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error fetching Reddit posts:", error);
      // Use mock data as fallback
      setRedditPosts(getMockRedditPosts(ticker));
      toast({
          description: "We're showing sample data because the Reddit API could not be accessed.",
          duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    setSocialPosts(getRecentPosts()); // Refresh social posts on ticker change
    fetchRedditPosts();
  }, [ticker]);
  
  const handleRefresh = () => {
    if (activeTab === "social") {
      setSocialPosts(getRecentPosts());
    } else {
      fetchRedditPosts();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Recent Posts</CardTitle>
            <CardDescription>
              Latest posts about {ticker} from various platforms
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
              Live Updates
            </div>
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="social" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="reddit">Reddit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="social">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {socialPosts.map((post) => (
                  <SocialPostCard key={post.id} post={post} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="reddit">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="border rounded-md p-3">
                      <div className="flex justify-between mb-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/6" />
                      </div>
                      <Skeleton className="h-16 w-full mb-2" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/5" />
                      </div>
                    </div>
                  ))
                ) : redditPosts.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No Reddit posts found for {ticker}
                  </div>
                ) : (
                  redditPosts.map((post) => (
                    <RedditPostCard key={post.id} post={post} />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const SocialPostCard = ({ post }: { post: Post }) => {
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

const RedditPostCard = ({ post }: { post: FormattedRedditPost }) => {
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

const getSentimentColorClass = (score: number): string => {
  if (score > 0.2) return "text-green-600 dark:text-green-500";
  if (score < -0.2) return "text-red-600 dark:text-red-500";
  return "text-gray-600 dark:text-gray-400";
};

const getSentimentBgClass = (score: number): string => {
  if (score > 0.2) return "bg-green-500";
  if (score < -0.2) return "bg-red-500";
  return "bg-gray-500";
};
