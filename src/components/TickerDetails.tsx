import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowDown, ArrowUp, ChartLine, Database, TrendingDown, TrendingUp } from "lucide-react";
import { SentimentScore, TickerDetail, getTickerDetails } from "@/lib/mockData";
import { getCompanyOverview } from "@/lib/api/alphaVantage";

export const TickerDetails = ({ 
  ticker = "AAPL", 
  sentiment 
}: { 
  ticker?: string;
  sentiment?: SentimentScore;
}) => {
  const [companyData, setCompanyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fallback to mock data
  const mockDetails = getTickerDetails(ticker);
  
  // Attempt to fetch real data when ticker changes
  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoading(true);
      try {
        const data = await getCompanyOverview(ticker);
        if (data && Object.keys(data).length > 0) {
          setCompanyData(data);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanyData();
  }, [ticker]);
  
  // Use real data if available, otherwise fall back to mock data
  const details = companyData ? {
    ticker: companyData.Symbol || mockDetails.ticker,
    name: companyData.Name || mockDetails.name,
    sector: companyData.Sector || mockDetails.sector,
    ceo: companyData.CEO || mockDetails.ceo,
    headquarters: `${companyData.Address || ''}, ${companyData.City || ''}, ${companyData.Country || ''}` || mockDetails.headquarters,
    currentPrice: parseFloat(companyData.LatestPrice) || mockDetails.currentPrice,
    priceChange: parseFloat(companyData.ChangePercent) || mockDetails.priceChange,
    marketCap: companyData.MarketCapitalization ? 
      (parseInt(companyData.MarketCapitalization) >= 1000000000 ? 
        `$${(parseInt(companyData.MarketCapitalization) / 1000000000).toFixed(2)}B` : 
        `$${(parseInt(companyData.MarketCapitalization) / 1000000).toFixed(2)}M`) : 
      mockDetails.marketCap
  } : mockDetails;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h3 className="text-lg font-bold">{details.ticker}</h3>
            <span className="text-muted-foreground">{details.name}</span>
          </div>
          <div className={`flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            details.priceChange > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {details.priceChange > 0 ? <TrendingUp className="mr-1" size={12} /> : <TrendingDown className="mr-1" size={12} />}
            {details.priceChange > 0 ? "+" : ""}{details.priceChange.toFixed(2)}%
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
                <div className="text-xl font-bold">${details.currentPrice.toFixed(2)}</div>
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
                    value={companyData?.AnalystRating || "Buy"} 
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
