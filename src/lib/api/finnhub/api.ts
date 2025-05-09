
import { FINNHUB_API_KEY, BASE_URL, isApiLimited } from './config';
import { FinnhubQuote, FinnhubCompanyProfile, FinnhubSentiment } from './types';

/**
 * Get real-time quote data for a symbol
 */
export async function getQuote(symbol: string): Promise<FinnhubQuote | null> {
  try {
    const response = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    const data = await response.json();
    
    if (isApiLimited(data)) {
      console.error('Finnhub API limit reached or error occurred:', data);
      return null;
    }
    
    return data as FinnhubQuote;
  } catch (error) {
    console.error('Error fetching quote from Finnhub:', error);
    return null;
  }
}

/**
 * Get company profile data
 */
export async function getCompanyProfile(symbol: string): Promise<FinnhubCompanyProfile | null> {
  try {
    const response = await fetch(`${BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    const data = await response.json();
    
    if (isApiLimited(data)) {
      console.error('Finnhub API limit reached or error occurred:', data);
      return null;
    }
    
    return data as FinnhubCompanyProfile;
  } catch (error) {
    console.error('Error fetching company profile from Finnhub:', error);
    return null;
  }
}

/**
 * Get news sentiment data for a company
 */
export async function getNewsSentiment(symbol: string): Promise<FinnhubSentiment | null> {
  try {
    const response = await fetch(`${BASE_URL}/news-sentiment?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    const data = await response.json();
    
    if (isApiLimited(data)) {
      console.error('Finnhub API limit reached or error occurred:', data);
      return null;
    }
    
    return data as FinnhubSentiment;
  } catch (error) {
    console.error('Error fetching news sentiment from Finnhub:', error);
    return null;
  }
}

/**
 * Search for ticker symbols
 */
export async function searchTickers(query: string) {
  try {
    const response = await fetch(`${BASE_URL}/search?q=${query}&token=${FINNHUB_API_KEY}`);
    const data = await response.json();
    
    if (isApiLimited(data)) {
      console.error('Finnhub API limit reached or error occurred:', data);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error searching tickers from Finnhub:', error);
    return null;
  }
}
