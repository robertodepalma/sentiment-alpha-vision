
import React from "react";
import { CardContent, CardHeader } from "@/components/ui/card";
import { SentimentScore } from "@/lib/types";
import { TickerHeader } from "./TickerHeader";
import { PriceDisplay } from "./PriceDisplay";
import { CompanyDetails } from "./CompanyDetails";
import { KeyIndicators } from "./KeyIndicators";
import { DataSourceInfo } from "./DataSourceInfo";
import { LoadingSpinner } from "./LoadingSpinner";

interface TickerDetailsCardProps {
  details: any;
  priceData?: any;
  currentPrice: number;
  priceChange: number;
  isLoading: boolean;
  lastUpdated: Date;
  sentiment?: SentimentScore;
}

export const TickerDetailsCard = ({ 
  details, 
  priceData, 
  currentPrice, 
  priceChange, 
  isLoading, 
  lastUpdated, 
  sentiment 
}: TickerDetailsCardProps) => {
  return (
    <>
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
    </>
  );
};
