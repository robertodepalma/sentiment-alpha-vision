
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { SentimentScore } from "@/lib/types";
import { useTickerDetails } from "./ticker-details/useTickerDetails";
import { TickerDetailsCard } from "./ticker-details/TickerDetailsCard";

export const TickerDetails = ({ 
  ticker = "AAPL", 
  sentiment 
}: { 
  ticker?: string;
  sentiment?: SentimentScore;
}) => {
  const { 
    details, 
    priceData, 
    currentPrice, 
    priceChange, 
    isLoading, 
    lastUpdated 
  } = useTickerDetails(ticker);
  
  return (
    <Card className="w-full">
      <TickerDetailsCard 
        details={details}
        priceData={priceData}
        currentPrice={currentPrice}
        priceChange={priceChange}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
        sentiment={sentiment}
      />
    </Card>
  );
};
