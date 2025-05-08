
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowDown, ArrowUp, ChartLine, Database, TrendingDown, TrendingUp } from "lucide-react";
import { SentimentScore, TickerDetail } from "@/lib/types";
import { getCompanyOverview, getDailyTimeSeries, getCompanyEarnings } from "@/lib/api/alphaVantage";
import { getQuote, getCompanyProfile } from "@/lib/api/finnhub";
import { getTickerDetails } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

export const TickerDetails = ({ 
  ticker = "AAPL", 
  sentiment 
}: { 
  ticker?: string;
  sentiment?: SentimentScore;
}) => {
  const [companyData, setCompanyData] = useState<any>(null);
  const [finnhubData, setFinnhubData] = useState<any>(null);
  const [earningsData, setEarningsData] = useState<any>(null);
  const [priceData, setPriceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { toast } = useToast();
  
  // Get mock data for the current ticker
  const mockDetails = getTickerDetails(ticker);
  
  // Fetch real data when ticker changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log(`Fetching data for ticker: ${ticker}`);
        
        // Always try to get the most current price first from Finnhub
        const finnhubQuote = await getQuote(ticker);
        if (finnhubQuote && finnhubQuote.c) {
          console.log("Received Finnhub real-time price data:", finnhubQuote);
          setPriceData({
            price: finnhubQuote.c,
            change: finnhubQuote.dp,
            source: 'finnhub'
          });
          setLastUpdated(new Date());
          
          // Show notification about price update
          toast({
            title: `${ticker} Price Updated`,
            description: `Latest price: $${finnhubQuote.c.toFixed(2)}`,
            variant: "default"
          });
        }
        
        // Try alpha vantage for company overview
        const overview = await getCompanyOverview(ticker);
        if (overview && Object.keys(overview).length > 0 && !overview.Information) {
          console.log("Received Alpha Vantage company data:", overview);
          setCompanyData(overview);
          
          // Try to get earnings data
          const earnings = await getCompanyEarnings(ticker);
          if (earnings && earnings.quarterlyEarnings) {
            console.log("Received Alpha Vantage earnings data:", earnings);
            setEarningsData(earnings);
          }
        } else {
          console.log("Invalid company data from Alpha Vantage, trying Finnhub");
          
          // Try Finnhub as fallback for company data
          const finnhubProfile = await getCompanyProfile(ticker);
          
          if (finnhubProfile && Object.keys(finnhubProfile).length > 0) {
            console.log("Received Finnhub company data:", finnhubProfile);
            setFinnhubData(finnhubProfile);
            
            // If we didn't get price data from Finnhub earlier, try again
            if (!priceData || !priceData.price) {
              const retryQuote = await getQuote(ticker);
              if (retryQuote && retryQuote.c) {
                setPriceData({
                  price: retryQuote.c,
                  change: retryQuote.dp,
                  source: 'finnhub'
                });
                setLastUpdated(new Date());
              }
            }
          } else {
            console.log("No company data available, falling back to mock data");
            setCompanyData(null);
            setFinnhubData(null);
          }
        }
            
        // If still no price data, try Alpha Vantage time series as last resort
        if (!priceData || !priceData.price) {
          const timeSeriesData = await getDailyTimeSeries(ticker);
          if (timeSeriesData && timeSeriesData["Time Series (Daily)"]) {
            const timeSeriesEntries = Object.entries(timeSeriesData["Time Series (Daily)"]);
            if (timeSeriesEntries.length > 0) {
              // Get the most recent data point
              const latestData = timeSeriesEntries[0][1];
              const previousData = timeSeriesEntries[1]?.[1];
              
              const currentPrice = parseFloat(latestData["4. close"]);
              const previousPrice = previousData ? parseFloat(previousData["4. close"]) : parseFloat(latestData["1. open"]);
              
              setPriceData({
                price: currentPrice,
                change: calculatePercentageChange(currentPrice, previousPrice),
                source: 'alphavantage',
                date: timeSeriesEntries[0][0]
              });
              console.log("Received Alpha Vantage price data:", latestData);
              setLastUpdated(new Date());
            }
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
  
  if (companyData) {
    // Prefer Alpha Vantage data if available
    details = {
      ticker: companyData.Symbol || mockDetails.ticker,
      name: companyData.Name || mockDetails.name,
      sector: companyData.Sector || mockDetails.sector,
      industry: companyData.Industry || 'N/A',
      ceo: companyData.CEO || mockDetails.ceo,
      employees: companyData.FullTimeEmployees || 'N/A',
      headquarters: `${companyData.Address || ''}, ${companyData.City || ''}, ${companyData.Country || ''}` || mockDetails.headquarters,
      marketCap: companyData.MarketCapitalization ? 
        (parseInt(companyData.MarketCapitalization) >= 1000000000 ? 
          `$${(parseInt(companyData.MarketCapitalization) / 1000000000).toFixed(2)}B` : 
          `$${(parseInt(companyData.MarketCapitalization) / 1000000).toFixed(2)}M`) : 
        mockDetails.marketCap,
      peRatio: companyData.PERatio || 'N/A',
      dividendYield: companyData.DividendYield ? `${(parseFloat(companyData.DividendYield) * 100).toFixed(2)}%` : 'N/A',
      analystRating: companyData.AnalystRating || 'Buy'
    };
  } else if (finnhubData) {
    // Fallback to Finnhub data
    details = {
      ticker: finnhubData.ticker || mockDetails.ticker,
      name: finnhubData.name || mockDetails.name,
      sector: finnhubData.finnhubIndustry || mockDetails.sector,
      industry: finnhubData.finnhubIndustry || 'N/A',
      ceo: "N/A", // Finnhub doesn't provide CEO information
      employees: finnhubData.employeeTotal?.toString() || 'N/A',
      headquarters: `${finnhubData.country || ""}` || mockDetails.headquarters,
      marketCap: finnhubData.marketCapitalization ? 
        (finnhubData.marketCapitalization >= 1000 ? 
          `$${(finnhubData.marketCapitalization / 1000).toFixed(2)}B` : 
          `$${finnhubData.marketCapitalization.toFixed(2)}M`) : 
        mockDetails.marketCap,
      peRatio: finnhubData.peRatio?.toString() || 'N/A',
      dividendYield: finnhubData.dividendYield ? `${finnhubData.dividendYield.toFixed(2)}%` : 'N/A',
      analystRating: 'N/A'
    };
  } else {
    // Mock data as last resort
    details = {
      ...mockDetails,
      industry: 'N/A',
      employees: 'N/A',
      peRatio: 'N/A',
      dividendYield: 'N/A'
    };
  }
  
  // Get the latest quarterly earnings
  const latestEarnings = earningsData?.quarterlyEarnings?.[0];
  
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
                    <span>Industry</span>
                    <span className="font-medium">{details.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CEO</span>
                    <span className="font-medium">{details.ceo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Headquarters</span>
                    <span className="font-medium">{details.headquarters}</span>
                  </div>
                  {details.employees !== 'N/A' && (
                    <div className="flex justify-between">
                      <span>Employees</span>
                      <span className="font-medium">
                        {typeof details.employees === 'number' 
                          ? details.employees.toLocaleString() 
                          : details.employees}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Key Indicators</div>
                <div className="flex flex-col gap-2">
                  <IndicatorItem 
                    icon={<ChartLine size={14} />}
                    label="P/E Ratio" 
                    value={details.peRatio} 
                  />
                  <IndicatorItem 
                    icon={<Database size={14} />}
                    label="Dividend Yield" 
                    value={details.dividendYield} 
                  />
                  <IndicatorItem 
                    icon={<ChartLine size={14} />}
                    label="Sentiment" 
                    value={sentiment?.score.toFixed(2) || "0.00"} 
                    trend={getSentimentTrend(sentiment?.score)} 
                  />
                </div>
              </div>
            </div>
            
            {latestEarnings && (
              <div className="mt-4 border-t pt-3">
                <div className="text-sm text-muted-foreground mb-1">Latest Quarterly Earnings</div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Date</div>
                    <div>{latestEarnings.reportedDate}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">EPS</div>
                    <div className={parseFloat(latestEarnings.reportedEPS) >= parseFloat(latestEarnings.estimatedEPS) 
                      ? "text-green-600" : "text-red-600"}>
                      ${latestEarnings.reportedEPS}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Est. EPS</div>
                    <div>${latestEarnings.estimatedEPS}</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-4 text-xs text-muted-foreground flex justify-between items-center">
              <div>
                {priceData?.source === 'finnhub' ? "Price Source: Finnhub API (Real-time)" : 
                 priceData?.source === 'alphavantage' ? `Price Source: Alpha Vantage API (${priceData.date})` : 
                 "Using estimated price data"}
              </div>
              <div>
                Updated: {lastUpdated.toLocaleTimeString()}
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
  value: string | number; 
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
