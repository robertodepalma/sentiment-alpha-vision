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
  const [twitterPosts, setTwitterPosts] = useState<Post[]>([]);
  const [redditPosts, setRedditPosts] = useState<FormattedRedditPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("twitter");
  
  const fetchRedditPosts = async () => {
    setIsLoading(true);
    try {
      const posts = await getRedditPosts(ticker);
      setRedditPosts(posts);
      
      if (posts.length === 0) {
        // If API fails or returns no results, use mock data
        const mockData = getMockRedditPosts(ticker);
        // Sort mock data by created_utc in descending order (newest first)
        mockData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRedditPosts(mockData);
        toast.info("We're showing sample data because the Reddit API returned no results.");
      }
    } catch (error) {
      console.error("Error fetching Reddit posts:", error);
      // Use mock data as fallback
      const mockData = getMockRedditPosts(ticker);
      // Sort mock data by timestamp in descending order (newest first)
      mockData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRedditPosts(mockData);
      toast.info("We're showing sample data because the Reddit API could not be accessed.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Filter only Twitter posts from the social media data
    const allPosts = getRecentPosts();
    const filteredTwitterPosts = allPosts.filter(post => post.platform === "Twitter");
    // Sort Twitter posts by timestamp too (newest first)
    filteredTwitterPosts.sort((a, b) => {
      const timeA = a.timestamp.includes("ago") ? 
        parseRelativeTime(a.timestamp) : 
        new Date(a.timestamp).getTime();
      const timeB = b.timestamp.includes("ago") ? 
        parseRelativeTime(b.timestamp) : 
        new Date(b.timestamp).getTime();
      return timeB - timeA;
    });
    setTwitterPosts(filteredTwitterPosts);
    fetchRedditPosts();
  }, [ticker]);
  
  // Helper function to parse relative time strings like "2 minutes ago" into timestamps
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
  
  const handleRefresh = () => {
    if (activeTab === "twitter") {
      const allPosts = getRecentPosts();
      const filteredTwitterPosts = allPosts.filter(post => post.platform === "Twitter");
      // Sort Twitter posts by timestamp (newest first)
      filteredTwitterPosts.sort((a, b) => {
        const timeA = a.timestamp.includes("ago") ? 
          parseRelativeTime(a.timestamp) : 
          new Date(a.timestamp).getTime();
        const timeB = b.timestamp.includes("ago") ? 
          parseRelativeTime(b.timestamp) : 
          new Date(b.timestamp).getTime();
        return timeB - timeA;
      });
      setTwitterPosts(filteredTwitterPosts);
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
        <Tabs defaultValue="twitter" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
            <TabsTrigger value="reddit">Reddit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="twitter">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {twitterPosts.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No Twitter posts found for {ticker}
                  </div>
                ) : (
                  twitterPosts.map((post) => (
                    <SocialPostCard key={post.id} post={post} />
                  ))
                )}
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
