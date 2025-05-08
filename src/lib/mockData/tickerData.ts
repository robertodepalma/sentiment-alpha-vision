
import { TickerDetail } from "../types";

export const getTickerDetails = (ticker: string = "AAPL"): TickerDetail => {
  const tickers: Record<string, TickerDetail> = {
    "AAPL": {
      ticker: "AAPL",
      name: "Apple Inc.",
      sector: "Technology",
      ceo: "Tim Cook",
      headquarters: "Cupertino, CA",
      currentPrice: 175.84,
      priceChange: 2.34,
      marketCap: "$2.8T"
    },
    "MSFT": {
      ticker: "MSFT",
      name: "Microsoft Corporation",
      sector: "Technology",
      ceo: "Satya Nadella",
      headquarters: "Redmond, WA",
      currentPrice: 378.92,
      priceChange: -1.42,
      marketCap: "$2.82T"
    },
    "AMZN": {
      ticker: "AMZN",
      name: "Amazon.com Inc.",
      sector: "Consumer Cyclical",
      ceo: "Andy Jassy",
      headquarters: "Seattle, WA",
      currentPrice: 178.15,
      priceChange: 3.56,
      marketCap: "$1.85T"
    },
    "TSLA": {
      ticker: "TSLA",
      name: "Tesla, Inc.",
      sector: "Automotive",
      ceo: "Elon Musk",
      headquarters: "Austin, TX",
      currentPrice: 237.49,
      priceChange: -12.75,
      marketCap: "$753B"
    },
    "GOOGL": {
      ticker: "GOOGL",
      name: "Alphabet Inc.",
      sector: "Technology",
      ceo: "Sundar Pichai",
      headquarters: "Mountain View, CA",
      currentPrice: 156.28,
      priceChange: 0.74,
      marketCap: "$1.96T"
    }
  };
  
  return tickers[ticker] || tickers["AAPL"];
};
