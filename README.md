
# Hype Score Barometer

![Hype Score Barometer Logo](/lovable-uploads/fe021022-f2cf-4c88-88cd-44a5e08dac7e.png)

## Project Overview

Hype Score Barometer is a financial sentiment analysis dashboard that aggregates and visualizes market sentiment data across multiple platforms. The application allows users to search for stock tickers and analyze the sentiment surrounding those companies from various sources including news articles, social media, and financial platforms.

## Key Features

- **Ticker Search**: Easily search for companies by ticker symbol or company name
- **Real-time Stock Data**: View current price, daily change, and key indicators
- **Sentiment Analysis**: Analyze market sentiment from multiple sources
- **Technical Analysis**: Interactive charts with various technical indicators
- **Hype Score**: Proprietary sentiment score that weighs mentions based on follower count
- **Platform Comparison**: Compare sentiment across different platforms (Twitter, Reddit, StockTwits, News Media)
- **News Section**: Latest news articles related to the selected ticker

## Technology Stack

This project is built with:

- **React** - Frontend framework
- **TypeScript** - For type safety
- **Tailwind CSS** - For styling
- **shadcn/ui** - Component library
- **Recharts** - For data visualization
- **Vite** - Build tool
- **React Query** - For data fetching and state management

## API Integrations

The application integrates with several financial and social media APIs:

- **Alpha Vantage API** - For stock data, company information, and ticker search
- **Finnhub API** - For real-time quotes and sentiment analysis
- **NewsData.io API** - For news articles related to stocks
- **Reddit API** - For social media sentiment

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/hype-score-barometer.git

# 2. Navigate to the project directory
cd hype-score-barometer

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

### Environment Variables

To run this application with all features, you'll need to obtain API keys for the following services:

- Alpha Vantage API
- Finnhub API
- NewsData.io API
- Reddit API

Create a `.env` file in the root directory and add your API keys:

```
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
VITE_FINNHUB_API_KEY=your_finnhub_api_key
VITE_NEWSDATA_API_KEY=your_newsdata_api_key
VITE_REDDIT_CLIENT_ID=your_reddit_client_id
VITE_REDDIT_CLIENT_SECRET=your_reddit_client_secret
```

## Project Structure

```
src/
├── components/           # React components
│   ├── chart-components/ # Chart-related components
│   ├── posts/           # Post rendering components
│   ├── ticker-details/  # Ticker details components
│   ├── ticker-search/   # Search functionality
│   └── ui/              # UI components from shadcn
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and API clients
│   ├── api/             # API integration modules
│   │   ├── alphaVantage/ # Alpha Vantage API
│   │   ├── finnhub/     # Finnhub API
│   │   └── reddit/      # Reddit API
│   ├── mockData/        # Mock data for development
│   └── utils.ts         # Utility functions
└── pages/               # Application pages
```

## Components

### Main Components

- **TickerSearch**: Search for stock tickers and display suggestions
- **TickerDetails**: Display company and stock price information
- **SentimentOverview**: Overall sentiment analysis for a ticker
- **HypeScore**: Proprietary sentiment score calculation
- **PlatformComparison**: Compare sentiment across platforms
- **TechnicalAnalysisChart**: Interactive stock price charts with indicators
- **NewsSection**: Display relevant news articles
- **RecentPostsFeed**: Show recent social media posts about the ticker

## Development

### Code Principles

1. **Component-based architecture**: Each component is focused and reusable
2. **TypeScript for everything**: Strong typing for enhanced code quality
3. **Responsive design**: Works across all device sizes
4. **Error handling**: Graceful fallbacks when APIs fail
5. **Mocked data**: Development can continue even when APIs are unavailable

### Adding New Features

When adding new features:

1. Create focused components in appropriate directories
2. Add necessary types in corresponding types.ts files
3. Update existing components to integrate new features
4. Use mock data for testing during development

## Building for Production

```bash
npm run build
```

This command will generate a production build in the `dist` directory.

## Deployment

The application can be deployed to any static hosting service including:

- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Firebase Hosting

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

