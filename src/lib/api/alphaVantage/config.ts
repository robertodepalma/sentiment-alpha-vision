
// Configuration for Alpha Vantage API

// API key for Alpha Vantage
export const ALPHA_VANTAGE_API_KEY = "OOMEFL86TPY61NO5";

// Base URL for Alpha Vantage API
export const BASE_URL = "https://www.alphavantage.co/query";

// A function to check if the API response indicates a rate limit or error
export function isApiLimited(data: any): boolean {
  return !data || 
         data.Note !== undefined || 
         data.Information?.includes("API rate limit") ||
         data.Information?.includes("Thank you for using Alpha Vantage") ||
         Object.keys(data).length === 0 ||
         (data.bestMatches && data.bestMatches.length === 0);
}
