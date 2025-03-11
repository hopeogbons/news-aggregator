export const API_KEY = import.meta.env.VITE_THEGUARDIAN_KEY;

export const SEARCH_URL = "https://content.guardianapis.com/search";
export const SECTIONS_URL = "https://content.guardianapis.com/sections";

/**
 * To ensure relevance, we are manually curating news-related categories,
 * as The Guardian API encompasses a wide array of categories,
 * many of which fall outside the scope of news-related content.
 */
export const PREFERRED_CATEGORIES: string[] = [
  "news",
  "politics",
  "sport",
  "business",
  "technology",
  "environment",
  "science",
  "culture",
  "artanddesign",
  "film",
  "music",
  "books",
  "tv-and-radio",
  "global-development",
  "world",
  "uk-news",
  "us-news",
  "australia-news",
  "education",
  "society",
  "law",
  "media",
  "fashion",
  "lifeandstyle",
  "travel",
  "money",
  "healthcare-network",
  "inequality",
  "cities",
  "weather",
];
