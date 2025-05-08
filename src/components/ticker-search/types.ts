
export interface TickerSuggestion {
  symbol: string;
  name: string;
  type?: string;
  region?: string;
  currency?: string;
  sector?: string;
}

export interface TickerSearchProps {
  onSearch?: (ticker: string) => void;
  className?: string;
  initialValue?: string;
}
