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
  // AI — builder-focused: local LLMs, agentic frameworks, model releases, performance
  { name: "Hugging Face Blog", url: "https://huggingface.co/blog/feed.xml", category: "ai" },
  { name: "Import AI", url: "https://importai.substack.com/feed", category: "ai" },
  { name: "Simon Willison", url: "https://simonwillison.net/atom/everything/", category: "ai" },
  { name: "Interconnects", url: "https://www.interconnects.ai/feed", category: "ai" },
  { name: "The Gradient", url: "https://thegradient.pub/rss/", category: "ai" },
  { name: "Ahead of AI", url: "https://magazine.sebastianraschka.com/feed", category: "ai" },
  { name: "LangChain Blog", url: "https://blog.langchain.dev/rss/", category: "ai" },
  { name: "LocalLLaMA (Reddit)", url: "https://www.reddit.com/r/LocalLLaMA/.rss", category: "ai" },
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
