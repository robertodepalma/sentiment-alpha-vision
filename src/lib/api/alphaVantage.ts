
// This file is kept for backward compatibility
// It re-exports all functions from the alphaVantage directory

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
