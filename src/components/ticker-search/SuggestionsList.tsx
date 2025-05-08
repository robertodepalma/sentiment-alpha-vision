
import React from "react";
import { TickerSuggestion } from "./types";

interface SuggestionsListProps {
  suggestions: TickerSuggestion[];
  isLoading: boolean;
  showSuggestions: boolean;
  onSelect: (suggestion: TickerSuggestion) => void;
}

export const SuggestionsList = ({ 
  suggestions, 
  isLoading, 
  showSuggestions, 
  onSelect 
}: SuggestionsListProps) => {
  if (isLoading) {
    return (
      <div className="absolute w-full mt-1 bg-background border rounded-md shadow-md z-50 p-2 text-center">
        <p className="text-sm text-muted-foreground">Searching...</p>
      </div>
    );
  }

  if (!showSuggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute w-full mt-1 bg-background border rounded-md shadow-md z-50 max-h-60 overflow-y-auto">
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.symbol}
          className="px-4 py-2 cursor-pointer hover:bg-muted"
          onClick={() => onSelect(suggestion)}
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
  );
};
