
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { searchTickers } from "@/lib/api/alphaVantage";
import { TickerSuggestion } from "./types";

export function useTickerSearch(initialValue: string = "") {
  const [ticker, setTicker] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<TickerSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  // Update local state when initialValue changes
  useEffect(() => {
    if (initialValue) {
      setTicker(initialValue);
    }
  }, [initialValue]);

  // Debounced search for suggestions
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

  const handleClearSearch = () => {
    setTicker("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const toggleSuggestions = (show: boolean) => {
    setShowSuggestions(show);
  };

  return {
    ticker,
    setTicker,
    suggestions,
    isLoading,
    showSuggestions,
    handleChange,
    handleClearSearch,
    toggleSuggestions,
    setShowSuggestions
  };
}
