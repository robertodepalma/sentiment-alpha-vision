
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SentimentScore } from "@/lib/types";
import { useTickerData } from "@/hooks/useTickerData";
import { TickerHeader } from "./ticker/TickerHeader";
import { CompanyDetails } from "./ticker/CompanyDetails";
import { KeyIndicators } from "./ticker/KeyIndicators";

export const TickerDetails = ({ 
  ticker = "AAPL", 
  sentiment 
}: { 
  ticker?: string;
  sentiment?: SentimentScore;
}) => {
  const { details, currentPrice, priceChange, isLoading } = useTickerData(ticker);
  
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
              <CompanyDetails 
                sector={details.sector}
                ceo={details.ceo}
                headquarters={details.headquarters}
              />
              <KeyIndicators 
                analystRating={details.analystRating}
                sentiment={sentiment}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
