
// Alpha Vantage API integration

// Using the provided API key
const ALPHA_VANTAGE_API_KEY = "YG8K64TYVLJKRD21"; 

// Base URL for Alpha Vantage API
const BASE_URL = "https://www.alphavantage.co/query";

// Extended mock data for when API limits are reached
const mockTickers = [
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
  { symbol: "PYPL", name: "PayPal Holdings Inc", type: "Equity", region: "United States", currency: "USD" }
];

// Mock time series data for testing
const mockTimeSeriesData = {
  "Meta Data": {
    "1. Information": "Daily Prices (open, high, low, close) and Volumes",
    "2. Symbol": "MOCK",
    "3. Last Refreshed": "2025-05-08",
    "4. Output Size": "Compact",
    "5. Time Zone": "US/Eastern"
  },
  "Time Series (Daily)": {
    "2025-05-08": {
      "1. open": "170.5000",
      "2. high": "172.3900",
      "3. low": "169.8300",
      "4. close": "172.0000",
      "5. volume": "12345678"
    },
    "2025-05-07": {
      "1. open": "169.2300",
      "2. high": "171.4500",
      "3. low": "168.7700",
      "4. close": "170.5000",
      "5. volume": "11234567"
    },
    "2025-05-06": {
      "1. open": "168.1200",
      "2. high": "170.2300",
      "3. low": "167.8800",
      "4. close": "169.2300",
      "5. volume": "10123456"
    }
  }
};

// Search for ticker symbols
export async function searchTickers(query: string): Promise<{
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
}[]> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
        query
      )}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch data from Alpha Vantage API");
    }
    
    const data = await response.json();
    
    // Check if we hit API limit or got empty results
    if (!data.bestMatches || data.bestMatches.length === 0 || data.Note || data.Information?.includes("API rate limit")) {
      console.warn("No matches found or API limit reached");
      
      // Use mock data filtered by query
      return mockTickers
        .filter(ticker => 
          ticker.symbol.toLowerCase().includes(query.toLowerCase()) || 
          ticker.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 10);
    }
    
    // Map response to a simpler format
    return data.bestMatches.map((match: any) => ({
      symbol: match["1. symbol"],
      name: match["2. name"],
      type: match["3. type"],
      region: match["4. region"],
      currency: match["8. currency"],
    }));
  } catch (error) {
    console.error("Error searching for tickers:", error);
    
    // Use mock data filtered by query on error
    return mockTickers
      .filter(ticker => 
        ticker.symbol.toLowerCase().includes(query.toLowerCase()) || 
        ticker.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);
  }
}

// Get company overview
export async function getCompanyOverview(symbol: string) {
  try {
    const response = await fetch(
      `${BASE_URL}?function=OVERVIEW&symbol=${encodeURIComponent(
        symbol
      )}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch company overview");
    }
    
    const data = await response.json();
    
    // Check if we hit API limit
    if (data.Note || data.Information?.includes("API rate limit")) {
      console.warn("API limit reached for company overview");
      return {
        Symbol: symbol,
        Name: mockTickers.find(t => t.symbol === symbol)?.name || "Company Name",
        Description: "Mock company description due to API rate limit.",
        Exchange: "NASDAQ",
        Industry: "Technology",
        Sector: "Technology",
        MarketCapitalization: "2000000000000"
      };
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching company overview:", error);
    
    // Return mock data on error
    return {
      Symbol: symbol,
      Name: mockTickers.find(t => t.symbol === symbol)?.name || "Company Name",
      Description: "Mock company description due to API error.",
      Exchange: "NASDAQ",
      Industry: "Technology",
      Sector: "Technology",
      MarketCapitalization: "2000000000000"
    };
  }
}

// Get time series data (daily)
export async function getDailyTimeSeries(symbol: string) {
  try {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(
        symbol
      )}&outputsize=compact&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch time series data");
    }
    
    const data = await response.json();
    
    // Check if we hit API limit
    if (data.Note || data.Information?.includes("API rate limit")) {
      console.warn("API limit reached for time series data");
      
      // Return mock time series data
      const mockData = JSON.parse(JSON.stringify(mockTimeSeriesData));
      mockData["Meta Data"]["2. Symbol"] = symbol;
      
      return mockData;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching time series data:", error);
    
    // Return mock time series data
    const mockData = JSON.parse(JSON.stringify(mockTimeSeriesData));
    mockData["Meta Data"]["2. Symbol"] = symbol;
    
    return mockData;
  }
}

// Format time series data for charts
export function formatTimeSeriesForChart(data: any) {
  if (!data || !data["Time Series (Daily)"]) {
    return [];
  }
  
  const timeSeries = data["Time Series (Daily)"];
  return Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
    date,
    open: parseFloat(values["1. open"]),
    high: parseFloat(values["2. high"]),
    low: parseFloat(values["3. low"]),
    close: parseFloat(values["4. close"]),
    volume: parseInt(values["5. volume"], 10),
  })).reverse(); // Reverse to get chronological order
}
