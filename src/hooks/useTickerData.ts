
import { useState, useEffect } from "react";
import { getTickerDetails } from "@/lib/mockData";
import { getCompanyOverview, getDailyTimeSeries } from "@/lib/api/alphaVantage";
import { calculatePercentageChange, formatMarketCap } from "@/lib/utils/tickerUtils";

export const useTickerData = (ticker: string) => {
  const [companyData, setCompanyData] = useState<any>(null);
  const [priceData, setPriceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get mock data for the current ticker
  const mockDetails = getTickerDetails(ticker);
  
  // Fetch real data when ticker changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch company overview
        const overview = await getCompanyOverview(ticker);
        if (overview && Object.keys(overview).length > 0 && !overview.Information) {
          setCompanyData(overview);
        } else {
          setCompanyData(null);
        }
        
        // Fetch latest price data
        const timeSeriesData = await getDailyTimeSeries(ticker);
        if (timeSeriesData && timeSeriesData["Time Series (Daily)"]) {
          const timeSeriesEntries = Object.entries(timeSeriesData["Time Series (Daily)"]);
          if (timeSeriesEntries.length > 0) {
            // Get the most recent data point
            const latestData = timeSeriesEntries[0][1];
            setPriceData({
              price: parseFloat(latestData["4. close"]),
              change: calculatePercentageChange(
                parseFloat(latestData["4. close"]),
                parseFloat(timeSeriesEntries[1]?.[1]["4. close"] || latestData["1. open"])
              )
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setCompanyData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [ticker]);
  
  // Use real price data if available, otherwise fall back to mock data
  const currentPrice = priceData?.price || mockDetails.currentPrice;
  const priceChange = priceData?.change || mockDetails.priceChange;
  
  // Use real company data if available, otherwise fall back to mock data
  const details = companyData ? {
    ticker: companyData.Symbol || mockDetails.ticker,
    name: companyData.Name || mockDetails.name,
    sector: companyData.Sector || mockDetails.sector,
    ceo: companyData.CEO || mockDetails.ceo,
    headquarters: `${companyData.Address || ''}, ${companyData.City || ''}, ${companyData.Country || ''}` || mockDetails.headquarters,
    marketCap: companyData.MarketCapitalization ? 
      formatMarketCap(companyData.MarketCapitalization) : 
      mockDetails.marketCap,
    analystRating: companyData?.AnalystRating || "Buy"
  } : {
    ...mockDetails,
    analystRating: "Buy"
  };
  
  return {
    details,
    currentPrice,
    priceChange,
    isLoading
  };
};
