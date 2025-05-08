
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TickerSearchProps, TickerSuggestion } from "./types";
import { SuggestionsList } from "./SuggestionsList";
import { SearchInput } from "./SearchInput";
import { useTickerSearch } from "./useTickerSearch";

export const TickerSearch = ({ 
  onSearch = (ticker: string) => {},
  className,
  initialValue = ""
}: TickerSearchProps) => {
  const {
    ticker,
    suggestions,
    isLoading,
    showSuggestions,
    handleChange,
    handleClearSearch,
    setShowSuggestions
  } = useTickerSearch(initialValue);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSuggestions]);

  const handleSearch = () => {
    if (ticker.trim()) {
      onSearch(ticker.toUpperCase());
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: TickerSuggestion) => {
    onSearch(suggestion.symbol);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (ticker.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <SearchInput
        ticker={ticker}
        onChange={handleChange}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        isLoading={isLoading}
        ref={inputRef}
      />
      
      <SuggestionsList
        suggestions={suggestions}
        isLoading={isLoading}
        showSuggestions={showSuggestions}
        onSelect={selectSuggestion}
      />
    </div>
  );
};
