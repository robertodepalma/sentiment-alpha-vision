
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SentimentScore } from "@/lib/types";
import { getQuote, getCompanyProfile } from "@/lib/api/finnhub";
import { getTickerDetails } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { TickerHeader } from "./ticker-details/TickerHeader";
import { PriceDisplay } from "./ticker-details/PriceDisplay";
import { CompanyDetails } from "./ticker-details/CompanyDetails";
import { KeyIndicators } from "./ticker-details/KeyIndicators";
import { DataSourceInfo } from "./ticker-details/DataSourceInfo";
import { LoadingSpinner } from "./ticker-details/LoadingSpinner";

export const TickerDetails = ({ 
  ticker = "AAPL", 
  sentiment 
}: { 
  ticker?: string;
  sentiment?: SentimentScore;
}) => {
  const [finnhubData, setFinnhubData] = useState<any>(null);
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
        
        // Get real-time price from Finnhub
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
        
        // Try Finnhub for company data
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
          setFinnhubData(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setFinnhubData(null);
        setPriceData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [ticker]); // Re-run effect when ticker changes
  
  // Use real price data if available, otherwise fall back to mock data
  const currentPrice = priceData?.price || mockDetails.currentPrice;
  const priceChange = priceData?.change || mockDetails.priceChange;
  
  // Use company data based on available sources
  let details;
  
  if (finnhubData) {
    // Use Finnhub data
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
    // Mock data as fallback
    details = {
      ...mockDetails,
      industry: 'N/A',
      employees: 'N/A',
      peRatio: 'N/A',
      dividendYield: 'N/A'
    };
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <TickerHeader 
          ticker={details.ticker} 
          name={details.name} 
          priceChange={priceChange} 
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <PriceDisplay currentPrice={currentPrice} marketCap={details.marketCap} />
            
            <div className="grid grid-cols-2 gap-4">
              <CompanyDetails 
                sector={details.sector}
                industry={details.industry}
                ceo={details.ceo}
                headquarters={details.headquarters}
                employees={details.employees}
              />
              <KeyIndicators 
                peRatio={details.peRatio}
                dividendYield={details.dividendYield}
                sentiment={sentiment}
              />
            </div>
            
            <DataSourceInfo 
              priceSource={priceData?.source}
              lastUpdated={lastUpdated}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
