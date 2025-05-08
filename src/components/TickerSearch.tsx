
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { searchTickers } from "@/lib/api/alphaVantage";
import { useToast } from "@/hooks/use-toast";

interface TickerSuggestion {
  symbol: string;
  name: string;
}

export const TickerSearch = ({ 
  onSearch = (ticker: string) => {},
  className 
}: { 
  onSearch?: (ticker: string) => void;
  className?: string;
}) => {
  const [ticker, setTicker] = useState("");
  const [suggestions, setSuggestions] = useState<TickerSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (ticker.trim()) {
      onSearch(ticker.toUpperCase());
      setSuggestions([]);
    }
  };

  // Debounce search to prevent API rate limiting
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (ticker.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchTickers(ticker);
        
        // Map results to the format we need
        const mappedResults = results.map(item => ({
          symbol: item.symbol,
          name: item.name
        }));
        
        setSuggestions(mappedResults);
      } catch (error) {
        console.error("Error fetching ticker suggestions:", error);
        toast({
          title: "API Error",
          description: "Could not fetch ticker suggestions. Using fallback data.",
          variant: "destructive"
        });
        
        // Fallback to popular tickers
        const popularTickers = ["AAPL", "MSFT", "AMZN", "TSLA", "GOOGL", "META", "NVDA"];
        const filteredTickers = popularTickers
          .filter(t => t.startsWith(ticker.toUpperCase()))
          .map(t => ({ symbol: t, name: t }));
        setSuggestions(filteredTickers);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [ticker, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTicker(value);
  };

  const selectSuggestion = (suggestion: TickerSuggestion) => {
    setTicker(suggestion.symbol);
    onSearch(suggestion.symbol);
    setSuggestions([]);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex w-80">
        <Input
          type="text"
          placeholder="Search ticker or company name..."
          value={ticker}
          onChange={handleChange}
          className="rounded-r-none border-r-0"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <Button 
          onClick={handleSearch} 
          className="rounded-l-none"
          variant="default"
          disabled={isLoading}
        >
          <Search size={16} />
        </Button>
      </div>
      
      {isLoading && (
        <div className="absolute w-full mt-1 bg-background border rounded-md shadow-md z-50 p-2 text-center">
          <p className="text-sm text-muted-foreground">Searching...</p>
        </div>
      )}
      
      {!isLoading && suggestions.length > 0 && (
        <div className="absolute w-full mt-1 bg-background border rounded-md shadow-md z-50">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.symbol}
              className="px-4 py-2 cursor-pointer hover:bg-muted"
              onClick={() => selectSuggestion(suggestion)}
            >
              <div className="font-medium">{suggestion.symbol}</div>
              <div className="text-sm text-muted-foreground truncate">{suggestion.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
