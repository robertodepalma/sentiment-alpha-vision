
// NewsData.io API integration

// Using the provided API key
const NEWS_DATA_API_KEY = "pub_8575821bd94a48b458dc2ed52377a57589361";

// Base URL for NewsData.io API
const BASE_URL = "https://newsdata.io/api/1";

/**
 * Get news related to a specific ticker or company name
 */
export async function getTickerNews(query: string, limit: number = 10): Promise<any[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/news?apikey=${NEWS_DATA_API_KEY}&q=${encodeURIComponent(
        query
      )}&category=business&language=en&size=${limit}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch news from NewsData.io");
    }
    
    const data = await response.json();
    
    // Return empty array if no results or error
    if (!data.results || data.status !== "success") {
      console.warn("No news found or API limit reached");
      return [];
    }
    
    return data.results;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

/**
 * Format news for display
 */
export function formatNewsData(news: any[]) {
  return news.map((item) => ({
    id: item.article_id || Math.random().toString(36).substring(2),
    title: item.title,
    description: item.description,
    source: item.source_id,
    url: item.link,
    imageUrl: item.image_url,
    publishedAt: item.pubDate,
    content: item.content,
  }));
}
