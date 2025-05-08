
import { ALPHA_VANTAGE_API_KEY, BASE_URL, isApiLimited } from './config';
import { mockTickers } from './mockData';
import { generateMockTimeSeriesData, generateMockCompanyOverview } from './mockGenerators';
import { formatTimeSeriesForChart } from './formatters';

// Search for ticker symbols with enhanced information
export async function searchTickers(query: string) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    console.log(`Searching for tickers with query: ${query}`);
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
      console.warn("No matches found or API limit reached for ticker search");
      
      // Use mock data filtered by query
      return mockTickers
        .filter(ticker => 
          ticker.symbol.toLowerCase().includes(query.toLowerCase()) || 
          ticker.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 10);
    }
    
    // Map response to a simpler format with more fields
    const results = data.bestMatches.map((match: any) => ({
      symbol: match["1. symbol"],
      name: match["2. name"],
      type: match["3. type"],
      region: match["4. region"],
      currency: match["8. currency"],
    }));
    
    // For the first few results, try to get sector information
    const enhancedResults = await Promise.all(
      results.slice(0, 3).map(async (result: any) => {
        try {
          const overview = await getCompanyOverview(result.symbol);
          if (overview && !isApiLimited(overview)) {
            result.sector = overview.Sector || 'N/A';
            result.industry = overview.Industry || 'N/A';
          }
        } catch (err) {
          console.warn(`Could not fetch sector for ${result.symbol}`);
        }
        return result;
      })
    );
    
    // Combine the enhanced results with the rest
    return [...enhancedResults, ...results.slice(3)];
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

// Get company overview with expanded data
export async function getCompanyOverview(symbol: string) {
  try {
    console.log(`Fetching company overview for: ${symbol}`);
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
    console.log(`Fetching daily time series for: ${symbol}`);
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

// New function to get company earnings
export async function getCompanyEarnings(symbol: string) {
  try {
    console.log(`Fetching earnings for: ${symbol}`);
    const response = await fetch(
      `${BASE_URL}?function=EARNINGS&symbol=${encodeURIComponent(
        symbol
      )}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch company earnings");
    }
    
    const data = await response.json();
    
    // Check if we hit API limit
    if (isApiLimited(data)) {
      console.warn("API limit reached for company earnings");
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching company earnings:", error);
    return null;
  }
}

// Get global market status
export async function getMarketStatus() {
  try {
    console.log("Fetching market status");
    const response = await fetch(
      `${BASE_URL}?function=MARKET_STATUS&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch market status");
    }
    
    const data = await response.json();
    
    // Check if we hit API limit
    if (isApiLimited(data)) {
      console.warn("API limit reached for market status");
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching market status:", error);
    return null;
  }
}

export { formatTimeSeriesForChart };
