import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowDown, ArrowUp, ChartLine, Database, TrendingDown, TrendingUp } from "lucide-react";
import { SentimentScore, TickerDetail, getTickerDetails } from "@/lib/mockData";
import { getCompanyOverview, getDailyTimeSeries } from "@/lib/api/alphaVantage";
import { getQuote, getCompanyProfile } from "@/lib/api/finnhub";

export const TickerDetails = ({ 
  ticker = "AAPL", 
  sentiment 
}: { 
  ticker?: string;
  sentiment?: SentimentScore;
}) => {
  const [companyData, setCompanyData] = useState<any>(null);
  const [finnhubData, setFinnhubData] = useState<any>(null);
  const [priceData, setPriceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get mock data for the current ticker
  const mockDetails = getTickerDetails(ticker);
  
  // Fetch real data when ticker changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log(`Fetching data for ticker: ${ticker}`);
        
        // Try Finnhub first
        const finnhubQuote = await getQuote(ticker);
        const finnhubProfile = await getCompanyProfile(ticker);
        
        if (finnhubProfile && Object.keys(finnhubProfile).length > 0) {
          console.log("Received Finnhub company data:", finnhubProfile);
          setFinnhubData(finnhubProfile);
          
          if (finnhubQuote) {
            console.log("Received Finnhub price data:", finnhubQuote);
            setPriceData({
              price: finnhubQuote.c,
              change: finnhubQuote.dp
            });
          }
        } else {
          // Fallback to Alpha Vantage if Finnhub fails
          console.log("Finnhub data unavailable, trying Alpha Vantage");
          
          // Fetch company overview
          const overview = await getCompanyOverview(ticker);
          if (overview && Object.keys(overview).length > 0 && !overview.Information) {
            console.log("Received Alpha Vantage company data:", overview);
            setCompanyData(overview);
          } else {
            console.log("Invalid company data received, falling back to mock data");
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
              console.log("Received Alpha Vantage price data:", latestData);
            }
          } else {
            console.log("Invalid price data received, falling back to mock data");
            setPriceData(null);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setCompanyData(null);
        setFinnhubData(null);
        setPriceData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [ticker]); // Re-run effect when ticker changes
  
  // Calculate percentage change
  const calculatePercentageChange = (current: number, previous: number): number => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };
  
  // Use real price data if available, otherwise fall back to mock data
  const currentPrice = priceData?.price || mockDetails.currentPrice;
  const priceChange = priceData?.change || mockDetails.priceChange;
  
  // Use company data based on available sources
  let details;
  
  if (finnhubData) {
    details = {
      ticker: finnhubData.ticker || mockDetails.ticker,
      name: finnhubData.name || mockDetails.name,
      sector: finnhubData.finnhubIndustry || mockDetails.sector,
      ceo: "N/A", // Finnhub doesn't provide CEO information
      headquarters: `${finnhubData.country || ""}` || mockDetails.headquarters,
      marketCap: finnhubData.marketCapitalization ? 
        (finnhubData.marketCapitalization >= 1000 ? 
          `$${(finnhubData.marketCapitalization / 1000).toFixed(2)}B` : 
          `$${finnhubData.marketCapitalization.toFixed(2)}M`) : 
        mockDetails.marketCap
    };
  } else if (companyData) {
    details = {
      ticker: companyData.Symbol || mockDetails.ticker,
      name: companyData.Name || mockDetails.name,
      sector: companyData.Sector || mockDetails.sector,
      ceo: companyData.CEO || mockDetails.ceo,
      headquarters: `${companyData.Address || ''}, ${companyData.City || ''}, ${companyData.Country || ''}` || mockDetails.headquarters,
      marketCap: companyData.MarketCapitalization ? 
        (parseInt(companyData.MarketCapitalization) >= 1000000000 ? 
          `$${(parseInt(companyData.MarketCapitalization) / 1000000000).toFixed(2)}B` : 
          `$${(parseInt(companyData.MarketCapitalization) / 1000000).toFixed(2)}M`) : 
        mockDetails.marketCap
    };
  } else {
    details = mockDetails;
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h3 className="text-lg font-bold">{details.ticker}</h3>
            <span className="text-muted-foreground">{details.name}</span>
          </div>
          <div className={`flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            priceChange > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {priceChange > 0 ? <TrendingUp className="mr-1" size={12} /> : <TrendingDown className="mr-1" size={12} />}
            {priceChange > 0 ? "+" : ""}{priceChange.toFixed(2)}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Current Price</div>
                <div className="text-xl font-bold">${currentPrice.toFixed(2)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="text-xl font-bold">{details.marketCap}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Company Details</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sector</span>
                    <span className="font-medium">{details.sector}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CEO</span>
                    <span className="font-medium">{details.ceo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Headquarters</span>
                    <span className="font-medium">{details.headquarters}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Key Indicators</div>
                <div className="flex flex-col gap-2">
                  <IndicatorItem 
                    icon={<ChartLine size={14} />}
                    label="Analyst Rating" 
                    value={finnhubData?.analystRating || companyData?.AnalystRating || "Buy"} 
                    trend="up" 
                  />
                  <IndicatorItem 
                    icon={<Database size={14} />}
                    label="Sentiment Score" 
                    value={sentiment?.score.toFixed(2) || "0.00"} 
                    trend={getSentimentTrend(sentiment?.score)} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const IndicatorItem = ({ 
  icon, 
  label, 
  value, 
  trend 
}: { 
  icon: React.ReactNode;
  label: string; 
  value: string; 
  trend?: "up" | "down" | "neutral"; 
}) => {
  let trendColors = "text-gray-500";
  let trendIcon = null;
  
  if (trend === "up") {
    trendColors = "text-green-600";
    trendIcon = <ArrowUp size={14} />;
  } else if (trend === "down") {
    trendColors = "text-red-600";
    trendIcon = <ArrowDown size={14} />;
  }
  
  return (
    <div className="flex items-center justify-between border rounded-md p-2">
      <div className="flex items-center gap-2">
        <div className="bg-muted p-1 rounded">
          {icon}
        </div>
        <span className="text-sm">{label}</span>
      </div>
      <div className={`flex items-center gap-1 font-medium ${trendColors}`}>
        {value}
        {trendIcon}
      </div>
    </div>
  );
};

const getSentimentTrend = (score?: number): "up" | "down" | "neutral" => {
  if (!score) return "neutral";
  if (score > 0.2) return "up";
  if (score < -0.2) return "down";
  return "neutral";
};
