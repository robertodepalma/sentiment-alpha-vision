// Alpha Vantage API integration

// Using the provided API key
const ALPHA_VANTAGE_API_KEY = "A2HMIC25UU23ZN2B"; 

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

// Generate a mock time series data for a given ticker
const generateMockTimeSeriesData = (symbol) => {
  // Generate a base price that's somewhat realistic for the ticker
  let basePrice;
  switch(symbol) {
    case "AAPL": basePrice = 170; break;
    case "MSFT": basePrice = 320; break;
    case "AMZN": basePrice = 180; break;
    case "GOOGL": basePrice = 140; break;
    case "META": basePrice = 330; break;
    case "TSLA": basePrice = 215; break;
    case "NVDA": basePrice = 420; break;
    case "JPM": basePrice = 160; break;
    case "V": basePrice = 240; break;
    case "JNJ": basePrice = 150; break;
    case "WMT": basePrice = 60; break;
    case "PG": basePrice = 155; break;
    case "MA": basePrice = 430; break;
    case "DIS": basePrice = 105; break;
    case "NFLX": basePrice = 520; break;
    case "INTC": basePrice = 35; break;
    case "AMD": basePrice = 95; break;
    case "CSCO": basePrice = 48; break;
    case "ADBE": basePrice = 435; break;
    case "PYPL": basePrice = 75; break;
    default: basePrice = 100 + (Math.random() * 200); // Random price for unknown tickers
  }

  // Create a realistic price movement
  const data = {
    "Meta Data": {
      "1. Information": "Daily Prices (open, high, low, close) and Volumes",
      "2. Symbol": symbol,
      "3. Last Refreshed": new Date().toISOString().split('T')[0],
      "4. Output Size": "Compact",
      "5. Time Zone": "US/Eastern"
    },
    "Time Series (Daily)": {}
  };

  const today = new Date();
  let price = basePrice;
  const volatility = basePrice * 0.02; // 2% volatility

  // Generate 90 days of data
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Realistic price movement with some randomness
    const change = (Math.random() - 0.5) * volatility;
    if (i > 0) {
      price = Math.max(price + change, price * 0.7); // Ensure price doesn't drop by more than 30%
    }
    
    // Small variations for open, high, low
    const open = price - (Math.random() * volatility * 0.5);
    const high = Math.max(price, open) + (Math.random() * volatility * 0.3);
    const low = Math.min(price, open) - (Math.random() * volatility * 0.3);
    
    // Random volume based on price
    const volume = Math.round(1000000 + Math.random() * 10000000);
    
    data["Time Series (Daily)"][dateStr] = {
      "1. open": open.toFixed(4),
      "2. high": high.toFixed(4),
      "3. low": low.toFixed(4),
      "4. close": price.toFixed(4),
      "5. volume": volume.toString()
    };
  }
  
  return data;
};

// Generate mock company overview data
const generateMockCompanyOverview = (symbol) => {
  // Find ticker info if available in our mock data
  const matchingTicker = mockTickers.find(ticker => ticker.symbol === symbol);
  const companyName = matchingTicker ? matchingTicker.name : `${symbol} Inc.`;
  
  // Generate a base market cap that's somewhat realistic for the ticker
  let marketCap;
  switch(symbol) {
    case "AAPL": marketCap = "3000000000000"; break; // 3T
    case "MSFT": marketCap = "3100000000000"; break; 
    case "AMZN": marketCap = "1800000000000"; break;
    case "GOOGL": marketCap = "1950000000000"; break;
    case "META": marketCap = "1200000000000"; break;
    case "TSLA": marketCap = "850000000000"; break;
    case "NVDA": marketCap = "2200000000000"; break;
    case "JPM": marketCap = "500000000000"; break;
    case "V": marketCap = "550000000000"; break;
    case "JNJ": marketCap = "400000000000"; break;
    case "WMT": marketCap = "450000000000"; break;
    case "PG": marketCap = "380000000000"; break;
    case "MA": marketCap = "430000000000"; break;
    case "DIS": marketCap = "200000000000"; break;
    case "NFLX": marketCap = "250000000000"; break;
    default: marketCap = Math.round((50000000000 + Math.random() * 200000000000)).toString();
  }
  
  return {
    Symbol: symbol,
    Name: companyName,
    Description: `${companyName} is a leading company in its industry, providing innovative solutions to customers worldwide.`,
    Exchange: "NASDAQ",
    Currency: "USD",
    Country: "USA",
    Sector: getSectorForTicker(symbol),
    Industry: getIndustryForTicker(symbol),
    Address: "123 Corporate Way",
    City: "San Francisco",
    State: "CA",
    ZipCode: "94105",
    CEO: `John Smith`,
    MarketCapitalization: marketCap,
    PERatio: (15 + Math.random() * 30).toFixed(2),
    DividendYield: (Math.random() * 3).toFixed(2),
    EPS: (2 + Math.random() * 10).toFixed(2),
    AnalystRating: getAnalystRating()
  };
};

// Helper function to get a mock sector
const getSectorForTicker = (symbol) => {
  const sectors = {
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
const getIndustryForTicker = (symbol) => {
  const industries = {
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
const getAnalystRating = () => {
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

// Helper function to get a random item from an array
const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// A function to check if the API response indicates a rate limit or error
function isApiLimited(data) {
  return !data || 
         data.Note !== undefined || 
         data.Information?.includes("API rate limit") ||
         data.Information?.includes("Thank you for using Alpha Vantage") ||
         Object.keys(data).length === 0 ||
         (data.bestMatches && data.bestMatches.length === 0);
}

// Search for ticker symbols
export async function searchTickers(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
        query
      )}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      console.warn("API request failed:", response.statusText);
      throw new Error("Failed to fetch data from Alpha Vantage API");
    }
    
    const data = await response.json();
    
    // Check if we hit API limit or got empty results
    if (isApiLimited(data)) {
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
    return data.bestMatches.map((match) => ({
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
export async function getCompanyOverview(symbol) {
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
    if (isApiLimited(data)) {
      console.warn("API limit reached for company overview");
      return generateMockCompanyOverview(symbol);
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching company overview:", error);
    
    // Return mock data on error
    return generateMockCompanyOverview(symbol);
  }
}

// Get time series data (daily)
export async function getDailyTimeSeries(symbol) {
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
    if (isApiLimited(data)) {
      console.warn("API limit reached for time series data");
      
      // Return mock time series data
      return generateMockTimeSeriesData(symbol);
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching time series data:", error);
    
    // Return mock time series data
    return generateMockTimeSeriesData(symbol);
  }
}

// Format time series data for charts
export function formatTimeSeriesForChart(data) {
  if (!data || !data["Time Series (Daily)"]) {
    return [];
  }
  
  const timeSeries = data["Time Series (Daily)"];
  return Object.entries(timeSeries).map(([date, values]) => ({
    date,
    open: parseFloat(values["1. open"]),
    high: parseFloat(values["2. high"]),
    low: parseFloat(values["3. low"]),
    close: parseFloat(values["4. close"]),
    volume: parseInt(values["5. volume"], 10),
  })).reverse(); // Reverse to get chronological order
}
