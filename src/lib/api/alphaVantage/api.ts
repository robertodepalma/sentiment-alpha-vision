
import { ALPHA_VANTAGE_API_KEY, BASE_URL, isApiLimited } from './config';
import { mockTickers } from './mockData';
import { generateMockTimeSeriesData, generateMockCompanyOverview } from './mockGenerators';
import { formatTimeSeriesForChart } from './formatters';

// Search for ticker symbols
export async function searchTickers(query: string) {
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

export { formatTimeSeriesForChart };
