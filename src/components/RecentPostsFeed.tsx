
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentPosts } from "@/lib/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRedditPosts, FormattedRedditPost, getMockRedditPosts } from "@/lib/api/reddit";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Post } from "@/lib/types";

// Import the separated components
import SocialPostCard from "@/components/posts/SocialPostCard";
import RedditPostCard from "@/components/posts/RedditPostCard";
import PostSkeleton from "@/components/posts/PostSkeleton";

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
        toast.info("We're showing sample data because the Reddit API returned no results.");
      }
    } catch (error) {
      console.error("Error fetching Reddit posts:", error);
      // Use mock data as fallback
      setRedditPosts(getMockRedditPosts(ticker));
      toast.info("We're showing sample data because the Reddit API could not be accessed.");
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
                    <PostSkeleton key={i} />
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

export default RecentPostsFeed;
