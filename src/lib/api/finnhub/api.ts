import { FINNHUB_API_KEY, BASE_URL, isApiLimited } from './config';
import { FinnhubQuote, FinnhubCompanyProfile, FinnhubSentiment, FinnhubCandle } from './types';

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

/**
 * Get stock candles data
 * @param symbol Stock symbol
 * @param resolution Data resolution (e.g. 'D' for daily)
 * @param from Unix timestamp for start date
 * @param to Unix timestamp for end date
 */
export async function getStockCandles(
  symbol: string, 
  resolution: string = 'D',
  from: number = Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000),  // Default to 1 year ago
  to: number = Math.floor(Date.now() / 1000)  // Current timestamp in seconds
): Promise<FinnhubCandle | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    
    if (isApiLimited(data) || data.s === 'no_data') {
      console.error('Finnhub API limit reached or no data available:', data);
      return null;
    }
    
    return data as FinnhubCandle;
  } catch (error) {
    console.error('Error fetching stock candles from Finnhub:', error);
    return null;
  }
}
