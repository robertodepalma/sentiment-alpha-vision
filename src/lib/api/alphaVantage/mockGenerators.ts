
import { getSectorForTicker, getIndustryForTicker, getAnalystRating } from './mockData';

// Generate a mock time series data for a given ticker
export const generateMockTimeSeriesData = (symbol: string) => {
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
    "Time Series (Daily)": {} as Record<string, any>
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
export const generateMockCompanyOverview = (symbol: string) => {
  // Find ticker info if available in our mock data
  const companyName = `${symbol} Inc.`;
  
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
