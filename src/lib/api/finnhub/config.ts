
// Configuration for Finnhub API

// API key for Finnhub
export const FINNHUB_API_KEY = "d0eheqpr01qkbclbdjr0d0eheqpr01qkbclbdjrg";

// Base URL for Finnhub API
export const BASE_URL = "https://finnhub.io/api/v1";

// A function to check if the API response indicates a rate limit or error
export function isApiLimited(data: any): boolean {
  return !data || 
         Object.keys(data).length === 0 || 
         data.error !== undefined;
}
