
// This file is kept for backward compatibility but is no longer actively used

// Import and export placeholder to maintain compatibility
// Uncomment to re-enable Alpha Vantage API
/*
export {
  searchTickers,
  getCompanyOverview,
  getDailyTimeSeries,
  getCompanyEarnings,
  getMarketStatus,
  formatTimeSeriesForChart,
  ALPHA_VANTAGE_API_KEY,
  BASE_URL,
} from './alphaVantage/index';
*/

// Mock exports to maintain code compatibility
export const searchTickers = () => Promise.resolve([]);
export const getCompanyOverview = () => Promise.resolve(null);
export const getDailyTimeSeries = () => Promise.resolve(null);
export const getCompanyEarnings = () => Promise.resolve(null);
export const getMarketStatus = () => Promise.resolve(null);
export const formatTimeSeriesForChart = () => [];
export const ALPHA_VANTAGE_API_KEY = "";
export const BASE_URL = "";
