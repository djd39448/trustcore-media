export interface FeedSource {
  name: string;
  url: string;
  category: "crypto" | "ai";
}

export const FEED_SOURCES: FeedSource[] = [
  // Crypto
  { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/", category: "crypto" },
  { name: "CoinTelegraph", url: "https://cointelegraph.com/rss", category: "crypto" },
  { name: "Decrypt", url: "https://decrypt.co/feed", category: "crypto" },
  { name: "The Block", url: "https://www.theblock.co/rss.xml", category: "crypto" },
  { name: "Bitcoin Magazine", url: "https://bitcoinmagazine.com/feed", category: "crypto" },
  { name: "CryptoSlate", url: "https://cryptoslate.com/feed/", category: "crypto" },
  { name: "Blockworks", url: "https://blockworks.co/feed", category: "crypto" },
  // AI
  { name: "MIT Tech Review AI", url: "https://www.technologyreview.com/feed/", category: "ai" },
  { name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/", category: "ai" },
  { name: "Import AI", url: "https://importai.substack.com/feed", category: "ai" },
  { name: "Hugging Face Blog", url: "https://huggingface.co/blog/feed.xml", category: "ai" },
  { name: "OpenAI Blog", url: "https://openai.com/blog/rss.xml", category: "ai" },
  { name: "The Batch (deeplearning.ai)", url: "https://www.deeplearning.ai/the-batch/feed/", category: "ai" },
  { name: "Ars Technica AI", url: "https://arstechnica.com/ai/feed/", category: "ai" },
];

export interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: "crypto" | "ai";
  snippet: string;
  image: string;
}
