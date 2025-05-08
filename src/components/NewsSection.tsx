
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getTickerNews, formatNewsData } from "@/lib/api/newsData";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

export const NewsSection = ({ ticker = "AAPL" }: { ticker?: string }) => {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const itemsPerPage = 3;
  
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const tickerWithCompanyName = `${ticker} stock market`;
        const newsData = await getTickerNews(tickerWithCompanyName, 10);
        const formattedNews = formatNewsData(newsData);
        setNews(formattedNews);
      } catch (error) {
        console.error("Error fetching news:", error);
        toast({
          title: "Error fetching news",
          description: "Could not load news articles",
          variant: "destructive"
        });
        setNews([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, [ticker, toast]);
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = news.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(news.length / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Latest News</CardTitle>
            <CardDescription>
              Recent news articles about {ticker}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {isLoading ? (
              <>
                <NewsItemSkeleton />
                <NewsItemSkeleton />
                <NewsItemSkeleton />
              </>
            ) : news.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No recent news articles found for {ticker}
              </div>
            ) : (
              currentItems.map((item) => (
                <NewsItem key={item.id} news={item} />
              ))
            )}
          </div>
          
          {!isLoading && news.length > itemsPerPage && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const NewsItem = ({ news }: { news: any }) => {
  const formattedDate = news.publishedAt 
    ? new Date(news.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      })
    : 'Unknown date';
  
  return (
    <div className="border rounded-md p-4 hover:bg-muted/30 transition-colors">
      <div className="flex gap-4">
        {news.imageUrl && (
          <div className="hidden sm:block flex-shrink-0">
            <img 
              src={news.imageUrl} 
              alt={news.title}
              className="w-20 h-20 object-cover rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="flex-grow">
          <h3 className="font-medium line-clamp-2 mb-1">{news.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {news.description || news.content || 'No description available'}
          </p>
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              {news.source} • {formattedDate}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="text-xs flex items-center gap-1 p-0 h-auto"
            >
              <a href={news.url} target="_blank" rel="noopener noreferrer">
                Read <ExternalLink size={12} />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewsItemSkeleton = () => (
  <div className="border rounded-md p-4">
    <div className="flex gap-4">
      <div className="hidden sm:block flex-shrink-0">
        <Skeleton className="w-20 h-20 rounded-md" />
      </div>
      <div className="flex-grow">
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  </div>
);

export default NewsSection;
