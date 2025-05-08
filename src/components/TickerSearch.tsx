
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const TickerSearch = ({ 
  onSearch = (ticker: string) => {},
  className 
}: { 
  onSearch?: (ticker: string) => void;
  className?: string;
}) => {
  const [ticker, setTicker] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const popularTickers = ["AAPL", "MSFT", "AMZN", "TSLA", "GOOGL", "META", "NVDA"];
  
  const handleSearch = () => {
    if (ticker.trim()) {
      onSearch(ticker.toUpperCase());
      setSuggestions([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setTicker(value);
    
    if (value.length > 0) {
      const filtered = popularTickers.filter(t => 
        t.startsWith(value)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setTicker(suggestion);
    onSearch(suggestion);
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
        >
          <Search size={16} />
        </Button>
      </div>
      
      {suggestions.length > 0 && (
        <div className="absolute w-full mt-1 bg-background border rounded-md shadow-md z-50">
          {suggestions.map(suggestion => (
            <div
              key={suggestion}
              className="px-4 py-2 cursor-pointer hover:bg-muted"
              onClick={() => selectSuggestion(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
