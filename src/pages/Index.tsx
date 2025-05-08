
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { SentimentOverview } from "@/components/SentimentOverview";
import { SentimentChart } from "@/components/SentimentChart";
import { TechnicalAnalysisChart } from "@/components/TechnicalAnalysisChart";
import { TickerDetails } from "@/components/TickerDetails";
import { PlatformComparison } from "@/components/PlatformComparison";
import { EmotionHeatmap } from "@/components/EmotionHeatmap";
import { RecentPostsFeed } from "@/components/RecentPostsFeed";
import { TickerSearch } from "@/components/TickerSearch";
import { HypeScore } from "@/components/HypeScore";
import { getCurrentSentiment } from "@/lib/mockData";

const Index = () => {
  const [currentTicker, setCurrentTicker] = useState("AAPL");
  const sentiment = getCurrentSentiment(currentTicker);
  
  const handleTickerChange = (ticker: string) => {
    setCurrentTicker(ticker);
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Sentiment Dashboard</h2>
          </div>
          <div className="md:w-auto">
            <TickerSearch onSearch={handleTickerChange} />
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <SentimentOverview ticker={currentTicker} />
          </div>
          <div className="lg:col-span-1">
            <TickerDetails ticker={currentTicker} sentiment={sentiment} />
          </div>
          <div className="lg:col-span-1">
            <HypeScore ticker={currentTicker} />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <SentimentChart ticker={currentTicker} />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <TechnicalAnalysisChart ticker={currentTicker} />
          </div>
          <div className="lg:col-span-2">
            <PlatformComparison ticker={currentTicker} />
          </div>
          <div className="lg:col-span-1">
            <EmotionHeatmap ticker={currentTicker} />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <RecentPostsFeed ticker={currentTicker} />
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            This information is not to be considered financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
