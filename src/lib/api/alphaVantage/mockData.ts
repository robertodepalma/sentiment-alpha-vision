
// Mock data for when API limits are reached

// Extended mock data for tickers
export const mockTickers = [
  { symbol: "AAPL", name: "Apple Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "MSFT", name: "Microsoft Corporation", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "AMZN", name: "Amazon.com Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "GOOGL", name: "Alphabet Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "META", name: "Meta Platforms Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "TSLA", name: "Tesla Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "NVDA", name: "NVIDIA Corporation", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "JPM", name: "JPMorgan Chase & Co", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "V", name: "Visa Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "JNJ", name: "Johnson & Johnson", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "WMT", name: "Walmart Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "PG", name: "Procter & Gamble Co", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "MA", name: "Mastercard Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "DIS", name: "Walt Disney Co", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "NFLX", name: "Netflix Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "INTC", name: "Intel Corporation", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "AMD", name: "Advanced Micro Devices Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "CSCO", name: "Cisco Systems Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "ADBE", name: "Adobe Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "PYPL", name: "PayPal Holdings Inc", type: "Equity", region: "United States", currency: "USD" },
  // Additional mock tickers for better search results
  { symbol: "GOOG", name: "Alphabet Inc Class C", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "BRK.A", name: "Berkshire Hathaway Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc Class B", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "FB", name: "Meta Platforms Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "BABA", name: "Alibaba Group Holding Ltd", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "TSM", name: "Taiwan Semiconductor Manufacturing Co Ltd", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "KO", name: "Coca-Cola Co", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "PEP", name: "PepsiCo Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "NKE", name: "Nike Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "MCD", name: "McDonald's Corp", type: "Equity", region: "United States", currency: "USD" }
];

// Helper function to get a random item from an array
export const getRandomItem = (array: any[]): any => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to get a mock sector
export const getSectorForTicker = (symbol: string): string => {
  const sectors: Record<string, string> = {
    "AAPL": "Technology",
    "MSFT": "Technology",
    "AMZN": "Consumer Cyclical",
    "GOOGL": "Communication Services",
    "META": "Communication Services",
    "TSLA": "Consumer Cyclical",
    "NVDA": "Technology",
    "JPM": "Financial Services",
    "V": "Financial Services",
    "JNJ": "Healthcare",
    "WMT": "Consumer Defensive",
    "PG": "Consumer Defensive",
    "MA": "Financial Services",
    "DIS": "Communication Services",
    "NFLX": "Communication Services"
  };
  
  return sectors[symbol] || getRandomItem([
    "Technology", "Financial Services", "Healthcare", 
    "Consumer Cyclical", "Communication Services", 
    "Consumer Defensive", "Industrials", "Energy"
  ]);
};

// Helper function to get a mock industry
export const getIndustryForTicker = (symbol: string): string => {
  const industries: Record<string, string> = {
    "AAPL": "Consumer Electronics",
    "MSFT": "Software—Infrastructure",
    "AMZN": "Internet Retail",
    "GOOGL": "Internet Content & Information",
    "META": "Internet Content & Information",
    "TSLA": "Auto Manufacturers",
    "NVDA": "Semiconductors",
    "JPM": "Banks—Diversified",
    "V": "Credit Services",
    "JNJ": "Drug Manufacturers—General",
    "WMT": "Discount Stores",
    "PG": "Household & Personal Products",
    "MA": "Credit Services",
    "DIS": "Entertainment",
    "NFLX": "Entertainment"
  };
  
  return industries[symbol] || "Software—Application";
};

// Helper function to get an analyst rating
export const getAnalystRating = (): string => {
  const ratings = ["Strong Buy", "Buy", "Hold", "Sell", "Strong Sell"];
  const weights = [0.3, 0.4, 0.2, 0.07, 0.03]; // More likely to be Buy or Strong Buy
  
  let random = Math.random();
  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]) {
      return ratings[i];
    }
    random -= weights[i];
  }
  return ratings[1]; // Default to Buy if something goes wrong
};
