
// Utility functions for formatting Alpha Vantage data

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
