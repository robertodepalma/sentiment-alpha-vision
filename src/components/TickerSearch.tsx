
import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { searchTickers } from "@/lib/api/alphaVantage";
import { useToast } from "@/hooks/use-toast";

interface TickerSuggestion {
  symbol: string;
  name: string;
  type?: string;
  region?: string;
  currency?: string;
  sector?: string;
}

export const TickerSearch = ({ 
  onSearch = (ticker: string) => {},
  className,
  initialValue = ""
}: { 
  onSearch?: (ticker: string) => void;
  className?: string;
  initialValue?: string;
}) => {
  const [ticker, setTicker] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<TickerSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local state when initialValue changes
  useEffect(() => {
    if (initialValue) {
      setTicker(initialValue);
    }
  }, [initialValue]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (ticker.trim()) {
      onSearch(ticker.toUpperCase());
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  // Function to clear the search input - fixed to take no arguments
  const handleClearSearch = () => {
    setTicker("");
    setSuggestions([]);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Debounce search to prevent API rate limiting
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (ticker.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchTickers(ticker);
        
        if (results && results.length > 0) {
          // Map results to the format we need with enhanced data
          const mappedResults = results.map(item => ({
            symbol: item.symbol,
            name: item.name,
            type: item.type,
            region: item.region,
            currency: item.currency,
            sector: item.sector || 'N/A'
          }));
          
          setSuggestions(mappedResults);
          setShowSuggestions(mappedResults.length > 0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching ticker suggestions:", error);
        toast({
          title: "API Error",
          description: "Could not fetch ticker suggestions. Using fallback data.",
          variant: "destructive"
        });
        
        // Make sure we clear suggestions if there's an error
        setSuggestions([]);
        setShowSuggestions(false);
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
    
    // Show suggestions when typing
    if (value.trim().length >= 2) {
      setShowSuggestions(true);
    }
  };

  const selectSuggestion = (suggestion: TickerSuggestion) => {
    setTicker(suggestion.symbol);
    onSearch(suggestion.symbol);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
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
          onFocus={() => {
            if (ticker.trim().length >= 2 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          ref={inputRef}
        />
        {ticker && (
          <Button 
            variant="ghost" 
            className="px-2 rounded-none border-y border-r-0" 
            onClick={handleClearSearch}
          >
            <X size={16} />
          </Button>
        )}
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
      
      {!isLoading && showSuggestions && suggestions.length > 0 && (
        <div className="absolute w-full mt-1 bg-background border rounded-md shadow-md z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.symbol}
              className="px-4 py-2 cursor-pointer hover:bg-muted"
              onClick={() => selectSuggestion(suggestion)}
            >
              <div className="flex justify-between">
                <span className="font-medium">{suggestion.symbol}</span>
                <span className="text-xs bg-slate-100 rounded px-1 py-0.5 text-slate-600">
                  {suggestion.region || 'US'} {suggestion.currency && `• ${suggestion.currency}`}
                </span>
              </div>
              <div className="text-sm text-muted-foreground truncate">{suggestion.name}</div>
              {suggestion.type && (
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">{suggestion.type}</span>
                  {suggestion.sector && suggestion.sector !== 'N/A' && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{suggestion.sector}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
