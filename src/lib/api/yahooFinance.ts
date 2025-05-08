
// Yahoo Finance API integration

// Base URL for Yahoo Finance API
const BASE_URL = "https://query1.finance.yahoo.com/v8/finance";

// Extended mock data for when API limits are reached or errors occur
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
  { symbol: "GOOG", name: "Alphabet Inc Class C", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "BRK-A", name: "Berkshire Hathaway Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "BRK-B", name: "Berkshire Hathaway Inc Class B", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "FB", name: "Meta Platforms Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "BABA", name: "Alibaba Group Holding Ltd", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "TSM", name: "Taiwan Semiconductor Manufacturing Co Ltd", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "KO", name: "Coca-Cola Co", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "PEP", name: "PepsiCo Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "NKE", name: "Nike Inc", type: "Equity", region: "United States", currency: "USD" },
  { symbol: "MCD", name: "McDonald's Corp", type: "Equity", region: "United States", currency: "USD" }
];

// Generate a mock time series data for a given ticker
const generateMockTimeSeriesData = (symbol: string) => {
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
  const today = new Date();
  let price = basePrice;
  const volatility = basePrice * 0.02; // 2% volatility
  const result = [];

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
    
    result.push({
      date: dateStr,
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(low.toFixed(4)),
      close: parseFloat(price.toFixed(4)),
      volume: volume
    });
  }
  
  return result.reverse(); // Return in chronological order
};

// Generate mock company overview data
const generateMockCompanyOverview = (symbol: string) => {
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
    symbol: symbol,
    name: companyName,
    description: `${companyName} is a leading company in its industry, providing innovative solutions to customers worldwide.`,
    exchange: "NASDAQ",
    currency: "USD",
    country: "USA",
    sector: getSectorForTicker(symbol),
    industry: getIndustryForTicker(symbol),
    address: "123 Corporate Way",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    CEO: `John Smith`,
    marketCap: marketCap,
    peRatio: (15 + Math.random() * 30).toFixed(2),
    dividendYield: (Math.random() * 3).toFixed(2),
    EPS: (2 + Math.random() * 10).toFixed(2),
    analystRating: getAnalystRating()
  };
};

// Helper function to get a mock sector
const getSectorForTicker = (symbol: string) => {
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
  
  return sectors[symbol as keyof typeof sectors] || getRandomItem([
    "Technology", "Financial Services", "Healthcare", 
    "Consumer Cyclical", "Communication Services", 
    "Consumer Defensive", "Industrials", "Energy"
  ]);
};

// Helper function to get a mock industry
const getIndustryForTicker = (symbol: string) => {
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
  
  return industries[symbol as keyof typeof industries] || "Software—Application";
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
const getRandomItem = (array: string[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Search for ticker symbols
export async function searchTickers(query: string) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`
    );
    
    if (!response.ok) {
      console.warn("Yahoo Finance API request failed:", response.statusText);
      throw new Error("Failed to fetch data from Yahoo Finance API");
    }
    
    const data = await response.json();
    
    if (!data.quotes || data.quotes.length === 0) {
      // Use mock data filtered by query if no results
      console.warn("No matches found in Yahoo Finance search");
      return mockTickers
        .filter(ticker => 
          ticker.symbol.toLowerCase().includes(query.toLowerCase()) || 
          ticker.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 10);
    }
    
    // Map response to a consistent format
    return data.quotes.map((quote: any) => ({
      symbol: quote.symbol,
      name: quote.shortname || quote.longname || `${quote.symbol} Stock`,
      type: "Equity",
      region: "United States",
      currency: quote.currency || "USD",
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
      `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=assetProfile,summaryDetail,price,defaultKeyStatistics`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch company overview");
    }
    
    const data = await response.json();
    
    if (data.error || !data.quoteSummary?.result?.[0]) {
      console.warn("Error or no data in Yahoo Finance company overview");
      return generateMockCompanyOverview(symbol);
    }
    
    const result = data.quoteSummary.result[0];
    const profile = result.assetProfile || {};
    const summary = result.summaryDetail || {};
    const price = result.price || {};
    const keyStats = result.defaultKeyStatistics || {};
    
    // Format the data to match our expected structure
    return {
      symbol: symbol,
      name: price.shortName || price.longName || `${symbol} Inc.`,
      description: profile.longBusinessSummary || "",
      exchange: price.exchangeName || "NASDAQ",
      currency: price.currency || "USD",
      country: profile.country || "USA",
      sector: profile.sector || getSectorForTicker(symbol),
      industry: profile.industry || getIndustryForTicker(symbol),
      address: profile.address1 || "123 Corporate Way",
      city: profile.city || "San Francisco",
      state: profile.state || "CA",
      zipCode: profile.zip || "94105",
      CEO: profile.companyOfficers?.[0]?.name || "John Smith",
      marketCap: summary.marketCap?.raw?.toString() || "0",
      peRatio: summary.trailingPE?.fmt || "0",
      dividendYield: summary.dividendYield?.fmt || "0",
      EPS: keyStats.trailingEps?.fmt || "0",
      analystRating: "Buy" // Yahoo Finance doesn't provide this directly
    };
  } catch (error) {
    console.error("Error fetching company overview:", error);
    
    // Return mock data on error
    return generateMockCompanyOverview(symbol);
  }
}

// Get time series data (daily)
export async function getDailyTimeSeries(symbol: string) {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=3mo`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch time series data");
    }
    
    const data = await response.json();
    
    if (data.error || !data.chart?.result?.[0]) {
      console.warn("Error or no data in Yahoo Finance time series");
      return generateMockTimeSeriesData(symbol);
    }
    
    const result = data.chart.result[0];
    const timestamps = result.timestamp || [];
    const quote = result.indicators.quote[0] || {};
    const close = quote.close || [];
    const open = quote.open || [];
    const high = quote.high || [];
    const low = quote.low || [];
    const volume = quote.volume || [];
    
    // Format the data for our charts
    const formattedData = timestamps.map((timestamp: number, i: number) => {
      const date = new Date(timestamp * 1000).toISOString().split('T')[0];
      return {
        date,
        open: open[i] || null,
        high: high[i] || null,
        low: low[i] || null,
        close: close[i] || null,
        volume: volume[i] || 0
      };
    })
    .filter((item: any) => item.close !== null); // Filter out any null data points
    
    return formattedData;
  } catch (error) {
    console.error("Error fetching time series data:", error);
    
    // Return mock time series data
    return generateMockTimeSeriesData(symbol);
  }
}

// Get latest price and change
export async function getLatestPrice(symbol: string): Promise<{price: number, change: number}> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch latest price data");
    }
    
    const data = await response.json();
    
    if (!data.quoteResponse?.result?.[0]) {
      throw new Error("No price data available");
    }
    
    const quote = data.quoteResponse.result[0];
    
    return {
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChangePercent || 0
    };
  } catch (error) {
    console.error("Error fetching latest price:", error);
    
    // Generate a realistic mock price based on the ticker
    const mockData = generateMockTimeSeriesData(symbol);
    const latestDay = mockData[mockData.length - 1];
    const previousDay = mockData[mockData.length - 2] || latestDay;
    
    // Calculate percentage change
    const change = ((latestDay.close - previousDay.close) / previousDay.close) * 100;
    
    return {
      price: latestDay.close,
      change: parseFloat(change.toFixed(2))
    };
  }
}
