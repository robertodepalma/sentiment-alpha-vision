
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
    query,
    results,
    isLoading,
    showSuggestions,
    inputRef,
    handleInputChange,
    handleSelectTicker,
    toggleSuggestions,
    clearSearch
  } = useTickerSearch();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        toggleSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [toggleSuggestions]);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.toUpperCase());
      toggleSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: TickerSuggestion) => {
    onSearch(suggestion.symbol);
    toggleSuggestions(false);
  };

  const handleFocus = () => {
    if (query.trim().length >= 2 && results.length > 0) {
      toggleSuggestions(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <SearchInput
        ticker={query}
        onChange={handleInputChange}
        onSearch={handleSearch}
        onClear={clearSearch}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        isLoading={isLoading}
        ref={inputRef}
      />
      
      <SuggestionsList
        suggestions={results}
        isLoading={isLoading}
        showSuggestions={showSuggestions}
        onSelect={selectSuggestion}
      />
    </div>
  );
};
