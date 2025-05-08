
import React, { forwardRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  ticker: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onClear: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  isLoading: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ ticker, onChange, onSearch, onClear, onKeyDown, onFocus, isLoading }, ref) => {
    return (
      <div className="flex w-80">
        <Input
          type="text"
          placeholder="Search ticker or company name..."
          value={ticker}
          onChange={onChange}
          className="rounded-r-none border-r-0"
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          ref={ref}
        />
        {ticker && (
          <Button 
            variant="ghost" 
            className="px-2 rounded-none border-y border-r-0" 
            onClick={onClear}
          >
            <X size={16} />
          </Button>
        )}
        <Button 
          onClick={onSearch} 
          className="rounded-l-none"
          variant="default"
          disabled={isLoading}
        >
          <Search size={16} />
        </Button>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
