import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchTickers } from "@/lib/api/finnhub";
import { useToast } from "@/hooks/use-toast";

export function useTickerSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 1) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchTickers(debouncedQuery);
        if (data && data.result) {
          // Filter to only show stocks (not crypto, forex, etc)
          const stockResults = data.result.filter(
            (item: any) => item.type === "Common Stock"
          );
          setResults(stockResults.slice(0, 10)); // Limit to 10 results
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error searching tickers:", error);
        toast({
          title: "Search Error",
          description: "Failed to search for tickers. Please try again.",
          variant: "destructive",
        });
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectTicker = (ticker: string) => {
    setQuery(ticker);
    setShowSuggestions(false);
  };

  const toggleSuggestions = (show?: boolean) => {
    setShowSuggestions(show !== undefined ? show : !showSuggestions);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return {
    query,
    results,
    isLoading,
    showSuggestions,
    inputRef,
    handleInputChange,
    handleSelectTicker,
    toggleSuggestions,
    clearSearch,
  };
}
