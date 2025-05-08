
// Alpha Vantage API integration

// Note: In a production environment, you should use environment variables
// or a backend proxy to protect API keys
const ALPHA_VANTAGE_API_KEY = "demo"; // Replace with your Alpha Vantage API key

// Base URL for Alpha Vantage API
const BASE_URL = "https://www.alphavantage.co/query";

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
    
    // Return empty array if no matches or error
    if (!data.bestMatches) {
      console.warn("No matches found or API limit reached");
      return [];
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
    return [];
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
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching company overview:", error);
    return null;
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
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching time series data:", error);
    return null;
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
