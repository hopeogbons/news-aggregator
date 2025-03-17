export const API_KEY: string = import.meta.env.VITE_NEWYORKTIMES_KEY;

export const NEWYORKTIMES_SEARCH_V2: string =
  "https://api.nytimes.com/svc/search/v2/articlesearch.json";

export const NEWYORKTIMES_SECTION_V3: string =
  "https://api.nytimes.com/svc/news/v3/content/section-list.json";

export const newsApiCategoriesMap: Record<string, string> = {
  business: "Business",
  entertainment: "Entertainment",
  general: "General",
  health: "Health",
  science: "Science",
  sports: "Sports",
  technology: "Technology",
};
